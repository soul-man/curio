import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    // Only return the provider URL, not other sensitive env vars
    const providerUrl = process.env.NEXT_CURIO_PROVIDER;
    
    if (!providerUrl) {
      return res.status(500).json({ error: 'Provider URL not configured' });
    }

    return res.status(200).json({ providerUrl });
  } catch (error) {
    console.error('Error getting provider config:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}