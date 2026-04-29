import { useCallback, useEffect, useState } from 'react';

export type Point = { x: number; y: number };
export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Direction = 'UP';
const GAME_SPEED = 120; // ms per tick

const generateFood = (snake: Point[]): Point => {
  let newFood: Point;
  while (true) {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    // Ensure food doesn't spawn on the snake
    const isOnSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
    if (!isOnSnake) break;
  }
  return newFood;
};

export const useSnake = () => {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);

  const startGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setIsGameOver(false);
    setFood(generateFood(INITIAL_SNAKE));
    setIsGameStarted(true);
    setIsPaused(false);
  };

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (isGameOver && e.key === 'Enter') {
      startGame();
      return;
    }

    if (!isGameStarted && e.key === 'Enter') {
      startGame();
      return;
    }

    if (e.key === ' ') {
      setIsPaused(prev => !prev);
      e.preventDefault();
      return;
    }

    setDirection(prevDirection => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          return prevDirection !== 'DOWN' ? 'UP' : prevDirection;
        case 'ArrowDown':
        case 's':
        case 'S':
          return prevDirection !== 'UP' ? 'DOWN' : prevDirection;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          return prevDirection !== 'RIGHT' ? 'LEFT' : prevDirection;
        case 'ArrowRight':
        case 'd':
        case 'D':
          return prevDirection !== 'LEFT' ? 'RIGHT' : prevDirection;
        default:
          return prevDirection;
      }
    });
  }, [isGameOver, isGameStarted]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    if (isGameOver || isPaused || !isGameStarted) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = { ...head };

        switch (direction) {
          case 'UP':
            newHead.y -= 1;
            break;
          case 'DOWN':
            newHead.y += 1;
            break;
          case 'LEFT':
            newHead.x -= 1;
            break;
          case 'RIGHT':
            newHead.x += 1;
            break;
        }

        // Check Wall Collision
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setIsGameOver(true);
          return prevSnake;
        }

        // Check Self Collision
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setIsGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check Food Collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          setFood(generateFood(newSnake));
          // Don't pop the tail, so it grows
        } else {
          newSnake.pop(); // Remove tail
        }

        return newSnake;
      });
    };

    const gameInterval = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(gameInterval);
  }, [direction, isGameOver, isPaused, isGameStarted, food]);

  return {
    snake,
    food,
    score,
    isGameOver,
    isPaused,
    isGameStarted,
    startGame,
    GRID_SIZE
  };
};
