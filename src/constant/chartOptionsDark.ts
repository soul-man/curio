import { ApexOptions } from 'apexcharts';

export const chartOptionsDark: ApexOptions = {
    chart: {
        foreColor: '#ffffff',
        height: 200,
        toolbar: {
            show: false,
        },
        zoom: {
            enabled: false,
        }
    },
    
    colors: [ '#2463EB'],
    fill: {
        colors: ['#2463EB'],
        opacity: 0,
        type: 'solid'
    },
    tooltip: {
        enabled: true,
        shared: true,
        followCursor: true,
        intersect: false,
        inverseOrder: false,
        custom: function ({ series, seriesIndex, dataPointIndex, w }: {
            series: any;
            seriesIndex: number;
            dataPointIndex: number;
            w: any;
          }) {
            var today = new Date(w.globals.labels[dataPointIndex]);
            return (
                '<div class="px-2 py-1 bg-white text-black font-light">' +
                "<span>" +
                today.toLocaleDateString("en-US", { month: 'short', day: 'numeric' }) + ", " + today.getFullYear() +
                "<br />$" +
                series[seriesIndex][dataPointIndex].toFixed(4) +
                "</span>" +
                "</div>"
            );
        },
        fillSeriesColor: true,
        // theme: true,
        style: {
            fontSize: '12px',
            fontFamily: undefined,
        },
        onDatasetHover: {
            highlightDataSeries: true,
        },
        marker: {
            show: true,
        },
        fixed: {
            enabled: false,
            position: 'topRight',
            offsetX: 0,
            offsetY: 0,
        },
    },
    grid: {
        show: true,
        borderColor: '#213B69',
        strokeDashArray: 0,
        position: 'back',
        xaxis: {
            lines: {
                show: false
            }
        },
        yaxis: {
            lines: {
                show: true
            }
        },
        column: {
            colors: undefined,
            opacity: 0.0
        },
        padding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 20
        },
    },
    dataLabels: {
        enabled: false,
    },
    legend: {
        show: false
    },
    stroke: {
        show: true,
        curve: 'smooth',
        lineCap: 'butt',
        colors: ['#0A85E1'],
        width: 3,
        dashArray: 0,
    },
    xaxis: {
        axisBorder: {
            show: false
        },
        axisTicks: {
            show: true
        },
        tooltip: {
            enabled: false,
        },
        labels: {
            show: true,
            hideOverlappingLabels: false,
            offsetY: 20,
            rotate: 360,
            style: {
                colors: ['#ffffff'],
                fontSize: '12px',
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontWeight: 300,
                cssClass: 'apexcharts-xaxis-label',
            },
            formatter: function (val: any) {
                var today = new Date(val);
                return today.toLocaleDateString("en-US", { month: 'short', day: 'numeric' })
            },
        },
    },
    yaxis: {
        axisBorder: {
            show: false
        },
        axisTicks: {
            show: false,
        },
        tooltip: {
            enabled: false,
        },
        tickAmount: 5,
        labels: {
            show: true,
            style: {
                colors: ['#ffffff'],
                fontSize: '11px',
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontWeight: 300,
                cssClass: 'apexcharts-yaxis-label',
            },
            offsetX: 0,
            offsetY: 0,
            rotate: 0,
            formatter: function (val: any) {
                return "$ " + val.toFixed(3);
            }
        }
    },
};