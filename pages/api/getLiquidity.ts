import { NextApiRequest, NextApiResponse } from 'next';
import Web3 from 'web3';
import { TonClient, Address } from 'ton';
import NodeCache from 'node-cache';
import { addresses } from "@/constant/address";
import { ApiPromise, WsProvider } from '@polkadot/api';
import { BN } from '@polkadot/util';

const cache = new NodeCache({ stdTTL: 900 });

type PriceSymbol = 'cgt' | 'eth' | 'bnb' | 'ton' | 'usdt' | 'usdc' | 'dai' | 'weth' | 'wbnb' | 'neon' | 'jsol';
type Prices = Record<PriceSymbol, number>;

const poolsInfo = {
  ETH: [
    {
      name: "CGT/WETH",
      address: addresses.POOL_ETH_CGT_ETH,
      token0: { symbol: "CGT" as PriceSymbol, decimals: 18, address: addresses.CGT_ETH_ADDRESS },
      token1: { symbol: "WETH" as PriceSymbol, decimals: 18, address: addresses.WETH_ETH_ADDRESS }
    }
  ],
  BSC: [
    {
      name: "CGT/WBNB",
      address: addresses.POOL_BSC_CGT_BNB,
      token0: { symbol: "CGT" as PriceSymbol, decimals: 18, address: addresses.CGT_BNB_ADDRESS },
      token1: { symbol: "WBNB" as PriceSymbol, decimals: 18, address: addresses.WBNB_BNB_ADDRESS }
    }
  ],
  TON: [
    {
      name: "CGT/USDT",
      address: addresses.TON_POOL_CGTUSDT,
      token0: { symbol: "CGT" as PriceSymbol, decimals: 18 },
      token1: { symbol: "USDT" as PriceSymbol, decimals: 6 }
    },
    {
      name: "CGT/TON",
      address: addresses.TON_POOL_CGTTON,
      token0: { symbol: "CGT" as PriceSymbol, decimals: 18 },
      token1: { symbol: "TON" as PriceSymbol, decimals: 9 }
    }
  ],
  CURIO: [
    {
      name: "CGT/USDC",
      token0: { symbol: "CGT" as PriceSymbol, decimals: 18 },
      token1: { symbol: "USDC" as PriceSymbol, decimals: 6 }
    },
    {
      name: "CGT/DAI",
      token0: { symbol: "CGT" as PriceSymbol, decimals: 18 },
      token1: { symbol: "DAI" as PriceSymbol, decimals: 18 }
    }
  ],
  NEON: [
    {
      name: "CGT/USDC",
      address: "0xf013fd8b44798f844c9bad09d67da79881222a7f",
      token0: { symbol: "CGT" as PriceSymbol, decimals: 18 },
      token1: { symbol: "USDC" as PriceSymbol, decimals: 6 }
    },
    {
      name: "CGT/JSOL",
      address: "0x301f3047056976c03cd3bc885c46014ad8dec1a5",
      token0: { symbol: "CGT" as PriceSymbol, decimals: 18 },
      token1: { symbol: "JSOL" as PriceSymbol, decimals: 9 }
    }
  ]
};

const formatReserve = (value: bigint | number, decimals: number): number => {
  return Number(value) / Math.pow(10, decimals);
};

async function getPrices(): Promise<Prices> {
  try {
    const response = await fetch(process.env.NEXT_HOST_BASE_URL + '/api/marketPrices');
    const data = await response.json();
    return { 
      cgt: data.cgt, 
      eth: data.eth, 
      bnb: data.bnb, 
      ton: data.ton, 
      usdt: 1,
      usdc: 1,
      dai: 1,
      weth: data.eth,
      wbnb: data.bnb,
      neon: data.neon || 1,
      jsol: data.jsol || 1 // Add JSOL price, default to 1 if not available
    };
  } catch (error) {
    console.error('Error fetching prices:', error);
    throw error;
  }
}

async function getEthBscPoolLiquidity(web3: Web3, poolInfo: typeof poolsInfo.ETH[0], chain: 'ETH' | 'BSC'): Promise<{ usdValue: string, [key: string]: string }> {
  try {
    const erc20ABI = [{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"type":"function"}] as const;
    
    const token0Contract = new web3.eth.Contract(erc20ABI, poolInfo.token0.address);
    const token1Contract = new web3.eth.Contract(erc20ABI, poolInfo.token1.address);
    
    const [token0Balance, token1Balance] = await Promise.all([
      token0Contract.methods.balanceOf(poolInfo.address).call(),
      token1Contract.methods.balanceOf(poolInfo.address).call()
    ]);
    
    const token0Amount = formatReserve(BigInt(token0Balance), poolInfo.token0.decimals);
    const token1Amount = formatReserve(BigInt(token1Balance), poolInfo.token1.decimals);
    
    const prices = await getPrices();

    const token0Price = prices[poolInfo.token0.symbol.toLowerCase() as PriceSymbol];
    const token1Price = prices[poolInfo.token1.symbol.toLowerCase() as PriceSymbol];

    if (token0Price === undefined || token1Price === undefined) {
      throw new Error(`Price not available for ${poolInfo.token0.symbol} or ${poolInfo.token1.symbol}`);
    }

    const token0UsdValue = token0Amount * token0Price;
    const token1UsdValue = token1Amount * token1Price;
    const totalUsdValue = token0UsdValue + token1UsdValue;

    return {
      usdValue: totalUsdValue.toFixed(2),
      [poolInfo.token0.symbol]: Math.round(token0Amount).toString(),
      [poolInfo.token1.symbol]: token1Amount.toFixed(2)
    };
  } catch (error) {
    console.error(`Error fetching liquidity for ${chain}:`, error);
    return { usdValue: '0', [poolInfo.token0.symbol]: '0', [poolInfo.token1.symbol]: '0' };
  }
}

async function getTonPoolLiquidity(client: TonClient, poolInfo: typeof poolsInfo.TON[0]): Promise<{ usdValue: string, [key: string]: string }> {
  try {
    const address = Address.parse(poolInfo.address);
    const { stack: poolData } = await client.runMethod(address, 'get_pool_data');

    const reserve0 = formatReserve(poolData.readBigNumber(), poolInfo.token0.decimals);
    const reserve1 = formatReserve(poolData.readBigNumber(), poolInfo.token1.decimals);

    const prices = await getPrices();
    const token0UsdValue = reserve0 * prices[poolInfo.token0.symbol.toLowerCase() as PriceSymbol];
    const token1UsdValue = reserve1 * prices[poolInfo.token1.symbol.toLowerCase() as PriceSymbol];
    const totalUsdValue = token0UsdValue + token1UsdValue;

    return {
      usdValue: totalUsdValue.toFixed(2),
      [poolInfo.token0.symbol]: Math.round(reserve0).toString(),
      [poolInfo.token1.symbol]: reserve1.toFixed(2)
    };
  } catch (error) {
    console.error('Error fetching TON pool liquidity:', error);
    return { usdValue: '0', [poolInfo.token0.symbol]: '0', [poolInfo.token1.symbol]: '0' };
  }
}

async function getCurioPoolLiquidity(): Promise<{ [key: string]: { usdValue: string, [key: string]: string } }> {
  let api: ApiPromise | null = null;
  try {
    const provider = new WsProvider(process.env.NEXT_CURIO_PROVIDER);
    api = await ApiPromise.create({ provider });

    const prices = await getPrices();

    const poolsToQuery = [
      ...poolsInfo.CURIO,
      {
        name: "CGT/USDC",
        token0: { symbol: "CGT" as PriceSymbol, decimals: 18 },
        token1: { symbol: "USDC" as PriceSymbol, decimals: 6 }
      }
    ];

    const poolsData = await Promise.all(
      poolsToQuery.map(async (poolInfo) => {
        const liquidityPool = await api!.query.dex.liquidityPool([
          { token: poolInfo.token0.symbol },
          { token: poolInfo.token1.symbol }
        ]);

        const poolData = liquidityPool.toJSON() as [string, string] | null;

        if (!poolData || !Array.isArray(poolData) || poolData.length !== 2) {
          console.warn(`Unexpected pool data format for ${poolInfo.name}: ${JSON.stringify(poolData)}`);
          return null;
        }

        const [amount0, amount1] = poolData;

        const bn0 = new BN(typeof amount0 === 'string' ? amount0.slice(2) : amount0, 16);
        const bn1 = new BN(typeof amount1 === 'string' ? amount1.slice(2) : amount1, 16);

        const token0Amount = bn0.div(new BN(10).pow(new BN(poolInfo.token0.decimals)));
        const token1Amount = bn1.div(new BN(10).pow(new BN(poolInfo.token1.decimals)));

        const token0Price = new BN(Math.round(prices[poolInfo.token0.symbol.toLowerCase() as PriceSymbol] * 1e6));
        const token1Price = new BN(Math.round(prices[poolInfo.token1.symbol.toLowerCase() as PriceSymbol] * 1e6));

        const token0UsdValue = token0Amount.mul(token0Price);
        const token1UsdValue = token1Amount.mul(token1Price);
        const totalUsdValue = token0UsdValue.add(token1UsdValue);

        return {
          [poolInfo.name]: {
            usdValue: totalUsdValue.div(new BN(1e6)).toString(),
            [poolInfo.token0.symbol]: token0Amount.toString(),
            [poolInfo.token1.symbol]: token1Amount.toString()
          }
        };
      })
    );

    return Object.assign({}, ...poolsData.filter(Boolean));
  } catch (err) {
    console.error(`Error getting Curio liquidity pool data:`, err);
    throw err;
  } finally {
    if (api) {
      await api.disconnect();
    }
  }
}

