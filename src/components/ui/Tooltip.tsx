import React, { useState, useRef, useEffect } from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (tooltipRef.current && containerRef.current) {
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();

      const topOffset = containerRect.height + 24; // 8px for a small gap
      const leftOffset = (containerRect.width - tooltipRect.width) / 2;

      tooltipRef.current.style.top = `-${topOffset}px`;
      tooltipRef.current.style.left = `${leftOffset}px`;
    }
  }, [isVisible]);

  return (
    <div className="relative inline-block" ref={containerRef}>
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      <div
        ref={tooltipRef}
        className={`absolute z-10 px-3 py-2 text-md font-medium bg-white text-black rounded-md shadow-sm tooltip whitespace-nowrap transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {content}
      </div>
    </div>
  );
};

export default Tooltip;