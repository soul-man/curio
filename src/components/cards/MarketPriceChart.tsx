import React from 'react';
import dynamic from 'next/dynamic';
import Spinner from '../Spinner';
import { chartOptionsDark } from '@/constant/chartOptionsDark';


const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const CardChartMarketPrice = (props: any) => {

  const series = [{
    data: props.historicalData
  }];

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
      <div className="col-span-12">
        <Chart height="270px" options={chartOptionsDark} series={series} type="area" />
      </div>
    );
  }
};

export default CardChartMarketPrice;
