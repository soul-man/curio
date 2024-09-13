import { NextApiRequest, NextApiResponse } from 'next';
import Web3 from 'web3';
import NodeCache from 'node-cache';
import { addresses } from "@/constant/address";

// Create a cache object
const cache = new NodeCache();

const ETH_POOL_ABI = [
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
  },
  {
      inputs: [],
      name: "liquidity",
      outputs: [{ internalType: "uint128", name: "", type: "uint128" }],
      stateMutability: "view",
      type: "function"
    }
] as const;
  
const BSC_POOL_ABI = [
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'sender', type: 'address' },
      { indexed: true, internalType: 'address', name: 'recipient', type: 'address' },
      { indexed: false, internalType: 'int256', name: 'amount0', type: 'int256' },
      { indexed: false, internalType: 'int256', name: 'amount1', type: 'int256' },
      { indexed: false, internalType: 'uint160', name: 'sqrtPriceX96', type: 'uint160' },
      { indexed: false, internalType: 'uint128', name: 'liquidity', type: 'uint128' },
      { indexed: false, internalType: 'int24', name: 'tick', type: 'int24' },
      { indexed: false, internalType: 'uint128', name: 'protocolFeesToken0', type: 'uint128' },
      { indexed: false, internalType: 'uint128', name: 'protocolFeesToken1', type: 'uint128' }
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
      { internalType: "uint32", name: "feeProtocol", type: "uint32" },
      { internalType: "bool", name: "unlocked", type: "bool" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
      inputs: [],
      name: "liquidity",
      outputs: [{ internalType: "uint128", name: "", type: "uint128" }],
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
  pricePerToken: string;
  tradeSize: 'Small' | 'Medium' | 'Large';
  priceImpact: string;
  chain: 'ETH' | 'BSC';
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const MAX_RETRIES = 5;
const INITIAL_BACKOFF = 1000; // 1 second

const rateLimiter = {
  lastCallTime: 0,
  queue: [] as (() => void)[],
  async throttle<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      const execute = async () => {
        const now = Date.now();
        if (now - this.lastCallTime < 100) { // 100ms = 10 calls per second
          await new Promise(r => setTimeout(r, 100 - (now - this.lastCallTime)));
        }
        this.lastCallTime = Date.now();
        try {
          resolve(await fn());
        } catch (error) {
          reject(error);
        }
        this.queue.shift();
        if (this.queue.length > 0) {
          this.queue[0]();
        }
      };
      
      if (this.queue.length === 0) {
        this.queue.push(execute);
        execute();
      } else {
        this.queue.push(execute);
      }
    });
  }
};

async function fetchWithRetry(fetchFn: () => Promise<any>, chain: 'ETH' | 'BSC', retries = MAX_RETRIES, backoff = INITIAL_BACKOFF): Promise<any> {
  const executeFetch = async () => {
    try {
      return await fetchFn();
    } catch (error) {
      if (retries > 0) {
        console.log(`Retrying... (${MAX_RETRIES - retries + 1}/${MAX_RETRIES})`);
        await sleep(backoff);
        return fetchWithRetry(fetchFn, chain, retries - 1, backoff * 2);
      } else {
        throw error;
      }
    }
  };

  if (chain === 'BSC') {
    return rateLimiter.throttle(executeFetch);
  } else {
    return executeFetch();
  }
}

async function getEventsInChunks(pool: any, fromBlock: bigint, toBlock: bigint, chain: 'ETH' | 'BSC', chunkSize: bigint = BigInt(5000)) {
  let allEvents: any[] = [];
  for (let i = fromBlock; i <= toBlock; i += chunkSize) {
    const endBlock = i + chunkSize - BigInt(1) > toBlock ? toBlock : i + chunkSize - BigInt(1);
    try {
      const events = await fetchWithRetry(() => 
        pool.getPastEvents('Swap', {
          fromBlock: i.toString(),
          toBlock: endBlock.toString()
        })
      , chain);
      allEvents = allEvents.concat(events);
    } catch (error) {
      console.error(`Error fetching events for block range ${i.toString()} - ${endBlock.toString()}:`, error);
      if (chunkSize > BigInt(100)) {
        console.log(`Reducing chunk size and retrying...`);
        const newChunkSize = chunkSize / BigInt(2);
        const eventsInSmallerChunks = await getEventsInChunks(pool, i, endBlock, chain, newChunkSize);
        allEvents = allEvents.concat(eventsInSmallerChunks);
      } else {
        console.error(`Skipping block range ${i.toString()} - ${endBlock.toString()} due to persistent errors`);
      }
    }
  }
  return allEvents;
}

