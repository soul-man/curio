import React from 'react';
import { motion } from 'framer-motion';
import { FiExternalLink } from "react-icons/fi";

const IntroHero: React.FC = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 1.1 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.5 }}
      style={{backgroundImage: "url('./images/ferrari-intro-new.jpg')", backgroundSize: 'cover'}} 
      className="
      overflow-hidden
      relative min-h-[calc(100vh-305px)] md:min-h-[calc(100vh-215px)] lg:min-h-[calc(100vh-245px)] xl:min-h-[calc(100vh-250px)] 
      flex flex-col justify-center
      mx-3 md:mx-5 mt-3 
      outline outline-offset-0 outline-1 outline-blue-200/10 
      bg-[90%] md:bg-[80%] lg:bg-[90%]
      rounded-xs"
    >
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute inset-0 w-full h-full bg-slate-900/50 lg:bg-slate-900/40 z-0 [mask-image:radial-gradient(transparent,white)] pointer-events-none" 
      />

      <motion.div 
        className="flex flex-col justify-start z-30 md:pb-[10vh] pl-0 lg:pl-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <div className="flex flex-col pl-5 justify-center items-center md:justify-start md:items-start">
          <motion.div 
            className="flex flex-row justify-center bg-black/70 rounded-md z-30 mb-3"
            {...fadeInUp}
            transition={{ delay: 1 }}
          >
            <a href="./" className="flex flex-row items-center">
              <span className="p-1.5 px-3 text-sm md:text-lg font-mono md:text-white/90 tracking-widest">#tokenize-the-world</span>
            </a>
          </motion.div>
          <motion.h1 
            className="w-12/12 md:w-8/12 lg:w-8/12 text-4xl md:text-6xl lg:text-7xl xl:text-8xl uppercase font-bold mb-2 md:mb-0 text-white inline-block"
            {...fadeInUp}
            transition={{ delay: 1.2 }}
          >
            We bring rwa<br/>to the masses
          </motion.h1>
          <motion.p 
            className="px-2 w-full md:w-7/12 lg:w-7/12 md:mt-3 text-lg md:text-2xl lg:text-3xl font-light text-white md:text-white lg:text-blue-100 text-center md:text-left"
            {...fadeInUp}
            transition={{ delay: 1.4 }}
          >
            We offer unparalleled CGT analytics to support the CURIO DAO. 
            Explore our comprehensive Dashboards and keep track of market data.
          </motion.p>
        </div>
      </motion.div>

      <motion.div 
        className="hidden md:flex flex-col absolute top-12 right-16 md:top-20 md:right-7 lg:top-10 lg:right-10 bg-black/40 text-white px-4 py-2 rounded-xs z-40"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, x: 50 },
          visible: { opacity: 1, x: 0, transition: { duration: 0.8, delay: 1.6 } },
        }}
      >
        <p className="md:text-md lg:text-md font-light">First tokenized Super Car</p>
        <p className="md:text-2xl lg:text-3xl font-bold mb-2 text-blue-500">Ferrari F12 TDF</p>
        <p className="md:text-xs lg:text-sm font-thin text-blue-300 flex flex-row justify-between items-center border-t border-white/20 pt-1">
          Total Supply: 1,100,000 CT1
          <a 
            href="https://etherscan.io/token/0x4F01887Cbd397a676921985639cEF79398204Cf0" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:scale-110 hover:rotate-12 duration-200"
          >
            <FiExternalLink size={16} className="text-blue-400 hover:text-blue-200" />
          </a>
        </p>
      </motion.div>
    </motion.div>
  );
};

export default IntroHero;