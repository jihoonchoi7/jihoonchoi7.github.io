'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { NoteGlyph } from './NoteGlyph';
import {
  NoteType,
  NOTE_LIFETIME_MS,
  HOLD_MAX_MS,
  noteTypeForDuration,
  noteLabelForDuration,
} from '../lib/notes';

interface FallingNote {
  id: number;
  x: number;
  y: number;
  type: NoteType;
}

interface Holding {
  x: number;
  y: number;
  startedAt: number;
  elapsed: number;
}

export function WindowsDesktop() {
  const [notes, setNotes] = useState<FallingNote[]>([]);
  const [holding, setHolding] = useState<Holding | null>(null);
  const noteIdCounter = useRef(0);
  const timeoutsRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current.clear();
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const clearHolding = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setHolding(null);
  }, []);

  useEffect(() => {
    if (!holding) return;

    const tick = () => {
      const elapsed = performance.now() - holding.startedAt;
      setHolding({ ...holding, elapsed });
      if (elapsed >= HOLD_MAX_MS + 200) {
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    const handleUp = () => {
      const elapsedFinal = performance.now() - holding.startedAt;
      const type = noteTypeForDuration(elapsedFinal);
      const newNote: FallingNote = {
        id: noteIdCounter.current++,
        x: holding.x,
        y: holding.y,
        type,
      };
      setNotes((prev) => [...prev, newNote]);
      const timeoutId = setTimeout(() => {
        setNotes((prev) => prev.filter((n) => n.id !== newNote.id));
        timeoutsRef.current.delete(timeoutId);
      }, NOTE_LIFETIME_MS);
      timeoutsRef.current.add(timeoutId);
      clearHolding();
    };

    const handleCancel = () => clearHolding();

    window.addEventListener('pointerup', handleUp, { once: true });
    window.addEventListener('pointercancel', handleCancel, { once: true });

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      window.removeEventListener('pointerup', handleUp);
      window.removeEventListener('pointercancel', handleCancel);
    };
  }, [holding?.startedAt, clearHolding]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== undefined && e.button !== 0) return;
    setHolding({
      x: e.clientX,
      y: e.clientY,
      startedAt: performance.now(),
      elapsed: 0,
    });
  };

  const ringFraction = holding
    ? Math.min(holding.elapsed / HOLD_MAX_MS, 1)
    : 0;
  const currentType: NoteType = holding
    ? noteTypeForDuration(holding.elapsed)
    : 'eighth';
  const currentLabel = holding ? noteLabelForDuration(holding.elapsed) : '';
  const previewOpacity = 0.35 + ringFraction * 0.5;

  return (
    <div
      className="w-full h-screen bg-white flex flex-col justify-center items-center text-black relative overflow-hidden"
      style={{ fontFamily: 'Times New Roman, serif' }}
      onPointerDown={handlePointerDown}
    >
      <h1 className="text-4xl font-normal mb-5">Jihoon Choi</h1>

      <div className="max-w-2xl text-left leading-relaxed space-y-4 text-sm">
        <p>
          i currently work at{' '}
          <a
            href="https://greptile.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            greptile.com
          </a>{' '}
          as sales.
        </p>

        <p>
          i majored in classical piano and business in college at{' '}
          <a
            href="https://www.smu.edu"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            smu
          </a>
          .
        </p>

        <p>
          some of my favorite composers are tchaikovsky, beethoven, scarlatti,
          chopin &amp; bach. some others i admire are crumb, corigliano, glass &amp;
          trifonov.
        </p>

        <p>
          in my spare time, i love spending time with my wife, playing golf &amp;
          the piano.
        </p>
      </div>

      {holding && (
        <div
          className="absolute pointer-events-none z-20 flex flex-col items-center gap-2"
          style={{
            left: `${holding.x}px`,
            top: `${holding.y}px`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div
            style={{
              opacity: previewOpacity,
              transition: 'opacity 120ms ease-out',
              filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.08))',
            }}
          >
            <NoteGlyph type={currentType} size={30} />
          </div>
          <div
            className="relative h-[3px] w-14 overflow-hidden rounded-full bg-black/10"
          >
            <div
              className="absolute left-0 top-0 h-full rounded-full bg-black"
              style={{
                width: `${ringFraction * 100}%`,
                transition: 'width 120ms ease-out',
              }}
            />
          </div>
          <div
            className="text-[10px] font-medium tracking-wide text-black/60"
            style={{ fontFamily: 'Times New Roman, serif' }}
          >
            {currentLabel}
          </div>
        </div>
      )}

      {notes.map((note) => (
        <div
          key={note.id}
          className="absolute pointer-events-none animate-fall"
          style={{
            left: `${note.x - 24}px`,
            top: `${note.y - 24}px`,
            width: '48px',
            height: '48px',
            color: 'black',
          }}
        >
          <NoteGlyph type={note.type} size={48} />
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
