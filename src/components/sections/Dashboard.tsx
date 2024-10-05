import React, { useEffect} from 'react';
import useSWR from 'swr';
import DashboardContent from '@/components/_dashboard/';

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export type ChainInfoType = {
  name: string;
  icon: string;
  contractUrl?: string;
  bridgeAvailable?: boolean;
  supplyKey?: string;
  comingSoon?: boolean;
  plannedRelaunch?: boolean;
}

export type ChainSupplyItemProps = {
  chain: ChainInfoType;
  supply?: string;
  loaded?: boolean;
}

const Dashboard = () => {
  const { data: staking = 0 } = useSWR('/api/staking', fetcher, { 
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 0,
    dedupingInterval: 900000 // 15 minutes
  })
  const { data: marketData = {
    marketPrice: 0,
    priceChange: 0,
    marketCap: 0,
    volume: 0,
    historicalData: [],
    ath: 0,
    athTime: '',
    athChange: 0,
    atl: 0,
    atlTime: '',
    atlChange: 0
  } } = useSWR('/api/cgtMarketData', fetcher, { 
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 0,
    dedupingInterval: 900000 // 15 minutes
  })
  const { data: supply = {} } = useSWR('/api/cgtSupply', fetcher, { 
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 0,
    dedupingInterval: 900000 // 15 minutes
  })
  const { data: liquidity = {
    ETH: { "CGT/WETH": { usdValue: "0", CGT: "0", WETH: "0" } },
    BSC: { "CGT/WBNB": { usdValue: "0", CGT: "0", WBNB: "0" } },
    TON: {
      "CGT/USDT": { usdValue: "0", CGT: "0", USDT: "0" },
      "CGT/TON": { usdValue: "0", CGT: "0", TON: "0" }
    }
  } } = useSWR('/api/getLiquidity', fetcher, { 
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 0,
    dedupingInterval: 900000 // 15 minutes
  })

  const formatDate = (date: string) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
    const timestamp = new Date(date);
    const day = `${timestamp.getDate()}`.padStart(2, "0");
    const month = months[timestamp.getMonth()];
    const year = timestamp.getFullYear();
    const formatedDate = `${month} ${day}, ${year}`
    return formatedDate
  }

  useEffect(() => {
    if (marketData && marketData.athTime) {
      formatDate(marketData.athTime);
    }
  }, [marketData]);

  return (
    <DashboardContent
      staking={staking}
      marketData={marketData}
      supply={supply}
      liquidity={liquidity}
    />
  );
};

export default Dashboard;