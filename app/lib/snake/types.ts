export type Point = {
  x: number;
  y: number;
};

export type Particle = {
  x: number;
  y: number;
  radius: number;
  color: string;
  velocity: Point;
  alpha: number;
};

export type GameState = {
  snake: Point[];
  food: Point;
  direction: Point;
  gameOver: boolean;
  score: number;
};

