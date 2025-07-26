import { NextApiRequest, NextApiResponse } from 'next';
import { getPolkadotApi } from '@/utils/getPolkadotApi';

// Simple in-memory cache
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 300000; // 5 minutes in milliseconds

function getCachedResult(key: string) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  cache.delete(key);
  return null;
}

function setCachedResult(key: string, data: any) {
  cache.set(key, { data, timestamp: Date.now() });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { action, params = {} } = req.body;

    if (!action) {
      return res.status(400).json({ error: 'Action is required' });
    }

    // Check cache first
    const cacheKey = `${action}-${JSON.stringify(params)}`;
    const cachedResult = getCachedResult(cacheKey);
    if (cachedResult) {
      return res.status(200).json(cachedResult);
    }

    const { api } = getPolkadotApi();
    await api.isReady;

    let result;

    switch (action) {
      case 'getChainInfo':
        const chainData = {
          chain: await api.rpc.system.chain(),
          version: await api.rpc.system.version(),
          properties: await api.rpc.system.properties(),
        };
        // Convert to serializable format
        result = {
          chain: chainData.chain.toString(),
          version: chainData.version.toString(),
          properties: chainData.properties.toJSON(),
        };
        break;

      case 'getBalance':
        if (!params.address) {
          return res.status(400).json({ error: 'Address is required for balance query' });
        }
        const accountInfo = await api.query.system.account(params.address);
        const accountData = accountInfo.toJSON() as any;
        result = {
          free: accountData.data.free.toString(),
          reserved: accountData.data.reserved.toString(),
          frozen: accountData.data.frozen.toString(),
        };
        break;

      case 'queryStaking':
        const stakingData = await api.query.parachainStaking.totalCollatorStake();
        const stakingJson = stakingData.toJSON() as any;
        result = {
          delegators: stakingJson.delegators?.toString() || '0',
          collators: stakingJson.collators?.toString() || '0',
        };
        break;

      default:
        return res.status(400).json({ error: `Unknown action: ${action}` });
    }

    // Cache the result
    setCachedResult(cacheKey, result);

    return res.status(200).json(result);
  } catch (error) {
    console.error('Polkadot API proxy error:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error || 'Unknown error' });
  }
}