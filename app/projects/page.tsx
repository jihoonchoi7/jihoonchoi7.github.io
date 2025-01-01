'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { SnakeGame } from '../components/SnakeGame';
import { SnakeButton } from '../components/SnakeButton';

export default function Projects() {
  const [showSnakeGame, setShowSnakeGame] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleAnimationComplete = () => {
    try {
      setShowSnakeGame(true);
    } catch (err) {
      console.error('Error:', err);
      setError(err as Error);
    }
  };

  if (error) {
    return (
      <div className="text-red-500">
        Error loading game: {error.message}
      </div>
    );
  }

  return (
    <main className="font-sans min-h-screen bg-background relative">
      <Link 
        href="/"
        className="fixed top-6 left-6 w-8 h-8 bg-white/80 border border-black/60 rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-all shadow-sm hover:shadow-md"
        aria-label="Go to homepage"
      >
        <ArrowLeft size={16} />
      </Link>
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-3 gap-8">
          {/* Left Section */}
          <div>
            <header>
              <h1 className="text-3xl font-bold text-text font-['Times_New_Roman']">Projects</h1>
            </header>
            <section className="mt-8">
              <div className="prose prose-lg">
                <p className="text-sm text-text">More projects coming soon...</p>
              </div>
            </section>
          </div>

          {/* Center Section - Snake Game */}
          <div className="col-span-1 flex flex-col items-center justify-center min-h-[600px]">
            {!showSnakeGame ? (
              <SnakeButton onAnimationComplete={handleAnimationComplete} />
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-6 font-['Times_New_Roman']">Snakes</h2>
                <SnakeGame />
                <button
                  onClick={() => setShowSnakeGame(false)}
                  className="mt-4 px-4 py-2 border border-black hover:bg-black hover:text-white transition-colors font-['Times_New_Roman'] rounded-lg"
                >
                  Close Game
                </button>
              </>
            )}
          </div>

          {/* Right Section */}
          <div className="col-span-1">
            {/* Add future content here */}
          </div>
        </div>
      </div>
    </main>
  );
} 