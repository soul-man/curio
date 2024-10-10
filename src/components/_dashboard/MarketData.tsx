import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { format } from 'timeago.js';
import CardLayout from '@/components/layout/common/CardLayout';
import MarketPrice from './MarketData_MarketPrice';
import MarketCap from './MarketData_MarketCap';
import Volume from './MarketData_Volume';
import ChartMarketPrice from './MarketData_MarketPriceChart';
import MarketDataDetails from './MarketDataDetails';
import { GradientHeaderH4 } from '@/components/ui/GradientHeaderH4';
import { TiArrowSortedUp, TiArrowSortedDown } from "react-icons/ti";

interface MarketDataProps {
  marketData: any;
}

const MarketData: React.FC<MarketDataProps> = ({ marketData }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });


  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const backgroundVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1 } },
  };

  const contentVariants = {
    hidden: { y: -50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className="col-span-12 lg:col-span-6 p-2 md:p-5 md:border-b md:border-t border-blue-500/10"
    >
      <motion.div variants={backgroundVariants} className="h-full">
        <CardLayout gradientStart="from-blue-600/20" gradientEnd="to-transparent" padding="p-3 lg:p-5">
          <motion.div variants={contentVariants}>
            <div className="grid grid-cols-12 gap-1 rounded-md h-full">
              <MarketPrice 
                marketPrice={marketData.marketPrice} 
                priceChange_24h={marketData.priceChange_24h} 
                marketPriceHigh_24h={marketData.marketPriceHigh_24h}
                marketPriceLow_24h={marketData.marketPriceLow_24h}
              />
              <MarketCap marketCap={marketData.marketCap} />
              <Volume volume={marketData.volume} />
              <ChartMarketPrice historicalData={marketData.historicalData} />
            </div>
          </motion.div>
        </CardLayout>
      </motion.div>
    </motion.div>
  );
};

export default MarketData;