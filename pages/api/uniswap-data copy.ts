import { NextApiRequest, NextApiResponse } from 'next';
import Web3 from 'web3';
import { sleep } from "@/utils/sleep"
import { addresses } from "@/constant/address";

const MAX_RETRIES = 5;
const INITIAL_BACKOFF = 1000; // 1 second

const POOL_ABI = [
    {
      anonymous: false,
      inputs: [
        { indexed: true, internalType: 'address', name: 'sender', type: 'address' },
        { indexed: true, internalType: 'address', name: 'recipient', type: 'address' },
        { indexed: false, internalType: 'int256', name: 'amount0', type: 'int256' },
        { indexed: false, internalType: 'int256', name: 'amount1', type: 'int256' },
        { indexed: false, internalType: 'uint160', name: 'sqrtPriceX96', type: 'uint160' },
        { indexed: false, internalType: 'uint128', name: 'liquidity', type: 'uint128' },
        { indexed: false, internalType: 'int24', name: 'tick', type: 'int24' }
      ],
      name: 'Swap',
      type: 'event'
    },
    {
      inputs: [],
      name: "slot0",
      outputs: [
        { internalType: "uint160", name: "sqrtPriceX96", type: "uint160" },
        { internalType: "int24", name: "tick", type: "int24" },
        { internalType: "uint16", name: "observationIndex", type: "uint16" },
        { internalType: "uint16", name: "observationCardinality", type: "uint16" },
        { internalType: "uint16", name: "observationCardinalityNext", type: "uint16" },
        { internalType: "uint8", name: "feeProtocol", type: "uint8" },
        { internalType: "bool", name: "unlocked", type: "bool" }
      ],
      stateMutability: "view",
      type: "function"
    }
  ] as const;

interface Trade {
    transactionHash: string;
    blockNumber: number;
    timestamp: number;
    amount0: string;
    amount1: string;
    type: 'buy' | 'sell';
    usdValue: string;
    pricePerCGT: string;
    tradeSize: 'Small' | 'Medium' | 'Large';
    priceImpact: string;
    chain: 'ETH' | 'BSC';
  }

  async function fetchWithRetry(fetchFn: () => Promise<any>, retries = MAX_RETRIES, backoff = INITIAL_BACKOFF): Promise<any> {
    try {
      return await fetchFn();
    } catch (error) {
      if (retries > 0) {
        console.log(`Retrying... (${MAX_RETRIES - retries + 1}/${MAX_RETRIES})`);
        await sleep(backoff);
        return fetchWithRetry(fetchFn, retries - 1, backoff * 2);
      } else {
        throw error;
      }
    }
  }
  
  async function getEventsInChunks(pool: any, fromBlock: bigint, toBlock: bigint, chunkSize: bigint = BigInt(1000)) {
    let allEvents: any[] = [];
    for (let i = fromBlock; i <= toBlock; i += chunkSize) {
      const endBlock = i + chunkSize - BigInt(1) > toBlock ? toBlock : i + chunkSize - BigInt(1);
      console.log(`Fetching events from block ${i.toString()} to ${endBlock.toString()}`);
      try {
        const events = await fetchWithRetry(() => 
          pool.getPastEvents('Swap', {
            fromBlock: i.toString(),
            toBlock: endBlock.toString()
          })
        );
        allEvents = allEvents.concat(events);
      } catch (error) {
        console.error(`Error fetching events for block range ${i.toString()} - ${endBlock.toString()}:`, error);
        // If we encounter an error, we'll reduce the chunk size and try again
        if (chunkSize > BigInt(1)) {
          console.log(`Reducing chunk size and retrying...`);
          const newChunkSize = chunkSize / BigInt(2);
          const eventsInSmallerChunks = await getEventsInChunks(pool, i, endBlock, newChunkSize);
          allEvents = allEvents.concat(eventsInSmallerChunks);
        } else {
          // If chunk size is already 1, we can't reduce further, so we'll skip this block range
          console.error(`Skipping block range ${i.toString()} - ${endBlock.toString()} due to persistent errors`);
        }
      }
    }
    return allEvents;
  }

