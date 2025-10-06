"use client";

import { Volume2, VolumeX, RotateCcw, Pause, Play } from "lucide-react";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { useEffect, useImperativeHandle, forwardRef } from "react";

interface AudioData {
  audioBase64: string;
  url: string;
  fileName: string;
  mimeType: string;
}

interface AudioPlayerProps {
  audioData: AudioData | null;
  autoPlay?: boolean;
  className?: string;
  onLoadingChange?: (isLoading: boolean) => void;
  onPlayingChange?: (isPlaying: boolean) => void;
}

export interface AudioPlayerRef {
  replay: () => void;
  play: () => void;
  pause: () => void;
}

export const AudioPlayer = forwardRef<AudioPlayerRef, AudioPlayerProps>(
  (
    {
      audioData,
      autoPlay = true,
      className = "",
      onLoadingChange,
      onPlayingChange,
    },
    ref
  ) => {
    const {
      isPlaying,
      isLoading,
      currentTime,
      duration,
      loadAndPlayAudio,
      play,
      pause,
      replay,
      seek,
    } = useAudioPlayer({
      autoPlay,
      onEnded: () => {
        console.log("Audio playback ended");
      },
      onError: (error) => {
        console.error("Audio playback error:", error);
      },
    });

    // Notify parent of loading state changes
    useEffect(() => {
      onLoadingChange?.(isLoading);
    }, [isLoading, onLoadingChange]);

    // Notify parent of playing state changes
    useEffect(() => {
      onPlayingChange?.(isPlaying);
    }, [isPlaying, onPlayingChange]);

    // Expose replay function to parent component
    useImperativeHandle(
      ref,
      () => ({
        replay: () => {
          replay();
        },
        play: () => {
          play();
        },
        pause: () => {
          pause();
        },
      }),
      [replay, play, pause]
    );

    // Load audio when audioData changes
    useEffect(() => {
      if (audioData) {
        loadAndPlayAudio(audioData);
      }
    }, [audioData]);

    if (!audioData) {
      return null;
    }

    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    return (
      <div
        className={`flex items-center gap-3 px-4 py-3 bg-gray-800/50 rounded-lg backdrop-blur-sm border border-gray-700 ${className}`}>
        {/* Loading/Play/Pause Button */}
        <button
          onClick={() => (isPlaying ? pause() : play())}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          title={isLoading ? "Loading..." : isPlaying ? "Pause" : "Play"}
          disabled={isLoading}>
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
          ) : isPlaying ? (
            <Pause className="w-5 h-5 text-blue-400" />
          ) : (
            <Play className="w-5 h-5 text-blue-400" />
          )}
        </button>

        {/* Progress Bar */}
        <div className="flex-1">
          <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-blue-500 transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
            <input
              type="range"
              min="0"
              max={duration}
              value={currentTime}
              onChange={(e) => seek(Number(e.target.value))}
              className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
          <div className="flex justify-between mt-1 text-xs text-gray-400">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Replay Button */}
        <button
          onClick={replay}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          title="Replay">
          <RotateCcw className="w-5 h-5 text-gray-400" />
        </button>

        {/* Status Indicator */}
        <div className="flex items-center gap-2">
          {isLoading ? (
            <span className="text-xs text-blue-400">Loading...</span>
          ) : isPlaying ? (
            <>
              <Volume2 className="w-5 h-5 text-green-400" />
              <span className="text-xs text-green-400">Speaking</span>
            </>
          ) : (
            <VolumeX className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </div>
    );
  }
);

AudioPlayer.displayName = "AudioPlayer";

export default AudioPlayer;
