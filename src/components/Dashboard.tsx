import React, { useEffect, useState } from 'react';
import useSWR from 'swr'
import { FaFileContract, FaInfoCircle } from "react-icons/fa";
import { FaBridgeCircleCheck } from "react-icons/fa6";
import { FaBridgeCircleExclamation } from "react-icons/fa6";
import CardMarketPrice from './cards/CardMarketPrice';
import CardVolumeCap from './cards/CardVolumeCap';
import CardChartMarketPrice from './cards/CardChartMarketPrice';
import CardAthAtl from './cards/CardAthAtl';
import Spinner from './Spinner';
import Tooltip from '@/components/ui/Tooltip';

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
    icon: "./images/chains/ethereum.png",
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
    icon: "./images/chains/curio.png",
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
  tonL2: {
    name: "TON L2",
    icon: "./images/chains/ton.png",
    comingSoon: true
  },
  skale: {
    name: "Skale",
    icon: "./images/chains/skale.png",
    plannedRelaunch: true
  },
  boba: {
    name: "Boba",
    icon: "./images/chains/boba.png",
    plannedRelaunch: true
  }
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
    ETH: { usdValue: "0", WETH: "0", CGT: "0" },
    BSC: { usdValue: "0", WBNB: "0", CGT: "0" }
  } } = useSWR('/api/uniswap-data', fetcher, { 
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 0,
    dedupingInterval: 900000 // 15 minutes
  })

  const [supplyLoaded, setSupplyLoaded] = useState(true);
  const [marketDataLoaded, setMarketDataLoaded] = useState(true);

  console.log('liquidity data:', liquidity);

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
          {Object.entries(chainInfo).map(([key, chain]) => (
            <ChainSupplyItem 
              key={key}
              chain={chain}
              supply={supply && chain.supplyKey ? supply[chain.supplyKey] : undefined}
            />
          ))}
        </>
      );
    }
  };

  const ChainSupplyItem: React.FC<ChainSupplyItemProps> = ({ chain, supply }) => (
    <div className="flex flex-row gap-2 md:gap-4 hover:bg-blue-400/10 rounded-md items-center md:p-0.5 md:px-2 md:mb-2">
      <img loading="lazy" src={chain.icon} className="my-auto w-6" alt={chain.name} />
      <div className="flex-1 text-md md:text-lg font-light leading-9">{chain.name}</div>
      <div className={`flex-1 text-md md:text-lg font-extralight leading-10 text-right ${!chain.comingSoon && !chain.plannedRelaunch ? 'mr-5' : ''}`}>
        {chain.comingSoon ? "coming soon" : 
         chain.plannedRelaunch ? "planned relaunch" : 
         supply !== undefined ? Number(supply).toLocaleString('en-US', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }) : "Loading..."}

      </div>
      {!chain.comingSoon && !chain.plannedRelaunch && chain.contractUrl && (
      <>
        <Tooltip content="Go to Contract">
          <a href={chain.contractUrl} target="_new">
            <FaFileContract className='w-4 h-4 md:w-5 md:h-5 opacity-50 hover:opacity-90 hover:scale-125 duration-300' />
          </a>
        </Tooltip>
        {chain.bridgeAvailable ? 
          <Tooltip content="Go to Bridge">
            <a href="https://bridge.capitaldex.exchange/" target="_new">
              <FaBridgeCircleCheck className='w-4 h-4 md:w-5 md:h-5 text-green-600 hover:opacity-90 hover:scale-125 duration-300' />
            </a>
          </Tooltip> :
          <FaBridgeCircleExclamation className='w-4 h-4 md:w-5 md:h-5 text-red-600' />
        }
        </>
      )}
    </div>
  );
  
  useEffect(() => {
    if (marketData && marketData.athTime) {
      formatDate(marketData.athTime);
    }
  }, [marketData]);

  return (
    <div className="max-w-screen-2xl mx-auto px-5 mb-20 md:mb-32">

      <div className='flex flex-col md:flex-col mb-10 md:mb-10'>
        <h3 className="text-4xl sm:text-4xl md:text-5xl lg:text-6xl font-sans font-bold mb-2 text-white">Curio Gas Token <span className="font-bold bg-gradient-to-r from-[#0A85E1] to-[#0763A7] inline-block text-transparent bg-clip-text"> Multi-Chain</span> Analytics</h3>
        
        <p className="text-lg sm:text-xl md:text-2xl font-extralight text-blue-300/80">
          Enjoy unparalleled Insights into Curio Gas Token: Your destination for CGT analytics. Experience financial transparency like never before with Curio Insights's exclusive multi-chain dashboard.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-5">
        <div className="w-12/12 lg:w-7/12 bg-black/30 p-7 md:p-10 rounded-md" style={{backgroundImage: "url('./images/backgrounds/1-card-bg-2to3.jpg')", backgroundSize: 'cover', backgroundPosition: 'center'}}>
          <div className="grid grid-cols-12 gap-2">
            <CardMarketPrice loaded={marketDataLoaded} marketPrice={marketData.marketPrice} priceChange={marketData.priceChange} marketCap={marketData.marketCap} />
            <CardVolumeCap 
              loaded={marketDataLoaded} 
              volume={marketData.volume} 
              liquidity={liquidity.liquidity}
              staking={staking}
              marketPrice={marketData.marketPrice}
            />
            <CardChartMarketPrice loaded={marketDataLoaded} historicalData={marketData.historicalData} />
          </div>
        </div>

        <div className="w-12/12 lg:w-5/12">
          <div className="grid grid-cols-12 gap-5">
            
            {/* Circ. supply start */}
            <div className="col-span-12 row-span-2 flex flex-col dark:text-white/80 bg-[#0A59AF] p-5 rounded-md" style={{backgroundImage: "url('./images/backgrounds/2-card-bg-2to3.png')", backgroundSize: 'cover', backgroundPosition: 'center'}}>

              <div className='flex flex-row justify-around gap-2 md:gap-5 mb-5'>
                {/* Total supply start */}
                <div className="col-span-6 flex flex-col w-full p-3 px-3 rounded-md text-center bg-black/40">
                  <div className="mb-1 text-sm md:text-md font-thin text-white/70">
                    Circulating Supply
                  </div>
                  <div className="text-xl md:text-2xl text-white/90 font-medium">
                    ≈100.000.000
                  </div>
                </div>
                {/* Total supply end */}

                {/* Total supply start */}
                <div className="col-span-6 flex flex-col w-full p-3 px-3 rounded-md text-center bg-black/40">
                  <div className="mb-1 text-sm md:text-md font-thin text-white/70">
                    Total/Max Supply
                  </div>
                  <div className="text-xl md:text-2xl font-medium text-white">
                  100.000.000
                  </div>
                </div>
                {/* Total supply end */}
              </div>

              <ChainSupplyList supply={supply} loaded={supplyLoaded} />

            </div>
            {/* Circ. supply end */}

            <div className="col-span-12 bg-[#0871BF] hover:scale-[102%] hover:-translate-y-1 duration-300 rounded-md">

            <div className="px-3 py-2 flex flex-row justify-between gap-5 font-thin text-sm rounded-b-md text-center text-blue-100 bg-black/20">
                <span>Stacked: {Number(staking).toLocaleString('en-US')} CGT</span>
                <span>
                  {Number(staking / supply.cgtSupplyOnKusama * 100).toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}%
                </span>
              </div>

              <div className="flex flex-row justify-around items-center">
                <div className='flex flex-col items-center'>
                  <img src="./images/chains/kusama.png" className="w-14 md:w-20" />
                  <span className="-mt-3 text-md md:text-lg font-bold text-black">Curio Chain</span>
                </div>
                <div className="mt-4 flex flex-col justify-center items-center text-xl md:text-xl font-thin text-center text-white">
                  Stake your CGT2.0
                  <span className="mb-1 text-2xl md:text-5xl font-bold text-white dark:text-white">
                    and earn 16%
                  </span>
                </div>
              </div>

              <div className="px-3 py-2 flex flex-row justify-center gap-5 mt-2 md:mt-4 font-thin text-2xl rounded-b-md text-center text-white bg-blue-950/50">
                <span>
                  ${Number(staking * marketData.marketPrice).toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </span>
              </div>

            </div>

            <CardAthAtl loaded={marketDataLoaded} ath={marketData.ath} athTime={formatDate(marketData.athTime)} athChange={marketData.athChange} atl={marketData.atl} atlTime={formatDate(marketData.atlTime)} atlChange={marketData.atlChange} />

          </div>
        </div>
      </div>

      <div className="flex flex-row items-center pl-2 mt-5">
        <FaInfoCircle className="mr-2 text-lg text-blue-200/80" />
        <p className="text-md font-thin text-blue-300/80">Prices will be updated every 15 mins.</p>
      </div>

    </div>
  );
};

export default Dashboard;
