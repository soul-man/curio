import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import useSWR from 'swr';
import { IntroLoader, IntroHero, IntroStats } from './';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Intro: React.FC = () => {
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [vhToPixels, setVhToPixels] = useState(0);

  const { scrollY } = useScroll();
  
  // Use vh units instead of fixed pixels
  const startScroll = 30; // 30vh
  const endScroll = 70; // 70vh

  useEffect(() => {
    // Set initial vhToPixels value
    setVhToPixels(window.innerHeight / 100);

    // Update vhToPixels on window resize
    const handleResize = () => {
      setVhToPixels(window.innerHeight / 100);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const y = useTransform(scrollY, 
    [0, endScroll * vhToPixels], 
    ['0%', '50%']
  );
  const opacity = useTransform(scrollY, 
    [startScroll * vhToPixels, endScroll * vhToPixels], 
    [1, 0]
  );

  const { data: marketData = {
    marketPrice: 0,
    priceChange: 0,
    marketCap: 0,
    volume: 0,
    historicalData: [],
    ath: 0,
    athTime: '',
    athChange: 0,
    atl: 0,
    atlTime: '',
    atlChange: 0
  } } = useSWR('/api/cgtMarketData', fetcher, { 
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 0,
    dedupingInterval: 900000 // 15 minutes
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkeleton(false);
      setIsLoading(false);
      window.scrollTo(0, 0);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading ? (
        <IntroLoader />
      ) : (
        <motion.div 
          // style={{ y, opacity }}
          key="content"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-screen-2xl mb-36 md:mb-44 lg:mb-72"
        >
          <IntroHero />
          <IntroStats showSkeleton={showSkeleton} marketData={marketData} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Intro;