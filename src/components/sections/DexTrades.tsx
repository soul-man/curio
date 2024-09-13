import React, { useRef, useState, useEffect } from 'react';
import useSWR from 'swr';
import Image from 'next/image';
import TradesTable from './dexTrades/Trades';

const fetcher = (url: string) => fetch(url).then((res) => res.json())

// Custom hook for intersection observer
const useIntersectionObserver = (options = {}): [React.RefObject<any>, boolean] => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef<any>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref, options]);

  return [ref, isIntersecting];
};

const DexTrades = () => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.7 });
  
  const { data: uniswapData = { 
    trades: [], 
    liquidity: {
      ETH: { usdValue: '0', WETH: '0', CGT: '0' },
      BSC: { usdValue: '0', WBNB: '0', CGT: '0' }
    }
  } } = useSWR('/api/uniswap-data', fetcher, { 
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 0,
    dedupingInterval: 900000 // 15 minutes
  })

  const { data: marketPrices = {} } = useSWR(
    isVisible ? '/api/marketPrices' : null,
    fetcher,
    { 
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 0,
      dedupingInterval: 900000 // 15 minutes
    }
  )

  return (
    <div ref={ref}>
      <TradesTable trades={uniswapData.trades} marketPrices={marketPrices} />
    </div>
  );
};

export default DexTrades;