async function getBlockTimestamp(web3: Web3, blockNumber: number, chain: 'ETH' | 'BSC'): Promise<number> {
  const fetchBlock = async () => {
    const block = await web3.eth.getBlock(blockNumber);
    return Number(block.timestamp);
  };

  if (chain === 'BSC') {
    return rateLimiter.throttle(fetchBlock);
  } else {
    return fetchBlock();
  }
}

async function getPrices(): Promise<{cgt: number; eth: number, bnb: number }> {
    try {
      const response = await fetch(process.env.NEXT_HOST_BASE_URL + '/api/marketPrices');
      const data = await response.json();
      return {
        eth: data.eth,
        bnb: data.bnb,
        cgt: data.cgt
      };
    } catch (error) {
      console.error('Error fetching prices:', error);
      throw error;
    }
  }

function getTradeSize(amount: string): 'Small' | 'Medium' | 'Large' {
  const absAmount = Math.abs(parseFloat(amount));
  if (absAmount < 5000) return 'Small';
  if (absAmount < 50000) return 'Medium';
  return 'Large';
}

function calculatePriceFromSqrtPriceX96(sqrtPriceX96: bigint): number {
  const Q192 = 2n ** 192n;
  return Number((sqrtPriceX96 * sqrtPriceX96 * 10n**18n) / Q192) / 1e18;
}

