import React, { useState } from 'react';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { IoMdHelpCircleOutline } from "react-icons/io";
import { formatNumberToLocaleUs } from '../../utils/helpers';

interface StakedBalanceDisplayProps {
  balance: string;
  balanceValue: string;
  stakingPercentage: string;
}

const StakedBalanceDisplay: React.FC<StakedBalanceDisplayProps> = ({ balance, balanceValue, stakingPercentage }) => {
  const [isHovered, setIsHovered] = useState(false);

  const infoText = `Awesome! You are staking ${stakingPercentage} of the total supply.`;

  return (
    <div className="col-span-6 md:col-span-4 text-left p-2 border border-gray-200 rounded-md">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center">
          <h4 className="text-sm md:text-md font-light text-blue-500 uppercase mr-2">
            Staked
          </h4>
          <span className="text-xs text-black/70 bg-gray-100 px-1 rounded-sm">
            {stakingPercentage}
          </span>
        </div>
        <Popover className="relative">
          <PopoverButton 
            className="focus:outline-none"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <IoMdHelpCircleOutline className="text-black/30"/>
          </PopoverButton>

          {isHovered && (
            <PopoverPanel 
              static
              className="absolute z-40 w-44 transform -translate-x-1/2 left-1/2 bottom-full mb-2"
            >
              <div className="overflow-hidden rounded-sm shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="relative bg-blue-100 px-2 py-1">
                  <p className="text-xs font-normal text-gray-900">
                    {infoText}
                  </p>
                </div>
              </div>
            </PopoverPanel>
          )}
        </Popover>
      </div>
      <div className="text-md md:text-xl font-bold text-black -mb-1">
        {formatNumberToLocaleUs(Number(balance))}
      </div>
      <div className="text-xs font-normal text-black/70 w-max">
        ${formatNumberToLocaleUs(parseFloat(balanceValue))}
      </div>
    </div>
  );
};

export default StakedBalanceDisplay;