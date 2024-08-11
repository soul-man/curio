import React from 'react';
import useSWR from 'swr'
import TradesTable from './Trades';

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const DexTrades = () => {

  const { data: uniswapData = { 
    trades: [], 
    liquidity: {
      ETH: { usdValue: '0', WETH: '0', CGT: '0' },
      BSC: { usdValue: '0', WBNB: '0', CGT: '0' }
    }
  } } = useSWR('/api/uniswap-data?tokenAddress=0x0E186357c323c806C1efdad36D217F7a54b63D18', fetcher, { 
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 0,
    dedupingInterval: 900000 // 15 minutes
  })
  const { data: marketPrices = {} } = useSWR('/api/marketPrices', fetcher, { 
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 0,
    dedupingInterval: 900000 // 15 minutes
  })

  return (
    <>
      <TradesTable trades={uniswapData.trades} liquidity={uniswapData.liquidity} marketPrices={marketPrices} />
    </>
  );
};

export default DexTrades;
