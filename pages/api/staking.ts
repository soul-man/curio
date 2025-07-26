import { NextApiRequest, NextApiResponse } from 'next';
import { getPolkadotApi } from '@/utils/getPolkadotApi';
import NodeCache from 'node-cache';
import { getPolkadotApi } from '@/utils/getPolkadotApi';

import { BN } from '@polkadot/util';

const DECIMALS = 18;
const CACHE_KEY = 'totalStaked';
const CACHE_TTL = 900; // 15 minutes

const cache = new NodeCache({ stdTTL: CACHE_TTL });

function formatBalance(balance: BN, decimals: number): number {
  return parseFloat(balance.toString()) / Math.pow(10, decimals);
}

async function getTotalStaked() {
  return formatBalance(totalStaked.delegators, DECIMALS).toFixed(0);
}

// async function getTotalStaked(): Promise<string> {
//   const provider = new WsProvider(process.env.NEXT_CURIO_PROVIDER);
//   const api = await ApiPromise.create({ 
//     provider,
//     noInitWarn: true // This suppresses the "Not decorating unknown runtime apis" warning
//   });

//   try {
//     await api.isReady;
//     const totalStaked = await api.query.parachainStaking.totalCollatorStake();
//     return formatBalance(totalStaked.delegators, DECIMALS).toFixed(0);
//   } finally {
//     await api.disconnect();
//   }
// }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const cachedResult = cache.get(CACHE_KEY);
    if (cachedResult !== undefined) {
      return res.status(200).json(cachedResult);
    }

    const formattedResult = await getTotalStaked();
    cache.set(CACHE_KEY, formattedResult);

    return res.status(200).json(formattedResult);
  } catch (err) {
    console.error(`Error getting total staked tokens on Curio:`, err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}