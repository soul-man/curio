import React from "react";
import { useTheme } from 'next-themes';
import dynamic from 'next/dynamic';
import { chartOptionsDark } from '@/constant/chartOptionsDark';
import { chartOptionsLight } from '@/constant/chartOptionsLight';

// Import Chart dynamically to avoid referenceError: window is not defined
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const ApexChart = (props: any) => {
    const {theme} = useTheme();

    const series = [{
        data: props.data
    }];

    if (theme === 'dark') {
        return <Chart height="300px" options={chartOptionsDark} series={series} type="area" />;
    } else {
        return <Chart height="300px" options={chartOptionsLight} series={series} type="area" />;
    }

};

export default ApexChart;
