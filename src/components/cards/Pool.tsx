import React from 'react';
import CardLayout from '@/components/layout/common/CardLayout';

interface PoolData {
  name: string;
  icon: string;
  exchangeLink: string;
  chain: string;
  usdValue: string;
  token0Amount: string;
  token1Amount: string;
  token0Symbol: string;
  token1Symbol: string;
  comingSoon?: boolean;
  bgColor: string;
  gradientStart: string;
  gradientEnd: string;
  dex: string;
  dexIcon: string;
}

const PoolCard: React.FC<{ pool: PoolData }> = ({ pool }) => {
  return (
    <div className="col-span-12 sm:col-span-4 md:col-span-4 lg:col-span-3">
      <CardLayout gradientStart={pool.gradientStart} gradientEnd={pool.gradientEnd} padding="p-0">
        <div className="flex flex-col items-center h-full">
          <div className="flex flex-row gap-2 justify-center items-center w-fit bg-black/30 text-blue-300 text-center border-b border-blue-300/30 py-1 px-4 mb-5 md:mb-3 lg:mb-5 rounded-b-md">
            <a href={pool.exchangeLink} target="_blank" rel="noopener noreferrer">
              <span className="px-0.5 py-0.5 text-xs">
                Buy on {pool.dex}
              </span>
            </a>
            <img src={pool.dexIcon} className="w-7 h-7 md:w-5 md:h-5" alt={pool.dex} />
          </div>

          <div className="flex flex-row lg:flex-row md:w-full rounded-md justify-center gap-5 lg:gap-5">
            <div className="flex flex-col relative justify-center items-center">
              <div className="flex flex-row mb-2 lg:mb-0 -space-x-2 relative justify-center items-center">
                <img src="/images/tokens/cgt.png" alt="CGT" className="w-10 h-10 lg:w-12 lg:h-12 lg:mr-0" />
                <img src={pool.icon} alt={pool.chain} className="bg-white rounded-full p-[1px] w-10 h-10 lg:w-12 lg:h-12"/>
              </div>
            </div>
            <div>
              <div className="text-xl md:text-lg lg:text-xl font-semibold text-white text-center lg:text-left">
                {pool.name}
              </div>
              <div className="text-md md:text-lg text-white font-light text-center lg:text-left">
                ${Number(pool.usdValue).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}              
              </div>
            </div>
          </div>

          <div className="text-center w-full font-light text-sm text-blue-300/90  pt-1 my-3">
            {Number(pool.token0Amount).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})} <span className="mr-5 px-1 py-0.5 bg-blue-900/40 rounded-sm">{pool.token0Symbol}</span>
            {Number(pool.token1Amount).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} <span className="px-1 py-0.5 bg-blue-900/40 rounded-sm">{pool.token1Symbol}</span>
          </div>

          <div className={`${pool.bgColor} text-sm w-full py-1 text-center text-white/90`}>
            {pool.chain}
          </div>

        </div>
      </CardLayout>
    </div>
  );
};

export default PoolCard;