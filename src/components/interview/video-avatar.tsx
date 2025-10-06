"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import AudioPlayer, {
  AudioPlayerRef,
} from "@/components/interview/audio-player";

interface AudioData {
  audioBase64: string;
  url: string;
  fileName: string;
  mimeType: string;
}

interface VideoAvatarProps {
  isSpeaking: boolean;
  isListening: boolean;
  isAnalyzing: boolean;
  currentAudio?: AudioData | null;
  videoSrc?: string;
  className?: string;
  onClick?: () => void;
}

export const VideoAvatar = ({
  isSpeaking,
  isListening,
  isAnalyzing,
  currentAudio,
  videoSrc = "/models/Avtar1.mp4",
  className = "",
  onClick,
}: VideoAvatarProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [shouldLoop, setShouldLoop] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const loopTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const audioPlayerRef = useRef<AudioPlayerRef>(null);

  // Handle video loading
  const handleVideoLoad = useCallback(() => {
    console.log("🎬 Video avatar loaded");
    setIsVideoLoaded(true);

    // Set video properties
    if (videoRef.current) {
      videoRef.current.muted = true; // Ensure no audio from video
      videoRef.current.loop = false; // We'll handle looping manually
      videoRef.current.playsInline = true;
    }
  }, []);

  // Handle video play
  const handleVideoPlay = useCallback(() => {
    console.log("▶️ Video avatar started playing");
    setIsVideoPlaying(true);
  }, []);

  // Handle video pause
  const handleVideoPause = useCallback(() => {
    console.log("⏸️ Video avatar paused");
    setIsVideoPlaying(false);
  }, []);

  // Handle video end
  const handleVideoEnd = useCallback(() => {
    console.log("🏁 Video avatar ended");
    setIsVideoPlaying(false);

    // If we should loop and we're still speaking, restart the video
    if (shouldLoop && isSpeaking) {
      console.log("🔄 Looping video avatar");
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(console.error);
      }
    }
  }, [shouldLoop, isSpeaking]);

  // Handle video error
  const handleVideoError = useCallback((e: any) => {
    console.error("❌ Video avatar error:", e);
    setIsVideoPlaying(false);
  }, []);

  // Handle replay button click
  const handleReplay = useCallback(() => {
    if (videoRef.current && currentAudio) {
      console.log("🔄 Replaying video avatar and audio");

      // Reset video to beginning
      videoRef.current.currentTime = 0;

      // Trigger audio replay through the AudioPlayer
      if (audioPlayerRef.current && audioPlayerRef.current.replay) {
        audioPlayerRef.current.replay();
      }
    }
  }, [currentAudio]);

  // Control video playback based on audio playing state
  useEffect(() => {
    if (!videoRef.current || !isVideoLoaded) return;

    const video = videoRef.current;

    // Only play video when audio is actually playing
    // Don't play during analyzing phase
    if (isAudioPlaying) {
      console.log("🗣️ Starting video avatar - Audio is playing");
      setShouldLoop(true);

      // Clear any existing timeout
      if (loopTimeoutRef.current) {
        clearTimeout(loopTimeoutRef.current);
        loopTimeoutRef.current = null;
      }

      // Start playing the video
      video.currentTime = 0;
      video.play().catch((error) => {
        console.error("Error playing video:", error);
      });
    } else {
      console.log("🔇 Stopping video avatar - Audio stopped or analyzing");
      setShouldLoop(false);

      // Clear any existing timeout
      if (loopTimeoutRef.current) {
        clearTimeout(loopTimeoutRef.current);
        loopTimeoutRef.current = null;
      }

      // Stop the video
      video.pause();
      video.currentTime = 0;
    }
  }, [isAudioPlaying, isVideoLoaded]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (loopTimeoutRef.current) {
        clearTimeout(loopTimeoutRef.current);
      }
    };
  }, []);

  // Get status text based on current state
  const getStatusText = () => {
    // Show analyzing when AI is processing but not yet speaking
    if (isAnalyzing && !isAudioPlaying) return "Analyzing...";
    // Show listening when user is speaking
    if (isListening) return "Listening...";
    // Show speaking when AI is actually speaking (TTS audio playing)
    if (isAudioPlaying) return "Speaking...";
    return "Ready";
  };

  return (
    <div className={`relative ${className}`}>
      {/* Video Avatar */}
      <div
        onClick={onClick}
        className="w-72 h-48 rounded-lg border-2 border-white duration-200 overflow-hidden shadow-lg relative cursor-pointer">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          onLoadedData={handleVideoLoad}
          onPlay={handleVideoPlay}
          onPause={handleVideoPause}
          onEnded={handleVideoEnd}
          onError={handleVideoError}
          preload="auto"
          playsInline
          muted>
          <source src={videoSrc} type="video/mp4" />
          {/* Fallback for browsers that don't support video */}
          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">AI</span>
          </div>
        </video>

        {/* Loading indicator */}
        {!isVideoLoaded && (
          <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Transparent Status Overlay - Left Bottom Corner */}
        <div className="absolute bottom-2 left-2">
          <div
            className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center space-x-1 backdrop-blur-sm border transition-all duration-300 ${
              isAnalyzing && !isAudioPlaying
                ? "bg-blue-500/80 text-white border-blue-400/50"
                : isListening
                ? "bg-slate-500/80 text-white border-slate-400/50"
                : isAudioPlaying
                ? "bg-green-500/80 text-white border-green-400/50"
                : "bg-gray-500/80 text-white border-gray-400/50"
            }`}>
            <div
              className={`w-2 h-2 rounded-full ${
                isAudioPlaying && isVideoPlaying
                  ? "bg-green-300 animate-pulse"
                  : isAnalyzing && !isAudioPlaying
                  ? "bg-blue-300 animate-pulse"
                  : isListening
                  ? "bg-blue-300 animate-pulse"
                  : "bg-gray-300"
              }`}
            />
            <span>{getStatusText()}</span>
          </div>
        </div>

        {/* Replay Button - Right Bottom Corner */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleReplay();
          }}
          className="absolute bottom-2 right-2 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-all duration-200 backdrop-blur-sm border border-white/20"
          title="Replay Video">
          <RotateCcw className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Hidden Audio Player */}
      {currentAudio && (
        <div className="hidden">
          <AudioPlayer
            ref={audioPlayerRef}
            audioData={currentAudio}
            autoPlay={true}
            onPlayingChange={setIsAudioPlaying}
          />
        </div>
      )}
    </div>
  );
};

export default VideoAvatar;
