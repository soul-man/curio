export const useClaimRewards = (updateWalletInfo: () => void) => {
  const handleClaimRewards = async () => {
    // Implement claim rewards logic here
    console.log('Claiming rewards');
    // After successful claiming, update wallet info
    updateWalletInfo();
  };

  return { handleClaimRewards };
};