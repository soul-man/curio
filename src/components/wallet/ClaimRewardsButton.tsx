import React, { useState } from 'react';
import { SystemInfoService } from "@curiodao/capital-dex-sdk/polkadot";
import { useWallet } from '@/constant/context/WalletContext';
import { toast } from 'react-toastify';

interface ClaimRewardsButtonProps {
  onClaimSuccess?: () => void;
  rewards: string;
}

const ClaimRewardsButton: React.FC<ClaimRewardsButtonProps> = ({ onClaimSuccess, rewards }) => {
  const { account, api, injector } = useWallet();
  const [claimPending, setClaimPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const claim = async () => {
    console.log("Claim button clicked");
    if (!account || !injector || !api) {
      console.log("Account, injector, or API not initialized");
      setError("Please ensure your wallet is connected and try again.");
      return;
    }

    setClaimPending(true);
    setError(null);
    const systemInfo = new SystemInfoService(api);

    try {
      console.log("Initiating claim transaction...");
      const unsub = await systemInfo
        .claim()
        .signAndSend(
          account.address,
          { signer: injector.signer },
          ({ status, isError, events }) => {
            console.log("Transaction status:", status.type);
            if (isError) {
              console.error("Transaction error");
              setError("An error occurred during the transaction.");
              toast.error("An error occurred during the transaction.");
              setClaimPending(false);
              unsub();
            } else if (status.isFinalized || status.isInBlock) {
              console.log("Transaction finalized");
              setClaimPending(false);
              unsub();
              // Check events for success or failure
              events.forEach(({ event: { method, section } }) => {
                if (section === 'system' && method === 'ExtrinsicFailed') {
                  setError("Transaction failed. Please try again.");
                  toast.error("Claim failed. Please try again.");
                } else if (section === 'system' && method === 'ExtrinsicSuccess') {
                  console.log("Claim successful");
                  toast.success("Rewards claimed successfully!");
                  if (onClaimSuccess) {
                    onClaimSuccess();
                  }
                }
              });
            }
          },
        );
    } catch (e) {
      console.error("Error during claim:", e);
      setClaimPending(false);
      setError("An error occurred while claiming. Please try again.");
      toast.error("An error occurred while claiming. Please try again.");
    }
  };

  return (
    <div className="w-full">
      <button 
        onClick={claim} 
        disabled={!account || !api || claimPending || Number(rewards) < 1}
        className={`flex flex-row justify-center items-center w-full px-5 py-1 text-white text-sm rounded ${!account || !api || claimPending || Number(rewards) < 1 ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
      >
        {claimPending ? (
          <>
            <span className="spinner mr-2"></span>
            Claiming...
          </>
        ) : (
          'Claim'
        )}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {!account && <p className="text-yellow-500 mt-2">Please connect your wallet to claim rewards.</p>}
    </div>
  );
};

export default ClaimRewardsButton;