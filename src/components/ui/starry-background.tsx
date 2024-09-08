import React, { useEffect, useRef } from 'react';

interface StarryBackgroundProps {
  starCount?: number;
}

const StarryBackground: React.FC<StarryBackgroundProps> = ({ starCount = 500 }) => {
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (backgroundRef.current) {
      for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';

        // Randomly assign size
        const size = Math.random();
        if (size < 0.6) star.classList.add('star-tiny');
        else if (size < 0.8) star.classList.add('star-small');
        else if (size < 0.95) star.classList.add('star-medium');
        else star.classList.add('star-large');

        // Randomly assign color (70% white, 30% blue)
        if (Math.random() < 0.01) star.classList.add('star-blue');

        star.style.top = `${Math.random() * 100}%`;
        star.style.left = `${Math.random() * 100}%`;
        star.style.animationDelay = `${Math.random() * 5}s`;
        backgroundRef.current.appendChild(star);
      }
    }
  }, [starCount]);

  return <div ref={backgroundRef} className="starry-background" />;
};

export default StarryBackground;