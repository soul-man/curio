import { useState } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
// import PolkadotLogin from '../wallet/PolkadotLogin';
const PolkadotLogin = dynamic(() => import('../wallet/Wallet'), { ssr: false });

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="z-50 relative">
      <div className="max-w-screen-2xl mx-auto px-5">
        <div className="flex justify-between items-center pt-4 pb-1">
          {/* Logo */}
          <div className="flex flex-row items-center gap-3">
            <Image src="/images/logo.png" alt="Curio Insights Logo" width="40" height="40" />
            <a href="./" className="text-xl md:text-3xl font-bold font-chakra text-white">
              CURIO INSIGHTS
            </a>
          </div>
          {/* Desktop Navigation and Login */}
          <div className="hidden md:flex items-center space-x-8">
            <nav className="flex space-x-6">
              <a href="#dashboard" className="text-white hover:text-blue-400 transition duration-300 uppercase text-md">Analytics</a>
              <a href="#pools" className="text-white hover:text-blue-400 transition duration-300 uppercase text-md">Pools</a>
              {/* <a href="#trades" className="text-white hover:text-blue-400 transition duration-300 uppercase text-md">Trades</a> */}
            </nav>
            <PolkadotLogin />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={toggleMobileMenu} className="text-white hover:text-blue-400 focus:outline-none">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="md:hidden bg-blue-900/40 py-4 mt-2 flex flex-col items-center justify-center">
          <div className="flex flex-col space-y-3 px-4 text-center mb-5">
            <a href="#dashboard" className="text-white hover:text-blue-400 transition duration-300 uppercase text-sm">Analytics</a>
            <a href="#pools" className="text-white hover:text-blue-400 transition duration-300 uppercase text-sm">Pools</a>
            {/* <a href="#trades" className="text-white hover:text-blue-400 transition duration-300 uppercase text-sm">Trades</a> */}
            {/* <div className="pt-2">
              <PolkadotLogin showInHeader={true} />
            </div> */}
          </div>
          <PolkadotLogin />

        </nav>
      )}
    </header>
  );
}
