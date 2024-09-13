import React, { useState, useEffect }  from 'react';
import { GradientHeaderH4 } from '@/components/ui/GradientHeaderH4';
import { Skeleton } from "@/components/ui/render-skeleton"

const MarketPrice = (props: any) => {
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSkeleton(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div className="col-span-6 md:col-span-6 lg:col-span-4 flex overflow-hidden relative flex-col">
        <GradientHeaderH4 headline="Market Price" />
        <div className="mb-1 md:mb-3 text-2xl md:text-3xl font-bold text-white/90">
          {showSkeleton || props.marketPrice === undefined ? (
            <Skeleton className="bg-blue-700/30 mt-1 h-7 w-24" />
          ) : (
            <div>
              <span className="font-extralight">$</span>{" "}
              {props.marketPrice}
            </div>
          )}  
        </div>
        <div className="font-extralight">
          {showSkeleton || props.priceChange === undefined ? (
            <Skeleton className="bg-blue-700/30 h-5 w-14" />
          ) : (
            <>
              <span className={"bg-black/60 px-1 py-0.5 md:px-2 md:py-1 rounded-md text-sm " + (parseInt(props.priceChange) > 0 ? 'text-green-500' : 'text-red-500')}>
                {props.priceChange > 0 ? '+' : ''}
                {props.priceChange}%
              </span>
              <span className="text-blue-200 pl-2 text-sm md:text-md">24h</span>
            </>
          )} 
        </div>
      </div>
    </>
  );
};

export default MarketPrice;
