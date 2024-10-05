import React from 'react';
import { motion } from 'framer-motion';

const IntroLoader: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 flex flex-col items-center justify-center bg-slate-900 z-50"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full mb-4"
      />
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="text-blue-500 text-xl font-light"
      >
        Hub is loading
      </motion.p>
    </motion.div>
  );
};

export default IntroLoader;