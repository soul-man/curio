import React from 'react';
import { motion } from 'framer-motion';
import { FaXTwitter, FaTelegram, FaDiscord, FaLinkedinIn, FaYoutube, FaInstagram } from 'react-icons/fa6';
import { TfiWorld } from "react-icons/tfi";

const CommunityLinks: React.FC = () => {
  const socialLinks = [
    { href: "https://curioinvest.com/", icon: TfiWorld },
    { href: "https://x.com/curio_invest", icon: FaXTwitter },
    { href: "https://t.me/CurioInvestCommunity", icon: FaTelegram },
    { href: "https://discord.com/invite/ffNqMPDGUu", icon: FaDiscord },
    { href: "https://www.linkedin.com/company/curioag/", icon: FaLinkedinIn },
    { href: "https://www.youtube.com/@curioinvest3071/videos", icon: FaYoutube },
    { href: "https://www.instagram.com/curioinvest/", icon: FaInstagram },
  ];

  return (
    <div className="col-span-6 sm:col-span-4 md:col-span-3 lg:col-span-2">
      <div className="h-full border-r border-b border-blue-500/20 md:px-5 py-3">
        <motion.div 
          className='flex flex-col gap-2 md:gap-1'
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <h4 className="text-md lg:text-xl font-light text-blue-500 mb-1 text-center md:text-left">
            Community
          </h4>

          <div className="flex flex-row justify-center md:justify-start flex-wrap gap-3 px-3 md:p-0">
            {socialLinks.map((item, index) => (
              <motion.a
                key={index}
                href={item.href}
                target="_blank"
                className="flex items-center text-white"
                whileHover={{ scale: 1.2, rotate: 10 }}
                whileTap={{ scale: 0.9 }}
              >
                <item.icon className="text-2xl" />
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CommunityLinks;