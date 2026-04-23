import { useState, useRef, useEffect } from 'react';
import React from 'react';
import { Track, DUMMY_TRACKS } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music } from 'lucide-react';

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(err => {
          console.error("Audio play failed:", err);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setProgress(0);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setProgress(0);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const total = audioRef.current.duration;
      if (!isNaN(total)) {
        setProgress((current / total) * 100);
        setDuration(total);
      }
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = Number(e.target.value);
    if (audioRef.current && duration) {
      audioRef.current.currentTime = (newProgress / 100) * duration;
      setProgress(newProgress);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-sm p-6 bg-[#1a1a3a] rounded-3xl border border-purple-500/30 shadow-[0_0_40px_rgba(168,85,247,0.1)] transition-all hover:shadow-[0_0_60px_rgba(168,85,247,0.2)]">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={nextTrack}
        autoPlay={isPlaying}
      />

      <div className="relative aspect-square mb-6 overflow-hidden rounded-2xl group">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentTrack.id}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            src={currentTrack.cover}
            alt={currentTrack.title}
            className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500"
            referrerPolicy="no-referrer"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
           <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center animate-pulse shadow-[0_0_20px_rgba(168,85,247,0.5)]">
             <Music className="text-white w-6 h-6" />
           </div>
        </div>
      </div>

      <div className="mb-6">
        <motion.h3 
          key={currentTrack.title}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-xl font-bold text-white mb-1 font-mono tracking-tight glow-purple"
        >
          {currentTrack.title}
        </motion.h3>
        <p className="text-purple-400 font-mono text-xs uppercase tracking-widest opacity-70">
          {currentTrack.artist}
        </p>
      </div>

      <div className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-1">
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleProgressChange}
            className="w-full h-1 bg-purple-900 rounded-lg appearance-none cursor-pointer accent-purple-500 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(255,255,255,0.5)]"
          />
          <div className="flex justify-between text-[10px] font-mono text-purple-400 uppercase">
            <span>{formatTime((progress / 100) * duration || 0)}</span>
            <span>{formatTime(duration || 0)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={prevTrack}
            className="p-2 text-purple-400 hover:text-white transition-colors"
          >
            <SkipBack className="w-6 h-6 fill-current" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={togglePlay}
            className="w-16 h-16 rounded-full bg-purple-500 flex items-center justify-center text-white shadow-[0_0_25px_rgba(168,85,247,0.4)] hover:shadow-[0_0_40px_rgba(168,85,247,0.6)] transition-all"
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 fill-current" />
            ) : (
              <Play className="w-8 h-8 fill-current ml-1" />
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={nextTrack}
            className="p-2 text-purple-400 hover:text-white transition-colors"
          >
            <SkipForward className="w-6 h-6 fill-current" />
          </motion.button>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-3 pt-2">
          <Volume2 className="w-4 h-4 text-purple-400" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => {
              const val = Number(e.target.value);
              setVolume(val);
              if (audioRef.current) audioRef.current.volume = val;
            }}
            className="flex-1 h-1 bg-purple-950 rounded-lg appearance-none cursor-pointer accent-purple-400/50"
          />
        </div>
      </div>
    </div>
  );
}
