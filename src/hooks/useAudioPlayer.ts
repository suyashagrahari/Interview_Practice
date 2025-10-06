import { useState, useRef, useCallback, useEffect } from 'react';

interface AudioData {
  audioBase64: string;
  url: string;
  fileName: string;
  mimeType: string;
}

interface AudioPlayerOptions {
  autoPlay?: boolean;
  onEnded?: () => void;
  onError?: (error: Error) => void;
}

export const useAudioPlayer = (options: AudioPlayerOptions = {}) => {
  const { autoPlay = true, onEnded, onError } = options;

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<AudioData | null>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playQueueRef = useRef<Promise<void> | null>(null);
  const lastLoadedUrlRef = useRef<string | null>(null); // Track last loaded URL to prevent duplicates
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);

  // Safe play function with queue management
  const safePlay = useCallback(async (audio: HTMLAudioElement): Promise<void> => {
    // Wait for any ongoing play operation
    if (playQueueRef.current) {
      try {
        await playQueueRef.current;
      } catch (err) {
        console.log('Previous play operation completed with error (normal)');
      }
    }

    // Don't play if already playing
    if (!audio.paused) {
      return;
    }

    try {
      const playPromise = audio.play();
      playQueueRef.current = playPromise;
      await playPromise;
      setIsPlaying(true);
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error('Error playing audio:', error);
        onError?.(error);
      }
      setIsPlaying(false);
    } finally {
      playQueueRef.current = null;
    }
  }, [onError]);

  // Load and play audio from base64
  const loadAndPlayAudio = useCallback(async (audioData: AudioData) => {
    try {
      // Check if this audio is already loaded to prevent duplicate loads
      const audioIdentifier = audioData.url || audioData.fileName;
      if (lastLoadedUrlRef.current === audioIdentifier) {
        console.log('⏭️ Skipping duplicate audio load:', audioIdentifier);
        return;
      }

      console.log('🎵 Loading audio:', audioData.fileName);
      console.log('🎵 Audio data:', {
        hasBase64: !!audioData.audioBase64,
        base64Length: audioData.audioBase64?.length,
        url: audioData.url,
        mimeType: audioData.mimeType
      });

      // Set loading state
      setIsLoading(true);
      lastLoadedUrlRef.current = audioIdentifier;

      // Stop current audio if playing
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        // Revoke old blob URL if it exists
        if (audioRef.current.src.startsWith('blob:')) {
          URL.revokeObjectURL(audioRef.current.src);
        }
      }

      // Create new audio element
      const audio = new Audio();
      audio.crossOrigin = 'anonymous'; // Add CORS support

      let audioSrc = '';
      let usingBlob = false;

      // Primary: Try direct URL first (most reliable for complete audio)
      if (audioData.url) {
        const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001').replace('/api', '');
        audioSrc = `${baseUrl}${audioData.url}`;
        console.log('📡 Using direct URL:', audioSrc);
      }
      // Fallback: Try base64 if URL not available
      else if (audioData.audioBase64 && audioData.audioBase64.trim()) {
        try {
          // Remove any data URL prefix if present
          let base64Data = audioData.audioBase64;
          if (base64Data.includes(',')) {
            base64Data = base64Data.split(',')[1];
          }

          console.log('🔄 Decoding base64, length:', base64Data.length);

          // Convert base64 to blob URL for better performance
          const binaryString = atob(base64Data);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }

          // Create blob with proper MIME type
          const blob = new Blob([bytes], { type: audioData.mimeType || 'audio/mpeg' });
          console.log('📦 Created blob, size:', blob.size, 'bytes, type:', blob.type);

          const blobUrl = URL.createObjectURL(blob);
          audioSrc = blobUrl;
          usingBlob = true;
          console.log('✅ Created blob URL from base64:', blobUrl);
        } catch (base64Error) {
          console.error('❌ Failed to decode base64:', base64Error);
        }
      }

      if (!audioSrc) {
        throw new Error('No valid audio source available');
      }

      console.log('🔊 Setting audio source:', audioSrc.substring(0, 50) + '...');
      audio.src = audioSrc;
      audio.preload = 'auto';

      // Normal playback speed
      audio.playbackRate = 1.0;

      // Set up event listeners
      audio.addEventListener('loadstart', () => {
        console.log('🎬 Audio load started');
      });

      audio.addEventListener('loadedmetadata', () => {
        console.log('📊 Audio metadata loaded, duration:', audio.duration, 'seconds');
        setDuration(audio.duration);
      });

      audio.addEventListener('loadeddata', () => {
        console.log('📥 Audio data loaded');
      });

      audio.addEventListener('canplay', () => {
        console.log('▶️ Audio can start playing');
      });

      audio.addEventListener('canplaythrough', () => {
        console.log('✅ Audio can play through without buffering');
      });

      audio.addEventListener('timeupdate', () => {
        setCurrentTime(audio.currentTime);
      });

      audio.addEventListener('ended', () => {
        console.log('🏁 Audio playback ended');
        setIsPlaying(false);
        setCurrentTime(0);
        onEnded?.();

        // Clean up blob URL if it was used
        if (usingBlob && audioSrc.startsWith('blob:')) {
          URL.revokeObjectURL(audioSrc);
        }
      });

      audio.addEventListener('error', (e: any) => {
        console.error('❌ Audio error event:', e);

        // Get detailed error information
        const errorDetails = {
          eventType: e.type,
          audioError: audio.error,
          errorCode: audio.error?.code,
          errorMessage: audio.error?.message,
          currentSrc: audio.currentSrc,
          networkState: audio.networkState, // 0=empty, 1=idle, 2=loading, 3=no source
          readyState: audio.readyState, // 0=nothing, 1=metadata, 2=current, 3=future, 4=enough
          audioSrc,
          usingBlob,
          srcLength: audioSrc.length
        };

        console.error('🔍 Audio error details:', errorDetails);

        // Map error codes to messages
        const errorMessages: { [key: number]: string } = {
          1: 'MEDIA_ERR_ABORTED - Playback aborted',
          2: 'MEDIA_ERR_NETWORK - Network error',
          3: 'MEDIA_ERR_DECODE - Decoding error',
          4: 'MEDIA_ERR_SRC_NOT_SUPPORTED - Format not supported'
        };

        const errorMsg = audio.error?.code
          ? errorMessages[audio.error.code] || `Unknown error (code: ${audio.error.code})`
          : 'Unknown error';

        console.error('💥 Error message:', errorMsg);

        setIsPlaying(false);
        onError?.(new Error(`Failed to load audio: ${errorMsg}`));

        // Clean up blob URL if it was used
        if (usingBlob && audioSrc.startsWith('blob:')) {
          URL.revokeObjectURL(audioSrc);
        }
      });

      audioRef.current = audio;
      setCurrentAudio(audioData);

      // Wait for audio to be fully loaded (canplaythrough event)
      await new Promise<void>((resolve) => {
        const handleCanPlayThrough = () => {
          console.log('✅ Audio fully loaded and ready to play');
          setIsLoading(false);
          resolve();
        };
        audio.addEventListener('canplaythrough', handleCanPlayThrough, { once: true });

        // Timeout after 5 seconds
        setTimeout(() => {
          console.warn('⏱️ Audio load timeout, playing anyway');
          setIsLoading(false);
          resolve();
        }, 5000);
      });

      // Auto-play if enabled
      if (autoPlay) {
        console.log('▶️ Auto-playing audio...');
        await safePlay(audio);
      }

      console.log('✅ Audio loaded successfully');
    } catch (error: any) {
      console.error('Error loading audio:', error);
      setIsLoading(false);
      onError?.(error);
    }
  }, [autoPlay, safePlay, onEnded, onError]);

  // Play audio
  const play = useCallback(async () => {
    if (audioRef.current && audioRef.current.paused) {
      await safePlay(audioRef.current);
    }
  }, [safePlay]);

  // Pause audio
  const pause = useCallback(() => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  // Replay audio from beginning
  const replay = useCallback(async () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      await safePlay(audioRef.current);
    }
  }, [safePlay]);

  // Stop audio and reset
  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentTime(0);
    }
  }, []);

  // Seek to specific time
  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        // Revoke blob URL if it exists
        if (audioRef.current.src.startsWith('blob:')) {
          URL.revokeObjectURL(audioRef.current.src);
        }
      }
    };
  }, []);

  return {
    isPlaying,
    isLoading,
    currentAudio,
    duration,
    currentTime,
    loadAndPlayAudio,
    play,
    pause,
    replay,
    stop,
    seek,
  };
};
