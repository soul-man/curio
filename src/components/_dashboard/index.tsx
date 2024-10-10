import React from 'react';
import { BackgroundGradientAnimation } from '../ui/background-gradient-animation';
import Welcome from './Welcome';
import TotalLocked from '@/components/_dashboard/TotalLocked';
import MarketData from '@/components/_dashboard/MarketData';
import MarketDataDetails from './MarketDataDetails';
import CirculatingSupply from './CirculatingSupply';
import Staking from './Staking';
import TopPools from './TopPools';
import AthBreak from './AthBreak';
import TVLvsMC from './TVLvsMC';
import Chains from '@/components/_dashboard/Chains';

interface Supply {
  cgtSupplyOnBsc: number;
  cgtSupplyOnEth: number;
  cgtSupplyOnNeon: number;
  cgtSupplyOnKusama: number;
  cgtSupplyOnTon: number;
}

interface DashboardContentProps {
  liquidity: any;
  staking: number;
  marketData: any;
  supply: Supply;
}

const DashboardContent: React.FC<DashboardContentProps> = ({
  liquidity,
  staking,
  marketData,
  supply
}) => {
  return (
    <div id="dashboard">
        <div className="relative max-w-screen-2xl mx-auto mb-44">
        <BackgroundGradientAnimation containerClassName="w-full inset-0">

          <div className="relative grid grid-cols-12 2xl:px-auto p-2 md:p-5">
            <Welcome />
            <TopPools 
              liquidity={liquidity.liquidity} 
            />
            <MarketData 
              marketData={marketData} 
            />
            <CirculatingSupply 
              supply={supply} 
            />
            <MarketDataDetails 
              marketData={marketData} 
            />
            <TotalLocked 
              liquidity={liquidity.liquidity} 
              staking={staking} 
              marketPrice={marketData.marketPrice} 
            />
            <AthBreak 
              ath={marketData.ath} 
              marketPrice={marketData.marketPrice} 
            />
            <Staking 
              staking={staking} 
              marketPrice={marketData.marketPrice} 
              cgtSupplyOnKusama={supply.cgtSupplyOnKusama} 
            />
            <TVLvsMC 
              marketCap={marketData.marketCap} 
              liquidity={liquidity}
            />
            <Chains />
          </div>
          </BackgroundGradientAnimation>  

        </div>
    </div>
  );
};

export default DashboardContent;