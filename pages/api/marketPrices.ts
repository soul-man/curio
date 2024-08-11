import { NextApiRequest, NextApiResponse } from 'next';
import Moralis from 'moralis';
import NodeCache from 'node-cache';

// Define interface for the API response
interface ApiResponse {
  eth: number;
  bnb: number;
  cgt: number;
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

  console.log('Fetching fresh prices from Moralis');

  const response = await Moralis.EvmApi.token.getMultipleTokenPrices({
    "chain": "0x1",
    "include": "percent_change"
  },{
    "tokens": [
      {
        "tokenAddress": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
      },
      {
        "tokenAddress": "0xB8c77482e45F1F44dE1745F52C74426C631bDD52"
      },
      {
        "tokenAddress": "0x0E186357c323c806C1efdad36D217F7a54b63D18"
      }
    ]
  });

  const prices = response.toJSON();
  
  const result: ApiResponse = {
    eth: prices[0].usdPrice,
    bnb: prices[1].usdPrice,
    cgt: prices[2].usdPrice
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