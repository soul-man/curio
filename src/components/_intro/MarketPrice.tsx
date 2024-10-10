import React from 'react';
import { motion } from 'framer-motion';
import { Skeleton } from "@/components/ui/render-skeleton";

interface MarketPriceProps {
  showSkeleton: boolean;
  marketData: {
    marketPrice?: number;
    priceChange_24h?: number;
  };
}

const MarketPrice: React.FC<MarketPriceProps> = ({ showSkeleton, marketData }) => {
  return (
    <div 
      className="hidden md:block col-span-6 sm:col-span-4 md:col-span-3 lg:col-span-2"
    >
      <div className="h-full border-r border-b border-blue-500/20 px-5 py-3">
        <motion.div 
          className='flex flex-col gap-2 md:gap-1'
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
    
          >
          <h4 className="text-md lg:text-xl font-light text-blue-500">
            Market Price
          </h4>
          <div className="text-3xl font-bold text-white">
            {showSkeleton || marketData.marketPrice === undefined ? (
              <Skeleton className="h-8 w-32 bg-blue-950" />
            ) : (
              <><span className="font-extralight">$</span>{" "}
              {marketData.marketPrice}</>
            )}
          </div>
          <div className="font-extralight">
            {showSkeleton || marketData.priceChange_24h === undefined ? (
              <Skeleton className="h-4 w-20 bg-blue-950 inline-block" />
            ) : (
              <>
                <span className="text-blue-100/80 pr-2 text-sm">Change:</span>
                <span className={`px-2 rounded-md text-sm ${parseFloat(marketData.priceChange_24h.toString()) > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {marketData.priceChange_24h > 0 ? '+' : ''}
                  {marketData.priceChange_24h}%
                </span>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MarketPrice;