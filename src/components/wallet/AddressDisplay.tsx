import React, { useState } from 'react';
import { FiCopy, FiCheck } from 'react-icons/fi';

interface AddressDisplayProps {
  curioAddress: string;
  inputAddress: string;
  handleLogout: () => void;
}

const AddressDisplay: React.FC<AddressDisplayProps> = ({ curioAddress, inputAddress, handleLogout }) => {
  const [isAddressCurioCopied, setIsAddressCurioCopied] = useState(false);
  const [isAddressDotCopied, setIsAddressDotCopied] = useState(false);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className='mt-10 pt-3 flex flex-col md:flex-row justify-between border-t border-gray-300/40'>
      <div className="flex flex-row justify-between md:justify-start items-center gap-5 w-full">
        <div className="text-xs text-black/60 text-left">
          <div className='mb-1'><b>Curio Chain</b></div>
          <div className="flex gap-2 items-center">
            {formatAddress(curioAddress)}
            <button onClick={async () => {
              await navigator.clipboard.writeText(curioAddress);
              setIsAddressCurioCopied(true);
              setTimeout(() => setIsAddressCurioCopied(false), 1000);
            }} className="mr-1">
              {isAddressCurioCopied ? <FiCheck className="text-xs" /> : <FiCopy className="text-xs" />}
            </button>
          </div>
        </div>     
        <div className="text-xs text-black/60">
          <div className='mb-1'><b>Polkadot</b> (Substrate)</div>
          <div className="flex gap-2 items-center">
            {formatAddress(inputAddress)}
            <button onClick={async () => {
              await navigator.clipboard.writeText(inputAddress);
              setIsAddressDotCopied(true);
              setTimeout(() => setIsAddressDotCopied(false), 1000);
            }} className="mr-1">
              {isAddressDotCopied ? <FiCheck className="text-xs" /> : <FiCopy className="text-xs" />}
            </button>
          </div>
        </div>  
      </div>
      <button 
        onClick={handleLogout} 
        className="mt-4 md:mt-0 w-fit px-4 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
      >
        Logout
      </button>
  </div>
  );
};

export default AddressDisplay;