import * as React from 'react';
import { useTheme } from 'next-themes';
import Footer from "./Footer";
import Seo from "./SEO";
import Toggle from "./Toggle";

export default function Layout({ children }: { children: React.ReactNode }) {
  
  const { theme } = useTheme();

  return (
    <div className='relative overflow-hidden bg-[#12122c] bg-grid-small-white/10'>
      <Seo />
      {/* <Toggle theme={theme} /> */}
      <main>{children}</main>
      <Footer/>
    </div>
  );
}
