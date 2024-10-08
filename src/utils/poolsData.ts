import { PoolData } from "@/constant/types/PoolData";

export const getPoolsData = (liquidity: any): PoolData[] => {
    const ethLiquidity = liquidity.liquidity?.ETH || {};
    const bscLiquidity = liquidity.liquidity?.BSC || {};
    const tonLiquidity = liquidity.liquidity?.TON || {};
    const curioLiquidity = liquidity.liquidity?.CURIO || {};
    const neonLiquidity = liquidity.liquidity?.NEON || {};

    return [
        {
            name: "CGT/WETH",
            icon: "/images/chains/ethereum-new.png",
            exchangeLink: "https://app.uniswap.org/swap?inputCurrency=ETH&outputCurrency=0x0E186357c323c806C1efdad36D217F7a54b63D18",
            chain: "ETHEREUM",
            usdValue: ethLiquidity["CGT/WETH"]?.usdValue || "0",
            token0Amount: ethLiquidity["CGT/WETH"]?.CGT || "0",
            token1Amount: ethLiquidity["CGT/WETH"]?.WETH || "0",
            token0Symbol: "CGT2.0",
            token1Symbol: "WETH",
            bgColor: "bg-blue-600",
            gradientStart: "from-blue-700/20",
            gradientEnd: "to-blue-900/20",
            dex: "Uniswap",
            dexIcon: "/images/dex/uniswap.png"
        },
        {
            name: "CGT/WBNB",
            icon: "/images/tokens/bnb.png",
            exchangeLink: "https://pancakeswap.finance/swap?outputCurrency=0x61632b49Df5CA20846b3220bFc42BDa5E32C81ad",
            chain: "BSC",
            usdValue: bscLiquidity["CGT/WBNB"]?.usdValue || "0",
            token0Amount: bscLiquidity["CGT/WBNB"]?.CGT || "0",
            token1Amount: bscLiquidity["CGT/WBNB"]?.WBNB || "0",
            token0Symbol: "CGT2.0",
            token1Symbol: "WBNB",
            bgColor: "bg-yellow-500",
            gradientStart: "from-yellow-500/30",
            gradientEnd: "to-blue-900/20",
            dex: "Pancakeswap",
            dexIcon: "/images/dex/pancakeswap.png"
        },
        {
            name: "CGT/USD₮",
            icon: "/images/tokens/usdt.png",
            exchangeLink: "https://capitaldex.exchange/swap?chain=ton",
            chain: "TON BLOCKCHAIN",
            usdValue: tonLiquidity["CGT/USDT"]?.usdValue || "0",
            token0Amount: tonLiquidity["CGT/USDT"]?.CGT || "0",
            token1Amount: tonLiquidity["CGT/USDT"]?.USDT || "0",
            token0Symbol: "jCGT",
            token1Symbol: "USD₮",
            bgColor: "bg-cyan-500",
            gradientStart: "from-cyan-500/30",
            gradientEnd: "to-blue-900/20",
            dex: "Capital DEX",
            dexIcon: "/images/dex/capdex.png"
        },
        {
            name: "CGT/TON",
            icon: "/images/chains/ton.png",
            exchangeLink: "https://capitaldex.exchange/swap?chain=ton",
            chain: "TON BLOCKCHAIN",
            usdValue: tonLiquidity["CGT/TON"]?.usdValue || "0",
            token0Amount: tonLiquidity["CGT/TON"]?.CGT || "0",
            token1Amount: tonLiquidity["CGT/TON"]?.TON || "0",
            token0Symbol: "jCGT",
            token1Symbol: "TON",
            bgColor: "bg-cyan-500",
            gradientStart: "from-cyan-500/30",
            gradientEnd: "to-blue-900/20",
            dex: "Capital DEX",
            dexIcon: "/images/dex/capdex.png"
        },
        {
            name: "CGT/USDC",
            icon: "/images/tokens/usdc.svg",
            exchangeLink: "https://capitaldex.exchange/swap?chain=curio-parachain",
            chain: "CURIO CHAIN",
            usdValue: curioLiquidity["CGT/USDC"]?.usdValue || "0",
            token0Amount: curioLiquidity["CGT/USDC"]?.CGT || "0",
            token1Amount: curioLiquidity["CGT/USDC"]?.USDC || "0",
            token0Symbol: "CGT",
            token1Symbol: "USDC",
            bgColor: "bg-blue-500",
            gradientStart: "from-blue-500/30",
            gradientEnd: "to-blue-900/20",
            dex: "Capital DEX",
            dexIcon: "/images/dex/capdex.png"
        },
        {
            name: "CGT/DAI",
            icon: "/images/tokens/dai.png",
            exchangeLink: "https://capitaldex.exchange/swap?chain=curio-parachain",
            chain: "CURIO CHAIN",
            usdValue: curioLiquidity["CGT/DAI"]?.usdValue || "0",
            token0Amount: curioLiquidity["CGT/DAI"]?.CGT || "0",
            token1Amount: curioLiquidity["CGT/DAI"]?.DAI || "0",
            token0Symbol: "CGT",
            token1Symbol: "DAI",
            bgColor: "bg-blue-500",
            gradientStart: "from-blue-500/30",
            gradientEnd: "to-blue-900/20",
            dex: "Capital DEX",
            dexIcon: "/images/dex/capdex.png"
        },
        {
            name: "CGT/USDC",
            icon: "/images/tokens/usdc.svg",
            exchangeLink: "https://capitaldex.exchange/swap?chain=neon",
            chain: "Neon",
            usdValue: neonLiquidity["CGT/USDC"]?.usdValue || "0",
            token0Amount: neonLiquidity["CGT/USDC"]?.CGT || "0",
            token1Amount: neonLiquidity["CGT/USDC"]?.USDC || "0",
            token0Symbol: "CGT2",
            token1Symbol: "USDC",
            bgColor: "bg-pink-500",
            gradientStart: "from-pink-500/30",
            gradientEnd: "to-blue-900/20",
            dex: "Capital DEX",
            dexIcon: "/images/dex/capdex.png"
        },
        {
            name: "CGT/JSOL",
            icon: "/images/tokens/jsol.svg",
            exchangeLink: "https://capitaldex.exchange/swap?chain=neon",
            chain: "Neon",
            usdValue: neonLiquidity["CGT/JSOL"]?.usdValue || "0",
            token0Amount: neonLiquidity["CGT/JSOL"]?.CGT || "0",
            token1Amount: neonLiquidity["CGT/JSOL"]?.JSOL || "0",
            token0Symbol: "CGT2",
            token1Symbol: "JSOL",
            bgColor: "bg-pink-500",
            gradientStart: "from-pink-500/30",
            gradientEnd: "to-blue-900/20",
            dex: "Capital DEX",
            dexIcon: "/images/dex/capdex.png"
        },
    ];
};