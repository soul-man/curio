import React from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
import ChartWrapper from '@/components/ui/ChartWrapper';

const Chart = dynamic(() => import('react-apexcharts'), { 
  ssr: false,
  loading: () => <div className="text-white">Loading chart...</div>
});

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
  // Add safety checks for supply data
  if (!supply) {
    return (
      <div className="chart-container">
        <div className="flex items-center justify-center h-64 text-gray-400">
          No supply data available
        </div>
      </div>
    );
  }

  const rawData = [
    { chain: 'ETH', value: supply.cgtSupplyOnEth || 0 },
    { chain: 'BSC', value: supply.cgtSupplyOnBsc || 0 },
    { chain: 'CURIO', value: supply.cgtSupplyOnKusama || 0 },
    { chain: 'TON', value: supply.cgtSupplyOnTon || 0 },
    { chain: 'NEON', value: supply.cgtSupplyOnNeon || 0 },
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
      offsetY: -20,
      style: {
        fontSize: '11px',
        colors: ['#F4F6FF'],
      },
      formatter: function (val, opt) {
        return rawData[opt.dataPointIndex]?.chain || 'Unknown';
      },
    },
    xaxis: {
      type: 'category',
      categories: rawData.map(item => item.chain),
      labels: {
        show: false,
      },
      axisTicks: {
        color: '#5666A1',
      },
      axisBorder: {
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
        // Add safety checks for undefined values
        if (!rawData[dataPointIndex]) {
          return '<div class="px-2 py-1 bg-white text-black font-light"><span>No data</span></div>';
        }
        const value = rawData[dataPointIndex].value || 0;
        const chainName = rawData[dataPointIndex].chain || 'Unknown';
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
      borderColor: '#23273D',
      strokeDashArray: 5,
    },
    legend: {
      show: false,
    },
  };

  return (
    <div className="chart-container">
      <ChartWrapper>
        <Chart options={chartOptions} series={[{ data: adjustedData }]} type="bar" height={320} />
      </ChartWrapper>
    </div>
  );
};

export default CirculatingSupplyChart;