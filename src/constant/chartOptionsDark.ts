import { ApexOptions } from 'apexcharts';

export const chartOptionsDark: ApexOptions = {
    chart: {
        foreColor: '#5E6DAA',
        // height: 170,
        toolbar: {
            show: false,
        },
        zoom: {
            enabled: false,
        }
    },
    
    colors: [ '#1092EF'], // Start color (blue)
    fill: {
        // colors: ['#2463EB'],
        // opacity: 0.9,
        type: 'gradient',
        gradient: {
          shade: 'light',
          type: 'vertical',
          shadeIntensity: 0.5,
          gradientToColors: ['#1092EF'], // End color (black)
          inverseColors: false,
          opacityFrom: 0.9,
          opacityTo: 0.9, // End color opacity
          stops: [0, 100]
        }
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
        borderColor: '#333B5C',
        strokeDashArray: 5,
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
        colors: ['#FFFFFF'],
        width: 0,
        dashArray: 0,
    },
    xaxis: {
        axisBorder: {
            show: false
        },
        axisTicks: {
            show: true,
            offsetY: 13,
        },
        tooltip: {
            enabled: false,
        },
        labels: {
            show: false,
            hideOverlappingLabels: false,
            offsetY: 28,
            rotate: 360,
            style: {
                colors: ['#5E6DAA'],
                fontSize: '12px',
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontWeight: 300,
                cssClass: 'apexcharts-xaxis-label',
            },
            formatter: function (val: any, timestamp: number) {
                const date = new Date(timestamp);
                return date.toLocaleDateString("en-US", { month: 'short', day: 'numeric' });
              },
        },
        tickPlacement: 'on',
        tickAmount: undefined,
        min: undefined,
        max: undefined,
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
                colors: ['#5E6DAA'],
                fontSize: '11px',
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontWeight: 300,
                cssClass: 'apexcharts-yaxis-label',
            },
            offsetX: -15,
            offsetY: 0,
            rotate: 0,
            formatter: function (val: any) {
                return "$ " + val.toFixed(3);
            }
        }
    },
};