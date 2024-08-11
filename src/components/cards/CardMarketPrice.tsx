import React from 'react';
import Spinner from '../Spinner';
import { abbreviateNumber } from '../../utils/helpers';

const CardMarketPrice = (props: any) => {

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
        <div className="col-span-12 md:col-span-6 flex overflow-hidden relative flex-col text-neutral-900">
          <div className="relative mb-2 font-thin text-white/70 text-lg">
            Market Price
          </div>
          <div className="mb-3 relative text-5xl font-bold text-white">
            <span className="font-extralight">$</span>{" "}
            {props.marketPrice}
          </div>
          <div className="relative text-md font-extralight mb-8">
            <span className="text-neutral-100 pr-2">Change:</span>
            <span className={"bg-black/40 px-2 py-1 rounded-md " + (parseInt(props.priceChange) > 0 ? 'text-green-500' : 'text-red-500')}>
              {props.priceChange > 0 ? '+' : ''}
              {props.priceChange} %
            </span>
          </div>
        </div>
        <div className="col-span-12 md:col-span-6 flex overflow-hidden relative flex-col text-neutral-900">
          <div className="mb-2 text-lg font-thin text-white/70">
            Market Cap
          </div>
          <div className="text-5xl font-bold text-white dark:text-white mb-8">
            <span className="font-extralight">$</span>{" "}
            {abbreviateNumber(props.marketCap)}
          </div>
        </div>
      </>
    );
  }
};

export default CardMarketPrice;
