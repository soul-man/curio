import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import CardLayout from '@/components/layout/common/CardLayout';
import { Skeleton } from "@/components/ui/render-skeleton";
import { GradientHeaderH4 } from '@/components/ui/GradientHeaderH4';
import CirculatingSupplyChart from '@/components/_dashboard/CirculatingSupply_Chart';
import { abbreviateNumber } from '../../utils/helpers';
import { CiFileOn } from "react-icons/ci";
import { CiCircleCheck } from "react-icons/ci";
import { CgUnavailable } from "react-icons/cg";
import Tooltip from '@/components/ui/Tooltip';

interface CirculatingSupplyProps {
  supply: any;
}

const CirculatingSupply: React.FC<CirculatingSupplyProps> = ({ supply }) => {

  const [showSkeleton, setShowSkeleton] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => setShowSkeleton(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const ref = useRef(null);
  const inView = useInView(ref, { once: true });


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

  const backgroundVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1 } },
  };

  const contentVariants = {
    hidden: { y: -50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
        delay: 0.3,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className="col-span-12 lg:col-span-6 row-span-1 p-2 md:p-5 md:border-b md:border-l lg:border-t border-blue-500/10"
    >
      <motion.div variants={backgroundVariants} className="h-full">
        <CardLayout gradientStart="from-blue-600/10" gradientEnd="to-transparent" padding="p-3 lg:p-5">
          <motion.div variants={contentVariants}>
            <div className='flex flex-row justify-around gap-2 md:gap-5 mb-5'>
              {/* Circulating supply */}
              <motion.div variants={contentVariants} className="col-span-6 flex flex-col w-full rounded-md">
                <GradientHeaderH4 headline="Circ. Supply" />
                <div className="text-xl md:text-3xl text-white font-bold">
                  {showSkeleton ? (
                    <Skeleton className="bg-blue-700/30 mt-1 h-7 w-24" />
                  ) : (
                    <div>
                      <span className="font-extralight">$</span>{" "}
                      {abbreviateNumber(100000000)}             
                    </div>
                  )} 
                </div>
              </motion.div>
              {/* Max supply */}
              <div className="col-span-6 flex flex-col items-end w-full rounded-md">
                <GradientHeaderH4 headline="Max. Supply" />
                <div className="text-xl md:text-3xl font-bold text-white">
                  {showSkeleton ? (
                    <Skeleton className="bg-blue-700/30 mt-1 h-7 w-24" />
                  ) : (
                    <div>
                      <span className="font-extralight">$</span>{" "}
                      {abbreviateNumber(100000000)}             
                    </div>
                  )} 
                </div>
              </div>
            </div>
          </motion.div>
          <motion.div variants={contentVariants}>
            <CirculatingSupplyChart supply={supply} />
          </motion.div>

        </CardLayout>
      </motion.div>
    </motion.div>
  );
};

export default CirculatingSupply;