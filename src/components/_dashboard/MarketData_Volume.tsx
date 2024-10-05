import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GradientHeaderH4 } from '@/components/ui/GradientHeaderH4';
import { Skeleton } from "@/components/ui/render-skeleton";
import { abbreviateNumber } from '../../utils/helpers';

const Volume = (props: any) => {
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSkeleton(false), 2000);
    return () => clearTimeout(timer);
  }, []);

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
    <>
      <motion.div variants={contentVariants} className="col-span-12 md:col-span-4 lg:col-span-4 flex flex-col mt-2 md:mt-0">
        <GradientHeaderH4 headline="Volume 24h" />

        <div className="text-2xl md:text-3xl font-bold text-white">
          {showSkeleton || Number(props.volume) === undefined ? (
              <Skeleton className="bg-blue-700/30 mt-1 h-7 w-24" />
            ) : (
              <div>
                <span className="font-extralight">$</span>{" "}
                {abbreviateNumber(props.volume)}             
              </div>
            )} 
        </div>
      </motion.div>
    </>
  );
};

export default Volume;