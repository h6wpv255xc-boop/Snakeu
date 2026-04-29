import React from 'react';
import { useSnake } from '../hooks/useSnake';
import { Play, RotateCcw } from 'lucide-react';

export const SnakeGame: React.FC = () => {
  const {
    snake,
    food,
    score,
    isGameOver,
    isPaused,
    isGameStarted,
    startGame,
    GRID_SIZE
  } = useSnake();

  return (
    <div className="flex flex-col items-center">
      
      {/* Game Header */}
      <div className="w-full flex justify-between items-center mb-6">
        <div className="font-mono text-cyan-400 text-xl font-bold tracking-widest drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]">
          SCORE: {score.toString().padStart(4, '0')}
        </div>
        
        {isGameStarted && !isGameOver && (
          <div className="text-zinc-500 font-mono text-sm tracking-widest animate-pulse">
            {isPaused ? 'PAUSED' : 'PLAYING'}
          </div>
        )}
      </div>

      {/* Game Board container */}
      <div className="relative">
        {/* Glow behind the board */}
        <div className="absolute inset-0 bg-cyan-500 opacity-20 blur-3xl rounded-3xl pointer-events-none"></div>

        <div 
          className="relative grid bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.8)]"
          style={{ 
            gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
            width: 'min(400px, 90vw)',
            height: 'min(400px, 90vw)'
          }}
        >
          {/* Render grid cells */}
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);
            const isHead = snake[0].x === x && snake[0].y === y;
            const isBody = snake.some((segment, index) => index !== 0 && segment.x === x && segment.y === y);
            const isFood = food.x === x && food.y === y;

            return (
              <div 
                key={i} 
                className={`
                  w-full h-full border-[0.5px] border-zinc-900/50 
                  ${isHead ? 'bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)] rounded-sm' : ''}
                  ${isBody ? 'bg-cyan-600/80 rounded-sm' : ''}
                  ${isFood ? 'bg-fuchsia-500 shadow-[0_0_10px_rgba(217,70,239,0.8)] rounded-full animate-pulse' : ''}
                `}
              />
            );
          })}
        </div>

        {/* Overlays */}
        {(!isGameStarted || isGameOver) && (
          <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center p-6 text-center">
            {isGameOver && (
              <>
                <h2 className="text-fuchsia-500 text-4xl font-black mb-2 tracking-widest drop-shadow-[0_0_15px_rgba(217,70,239,0.6)]">
                  SYSTEM FAILURE
                </h2>
                <p className="text-zinc-400 font-mono mb-8 text-lg">
                  FINAL SCORE: <span className="text-cyan-400 font-bold">{score}</span>
                </p>
              </>
            )}
            
            {!isGameOver && (
              <h2 className="text-cyan-400 text-3xl font-black mb-8 tracking-widest drop-shadow-[0_0_15px_rgba(34,211,238,0.6)]">
                NEON SERPENT
              </h2>
            )}

            <button
              onClick={startGame}
              className="group flex items-center gap-3 px-8 py-3 bg-transparent border-2 border-cyan-500 text-cyan-400 font-bold font-mono tracking-widest rounded-none hover:bg-cyan-500 hover:text-zinc-950 transition-all duration-300 shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:shadow-[0_0_25px_rgba(34,211,238,0.8)]"
            >
               {isGameOver ? (
                 <>
                  <RotateCcw className="w-5 h-5 group-hover:-rotate-180 transition-transform duration-500" />
                  REBOOT
                 </>
               ) : (
                 <>
                   <Play className="w-5 h-5 fill-current" />
                   INITIALIZE
                 </>
               )}
            </button>
            <p className="mt-8 text-zinc-600 font-mono text-xs tracking-widest">
              USE WASD OR ARROW KEYS
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
