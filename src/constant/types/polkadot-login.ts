export interface LoginModalProps {
  onClose: () => void;
  onLogin: (account: string) => void;
}

export interface WalletInfo {
  transferableBalance: string;
  totalBalance: string;
  totalStaked: string;
  pendingRewards: string;
  stakingPercentage: string;
  curioAddress: string;
  inputAddress: string;
}

export interface UserModalProps {
  onClose: () => void;
  onLogout: () => void;
  walletInfo: WalletInfo;
  updateWalletInfo: () => void;
}

export interface PolkadotLoginProps {
  showInHeader: boolean;
}