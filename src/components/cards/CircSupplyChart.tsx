import React from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface CirculatingSupplyChartProps {
  supply: {
    cgtSupplyOnEth: number;
    cgtSupplyOnBsc: number;
    cgtSupplyOnKusama: number;
    cgtSupplyOnTon: number;
    cgtSupplyOnNeon: number;
  };
}

const CirculatingSupplyChart: React.FC<CirculatingSupplyChartProps> = ({ supply }) => {
  const rawData = [
    { chain: 'Ethereum', value: supply.cgtSupplyOnEth },
    { chain: 'BSC', value: supply.cgtSupplyOnBsc },
    { chain: 'Curio Chain', value: supply.cgtSupplyOnKusama },
    { chain: 'TON', value: supply.cgtSupplyOnTon },
    { chain: 'Neon', value: supply.cgtSupplyOnNeon },
  ].sort((a, b) => b.value - a.value); // Sort from highest to lowest

  const maxValue = Math.max(...rawData.map(item => item.value));
  const minDisplayValue = maxValue * 0.10; // 10% of max value

  const adjustedData = rawData.map(item => 
    Math.max(item.value, minDisplayValue)
  );

  const formatNumber = (num: number | undefined | null): string => {
    if (num === undefined || num === null) {
      return '0';
    }
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const chartOptions: ApexOptions = {
    chart: {
      type: 'bar',
      height: 400,
      foreColor: '#5E6DAA',
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '75%',
        distributed: true,
        dataLabels: {
          position: 'top',
        },
      },
    },
    dataLabels: {
      enabled: true,
      offsetY: -40,
      style: {
        fontSize: '10px',
        colors: ['#F4F6FF'],
      },
      formatter: function (val, opt) {
        const chainName = rawData[opt.dataPointIndex].chain;
        const formattedValue = formatNumber(rawData[opt.dataPointIndex].value);
        return `${chainName}\n${formattedValue}`;        
      },
    },
    xaxis: {
      categories: rawData.map(item => item.chain),
      labels: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        formatter: function (val) {
          return formatNumber(val);
        },
      },
    },
    colors: ['#3B82F6', '#60A5FA', '#EAB308', '#06B6D4', '#DB2777'],
    tooltip: {
      enabled: true,
      shared: true,
      intersect: false,
      custom: function({ series, seriesIndex, dataPointIndex, w }) {
        const value = rawData[dataPointIndex].value;
        const chainName = rawData[dataPointIndex].chain;
        return (
          '<div class="px-2 py-1 bg-white text-black font-light">' +
          "<span>" +
          chainName +
          "<br />" +
          value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " CGT" +
          "</span>" +
          "</div>"
        );
      },
    },
    grid: {
      borderColor: '#333B5C',
      strokeDashArray: 5,
    },
    legend: {
      show: false,
    },
  };

  return (
    <div>
      <Chart options={chartOptions} series={[{ data: adjustedData }]} type="bar" height={320} />
    </div>
  );
};

export default CirculatingSupplyChart;