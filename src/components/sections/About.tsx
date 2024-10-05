import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.9 });

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

  return (
    <motion.div 
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className="max-w-screen-2xl mx-auto mb-36 md:mb-44 lg:mb-72"
    >
      <div 
        className="flex flex-col items-center px-5"
      >
        <motion.div 
          className="mb-3 w-full md:w-10/12 text-center"
          variants={itemVariants}
        >
          <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold md:text-left mb-2 md:mb-1 bg-gradient-to-r from-[#224eae] to-[#0f9ef2] inline-block text-transparent bg-clip-text">WHAT IS CURIO INSIGHTS?</h2>
          <p className="text-md font-normal md:text-xl lg:text-2xl text-white uppercase">
              Curio Insights offers a 360-degree view of your CGT investments
          </p>
        </motion.div>
        <div className="flex flex-col md:flex-row justify-center items-start gap-5 md:gap-10 lg:gap-16 mt-6 w-full md:w-11/12">
          <motion.div 
            className="w-full md:w-6/12"
            variants={itemVariants}
          >
            <p className="text-sm md:text-md lg:text-lg mb-4 font-thin text-blue-200 text-center md:text-left">
              We are your premier hub for analytics and insights into the <b>CurioDAO</b> / <b>CurioInvest</b> ecosystem and Real World Assets (RWA) tokenization.
            </p>
            <p className="text-sm md:text-lg mb-4 font-thin text-blue-200 text-center md:text-left">
              Our platform offers unparalleled visibility into Curio Gas Token (CGT) performance and liquidity pools across multiple chains.
            </p>
            <p className="text-sm md:text-lg mb-4 font-thin text-blue-200 text-center md:text-left">
              We provide the tools and information you need to navigate the exciting world of blockchain-based RWA investments.
            </p>
          </motion.div>
          <motion.div 
            className="w-full md:w-6/12"
            variants={itemVariants}
          >
            <div className="bg-blue-800/10 p-3 md:px-4 md:py-3 rounded-sm">
              <h2 className="text-xl md:text-2xl font-semibold mb-4 text-center md:text-left">Key Features</h2>
              <ul className="space-y-2 text-blue-300 font-thin text-sm md:text-md">
                <motion.li className="flex" variants={itemVariants}>
                  <span className="mr-2">•</span>
                  <span className="flex-1">Multi-chain CGT analytics across Ethereum, Binance Smart Chain, Curio Chain, TON and Neon EVM</span>
                </motion.li>
                <motion.li className="flex" variants={itemVariants}>
                  <span className="mr-2">•</span>
                  <span className="flex-1">Liquidity pool data across various networks</span>
                </motion.li>
                <motion.li className="flex" variants={itemVariants}>
                  <span className="mr-2">•</span>
                  <span className="flex-1">Total Locked Value (TLV) tracking across all supported chains</span>
                </motion.li>
                <motion.li className="flex" variants={itemVariants}>
                  <span className="mr-2">•</span>
                  <span className="flex-1">Comprehensive staking analytics for Curio Chain</span>
                </motion.li>
                <motion.li className="flex" variants={itemVariants}>
                  <span className="mr-2">•</span>
                  <span className="flex-1">Detailed token distribution and circulation insights</span>
                </motion.li>
              </ul>
            </div>
          </motion.div>
        </div>
        {/* <div className="mt-10">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className={`flex-1 text-xl py-2 px-8 bg-blue-600 hover:bg-blue-500 text-white rounded-sm`}
          >
            Start analysing
          </motion.button>
        </div> */}
      </div>
    </motion.div>
  );
}