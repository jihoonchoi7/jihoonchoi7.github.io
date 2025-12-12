'use client';

import { useState, useRef, useEffect } from 'react';
import { Navigation } from './Navigation';

interface FallingNote {
  id: number;
  x: number;
  y: number;
}

export function WindowsDesktop() {
  const [notes, setNotes] = useState<FallingNote[]>([]);
  const noteIdCounter = useRef(0);
  const timeoutsRef = useRef<Set<NodeJS.Timeout>>(new Set());

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current.clear();
    };
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Don't create notes when clicking on navigation or links
    const target = e.target as HTMLElement;
    if (target.closest('a') || target.tagName === 'A') {
      return;
    }

    const newNote: FallingNote = {
      id: noteIdCounter.current++,
      x: e.clientX,
      y: e.clientY,
    };

    setNotes((prev) => [...prev, newNote]);

    // Remove note after animation completes
    const timeoutId = setTimeout(() => {
      setNotes((prev) => prev.filter((note) => note.id !== newNote.id));
      timeoutsRef.current.delete(timeoutId);
    }, 4000);
    timeoutsRef.current.add(timeoutId);
  };

  return (
    <div 
      className="w-full h-screen bg-white flex flex-col justify-center items-center text-black relative overflow-hidden" 
      style={{ fontFamily: 'Times New Roman, serif' }}
      onClick={handleClick}
    >
      {/* Navigation */}
      <Navigation />

      <h1 className="text-4xl font-normal mb-5">
        Jihoon Choi
      </h1>
      
      <div className="max-w-2xl text-left leading-relaxed space-y-4 text-sm">
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

      {/* Falling Notes */}
      {notes.map((note) => (
        <div
          key={note.id}
          className="absolute pointer-events-none animate-fall"
          style={{
            left: `${note.x - 24}px`,
            top: `${note.y - 24}px`,
            fontSize: '48px',
            color: 'black',
          }}
        >
          ♩
        </div>
      ))}

      <style jsx>{`
        @keyframes fall {
          0% {
            transform: translateY(0) scale(0);
            opacity: 0;
          }
          5% {
            transform: translateY(0) scale(1.2);
            opacity: 1;
          }
          8% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) scale(1);
            opacity: 0;
          }
        }
        .animate-fall {
          animation: fall 4s ease-in forwards;
        }
      `}</style>
    </div>
  );
}
