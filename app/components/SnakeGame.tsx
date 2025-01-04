"use client"

import React, { useRef, useEffect } from 'react';
import { useSnakeGame } from '../lib/snake/useSnakeGame';
import { CANVAS_SIZE, CELL_SIZE, drawGrid } from '../lib/snake/utils';

export function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { gameState, moveSnake, resetGame, particles, setParticles } = useSnakeGame();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const gameLoop = () => {
      ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

      // Draw background
      ctx.fillStyle = 'rgba(0, 0, 20, 0.8)';
      ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

      // Draw grid
      drawGrid(ctx);

      // Draw food
      ctx.fillStyle = '#ff0000';
      ctx.beginPath();
      ctx.arc(
        gameState.food.x * CELL_SIZE + CELL_SIZE / 2,
        gameState.food.y * CELL_SIZE + CELL_SIZE / 2,
        CELL_SIZE / 2,
        0,
        Math.PI * 2
      );
      ctx.fill();

      // Draw snake
      ctx.fillStyle = '#00ff00';
      gameState.snake.forEach((segment, index) => {
        const gradient = ctx.createRadialGradient(
          segment.x * CELL_SIZE + CELL_SIZE / 2,
          segment.y * CELL_SIZE + CELL_SIZE / 2,
          0,
          segment.x * CELL_SIZE + CELL_SIZE / 2,
          segment.y * CELL_SIZE + CELL_SIZE / 2,
          CELL_SIZE / 2
        );
        gradient.addColorStop(0, '#00ff00');
        gradient.addColorStop(1, '#008000');
        ctx.fillStyle = gradient;
        ctx.fillRect(segment.x * CELL_SIZE, segment.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);

        if (index === 0) {
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(
            segment.x * CELL_SIZE + CELL_SIZE * 0.3,
            segment.y * CELL_SIZE + CELL_SIZE * 0.3,
            CELL_SIZE * 0.15,
            0,
            Math.PI * 2
          );
          ctx.fill();
          ctx.beginPath();
          ctx.arc(
            segment.x * CELL_SIZE + CELL_SIZE * 0.7,
            segment.y * CELL_SIZE + CELL_SIZE * 0.3,
            CELL_SIZE * 0.15,
            0,
            Math.PI * 2
          );
          ctx.fill();
        }
      });

      // Draw particles
      particles.forEach(particle => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${particle.color}${Math.floor(particle.alpha * 255).toString(16).padStart(2, '0')}`;
        ctx.fill();
      });

      if (gameState.gameOver) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE); // Fill entire canvas
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 32px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Game Over', CANVAS_SIZE / 2, CANVAS_SIZE / 2 - 40);
        ctx.font = '20px Arial';
        ctx.fillText(`Final Score: ${gameState.score}`, CANVAS_SIZE / 2, CANVAS_SIZE / 2);
        ctx.fillText('Press Space to Restart', CANVAS_SIZE / 2, CANVAS_SIZE / 2 + 40);
      }

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameState, particles]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' && gameState.gameOver) {
        resetGame();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState.gameOver, resetGame]);

  useEffect(() => {
    if (!gameState.gameOver) {
      const gameInterval = setInterval(() => {
        moveSnake();
        setParticles(prevParticles => 
          prevParticles
            .map(particle => ({
              ...particle,
              x: particle.x + particle.velocity.x,
              y: particle.y + particle.velocity.y,
              alpha: particle.alpha - 0.02
            }))
            .filter(particle => particle.alpha > 0)
        );
      }, 100);

      return () => clearInterval(gameInterval);
    }
  }, [gameState.gameOver, moveSnake, setParticles]);

  useEffect(() => {
    const preventDefault = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    window.addEventListener('keydown', preventDefault, { passive: false });
    
    return () => {
      window.removeEventListener('keydown', preventDefault);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="mb-4 text-xl font-bold">
        Score: {gameState.score}
      </div>
      <div className="relative mb-16">
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className="border-4 border-blue-500 rounded-lg shadow-lg"
        />
        <div className="absolute -bottom-8 w-full text-center">
          <p className="text-text text-lg">Use arrow keys to control the snake</p>
        </div>
      </div>
    </div>
  );
}

