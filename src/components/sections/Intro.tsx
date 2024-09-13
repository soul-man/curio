"use client";
import React, { useState, useEffect } from 'react';
import useSWR from 'swr'
import { Skeleton } from "@/components/ui/render-skeleton"
import { FiExternalLink } from "react-icons/fi";
import { FaTelegramPlane, FaDiscord, FaLinkedinIn, FaYoutube, FaInstagram } from 'react-icons/fa';
import { FaXTwitter } from "react-icons/fa6";
import { TfiWorld } from "react-icons/tfi";

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const Intro = () => {

  const [showSkeleton, setShowSkeleton] = useState(true);

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

  useEffect(() => {
    const timer = setTimeout(() => setShowSkeleton(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
    <div className="mx-auto max-w-screen-2xl mb-44">

      <div style={{backgroundImage: "url('./images/ferrari-intro-new.jpg')", backgroundSize: 'cover'}} 
        className="
        overflow-hidden
        relative min-h-[calc(100vh-335px)] md:min-h-[calc(100vh-235px)] 
        flex flex-col justify-center
        mx-3 md:mx-5 mt-3 
        outline outline-offset-0 outline-1 outline-blue-200/10 
        bg-[90%] md:bg-[80%] lg:bg-right
        rounded-xs"
      >

      <div className="absolute inset-0 w-full h-full bg-slate-900/50 lg:bg-slate-900/20 z-0 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />


        {/* We bring rwa to the masses */}
        <div className="flex flex-col justify-start z-30 md:pb-[10vh] pl-0 lg:pl-10">
          <div className="flex flex-col pl-5 justify-center items-center md:justify-start md:items-start">
            <div className="flex flex-row justify-center bg-black/70 rounded-md z-30 mb-3">
              <a href="./" className="flex flex-row items-center">
                <span className="p-2 px-3 text-sm md:text-lg font-mono md:text-white/90 tracking-widest">#stay-curio</span>
              </a>
            </div>
            <h1 className="w-12/12 md:w-8/12 lg:w-8/12 text-4xl md:text-6xl lg:text-7xl xl:text-8xl uppercase font-bold mb-2 md:mb-0 text-white inline-block">
              We bring rwa<br/>to the masses
            </h1>
            <p className="px-2 w-full md:w-7/12 lg:w-6/12 md:mt-3 text-lg md:text-2xl xl:text-3xl font-light text-white md:text-white lg:text-blue-200 text-center md:text-left">
              We offer unparalleled CGT analytics to support the CURIO DAO. 
              Explore our comprehensive Dashboards and keep track of market data.
            </p>
          </div>
        </div>

        {/* First tokenized Super Car */}
        <div className="hidden md:flex flex-col absolute top-12 right-16 md:top-20 md:right-7 lg:top-10 lg:right-10 bg-black/40 text-white px-4 py-3 rounded-xs z-40">
          <p className="md:text-md lg:text-md font-light">First tokenized Super Car</p>
          <p className="md:text-2xl lg:text-3xl font-bold mb-1 text-blue-500">Ferrari F12 TDF</p>
          <p className="md:text-xs lg:text-sm font-thin text-blue-300 flex flex-row justify-between items-center border-t border-white/20 pt-1">
            Total Supply: 1,100,000 CT1
            <a 
              href="https://etherscan.io/token/0x4F01887Cbd397a676921985639cEF79398204Cf0" 
              target="_blank" 
              rel="noopener noreferrer"
              className="ml-2 hover:text-blue-200 transition-colors duration-200"
            >
              <FiExternalLink size={14} className="text-blue-500" />
            </a>
          </p>
        </div>

      </div>

      {/* Grid line */}
      <div className="grid grid-cols-12 gap-0 px-3 md:px-5 2xl:px-auto">
          
        {/* Dedicated to Curio Invest */}
        <div className="col-span-12 sm:col-span-4 md:col-span-4">
          <div className="h-full md:border-r border-b border-blue-500/20 md:px-2 py-3">
            <div className='flex flex-col text-center md:text-left md:gap-2'>
              <h4 className="text-lg lg:text-xl font-light text-blue-500">
                Dedicated to Curio Invest
              </h4>
              <p className="text-sm md:text-md font-extralight text-blue-100/80">
                This info page is dedicated to <a href="https://curioinvest.com/" target="_blank" className="underline font-light">Curio Invest</a>, a RWA tokenization platform with its native token CGT.
              </p>
            </div>
          </div>
        </div>

        {/* Community */}
        <div className="col-span-6 sm:col-span-4 md:col-span-3 lg:col-span-2">
          <div className="h-full border-r border-b border-blue-500/20 md:px-5 py-3">
            <div className='flex flex-col gap-2 md:gap-1'>
              <h4 className="text-md lg:text-xl font-light text-blue-500 mb-1 text-center md:text-left">
                Community
              </h4>

              <div className="flex flex-row justify-center md:justify-start flex-wrap gap-3 px-3 md:p-0">
                <a href="https://curioinvest.com/" target="_blank" rel="noopener noreferrer" className="flex items-center text-white rounded-md transition duration-300">
                  <TfiWorld className="text-2xl" />
                </a>
                <a href="https://x.com/curio_invest" target="_blank" rel="noopener noreferrer" className="flex items-center text-white rounded-md transition duration-300">
                  <FaXTwitter className="text-2xl" />
                </a>
                <a href="https://t.me/CurioInvestCommunity" target="_blank" rel="noopener noreferrer" className="flex items-center text-white transition duration-300">
                  <FaTelegramPlane className="text-2xl" />
                </a>
                <a href="https://discord.com/invite/ffNqMPDGUu" target="_blank" rel="noopener noreferrer" className="flex items-center text-white transition duration-300">
                  <FaDiscord className="text-2xl" />
                </a>
                <a href="https://www.linkedin.com/company/curioag/" target="_blank" rel="noopener noreferrer" className="flex items-center text-white transition duration-300">
                  <FaLinkedinIn className="text-2xl" />
                </a>
                <a href="https://www.youtube.com/@curioinvest3071/videos" target="_blank" rel="noopener noreferrer" className="flex items-center text-white transition duration-300">
                  <FaYoutube className="text-2xl" />
                </a>
                <a href="https://www.instagram.com/curioinvest/" target="_blank" rel="noopener noreferrer" className="flex items-center text-white transition duration-300">
                  <FaInstagram className="text-2xl" />
                </a>
              </div>
            </div>
          </div>
        </div>

      {/* Market Price */}
      <div className="hidden md:block col-span-6 sm:col-span-4 md:col-span-3 lg:col-span-2">
        <div className="h-full border-r border-b border-blue-500/20 px-5 py-3">
          <div className='flex flex-col gap-2 md:gap-1'>
            <h4 className="text-md lg:text-xl font-light text-blue-500">
              Market Price
            </h4>
            <div className="text-3xl font-bold text-white">
                {showSkeleton || marketData.marketPrice === undefined ? (
                  <Skeleton className="h-8 w-32 bg-blue-950" />
                ) : (
                  <><span className="font-extralight">$</span>{" "}
                  {marketData.marketPrice}</>
                )}
              </div>
              <div className="font-extralight">
                {showSkeleton || marketData.priceChange === undefined ? (
                  <Skeleton className="h-4 w-20 bg-blue-950 inline-block" />
                ) : (
                  <>
                    <span className="text-blue-100/80 pr-2 text-sm">Change:</span>
                    <span className={"px-2 rounded-md text-sm " + (parseFloat(marketData.priceChange) > 0 ? 'text-green-500' : 'text-red-500')}>
                      {marketData.priceChange > 0 ? '+' : ''}
                      {marketData.priceChange}%
                    </span>
                  </>
                )}
              </div>
          </div>
        </div>
      </div>

        {/* Staking APY */}
        <div className="hidden lg:block col-span-6 sm:col-span-4 md:col-span-2">
          <div className="h-full border-r border-b border-blue-500/20 px-5 py-3">
            <div className='flex flex-col gap-2 md:gap-1'>
              <h4 className="text-md md:text-xl font-light text-blue-500">
                Staking APY
              </h4>
              <div className="text-3xl font-bold text-white">
                <span className="mb-1 text-2xl md:text-3xl font-bold text-white">
                  16%
                </span>
              </div>
              <div className="font-extralight">
                <span className="text-sm font-light text-blue-100/80 uppercase">on Curio Chain</span>
              </div>
            </div>
          </div>
        </div>

        {/* Buy CGT */}
        <div className="col-span-6 sm:col-span-4 md:col-span-2">
          <div className="h-full border-b border-blue-500/20 px-5 py-3">
            <div className='flex flex-col gap-2 md:gap-2'>
              <h4 className="text-md lg:text-xl font-light text-blue-500 text-center md:text-left">
                Buy CGT
              </h4>
              <div className="flex flex-row justify-center md:justify-start items-center gap-2">
                <a href="https://app.uniswap.org/swap?inputCurrency=ETH&outputCurrency=0x0E186357c323c806C1efdad36D217F7a54b63D18" target="_blank">
                  <img src="./images/dex/uniswap.png" className="w-8 lg:w-9" />
                </a>
                <a href="https://pancakeswap.finance/swap?outputCurrency=0x61632b49Df5CA20846b3220bFc42BDa5E32C81ad" target="_blank">
                <img src="./images/dex/pancakeswap.png" className="w-8 lg:w-9" />
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>

    
    </>

  );
};

export default Intro;