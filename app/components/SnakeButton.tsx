'use client';

import { useState } from 'react';

interface SnakeButtonProps {
  onAnimationComplete: () => void;
}

export function SnakeButton({ onAnimationComplete }: SnakeButtonProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    setIsAnimating(true);
    setTimeout(onAnimationComplete, 500);
  };

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        disabled={isAnimating}
        className="px-8 py-4 border-2 border-black hover:bg-black hover:text-white transition-colors font-['Times_New_Roman'] text-xl rounded-lg"
      >
        Play Snakes
      </button>
    </div>
  );
}