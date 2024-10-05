import React from 'react';
import { TiArrowSortedUp, TiArrowSortedDown } from 'react-icons/ti';
import { format } from 'timeago.js';
import { GradientHeaderH4 } from '../ui/GradientHeaderH4';

type PriceChangePeriod = '24h' | '7d' | '14d' | '30d' | '60d';

interface MarketDataDetailsProps {
  marketData: {
    marketPrice: number;
    marketPriceLow_24h: number;
    marketPriceHigh_24h: number;
    ath: number;
    athTime: string;
    athChange: string;
    atl: number;
    atlTime: string;
    atlChange: string;
  } & {
    [K in `priceChange_${PriceChangePeriod}`]: string;
  };
}

const MarketDataDetails: React.FC<MarketDataDetailsProps> = ({ marketData }) => {
  return (
    <div className="col-span-12 lg:col-span-6 flex flex-col md:flex-row flex-wrap justify-between gap-2 border-b border-blue-600/10 p-2 md:p-5">
      <div className="grid grid-cols-12 gap-2 w-full">
        <div className="order-1 col-span-12 md:col-span-6 flex flex-col w-full p-4 py-3 bg-blue-500/10 rounded-sm">
          <GradientHeaderH4 headline="24h High/Low" />
          <div className="flex justify-between mb-3">
            <div>
              <span className="text-sm md:text-md">${marketData.marketPriceLow_24h}</span>
              <div className="text-xs text-blue-300/70">Low</div>
            </div>
            <div className="text-right">
              <span className="text-sm md:text-md">${marketData.marketPriceHigh_24h}</span>
              <div className="text-xs text-blue-300/70">High</div>
            </div>
          </div>
          <div className="relative h-2 bg-blue-900/30 rounded-sm mb-2">
            <div 
              className="absolute h-full bg-blue-500 rounded-sm"
              style={{
                width: `${((marketData.marketPrice - marketData.marketPriceLow_24h) / (marketData.marketPriceHigh_24h - marketData.marketPriceLow_24h)) * 100}%`
              }}
            ></div>
            <div 
              className="absolute w-0 top-3 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-t-white"
              style={{
                left: `calc(${((marketData.marketPrice - marketData.marketPriceLow_24h) / (marketData.marketPriceHigh_24h - marketData.marketPriceLow_24h)) * 100}% - 4px)`,
                bottom: '-4px'
              }}
            ></div>
            <div 
              className="absolute mt-3 text-[10px] text-center whitespace-nowrap"
              style={{
                left: `calc(${((marketData.marketPrice - marketData.marketPriceLow_24h) / (marketData.marketPriceHigh_24h - marketData.marketPriceLow_24h)) * 100}% - 20px)`,
                top: '8px'
              }}
            >
              ${marketData.marketPrice}
            </div>
          </div>
        </div>
        <div className="order-3 col-span-12 md:col-span-6 md:order-2 flex flex-row gap-2 w-full">
          <div className='w-full text-center bg-blue-600/10 rounded-sm py-3'>
            <GradientHeaderH4 headline="ATH" />
            <div className="text-sm md:text-md mb-1">${marketData.ath}</div>
            <div className="text-xs text-blue-300/70">{marketData.athTime}</div>
            <div className="text-[10px] mb-1 text-blue-300/50">({format(new Date(marketData.athTime), 'PP')})</div>
            <div className={"inline-flex items-center text-xs " + (parseFloat(marketData.athChange) > 0 ? 'text-green-500' : 'text-red-500')}>
              {parseFloat(marketData.athChange) > 0 ? <TiArrowSortedUp className="mr-0.5 text-green-500" /> : <TiArrowSortedDown className="mr-0.5 text-red-500" />}
              {Math.abs(parseFloat(marketData.athChange)).toFixed(2)}%
            </div>
          </div>
          <div className="w-full text-center bg-blue-600/10 rounded-sm py-3">
            <GradientHeaderH4 headline="ATL" />
            <div className="text-sm md:text-md mb-1">${marketData.atl}</div>
            <div className="text-xs text-blue-300/70">{marketData.atlTime}</div>
            <div className="text-[10px] mb-1 text-blue-300/50">({format(new Date(marketData.atlTime), 'PP')})</div>
            <div className={"inline-flex items-center text-xs " + (parseFloat(marketData.atlChange) > 0 ? 'text-green-500' : 'text-red-500')}>
              {parseFloat(marketData.atlChange) > 0 ? <TiArrowSortedUp className="mr-0.5 text-green-500" /> : <TiArrowSortedDown className="mr-0.5 text-red-500" />}
              {Math.abs(parseFloat(marketData.atlChange)).toFixed(2)}%
            </div>
          </div>
        </div>
        <div className="order-2 col-span-12 md:order-3 flex flex-col w-full md:my-0 p-4 py-3 bg-blue-700/10 rounded-sm">
          <GradientHeaderH4 headline="Price Change" />
          <div className="flex flex-row justify-between w-full gap-1 md:gap-1 mt-1">
            {(['24h', '7d', '14d', '30d', '60d'] as const).map((period) => {
              const key = `priceChange_${period}` as const;
              return (
                <div key={period} className='flex flex-row flex-wrap md:flex-nowrap items-center md:gap-0'>
                  <div className="min-w-[23px] text-[10px] md:text-xs text-blue-300/70">{period}</div>
                  <div className={`inline-flex items-center rounded-md text-[10px] md:text-xs ${parseFloat(marketData[key]) > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {parseFloat(marketData[key]) > 0 ? <TiArrowSortedUp className="mr-0.5 text-green-500" /> : <TiArrowSortedDown className="mr-0.5 text-red-500" />}
                    {Math.abs(parseFloat(marketData[key])).toFixed(2)}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketDataDetails;