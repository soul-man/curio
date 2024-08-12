"use client";
import Image from 'next/image';
import React, { use, useEffect } from 'react';
import { BackgroundBeams } from "./ui/background-beams";
import { Boxes } from "./ui/background-boxes";
import { FaInfo } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";
import { GrFormNextLink } from "react-icons/gr";

const Intro = () => {
  return (
    <>
      <div style={{backgroundImage: "url('./images/ferrari-intro-new.jpg')", backgroundSize: 'cover'}} className="bg-right md:bg-center lg:bg-center relative overflow-hidden bg-blue-600 dark:bg-blue-950/20 flex mx-3 md:mx-5 2xl:mx-auto my-3 px-3 md:my-5 md:px-5 pb-3 md:pb-5 flex-col max-w-screen-2xl justify-between min-h-[calc(100vh-22px)] md:min-h-[calc(100vh-40px)] mb-24 md:mb-32 rounded-md">
{/*         
      <p className="absolute .rotating-container top-20 left-20" id="rotating">
        <svg width="200" height="200">
          <path id="curve" d="M 25 70 A 70 70 0 1 1 25 127"></path>
          <text className="text text-xl">
            <textPath href="#curve">
              REAL WORLD ASSETS - REAL WORLD ASSETS
            </textPath>
          </text>
        </svg>
      </p> */}

        <div className="w-full flex flex-row justify-center items-center">
          <div className="flex flex-row justify-center w-[200px] h-12 bg-[#040404] rounded-b-md z-30">
            <a href="./" className="flex flex-row items-center">
              <span className="p-1 px-3 text-lg font-mono text-white tracking-widest">#stay-curio</span>
            </a>
          </div>
        </div>

        <div className="flex flex-col justify-center min-h-[350px] z-30 md:mb-40 lg:mb-32">
          <div className="flex flex-col pl-5 justify-center items-center md:justify-start md:items-start">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-2 md:-mb-1">
              CURIO INSIGHTS
            </h1>
            <h2 className="md:tracking-[0.175rem] lg:tracking-[0.5rem] w-fit px-5 py-1 bg-black/70 md:bg-blue-400/70 rounded-md mb-5 md:mb-10 md:mt-3 text-lg md:text-2xl lg:text-2xl font-thin text-blue-100 md:dark:text-blue-100/80">
              We bring RWA to the masses
            </h2>
            <p className="pl-2 w-12/12 md:w-6/12 lg:w-4/12 md:mt-3 text-xl md:text-3xl font-thin text-white md:text-white lg:text-blue-300">
            We offer unparalleled analytics to support the CURIO DAO. 
            Explore a comprehensive RWA ecosystem and keep track of market data through our Dashboards.
            </p>
          </div>
        </div>

        {/* New box */}
        <div className="hidden md:flex flex-col absolute top-12 right-16 md:top-20 md:right-7 lg:top-32 lg:right-24 bg-black/30 text-white px-5 py-2 rounded-md z-40">
          <p className="md:text-md lg:text-lg font-bold">First tokenized Super Car</p>
          <p className="md:text-2xl lg:text-3xl font-bold mb-1 text-blue-400">Ferrari F12 TDF</p>
          <p className="md:text-xs lg:text-sm font-thin text-white flex flex-row justify-between items-center border-t border-black/20 pt-1">
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

        <div className="grid grid-cols-12 gap-3 md:gap-5 w-full z-30">
          <div className="bg-black/60 relative group col-span-6 sm:col-span-4 md:col-span-4 rounded-md text-white duration-300 hover:-translate-y-2 hover:scale-[103%] transition-all border-blue-600/10 border">
            <div className='absolute top-0 right-0 w-[30px] h-[30px] md:w-[50px] md:h-[50px] lg:w-[40px] lg:h-[40px] flex flex-col justify-center items-center bg-black dark:bg-black rounded-tr-md rounded-bl-md'>
              <FaInfo className="text-lg md:text-xl group-hover:text-2xl group-hover:text-white text-blue-400 group-hover:dark:text-white duration-300 transition-all"/>
            </div>
            <div className='p-3 lg:px-5 lg:py-3 h-full flex flex-col gap-2 md:gap-2'>
              <h4 className="pr-12 text-xl md:text-xl font-extralight">
                Dedicated to Curio Invest
              </h4>
              <p className="md:text-md font-extralight text-blue-300/80">
                This info page is dedicated to Curio Invest, a RWA tokenization platform with its native token CGT.
              </p>
            </div>
          </div>

          <div className="bg-black/60 relative group col-span-6 sm:col-span-4 md:col-span-4 rounded-md duration-300 hover:-translate-y-2 hover:scale-[103%] border-blue-800/10 border">
              <div className='absolute top-0 right-0 w-[30px] h-[30px] md:w-[50px] md:h-[50px] lg:w-[40px] lg:h-[40px] flex flex-col justify-center items-center bg-black dark:bg-black rounded-tr-md rounded-bl-md'>
                <FaInfo className="text-lg md:text-xl group-hover:text-2xl group-hover:text-white text-blue-400 group-hover:dark:text-white duration-300 transition-all"/>
              </div>
              <div className='p-3 lg:px-5 lg:py-3 h-full flex flex-col gap-2 md:gap-2'>
                <h4 className="pr-12 text-xl md:text-xl font-extralight">
                  Best starting point
                </h4>
                <p className="md:text-md font-extralight text-blue-300/80">
                  Our platform offers everything you need to dive efficiently into the curio eco-system.
                </p>
              </div>
          </div>

          <div className="bg-black/60 relative group col-span-12 sm:col-span-4 md:col-span-4 rounded-md text-white duration-300 hover:-translate-y-2 hover:scale-[103%] transition-all border-black/10 border">
              <div className='absolute top-0 right-0 w-[30px] h-[30px] md:w-[50px] md:h-[50px] lg:w-[40px] lg:h-[40px] flex flex-col justify-center items-center bg-black rounded-tr-md rounded-bl-md'>
                <FaInfo className="text-lg md:text-xl group-hover:text-2xl group-hover:text-white text-blue-400 group-hover:dark:text-white duration-300 transition-all"/>
              </div>
              <div className='p-3 lg:px-5 lg:py-3 h-full flex flex-col gap-2 md:gap-2'>
                <h4 className="pr-12 text-xl md:text-xl font-extralight">
                  All in one place
                </h4>
                <p className="md:text-md font-extralight text-blue-300/80">
                  We bundle Curio-related data in one place, ensuring easy access to all necessary information.
                </p>
              </div>
          </div>

        </div>

        <div className="absolute inset-0 w-full h-full bg-slate-900/30 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
          {/* <BackgroundBeams className=' invisible dark:visible' /> 
          <Boxes />  */}
        </div>
    </>

  );
};

export default Intro;
