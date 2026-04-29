import { useState, useRef, useEffect, useCallback } from 'react';
import { TRACKS } from '../constants';

export const useMusicPlayer = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  // Update audio source when track changes
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(error => {
            console.error("Audio playback failed:", error);
            setIsPlaying(false);
        });
      }
    }
  }, [currentTrackIndex, isPlaying]);

  // Handle play/pause
  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(e => console.error("Playback error", e));
      setIsPlaying(true);
    }
  };

  const nextTrack = useCallback(() => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    // Let the useEffect handle playing the new track
  }, []);

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (newTime: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setProgress(newTime);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      setVolume(newVolume);
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, []); // Initial volume set

  return {
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
  };
};
