import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Skeleton } from "@/components/ui/render-skeleton";
import { GradientHeaderH4 } from '@/components/ui/GradientHeaderH4';

interface AthBreakProps {
  ath: number;
  marketPrice: number;
}

const AthBreak: React.FC<AthBreakProps> = ({ ath, marketPrice }) => {
  const [showSkeleton, setShowSkeleton] = useState(true);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });


  // const growthFactor = ((ath - marketPrice) / marketPrice).toFixed(1);

  const growthFactor = ((ath) / marketPrice).toFixed(1);
  const growthPercentage = ((ath) / marketPrice * 100).toFixed(2);
  const priceDifference = (ath - marketPrice).toFixed(4);

  useEffect(() => {
    const timer = setTimeout(() => setShowSkeleton(false), 2000);
    return () => clearTimeout(timer);
  }, []);


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
      initial="hidden"
      variants={containerVariants}
      animate={inView ? "visible" : "hidden"}
      className="col-span-12 md:col-span-6 lg:col-span-4 p-5 md:p-5 border-b border-t md:border-t-transparent border-blue-500/10"
    >
      <motion.div variants={itemVariants} className="flex flex-col justify-between items-center md:items-start text-white w-full h-full">
        <GradientHeaderH4 headline="New ATH" />
        <div className='flex flex-row items-center mt-3 gap-5'>
          <div className="px-2 pt-1 text-5xl font-bold text-blue-400 bg-blue-800/20 rounded-md">
            {growthFactor}
          </div>
            <div className="font-thin text-sm md:text-md">
            To reach a new ATH the market needs to grow by a factor 
          of {' '}
          {showSkeleton || ath === undefined ? (
            <>
              <span className="font-bold">
                x.x
              </span> (xxx.xx%)
            </>
          ) : (
            <>
              <span className="font-bold">
                {growthFactor}
              </span> ({growthPercentage}%).
            </>
          )} 
            </div>
        </div>

        <div className="flex flex-row flex-wrap justify-around md:justify-between mt-4 w-full h-full">
          <div>
            {showSkeleton || ath === undefined ? (
              <Skeleton className="bg-blue-700/30 mb-1 h-6 w-20" />
            ) : (
              <div className="text-md lg:text-xl font-normal text-white">
              <span className="font-extralight">$</span>{ath}
            </div>
            )} 
            <div className="text-sm lg:text-sm font-light text-blue-300/70">
              ATH
            </div>
          </div>
          <div>
          {showSkeleton || priceDifference === undefined ? (
              <Skeleton className="bg-blue-700/30 mb-1 h-6 w-20" />
            ) : (
              <div className="text-md lg:text-xl font-semibold text-white text-center">
                <span className="font-extralight">$ </span>
                <span>{priceDifference}</span>
              </div>
            )} 

            <div className="text-sm lg:text-sm font-light text-blue-300/70 text-center uppercase">
              Difference
            </div>
          </div>
          <div>
          {showSkeleton || marketPrice === undefined ? (
              <Skeleton className="bg-blue-700/30 mb-1 h-6 w-20" />
            ) : (
              <div className="text-md lg:text-xl font-normal text-white text-center">
              <span className="font-extralight">$</span>{marketPrice}
            </div>
            )} 
            <div className="text-sm lg:text-sm font-light text-blue-300/70 text-right uppercase">
              Price
            </div>
          </div>
        </div>

      </motion.div>
    </motion.div>
  );
};

export default AthBreak;