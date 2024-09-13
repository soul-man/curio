import React from 'react';
import useSWR from 'swr'
import PoolCard from '@/components/cards/Pool';
import { GradientHeaderH4 } from '@/components/ui/GradientHeaderH4';
import { abbreviateNumber } from '../../utils/helpers';

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface PoolData {
  name: string;
  icon: string;
  exchangeLink: string;
  chain: string;
  usdValue: string;
  token0Amount: string;
  token1Amount: string;
  token0Symbol: string;
  token1Symbol: string;
  comingSoon?: boolean;
  bgColor: string;
  gradientStart: string;
  gradientEnd: string;
  dex: string;
  dexIcon: string;
}

const Pools = () => {
  const { data: liquidity = { 
    liquidity: {
      ETH: {},
      BSC: {},
      TON: {},
      CURIO: {}
    }
  } } = useSWR('/api/getLiquidity', fetcher, { 
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 0,
    dedupingInterval: 900000 // 15 minutes
  })

  const poolsData: PoolData[] = [
    {
      name: "CGT/WETH",
      icon: "/images/chains/ethereum-new.png",
      exchangeLink: "https://app.uniswap.org/swap?inputCurrency=ETH&outputCurrency=0x0E186357c323c806C1efdad36D217F7a54b63D18",
      chain: "ETHEREUM",
      usdValue: liquidity.liquidity.ETH?.["CGT/WETH"]?.usdValue || "0",
      token0Amount: liquidity.liquidity.ETH?.["CGT/WETH"]?.CGT || "0",
      token1Amount: liquidity.liquidity.ETH?.["CGT/WETH"]?.WETH || "0",
      token0Symbol: "CGT2.0",
      token1Symbol: "WETH",
      bgColor: "bg-blue-600",
      gradientStart: "from-blue-700/70",
      gradientEnd: "to-blue-900/20",
      dex: "Uniswap",
      dexIcon: "images/dex/uniswap.png"
    },
    {
      name: "CGT/WBNB",
      icon: "/images/tokens/bnb.png",
      exchangeLink: "https://pancakeswap.finance/swap?outputCurrency=0x61632b49Df5CA20846b3220bFc42BDa5E32C81ad",
      chain: "BSC",
      usdValue: liquidity.liquidity.BSC?.["CGT/WBNB"]?.usdValue || "0",
      token0Amount: liquidity.liquidity.BSC?.["CGT/WBNB"]?.CGT || "0",
      token1Amount: liquidity.liquidity.BSC?.["CGT/WBNB"]?.WBNB || "0",
      token0Symbol: "CGT2.0",
      token1Symbol: "WBNB",
      bgColor: "bg-yellow-500",
      gradientStart: "from-yellow-500/40",
      gradientEnd: "to-blue-900/20",
      dex: "Pancakeswap",
      dexIcon: "images/dex/pancakeswap.png"
    },
    {
      name: "CGT/USD₮",
      icon: "/images/tokens/usdt.png",
      exchangeLink: "https://capitaldex.exchange/swap?chain=ton",
      chain: "TON BLOCKCHAIN",
      usdValue: liquidity.liquidity.TON?.["CGT/USDT"]?.usdValue || "0",
      token0Amount: liquidity.liquidity.TON?.["CGT/USDT"]?.CGT || "0",
      token1Amount: liquidity.liquidity.TON?.["CGT/USDT"]?.USDT || "0",
      token0Symbol: "jCGT",
      token1Symbol: "USD₮",
      bgColor: "bg-cyan-500",
      gradientStart: "from-cyan-500/40",
      gradientEnd: "to-blue-900/20",
      dex: "Capital DEX",
      dexIcon: "images/dex/capdex.png"
    },
    {
      name: "CGT/TON",
      icon: "/images/chains/ton.png",
      exchangeLink: "https://capitaldex.exchange/swap?chain=ton",
      chain: "TON BLOCKCHAIN",
      usdValue: liquidity.liquidity.TON?.["CGT/TON"]?.usdValue || "0",
      token0Amount: liquidity.liquidity.TON?.["CGT/TON"]?.CGT || "0",
      token1Amount: liquidity.liquidity.TON?.["CGT/TON"]?.TON || "0",
      token0Symbol: "jCGT",
      token1Symbol: "TON",
      bgColor: "bg-cyan-500",
      gradientStart: "from-cyan-500/40",
      gradientEnd: "to-blue-900/20",
      dex: "Capital DEX",
      dexIcon: "images/dex/capdex.png"
    },
    {
      name: "CGT/USDC",
      icon: "/images/tokens/usdc.svg",
      exchangeLink: "https://capitaldex.exchange/swap?chain=curio-parachain",
      chain: "CURIO CHAIN",
      usdValue: liquidity.liquidity.CURIO?.["CGT/USDC"]?.usdValue || "0",
      token0Amount: liquidity.liquidity.CURIO?.["CGT/USDC"]?.CGT || "0",
      token1Amount: liquidity.liquidity.CURIO?.["CGT/USDC"]?.USDC || "0",
      token0Symbol: "CGT",
      token1Symbol: "USDC",
      bgColor: "bg-blue-500",
      gradientStart: "from-blue-500/50",
      gradientEnd: "to-blue-900/20",
      dex: "Capital DEX",
      dexIcon: "images/dex/capdex.png"
    },
    {
      name: "CGT/DAI",
      icon: "/images/tokens/dai.png",
      exchangeLink: "https://capitaldex.exchange/swap?chain=curio-parachain",
      chain: "CURIO CHAIN",
      usdValue: liquidity.liquidity.CURIO?.["CGT/DAI"]?.usdValue || "0",
      token0Amount: liquidity.liquidity.CURIO?.["CGT/DAI"]?.CGT || "0",
      token1Amount: liquidity.liquidity.CURIO?.["CGT/DAI"]?.DAI || "0",
      token0Symbol: "CGT",
      token1Symbol: "DAI",
      bgColor: "bg-blue-500",
      gradientStart: "from-blue-500/50",
      gradientEnd: "to-blue-900/20",
      dex: "Capital DEX",
      dexIcon: "images/dex/capdex.png"
    },
    {
      name: "CGT/USDC",
      icon: "/images/tokens/usdc.svg",
      exchangeLink: "https://capitaldex.exchange/swap?chain=neon",
      chain: "Neon",
      usdValue: liquidity.liquidity.NEON?.["CGT/USDC"]?.usdValue || "0",
      token0Amount: liquidity.liquidity.NEON?.["CGT/USDC"]?.CGT || "0",
      token1Amount: liquidity.liquidity.NEON?.["CGT/USDC"]?.USDC || "0",
      token0Symbol: "CGT2",
      token1Symbol: "USDC",
      bgColor: "bg-pink-500",
      gradientStart: "from-pink-500/60",
      gradientEnd: "to-blue-900/20",
      dex: "Capital DEX",
      dexIcon: "images/dex/capdex.png"
    },
    {
      name: "CGT/JSOL",
      icon: "/images/tokens/jsol.svg",
      exchangeLink: "https://capitaldex.exchange/swap?chain=neon",
      chain: "Neon",
      usdValue: liquidity.liquidity.NEON?.["CGT/JSOL"]?.usdValue || "0",
      token0Amount: liquidity.liquidity.NEON?.["CGT/JSOL"]?.CGT || "0",
      token1Amount: liquidity.liquidity.NEON?.["CGT/JSOL"]?.JSOL || "0",
      token0Symbol: "CGT2",
      token1Symbol: "JSOL",
      bgColor: "bg-pink-500",
      gradientStart: "from-pink-500/60",
      gradientEnd: "to-blue-900/20",
      dex: "Capital DEX",
      dexIcon: "images/dex/capdex.png"
    },
  ];

  // Sort poolsData by usdValue in descending order
  poolsData.sort((a, b) => {
    const aValue = parseFloat(a.usdValue);
    const bValue = parseFloat(b.usdValue);
    return bValue - aValue;
  });

  return (
    <>
      <div id="pools" className="max-w-screen-2xl mx-auto px-5 mb-44">
        <div className='flex flex-col'>
          <div className='flex flex-col md:flex-row justify-center items-center gap-2 md:gap-10 h-full mb-5 md:mb-10'>
            <div className="w-full">
              <h3 className="text-4xl sm:text-4xl md:text-4xl lg:text-5xl font-sans font-bold mb-2 text-white/90 text-center md:text-right uppercase">
                <span className="font-bold bg-gradient-to-r from-[#224eae] to-[#0f9ef2] inline-block text-transparent bg-clip-text">Liquidity Pools</span>
              </h3>
              <p className="text-md md:text-lg lg:text-xl font-thin text-blue-300 text-center md:text-right">
                Explore best liquidity across multiple chains and make informed decisions about where to trade, provide 
                liquidity, or bridge your CGT tokens
              </p>
            </div>

            <div className="flex flex-row md:flex-col lg:flex-row justify-center md:items-center lg:items-start gap-5 lg:gap-20 md:mb-0 border-blue-500/20 w-full p-2 px-0 md:p-5 lg:p-0">
              <div>
                <GradientHeaderH4 headline="Locked in all Pools" />
                <div className="text-xl md:text-3xl font-bold md:text-center lg:text-left">
                  {abbreviateNumber(poolsData.reduce((total, pool) => total + parseFloat(pool.token0Amount), 0))} <span className="font-extralight">CGT</span>
                </div>
              </div>
              <div>
                <GradientHeaderH4 headline="Total value" />
                <div className="text-xl md:text-3xl font-bold">
                  <span className="font-extralight">$</span> {abbreviateNumber(poolsData.reduce((total, pool) => total + parseFloat(pool.usdValue), 0))}
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-12 gap-4 w-full">
            {poolsData.map((pool, index) => (
              <PoolCard key={index} pool={pool} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Pools;
