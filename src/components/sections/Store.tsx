import React from 'react';

const Store: React.FC = () => {
  return (
    <div className="max-w-screen-2xl mx-auto px-5 mb-56">
      <div className="relative w-full min-h-[300px] bg-[#05071b] overflow-hidden outline outline-offset-1 outline-1 outline-blue-500/10">
        <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage: "url('/images/store-rwa-secure.jpg')"}}></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#05071b] via-[#05071b]/50 to-black/60 md:to-transparent"></div>
       
        <div className="relative z-10 p-5 md:p-10 max-w-[800px]">
          <h2 className="text-3xl md:text-3xl lg:text-4xl xl:text-5xl text-white font-bold mb-4 xl:!leading-[3.5rem]">The storage of <u>Ferrari F12 DTF</u> and all future tokenized cars</h2>
          <p className="text-base md:text-lg lg:text-xl text-blue-400 font-normal uppercase mb-4">
            CT1* is stored and secured by Mechatronik GmbH:
          </p>
          <p className="text-base md:text-lg text-blue-300/80 font-thin mb-4 max-w-[550px]">
            Mechatronik GmbH plays a key role in safeguarding and managing 
            tokenized vehicles in a secure storage facility near Stuttgart (Germany).
          </p>
        </div>
      </div>
      <p className="text-sm text-blue-300/40 font-thin">
            * The ticker of Ferrari F12 DTF
          </p>
    </div>
  );
};

export default Store;