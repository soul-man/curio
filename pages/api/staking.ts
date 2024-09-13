import { NextApiRequest, NextApiResponse } from 'next';
import { ApiPromise, WsProvider } from '@polkadot/api';
import NodeCache from 'node-cache';
import { BN } from '@polkadot/util';

const DECIMALS = 18;

// Create a cache with a 15-minute (900 seconds) expiration
const cache = new NodeCache({ stdTTL: 900 });

function formatBalance(balance: BN, decimals: number): number {
  return parseFloat(balance.toString()) / Math.pow(10, decimals);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // Check if the result is in the cache
      const cachedResult = cache.get('totalStaked');
      if (cachedResult !== undefined) {
        return res.status(200).json(cachedResult);
      }

      const provider = new WsProvider('wss://parachain.curioinvest.com');
      const api = await ApiPromise.create({ provider });

      // Query the total staked amount
      const totalStaked = await api.query.parachainStaking.totalCollatorStake();

      await api.disconnect();

      // Format the result
      // @ts-ignore
      const formattedResult = formatBalance(totalStaked.delegators, DECIMALS).toFixed(0);

      // Store the result in the cache
      cache.set('totalStaked', formattedResult);

      return res.status(200).json(formattedResult);
    } catch (err) {
      console.error(`Error getting total staked tokens on Curio: ${err}`);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}