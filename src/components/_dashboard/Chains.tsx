import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { GradientHeaderH4 } from '@/components/ui/GradientHeaderH4';
import Tooltip from '@/components/ui/Tooltip';
import { FaBridgeCircleXmark, FaBridgeCircleCheck, FaHouse } from "react-icons/fa6";

type ChainsType = {
  name: string;
  icon: string;
  contractUrl?: string;
  bridgeUrl?: string;
  bridgeAvailable?: boolean;
  supplyKey?: string;
  comingSoon?: boolean;
}

type ChainItemType = {
  chain: ChainsType;
}

const chains: Record<string, ChainsType> = {
  ethereum: {
    name: "Ethereum",
    icon: "/images/chains/ethereum.png",
    contractUrl: "https://etherscan.io/token/0x0E186357c323c806C1efdad36D217F7a54b63D18",
    bridgeUrl: "https://bridge.capitaldex.exchange/",
    bridgeAvailable: true,
    supplyKey: "cgtSupplyOnEth"
  },
  bsc: {
    name: "Binance Smart Chain",
    icon: "/images/chains/binance-chain.png",
    contractUrl: "https://bscscan.com/token/0x61632b49Df5CA20846b3220bFc42BDa5E32C81ad",
    bridgeUrl: "",
    bridgeAvailable: false,
    supplyKey: "cgtSupplyOnBsc"
  },
  curio: {
    name: "Curio Chain",
    icon: "/images/dex/capdex.png",
    contractUrl: "https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fparachain.curioinvest.com%2F#/explorer",
    bridgeUrl: "https://bridge.capitaldex.exchange/",
    bridgeAvailable: true,
    supplyKey: "cgtSupplyOnKusama"
  },
  ton: {
    name: "TON",
    icon: "/images/chains/ton.png",
    contractUrl: "https://tonviewer.com/EQC16UcPDOF1YBcDfI3-SNA8nr8ECliCRN3O5d_-SSBcUSjf",
    bridgeUrl: "https://bridge.capitaldex.exchange/",
    bridgeAvailable: true,
    supplyKey: "cgtSupplyOnTon"
  },
  neon: {
    name: "Solana Neon EVM",
    icon: "/images/chains/neon-evm.png",
    contractUrl: "https://neon.blockscout.com/token/0xC1eD606683a3f89317d64BDA602628d68a0B4b24",
    bridgeUrl: "",
    bridgeAvailable: false,
    supplyKey: "cgtSupplyOnNeon"
  },
  tonL2: {
    name: "TON L2",
    icon: "/images/chains/ton.png",
    comingSoon: true
  },
  skale: {
    name: "Skale",
    icon: "/images/chains/skale.png",
    comingSoon: true
  },
  boba: {
    name: "Boba",
    icon: "/images/chains/boba.png",
    comingSoon: true
  }
};

const Chains: React.FC= () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  const backgroundVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1 } },
  };

  const containerVariants = {
    hidden: { y: -50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
        delay: 0.3,
      },
    },
  };

  const ChainItem: React.FC<ChainItemType> = ({ chain }) => (
    <div className="col-span-12 md:col-span-4 lg:col-span-3">
      <div className={`relative flex flex-row gap-3 p-2 md:p-3 items-center ${chain.comingSoon ? 'bg-blue-800/10' : ' bg-gradient-to-br from-blue-700/20 to-blue-900/10 '} rounded-sm`}>
        <Image src={chain.icon} width="25" height="25" className="my-auto w-6 h-6 md:w-8 md:h-8"  alt={chain.name} />
        <div className="w-full">
          <div className={`text-sm md:text-[16px] font-thin ${chain.comingSoon ? 'text-blue-400/70' : 'text-blue-100'}`}>{chain.name}</div>
        </div>
        {chain.comingSoon ? 
          <div className="text-right w-full font-thin text-blue-400/70">coming soon</div>
        :
          <div className="flex flex-row gap-3 justify-between">
            <Tooltip content="Contract">
              <a href={chain.contractUrl} target="_new">
                <FaHouse className='w-4 h-4 md:w-5 md:h-5 text-blue-400 hover:scale-125 hover:rotate-12 duration-200' />
              </a>
            </Tooltip>
            {chain.bridgeAvailable ? 
              <Tooltip content="Bridge">
                <a href={chain.bridgeUrl} target="_new">
                  <FaBridgeCircleCheck className='w-4 h-4 md:w-5 md:h-5 text-green-500 hover:scale-125 hover:rotate-12 duration-200' />
                </a>
              </Tooltip>
            :
              <Tooltip content="Bridge unavailable">
                  <FaBridgeCircleXmark className='w-4 h-4 md:w-5 md:h-5 hover:scale-125 hover:rotate-12 duration-200 text-red-500' />
              </Tooltip>
            }
          </div>
        }
      </div>
    </div>
  );

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className="col-span-12 lg:col-span-12 row-span-1 p-5 md:p-5"
    >
      <motion.div variants={backgroundVariants} className="h-full">
        <GradientHeaderH4 headline="Chains + Bridges" />
        <div className="grid grid-cols-12 gap-2 md:gap-3 mt-3">
          {Object.entries(chains).map(([key, chain]) => (
            <ChainItem key={key} chain={chain} />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Chains;