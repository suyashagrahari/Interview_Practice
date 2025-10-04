import { useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

interface TimerData {
  interviewId: string;
  timeRemaining: number;
  timeElapsed: number;
  isExpired: boolean;
}

export const useInterviewTimer = (interviewId: string | null, userId: string | null) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(2700); // 45 minutes default
  const [isExpired, setIsExpired] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    if (!interviewId || !userId) return;

    // Connect to WebSocket server
    const socketInstance = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001', {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketInstance.on('connect', () => {
      console.log('🔌 WebSocket connected');
      setIsConnected(true);

      // Join interview room
      socketInstance.emit('interview:join', { interviewId, userId });
    });

    socketInstance.on('disconnect', () => {
      console.log('🔌 WebSocket disconnected');
      setIsConnected(false);
    });

    socketInstance.on('interview:joined', (data) => {
      console.log('✅ Joined interview room:', data);
    });

    // Listen for timer updates
    socketInstance.on('timer:update', (data: TimerData) => {
      console.log('⏱️  Timer update:', data);
      setTimeRemaining(data.timeRemaining);
      setIsExpired(data.isExpired);
    });

    // Listen for interview expiry
    socketInstance.on('interview:expired', (data) => {
      console.log('⏰ Interview expired:', data);
      setIsExpired(true);
      setTimeRemaining(0);
    });

    setSocket(socketInstance);

    // Cleanup
    return () => {
      if (socketInstance) {
        socketInstance.emit('interview:leave', { interviewId });
        socketInstance.disconnect();
      }
    };
  }, [interviewId, userId]);

  const getCurrentTime = useCallback(() => {
    if (socket && interviewId) {
      socket.emit('timer:get', { interviewId });
    }
  }, [socket, interviewId]);

  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  return {
    socket,
    timeRemaining,
    isExpired,
    isConnected,
    getCurrentTime,
    formatTime,
  };
};
