import Image from 'next/image';
import { useEffect, useState } from 'react';
import { FaEthereum } from "react-icons/fa";

export default function Header() {

  const [mobileOpen, setMobileOpen] = useState(false);

  return (

    <nav className="min-[320px]:px-4 w-full z-50 px-5">
      <div className="max-w-screen-2xl flex flex-wrap items-center justify-center mx-auto py-3 md:py-5 z-11">
        <a href="./" className="flex flex-row items-center space-x-3 z-11">
          <span className="p-1 px-3 bg-neutral-900 rounded-lg text-lg font-mono text-white tracking-widest">Curio Info</span>
        </a>

        <div className="flex flex-row items-center gap-5 md:hidden ">
          <div className="flex z-10">
            <div className="flex space-x-3 md:space-x-0">
              <button 
                onClick={() => setMobileOpen(prevMobileOpen => !prevMobileOpen)} 
                type="button" 
                className="
                  inline-flex 
                  items-center 
                  p-2 
                  w-10 
                  h-10 
                  justify-center 
                  text-sm 
                  text-white 
                  rounded-lg 
                  md:hidden 
                  hover:bg-blue-700/20 
                  focus:outline-none 
                  focus:ring-1 
                  focus:ring-blue-400" 
                >
                <span className="sr-only">Open main menu</span>
                <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

    </nav>
  );
}
