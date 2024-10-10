import React, { useState, useEffect }  from 'react';
import { motion } from 'framer-motion';
import { GradientHeaderH4 } from '@/components/ui/GradientHeaderH4';
import { Skeleton } from "@/components/ui/render-skeleton"
import { TiArrowSortedUp, TiArrowSortedDown } from "react-icons/ti";

const MarketPrice = (props: any) => {
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSkeleton(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const contentVariants = {
    hidden: { y: -50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
        delay: 0.3,
      },
    },
  };

  return (
    <motion.div variants={contentVariants} className="col-span-6 md:col-span-4 lg:col-span-4">
      <div className="flex flex-col">
        <GradientHeaderH4 headline="Market Price" />
        <div className="mb-1 md:mb-2 text-2xl md:text-3xl font-bold text-white/90">
          {showSkeleton || props.marketPrice === undefined ? (
            <Skeleton className="bg-blue-700/30 mt-1 h-7 w-24" />
          ) : (
            <div>
              <span className="font-extralight">$</span>{" "}
              {props.marketPrice}
            </div>
          )}  
        </div>
        <div className="font-normal">
          {showSkeleton || props.priceChange_24h === undefined ? (
            <Skeleton className="bg-blue-700/30 h-5 w-14" />
          ) : (
            <div className="flex flex-row items-center">
              <span className={"inline-flex items-center bg-black/40 px-1 py-0.5 md:px-1 md:py-0.5 rounded-md text-sm " + (parseFloat(props.priceChange_24h) > 0 ? 'text-green-500' : 'text-red-500')}>
                {parseFloat(props.priceChange_24h) > 0 ? <TiArrowSortedUp className="mr-0.5 text-green-500" /> : <TiArrowSortedDown className="mr-0.5 text-red-500" />}
                {Math.abs(parseFloat(props.priceChange_24h)).toFixed(2)}%
              </span>
              <span className="text-blue-300/80 pl-2 text-sm md:text-md">24h</span>
            </div>
          )} 
        </div>
      </div>
    </motion.div>
  );
};

export default MarketPrice;
