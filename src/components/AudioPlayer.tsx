import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';
import React from 'react';
import { useMusicPlayer } from '../hooks/useMusicPlayer';

interface AudioPlayerProps {
  player: ReturnType<typeof useMusicPlayer>;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ player }) => {
  const {
    currentTrack,
    isPlaying,
    volume,
    progress,
    duration,
    togglePlay,
    nextTrack,
    prevTrack,
    handleSeek,
    handleVolumeChange,
    audioRef,
    handleTimeUpdate,
    handleLoadedMetadata,
  } = player;

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-[0_0_20px_rgba(34,211,238,0.1)] w-full max-w-md mx-auto">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={nextTrack}
      />

      <div className="flex items-center gap-6 mb-6">
        <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 border-zinc-800 relative">
           {/* Animated glow when playing */}
           {isPlaying && (
              <div className="absolute inset-0 bg-cyan-400 opacity-20 animate-pulse mix-blend-overlay"></div>
           )}
          <img
            src={currentTrack.cover}
            alt="Track Cover"
            className={`w-full h-full object-cover transition-transform duration-[10s] ${isPlaying ? 'scale-110' : 'scale-100'}`}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold text-white truncate drop-shadow-[0_0_4px_rgba(255,255,255,0.4)]">
            {currentTrack.title}
          </h2>
          <p className="text-cyan-400 text-sm truncate font-medium">
            {currentTrack.artist}
          </p>
        </div>
      </div>

      <div className="mb-6 group">
        <input
          type="range"
          min={0}
          max={duration || 100}
          value={progress}
          onChange={(e) => handleSeek(Number(e.target.value))}
          className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 group-hover:h-2 transition-all"
        />
        <div className="flex justify-between text-xs text-zinc-400 mt-2 font-mono">
          <span>{formatTime(progress)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 w-24">
          {volume === 0 ? (
            <VolumeX className="w-4 h-4 text-zinc-400" />
          ) : (
            <Volume2 className="w-4 h-4 text-zinc-400" />
          )}
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => handleVolumeChange(Number(e.target.value))}
            className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-zinc-400"
          />
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={prevTrack}
            className="p-2 text-zinc-400 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all"
          >
            <SkipBack className="w-6 h-6 fill-current" />
          </button>
          
          <button
            onClick={togglePlay}
            className="w-12 h-12 rounded-full bg-cyan-500 hover:bg-cyan-400 text-zinc-950 flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.5)] hover:scale-105 transition-all"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 fill-current" />
            ) : (
              <Play className="w-6 h-6 fill-current ml-1" />
            )}
          </button>

          <button
            onClick={nextTrack}
            className="p-2 text-zinc-400 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all"
          >
            <SkipForward className="w-6 h-6 fill-current" />
          </button>
        </div>
        <div className="w-24"></div> {/* Spacer for balance */}
      </div>
    </div>
  );
};
