import React from 'react';

interface GradientHeaderProps {
  headline: string;
}

export const GradientHeaderH4: React.FC<GradientHeaderProps> = ({ headline }) => (
    <h4 className="text-md md:text-lg lg:text-xl text-white/90 uppercase">
      <span className="font-light text-blue-500">
        {headline}
      </span>
      {/* <span className="font-light bg-gradient-to-r from-blue-500 to-blue-300 inline-block text-transparent bg-clip-text">
        {headline}
      </span> */}
    </h4>
  );