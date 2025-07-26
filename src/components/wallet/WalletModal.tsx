import React, {useEffect} from 'react';
import dynamic from 'next/dynamic';
import { BTreeMap, u128, u32, u64 } from "@polkadot/types-codec";
import { motion, AnimatePresence } from 'framer-motion'; // Import framer-motion and AnimatePresence
import BalanceDisplay from './BalanceDisplay';
import UnstakingDisplay from './UnstakingDisplay';
import AddressDisplay from './AddressDisplay';
import StakedBalanceDisplay from './StakedBalanceDisplay';
import StakingRewards from './StakingRewards';
const StakeUnstake = dynamic(() => import('./StakeUnstake'), { ssr: false });

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
  marketData: any;
  error: any;
  updateWalletInfo: () => void;
  handleLogout: () => void;
  unstaking: BTreeMap<u64, u128> | undefined;
  currentBlock: u32 | undefined;
}

const WalletModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  data,
  marketData,
  error,
  updateWalletInfo,
  handleLogout,
  unstaking,
  currentBlock
}) => {

  useEffect(() => {
    if (isOpen) {
      // Disable scrolling on the body when the modal is open
      document.body.style.overflow = 'hidden';
    } else {
      // Re-enable scrolling when the modal is closed
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0';
    }

    // Cleanup function to reset styles when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0';
    };
  }, [isOpen]);

  if (error) return <div className="text-red-500">Failed to load wallet information</div>;
  if (!data || !marketData) return <div></div>;

  const marketPrice = marketData.marketPrice || 0;
  const balance = parseFloat(data.walletInfo.transferableBalance);
  const balanceValue = (marketPrice * balance).toFixed(2);

  // Define animation variants
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.3 } }
  };

  const backgroundVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.3 } }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={backgroundVariants}
        >
          <motion.div
            className="bg-white rounded-sm shadow-lg relative w-[90vw] md:w-[600px]"
            style={{ maxHeight: '80vh' }}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalVariants}
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-black text-lg hover:scale-110 hover:rotate-12 bg-blue-300/60 duration-200 rounded-sm px-2"
              aria-label="Close modal"
            >
              ✕
            </button>
            <div className="overflow-y-auto h-full" style={{ maxHeight: 'calc(80vh - 100px)' }}>
              <div className="px-2 md:px-5 mt-5 py-4">
                {/* Balances Section */}
                <div className='mb-2'>
                  <h2 className="text-lg font-semibold text-left text-black/90 uppercase">CGT Balances</h2>
                </div>
                <div className="mb-8 grid grid-cols-12 gap-2">
                  <BalanceDisplay 
                    title="Transferable"
                    balance={data.walletInfo.transferableBalance}
                    balanceValue={balanceValue}
                    infoText="Tokens available for transfer or staking."
                  />
                  <BalanceDisplay 
                    title="Total Balance"
                    balance={data.walletInfo.totalBalance}
                    balanceValue={(parseFloat(data.walletInfo.totalBalance) * marketPrice).toFixed(2)}
                    infoText="Total of transferable and staked tokens."
                  />
                  <StakedBalanceDisplay 
                    balance={data.walletInfo.totalStaked}
                    balanceValue={(parseFloat(data.walletInfo.totalStaked) * marketPrice).toFixed(2)}
                    stakingPercentage={data.walletInfo.stakingPercentage}
                  />
                </div>
                {/* Staking Section */}
                <div className='flex flex-row items-center mb-2 gap-2'>
                  <h2 className="text-lg font-semibold text-left text-black/90 uppercase">Staking</h2>
                  <span className="px-1 py-0.5 text-xs text-black/80 bg-gray-100 rounded-md">
                    APY: <b>16%</b>
                  </span>
                </div>
                <div className="grid grid-cols-12 gap-3">
                  {/* Staking Rewards */}
                  <StakingRewards 
                    pendingRewards={data.walletInfo.pendingRewards}
                    marketPrice={marketPrice}
                    onClaimSuccess={updateWalletInfo}
                  />
                  {/* Stake/Unstake Section */}
                  <StakeUnstake 
                    transferableBalance={data.walletInfo.transferableBalance}
                    totalStaked={data.walletInfo.totalStaked}
                    updateWalletInfo={updateWalletInfo}
                  />
                  <UnstakingDisplay 
                    totalStaked={data.walletInfo.totalStaked}
                    marketPrice={marketPrice}
                    unstaking={unstaking}
                    currentBlock={currentBlock }
                    updateWalletInfo={updateWalletInfo}
                  />
                </div>
                <AddressDisplay curioAddress={data.curioAddress} inputAddress={data.inputAddress} handleLogout={handleLogout} />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WalletModal;