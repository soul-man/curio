import { useState, useCallback } from 'react';

export const usePolkadotExtension = () => {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [status, setStatus] = useState<'initial' | 'no-extension' | 'not-logged-in' | 'logged-in'>('initial');
  const [selectedWallet, setSelectedWallet] = useState<'polkadot' | 'subwallet' | null>(null);

  const initializeExtension = useCallback(async () => {
    try {
      const storedWallet = localStorage.getItem('selectedWallet') as 'polkadot' | 'subwallet' | null;
      setSelectedWallet(storedWallet);

      if (storedWallet === 'polkadot') {
        await initializePolkadot();
      } else if (storedWallet === 'subwallet') {
        await initializeSubWallet();
      } else {
        setStatus('not-logged-in');
      }
    } catch (error) {
      console.error('Error initializing extension:', error);
      setStatus('no-extension');
    }
  }, []);

  const initializePolkadot = async () => {
    if (typeof window === 'undefined') return;

    const { web3Accounts, web3Enable } = await import('@polkadot/extension-dapp');
    
    const extensions = await web3Enable('Your dApp Name');
    if (extensions.length === 0) {
      setStatus('no-extension');
      return;
    }
    
    const allAccounts = await web3Accounts();
    if (allAccounts.length === 0) {
      setStatus('not-logged-in');
    } else {
      setAccounts(allAccounts);
      
      const storedAccount = localStorage.getItem('selectedPolkadotAccount');
      if (storedAccount && allAccounts.some(acc => acc.address === storedAccount)) {
        setSelectedAccount(storedAccount);
        setStatus('logged-in');
      } else {
        setStatus('not-logged-in');
      }
    }
  };

  const initializeSubWallet = async () => {
    if (typeof window === 'undefined') return;

    if ((window as any).SubWallet) {
      const subwallet = (window as any).SubWallet;
      try {
        await subwallet.enable({ dappName: 'Your dApp Name' });
        const accounts = await subwallet.getAccounts();
        setAccounts(accounts);
        
        const storedAccount = localStorage.getItem('selectedSubWalletAccount');
        if (storedAccount && accounts.some((acc: any) => acc.address === storedAccount)) {
          setSelectedAccount(storedAccount);
          setStatus('logged-in');
        } else {
          setStatus('not-logged-in');
        }
      } catch (error) {
        console.error('Error connecting to SubWallet:', error);
        setStatus('no-extension');
      }
    } else {
      setStatus('no-extension');
    }
  };

  const handleLogin = (account: string) => {
    if (selectedWallet === 'polkadot') {
      localStorage.setItem('selectedPolkadotAccount', account);
    } else if (selectedWallet === 'subwallet') {
      localStorage.setItem('selectedSubWalletAccount', account);
    }
    localStorage.setItem('selectedWallet', selectedWallet!);
    setSelectedAccount(account);
    setStatus('logged-in');
  };

  const handleLogout = () => {
    localStorage.removeItem('selectedPolkadotAccount');
    localStorage.removeItem('selectedSubWalletAccount');
    localStorage.removeItem('selectedWallet');
    setSelectedAccount(null);
    setSelectedWallet(null);
    setStatus('not-logged-in');
  };

  return {
    accounts,
    selectedAccount,
    status,
    selectedWallet,
    initializeExtension,
    handleLogin,
    handleLogout,
    setSelectedWallet,
  };
};