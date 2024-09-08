import React, { useEffect, useState } from 'react';
import useSWR from 'swr'
import { FaFileContract, FaInfoCircle } from "react-icons/fa";
import { FaBridgeCircleCheck } from "react-icons/fa6";
import { FaBridgeCircleExclamation } from "react-icons/fa6";
import { CiFileOn } from "react-icons/ci";
import { CiCircleCheck } from "react-icons/ci";
import { CgUnavailable } from "react-icons/cg";
import CardLayout from '@/components/layout/common/CardLayout';
import MarketPrice from '../cards/MarketPrice';
import MarketCap from '../cards/MarketCap';
import Volume from '../cards/Volume';
import ChartMarketPrice from '../cards/MarketPriceChart';
import TotalLocked from '../cards/TotalLocked';
import PoolInfoCard from '../cards/PoolsBest';
import Ath from '../cards/Ath';
import Atl from '../cards/Atl';
import Spinner from '../Spinner';
import Tooltip from '@/components/ui/Tooltip';
import { GradientHeaderH4 } from '@/components/ui/GradientHeaderH4';
import CirculatingSupplyChart from '@/components/cards/CircSupplyChart';

import { abbreviateNumber } from '../../utils/helpers';

type ChainInfoType = {
  name: string;
  icon: string;
  contractUrl?: string;
  bridgeAvailable?: boolean;
  supplyKey?: string;
  comingSoon?: boolean;
  plannedRelaunch?: boolean;
}

type ChainSupplyItemProps = {
  chain: ChainInfoType;
  supply?: string;
  loaded?: boolean;
}

