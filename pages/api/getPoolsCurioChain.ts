import { NextApiRequest, NextApiResponse } from 'next';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { BN } from '@polkadot/util';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 600 });

const DECIMALS: { [key: string]: number } = {
  CGT: 18,
  USDC: 6,
  DAI: 6
};

interface PoolPair {
  token1: string;
  token2: string;
}

const POOL_PAIRS: PoolPair[] = [
  { token1: 'CGT', token2: 'USDC' },
  { token1: 'CGT', token2: 'DAI' }
];

function formatBalance(balance: BN, decimals: number): number {
  return parseFloat(balance.toString()) / Math.pow(10, decimals);
}

function hexToBN(hexString: string): BN {
  const cleanHex = hexString.startsWith('0x') ? hexString.slice(2) : hexString;
  return new BN(cleanHex, 16);
}

async function getLiquidityPools() {
  let api: ApiPromise | null = null;
  try {
    const provider = new WsProvider('wss://parachain.curioinvest.com');
    api = await ApiPromise.create({ provider });

    console.log('Connected to the chain');
    console.log('Available dex methods:', Object.keys(api.query.dex));

    const poolsData = await Promise.all(
      POOL_PAIRS.map(async (pair) => {
        const liquidityPool = await api!.query.dex.liquidityPool([
          { token: pair.token1 },
          { token: pair.token2 }
        ]);

        console.log(`Raw liquidityPool result for ${pair.token1}/${pair.token2}:`, liquidityPool.toString());
        const poolData = liquidityPool.toJSON() as [string, string] | null;
        console.log(`Parsed poolData for ${pair.token1}/${pair.token2}:`, poolData);

        if (!poolData || !Array.isArray(poolData) || poolData.length !== 2) {
          console.warn(`Unexpected pool data format for ${pair.token1}/${pair.token2}: ${JSON.stringify(poolData)}`);
          return null;
        }

        const [amount1, amount2] = poolData;

        const bn1 = typeof amount1 === 'string' ? hexToBN(amount1) : new BN(amount1 as string | number);
        const bn2 = typeof amount2 === 'string' ? hexToBN(amount2) : new BN(amount2 as string | number);
        return {
          pair: `${pair.token1}/${pair.token2}`,
          [pair.token1]: formatBalance(bn1, DECIMALS[pair.token1]),
          [pair.token2]: formatBalance(bn2, DECIMALS[pair.token2]),
          raw: {
            [pair.token1]: bn1.toString(),
            [pair.token2]: bn2.toString()
          }
        };
      })
    );

    return poolsData.filter(Boolean); // Remove any null results
  } catch (err) {
    console.error(`Error getting liquidity pool data:`, err);
    throw err;
  } finally {
    if (api) {
      await api.disconnect();
      console.log('Disconnected from the chain');
    }
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const cachedResult = cache.get('liquidityPools');
      if (cachedResult !== undefined) {
        return res.status(200).json(cachedResult);
      }

      const liquidityPools = await getLiquidityPools();
      cache.set('liquidityPools', liquidityPools);

      return res.status(200).json(liquidityPools);
    } catch (err) {
      console.error(`Error in API handler:`, err);
      return res.status(500).json({ 
        error: 'Internal Server Error', 
        details: err instanceof Error ? err.message : 'Unknown error',
        stack: process.env.NODE_ENV === 'development' ? err instanceof Error ? err.stack : undefined : undefined
      });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}