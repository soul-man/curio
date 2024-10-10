import React, { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { chartOptionsDark } from '@/constant/chartOptionsDark';
import { ApexOptions } from 'apexcharts';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const CardChartMarketPrice = (props: any) => {
  const [timeRange, setTimeRange] = useState(30);

  const filterData = (days: number): [number, number][] => {
    if (!Array.isArray(props.historicalData) || props.historicalData.length === 0) {
      return [];
    }
    return props.historicalData.slice(-days);
  };

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const series = useMemo(() => [{
    data: filterData(timeRange).map(([timestamp, price]) => ({
      x: timestamp,
      y: price
    }))
  }], [props.historicalData, timeRange]);

  const handleTimeRangeChange = (days: number) => {
    setTimeRange(days);
  };

  if (!props.historicalData || props.historicalData.length === 0) {
    return (
      <div className="col-span-12 flex overflow-hidden relative flex-col p-8 text-2xl font-extralight text-white">
        No data available for the selected time range.
      </div>
    );
  }

  const chartOptions: ApexOptions = {
    ...chartOptionsDark,
    xaxis: {
      ...chartOptionsDark.xaxis,
      tickAmount: timeRange,
    }
  };

  const filteredData = filterData(timeRange);
  const firstDay = formatDate(filteredData[0][0]);
  const lastDay = formatDate(filteredData[filteredData.length - 1][0]);

  return (
    <div className="col-span-12">
      <div className="flex justify-end space-x-2 pr-3">
        {[7, 14, 30].map((days) => (
          <button
            key={days}
            onClick={() => handleTimeRangeChange(days)}
            className={`text-xs lg:text-sm w-8 md:w-10 py-0.5 rounded ${
              timeRange === days ? 'bg-blue-500/50 text-blue-200' : 'bg-blue-700/30 text-blue-300/50'
            }`}
          >
            {days}d
          </button>
        ))}
      </div>
      <Chart height="270px" options={chartOptions} series={series} type="area" />
      <div className="flex justify-between -mt-4 text-sm text-gray-400">
        <span className="pl-16 text-blue-300/40 text-xs">{firstDay}</span>
        <span className="text-blue-300/40 text-xs">{lastDay}</span>
      </div>
    </div>
  );
};

export default CardChartMarketPrice;