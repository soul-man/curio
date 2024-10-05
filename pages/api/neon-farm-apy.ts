import { NextApiRequest, NextApiResponse } from 'next';
import BigNumber from 'bignumber.js';
import { getNeonFarms } from '@/utils/api/neonFarms';
// import { getEthereumFarms } from '../../utils/ethereumFarms';
// import { getTonFarms } from '../../utils/tonFarms';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { cgtPriceUsd, jsolPriceUsd, usdcPriceUsd, sushiPriceUsd } = req.query;

    if (!cgtPriceUsd || !jsolPriceUsd || !usdcPriceUsd || !sushiPriceUsd) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const cgtPrice = new BigNumber(cgtPriceUsd as string);
    const jsolPrice = new BigNumber(jsolPriceUsd as string);
    const usdcPrice = new BigNumber(usdcPriceUsd as string);
    const sushiPrice = new BigNumber(sushiPriceUsd as string);

    const [neonFarms] = await Promise.all([
      getNeonFarms(cgtPrice, jsolPrice, usdcPrice, sushiPrice),
      // getEthereumFarms(cgtPrice, ethPrice, usdcPrice),
      // getTonFarms(cgtPrice, tonPrice, usdtPrice)
    ]);

    res.status(200).json({
      neonFarms,
      // ethereumFarms,
      // tonFarms
    });
  } catch (error) {
    console.error('Error calculating farms:', error);
    res.status(500).json({ error: 'Failed to calculate farms', message: error instanceof Error ? error.message : String(error) });
  }
}