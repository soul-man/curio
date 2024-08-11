import React from 'react';
import Spinner from '../Spinner';
import ApexChart from '../ApexChart';

const CardChartMarketPrice = (props: any) => {

  if (!props.loaded) {
    return (
      <>
          <div className="col-span-12 flex overflow-hidden relative flex-col p-8 text-2xl font-extralight text-white">
          <Spinner />
          </div>
      </>
    );
  } else {
    return (
      <div className="col-span-12 p-2 mt-10 bg-black/40 rounded-md">
        <ApexChart data={props.historicalData}/>
      </div>
    );
  }
};

export default CardChartMarketPrice;
