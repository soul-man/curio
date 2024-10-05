import React, { useRef } from 'react';
import useSWR from 'swr'
import { getPoolsData } from '@/utils/poolsData';
import { PoolData } from '@/constant/types/PoolData';
import PoolCard from '@/components/_pools';
import { GradientHeaderH4 } from '@/components/ui/GradientHeaderH4';
import { abbreviateNumber } from '../../utils/helpers';
import { motion, useInView } from 'framer-motion';

const fetcher = (url: string) => fetch(url).then((res) => res.json())

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

  const poolsData: PoolData[] = getPoolsData(liquidity);

  // Sort poolsData by usdValue in descending order
  poolsData.sort((a, b) => {
    const aValue = parseFloat(a.usdValue);
    const bValue = parseFloat(b.usdValue);
    return bValue - aValue;
  });

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  return (
    <>
      <div id="pools" className="max-w-screen-2xl mx-auto px-2 md:px-5 mb-44">
        <motion.div 
          ref={ref}
          className='flex flex-col'
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <div className='flex flex-col md:flex-row justify-center items-center gap-2 md:gap-10 h-full mb-5 md:mb-10'>
            <motion.div className="w-full" variants={itemVariants}>
              <h3 className="text-4xl sm:text-4xl md:text-4xl lg:text-5xl font-sans font-bold mb-2 text-white/90 text-center md:text-right uppercase">
                <span className="font-bold bg-gradient-to-r from-[#224eae] to-[#0f9ef2] inline-block text-transparent bg-clip-text">Liquidity Pools</span>
              </h3>
              <p className="text-md md:text-lg lg:text-xl font-thin text-blue-300 text-center md:text-right">
                Explore best liquidity across multiple chains and make informed decisions about where to trade, provide 
                liquidity, or bridge your CGT tokens
              </p>
            </motion.div>
            <motion.div 
              className="flex flex-row md:flex-col lg:flex-row justify-center md:items-center lg:items-start gap-5 lg:gap-20 md:mb-0 border-blue-500/20 w-full p-2 px-0 md:p-5 lg:p-0"
              variants={itemVariants}
            >
              <motion.div variants={itemVariants}>
                <GradientHeaderH4 headline="Locked in all Pools" />
                <div className="text-xl md:text-3xl font-bold md:text-center lg:text-left">
                  {abbreviateNumber(poolsData.reduce((total, pool) => total + parseFloat(pool.token0Amount), 0))} <span className="font-extralight">CGT</span>
                </div>
              </motion.div>
              <motion.div variants={itemVariants}>
                <GradientHeaderH4 headline="Total value" />
                <div className="text-xl md:text-3xl font-bold">
                  <span className="font-extralight">$</span>{abbreviateNumber(poolsData.reduce((total, pool) => total + parseFloat(pool.usdValue), 0))}
                </div>
              </motion.div>
            </motion.div>
          </div>
          <motion.div 
            className="grid grid-cols-12 gap-3 w-full"
            variants={containerVariants}
          >
            {poolsData.map((pool, index) => (
              <PoolCard pool={pool} index={index} />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default Pools;
