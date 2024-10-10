import { useContext } from "react";
import { WalletContext, WalletContextType } from "./WalletContext";

export const useWalletContext = () => {
  return useContext(WalletContext) as WalletContextType;
};
