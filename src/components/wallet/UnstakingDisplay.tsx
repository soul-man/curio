import React, { useState, useEffect } from 'react';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { IoMdHelpCircleOutline } from "react-icons/io";
import { abbreviateNumber } from '../../utils/helpers';
import { BTreeMap, u128, u64 } from "@polkadot/types-codec";
import { StakingService, SystemInfoService } from "@curiodao/capital-dex-sdk/polkadot";
import { useWallet } from '@/constant/context/WalletContext';
import { toast } from 'react-toastify';

interface UnstakingDisplayProps {
  totalStaked: string;
  marketPrice: number;
  unstaking: BTreeMap<u64, u128> | undefined;
  currentBlock: u64 | undefined;
  updateWalletInfo: () => void;
}

const UnstakingDisplay: React.FC<UnstakingDisplayProps> = ({marketPrice, unstaking, currentBlock }) => {
  const { account, api, injector } = useWallet();
  const [isHovered, setIsHovered] = useState(false);
  const [unstakingTotal, setUnstakingTotal] = useState<string>("0");
  const [unstakingEntries, setUnstakingEntries] = useState<{ amount: string; timeRemaining: number; key: string }[]>([]);
  const [unlockPending, setUnlockPending] = useState(false);

  useEffect(() => {
    const fetchUnstakingData = async () => {
      if (account && api && unstaking && currentBlock) {
        try {          
          let total = BigInt(0);
          const entries: { amount: string; timeRemaining: number; key: string }[] = [];

          unstaking.forEach((value, key) => {
            const amount = BigInt(value.toString());
            total += amount;
            const blocksRemaining = key.toBigInt() - BigInt(currentBlock.toString());
            const timeRemaining = Number(blocksRemaining) * 12; // Assuming 12 seconds per block
            entries.push({
              amount: (amount / BigInt(1e18)).toString(),
              timeRemaining,
              key: key.toString(),
            });
          });

          setUnstakingTotal((total / BigInt(1e18)).toString());
          setUnstakingEntries(entries);
        } catch (error) {
          console.error('Error fetching unstaking data:', error);
          toast.error('Failed to fetch unstaking data. Please try again later.');
        }
      }
    };

    fetchUnstakingData();
    const intervalId = setInterval(fetchUnstakingData, 60000); // Refresh every minute

    return () => clearInterval(intervalId);
  }, [account, api, unstaking]);

  useEffect(() => {
    const timer = setInterval(() => {
      setUnstakingEntries(prevEntries =>
        prevEntries.map(entry => ({
          ...entry,
          timeRemaining: Math.max(0, entry.timeRemaining - 1)
        }))
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number): string => {
    if (seconds <= 0) return "Available now";
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${days}d ${hours}h ${minutes}m ${remainingSeconds}s`;
  };

  const unlock = async () => {
    if (account && injector && api) {
      setUnlockPending(true);
      const staking = new StakingService(api, account.address);
      try {
        const unsub = await staking
          .unlock()
          .signAndSend(
            account.address,
            { signer: injector.signer },
            ({ status, isError }) => {
              console.log(isError);
              if (status.isFinalized || status.isInBlock) {
                setUnlockPending(false);
                toast.success('Token successfully withdrawn!');
                unsub();
              }
            },
          );
      } catch (e) {
        console.error('Error unlocking tokens:', e);
        toast.error('Failed to withdraw tokens. Please try again.');
        setUnlockPending(false);
      }
    }
  };

  if (parseFloat(unstakingTotal) <= 0) {
    return null;
  }

  const lockedBalanceValue = (parseFloat(unstakingTotal) * marketPrice).toFixed(2);

  return (
    <div className="col-span-12 md:col-span-6 text-left p-4 border border-gray-200 rounded-md">
      <div className="flex items-center justify-between mb-1">
        <h4 className="text-sm md:text-lg font-light text-blue-500 uppercase">
          Unstaking
        </h4>
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
              className="absolute z-40 min-w-44 transform -translate-x-1/2 left-1/2 bottom-full mb-2"
            >
              <div className="overflow-hidden rounded-sm shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="relative bg-blue-100 px-2 py-1">
                  <p className="text-xs font-normal text-gray-900">
                    Total amount of unstaking tokens. Unstaking tokens will be available after the unbonding period.
                  </p>
                </div>
              </div>
            </PopoverPanel>
          )}
        </Popover>
      </div>
      <div className="text-md md:text-xl font-bold text-black">
        {abbreviateNumber(Number(unstakingTotal))} <span className="font-extralight">CGT</span>
      </div>
      <div className="text-xs font-normal text-black/70 w-max">
        ${abbreviateNumber(parseFloat(lockedBalanceValue))}
      </div>
      {parseFloat(unstakingTotal) > 0 && (
        <div className="text-black/70 mt-3">
          {unstakingEntries.map((entry, index) => (
            <div key={index} className="flex flex-row justify-between text-xs font-normal bg-gray-100 rounded-sm items-center px-1 py-1 w-full mb-1">
              <span>{entry.amount} CGT</span>
              {currentBlock ? (
                parseFloat(entry.key) < parseFloat(currentBlock.toString()) || entry.timeRemaining <= 0 ? (
                <button
                    className="btn small secondary px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={unlock}
                    disabled={unlockPending}
                    >
                    {unlockPending ? "Processing..." : "Withdraw"}
                </button>
                ) : (
                  <span className="text-xs">{formatTime(entry.timeRemaining)}</span>
                )
              ) : (
                <span className="text-xs">-</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UnstakingDisplay;