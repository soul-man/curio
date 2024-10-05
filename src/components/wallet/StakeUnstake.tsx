import React, { useState, useEffect } from 'react';
import { BTreeMap, u128, u64 } from "@polkadot/types-codec";
import { StakingService, SystemInfoService } from "@curiodao/capital-dex-sdk/polkadot";
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { IoMdHelpCircleOutline } from "react-icons/io";
import { useWallet } from '@/constant/context/WalletContext';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';

interface StakeUnstakeProps {
  transferableBalance: string;
  totalStaked: string;
  updateWalletInfo: () => void;
}

const StakeUnstake: React.FC<StakeUnstakeProps> = ({ transferableBalance, totalStaked, updateWalletInfo }) => {
  const { account, api, injector } = useWallet();
  const [activeTab, setActiveTab] = useState('stake');
  const [amount, setAmount] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const [unstaking, setUnstaking] = useState<BTreeMap<u64, u128>>();
  const [currentBlock, setCurrentBlock] = useState<u64>();
  const [startTime, setStartTime] = useState<number>();
  const [amountInfoBlocks, setAmountInfoBlocks] = useState<any[]>([]);

  useEffect(() => {
    if (account && api) {
      (async () => {
        try {
          const staking = new StakingService(api, account.address);
          const unstaking = await staking.unstaking() as BTreeMap<u64, u128>;
          setUnstaking(unstaking);

          const systemInfo = new SystemInfoService(api);
          const currentBlock = await systemInfo.currentBlock();
          setCurrentBlock(currentBlock);
        } catch (error) {
          console.error('Error fetching unstaking data:', error);
        }
      })();
    }
  }, [account, api]);

  useEffect(() => {
    const startTime = new Date().getTime() / 1000;
    setStartTime(startTime);
  }, []);

  useEffect(() => {
    if (unstaking && !unstaking.isEmpty && currentBlock && startTime) {
      const updateTimer = () => {
        const currentTime = new Date().getTime() / 1000;
        const newAmountInfoBlocks: any[] = [];

        unstaking.forEach((value, key) => {
          const timeInSeconds =
            startTime +
            (parseFloat(key.toString()) - parseFloat(currentBlock.toString())) *
              12 -
            currentTime;
          const days = Math.floor(timeInSeconds / (60 * 60 * 24));
          const hours = Math.floor(
            (timeInSeconds % (60 * 60 * 24)) / (60 * 60),
          );
          const minutes = Math.floor((timeInSeconds % (60 * 60)) / 60);
          const seconds = Math.floor(timeInSeconds % 60);

          const time = `${days}d, ${hours}h, ${minutes}m, ${seconds}s`;
          const newAmountInfoBlock = {
            value: value.toString(),
            currentBlock: currentBlock,
            key: key,
            timeInSeconds: timeInSeconds,
            time: time,
          };

          newAmountInfoBlocks.push(newAmountInfoBlock);
        });

        setAmountInfoBlocks(newAmountInfoBlocks);
      };

      const intervalId = setInterval(updateTimer, 1000);

      return () => clearInterval(intervalId);
    }
  }, [unstaking, currentBlock, startTime]);

  const stake = async (amount: string, staked: bigint, clean?: () => void) => {
    if (account && injector && api) {
      setIsPending(true);
      if (clean) {
        clean();
      }
      try {
        await api.isReady;
        const systemInfo = new SystemInfoService(api);

        if (typeof systemInfo.stake !== 'function') {
          throw new Error('stake method not found on SystemInfoService');
        }

        const extrinsic = await systemInfo.stake(amount, staked);

        if (!extrinsic) {
          throw new Error('Failed to create extrinsic for stake operation');
        }

        const unsub = await extrinsic.signAndSend(
          account.address,
          { signer: injector.signer },
          (result: any) => {
            if (result.status.isFinalized || result.status.isInBlock) {
              setIsPending(false);
              updateWalletInfo();
              toast.success("Stake successful!");
              unsub();
            }
          }
        );
      } catch (e) {
        console.error('Error during stake:', e);
        setError('An error occurred while staking - ' + e);
        toast.error('An error occurred while staking - ' + e);
        setIsPending(false);
      }
    } else {
      setError('Please ensure your wallet is connected and try again.');
      toast.error('Please ensure your wallet is connected and try again.');
    }
  };

  const remove = async (amount: string, staked: bigint, clean?: () => void) => {
    if (account && injector && api) {
      const systemInfo = new SystemInfoService(api);
      if (clean) {
        clean();
      }
      setIsPending(true);
      try {
        const unsub = await (
          await systemInfo.remove(amount, staked)
        ).signAndSend(account.address, { signer: injector.signer }, ({ status }) => {
          if (status.isFinalized || status.isInBlock) {
            setIsPending(false);
            updateWalletInfo();
            toast.success("Unstake successful!");
            unsub();
          }
        });
      } catch (e) {
        console.error('Error during unstake:', e);
        setError('An error occurred while unstaking. Please try again.');
        toast.error('An error occurred while unstaking. Please try again.');
        setIsPending(false);      
      }
    }
  };

  const handleAction = async () => {
    if (!account || !injector || !api) {
      setError("Please ensure your wallet is connected and try again.");
      return;
    }

    setError(null);
    const amountBigInt = BigInt(parseFloat(amount) * 1e18);
    const stakedBigInt = BigInt(parseFloat(totalStaked) * 1e18);

    if (activeTab === 'stake') {
      await stake(amount, stakedBigInt, () => setAmount(''));
    } else {
      await remove(amount, stakedBigInt, () => setAmount(''));
    }
  };

  return (
    <div className="col-span-12 md:col-span-6 border border-gray-200 rounded-md">
      <div className="flex border-b border-gray-200">
        <button 
          className={`flex-1 text-xs py-1 px-4 text-gray-700 ${activeTab === 'stake' ? 'bg-gray-200 rounded-tl-md' : 'bg-gray-100'}`}
          onClick={() => setActiveTab('stake')}
        >
          Stake
        </button>
        <button 
          className={`flex-1 text-xs py-1 px-4 text-gray-700 ${activeTab === 'unstake' ? 'bg-gray-200' : 'bg-gray-100'}`}
          onClick={() => setActiveTab('unstake')}
        >
          Unstake
        </button>
      </div>

      <div className="p-3">
        <div className="mb-2">
          <div className="mb-1 text-xs text-gray-600 text-left">
            {activeTab === 'stake' ? 'Stake' : 'Unstake'}
          </div>
          <div className="mb-1 flex justify-between items-center">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="w-full text-2xl font-bold text-black text-left outline-none"
            />
            <span className="text-xl text-black ml-2">CGT</span>
          </div>
        </div>
        <div className="mb-4 text-xs text-gray-600 text-left">
          {activeTab === 'stake' ? 'Balance' : 'Staked'}: <button 
            onClick={() => setAmount(activeTab === 'stake' ? transferableBalance : totalStaked)}
            className="text-blue-500 hover:underline focus:outline-none"
          >
            {parseFloat(activeTab === 'stake' ? transferableBalance : totalStaked).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} CGT
          </button>
        </div>

        <div className="flex flex-row justify-between items-center gap-3 w-full">
          <button
            onClick={handleAction}
            disabled={!account || !api || isPending || Number(amount) <= 0}
            className={`flex flex-row justify-center items-center w-full px-4 py-1 text-sm text-white rounded-md ${!account || !api || isPending || Number(amount) <= 0 ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
          >
            {isPending ? (
              <>
                <span className="spinner mr-2"></span>
                {activeTab === 'stake' ? 'Staking...' : 'Unstaking...'}
              </>
            ) : (
              activeTab === 'stake' ? 'Stake' : 'Unstake'
            )}
          </button>

          <div className="w-1/10 flex items-center">
            <Popover className="relative">
              <PopoverButton 
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="focus:outline-none"
              >
                <IoMdHelpCircleOutline className="text-black/30 cursor-pointer" />
              </PopoverButton>
              {isHovered && (
                <PopoverPanel static className="absolute z-50 w-44 transform -translate-x-1/2 left-1/2 bottom-full mb-2">
                  <div className="overflow-hidden rounded-sm shadow-lg ring-1 ring-black ring-opacity-5">
                    <div className="relative bg-blue-100 px-2 py-1">
                      <p className="text-xs font-normal text-gray-900 text-left">Unstaked amounts can only be withdrawn after <span className="font-bold">7 days</span>.</p>
                    </div>
                  </div>
                </PopoverPanel>
              )}
            </Popover>
          </div>
        </div>
        {!account && <p className="text-yellow-500 mt-2 text-xs">Please connect your wallet to stake or unstake.</p>}
      </div>

      <ToastContainer
          position="top-center"
          autoClose={8000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />

    </div>
  );
};

export default StakeUnstake;