async function getNeonPoolLiquidity(web3: Web3, poolInfo: typeof poolsInfo.NEON[0]): Promise<{ usdValue: string, [key: string]: string }> {
  try {
    const erc20ABI = [{"constant":true,"inputs":[],"name":"getReserves","outputs":[{"name":"_reserve0","type":"uint112"},{"name":"_reserve1","type":"uint112"},{"name":"_blockTimestampLast","type":"uint32"}],"type":"function"}] as const;
    
    const poolContract = new web3.eth.Contract(erc20ABI, poolInfo.address);

    const reserves = await poolContract.methods.getReserves().call();

    if (!reserves || typeof reserves !== 'object' || !('0' in reserves) || !('1' in reserves)) {
      throw new Error(`Unexpected reserves format: ${JSON.stringify(reserves)}`);
    }

    const reserve0 = reserves['0'];
    const reserve1 = reserves['1'];
    
    let token0Amount, token1Amount;
    
    // Check if this is the CGT/JSOL pool
    if (poolInfo.name === "CGT/JSOL") {
      // Swap the order for CGT/JSOL pool
      token0Amount = formatReserve(BigInt(reserve1), poolInfo.token0.decimals);
      token1Amount = formatReserve(BigInt(reserve0), poolInfo.token1.decimals);
    } else {
      // For other pools (including CGT/USDC), keep the original order
      token0Amount = formatReserve(BigInt(reserve0), poolInfo.token0.decimals);
      token1Amount = formatReserve(BigInt(reserve1), poolInfo.token1.decimals);
    }
    
    const prices = await getPrices();

    const token0Price = prices[poolInfo.token0.symbol.toLowerCase() as PriceSymbol];
    const token1Price = prices[poolInfo.token1.symbol.toLowerCase() as PriceSymbol];

    if (token0Price === undefined || token1Price === undefined) {
      throw new Error(`Price not available for ${poolInfo.token0.symbol} or ${poolInfo.token1.symbol}`);
    }

    const token0UsdValue = token0Amount * token0Price;
    const token1UsdValue = token1Amount * token1Price;
    const totalUsdValue = token0UsdValue + token1UsdValue;

    return {
      usdValue: totalUsdValue.toFixed(2),
      [poolInfo.token0.symbol]: Math.round(token0Amount).toString(),
      [poolInfo.token1.symbol]: token1Amount.toFixed(2)
    };
  } catch (error) {
    console.error(`Error fetching liquidity for NEON:`, error);
    console.error(error);
    return { usdValue: '0', [poolInfo.token0.symbol]: '0', [poolInfo.token1.symbol]: '0' };
  }
}

async function getAllNetworksLiquidity() {
  const infuraProviderEth = `https://mainnet.infura.io/v3/${process.env.NEXT_INFURA_API_KEY}`;

  const web3Eth = new Web3(new Web3.providers.HttpProvider(infuraProviderEth));
  const web3Bsc = new Web3(new Web3.providers.HttpProvider(addresses.providerBsc1));
  const tonClient = new TonClient({ endpoint: 'https://toncenter.com/api/v2/jsonRPC' });
  const web3Neon = new Web3(new Web3.providers.HttpProvider('https://neon-proxy-mainnet.solana.p2p.org'));

  const [ethLiquidity, bscLiquidity, tonLiquidity, curioLiquidity, neonLiquidity] = await Promise.all([
    Promise.all(poolsInfo.ETH.map(pool => getEthBscPoolLiquidity(web3Eth, pool, 'ETH'))),
    Promise.all(poolsInfo.BSC.map(pool => getEthBscPoolLiquidity(web3Bsc, pool, 'BSC'))),
    Promise.all(poolsInfo.TON.map(pool => getTonPoolLiquidity(tonClient, pool))),
    getCurioPoolLiquidity(),
    Promise.all(poolsInfo.NEON.map(pool => getNeonPoolLiquidity(web3Neon, pool)))
  ]);

  return {
    ETH: Object.fromEntries(poolsInfo.ETH.map((pool, index) => [pool.name, ethLiquidity[index]])),
    BSC: Object.fromEntries(poolsInfo.BSC.map((pool, index) => [pool.name, bscLiquidity[index]])),
    TON: Object.fromEntries(poolsInfo.TON.map((pool, index) => [pool.name, tonLiquidity[index]])),
    CURIO: curioLiquidity,
    NEON: Object.fromEntries(poolsInfo.NEON.map((pool, index) => [pool.name, neonLiquidity[index]]))
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const cachedData = cache.get('allLiquidity');
    if (cachedData) {
      return res.status(200).json(cachedData);
    }
    
    try {
      const liquidityData = await getAllNetworksLiquidity();

      const result = {
        liquidity: liquidityData
      };

      cache.set('allLiquidity', result);

      res.status(200).json(result);
    } catch (error: unknown) {
      console.error('Error in API handler:', error);
      res.status(500).json({ 
        error: 'An error occurred while fetching liquidity', 
        details: error instanceof Error ? error.message : String(error)
      });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}