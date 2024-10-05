export const useStaking = (updateWalletInfo: () => void) => {
  const handleStake = async (amount: string) => {
    // Implement staking logic here
    console.log(`Staking ${amount} CGT`);
    // After successful staking, update wallet info
    updateWalletInfo();
  };
  
  const handleUnstake = async (amount: string) => {
    // Implement unstaking logic here
    console.log(`Unstaking ${amount} CGT`);
    // After successful unstaking, update wallet info
    updateWalletInfo();
  };

  return { handleStake, handleUnstake };
};