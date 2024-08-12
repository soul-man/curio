import Image from 'next/image';
import React from 'react';
import { motion } from "framer-motion";
import { LinkPreview } from "../ui/link-preview";
import { FaRegHeart } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="px-5 mt-44">
      <div className="
        pb-7
        max-w-screen-2xl 
        flex 
        flex-col
        lg:flex-row
        items-center 
        justify-between 
        mx-auto 
        z-1
"
      >
        <a href="./" className="flex flex-row items-center space-x-3 z-10">
            <span className="text-md font-bold text-white">CURIO INSIGHTS &copy; {new Date().getFullYear()}</span>
        </a>

        <div className='pt-2 lg:pt-0'>
          {/* <p className="mb-1 text-md text-gray-200/80 text-center md:text-right mt-3 md:pt-0">&copy; {new Date().getFullYear()} - mint-heaven.xyz</p> */}
          <div className="text-blue-300/70">
            <div className="flex flex-col lg:flex-row justify-center md: justify-end mt-3 md:mt-0 gap-2">
              <span className="text-sm flex items-center justify-center text-blue-300/70">
                made with couriosity by Soulman <FaRegHeart className="hidden md:block mx-2 text-red-600 text-xl" />
                and some help of AI{' '}
              </span>
            </div>
            <div className="flex flex-col lg:flex-row justify-center text-center md:justify-end mt-5 md:mt-1 gap-2">
              <span className="text-md font-light">
                <LinkPreview url="https://nextjs.org" className="font-semibold">
                  Next.js
                </LinkPreview>
                {' '} - {' '}
                <LinkPreview url="https://tailwindcss.com" className="font-semibold">
                  Tailwind
                </LinkPreview>
                {' '} - {' '}
                <LinkPreview url="https://web3js.org/" className="font-semibold">
                  Web3
                </LinkPreview>
                {' '} - {' '}
                <LinkPreview url="https://coingecko.com/" className="font-semibold">
                  Coingecko
                </LinkPreview>
                {' '} - {' '}
                <LinkPreview url="https://www.anthropic.com/" className="font-semibold">
                  Claude.ai
                </LinkPreview>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>


  );
}
