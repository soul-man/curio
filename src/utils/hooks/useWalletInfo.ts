import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const useWalletInfo = (selectedAccount: string | null) => {
  const { data, error, mutate } = useSWR(
    selectedAccount ? `/api/curio-wallet-info?address=${selectedAccount}` : null,
    fetcher,
    {
      refreshInterval: 60000, // Update every 60 seconds
      revalidateOnFocus: false,
      dedupingInterval: 60000, // Prevent duplicate requests within 60 seconds
    }
  );

  return { data, error, mutate };
};