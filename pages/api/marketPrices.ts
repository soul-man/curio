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

  try {
    console.log('Calling Moralis EVM API for token prices...');
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
          "tokenAddress": "0x582d872a1b094fc48f5de31d3b73f2d9be47def1"  // TON
        }
      ]
    });

    console.log('EVM API response received, parsing...');
    const prices = response.toJSON();
    console.log('Parsed EVM prices:', prices);

    if (!prices || !Array.isArray(prices) || prices.length < 3) {
      throw new Error(`Invalid EVM prices response: expected 3 tokens, got ${prices?.length || 0}`);
    }

    console.log('Fetching CGT price from cgtMarketData endpoint...');
    const cgtResponse = await fetch(`${process.env.NEXT_HOST_BASE_URL || 'http://localhost:3000'}/api/cgtMarketData`);
    if (!cgtResponse.ok) {
      throw new Error(`Failed to fetch CGT price: ${cgtResponse.status}`);
    }
    const cgtData = await cgtResponse.json();
    if (!cgtData.marketPrice) {
      throw new Error('CGT market price not available');
    }
    const cgtPrice = parseFloat(cgtData.marketPrice);
    console.log('CGT price from cgtMarketData:', cgtPrice);

    console.log('Calling Moralis Solana API for jSOL price...');
    // jSOL
    const address = "7Q2afV64in6N6SeZsAAB81TJzwDoD6zpqmHkzi9Dcavn";
    const network = SolNetwork.MAINNET;
    const jSol = await Moralis.SolApi.token.getTokenPrice({
      address,
      network,
    });

    console.log('jSOL API response received:', jSol);
    
    if (!jSol?.result?.usdPrice) {
      throw new Error('Invalid jSOL price response');
    }

    const result: ApiResponse = {
      eth: prices[0]?.usdPrice || 0,      // ETH from Moralis
      bnb: prices[1]?.usdPrice || 0,      // BNB from Moralis  
      cgt: cgtPrice,                      // CGT from cgtMarketData
      ton: prices[2]?.usdPrice || 0,      // TON from Moralis (now index 2)
      usdt: 1,
      dai: 1,
      weth: prices[0]?.usdPrice || 0,     // Same as ETH
      wbnb: prices[1]?.usdPrice || 0,     // Same as BNB
      jsol: jSol.result.usdPrice,
    };

    console.log('Final result:', result);

    // Validate that we have valid prices
    if (result.eth === 0 || result.cgt === 0 || result.ton === 0) {
      console.warn('Warning: Some key prices are 0, but proceeding...');
    }

    // Cache the new prices
    cache.set('tokenPrices', result);

    return result;
  } catch (error) {
    console.error('Error in fetchTokenPrices:', error);
    throw error;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse | { error: string, details?: string }>
) {

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    console.log('Starting marketPrices API handler');
    
    // Check if Moralis API key exists
    if (!process.env.NEXT_MORALIS_API_KEY) {
      console.error('NEXT_MORALIS_API_KEY environment variable is missing');
      return res.status(500).json({ 
        error: 'Moralis API key not configured',
        details: 'NEXT_MORALIS_API_KEY environment variable is missing'
      });
    }
    
    console.log('Initializing Moralis...');
    await initMoralis();
    
    console.log('Fetching token prices...');
    const prices = await fetchTokenPrices();
    
    console.log('Successfully fetched prices:', prices);
    res.status(200).json(prices);
  } catch (error) {
    console.error('Error in marketPrices handler:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : 'No stack trace';
    
    console.error('Error details:', errorMessage);
    console.error('Error stack:', errorStack);
    
    res.status(500).json({ 
      error: 'An error occurred while fetching prices',
      details: errorMessage
    });
  }
}