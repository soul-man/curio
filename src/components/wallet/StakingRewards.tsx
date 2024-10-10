import React, { useState } from 'react';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { IoMdHelpCircleOutline } from "react-icons/io";
import { abbreviateNumber } from '../../utils/helpers';
import dynamic from 'next/dynamic';

const ClaimRewardsButton = dynamic(() => import('./ClaimRewardsButton'), { ssr: false });

interface StakingRewardsProps {
  pendingRewards: string;
  marketPrice: number;
  onClaimSuccess: () => void;
}

const StakingRewards: React.FC<StakingRewardsProps> = ({ pendingRewards, marketPrice, onClaimSuccess }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="col-span-12 md:col-span-6 flex flex-col justify-between items-start px-4 py-3 border border-gray-200 rounded-md">
      <div className="text-left bg-white">
        <h4 className="text-sm md:text-lg font-light text-blue-500 uppercase">
          Staking Rewards
        </h4>            
        <div className="text-xl md:text-2xl font-bold text-black">
          {abbreviateNumber(Number(pendingRewards))} <span className="font-extralight">CGT</span>
        </div>
        <div className="text-xs font-normal text-black/70 w-max">
          ${abbreviateNumber(parseFloat((parseFloat(pendingRewards) * marketPrice).toFixed(2)))}
        </div>
      </div>
      <div className="mt-5 md:mt-0 flex flex-row justify-between items-center gap-3 w-full">
        <ClaimRewardsButton onClaimSuccess={onClaimSuccess} rewards={pendingRewards} />
        <div className="w-1/10 flex items-center">
          <Popover className="relative">
            <PopoverButton 
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="focus:outline-none"
            >
              <IoMdHelpCircleOutline className="text-black/30 cursor-pointer hover:text-black/60 hover:scale-125 hover:rotate-12 duration-200" />
            </PopoverButton>
            {isHovered && (
              <PopoverPanel static className="absolute z-50 w-36 transform -translate-x-1/2 left-1/2 bottom-full mb-2">
                <div className="overflow-hidden rounded-sm shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="relative bg-blue-100 px-2 py-1">
                    <p className="text-xs font-normal text-gray-900 text-left">Min. claimable amount is <span className="font-bold">1 CGT</span>.</p>
                  </div>
                </div>
              </PopoverPanel>
            )}
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default StakingRewards;