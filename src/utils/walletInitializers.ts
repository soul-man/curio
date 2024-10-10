export interface WalletInitResult {
accounts: any[];
status: 'no-extension' | 'not-logged-in' | 'logged-in';
selectedAccount: string | null;
}
  
export const initializePolkadot = async (): Promise<WalletInitResult> => {
    if (typeof window === 'undefined') {
        return { accounts: [], status: 'no-extension', selectedAccount: null };
    }

    try {
        const { web3Accounts, web3Enable } = await import('@polkadot/extension-dapp');
        const extensions = await web3Enable('Your dApp Name');
        if (extensions.length === 0) {
        return { accounts: [], status: 'no-extension', selectedAccount: null };
        }
        
        const allAccounts = await web3Accounts();
        if (allAccounts.length === 0) {
        return { accounts: [], status: 'not-logged-in', selectedAccount: null };
        }
        
        const storedAccount = localStorage.getItem('selectedPolkadotAccount');
        const selectedAccount = storedAccount && allAccounts.some(acc => acc.address === storedAccount)
        ? storedAccount
        : null;

        return {
        accounts: allAccounts,
        status: selectedAccount ? 'logged-in' : 'not-logged-in',
        selectedAccount
        };
    } catch (error) {
        console.error('Error initializing Polkadot:', error);
        return { accounts: [], status: 'no-extension', selectedAccount: null };
    }
};

export const initializeSubWallet = async (): Promise<WalletInitResult> => {
    if (typeof window === 'undefined' || !(window as any).SubWallet) {
        return { accounts: [], status: 'no-extension', selectedAccount: null };
    }

    try {
        const subwallet = (window as any).SubWallet;
        await subwallet.enable({ dappName: 'Your dApp Name' });
        const accounts = await subwallet.getAccounts();
        
        const storedAccount = localStorage.getItem('selectedSubWalletAccount');
        const selectedAccount = storedAccount && accounts.some((acc: any) => acc.address === storedAccount)
        ? storedAccount
        : null;

        return {
        accounts,
        status: selectedAccount ? 'logged-in' : 'not-logged-in',
        selectedAccount
        };
    } catch (error) {
        console.error('Error connecting to SubWallet:', error);
        return { accounts: [], status: 'no-extension', selectedAccount: null };
    }
};