import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2 } from 'lucide-react';

interface Props {
  durationSeconds: number;
  title: string;
  onPlayStateChange?: (isPlaying: boolean) => void;
}

export const WaveformVisualizer: React.FC<Props> = ({ durationSeconds, title }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  // Bars heights
  const bars = [
    30, 65, 45, 80, 95, 60, 40, 75, 90, 100, 70, 50, 85, 60, 40, 
    90, 75, 55, 70, 85, 40, 65, 50, 80, 95, 60, 45, 70, 35, 55
  ];

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= durationSeconds) {
            setIsPlaying(false);
            return 0;
          }
          return Math.min(prev + 0.2, durationSeconds);
        });
      }, 200);
    }
    return () => clearInterval(interval);
  }, [isPlaying, durationSeconds]);

  const progress = durationSeconds > 0 ? (currentTime / durationSeconds) * 100 : 0;

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = Math.floor(secs % 60);
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-slate-900 text-white rounded-xl p-3.5 border border-slate-800 shadow-inner">
      <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
        <div className="flex items-center gap-1.5 font-medium text-teal-300 truncate max-w-[200px]">
          <Volume2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
          <span className="truncate">{title}</span>
        </div>
        <div className="font-mono text-slate-300">
          <span>{formatTime(currentTime)}</span> / <span>{formatTime(durationSeconds)}</span>
        </div>
      </div>

      {/* Waveform graphic */}
      <div 
        className="h-12 flex items-center justify-between gap-[3px] bg-slate-950/60 rounded-lg px-3 cursor-pointer relative overflow-hidden"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          // In RTL, calculate clicked position
          const clickX = e.clientX - rect.left;
          const ratio = (rect.width - clickX) / rect.width;
          setCurrentTime(Math.max(0, Math.min(durationSeconds, ratio * durationSeconds)));
        }}
      >
        {/* Background fill based on progress */}
        <div 
          className="absolute right-0 top-0 bottom-0 bg-teal-500/15 pointer-events-none transition-all duration-150"
          style={{ width: `${progress}%` }}
        />

        {bars.map((height, i) => {
          const barProgress = (i / bars.length) * 100;
          const isActive = progress >= (100 - barProgress);
          return (
            <div
              key={i}
              className={`w-1 rounded-full transition-all duration-200 ${
                isActive ? 'bg-teal-400' : 'bg-slate-700 hover:bg-slate-600'
              } ${isPlaying ? 'animate-pulse' : ''}`}
              style={{ 
                height: `${height}%`,
                animationDelay: `${(i % 5) * 80}ms`
              }}
            />
          );
        })}
      </div>

      {/* Playback Controls */}
      <div className="flex items-center justify-center gap-3 mt-3">
        <button
          onClick={() => {
            setCurrentTime(0);
            setIsPlaying(false);
          }}
          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          title="شروع مجدد"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-9 h-9 rounded-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold flex items-center justify-center shadow-lg transition-transform active:scale-95"
          title={isPlaying ? 'توقف' : 'پخش'}
        >
          {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
        </button>
      </div>
    </div>
  );
};
