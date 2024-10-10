"use client";
import React from 'react';
import { GrFormNextLink } from "react-icons/gr";

interface CardData {
  title: string;
  subtitle: string;
  description: string;
  link: string;
  backgroundImage?: string;
  gradient: string;
  colSpan?: string;
}

const cards: CardData[] = [
  {
    title: "Rollapp.store",
    subtitle: "RWA Marketplace",
    description: "Rollapp.store is the place to buy, trade and create tokens based on Real World Assets (RWA) in a fully compliant and regulated environment.",
    link: "https://rollapp.store/",
    backgroundImage: "url('./images/backgrounds/3-card-bg-small.png')",
    gradient: "from-blue-500 to-blue-800",
    colSpan: "md:col-span-4"
  },
  {
    title: "Capital DEX",
    subtitle: "Decentralized Exchange",
    description: "Capital DEX is a cutting-edge decentralized exchange that represents the new generation of DEXs.",
    link: "https://capitaldex.exchange/",
    backgroundImage: "url('./images/backgrounds/2-card-bg-small.png')",
    gradient: "from-blue-300 to-blue-600",
    colSpan: "md:col-span-4"
  },
  {
    title: "Curio Gas Token",
    subtitle: "CGT Multichain Token",
    description: "CGT is the driving force behind Curio DAO. It facilitates governance within the ecosystem, ensuring efficient and secure operations.",
    link: "https://capitaldex.exchange/docs/Curio_Governance_Token_CGT.pdf",
    gradient: "from-blue-300 to-blue-600",
    colSpan: "md:col-span-4"
  },
  {
    title: "Staking",
    subtitle: "Curio Chain (Kusama)",
    description: "Stake your Curio Gas Tokens (CGT) on the Curio chain to earn a competitive 16% annual percentage yield (APY).",
    link: "https://capitaldex.exchange/staking",
    gradient: "from-blue-400 to-blue-700",
    colSpan: "md:col-span-4"
  },
  // {
  //   title: "TON Staking",
  //   subtitle: "Stake TON on L2",
  //   description: "Stake your TON on the Curio Level 2 TON chain to earn a yield (APY).",
  //   link: "https://bridge.capitaldex.exchange/",
  //   backgroundImage: "url('./images/backgrounds/3-card-bg-small.png')",
  //   gradient: "from-blue-400 to-blue-700",
  //   colSpan: "md:col-span-4"
  // },
  {
    title: "Liquidity pools",
    subtitle: "Earn from trading fees",
    description: "By adding liquidity to pools on Capital DEX, users can earn fees and participate in the robust financial ecosystem provided by Curio.",
    link: "https://capitaldex.exchange/pools",
    gradient: "from-blue-300 to-blue-600",
    colSpan: "md:col-span-4"
  },
  {
    title: "Farming",
    subtitle: "Lock your Pool Tokens",
    description: "Users can lock up their LP tokens and farm Curio Gas Tokens (CGT), providing an additional revenue stream.",
    link: "https://capitaldex.exchange/farms",
    gradient: "from-blue-300 to-blue-600",
    colSpan: "md:col-span-4"
  },
  {
    title: "Stablecoin on BTC",
    subtitle: "Bitspectrum's B-Stable",
    description: "Curio is leveraging bitspectrum to bring B-Stable to the masses. This Stablecoin allows users to lend against real-world assets by locking NFTs as collateral.",
    link: "https://app.bitspectrum.capitaldex.exchange/",
    gradient: "from-blue-300 to-blue-600",
    colSpan: "md:col-span-4"
  },
];

const InfoBoxes = () => {

  const Card: React.FC<CardData> = ({ title, subtitle, description, link, backgroundImage, gradient, colSpan }) => (
    <div className={`relative group col-span-12 sm:col-span-6 ${colSpan} bg-blue-950/30 border border-blue-600/20 rounded-md duration-300 hover:scale-[102%]`} style={{backgroundImage, backgroundSize: 'cover', backgroundPosition: 'center'}}>
      <a href={link}>
        <div className='absolute top-0 right-0 w-[30px] h-[30px] md:w-[50px] md:h-[50px] lg:w-[45px] lg:h-[45px] flex flex-col justify-center items-center bg-black dark:bg-black rounded-tr-md rounded-bl-md'>
          <GrFormNextLink className="text-2xl md:text-4xl group-hover:text-6xl text-white/80 group-hover:text-white duration-300 transition-all"/>
        </div>
        <div className='p-3 lg:p-5 h-full flex flex-col gap-2 md:gap-4 lg:gap-5'>
          <div>
            <h4 className="mb-1 pr-12 text-2xl md:text-3xl font-bold text-black/90 dark:text-white">
              <span className={`font-bold bg-gradient-to-r ${gradient} inline-block text-transparent bg-clip-text`}>{title}</span>
            </h4>
            <p className="md:text-md font-normal text-blue-100/90">
              {subtitle}
            </p>
          </div>
          <p className="md:text-md font-extralight text-blue-300/90">
            {description}
          </p>
        </div>
      </a>
    </div>
  );

  return (
    <>
      <div className="flex mx-5 xl:mx-auto my-5 flex-col max-w-screen-xl items-center justify-between mb-48 rounded-md">
          

        <div className='flex flex-col md:flex-col mb-10 md:mb-16'>
          <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-5 text-black/90 dark:text-white md:!leading-[4.2rem]">Explore the Curio <span className="font-bold bg-gradient-to-r from-[#0A85E1] to-[#0763A7] inline-block text-transparent bg-clip-text"> Eco-System</span></h3>
          
          <p className="text-lg sm:text-xl md:text-2xl font-thin text-black/90 dark:dark:text-blue-300/80">
            Discover Curio&apos;s comprehensive DeFi ecosystem, featuring Capital DEX and RWA tokenization. Engage in farming, staking, and liquidity provision across multiple chains, while benefiting from a regulated environment and innovative features like collateralized stablecoins.
          </p>
        </div>


        <div className="grid grid-cols-12 gap-4 w-full">

        {cards.map((card, index) => (
      <Card key={index} {...card} />
    ))}

        </div>

      </div>
    </>
  );
};

export default InfoBoxes;
