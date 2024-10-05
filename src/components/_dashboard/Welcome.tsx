import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const Welcome = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

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
        // delay: 0.3,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className="col-span-12 lg:col-span-6 p-5 px-8"
    >
      <div className="h-full flex flex-col justify-end items-center lg:items-start">
        <motion.h3 variants={itemVariants} className="text-center text-4xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-7xl font-sans font-bold text-white/90 uppercase">
          <span className="font-bold bg-gradient-to-r from-[#224eae] to-[#0f9ef2] inline-block text-transparent bg-clip-text">CGT Analytics</span>
        </motion.h3>
        <motion.p variants={itemVariants} className="mb-3 text-md font-normal md:text-xl lg:text-2xl text-white uppercase text-center md:text-right">
          Comprehensive insights at your fingertips
        </motion.p>
        <motion.p variants={itemVariants} className="mb-7 lg:mb-0 text-md md:text-lg font-thin text-blue-300 text-center lg:text-left">
          Stay informed with key metrics and experience financial transparency like never before.
        </motion.p>
      </div>
    </motion.div>
  );
};

export default Welcome;