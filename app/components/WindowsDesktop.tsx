'use client';

import React, { useState, useCallback, useEffect } from 'react';

interface Note {
  id: string;
  type: 'whole' | 'half' | 'quarter';
  x: number;
  y: number;
}

export function WindowsDesktop() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [mouseDownTime, setMouseDownTime] = useState<number | null>(null);

  const getNoteTypeFromDuration = (duration: number): Note['type'] => {
    if (duration < 300) {
      return 'quarter';    // Quick clicks
    } else if (duration < 800) {
      return 'half';       // Medium holds
    } else {
      return 'whole';      // Long holds
    }
  };

  const createNote = useCallback((x: number, y: number, duration: number) => {
    const type = getNoteTypeFromDuration(duration);
    const newNote: Note = {
      id: `note-${Date.now()}-${Math.random()}`,
      type,
      x,
      y,
    };

    setNotes(prev => [...prev, newNote]);

    // Remove note after animation completes
    setTimeout(() => {
      setNotes(prev => prev.filter(note => note.id !== newNote.id));
    }, 3000); // 3 seconds for the fall animation
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setMouseDownTime(Date.now());
  }, []);

  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    if (mouseDownTime) {
      const duration = Date.now() - mouseDownTime;
    const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      createNote(x, y, duration);
      setMouseDownTime(null);
    }
  }, [mouseDownTime, createNote]);

  return (
    <div 
      className="w-full h-screen bg-white flex flex-col justify-center items-center text-black relative overflow-hidden" 
      style={{ fontFamily: 'Times New Roman, serif' }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <h1 className="text-4xl font-normal mb-5">
        Jihoon Choi
      </h1>
      
      <div className="max-w-2xl text-center leading-relaxed space-y-4 text-sm">
        <p>
          i currently work at greptile.com as sales. i want software engineers to worry less about their PRs and just ship faster.
        </p>
        
        <p>
          i majored in classical piano and business in college at smu.edu.
        </p>
        
        <p>
          some of my favorite composers are tchaikovsky, beethoven, scarlatti, chopin & of course bach. some others i admire are crumb, corigliano, glass & trifonov.
        </p>
        
        <p>
          in my spare time, i love spending time with my wife, playing golf & the piano.
        </p>
      </div>

      {/* Falling Musical Notes */}
      {notes.map((note) => (
        <div
          key={note.id}
          className={`absolute pointer-events-none select-none musical-note musical-note-${note.type}`}
          style={{
            left: `${note.x}px`,
            top: `${note.y}px`,
            animation: `fall-${note.type} 3s ease-in forwards`,
            zIndex: 1000,
          }}
        >
          {note.type === 'quarter' && (
            <svg width="24" height="32" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Quarter note - filled oval with stem on right */}
              <ellipse cx="10" cy="26" rx="8" ry="5" fill="#333"/>
              <rect x="18" y="0" width="2" height="27" fill="#333"/>
            </svg>
          )}
          {note.type === 'half' && (
            <svg width="24" height="32" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Half note - hollow oval with stem on right */}
              <ellipse cx="10" cy="26" rx="8" ry="5" fill="none" stroke="#333" strokeWidth="2"/>
              <rect x="18" y="0" width="2" height="27" fill="#333"/>
            </svg>
          )}
          {note.type === 'whole' && (
            <svg width="24" height="16" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Whole note - hollow oval, no stem */}
              <ellipse cx="12" cy="8" rx="10" ry="6" fill="none" stroke="#333" strokeWidth="3"/>
            </svg>
          )}
        </div>
      ))}

      <style jsx>{`
        /* Note animations */
        @keyframes fall-whole {
          to {
            transform: translateY(100vh) rotate(15deg);
            opacity: 0;
          }
        }
        
        @keyframes fall-half {
          to {
            transform: translateY(100vh) rotate(20deg);
            opacity: 0;
          }
        }
        
        @keyframes fall-quarter {
          to {
            transform: translateY(100vh) rotate(30deg);
            opacity: 0;
          }
        }
        
        .musical-note-whole { animation-duration: 5s; }
        .musical-note-half { animation-duration: 4s; }
        .musical-note-quarter { animation-duration: 3s; }
      `}</style>
    </div>
  );
}
