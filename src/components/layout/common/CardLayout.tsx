import React, { ReactNode } from 'react';

interface CardLayoutProps {
  children: ReactNode;
  gradientStart: string;
  gradientEnd: string;
  padding: string;
}

const CardLayout: React.FC<CardLayoutProps> = ({ children, gradientStart, gradientEnd, padding }) => {
  return (
    <div className={`bg-gradient-to-br ${gradientStart} ${gradientEnd} h-full`}>
      <div className={`${padding} flex flex-col h-full`}>
        {children}
      </div>
    </div>
  );
};

export default CardLayout;