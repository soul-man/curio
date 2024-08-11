import type { NextApiRequest, NextApiResponse } from 'next';
import Moralis from 'moralis';
import { EvmChain, EvmEvent } from '@moralisweb3/common-evm-utils';

// Initialize Moralis outside of the handler function
const initMoralis = async () => {
  if (!Moralis.Core.isStarted) {
    await Moralis.start({ apiKey: process.env.NEXT_MORALIS_API_KEY });
  }
};

type ErrorResponse = {
  error: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Start Moralis
    await initMoralis();

    const response = await Moralis.EvmApi.events.getContractEvents({
      chain: EvmChain.BSC,
      topic: "Swap(address,address,uint256,uint256,uint256,uint256)",
      address: "0x626a93958F8C0906D119250c41eb50d46A0F9781",
      fromBlock: 41184366,
      toBlock: 41210475,
      abi: {
        anonymous: false,
        inputs: [
          { indexed: true, name: "sender", type: "address" },
          { indexed: true, name: "recipient", type: "address" },
          { indexed: false, name: "amount0In", type: "uint256" },
          { indexed: false, name: "amount1In", type: "uint256" },
          { indexed: false, name: "amount0Out", type: "uint256" },
          { indexed: false, name: "amount1Out", type: "uint256" }
        ],
        name: "Swap",
        type: "event"
      },
    });

    console.log(response.result)
    // res.status(200).json(response.result);
  } catch (error: unknown) {
    console.error('An error occurred:', error);
    
    let errorMessage = 'Internal Server Error';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
  
    res.status(500).json({ error: errorMessage });
  }
}