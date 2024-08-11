"use client";
import Image from "next/image";
import React from "react";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";
import { TbSum } from "react-icons/tb";
import { FaEthereum } from 'react-icons/fa';
import { SiBinance } from 'react-icons/si';

interface Trade {
    type: 'buy' | 'sell';
    timestamp: number;
    amount0: string;
    amount1: string;
    priceImpact: string;
    transactionHash: string;
    chain: 'ETH' | 'BSC';
    usdValue: string;
    pricePerToken: string;
    tradeSize: 'Small' | 'Medium' | 'Large';
}

interface CarouselProps {
    liquidity: {
        ETH: {
          usdValue: string;
          WETH: string;
          CGT: string;
        };
        BSC: {
          usdValue: string;
          WBNB: string;
          CGT: string;
        };
      };
    sortedTrades: Trade[];
    totalCGTTraded: number;
    biggestTrade: number;
    smallestTrade: number;
  };

const AppleCardsCarousel: React.FC<CarouselProps> = ({ liquidity, sortedTrades, totalCGTTraded, biggestTrade, smallestTrade  }) => {
    const data = [
        {
            category: "Trading Statistics",
            title: "24h Trades",
            src: "/images/tokens/cgt.png",
            content: (
                <div className="flex flex-col h-full w-80">
                    <div className="flex flex-col bg-black/40 rounded-md p-5 flex-grow justify-between">
                        <div className="flex justify-between items-center mb-4 bg-black/40 p-1 pl-3 rounded-md">
                            <span className="text-xl font-normal text-white">24h Trades</span>
                            <span className="bg-blue-500/80 text-white px-3 py-1 rounded-md text-xl">{sortedTrades.length}</span>
                        </div>
                        <div className="flex flex-col gap-2 mt-auto">
                            <div className="flex justify-between items-center">
                                <span className="text-yellow-400 flex items-center text-md"><TbSum className="mr-1" /> Total Traded</span>
                                <span className="bg-white text-black px-2 py-1 rounded-md text-sm">{totalCGTTraded.toLocaleString()} CGT</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-blue-400 text-md">Biggest Trade</span>
                                <span className="bg-black/40 text-white px-2 py-1 rounded-md text-sm">{biggestTrade.toLocaleString()} CGT</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-blue-300 text-md">Smallest Trade</span>
                                <span className="bg-black/40 text-white px-2 py-1 rounded-md text-sm">{smallestTrade.toLocaleString()} CGT</span>
                            </div>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            category: "Ethereum Pool",
            title: "CGT/WETH",
            src: "/images/chains/ethereum.png",
            content: (
                <div className="flex flex-col w-80">
                    <div className="flex flex-col items-center bg-black/40 pb-3 px-6 rounded-t-md">
                        <div className="flex flex-row gap-5 justify-center items-center w-10/12 bg-black/30 text-pink-500 text-center border-b border-blue-300/10 py-1 px-2 mb-4 rounded-b-md">
                            <span className="px-0.5 py-0.5 text-sm">
                                Buy on Uniswap 
                            </span>
                            <img src="images/dex/uniswap.png" className="w-5 h-5"/>
                        </div>
                        <div className="flex flex-row w-60 rounded-md justify-between">
                            <div className="flex flex-col justify-center items-center mb-2 relative">
                                <img src="/images/tokens/cgt.png" alt="CGT" className="w-14 h-14" />
                                <div className="absolute -right-10 bg-blue-600/90 rounded-full p-1 w-14 h-14">
                                    <img src="/images/chains/ethereum.png" alt="Ethereum" className="w-12 h-12" />
                                </div>
                            </div>
                            <div>
                                <div className="text-xl font-thin text-blue-400">
                                    CGT/WETH
                                </div>
                                <div className="text-xl text-white font-bold mb-2">
                                    ${Number(liquidity.ETH.usdValue).toLocaleString()}
                                </div>
                                <div className="text-xs text-blue-300/60 mt-1">
                                    Trades: {sortedTrades.filter(trade => trade.chain === 'ETH').length}
                                </div>
                            </div>
                        </div>
                        <div className="w-full text-xs text-blue-300/60 text-center border-t border-blue-800/40 pt-2 mt-2">
                            {Number(liquidity.ETH.WETH).toFixed(2)} <span className="mr-5 px-0.5 py-0.5 bg-blue-900/40 rounded-sm">WETH</span>  {Number(liquidity.ETH.CGT).toLocaleString()} <span className="px-0.5 py-0.5 bg-blue-900/40 rounded-sm">CGT</span>
                        </div>
                    </div>
                    <div className="bg-blue-400/40 py-1 rounded-b-md text-center text-gray-300">
                        ETHEREUM
                    </div>
                </div>
            ),
        },
        {
            category: "Binance Smart Chain Pool",
            title: "CGT/WBNB",
            src: "/images/tokens/bnb.png",
            content: (
                <div className="flex flex-col w-80">

                <div className="flex flex-col items-center bg-black/40 pb-3 px-6 rounded-md">
                    <div className="flex flex-row gap-5 justify-center items-center w-10/12 bg-black/30 text-[#3ED1DB] text-center border-b border-blue-300/10 py-1 px-2 mb-4 rounded-b-md">
                        <span className="px-0.5 py-0.5 text-sm">
                            Buy on Pancakeswap 
                        </span>
                        <img src="images/dex/pancakeswap.png" className="w-5 h-5"/>
                    </div>                    
                    <div className="flex flex-row w-60 rounded-md justify-between">
                        <div className="flex flex-col justify-center items-center mb-2 relative">
                            <img src="/images/tokens/cgt.png" alt="CGT" className="w-14 h-14" />
                            <div className="absolute -right-10 bg-blue-600 rounded-full p-1 w-14 h-14">
                                <img src="/images/tokens/bnb.png" alt="Binance Smart Chain" className="w-12 h-12" />
                            </div>
                        </div>
                        <div>
                            <div className="text-xl font-thin text-yellow-300">
                                CGT/WBNB
                            </div>
                            <div className="text-xl text-white font-bold mb-2">
                                ${Number(liquidity.BSC.usdValue).toLocaleString()}
                            </div>
                            <div className="text-xs text-blue-300/60 mt-1">
                                Trades: {sortedTrades.filter(trade => trade.chain === 'BSC').length}
                            </div>
                        </div>
                    </div>
                    <div className="w-full text-xs text-blue-300/60 text-center border-t border-blue-800/40 pt-2 mt-2">
                        {Number(liquidity.BSC.WBNB).toFixed(2)} <span className="mr-5 px-0.5 py-0.5 bg-yellow-900/40 rounded-sm">WBNB</span> {Number(liquidity.BSC.CGT).toLocaleString()} <span className="px-0.5 py-0.5 bg-yellow-900/40 rounded-sm">CGT</span>
                    </div>
                </div>
                <div className="bg-yellow-500/60 py-1 rounded-b-md text-center text-gray-300">
                    BINANCE SMART CHAIN
                </div>
            </div>
            ),
        },
        {
            category: "TON Pool",
            title: "jCGT2.0/USD₮",
            src: "/images/tokens/usdt.png",
            content: (
                <div className="flex flex-col w-80">
                    <div className="flex flex-col items-center bg-black/40 pb-3 px-6 rounded-t-md">
                        <div className="flex flex-row gap-5 justify-center items-center w-10/12 bg-black/30 text-gray-200 text-center border-b border-blue-300/10 py-1 px-2 mb-4 rounded-b-md">
                            <span className="px-0.5 py-0.5 text-sm">
                                Buy on Capial DEX 
                            </span>
                            <img src="images/dex/capdex.png" className="w-5 h-5"/>
                        </div>                     
                        <div className="flex flex-row w-60 rounded-md justify-between">
                            <div className="flex flex-col justify-center items-center mb-2 relative">
                                <img src="/images/tokens/cgt.png" alt="CGT" className="w-14 h-14" />
                                <div className="absolute -right-10 bg-blue-200 rounded-full p-1 w-14 h-14">
                                    <img src="/images/tokens/usdt.png" alt="Ethereum" className="w-12 h-12" />
                                </div>
                            </div>
                            <div>
                                <div className="text-xl font-thin text-green-400/70">
                                    jCGT/USD₮
                                </div>
                                <div className="text-xl text-white font-bold mb-2">
                                    coming soon
                                </div>
                                <div className="text-xs text-blue-300/30 mt-1">
                                    -
                                </div>
                            </div>
                        </div>
                        <div className="text-xs text-blue-300/40 text-center border-t border-blue-800/40 pt-2 mt-2">
                            xx.xx <span className="mr-5 px-0.5 py-0.5 bg-blue-900/40 rounded-sm">WETH</span>  x,xxx,xxx <span className="px-0.5 py-0.5 bg-blue-900/40 rounded-sm">CGT</span>
                        </div>
                    </div>
                    <div className="bg-green-600/60 py-1 rounded-b-md text-center text-gray-300">
                        TON BLOCKCHAIN
                    </div>
                </div>
            ),
        },
        {
            category: "TON Pool",
            title: "jCGT2.0/TON",
            src: "/images/chains/ton.png",
            content: (
                <div className="flex flex-col w-80">
                    <div className="flex flex-col items-center bg-black/40 pb-3 px-6 rounded-t-md">
                        <div className="flex flex-row gap-5 justify-center items-center w-10/12 bg-black/30 text-gray-200 text-center border-b border-blue-300/10 py-1 px-2 mb-4 rounded-b-md">
                            <span className="px-0.5 py-0.5 text-sm">
                                Buy on Capial DEX 
                            </span>
                            <img src="images/dex/capdex.png" className="w-5 h-5"/>
                        </div>                      
                        <div className="flex flex-row w-60 rounded-md justify-between">
                            <div className="flex flex-col justify-center items-center mb-2 relative">
                                <img src="/images/tokens/cgt.png" alt="CGT" className="w-14 h-14" />
                                <div className="absolute -right-10 bg-white rounded-full p-1 w-14 h-14">
                                    <img src="/images/chains/ton.png" alt="Ethereum" className="2" />                                
                                </div>
                            </div>
                            <div>
                                <div className="text-xl font-thin text-green-400/70">
                                    jCGT/TON
                                </div>
                                <div className="text-xl text-white font-bold mb-2">
                                    coming soon
                                </div>
                                <div className="text-xs text-blue-300/30 mt-1">
                                    Trades: 
                                </div>
                            </div>
                        </div>
                        <div className="text-xs text-blue-300/40 text-center border-t border-blue-800/40 pt-2 mt-2">
                            xx.xx <span className="mr-5 px-0.5 py-0.5 bg-blue-900/40 rounded-sm">WETH</span>  x,xxx,xxx <span className="px-0.5 py-0.5 bg-blue-900/40 rounded-sm">CGT</span>
                        </div>
                    </div>
                    <div className="bg-green-600/60 py-1 rounded-b-md text-center text-gray-300">
                    TON BLOCKCHAIN
                    </div>
            </div>
            ),
        },
        {
            category: "CURIO Pool",
            title: "CGT/USDC",
            src: "/images/tokens/usdc.svg",
            content: (
                <div className="flex flex-col w-80">
                    <div className="flex flex-col items-center bg-black/40 pb-3 px-6 rounded-t-md">
                        <div className="flex flex-row gap-5 justify-center items-center w-10/12 bg-black/30 text-gray-200 text-center border-b border-blue-300/10 py-1 px-2 mb-4 rounded-b-md">
                            <span className="px-0.5 py-0.5 text-sm">
                                Buy on Capial DEX 
                            </span>
                            <img src="images/dex/capdex.png" className="w-5 h-5"/>
                        </div>                      
                        <div className="flex flex-row w-60 rounded-md justify-between">
                            <div className="flex flex-col justify-center items-center mb-2 relative">
                                <img src="/images/tokens/cgt.png" alt="CGT" className="w-14 h-14" />
                                <div className="absolute -right-10 bg-white rounded-full p-1 w-14 h-14">
                                    <img src="/images/tokens/usdc.svg" alt="Ethereum" className="2" />                                
                                </div>
                            </div>
                            <div>
                                <div className="text-xl font-thin text-blue-500/90">
                                    CGT/USDC
                                </div>
                                <div className="text-xl text-white font-bold mb-2">
                                    coming soon
                                </div>
                                <div className="text-xs text-blue-300/30 mt-1">
                                    Trades: 
                                </div>
                            </div>
                        </div>
                        <div className="text-xs text-blue-300/40 text-center border-t border-blue-800/40 pt-2 mt-2">
                            xx.xx <span className="mr-5 px-0.5 py-0.5 bg-blue-900/40 rounded-sm">WETH</span>  x,xxx,xxx <span className="px-0.5 py-0.5 bg-blue-900/40 rounded-sm">CGT</span>
                        </div>
                    </div>
                    <div className="bg-blue-500/50 py-1 rounded-b-md text-center text-gray-300">
                    CURIO CHAIN
                </div>
            </div>
            ),
        },
        {
            category: "CURIO Pool",
            title: "CGT/DAI",
            src: "/images/tokens/dai.png",
            content: (
                <div className="flex flex-col w-80">
                    <div className="flex flex-col items-center bg-black/40 pb-3 px-6 rounded-t-md">
                        <div className="flex flex-row gap-5 justify-center items-center w-10/12 bg-black/30 text-gray-200 text-center border-b border-blue-300/10 py-1 px-2 mb-4 rounded-b-md">
                            <span className="px-0.5 py-0.5 text-sm">
                                Buy on Capial DEX 
                            </span>
                            <img src="images/dex/capdex.png" className="w-5 h-5"/>
                        </div>                      
                        <div className="flex flex-row w-60 rounded-md justify-between">
                            <div className="flex flex-col justify-center items-center mb-2 relative">
                                <img src="/images/tokens/cgt.png" alt="CGT" className="w-14 h-14" />
                                <div className="absolute -right-10 bg-white rounded-full p-1 w-14 h-14">
                                    <img src="/images/tokens/dai.png" alt="Ethereum" className="2" />                                
                                </div>
                            </div>
                            <div>
                                <div className="text-xl font-thin text-blue-500/90">
                                    CGT/DAI
                                </div>
                                <div className="text-xl text-white font-bold mb-2">
                                    coming soon
                                </div>
                                <div className="text-xs text-blue-300/30 mt-1">
                                    Trades: 
                                </div>
                            </div>
                        </div>
                        <div className="text-xs text-blue-300/40 text-center border-t border-blue-800/40 pt-2 mt-2">
                            xx.xx <span className="mr-5 px-0.5 py-0.5 bg-blue-900/40 rounded-sm">WETH</span>  x,xxx,xxx <span className="px-0.5 py-0.5 bg-blue-900/40 rounded-sm">CGT</span>
                        </div>
                    </div>
                    <div className="bg-blue-500/50 py-1 rounded-b-md text-center text-gray-300">
                    CURIO CHAIN
                </div>
            </div>
            ),
        },
        // Add more dummy cards here if needed to reach 6 total
    ];

    const cards = data.map((card, index) => (
        <Card key={card.src} card={card} index={index} />
    ));

    return (
        <div className="w-full h-full">
            <Carousel items={cards} />
        </div>
    );
}

export default AppleCardsCarousel;