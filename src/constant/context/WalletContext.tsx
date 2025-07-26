import React, { createContext, useContext, useState, useEffect } from 'react';
import { web3Enable, web3Accounts, web3FromSource } from '@polkadot/extension-dapp';

export interface WalletContextType {
  account: any;
  setAccount: React.Dispatch<React.SetStateAction<any>>;
  chainInfo: ChainInfo | null;
  setChainInfo: React.Dispatch<React.SetStateAction<ChainInfo | null>>;
  injector: any;
  setInjector: React.Dispatch<React.SetStateAction<any>>;
  isClient: boolean;
  selectedWallet: 'polkadot' | 'subwallet' | null;
  setSelectedWallet: React.Dispatch<React.SetStateAction<'polkadot' | 'subwallet' | null>>;
  status: 'initial' | 'no-extension' | 'not-logged-in' | 'logged-in';
  setStatus: React.Dispatch<React.SetStateAction<'initial' | 'no-extension' | 'not-logged-in' | 'logged-in'>>;
  initializeWallet: (wallet: 'polkadot' | 'subwallet') => Promise<void>;
  getBalance: (address: string) => Promise<any>;
  // For SDK compatibility - this will be a client-side API instance
  api: any;
  setApi: React.Dispatch<React.SetStateAction<any>>;
}

export const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<any>(null);
  const [chainInfo, setChainInfo] = useState<ChainInfo | null>(null);
  const [injector, setInjector] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<'polkadot' | 'subwallet' | null>(null);
  const [status, setStatus] = useState<'initial' | 'no-extension' | 'not-logged-in' | 'logged-in'>('initial');
  const [api, setApi] = useState<any>(null);

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
      setStatus('logged-in');
    } catch (error) {
      console.error('Error initializing wallet:', error);
      setStatus('no-extension');
    }
  };

  const getBalance = async (address: string) => {
    try {
      return await polkadotService.getBalance(address);
    } catch (error) {
      console.error('Error getting balance:', error);
      throw error;
    }
  };

  const value = {
    account,
    setAccount,
    chainInfo,
    setChainInfo,
    injector,
    setInjector,
    isClient,
    selectedWallet,
    setSelectedWallet,
    status,
    setStatus,
    initializeWallet,
    getBalance,
    api,
    setApi,
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