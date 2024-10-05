import React from 'react';
import { motion } from 'framer-motion';

const BuyCGT: React.FC = () => {
  return (
    <div className="col-span-6 sm:col-span-4 md:col-span-2">
      <div className="h-full border-b border-blue-500/20 px-5 py-3">
        <motion.div 
          className='flex flex-col gap-2 md:gap-2'
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <h4 className="text-md lg:text-xl font-light text-blue-500 text-center md:text-left">
            Buy CGT
          </h4>
          <div className="flex flex-row justify-center md:justify-start items-center gap-2">
            <motion.a 
              href="https://app.uniswap.org/swap?inputCurrency=ETH&outputCurrency=0x0E186357c323c806C1efdad36D217F7a54b63D18" 
              target="_blank"
              whileHover={{ scale: 1.2, rotate: 10 }}
              whileTap={{ scale: 0.9 }}
            >
              <img src="./images/dex/uniswap.png" className="w-8 lg:w-9" alt="Uniswap" />
            </motion.a>
            <motion.a 
              href="https://pancakeswap.finance/swap?outputCurrency=0x61632b49Df5CA20846b3220bFc42BDa5E32C81ad" 
              target="_blank"
              whileHover={{ scale: 1.2, rotate: 10 }}
              whileTap={{ scale: 0.9 }}
            >
              <img src="./images/dex/pancakeswap.png" className="w-8 lg:w-9" alt="PancakeSwap" />
            </motion.a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BuyCGT;