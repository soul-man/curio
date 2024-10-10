import React from 'react';
import { abbreviateNumber } from '../../utils/helpers';

interface WalletConnectButtonProps {
  status: 'initial' | 'no-extension' | 'not-logged-in' | 'logged-in';
  data: any;
  toggleUserModal: () => void;
  toggleLoginModal: () => void;
}

const WalletConnectButton: React.FC<WalletConnectButtonProps> = ({
  status,
  data,
  toggleUserModal,
  toggleLoginModal
}) => {
  const formatAddress = (address: string) => {
    return address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';
  };

  if (status === 'logged-in') {
    return (
      <div className="flex flex-col items-end px-3 py-1 bg-blue-500 rounded-md w-fit cursor-pointer hover:bg-blue-400 duration-200" onClick={toggleUserModal}>
        {data ? (
          <div className="flex items-center">
            <img src="/images/dex/capdex.png" alt="CapDex Icon" className="w-6 h-6 mr-4" />
            <div className="flex flex-col">
              <span className="text-[10px] text-blue-200">{formatAddress(data.curioAddress)}</span>
              <span className="text-xs text-white">
                <span className="font-semibold">{abbreviateNumber(data.walletInfo.transferableBalance)} </span>
                CGT
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center">
            <img src="/images/dex/capdex.png" alt="CapDex Icon" className="w-6 h-6 mr-4" />
            <div className="flex flex-col">
              <span className="text-[10px] text-blue-200">xxxxxx...xxxx</span>
              <span className="text-xs text-white">
                <span className="font-semibold">Loading...</span>
              </span>
            </div>
          </div>
        )}
      </div>
    );
  } else {
    return (
      <button onClick={toggleLoginModal} className="text-sm px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Connect Wallet
      </button>
    );
  }
};

export default WalletConnectButton;