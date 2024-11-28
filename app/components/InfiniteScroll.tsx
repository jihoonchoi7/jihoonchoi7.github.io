'use client';
import { useEffect, useState } from 'react';

export function InfiniteScroll() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      setScrollPosition(position);
      
      // Smooth transition calculation
      const startFade = 100;
      const endFade = 300;
      if (position > startFade) {
        const fadeProgress = Math.min((position - startFade) / (endFade - startFade), 1);
        setOpacity(fadeProgress);
        setIsVisible(true);
      } else {
        setOpacity(0);
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const generateRows = () => {
    const rows = [];
    for (let i = 0; i < 50; i++) {
      rows.push(
        <div 
          key={i}
          className="flex justify-between items-center w-full px-4"
          style={{
            transform: `translateX(${i % 2 === 0 ? '0' : '-5%'})`,
            opacity: Math.min(opacity * 1.5, 1),
            transition: 'opacity 0.3s ease-out',
          }}
        >
          {[...Array(3)].map((_, index) => (
            <span key={index} className="line-text">Jihoon Choi</span>
          ))}
        </div>
      );
    }
    return rows;
  };

  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-0 bg-background overflow-hidden"
      style={{
        zIndex: scrollPosition > 100 ? 50 : -1,
        opacity: opacity,
        transition: 'opacity 0.5s ease-out',
      }}
    >
      <div className="animate-infinite-scroll">
        <div className="flex flex-col gap-0">
          {generateRows()}
          {generateRows()}
        </div>
      </div>
    </div>
  );
} 