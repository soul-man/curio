import React, { createContext, useContext, useState, useEffect } from 'react';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { web3Enable, web3Accounts, web3FromSource } from '@polkadot/extension-dapp';
import stakingDefinition from '@/utils/definitions/stakingDefinition';


export interface WalletContextType {
  account: any;
  setAccount: React.Dispatch<React.SetStateAction<any>>;
  api: ApiPromise | null;
  setApi: React.Dispatch<React.SetStateAction<ApiPromise | null>>;
  injector: any;
  setInjector: React.Dispatch<React.SetStateAction<any>>;
  isClient: boolean;
  selectedWallet: 'polkadot' | 'subwallet' | null;
  setSelectedWallet: React.Dispatch<React.SetStateAction<'polkadot' | 'subwallet' | null>>;
  status: 'initial' | 'no-extension' | 'not-logged-in' | 'logged-in';
  setStatus: React.Dispatch<React.SetStateAction<'initial' | 'no-extension' | 'not-logged-in' | 'logged-in'>>;
  initializeWallet: (wallet: 'polkadot' | 'subwallet') => Promise<void>;
}

export const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<any>(null);
  const [api, setApi] = useState<ApiPromise | null>(null);
  const [injector, setInjector] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<'polkadot' | 'subwallet' | null>(null);
  const [status, setStatus] = useState<'initial' | 'no-extension' | 'not-logged-in' | 'logged-in'>('initial');

  useEffect(() => {
    setIsClient(true);
  }, []);

  const initializeWallet = async (wallet: 'polkadot' | 'subwallet') => {
    try {
      await web3Enable('Curio Insights');
      const accounts = await web3Accounts();
      if (accounts.length > 0) {
        const storedAccount = localStorage.getItem(`selected${wallet.charAt(0).toUpperCase() + wallet.slice(1)}Account`);
        const selectedAccount = accounts.find(acc => acc.address === storedAccount) || accounts[0];
        setAccount(selectedAccount);
        const injector = await web3FromSource(selectedAccount.meta.source);
        setInjector(injector);
      } else {
        setStatus('not-logged-in');
        return;
      }

      const provider = new WsProvider('wss://parachain.curioinvest.com');
      const api = await ApiPromise.create({ provider, noInitWarn: true, runtime: { ...stakingDefinition.runtime }});
      await api.isReady;
      setApi(api);
      setStatus('logged-in');
    } catch (error) {
      console.error('Error initializing wallet:', error);
      setStatus('no-extension');
    }
  };

  const value = {
    account,
    setAccount,
    api,
    setApi,
    injector,
    setInjector,
    isClient,
    selectedWallet,
    setSelectedWallet,
    status,
    setStatus,
    initializeWallet,
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};