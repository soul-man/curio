import { NextApiRequest, NextApiResponse } from 'next';
import Moralis from 'moralis';
const { SolNetwork } = require("@moralisweb3/common-sol-utils");
import NodeCache from 'node-cache';

// Define interface for the API response
interface ApiResponse {
  eth: number;
  bnb: number;
  cgt: number;
  ton: number;
  usdt: number;
  dai: number;
  weth: number;
  wbnb: number;
  jsol: any;
}

// Create a cache with a 15-minute (900 seconds) expiration
const cache = new NodeCache({ stdTTL: 900 });

// Initialize Moralis outside of the handler function
const initMoralis = async () => {
  if (!Moralis.Core.isStarted) {
    await Moralis.start({ apiKey: process.env.NEXT_MORALIS_API_KEY });
  }
};

// Function to fetch token prices
async function fetchTokenPrices(): Promise<ApiResponse> {

  // Check if we have cached prices
  const cachedPrices = cache.get<ApiResponse>('tokenPrices');
  if (cachedPrices) {
    console.log('Returning cached prices');
    return cachedPrices;
  }

  console.log('Fetching fresh market prices from Moralis');

  const response = await Moralis.EvmApi.token.getMultipleTokenPrices({
    "chain": "0x1",
    "include": "percent_change"
  },{
    "tokens": [
      {
        "tokenAddress": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"  // ETH
      },
      {
        "tokenAddress": "0xB8c77482e45F1F44dE1745F52C74426C631bDD52"  // BNB
      },
      {
        "tokenAddress": "0x0E186357c323c806C1efdad36D217F7a54b63D18"  // CGT
      },
      {
        "tokenAddress": "0x582d872a1b094fc48f5de31d3b73f2d9be47def1"  // TON
      }
    ]
  });

  // jSOL
  const address = "7Q2afV64in6N6SeZsAAB81TJzwDoD6zpqmHkzi9Dcavn";
  const network = SolNetwork.MAINNET;
  const jSol = await Moralis.SolApi.token.getTokenPrice({
    address,
    network,
  });

  const prices = response.toJSON();
  
  const result: ApiResponse = {
    eth: prices[0].usdPrice,
    bnb: prices[1].usdPrice,
    cgt: prices[2].usdPrice,
    ton: prices[3].usdPrice,
    usdt: 1,
    dai: 1,
    weth: prices[0].usdPrice,
    wbnb: prices[1].usdPrice,
    jsol: jSol.result.usdPrice,
  };

  // Cache the new prices
  cache.set('tokenPrices', result);

  return result;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse | { error: string }>
) {

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    await initMoralis();
    const prices = await fetchTokenPrices();
    res.status(200).json(prices);
  } catch (error) {
    console.error('Error fetching prices:', error);
    res.status(500).json({ error: 'An error occurred while fetching prices' });
  }
}