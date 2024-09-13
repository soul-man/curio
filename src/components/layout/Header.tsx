import { useState } from 'react';

export default function Header() {

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (

    <header className="z-40">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center pt-4">
          {/* Logo */}
          <div className="flex flex-row items-center gap-3">
            <img src="/images/logo.png" alt="Curio Insights Logo" width={35} height={35} />
            <a href="./" className="text-2xl md:text-3xl font-bold font-chakra text-white">
              CURIO INSIGHTS
            </a>
          </div>
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <a href="#dashboard" className="text-white hover:text-blue-400 transition duration-300 uppercase">CGT Insights</a>
            <a href="#pools" className="text-white hover:text-blue-400 transition duration-300 uppercase">Pools</a>
            <a href="#trades" className="text-white hover:text-blue-400 transition duration-300 uppercase">Trades</a>
          </nav>

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
        <nav className="md:hidden bg-black/90 py-4">
          <div className="flex flex-col space-y-4 px-4">
            <a href="#dashboard" className="text-white hover:text-blue-400 transition duration-300 uppercase">CGT Insights</a>
            <a href="#pools" className="text-white hover:text-blue-400 transition duration-300 uppercase">Pools</a>
            <a href="#trades" className="text-white hover:text-blue-400 transition duration-300 uppercase">Trades</a>
          </div>
        </nav>
      )}
    </header>
  );
}
