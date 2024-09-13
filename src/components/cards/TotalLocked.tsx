import React, { useState, useEffect }  from 'react';
import { Skeleton } from "@/components/ui/render-skeleton"
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { GradientHeaderH4 } from '@/components/ui/GradientHeaderH4';
import Spinner from '../Spinner';
import { abbreviateNumber } from '../../utils/helpers';

interface TotalLocked {
  loaded: boolean;
  liquidity: {
    ETH: { "CGT/WETH": { usdValue: string; CGT: string; WETH: string; } };
    BSC: { "CGT/WBNB": { usdValue: string; CGT: string; WBNB: string; } };
    TON: {
      "CGT/USDT": { usdValue: string; CGT: string; USDT: string; };
      "CGT/TON": { usdValue: string; CGT: string; TON: string; };
    };
    CURIO: {
      "CGT/USDC": { usdValue: string; CGT: string; USDC: string; };
      "CGT/DAI": { usdValue: string; CGT: string; DAI: string; };
    };
    NEON: {
      "CGT/USDC": { usdValue: string; CGT: string; USDC: string; };
    };
  };
  staking: number;
  marketPrice: number;
}

const TOTAL_SUPPLY = 100000000; // 100 million CGT

const TotalLocked: React.FC<TotalLocked> = ({ loaded, liquidity, staking, marketPrice }) => {

  const [showSkeleton, setShowSkeleton] = useState(true);

  const ethLocked = Number(liquidity?.ETH?.["CGT/WETH"]?.CGT || 0);
  const bscLocked = Number(liquidity?.BSC?.["CGT/WBNB"]?.CGT || 0);
  const tonLocked = Number(liquidity?.TON?.["CGT/USDT"]?.CGT || 0) + Number(liquidity?.TON?.["CGT/TON"]?.CGT || 0);
  const curioPoolsLocked = Number(liquidity?.CURIO?.["CGT/USDC"]?.CGT || 0) + Number(liquidity?.CURIO?.["CGT/DAI"]?.CGT || 0);
  const neonLocked = Number(liquidity?.NEON?.["CGT/USDC"]?.CGT || 0);
  const stakingLocked = Number(staking || 0);

  const totalLockedCGT = ethLocked + bscLocked + tonLocked + curioPoolsLocked + neonLocked + stakingLocked;
  const lockedPercentage = (totalLockedCGT / TOTAL_SUPPLY) * 100;

  const calculatePercentage = (amount: number) => (amount / totalLockedCGT) * 100;

  const chainData = [
    { chain: 'ETH', amount: ethLocked, color: 'bg-blue-400', icon: './images/chains/ethereum.png' },
    { chain: 'BSC', amount: bscLocked, color: 'bg-yellow-400', icon: './images/chains/binance-chain.png' },
    { chain: 'CURIO CHAIN', amount: stakingLocked + curioPoolsLocked, color: 'bg-blue-300', icon: './images/chains/curio.png' },
    { chain: 'TON', amount: tonLocked, color: 'bg-cyan-500', icon: './images/chains/ton.png' },
    { chain: 'NEON', amount: neonLocked, color: 'bg-pink-500', icon: './images/chains/neon-evm.png' },
  ].sort((a, b) => b.amount - a.amount);

  const renderPoolInfo = (chain: string) => {
    const chainKey = chain === 'Curio Chain' ? 'CURIO' : chain as keyof typeof liquidity;
    const chainLiquidity = liquidity?.[chainKey] || {};
    return (
      <>
        {Object.entries(chainLiquidity).map(([poolName, poolData], index, arr) => (
          <p key={poolName} className={`text-sm text-gray-500 flex justify-between ${index === arr.length - 1 && chain !== 'Curio Chain' ? 'border-b border-gray-200 pb-1 mb-1' : ''}`}>
            <span>{poolName}:</span>
            <span>{Number(poolData.CGT).toLocaleString()} CGT</span>
          </p>
        ))}
        {chain === 'Curio Chain' && (
          <p className="text-sm text-gray-500 flex justify-between border-b border-gray-200 pb-1 mb-1">
            <span>Staking:</span>
            <span>{stakingLocked.toLocaleString()} CGT</span>
          </p>
        )}
      </>
    );
  };

  useEffect(() => {
    const timer = setTimeout(() => setShowSkeleton(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div className="relative col-span-12 md:col-span-6 p-5 border-t border-b md:border-t-transparent md:border-b border-blue-500/10">

          <div className="flex flex-col items-start justify-start text-white">
            <GradientHeaderH4 headline="Total locked" />
            <div className="flex flew-row flex-wrap gap-3 md:gap-5 xl:gap-7 justify-between items-center mb-3 w-full">
            {showSkeleton || totalLockedCGT === 0 ? (
                <>
                  <Skeleton className="h-8 w-32 bg-blue-950" />
                  <Skeleton className="h-8 w-32 bg-blue-950" />
                  <Skeleton className="h-6 w-20 bg-blue-950" />
                </>
              ) : (
                <>
                  <div className="text-2xl md:text-3xl font-bold text-white w-max">
                    {abbreviateNumber(totalLockedCGT)} <span className="font-extralight">CGT</span>
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-white w-max">
                    <span className="font-extralight">$ </span>{abbreviateNumber(totalLockedCGT * marketPrice)}
                  </div>
                  <div className={`text-md md:text-lg bg-blue-600/30 font-light px-2 py-0.5 rounded-md text-blue-300`}>
                    {lockedPercentage.toFixed(2)}%
                  </div>
                </>
              )}
            </div>
          </div>

          {/* <div className="mt-1 md:mt-5 w-full">
            <div className="flex rounded-md overflow-hidden">
            {[
                { chain: 'ETH', amount: ethLocked, color: 'bg-blue-400', icon: './images/chains/ethereum.png' },
                { chain: 'BSC', amount: bscLocked, color: 'bg-yellow-400', icon: './images/chains/binance-chain.png' },
                { chain: 'Staking: Curio Chain', amount: stakingLocked + curioPoolsLocked, color: 'bg-blue-500', icon: './images/dex/capdex.png' },
                { chain: 'TON', amount: tonLocked, color: 'bg-cyan-500', icon: './images/chains/ton.png' },
                { chain: 'Neon', amount: neonLocked, color: 'bg-pink-500', icon: './images/chains/neon-evm.png' },
              ].sort((a, b) => b.amount - a.amount).map(({ chain, amount, color, icon }) => {
                const percentage = calculatePercentage(amount);
                const minWidth = 10; // Minimum width in percentage
                const width = Math.max(percentage, minWidth);
                
                return (
                    <div 
                      key={chain}
                      style={{width: `${width}%`}} 
                      className={`flex flex-col items-start justify-center text-xs text-white relative group`}
                    >
                      <div className="rounded-full p-1 border border-white/30 bg-blue-700/40">
                        <img 
                          src={icon}
                          alt={`${chain} icon`} 
                          className="text-center transform w-5 h-5"
                        />
                      </div>
                  </div>
                );
              })}
            </div>
          </div> */}
          
          <div className="mt-2 w-full">
            <div className="flex h-10 rounded-md relative w-full">
              {chainData.map(({ chain, amount, color }) => {
                const percentage = calculatePercentage(amount);
                const [isHovered, setIsHovered] = useState(false);
                
                return (
                  <Popover key={chain} className="relative min-w-[14%] sm:min-w-[8%] md:min-w-[14%] lg:min-w-[10%] xl:min-w-[8%]" style={{width: `${percentage}%`}}>
                    <PopoverButton 
                      className="w-full h-full focus:outline-none"
                      onMouseEnter={() => setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}
                    >
                      <div 
                        className={`${color} h-full flex flex-col pl-2 justify-center text-xs relative group hover:brightness-110 transition-all duration-200`}
                      >
                        <span className="text-left whitespace-nowrap text-black/60 font-bold group-hover:relative">
                          {showSkeleton || chain === undefined ? (
                              <Skeleton className="h-2 w-10 bg-black/30" />
                          ) : (
                            <>
                              {chain}
                            </>
                          )}
                        </span>
                        <span className="text-left whitespace-nowrap text-white font-light group-hover:relative">
                          {showSkeleton || percentage === undefined ? (
                            <>
                              <Skeleton className="h-3 w-7 mt-0.5 bg-black/20" />
                            </>
                          ) : (
                            <>
                              {percentage.toFixed(2)}%
                            </>
                          )}
                        </span>
                      </div>
                    </PopoverButton>

                    {isHovered && (
                      <PopoverPanel 
                        static
                        className="absolute z-40 w-64 transform -translate-x-1/2 -top-40 left-1/2 sm:px-0 lg:max-w-3xl bottom-full mb-2"
                      >
                        <div 
                          className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5"
                          onMouseEnter={() => setIsHovered(true)}
                          onMouseLeave={() => setIsHovered(false)}
                        >
                          <div className="relative bg-white p-3">
                            <p className="text-sm font-medium text-gray-900 mb-2">
                              {chain}
                            </p>
                            {renderPoolInfo(chain)}
                            <p className="text-sm text-gray-700 flex justify-between font-medium">
                              <span>Locked:</span>
                              <span>{amount.toLocaleString()} CGT</span>
                            </p>
                            <p className="text-xs text-gray-500 flex justify-between mt-1">
                              <span>Total locked:</span>
                              <span>{percentage.toFixed(2)}%</span>
                            </p>
                            <p className="text-xs text-gray-500 flex justify-between mt-1">
                              <span>Total supply:</span>
                              <span>{((amount / TOTAL_SUPPLY) * 100).toFixed(2)}%</span>
                            </p>
                          </div>
                        </div>
                      </PopoverPanel>
                    )}
                  </Popover>
                );
              })}
            </div>
          </div>

          <div className="text-xs mt-2 text-blue-400/50 mb-5">
            Move your mouse over the chains
          </div>

          <div className="flex flex-row items-center gap-2 text-xs mt-2 text-blue-100/70">
            <h4 className="text-md md:text-lg font-light text-blue-500 uppercase">
                Available supply:
            </h4>
            <div className="text-md md:text-xl font-bold text-white w-max">
              {showSkeleton || totalLockedCGT === undefined ? (
                  <Skeleton className="h-5 w-24 bg-blue-950" />
              ) : (
                <>
                {abbreviateNumber(100000000 - totalLockedCGT)} <span className="font-extralight">CGT</span>
              </>
              )}
            </div>
          </div>
      </div>
    </>
  );
};

export default TotalLocked;