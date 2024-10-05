import React from 'react';
import { motion } from 'framer-motion';
import { CommunityLinks, MarketPrice, StakingInfo, BuyCGT } from './';

interface MarketData {
  marketPrice?: number;
  priceChange?: number;
}

interface IntroStatsProps {
  showSkeleton: boolean;
  marketData: MarketData;
}

const IntroStats: React.FC<IntroStatsProps> = ({ showSkeleton, marketData }) => {
  return (
    <motion.div 
      className="grid grid-cols-12 gap-0 px-3 md:px-5 2xl:px-auto"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 1.8 }}
    >
      <div 
        className="col-span-12 sm:col-span-4 md:col-span-4"
      >
        <div className="h-full md:border-r border-b border-blue-500/20 py-3">
          <motion.div 
            className='flex flex-col text-center md:text-left md:gap-2'
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 8 }}
          >
            <h4 className="text-lg lg:text-xl font-light text-blue-500">
              Dedicated to Curio Invest
            </h4>
            <p className="text-sm md:text-md lg:text-lg font-extralight text-blue-100/80">
              This info page is dedicated to <a href="https://curioinvest.com/" target="_blank" rel="noopener noreferrer" className="underline font-light">Curio Invest</a>, a RWA tokenization platform with its native token CGT.
            </p>
          </motion.div>
        </div>
      </div>

      <CommunityLinks />
      <MarketPrice showSkeleton={showSkeleton} marketData={marketData} />
      <StakingInfo />
      <BuyCGT />
    </motion.div>
  );
};

export default IntroStats;