async function getBlockTimestamp(web3: Web3, blockNumber: number): Promise<number> {
    const block = await web3.eth.getBlock(blockNumber);
    return Number(block.timestamp);
}
  
async function getEthPrice(): Promise<number> {
    // You'll need to implement this function to fetch the current ETH price
    // For example, you could use an API like CoinGecko
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
    const data = await response.json();
    return data.ethereum.usd;
  }
  
  function getTradeSize(amount: string): 'Small' | 'Medium' | 'Large' {
    const absAmount = Math.abs(parseFloat(amount));
    if (absAmount < 100) return 'Small';
    if (absAmount < 1000) return 'Medium';
    return 'Large';
  }

  function calculatePriceFromSqrtPriceX96(sqrtPriceX96: bigint): number {
    const Q192 = 2n ** 192n;
    return Number((sqrtPriceX96 * sqrtPriceX96 * 10n**18n) / Q192) / 1e18;
  }
  
  
  export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    const { tokenAddress } = req.query;
    const poolAddress = '0xab2F2689cDE4EE1a44100Bc4FF9bF292D811E1eB';
    const web3 = new Web3(new Web3.providers.HttpProvider(addresses.providerEth));
  
    if (!tokenAddress || typeof tokenAddress !== 'string') {
      return res.status(400).json({ error: 'Valid token address is required' });
    }
    
    try {  
      const pool = new web3.eth.Contract(POOL_ABI, poolAddress);
  
      const latestBlock = BigInt(await web3.eth.getBlockNumber());
      const fromBlock = latestBlock - BigInt(10000) > 0 ? latestBlock - BigInt(10000) : BigInt(0);
      console.log(`Fetching events from block ${fromBlock.toString()} to ${latestBlock.toString()}`);
  
      const events = await getEventsInChunks(pool, fromBlock, latestBlock);
      const ethPrice = await getEthPrice();
  
      console.log(`Total number of events found: ${events.length}`);

        // Get current pool state
        const slot0 = await pool.methods.slot0().call();
        const currentSqrtPriceX96 = BigInt(slot0.sqrtPriceX96);
  
    const trades: Trade[] = await Promise.all(events.map(async (event, index) => {
        const timestamp = await getBlockTimestamp(web3, event.blockNumber);
        const amount0 = BigInt(event.returnValues.amount0);
        const amount1 = BigInt(event.returnValues.amount1);
        const cgtAmount = web3.utils.fromWei(amount0.toString(), 'ether');
        const ethAmount = web3.utils.fromWei(amount1.toString(), 'ether');
        const usdValue = (parseFloat(ethAmount) * ethPrice).toFixed(2);
        const pricePerCGT = (parseFloat(ethAmount) / parseFloat(cgtAmount)).toFixed(8);
  
        // Calculate price impact
        const sqrtPriceX96After = BigInt(event.returnValues.sqrtPriceX96);
        const sqrtPriceX96Before = index > 0 
        ? BigInt(events[index - 1].returnValues.sqrtPriceX96) 
        : currentSqrtPriceX96; // For the first trade, use current pool state

        const priceBefore = calculatePriceFromSqrtPriceX96(sqrtPriceX96Before);
        const priceAfter = calculatePriceFromSqrtPriceX96(sqrtPriceX96After);
        const priceImpact = ((priceAfter - priceBefore) / priceBefore * 100).toFixed(4);


        return {
          transactionHash: event.transactionHash,
          blockNumber: Number(event.blockNumber),
          timestamp: timestamp,
          amount0: cgtAmount,
          amount1: ethAmount,
          type: amount0 > BigInt(0) ? 'sell' : 'buy',
          usdValue: usdValue,
          pricePerCGT: pricePerCGT,
          tradeSize: getTradeSize(cgtAmount),
            priceImpact: priceImpact
        };
      }));
  
      res.status(200).json(trades);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'An error occurred while fetching trades' });
    }
  }