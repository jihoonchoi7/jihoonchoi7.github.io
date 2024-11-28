'use client';
import { useEffect, useState, useCallback } from 'react';

type Position = {
  x: number;
  y: number;
};

export function SnakeGame() {
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<string>('right');
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [moveQueue, setMoveQueue] = useState<string[]>([]);

  const gridSize = 15;

  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * (gridSize - 1)),
      y: Math.floor(Math.random() * (gridSize - 1))
    };
    return newFood;
  }, []);

  useEffect(() => {
    const savedHighScore = localStorage.getItem('snakeHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }
  }, []);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('snakeHighScore', score.toString());
    }
  }, [score, highScore]);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(generateFood());
    setDirection('right');
    setGameOver(false);
    setScore(0);
    setIsPlaying(true);
    setIsPaused(false);
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const handleDirectionChange = (newDirection: string) => {
    setMoveQueue(prev => {
      const lastMove = prev[prev.length - 1] || direction;
      if (
        (newDirection === 'up' && lastMove !== 'down') ||
        (newDirection === 'down' && lastMove !== 'up') ||
        (newDirection === 'left' && lastMove !== 'right') ||
        (newDirection === 'right' && lastMove !== 'left')
      ) {
        return [...prev, newDirection].slice(-2);
      }
      return prev;
    });
  };

  const moveSnake = useCallback(() => {
    if (gameOver || !isPlaying || isPaused) return;

    setSnake((prevSnake) => {
      const newSnake = [...prevSnake];
      const head = { ...newSnake[0] };

      let currentDirection = direction;
      if (moveQueue.length > 0) {
        currentDirection = moveQueue[0];
        setMoveQueue(prev => prev.slice(1));
        setDirection(currentDirection);
      }

      switch (currentDirection) {
        case 'up': head.y -= 1; break;
        case 'down': head.y += 1; break;
        case 'left': head.x -= 1; break;
        case 'right': head.x += 1; break;
      }

      if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
        setGameOver(true);
        return prevSnake;
      }

      if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true);
        return prevSnake;
      }

      newSnake.unshift(head);

      if (head.x === food.x && head.y === food.y) {
        setFood(generateFood());
        setScore(prev => prev + 1);
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, generateFood, isPlaying, isPaused, moveQueue]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        
        switch (e.key) {
          case 'ArrowUp': handleDirectionChange('up'); break;
          case 'ArrowDown': handleDirectionChange('down'); break;
          case 'ArrowLeft': handleDirectionChange('left'); break;
          case 'ArrowRight': handleDirectionChange('right'); break;
        }
      }
      if (e.key === ' ') togglePause();
    };

    document.addEventListener('keydown', handleKeyPress);
    const gameInterval = setInterval(moveSnake, 180);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      clearInterval(gameInterval);
    };
  }, [moveSnake]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex justify-between w-full mb-4">
        <div className="text-lg font-['Times_New_Roman']">
          Score: {score} | High Score: {highScore}
        </div>
        <button
          onClick={resetGame}
          className="px-4 py-2 border border-black hover:bg-black hover:text-white transition-colors font-['Times_New_Roman']"
        >
          {isPlaying ? 'Restart' : 'Start Game'}
        </button>
      </div>
      <div 
        className="border-2 border-black"
        style={{
          width: `${gridSize * 20}px`,
          height: `${gridSize * 20}px`,
          position: 'relative',
          backgroundColor: '#f6f9fc'
        }}
      >
        {snake.map((segment, index) => (
          <div
            key={index}
            className="bg-black absolute"
            style={{
              width: '18px',
              height: '18px',
              left: `${segment.x * 20 + 1}px`,
              top: `${segment.y * 20 + 1}px`,
            }}
          />
        ))}
        <div
          className="bg-red-500 absolute"
          style={{
            width: '18px',
            height: '18px',
            left: `${food.x * 20 + 1}px`,
            top: `${food.y * 20 + 1}px`,
          }}
        />
      </div>
      <div className="flex gap-4">
        <button
          onClick={togglePause}
          className="px-4 py-2 border border-black hover:bg-black hover:text-white transition-colors font-['Times_New_Roman']"
        >
          {isPaused ? 'Resume' : 'Pause'}
        </button>
      </div>
      {gameOver && (
        <div className="text-lg font-bold text-red-500 font-['Times_New_Roman']">Game Over!</div>
      )}
    </div>
  );
} 