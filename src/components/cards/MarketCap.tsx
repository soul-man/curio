import React from 'react';
import { GradientHeaderH4 } from '@/components/ui/GradientHeaderH4';
import Spinner from '../Spinner';
import { abbreviateNumber } from '../../utils/helpers';

const MarketCap = (props: any) => {

  if (!props.loaded) {
    return (
      <>
          <div className="col-span-6 flex overflow-hidden relative flex-col p-8 text-2xl font-extralight text-white">
            <Spinner />
          </div>
      </>
    );
  } else {
    return (
      <>
        <div className="col-span-6 md:col-span-6 lg:col-span-4 flex overflow-hidden flex-col">
          <GradientHeaderH4 headline="Market Cap" />
          <div className="text-2xl md:text-3xl font-bold text-white dark:text-white mb-8">
            <span className="font-extralight">$</span>{" "}
            {abbreviateNumber(props.marketCap)}
          </div>
        </div>
      </>
    );
  }
};

export default MarketCap;