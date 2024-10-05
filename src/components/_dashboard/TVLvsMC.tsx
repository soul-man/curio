import React, { useState, useEffect,useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Skeleton } from "@/components/ui/render-skeleton";
import { GradientHeaderH4 } from '@/components/ui/GradientHeaderH4';
import { PoolData } from '@/constant/types/PoolData';
import { getPoolsData } from '@/utils/poolsData';
import { abbreviateNumber } from '../../utils/helpers';

interface StakingProps {
  marketCap: number;
  liquidity: any;
}

const TVLvsMC: React.FC<StakingProps> = ({ marketCap, liquidity }) => {
  const poolsData: PoolData[] = getPoolsData(liquidity);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });
  const totalLockedInUsd = poolsData.reduce((total, pool) => total + parseFloat(pool.usdValue), 0)

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
      className="col-span-12 md:col-span-6 lg:col-span-4 p-5 md:p-5 border-b border-t md:border-t-transparent border-blue-500/10">
      <div className="flex flex-col justify-between items-center rounded-md w-full h-40 md:h-full">
        <motion.div variants={itemVariants}>
          <GradientHeaderH4 headline="MCap/POOL ratio" />
        </motion.div>
        <motion.div variants={itemVariants} className="flex flex-col md:flex-col gap-3 w-full text-center">
          <div className="text-6xl md:text-6xl font-bold text-blue-400">
            {(totalLockedInUsd / marketCap * 100).toFixed(2)} <span className="font-extralight">%</span>
          </div>
        </motion.div >
        <motion.div variants={itemVariants} className="text-sm md:text-md font-thin text-white text-center">
          {(totalLockedInUsd / marketCap * 100).toFixed(2)}% of the market capitalization is locked in all pools.
        </motion.div >
      </div>
    </motion.div>
  );
};

export default TVLvsMC;