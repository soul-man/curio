import React, { useState } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { chartOptionsDark } from '@/constant/chartOptionsDark';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const CardChartMarketPrice = (props: any) => {
  const [timeRange, setTimeRange] = useState(30);

  const contentVariants = {
    hidden: { y: -50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
        delay: 0.3,
      },
    },
  };

  const filterData = (days: number) => {
    if (!Array.isArray(props.historicalData) || props.historicalData.length === 0) {
      return [];
    }
    const data = props.historicalData.slice(-days - 1, -1);
    return data;
  };

  const series = [{
    data: filterData(timeRange)
  }];

  const handleTimeRangeChange = (days: number) => {
    setTimeRange(days);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const filteredData = filterData(timeRange);

  if (filteredData.length === 0) {
    return (
      <div className="col-span-12 flex overflow-hidden relative flex-col p-8 text-2xl font-extralight text-white">
        No data available for the selected time range.
      </div>
    );
  }

  const firstDay = formatDate(filteredData[0][0]);
  const lastDay = formatDate(filteredData[filteredData.length - 1][0]);

  return (
    <div className="col-span-12">
    <div className="flex justify-end space-x-1">
      {[7, 14, 30].map((days) => (
        <motion.button
        variants={contentVariants}
          key={days}
          onClick={() => handleTimeRangeChange(days)}
          className={`text-xs w-8 py-0.5 font-light rounded ${
            timeRange === days ? 'bg-blue-500/50 text-blue-200' : 'bg-blue-700/30 text-blue-300/50'
          }`}
        >
          {days}d
        </motion.button>
      ))}
    </div>
    <Chart height="300px" options={chartOptionsDark} series={series} type="area" />
    <div className="flex justify-between -mt-4 text-[10px] text-gray-400">
        <span className="pl-16 text-[#5666A1]">{firstDay}</span>
        <span className="text-[#5666A1]">{lastDay}</span>
      </div>
  </div>
  );
  
};

export default CardChartMarketPrice;
