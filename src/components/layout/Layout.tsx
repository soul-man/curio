import * as React from 'react';
import { useTheme } from 'next-themes';
import { Analytics } from "@vercel/analytics/react"
import Footer from "./Footer";
import Seo from "./SEO";
import StarryBackground from '../ui/starry-background';

export default function Layout({ children }: { children: React.ReactNode }) {
  
  const { theme } = useTheme();

  return (
    <div className='
        relative 
        overflow-hidden 
        bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] 
        from-[#132456]/70 from-10 
        via-[#0b0a17]/80 via-60% 
        to-[#081244]/60 to-90%'
      >
      <StarryBackground />
      <Seo />
      <main>{children}</main>
      <Footer/>
      <Analytics/>
    </div>
  );
}
