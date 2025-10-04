'use client';

import React, { useState, useEffect } from 'react';

export function SpiralHero() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate zoom based on scroll position
  // We'll zoom from scale(1) to scale(10) over the first 3000px of scroll
  const maxScroll = 3000;
  const scrollProgress = Math.min(scrollY / maxScroll, 1);
  const zoomScale = 1 + (scrollProgress * 9); // Scale from 1 to 10
  
  // Bio appears when we're 80% through the zoom animation
  const bioOpacity = scrollProgress > 0.8 ? (scrollProgress - 0.8) / 0.2 : 0;

  return (
    <div className="relative">
      {/* Spiral Galaxy Image Section */}
      <div className="fixed inset-0 flex items-center justify-center overflow-hidden" style={{ backgroundColor: '#f8f6f0' }}>
        {/* Your Spiral Galaxy Piano Score Image */}
        <img
          src="/spiral-galaxy.svg"
          alt="Spiral Galaxy Piano Score"
          className="w-full h-full object-contain"
          style={{
            transform: `scale(${zoomScale})`,
            transformOrigin: 'center center',
            transition: 'transform 0.1s ease-out',
          }}
          onError={(e) => {
            console.error('Failed to load SVG:', e);
            e.currentTarget.style.display = 'none';
          }}
          onLoad={() => console.log('SVG loaded successfully')}
        />
        
        {/* Bio Content - appears at center when zoomed in */}
        <div 
          className="absolute inset-0 flex items-center justify-center"
          style={{
            opacity: bioOpacity,
            transform: `scale(${1 / Math.max(zoomScale, 1)})`, // Counter the zoom so text stays readable
            transition: 'opacity 0.3s ease',
          }}
        >
          <div className="bg-white bg-opacity-95 p-12 rounded-lg shadow-2xl max-w-4xl mx-4 text-center">
            <h1 className="text-6xl font-normal mb-8 text-black" style={{ fontFamily: 'Times New Roman, serif' }}>
              Jihoon Choi
            </h1>
            
            <div className="text-left leading-relaxed space-y-6 text-xl text-black" style={{ fontFamily: 'Times New Roman, serif' }}>
              <p>
                i currently work at <a href="https://greptile.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">greptile.com</a> as sales.
              </p>
              
              <p>
                i majored in classical piano and business in college at <a href="https://www.smu.edu" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">smu</a>.
              </p>
              
              <p>
                some of my favorite composers are tchaikovsky, beethoven, scarlatti, chopin & bach. some others i admire are crumb, corigliano, glass & trifonov.
              </p>
              
              <p>
                in my spare time, i love spending time with my wife, playing golf & the piano.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Spacer to allow scrolling */}
      <div className="h-[400vh]" />
    </div>
  );
}
