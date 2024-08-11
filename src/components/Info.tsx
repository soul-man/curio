"use client";
import React from 'react';

const Info = () => {

  return (
    <>
      <div className="bg-blue-600 dark:bg-blue-950/20 flex mx-5 2xl:mx-auto my-5 p-8 flex-col max-w-screen-2xl items-center justify-between mb-48 rounded-md">
        
      <div className='w-full text-left'>
      <p className="text-3xl font-light text-black/90 dark:text-white">INFO</p>

        <div className="flex flex-row justify-between items-center mt-1 mb-8">
          <div className='w-24 border-t-2 border-1 border-black dark:border-blue-950/80'></div>
          {/* <div className='w-48 border-t-2 border-gray-300 dark:border-blue-950/80'></div> */}
        </div>
        <h4 className="text-6xl font-primary font-bold mb-2 text-white/90 dark:text-white">What is this all about?</h4>
        <p className="text-2xl font-thin text-black/90 dark:text-white">Price data is collected from different sources and gets updated every 10 mins.</p>
      </div>

      </div>
    </>
  );
};

export default Info;
