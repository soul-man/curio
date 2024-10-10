import React, { useState, useEffect } from 'react';
import { web3Accounts } from '@polkadot/extension-dapp';
import { useWallet } from '@/constant/context/WalletContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  const { selectedWallet, setSelectedWallet, status, setStatus, initializeWallet, account, setAccount } = useWallet();
  const [accounts, setAccounts] = useState<any[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (selectedWallet) {
      fetchAccounts();
    }
  }, [selectedWallet]);

  const fetchAccounts = async () => {
    try {
      const fetchedAccounts = await web3Accounts();
      setAccounts(fetchedAccounts);
      setStatus(fetchedAccounts.length > 0 ? 'not-logged-in' : 'no-extension');
    } catch (error) {
      console.error('Error fetching accounts:', error);
      setStatus('no-extension');
    }
  };

  const handleWalletSelect = async (wallet: 'polkadot' | 'subwallet') => {
    setSelectedWallet(wallet);
    await initializeWallet(wallet);
    await fetchAccounts();
  };

  const handleAccountSelect = (selectedAccount: any) => {
    setAccount(selectedAccount);
    setIsDropdownOpen(false);
  };

  const formatAddress = (address: string) => {
    return address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-sm shadow-lg relative" style={{width: '500px', minHeight: '260px'}}>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-black text-lg hover:scale-110 hover:rotate-12 bg-blue-300/60 duration-200 rounded-sm px-2"
          aria-label="Close modal"
        >
          ✕
        </button>

        <h2 className="mt-3 text-2xl font-bold mb-4 text-black text-center uppercase">Login with Wallet</h2>
        
        <div className="mb-8 flex justify-center space-x-4">
          <button
            onClick={() => handleWalletSelect('polkadot')}
            className={`px-3 py-0.5 rounded text-black border-2 border-black ${selectedWallet === 'polkadot' ? 'bg-gray-200' : 'bg-blue-200'} flex items-center`}
          >
            <img src="/images/chains/polkadot.svg" alt="SubWallet" className="mr-2" style={{width: '25px'}} />
            Polkadot.js
          </button>
          <button
            disabled
            onClick={() => handleWalletSelect('subwallet')}
            className={`opacity-60 px-3 py-0.5 rounded border-2 border-black ${selectedWallet === 'subwallet' ? 'bg-blue-500 text-white' : ' text-black'} flex items-center`}
          >
            <img src="/images/wallets/subwallet.png" alt="SubWallet" className="mr-2" style={{width: '25px'}} />
            <div className="flex flex-col">
              <span>SubWallet</span>
              <span className="-mt-1 text-xs text-gray-500">Coming Soon</span>
            </div>
          </button>
        </div>

        {status === 'no-extension' && selectedWallet && (
          <div className="mb-4">
            <p className="text-md text-black mb-2 text-center">
              {selectedWallet === 'polkadot'
                ? "No Polkadot.js extension found! Please install the following:"
                : "No SubWallet extension found! Please install the following:"}
            </p>
            <p className="text-center">
              <a 
                href={selectedWallet === 'polkadot' 
                  ? "https://polkadot.js.org/extension/" 
                  : "https://subwallet.app/"
                } 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700 underline"
              >
                <b>{selectedWallet === 'polkadot' ? 'Polkadot.js extension' : 'SubWallet'}</b>
              </a>
            </p>
          </div>
        )}

        {status === 'not-logged-in' && selectedWallet && accounts.length > 0 && (
          <>
            <div className="relative mb-4">
              <div
                className="text-left p-2 px-4 border border-blue-200 rounded text-black bg-white cursor-pointer"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                {account 
                  ? `${account.meta.name || 'Unknown'} (${formatAddress(account.address)})`
                  : "Please select an account"}
              </div>
              {isDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white text-black text-left border border-blue-300 rounded shadow-lg">
                  {accounts.map((acc) => (
                    <div
                      key={acc.address}
                      className="p-2 hover:bg-blue-100 cursor-pointer"
                      onClick={() => handleAccountSelect(acc)}
                    >
                      {acc.meta.name || 'Unknown'} ({formatAddress(acc.address)})
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button 
              onClick={onLogin} 
              className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              disabled={!account}
            >
              Connect Wallet
            </button>
          </>
        )}

        {status === 'not-logged-in' && selectedWallet && accounts.length === 0 && (
          <p className="text-sm text-black mb-4">No accounts available. Please create an account in your selected wallet.</p>
        )}
      </div>
    </div>
  );
};

export default LoginModal;