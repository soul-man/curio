import React from 'react';
import { motion } from 'framer-motion';

const StakingInfo: React.FC = () => {
  return (
    <div className="hidden lg:block col-span-6 sm:col-span-4 md:col-span-2">
      <div className="h-full border-r border-b border-blue-500/20 px-5 py-3">
        <motion.div 
          className='flex flex-col gap-2 md:gap-1 relative'
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}>
          <h4 className="text-md md:text-xl font-light text-blue-500">
            Staking APY
          </h4>
          <div className="text-3xl font-bold text-white">
            <span className="mb-1 text-2xl md:text-3xl font-bold text-white">
              16%
            </span>
          </div>
          <div className="font-extralight">
            <span className="text-sm font-light text-blue-100/80 uppercase">on Curio Chain</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StakingInfo;