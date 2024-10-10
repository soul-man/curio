import React, { useState, useEffect,useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Skeleton } from "@/components/ui/render-skeleton";
import { GradientHeaderH4 } from '@/components/ui/GradientHeaderH4';
import { FaLink } from "react-icons/fa";

interface StakingProps {
  staking: number;
  marketPrice: number;
  cgtSupplyOnKusama: number;
}

const Staking: React.FC<StakingProps> = ({ staking, marketPrice, cgtSupplyOnKusama }) => {
  const [showSkeleton, setShowSkeleton] = useState(true);

  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });


  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: -50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };
  
  useEffect(() => {
    const timer = setTimeout(() => setShowSkeleton(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div 
      ref={ref}
      initial="hidden"
      variants={containerVariants}
      animate={inView ? "visible" : "hidden"}
      className="col-span-12 md:col-span-6 lg:col-span-4 p-5 md:p-5 border-b border-t md:border-t-transparent md:border-r md:border-l border-blue-500/10"
    >
      <a href="https://capitaldex.exchange/staking" target="_blank" title='CGT Staking on Curio Chain'>
      <motion.div 
        className="group flex flex-col justify-between items-center rounded-md w-full h-40 md:h-full bg-cover bg-center relative"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <FaLink className="absolute top-3 right-3 text-2xl text-blue-900/70 group-hover:text-white group-hover:scale-125 duration-200" />
        <motion.div variants={itemVariants}>
          <GradientHeaderH4 headline="Staking" />
        </motion.div>
        <motion.div variants={itemVariants} className="flex flex-col">
          <div className="text-6xl md:text-6xl font-bold text-white">
              16% APY
          </div>
          <span className="text-3xl md:text-lg font-bold text-blue-500/90 uppercase text-center">on Curio Chain</span>
        </motion.div >
        <motion.div variants={itemVariants} className="mt-0 md:mt-0 flex flex-row lg:flex-row justify-between w-full lg:gap-1 font-thin text-sm lg:text-md rounded-b-md text-left lg:text-left text-blue-300/90">
            {showSkeleton || staking === undefined ? (
              <Skeleton className="bg-blue-700/30 h-4 w-26" />
            ) : (
              <span>
                {Number(staking).toLocaleString('en-US')} CGT
              </span>
            )} 

            {showSkeleton || staking === undefined ? (
              <Skeleton className="bg-blue-700/30 h-4 w-24" />
            ) : (
              <span>
                ${Number(staking * marketPrice).toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </span>
            )} 

            {showSkeleton || staking === undefined ? (
              <Skeleton className="bg-blue-700/30 h-4 w-12" />
            ) : (
              <span>
                {Number(staking / cgtSupplyOnKusama * 100).toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}%
              </span>
            )} 
          </motion.div>
      </motion.div>
      </a>
    </motion.div>
  );
};

export default Staking;