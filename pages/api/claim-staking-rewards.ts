import { NextApiRequest, NextApiResponse } from 'next';
import { ApiPromise, WsProvider } from '@polkadot/api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { address, signature } = req.body;

  if (!address || !signature) {
    return res.status(400).json({ error: 'Address and signature are required' });
  }

  let api: ApiPromise | null = null;

  try {
    // Connect to the Curio Chain
    const provider = new WsProvider(process.env.NEXT_CURIO_PROVIDER);
    api = await ApiPromise.create({ provider });

    // Create the transaction
    const tx = api.tx.parachainStaking.claimRewards();

    // Send the pre-signed transaction
    const txHash = await api.rpc.author.submitExtrinsic(signature);

    res.status(200).json({ 
      message: 'Claim rewards transaction submitted',
      transactionHash: txHash.toHex()
    });
  } catch (error) {
    console.error('Error claiming rewards:', error);
    res.status(500).json({ 
      error: 'Failed to claim rewards', 
      details: error instanceof Error ? error.message : String(error) 
    });
  } finally {
    if (api) {
      await api.disconnect();
    }
  }
}