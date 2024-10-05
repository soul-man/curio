import React, { useState, useEffect, useCallback } from 'react';
import useSWR from 'swr';
import { useWallet } from '@/constant/context/WalletContext';
import WalletConnectButton from './WalletConnectButton';
import WalletModal from './WalletModal';
import LoginModal from './LoginModal';
import { web3Accounts } from '@polkadot/extension-dapp';
import { StakingService, SystemInfoService } from "@curiodao/capital-dex-sdk/polkadot";
import { ApiPromise } from '@polkadot/api';
import { BTreeMap, u128, u64 } from "@polkadot/types-codec";

interface StakingData {
  unstaking: BTreeMap<u64, u128> | undefined;
  currentBlock: u64 | undefined;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Wallet: React.FC = () => {
  const { account, api, setAccount, selectedWallet, setSelectedWallet, status, setStatus, initializeWallet } = useWallet();
  const [accounts, setAccounts] = useState<any[]>([]);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [unstaking, setUnstaking] = useState<BTreeMap<u64, u128>>();
  const [currentBlock, setCurrentBlock] = useState<u64>();

  const { data, error, mutate } = useSWR(
    account ? `/api/curio-wallet-info?address=${account.address}` : null,
    fetcher,
    {
      refreshInterval: 60000,
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  const { data: marketData } = useSWR('/api/cgtMarketData', fetcher, { 
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 0,
    dedupingInterval: 900000
  });

  const fetchStakingData = useCallback(async (account: any, api: ApiPromise): Promise<StakingData> => {
    const staking = new StakingService(api, account.address);
    const systemInfo = new SystemInfoService(api);
    const unstaking = await staking.unstaking() as BTreeMap<u64, u128>;
    const currentBlock = await systemInfo.currentBlock();
    return { unstaking, currentBlock };
  }, []);

  const updateWalletInfo = useCallback(async () => {
    if (account && api) {
      try {
        // Mutate SWR cache
        await mutate();

        // Update staking data
        const newStakingData = await fetchStakingData(account, api);
        setUnstaking(newStakingData.unstaking);
        setCurrentBlock(newStakingData.currentBlock);

        console.log('Updated staking data:', newStakingData);
      } catch (error) {
        console.error('Error updating wallet info:', error);
      }
    }
  }, [account, api, mutate, fetchStakingData]);

  const handleLogin = async () => {
    if (account && selectedWallet) {
      localStorage.setItem(`selected${selectedWallet.charAt(0).toUpperCase() + selectedWallet.slice(1)}Account`, account.address);
      localStorage.setItem('selectedWallet', selectedWallet);
      setStatus('logged-in');
      setIsLoginModalOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('selectedPolkadotAccount');
    localStorage.removeItem('selectedSubWalletAccount');
    localStorage.removeItem('selectedWallet');
    setAccount(null);
    setSelectedWallet(null);
    setStatus('not-logged-in');
    setIsUserModalOpen(false);
  };

  const handleWalletSelect = async (wallet: 'polkadot' | 'subwallet') => {
    setSelectedWallet(wallet);
    await initializeWallet(wallet);
    // After initialization, fetch accounts again
    const newAccounts = await web3Accounts();
    setAccounts(newAccounts);
  };

  useEffect(() => {
    const storedWallet = localStorage.getItem('selectedWallet') as 'polkadot' | 'subwallet' | null;
    if (storedWallet) {
      handleWalletSelect(storedWallet);
    }
  }, []);

  useEffect(() => {
    const initializeWalletData = async () => {
      if (account && api) {
        try {
          const initialStakingData = await fetchStakingData(account, api);
          setUnstaking(initialStakingData.unstaking);
          setCurrentBlock(initialStakingData.currentBlock);
          console.log('Initialized staking data:', initialStakingData);
        } catch (error) {
          console.error('Error initializing wallet data:', error);
        }
      }
    };

    initializeWalletData();
  }, [account, api, fetchStakingData]);

  return (
    <div className="text-right">
      <WalletConnectButton
        status={status}
        data={data}
        toggleUserModal={() => setIsUserModalOpen(true)}
        toggleLoginModal={() => setIsLoginModalOpen(true)}
      />
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
      />
      <WalletModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        data={data}
        marketData={marketData}
        error={error}
        updateWalletInfo={updateWalletInfo}
        handleLogout={handleLogout}
        unstaking={unstaking}
        currentBlock={currentBlock}
      />
    </div>
  );
};

export default Wallet;