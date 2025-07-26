import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { x: -60, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 12,
      },
    },
  };

  return (
    <motion.div 
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className="max-w-screen-2xl mx-auto mb-36 md:mb-44 lg:mb-72 mx-3 md:mx-5"
    >
      <div className="relative z-10 p-8 md:p-12 lg:p-16 h-full flex flex-col items-center justify-center max-w-4xl mx-auto">
        <motion.div variants={itemVariants}>
          <div className="bg-black/70 rounded-md px-4 py-2 w-fit mb-6">
            <span className="text-blue-400 font-mono text-md tracking-wider">#analytics-hub</span>
          </div>
        </motion.div>

        <motion.h2 
          variants={itemVariants}
          className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6 text-white leading-tight text-center"
        >
          CURIO <span className="bg-gradient-to-r from-[#224eae] to-[#0f9ef2] inline-block text-transparent bg-clip-text">INSIGHTS</span>
        </motion.h2>

        <motion.p 
          variants={itemVariants}
          className="text-lg md:text-xl lg:text-2xl text-blue-200 font-thin mb-12 max-w-3xl text-center"
        >
          Your premier destination for comprehensive CurioDAO analytics, Real World Asset tokenization insights, 
          and multi-chain CGT performance tracking.
        </motion.p>

        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl"
        >
          <div className="bg-gradient-to-br from-blue-600/20 to-blue-900/20 backdrop-blur-sm p-6">
            <h3 className="text-white font-semibold mb-2">360° Analytics</h3>
            <p className="text-blue-200 text-sm">Complete visibility into CGT ecosystem across all chains</p>
          </div>
          <div className="bg-gradient-to-br from-blue-600/20 to-blue-900/20 backdrop-blur-sm p-6">
            <h3 className="text-white font-semibold mb-2">RWA Focused</h3>
            <p className="text-blue-200 text-sm">Specialized tools for Real World Asset investments</p>
          </div>
          <div className="bg-gradient-to-br from-blue-600/20 to-blue-900/20 backdrop-blur-sm p-6">
            <h3 className="text-white font-semibold mb-2">Multi-Chain</h3>
            <p className="text-blue-200 text-sm">Ethereum, BSC, Curio Chain, TON, and Neon EVM support</p>
          </div>
          <div className="bg-gradient-to-br from-blue-600/20 to-blue-900/20 backdrop-blur-sm p-6">
            <h3 className="text-white font-semibold mb-2">Real-Time Data</h3>
            <p className="text-blue-200 text-sm">Live market data, staking rewards, and liquidity metrics</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}