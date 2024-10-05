import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import PoolCard from '@/components/_pools';
import { getPoolsData } from '@/utils/poolsData';
import { PoolData } from '@/constant/types/PoolData';

interface TopPoolsProps {
  liquidity: any;
}

const TopPools: React.FC<TopPoolsProps> = ({ liquidity }) => {
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
        // delay: 0.5,
      },
    },
  };

  const allPools = getPoolsData({ liquidity });

  const getTopTwoPools = (): PoolData[] => {
    return allPools
      .filter(pool => pool.usdValue && Number(pool.usdValue) > 0)
      .sort((a, b) => Number(b.usdValue) - Number(a.usdValue))
      .slice(0, 2);
  };

  const topTwoPools = getTopTwoPools();

  return (
    <motion.div 
    ref={ref}
    variants={containerVariants}
    initial="hidden"
    animate={inView ? "visible" : "hidden"}
    className="col-span-12 lg:col-span-6 p-2 md:p-5 md:border-l border-blue-500/10 align-baseline h-full">
      <motion.div variants={itemVariants} className="grid grid-cols-12 lg:grid-cols-6 gap-2 lg:gab-5">
        {topTwoPools.map((pool, index) => (
          <PoolCard index={index} pool={pool} />
        ))}
      </motion.div>
    </motion.div>
  );
};

export default TopPools;