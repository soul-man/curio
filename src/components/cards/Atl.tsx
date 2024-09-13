import React, { useEffect, useState } from 'react';
import { Skeleton } from "@/components/ui/render-skeleton"
import { GradientHeaderH4 } from '@/components/ui/GradientHeaderH4';
import Spinner from '../Spinner';

const CardAtl = (props: any) => {

  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSkeleton(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="col-span-6 md:col-span-2 flex flex-col md:flex-row gap-3 md:gap-5 p-5 md:border-r md:border-b border-blue-500/10 text-center">
      <div className="flex flex-col h-full w-full">
        <GradientHeaderH4 headline="All-Time Low" />
        <div className="flex flex-col md:flex-col gap-3 mt-1 md:gap-4 items-center justify-center h-full">
          <div className="flex flex-col text-white">
            <div className="text-xl font-semibold">
              ${props.atl}
            </div>
            <div className="text-sm text-blue-300/70 font-light">
              {props.atlTime}
            </div>
          </div>
          <div className={"bg-black/40 w-fit px-2 py-1 rounded-md text-xs " + (parseInt(props.atlChange) > 0 ? 'text-green-500' : 'text-red-500')}>
            {props.atlChange > 0 ? '+' : ''}
            {props.atlChange} %
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardAtl;
