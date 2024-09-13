import React, { useState, useEffect } from 'react';
import { GradientHeaderH4 } from '@/components/ui/GradientHeaderH4';
import { Skeleton } from "@/components/ui/render-skeleton";
import { abbreviateNumber } from '../../utils/helpers';

const MarketCap = (props: any) => {
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSkeleton(false), 2000);
    return () => clearTimeout(timer);
  }, []);

    return (
      <>
        <div className="col-span-6 md:col-span-6 lg:col-span-4 flex overflow-hidden flex-col">
          <GradientHeaderH4 headline="Market Cap" />
          <div className="text-2xl md:text-3xl font-bold text-white dark:text-white mb-8">
            {showSkeleton || Number(props.marketCap) === undefined ? (
              <Skeleton className="bg-blue-700/30 mt-1 h-7 w-24" />
            ) : (
              <div>
                <span className="font-extralight">$</span>{" "}
                {abbreviateNumber(props.marketCap)}              
              </div>
            )} 
          </div>
        </div>
      </>
    );
};

export default MarketCap;