async function getTradesForChain(web3: Web3, poolAddress: string, chain: 'ETH' | 'BSC'): Promise<Trade[]> {
  const poolABI = chain === 'ETH' ? ETH_POOL_ABI : BSC_POOL_ABI;
  const pool = new web3.eth.Contract(poolABI, poolAddress);

  let latestBlock: bigint;
  try {
    latestBlock = BigInt(await web3.eth.getBlockNumber());
    console.log(`Latest block on ${chain}: ${latestBlock.toString()}`);
  } catch (error) {
    console.error(`Error fetching latest block number for ${chain}:`, error);
    throw error;
  }

  const blocksFor24Hours = chain === 'ETH' ? BigInt(8646) : BigInt(2000);
  const fromBlock = latestBlock - blocksFor24Hours > 0n ? latestBlock - blocksFor24Hours : 0n;
  console.log(`Fetching events from block ${fromBlock.toString()} to ${latestBlock.toString()} on ${chain}`);

  let events: any[];
  try {
    events = await getEventsInChunks(pool, fromBlock, latestBlock, chain);
    console.log(`Total number of events found on ${chain}: ${events.length}`);
  } catch (error) {
    console.error(`Error fetching events for ${chain}:`, error);
    throw error;
  }

  if (events.length === 0) {
    console.log(`No events found for ${chain} in the last 5000 blocks.`);
    return [];
  }

  let prices: { cgt: number; eth: number; bnb: number };
  try {
    prices = await getPrices();
  } catch (error) {
    console.error(`Error fetching prices:`, error);
    throw error;
  }

  const price = chain === 'ETH' ? prices.eth : prices.bnb;

  let currentSqrtPriceX96: bigint;
  try {
    const slot0 = await pool.methods.slot0().call();
    currentSqrtPriceX96 = BigInt(slot0.sqrtPriceX96);
  } catch (error) {
    console.error(`Error fetching slot0 for ${chain}:`, error);
    currentSqrtPriceX96 = 0n;
  }

  const trades: Trade[] = await Promise.all(events.map(async (event: any, index: number) => {
    try {
      const timestamp = await getBlockTimestamp(web3, event.blockNumber, chain);
      const amount0 = BigInt(event.returnValues.amount0);
      const amount1 = BigInt(event.returnValues.amount1);
      const tokenAmount = parseFloat(web3.utils.fromWei(amount0.toString(), 'ether')).toFixed(2);

      let ethAmount = web3.utils.fromWei(amount1.toString(), 'ether');
      ethAmount = ethAmount.startsWith('-') 
        ? '-' + ethAmount.substring(1).replace('-', '')
        : ethAmount.replace('-', '');
      
      const usdValue = (Math.abs(parseFloat(ethAmount)) * price).toFixed(2);
      const pricePerToken = (Math.abs(parseFloat(ethAmount)) / Math.abs(parseFloat(tokenAmount))).toFixed(8);

      const sqrtPriceX96After = BigInt(event.returnValues.sqrtPriceX96);
      const sqrtPriceX96Before = index > 0 
          ? BigInt(events[index - 1].returnValues.sqrtPriceX96) 
          : currentSqrtPriceX96;

      const priceBefore = calculatePriceFromSqrtPriceX96(sqrtPriceX96Before);
      const priceAfter = calculatePriceFromSqrtPriceX96(sqrtPriceX96After);
      const priceImpact = ((priceAfter - priceBefore) / priceBefore * 100).toFixed(4);

      return {
        transactionHash: event.transactionHash,
        blockNumber: Number(event.blockNumber),
        timestamp,
        amount0: tokenAmount,
        amount1: ethAmount,
        type: amount0 > 0n ? 'sell' : 'buy',
        usdValue,
        pricePerToken: pricePerToken,
        tradeSize: getTradeSize(tokenAmount),
        priceImpact,
        chain
      };
    } catch (error) {
      console.error(`Error processing trade event:`, error);
      throw error;
    }
  }));
  return trades;
}
  
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const cachedData = cache.get('trades');
  if (cachedData) {
    console.log('Returning cached data');
    return res.status(200).json(cachedData);
  }
  
  try {
    // const infuraProviderBsc = `https://bsc-mainnet.infura.io/v3/${process.env.NEXT_INFURA_API_KEY}`;
    const infuraProviderEth = `https://bsc-mainnet.infura.io/v3/${process.env.NEXT_INFURA_API_KEY}`;
    const web3Eth = new Web3(new Web3.providers.HttpProvider(addresses.providerEth));
    // const web3Bsc = new Web3(new Web3.providers.HttpProvider(infuraProviderBsc));

    console.log('Fetching ETH trades');
    const ethTrades = await getTradesForChain(web3Eth, addresses.POOL_ETH_CGT_ETH, 'ETH');
    console.log(`Fetched ${ethTrades.length} ETH trades`);

    // console.log('Fetching ETH liquidity');
    // const ethLiquidity = await getPoolLiquidity(web3Eth, addresses.POOL_ETH_CGT_ETH, 'ETH');
    // console.log('Fetching BSC liquidity');
    // const bscLiquidity = await getPoolLiquidity(web3Bsc, addresses.POOL_BSC_CGT_BNB, 'BSC');
    
    const allTrades = [...ethTrades].sort((a, b) => b.timestamp - a.timestamp);
    
    const result = {
      trades: allTrades,
      // liquidity: {
      //   ETH: {
      //     usdValue: ethLiquidity.usdValue,
      //     WETH: ethLiquidity.token0,
      //     CGT: ethLiquidity.token1
      //   },
      //   BSC: {
      //     usdValue: bscLiquidity.usdValue,
      //     WBNB: bscLiquidity.token0,
      //     CGT: bscLiquidity.token1
      //   }
      // }
    };

    console.log('Caching result');
    cache.set('trades', result, 900);

    console.log('Sending response');
    res.status(200).json(result);
  } catch (error: unknown) {
    console.error('Error in API handler:', error);
    res.status(500).json({ 
      error: 'An error occurred while fetching trades and liquidity', 
      details: error instanceof Error ? error.message : String(error)
    });
  }
}