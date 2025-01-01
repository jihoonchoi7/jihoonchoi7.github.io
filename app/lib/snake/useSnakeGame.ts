import { useState, useEffect, useCallback } from 'react';
import { GameState, Point, Particle } from './types';
import { getRandomPosition, GRID_SIZE, createParticle } from './utils';

const initialState: GameState = {
  snake: [{ x: 10, y: 10 }],
  food: getRandomPosition(),
  direction: { x: 1, y: 0 },
  gameOver: false,
  score: 0,
};

export function useSnakeGame() {
  const [gameState, setGameState] = useState<GameState>(initialState);
  const [particles, setParticles] = useState<Particle[]>([]);

  const moveSnake = useCallback(() => {
    if (gameState.gameOver) return [];

    let newParticles: Particle[] = [];

    setGameState((prevState) => {
      const newHead = {
        x: (prevState.snake[0].x + prevState.direction.x + GRID_SIZE) % GRID_SIZE,
        y: (prevState.snake[0].y + prevState.direction.y + GRID_SIZE) % GRID_SIZE,
      };

      const newSnake = [newHead, ...prevState.snake.slice(0, -1)];

      if (newHead.x === prevState.food.x && newHead.y === prevState.food.y) {
        const newFood = getRandomPosition();
        newParticles = Array.from({ length: 20 }, () =>
          createParticle(newHead.x * 20 + 10, newHead.y * 20 + 10)
        );
        return {
          ...prevState,
          snake: [newHead, ...prevState.snake],
          food: newFood,
          score: prevState.score + 1,
        };
      }

      if (newSnake.slice(1).some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        return { ...prevState, gameOver: true };
      }

      return { ...prevState, snake: newSnake };
    });

    return newParticles;
  }, [gameState.gameOver]);

  const changeDirection = useCallback((newDirection: Point) => {
    setGameState((prevState) => ({
      ...prevState,
      direction: newDirection,
    }));
  }, []);

  const resetGame = useCallback(() => {
    setGameState(initialState);
    setParticles([]);
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          changeDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          changeDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          changeDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          changeDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [changeDirection]);

  return { gameState, moveSnake, resetGame, particles, setParticles };
}

