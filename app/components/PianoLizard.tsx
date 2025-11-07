'use client';

import { useState, useEffect } from 'react';

export function PianoLizard() {
  const [isVisible, setIsVisible] = useState(false);
  const [fromLeft, setFromLeft] = useState(true);
  const [stage, setStage] = useState<'hidden' | 'piano' | 'lizard' | 'approaching' | 'excited' | 'playing'>('hidden');
  const [walkCycle, setWalkCycle] = useState(0);

  useEffect(() => {
    // Walking animation
    const walkInterval = setInterval(() => {
      if (stage === 'lizard' || stage === 'approaching') {
        setWalkCycle((prev) => (prev + 1) % 4);
      }
    }, 200);

    return () => clearInterval(walkInterval);
  }, [stage]);

  useEffect(() => {
    // Random initial delay of 6-7 seconds
    const initialDelay = 6000 + Math.random() * 1000;
    
    const timer = setTimeout(() => {
      setFromLeft(Math.random() > 0.5);
      setIsVisible(true);
      setStage('piano');
      
      // Lizard appears 1-2 seconds after piano
      setTimeout(() => {
        setStage('lizard');
        
        // Lizard approaches piano after 2 seconds
        setTimeout(() => {
          setStage('approaching');
          
          // Show excitement after approaching (2s for approach animation)
          setTimeout(() => {
            setStage('excited');
            
            // Start playing after excitement
            setTimeout(() => {
              setStage('playing');
              
              // Hide everything after playing for 8 seconds
              setTimeout(() => {
                setIsVisible(false);
                setStage('hidden');
                
                // Reset and start over after 3 seconds
                setTimeout(() => {
                  setFromLeft(Math.random() > 0.5);
                  setIsVisible(true);
                  setStage('piano');
                  
                  setTimeout(() => {
                    setStage('lizard');
                    setTimeout(() => {
                      setStage('approaching');
                      setTimeout(() => {
                        setStage('excited');
                        setTimeout(() => setStage('playing'), 1000);
                      }, 2000);
                    }, 2000);
                  }, 1000 + Math.random() * 1000);
                }, 3000);
              }, 8000);
            }, 1000);
          }, 2000);
        }, 2000);
      }, 1000 + Math.random() * 1000);
    }, initialDelay);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  const pianoPosition = fromLeft ? '150px' : 'calc(100vw - 290px)';
  const pianoStartPosition = fromLeft ? '-300px' : 'calc(100vw + 100px)';
  const lizardStartPosition = fromLeft ? 'calc(100vw + 100px)' : '-150px';
  const lizardWanderPosition = fromLeft ? 'calc(100vw - 300px)' : '150px';
  // Position lizard very close to piano when playing (piano is 160px wide, starts at 150px)
  // When fromLeft: position lizard so it's right next to piano keyboard (around 200px for overlap/closeness)
  // When fromRight: position lizard to the left of piano start
  const lizardNearPianoPosition = fromLeft ? '200px' : 'calc(100vw - 320px)';

  return (
    <div className="fixed bottom-0 left-0 w-full h-32 pointer-events-none z-50">
      {/* Piano */}
      <div
        className="absolute bottom-4 transition-all duration-[1500ms] ease-in-out"
        style={{
          left: (stage === 'piano' || stage === 'lizard' || stage === 'approaching' || stage === 'excited' || stage === 'playing') ? pianoPosition : pianoStartPosition,
        }}
      >
        {/* Grand Piano SVG - Pixelated design from Python code (32x16 grid) */}
        <div className="relative">
          <svg width="160" height="80" viewBox="0 0 32 16" style={{ imageRendering: 'pixelated' }}>
            {/* Color definitions */}
            {/* brown: [0.6, 0.3, 0.0] = #994D00 */}
            {/* dark_brown: [0.4, 0.2, 0.0] = #663300 */}
            {/* gray: [0.5, 0.5, 0.5] = #808080 */}
            {/* neon_blue: [0.2, 0.8, 1.0] = #33CCFF */}
            {/* gold: [1.0, 0.8, 0.0] = #FFCC00 */}
            
            {/* Main body - curved grand shape (bottom curve) */}
            {/* Base body */}
            <rect x="2" y="10" width="26" height="6" fill="#994D00" />
            <rect x="4" y="8" width="22" height="2" fill="#994D00" />
            <rect x="6" y="6" width="18" height="2" fill="#994D00" />
            <rect x="8" y="4" width="14" height="2" fill="#994D00" />
            <rect x="10" y="2" width="10" height="2" fill="#994D00" />
            
            {/* Lid - propped open at an angle */}
            <rect x="12" y="1" width="18" height="4" fill="#808080" />
            <rect x="14" y="0" width="14" height="2" fill="#663300" />
            
            {/* Keyboard - white keys with black accents */}
            <rect x="6" y="9" width="18" height="1" fill="#FFFFFF" />
            {/* Black keys pattern - every 2 pixels */}
            <rect x="8" y="8" width="1" height="1" fill="#000000" />
            <rect x="10" y="8" width="1" height="1" fill="#000000" />
            <rect x="12" y="8" width="1" height="1" fill="#000000" />
            <rect x="14" y="8" width="1" height="1" fill="#000000" />
            <rect x="16" y="8" width="1" height="1" fill="#000000" />
            <rect x="18" y="8" width="1" height="1" fill="#000000" />
            <rect x="20" y="8" width="1" height="1" fill="#000000" />
            <rect x="22" y="8" width="1" height="1" fill="#000000" />
            <rect x="24" y="8" width="1" height="1" fill="#000000" />
            
            {/* Neon blue accent on keys (subtle glow) */}
            <rect x="6" y="9" width="18" height="1" fill="#33CCFF" opacity="0.3" />
            
            {/* Legs - three classic grand legs */}
            <rect x="4" y="12" width="2" height="4" fill="#663300" />
            <rect x="26" y="12" width="2" height="4" fill="#663300" />
            {/* Middle support highlight */}
            <rect x="14" y="11" width="2" height="1" fill="#FFCC00" />
            
            {/* Music stand - pixel flourish */}
            <rect x="18" y="3" width="2" height="4" fill="#FFCC00" />
          </svg>
          
          {/* Musical notes when playing */}
          {stage === 'playing' && (
            <>
              <div className="absolute animate-note1" style={{ left: '50px', bottom: '50px', fontSize: '24px' }}>♩</div>
              <div className="absolute animate-note2" style={{ left: '80px', bottom: '50px', fontSize: '24px' }}>♪</div>
              <div className="absolute animate-note3" style={{ left: '110px', bottom: '50px', fontSize: '24px' }}>♩</div>
            </>
          )}
        </div>
      </div>

      {/* Lizard */}
      {(stage === 'lizard' || stage === 'approaching' || stage === 'excited' || stage === 'playing') && (
        <div
          className="absolute bottom-6 transition-all"
          style={{
            left: stage === 'lizard' ? lizardWanderPosition : 
                  (stage === 'approaching' || stage === 'excited' || stage === 'playing') ? lizardNearPianoPosition : lizardStartPosition,
            transitionDuration: stage === 'approaching' ? '2000ms' : '1500ms',
            transform: fromLeft ? 'scaleX(1)' : 'scaleX(-1)',
          }}
        >
          {/* Pixelated Lizard SVG - More recognizable lizard shape */}
          <svg 
            width="120" 
            height="80" 
            viewBox="0 0 60 40" 
            xmlns="http://www.w3.org/2000/svg"
            style={{ imageRendering: 'pixelated' }}
          >
            {/* Tail fill - draw first so outline appears on top */}
            <rect x="17" y="14" width="1" height="1" fill="#66BB6A" />
            <rect x="18" y="13" width="2" height="1" fill="#66BB6A" />
            <rect x="20" y="12" width="2" height="1" fill="#66BB6A" />
            <rect x="22" y="11" width="2" height="1" fill="#66BB6A" />
            <rect x="24" y="10" width="2" height="1" fill="#66BB6A" />
            <rect x="26" y="11" width="2" height="1" fill="#66BB6A" />
            <rect x="28" y="12" width="2" height="1" fill="#66BB6A" />
            <rect x="30" y="13" width="2" height="1" fill="#66BB6A" />
            <rect x="32" y="14" width="1" height="1" fill="#66BB6A" />
            
            {/* Tail outline - draw on top */}
            <rect x="17" y="14" width="1" height="1" fill="#000" />
            <rect x="18" y="13" width="2" height="1" fill="#000" />
            <rect x="20" y="12" width="2" height="1" fill="#000" />
            <rect x="22" y="11" width="2" height="1" fill="#000" />
            <rect x="24" y="10" width="2" height="1" fill="#000" />
            <rect x="26" y="11" width="2" height="1" fill="#000" />
            <rect x="28" y="12" width="2" height="1" fill="#000" />
            <rect x="30" y="13" width="2" height="1" fill="#000" />
            <rect x="32" y="14" width="1" height="1" fill="#000" />
            
            {/* Tail pattern/stripes */}
            <rect x="20" y="12" width="1" height="1" fill="#81C784" />
            <rect x="24" y="10" width="1" height="1" fill="#81C784" />
            <rect x="28" y="12" width="1" height="1" fill="#81C784" />
            
            {/* Body fill - draw first */}
            <rect x="9" y="13" width="8" height="2" fill="#66BB6A" />
            <rect x="10" y="14" width="6" height="1" fill="#A5D6A7" />
            
            {/* Body outline - only edges */}
            <rect x="8" y="13" width="1" height="1" fill="#000" />
            <rect x="9" y="12" width="8" height="1" fill="#000" />
            <rect x="9" y="15" width="8" height="1" fill="#000" />
            <rect x="17" y="13" width="1" height="2" fill="#000" />
            
            {/* Legs fill - draw first */}
            <rect x="9" y="15" width="2" height="1" fill={walkCycle % 2 === 0 ? '#66BB6A' : '#81C784'} />
            <rect x="9" y="16" width="1" height="2" fill={walkCycle % 2 === 0 ? '#66BB6A' : '#81C784'} />
            <rect x="12" y="15" width="2" height="1" fill={walkCycle % 2 === 1 ? '#66BB6A' : '#81C784'} />
            <rect x="13" y="16" width="1" height="2" fill={walkCycle % 2 === 1 ? '#66BB6A' : '#81C784'} />
            <rect x="14" y="15" width="2" height="1" fill={walkCycle % 2 === 1 ? '#66BB6A' : '#81C784'} />
            <rect x="14" y="16" width="1" height="2" fill={walkCycle % 2 === 1 ? '#66BB6A' : '#81C784'} />
            <rect x="16" y="15" width="2" height="1" fill={walkCycle % 2 === 0 ? '#66BB6A' : '#81C784'} />
            <rect x="17" y="16" width="1" height="2" fill={walkCycle % 2 === 0 ? '#66BB6A' : '#81C784'} />
            
            {/* Legs outline - draw on top */}
            <rect x="9" y="15" width="2" height="1" fill="#000" />
            <rect x="9" y="16" width="1" height="2" fill="#000" />
            <rect x="12" y="15" width="2" height="1" fill="#000" />
            <rect x="13" y="16" width="1" height="2" fill="#000" />
            <rect x="14" y="15" width="2" height="1" fill="#000" />
            <rect x="14" y="16" width="1" height="2" fill="#000" />
            <rect x="16" y="15" width="2" height="1" fill="#000" />
            <rect x="17" y="16" width="1" height="2" fill="#000" />
            
            {/* Head fill - draw first */}
            <rect x="3" y="12" width="2" height="2" fill="#66BB6A" />
            <rect x="4" y="11" width="3" height="2" fill="#66BB6A" />
            <rect x="5" y="12" width="2" height="2" fill="#66BB6A" />
            
            {/* Head outline - draw on top */}
            <rect x="2" y="12" width="2" height="2" fill="#000" />
            <rect x="3" y="11" width="2" height="2" fill="#000" />
            <rect x="4" y="10" width="3" height="2" fill="#000" />
            <rect x="6" y="11" width="2" height="2" fill="#000" />
            <rect x="7" y="12" width="2" height="2" fill="#000" />
            
            {/* Eyes - black dots */}
            <rect x="4" y="11" width="1" height="1" fill="#000" />
            <rect x="6" y="11" width="1" height="1" fill="#000" />
            
            {/* Eye highlights */}
            <rect x="4" y="10" width="1" height="1" fill="#FFF" />
            <rect x="6" y="10" width="1" height="1" fill="#FFF" />
            
            {/* Snout/mouth */}
            <rect x="2" y="13" width="1" height="1" fill="#000" />
            <rect x="8" y="13" width="1" height="1" fill="#000" />
          </svg>
          
          {/* Thought bubble with exclamation mark */}
          {stage === 'excited' && (
            <div className="absolute" style={{ left: '50px', top: '-35px' }}>
              <svg width="30" height="35" viewBox="0 0 30 35">
                <ellipse cx="15" cy="12" rx="12" ry="10" fill="#fff" stroke="#000" strokeWidth="2" />
                <circle cx="8" cy="23" r="3" fill="#fff" stroke="#000" strokeWidth="1.5" />
                <circle cx="5" cy="28" r="2" fill="#fff" stroke="#000" strokeWidth="1.5" />
                <rect x="14" y="7" width="2" height="6" fill="#000" />
                <rect x="14" y="15" width="2" height="2" fill="#000" />
              </svg>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        @keyframes floatNote1 {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          100% {
            transform: translateY(-80px) translateX(10px);
            opacity: 0;
          }
        }
        
        @keyframes floatNote2 {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          100% {
            transform: translateY(-90px) translateX(-5px);
            opacity: 0;
          }
        }
        
        @keyframes floatNote3 {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          100% {
            transform: translateY(-85px) translateX(8px);
            opacity: 0;
          }
        }
        
        .animate-note1 {
          animation: floatNote1 2s ease-out infinite;
        }
        
        .animate-note2 {
          animation: floatNote2 2.3s ease-out infinite 0.3s;
        }
        
        .animate-note3 {
          animation: floatNote3 2.1s ease-out infinite 0.6s;
        }
      `}</style>
    </div>
  );
}
