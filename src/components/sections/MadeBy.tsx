import React from 'react';

const MadeBy = () => {

  return (
    <div className="mx-auto max-w-screen-2xl mb-48">

      <div className="flex flex-col md:flex-row gap-3 md:gap-20 justify-center text-center px-10 mx-auto w-11/12 md:w-full lg:w-10/12">
        {/* Logo */}
        <div className="flex flex-row md:flex-row gap-5 mb-1 w-full">
          <img src="/images/logo.png" alt="Curio Insights Logo" className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24"/>
          <a href="./" className="text-3xl md:text-4xl lg:text-5xl font-bold font-chakra text-white text-left">
            CURIO<br /> INSIGHTS
          </a>
        </div>
        <div className="flex flex-col gap-2 text-left md:text-left w-full">
          <div className="text-sm md:text-md lg:text-lg text-blue-300/70">
            Made by Soulman, with couriosity & some help of AI
          </div>
          <div className="text-xl md:text-xl lg:text-2xl text-white mb-5">
            Drop me a line and I will create the analysis for your next web3 project!
          </div>
          {/* <div>
            <button className="w-fit px-7 md:px-14 py-1 md:py-2 text-lg tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-sm sm:order-2 sm:w-auto hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80">Contact me!</button>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default MadeBy;
