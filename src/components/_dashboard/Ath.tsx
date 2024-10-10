import React, { useEffect, useState } from 'react';
import { Skeleton } from "@/components/ui/render-skeleton"
import { GradientHeaderH4 } from '@/components/ui/GradientHeaderH4';

const CardAth = (props: any) => {

  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSkeleton(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="col-span-6 md:col-span-2 flex flex-col md:flex-row gap-3 md:gap-5 p-5 border-r md:border-b border-blue-500/10 text-center">
      <div className="flex flex-col h-full w-full">
        <GradientHeaderH4 headline="All-Time High" />
        <div className="flex flex-col md:flex-col gap-3 mt-1 md:gap-4 items-center justify-center h-full">
          <div className="flex flex-col items-center text-white">
            {showSkeleton || props.ath === undefined ? (
              <Skeleton className="bg-blue-700/30 mb-2 h-5 w-20" />
            ) : (
              <div className="text-xl font-semibold">
                ${props.ath}
              </div>
            )} 
            {showSkeleton || props.athTime === undefined ? (
              <Skeleton className="bg-blue-700/30 mb-2 h-4 w-20" />
            ) : (
              <div className="text-sm text-blue-300/70 font-light">
                {props.athTime}
              </div>
            )} 

          </div>

          {showSkeleton || props.athChange === undefined ? (
            <Skeleton className="bg-blue-700/30 mb-2 h-5 w-10" />
          ) : (
            <div className={"bg-black/40 w-fit px-2 py-1 rounded-md text-xs " + (parseInt(props.athChange) > 0 ? 'text-green-500' : 'text-red-500')}>
              {props.athChange > 0 ? '+' : ''}
              {props.athChange} %
            </div>
          )} 

        </div>
      </div>
    </div>
  );
};

export default CardAth;
