import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import CardLayout from '@/components/layout/common/CardLayout';
import { motion, useInView } from 'framer-motion';

import { Skeleton } from "@/components/ui/render-skeleton";
import { PoolData } from '@/constant/types/PoolData';

interface PoolCardProps {
  index: number;
  pool: PoolData;
}

const PoolCard: React.FC<PoolCardProps> = ({ pool, index }) => {
  const [showSkeleton, setShowSkeleton] = useState(true);
  // const [usdValue, setUsdValue] = useState(0.00);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.7 });

  const itemVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
        delay: index * 0.15, // Add delay based on index
      },
    },
  };

  useEffect(() => {
    const timer = setTimeout(() => setShowSkeleton(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // useEffect(() => {
  //   const calculateUsdValue = () => {
  //     try {
  //       if (!marketPrices) {
  //         console.log('marketPrices is undefined');
  //         return '0.00';
  //       }
    
  //       const token1Price = marketPrices[pool.token1Symbol.toLowerCase()] || 0;
  //       const ratio = Number(pool.token1Amount) / Number(pool.token0Amount);
  //       const usdValue = token1Price * ratio;
  
  //       setUsdValue(Number(usdValue));
  //       // return usdValue.toFixed(4);
  //     } catch (error) {
  //       console.error('Error calculating USD value:', error);
  //       return '0.00';
  //     }
  //   };
  //   calculateUsdValue();
  // }, [marketPrices]);

  return (
    <motion.div 
      ref={ref}
      variants={itemVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"} 
      className="col-span-6 md:col-span-6 lg:col-span-3"
    >
      <CardLayout gradientStart={pool.gradientStart} gradientEnd={pool.gradientEnd} padding="p-0">
        <div className="flex flex-col items-center justify-between gap-2 md:gap-3 h-full">
          <div className="flex flex-row gap-2 justify-center items-center w-fit bg-black/30 text-blue-300 text-center border-b border-blue-500/20 py-0.5 px-4 rounded-b-md">
            <a href={pool.exchangeLink} target="_blank" rel="noopener noreferrer">
              <span className="px-0.5 py-0.5 text-xs">
                {pool.dex}
              </span>
            </a>
            <Image src={pool.dexIcon} width="20" height="20" className="w-5 h-5" alt={pool.dex} />
          </div>

          <div className="flex flex-col md:flex-row lg:flex-row md:w-full rounded-md justify-center gap-2 md:gap-4">
            <div className="flex flex-col relative justify-center items-center">
              <div className="flex flex-row mb-0 lg:mb-0 -space-x-2 relative justify-center items-center">
                <Image src="/images/tokens/cgt.png" alt="CGT" width="25" height="25" className="w-8 h-8 md:w-10 md:h-10 lg:mr-0" />
                <Image src={pool.icon} alt={pool.chain} width="25" height="25" className="bg-white rounded-full p-[1px] w-8 h-8 md:w-10 md:h-10"/>
              </div>
            </div>
            <div>
              <div className="-mb-1 text-lg md:text-xl font-light text-white text-center lg:text-left">
                {pool.name}
              </div>
              <div className="text-sm md:text-lg text-white font-bold text-center lg:text-left">
                {showSkeleton || Number(pool.usdValue) === undefined ? (
                  <Skeleton className="h-6 w-24 bg-blue-700/30 pt-1" />
                ) : (
                  `$${Number(pool.usdValue).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`
                )}          
              </div>
              {/* <div className="text-xs text-blue-300/80 text-center lg:text-left">
                {showSkeleton || Number(usdValue) === undefined ? (
                  <Skeleton className="h-4 w-20 bg-blue-700/30" />
                ) : (
                  `$${Number(usdValue).toLocaleString('en-US', {minimumFractionDigits: 4, maximumFractionDigits: 4})}`
                )}   
              </div> */}
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-2 justify-around text-center w-full font-light text-xs text-blue-300/80 mb-3">
            {showSkeleton || Number(pool.token0Amount) === undefined ? (
              <Skeleton className="bg-blue-700/30 h-5 w-24" />
            ) : (
              <div>
                {Number(pool.token0Amount).toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0})} 
                <span className={`ml-2 px-0.5 ${pool.bgColor} bg-opacity-30 rounded-sm`}>{pool.token0Symbol}</span>
              </div>
            )}  

            {showSkeleton || Number(pool.token1Amount) === undefined ? (
              <Skeleton className="bg-blue-700/30 h-5 w-24" />
            ) : (
              <div>
                {Number(pool.token1Amount).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})} 
                <span className={`ml-2 px-0.5 ${pool.bgColor} bg-opacity-30 rounded-sm`}>{pool.token1Symbol}</span>
              </div>
            )} 
          </div>

        </div>
        <div className={`${pool.bgColor} flex flex-row justify-center items-center text-sm font-normal w-full py-1 text-center text-white/80`}>
          {pool.chain}
          {/* Blockchain Explorer Link */}
          {pool.explorerLink !== "#" && pool.poolAddress !== "To be determined" && (
            <a 
              href={pool.explorerLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="ml-1 p-1 hover:bg-blue-500/20 rounded transition-colors duration-200"
              title={`View pool on blockchain explorer: ${pool.poolAddress}`}
            >
              <svg 
                className="w-4 h-4 text-white/80 hover:text-blue-100" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
                />
              </svg>
            </a>
          )}
        </div>
      </CardLayout>
    </motion.div>
  );
};

export default PoolCard;