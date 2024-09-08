import React from 'react';
import CardLayout from '@/components/layout/common/CardLayout';
import { GradientHeaderH4 } from '@/components/ui/GradientHeaderH4';
import Spinner from '../Spinner';

const CardAth = (props: any) => {

  if (!props.loaded) {
    return (
      <>
          <div className="col-span-12 flex overflow-hidden relative flex-col p-8 text-2xl font-extralight text-white rounded-2xl">
            <Spinner />
          </div>
      </>
    );
  } else {
    return (
      <div className="col-span-6 md:col-span-2 flex flex-col md:flex-row gap-3 md:gap-5 p-5 border-r md:border-b border-blue-500/10 text-center">
        <div className="flex flex-col h-full w-full">
          <GradientHeaderH4 headline="All-Time High" />
          <div className="flex flex-col md:flex-col gap-3 mt-1 md:gap-4 items-center justify-center h-full">
            <div className="flex flex-col text-white">
              <div className="text-xl font-semibold">
                ${props.ath}
              </div>
              <div className="text-sm text-blue-300/70 font-light">
              {props.athTime}
              </div>
            </div>
            <div className={"bg-black/40 w-fit px-2 py-1 rounded-md text-xs " + (parseInt(props.athChange) > 0 ? 'text-green-500' : 'text-red-500')}>
              {props.athChange > 0 ? '+' : ''}
              {props.athChange} %
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default CardAth;
