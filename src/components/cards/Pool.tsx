import React, { useState, useEffect } from 'react';
import CardLayout from '@/components/layout/common/CardLayout';
import { Skeleton } from "@/components/ui/render-skeleton";

interface PoolData {
  name: string;
  icon: string;
  exchangeLink: string;
  chain: string;
  usdValue: string;
  token0Amount: string;
  token1Amount: string;
  token0Symbol: string;
  token1Symbol: string;
  comingSoon?: boolean;
  bgColor: string;
  gradientStart: string;
  gradientEnd: string;
  dex: string;
  dexIcon: string;
}

const PoolCard: React.FC<{ pool: PoolData }> = ({ pool }) => {
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSkeleton(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="col-span-12 sm:col-span-4 md:col-span-4 lg:col-span-3">
      <CardLayout gradientStart={pool.gradientStart} gradientEnd={pool.gradientEnd} padding="p-0">
        <div className="flex flex-col items-center h-full">
          <div className="flex flex-row gap-2 justify-center items-center w-fit bg-black/30 text-blue-300 text-center border-b border-blue-300/30 py-1 px-4 mb-5 md:mb-3 lg:mb-5 rounded-b-md">
            <a href={pool.exchangeLink} target="_blank" rel="noopener noreferrer">
              <span className="px-0.5 py-0.5 text-xs">
                Buy on {pool.dex}
              </span>
            </a>
            <img src={pool.dexIcon} className="w-7 h-7 md:w-5 md:h-5" alt={pool.dex} />
          </div>

          <div className="flex flex-row lg:flex-row md:w-full rounded-md justify-center gap-5 lg:gap-5">
            <div className="flex flex-col relative justify-center items-center">
              <div className="flex flex-row mb-2 lg:mb-0 -space-x-2 relative justify-center items-center">
                <img src="/images/tokens/cgt.png" alt="CGT" className="w-10 h-10 lg:w-12 lg:h-12 lg:mr-0" />
                <img src={pool.icon} alt={pool.chain} className="bg-white rounded-full p-[1px] w-10 h-10 lg:w-12 lg:h-12"/>
              </div>
            </div>
            <div>
              <div className="text-xl md:text-lg lg:text-xl font-semibold text-white text-center lg:text-left">
                {pool.name}
              </div>
              <div className="text-md md:text-lg text-white font-light text-center lg:text-left">
                {showSkeleton || Number(pool.usdValue) === undefined ? (
                  <Skeleton className="h-6 w-24 bg-blue-700/30 pt-1" />
                ) : (
                  `$${Number(pool.usdValue).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`
                )}          
              </div>
            </div>
          </div>

          <div className="flex flex-row justify-around text-center w-full font-light text-sm text-blue-200/90  pt-1 my-3">
            {showSkeleton || Number(pool.token0Amount) === undefined ? (
              <Skeleton className="bg-blue-700/30 h-5 w-24" />
            ) : (
              <div>
                {Number(pool.token0Amount).toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0})} 
                  <span className={`ml-2 px-1 py-0.5 ${pool.bgColor} bg-opacity-30 rounded-sm`}>{pool.token0Symbol}</span>
              </div>
            )}  

            {showSkeleton || Number(pool.token1Amount) === undefined ? (
              <Skeleton className="bg-blue-700/30 h-5 w-24" />
            ) : (
              <div>
                {Number(pool.token1Amount).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})} 
                <span className={`ml-2 px-1 py-0.5 ${pool.bgColor} bg-opacity-30 rounded-sm`}>{pool.token1Symbol}</span>
              </div>
            )} 
          </div>

          <div className={`${pool.bgColor} text-sm font-normal w-full py-1 text-center text-black/90`}>
            {pool.chain}
          </div>

        </div>
      </CardLayout>
    </div>
  );
};

export default PoolCard;