const chainInfo: Record<string, ChainInfoType> = {
  ethereum: {
    name: "Ethereum",
    icon: "./images/chains/ethereum-new.png",
    contractUrl: "https://etherscan.io/token/0x0E186357c323c806C1efdad36D217F7a54b63D18",
    bridgeAvailable: true,
    supplyKey: "cgtSupplyOnEth"
  },
  bsc: {
    name: "BSC",
    icon: "./images/chains/binance-chain.png",
    contractUrl: "https://bscscan.com/token/0x61632b49Df5CA20846b3220bFc42BDa5E32C81ad",
    bridgeAvailable: false,
    supplyKey: "cgtSupplyOnBsc"
  },
  curio: {
    name: "Curio Chain",
    icon: "./images/dex/capdex.png",
    contractUrl: "https://etherscan.io/token/0x0E186357c323c806C1efdad36D217F7a54b63D18",
    bridgeAvailable: true,
    supplyKey: "cgtSupplyOnKusama"
  },
  ton: {
    name: "TON",
    icon: "./images/chains/ton.png",
    contractUrl: "https://tonviewer.com/EQC16UcPDOF1YBcDfI3-SNA8nr8ECliCRN3O5d_-SSBcUSjf",
    bridgeAvailable: true,
    supplyKey: "cgtSupplyOnTon"
  },
  neon: {
    name: "Neon",
    icon: "./images/chains/neon-evm.png",
    contractUrl: "https://neon.blockscout.com/token/0xC1eD606683a3f89317d64BDA602628d68a0B4b24",
    bridgeAvailable: false,
    supplyKey: "cgtSupplyOnNeon"
  },
  // tonL2: {
  //   name: "TON L2",
  //   icon: "./images/chains/ton.png",
  //   comingSoon: true
  // },
  // skale: {
  //   name: "Skale",
  //   icon: "./images/chains/skale.png",
  //   plannedRelaunch: true
  // },
  // boba: {
  //   name: "Boba",
  //   icon: "./images/chains/boba.png",
  //   plannedRelaunch: true
  // }
};

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const Dashboard = () => {
  const { data: staking = 0 } = useSWR('/api/staking', fetcher, { 
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 0,
    dedupingInterval: 900000 // 15 minutes
  })
  const { data: marketData = {
    marketPrice: 0,
    priceChange: 0,
    marketCap: 0,
    volume: 0,
    historicalData: [],
    ath: 0,
    athTime: '',
    athChange: 0,
    atl: 0,
    atlTime: '',
    atlChange: 0
  } } = useSWR('/api/cgtMarketData', fetcher, { 
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 0,
    dedupingInterval: 900000 // 15 minutes
  })
  const { data: supply = {} } = useSWR('/api/cgtSupply', fetcher, { 
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 0,
    dedupingInterval: 900000 // 15 minutes
  })
  const { data: liquidity = {
    ETH: { "CGT/WETH": { usdValue: "0", CGT: "0", WETH: "0" } },
    BSC: { "CGT/WBNB": { usdValue: "0", CGT: "0", WBNB: "0" } },
    TON: {
      "CGT/USDT": { usdValue: "0", CGT: "0", USDT: "0" },
      "CGT/TON": { usdValue: "0", CGT: "0", TON: "0" }
    }
  } } = useSWR('/api/getLiquidity', fetcher, { 
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 0,
    dedupingInterval: 900000 // 15 minutes
  })

  const [supplyLoaded, setSupplyLoaded] = useState(true);
  const [marketDataLoaded, setMarketDataLoaded] = useState(true);


  const formatDate = (date: string) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
    const timestamp = new Date(date);
    const day = `${timestamp.getDate()}`.padStart(2, "0");
    const month = months[timestamp.getMonth()];
    const year = timestamp.getFullYear();
    const formatedDate = `${month} ${day}, ${year}`
    return formatedDate
  }

  const ChainSupplyList: React.FC<{ supply: Record<string, string> | undefined, loaded: boolean }> = ({ supply, loaded }) => {
    if (!loaded) {
      return (
        <div className="col-span-12 flex overflow-hidden relative flex-col p-8 text-2xl font-extralight text-black/90 dark:text-white rounded-2xl">
          <Spinner />
        </div>
      );
    } else {
      return (
        <>
          <div className="grid grid-cols-12 gap-3 mt-2">
            {Object.entries(chainInfo).map(([key, chain]) => (
              <ChainSupplyItem 
                key={key}
                chain={chain}
                supply={supply && chain.supplyKey ? supply[chain.supplyKey] : undefined}
              />
            ))}
          </div>
        </>
      );
    }
  };

  const ChainSupplyItem: React.FC<ChainSupplyItemProps> = ({ chain, supply }) => (
    <div className="col-span-6 lg:col-span-4">
      <div className="relative flex flex-row pl-3 items-center p-0.5 bg-blue-400/10 rounded-md border border-blue-300/10">
        {!chain.comingSoon && !chain.plannedRelaunch && chain.contractUrl && (
          <>
            <div className="absolute top-0 right-0 border-l border-blue-300/20 w-6 text-center h-full">
              <div className="felx flex-col justify-around">
              <Tooltip content="Go to Contract">
                <a href={chain.contractUrl} target="_new">
                  <CiFileOn className='w-3 h-3 md:w-3 md:h-3 opacity-60 hover:opacity-90 hover:scale-125 duration-300' />
                </a>
              </Tooltip>
              {chain.bridgeAvailable ? 
                <Tooltip content="Open Bridge">
                  <a href={chain.contractUrl} target="_new">
                    <CiCircleCheck className='w-3 h-3 md:w-3 md:h-3' />
                  </a>
                </Tooltip>
              :
                <Tooltip content="Bridge not yet available">
                    <CgUnavailable className='w-4 h-4 md:w-3 md:h-3 opacity-50 hover:opacity-90 hover:scale-125 duration-300' />
                </Tooltip>
              }
              </div>
            </div>
          </>
        )}
        <img loading="lazy" src={chain.icon} className="my-auto bg-white rounded-full p-[1px] w-5 md:w-8" alt={chain.name} />
        
        <div className="text-right w-full pr-8">
          <div className={`text-sm md:text-md xl:text-lg font-extralight text-blue-300/80 text-right`}>
            {supply !== undefined ? Number(supply).toLocaleString('en-US', {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            }) : "Loading..."}
          </div>
          <div className="text-sm -mt-1 lg:mt-0 font-bold text-white">{chain.name}</div>
        </div>

      </div>
    </div>
  );

  
  useEffect(() => {
    if (marketData && marketData.athTime) {
      formatDate(marketData.athTime);
    }
  }, [marketData]);

  return (

      <div id="dashboard" className="max-w-screen-2xl mx-auto mb-44">

        <div className="grid grid-cols-12 2xl:px-auto mb-20">

          {/* Intro text */}
          <div className="col-span-12 md:col-span-6 p-5">

            <div className="h-full">
              <div className='flex flex-col text-center md:text-left md:flex-col h-full'>
                <h3 className="text-4xl sm:text-4xl md:text-4xl lg:text-6xl xl:text-6xl font-sans font-bold md:mb-2 text-white/90 uppercase"><span className="font-bold bg-gradient-to-r from-[#224eae] to-[#0f9ef2] inline-block text-transparent bg-clip-text">CGT Analytics</span></h3>
                <p className="mb-5 text-md font-semibold md:text-xl lg:text-2xl text-white">
                  Unparalleled Insights into CGT
                </p>
                <p className="text-md md:text-xl font-extralight text-white mb-5">
                  Your destination for CGT analytics! Experience financial transparency like never before.
                </p>
              </div>
            </div>
          </div>

          {/* Total Locked CGT */}
          <TotalLocked loaded={marketDataLoaded} liquidity={liquidity.liquidity} staking={staking} marketPrice={marketData.marketPrice} />

          {/* Market Data */}
          <div className="col-span-12 row-span-1 md:col-span-6 p-5 md:border-t md:border-r md:border-b border-blue-500/10">
    
            <div className="h-full">
            <CardLayout gradientStart="from-blue-600/30" gradientEnd="to-blue-800/20" padding="p-5">
              <div className="grid grid-cols-12 gap-5 rounded-md h-full">
                <MarketPrice loaded={marketDataLoaded} marketPrice={marketData.marketPrice} priceChange={marketData.priceChange} />
                <MarketCap loaded={marketDataLoaded} marketCap={marketData.marketCap} />
                <Volume loaded={marketDataLoaded} volume={marketData.volume} />
                <ChartMarketPrice loaded={marketDataLoaded} historicalData={marketData.historicalData} />
              </div>
            </CardLayout>
            </div>

          </div>

          {/* Circ. supply start */}
          <div className="col-span-12 md:col-span-6 row-span-1 p-5 pt-0 md:pt-5 md:border-b border-blue-500/10">

            <CardLayout gradientStart="from-blue-600/20" gradientEnd="to-blue-800/20" padding="p-5">

              <div className='flex flex-row justify-around gap-2 md:gap-5 mb-5'>
                {/* Total supply start */}
                <div className="col-span-6 flex flex-col w-full rounded-md">
                  <GradientHeaderH4 headline="Circ. Supply" />
                  <div className="text-xl md:text-3xl text-white font-medium">
                    {abbreviateNumber(100000000)}
                  </div>
                </div>
                {/* Total supply end */}

                {/* Total supply start */}
                <div className="col-span-6 flex flex-col items-end w-full rounded-md">
                  <GradientHeaderH4 headline="Max. Supply" />
                  <div className="text-xl md:text-3xl font-medium text-white">
                    {abbreviateNumber(100000000)}
                  </div>
                </div>
                {/* Total supply end */}
              </div>
              <CirculatingSupplyChart supply={supply} />
              {/* <ChainSupplyList supply={supply} loaded={supplyLoaded} /> */}
              </CardLayout>

          </div>
          {/* Circ. supply end */}

          {/* Pool Info */}
          {/* <PoolInfoCard 
            poolDataEth={liquidity.liquidity?.ETH?.['CGT/WETH']}
            poolDataBsc={liquidity.liquidity?.BSC?.['CGT/WBNB']}
            chain="ETH"
            tokenPair="CGT/WETH"
          /> */}

          {/* Staking */}
          <div className="col-span-12 md:col-span-4 px-10 p-5 border-b border-t md:border-t-transparent md:border-r border-blue-500/10">
              <div className="flex flex-col rounded-md h-full">
                <div className='rounded-md flex flex-col items-center md:flex-col md:mb-3'>
                  <GradientHeaderH4 headline="Staking" />
                </div>
                <div className="flex flex-col md:flex-col gap-3">
                  <div className="flex flex-col" >

                      <div className="flex flex-row justify-center">
                        <div className="flex flex-col md:flex-col md:gap-0 text-white">
                          <span className="text-3xl md:text-4xl font-bold text-white">
                            16% APY
                          </span>
                          <span className="text-xs md:text-lg font-bold text-blue-500/90 uppercase text-center md:text-left">on Curio Chain</span>
                        </div>
                        {/* <div className='hidden md:flex flex-col items-center'>
                          <img src="./images/dex/capdex.png" className="w-10 md:w-14" />
                        </div> */}
                      </div>

                  </div>

                  <div className="mt-0 md:mt-0 flex flex-row lg:flex-row justify-between lg:gap-1 font-thin text-sm lg:text-md rounded-b-md text-left lg:text-left text-blue-300/90">
                    <span>{Number(staking).toLocaleString('en-US')} CGT</span>
                    <span>
                      ${Number(staking * marketData.marketPrice).toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </span>
                    <span>
                      {Number(staking / supply.cgtSupplyOnKusama * 100).toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}%
                    </span>
                  </div>

                </div>
              </div>
          </div>

          {/* ALH ALT */}
          <Ath loaded={marketDataLoaded} ath={marketData.ath} athTime={formatDate(marketData.athTime)} athChange={marketData.athChange} atl={marketData.atl} atlTime={formatDate(marketData.atlTime)} atlChange={marketData.atlChange} />
          
          <Atl loaded={marketDataLoaded} ath={marketData.ath} athTime={formatDate(marketData.athTime)} athChange={marketData.athChange} atl={marketData.atl} atlTime={formatDate(marketData.atlTime)} atlChange={marketData.atlChange} />

          {/* ALH break */}
          <div className="col-span-12 md:col-span-4 px-5 py-5 border-b border-t md:border-t-transparent md:border-r border-blue-500/10">
              <div className="flex flex-row justify-center md:justify-between items-center">
                <div className="flex flex-col justify-center text-white w-full">
                  <GradientHeaderH4 headline="When new ATH?" />  
                  <div className='mt-3 text-blue-200/90 font-light text-sm lg:text-lg'>
                    To reach a new ATH the market needs to grow by a factor 
                    of <span className="font-bold text-blue-400/90">
                      {((marketData.ath - marketData.marketPrice) / marketData.marketPrice).toFixed(1)}
                    </span> ({((marketData.ath - marketData.marketPrice) / marketData.marketPrice * 100).toFixed(2)} %).
                  </div>              
                  <div className="flex flex-row flex-wrap justify-between mt-4">
                    <div>
                      <div className="text-md lg:text-xl font-semibold text-white">
                        ${(marketData.ath)}
                      </div>
                      <div className="text-md lg:text-sm font-light text-blue-300/70">
                        ATH
                      </div>
                    </div>
                    <div>
                    <div className="text-md lg:text-xl font-semibold text-white text-center">
                      ${(marketData.ath - marketData.marketPrice).toFixed(4)}
                      </div>
                      <div className="text-md lg:text-sm font-light text-blue-300/70 text-center uppercase">
                        Difference
                      </div>
                    </div>
                    <div>
                      <div className="text-md lg:text-xl font-semibold text-white">
                        ${marketData.marketPrice}
                      </div>
                      <div className="text-md lg:text-sm font-light text-blue-300/70 text-right uppercase">
                        Price
                      </div>
                    </div>
                  </div>

                </div>
              </div>
          </div>

        </div>
      </div>
  );
};

export default Dashboard;
