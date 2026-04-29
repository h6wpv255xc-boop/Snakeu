/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SnakeGame } from './components/SnakeGame';
import { AudioPlayer } from './components/AudioPlayer';
import { useMusicPlayer } from './hooks/useMusicPlayer';

export default function App() {
  const player = useMusicPlayer();

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center py-12 px-4 font-sans selection:bg-cyan-500/30">
      
      {/* Dynamic Background elements based on playing state */}
      <div className={`fixed inset-0 pointer-events-none transition-opacity duration-1000 ${player.isPlaying ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute top-1/4 left-1/4 w-[30rem] h-[30rem] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-fuchsia-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="w-full max-w-2xl flex flex-col items-center relative z-10 gap-10">
        
        {/* Header Title */}
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-[0.2em] mb-2 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)] uppercase">
            Neon Serpent
          </h1>
          <p className="text-zinc-400 font-mono text-sm tracking-[0.3em] uppercase">
            Synthwave Edition
          </p>
        </div>

        {/* Center / Game Area */}
        <div className="flex justify-center w-full">
          <SnakeGame />
        </div>

        {/* Bottom / Player Area */}
        <div className="w-full mt-4">
          <AudioPlayer player={player} />
        </div>

      </div>
    </div>
  );
}
