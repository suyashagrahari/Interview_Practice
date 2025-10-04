import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { InterviewQuestion, SubmitAnswerRequest } from '@/lib/api/interview-realtime';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

interface UseInterviewWebSocketProps {
  interviewId: string | null;
  userId: string | null;
  onQuestionReceived: (question: InterviewQuestion, questionNumber: number) => void;
  onAnswerSubmitted: (data: any) => void;
  onWarning: (data: any) => void;
  onInterviewComplete: (data: any) => void;
  onError: (error: { message: string; code: string }) => void;
  onProctoringDataReceived?: (data: any) => void;
}

export const useInterviewWebSocket = ({
  interviewId,
  userId,
  onQuestionReceived,
  onAnswerSubmitted,
  onWarning,
  onInterviewComplete,
  onError,
  onProctoringDataReceived,
}: UseInterviewWebSocketProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  // Initialize WebSocket connection
  useEffect(() => {
    if (!interviewId) {
      console.warn('⚠️ WebSocket not initializing - missing interviewId:', { interviewId, userId });
      return;
    }

    // If userId is not available, we'll use interviewId as a fallback
    const effectiveUserId = userId || `interview-${interviewId}`;
    if (!userId) {
      console.warn('⚠️ No userId available, using fallback:', effectiveUserId);
    }

    console.log('🔌 Initializing WebSocket connection...', {
      interviewId,
      userId: effectiveUserId,
      socketUrl: SOCKET_URL
    });

    const newSocket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    // Connection events
    newSocket.on('connect', () => {
      console.log('✅ WebSocket connected:', newSocket.id);
      setIsConnected(true);

      // Join interview room (use effectiveUserId as fallback)
      newSocket.emit('interview:join', { interviewId, userId: effectiveUserId });
    });

    newSocket.on('connect_error', (error) => {
      console.error('❌ WebSocket connection error:', error.message);
      console.error('Error details:', error);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('❌ WebSocket disconnected:', reason);
      setIsConnected(false);
    });

    newSocket.on('interview:joined', (data) => {
      console.log('📥 Joined interview room:', data);
    });

    // Question events
    newSocket.on('question:first', (response) => {
      console.log('🎯 First question received:', response);
      if (response.success && response.data) {
        onQuestionReceived(response.data.question, response.data.questionNumber);
      }
      setIsGenerating(false);
    });

    newSocket.on('question:next', (response) => {
      console.log('🎯 Next question received:', response);
      if (response.success && response.data) {
        onQuestionReceived(response.data.question, response.data.questionNumber);
      }
      setIsGenerating(false);
      setIsAnalyzing(false);
    });

    newSocket.on('question:generating', (data) => {
      console.log('⏳ Generating question:', data.message);
      setIsGenerating(true);
    });

    newSocket.on('question:error', (error) => {
      console.error('❌ Question error:', error);
      onError(error);
      setIsGenerating(false);
    });

    // Answer events
    newSocket.on('answer:analyzing', (data) => {
      console.log('🔍 Analyzing answer:', data.message);
      setIsAnalyzing(true);
    });

    newSocket.on('answer:submitted', (response) => {
      console.log('✅ Answer submitted:', response);
      if (response.success && response.data) {
        onAnswerSubmitted(response.data);
      }
    });

    newSocket.on('answer:error', (error) => {
      console.error('❌ Answer error:', error);
      onError(error);
      setIsAnalyzing(false);
    });

    // Warning events
    newSocket.on('interview:warning', (response) => {
      console.log('⚠️ Warning received:', response);
      if (response.success && response.data) {
        onWarning(response.data);
      }
    });

    // Interview complete events
    newSocket.on('interview:complete', (response) => {
      console.log('🎉 Interview complete:', response);
      if (response.success && response.data) {
        onInterviewComplete(response.data);
      }
      setIsGenerating(false);
      setIsAnalyzing(false);
    });

    newSocket.on('interview:terminated', (response) => {
      console.log('🚫 Interview terminated:', response);
      if (response.success && response.data) {
        onInterviewComplete({ ...response.data, terminated: true });
      }
      setIsGenerating(false);
      setIsAnalyzing(false);
    });

    // Reconnection events
    newSocket.on('reconnection:success', (response) => {
      console.log('🔄 Reconnection successful:', response);
      if (response.success && response.data) {
        // Handle state restoration
        onQuestionReceived(response.data.currentQuestion, response.data.questionNumber);

        // Restore proctoring data if available
        if (response.data.proctoringData && onProctoringDataReceived) {
          onProctoringDataReceived({
            proctoringData: response.data.proctoringData,
            warningCount: response.data.warningCount,
          });
        }
      }
    });

    newSocket.on('reconnection:error', (error) => {
      console.error('❌ Reconnection error:', error);
      onError(error);
    });

    // Proctoring events
    newSocket.on('proctoring:data', (response) => {
      console.log('📊 Proctoring data received:', response);
      if (onProctoringDataReceived && response.success && response.data) {
        onProctoringDataReceived(response.data);
      }
    });

    newSocket.on('proctoring:updated', (response) => {
      console.log('✅ Proctoring data updated:', response);
    });

    newSocket.on('proctoring:error', (error) => {
      console.error('❌ Proctoring error:', error);
    });

    // Cleanup
    return () => {
      console.log('🧹 Cleaning up WebSocket connection');
      newSocket.emit('interview:leave', { interviewId, userId: effectiveUserId });
      newSocket.close();
      socketRef.current = null;
    };
  }, [interviewId, userId]); // Keep original dependencies

  // Generate first question
  const generateFirstQuestion = useCallback(() => {
    if (!socket || !isConnected || !interviewId) {
      console.error('Cannot generate first question: WebSocket not ready', {
        hasSocket: !!socket,
        isConnected,
        interviewId
      });
      return;
    }

    const effectiveUserId = userId || `interview-${interviewId}`;
    console.log('📤 Requesting first question...', { interviewId, userId: effectiveUserId });
    setIsGenerating(true);
    socket.emit('question:generate-first', { interviewId, userId: effectiveUserId });
  }, [socket, isConnected, interviewId, userId]);

  // Submit answer
  const submitAnswer = useCallback(
    (questionId: string, answer: string, proctoringData: any) => {
      if (!socket || !isConnected || !interviewId) {
        console.error('Cannot submit answer: WebSocket not ready');
        return;
      }

      const effectiveUserId = userId || `interview-${interviewId}`;
      console.log('📤 Submitting answer...', { questionId, userId: effectiveUserId });
      setIsAnalyzing(true);
      socket.emit('answer:submit', {
        interviewId,
        questionId,
        userId: effectiveUserId,
        answer,
        proctoringData,
      });
    },
    [socket, isConnected, interviewId, userId]
  );

  // Reconnect to interview
  const reconnectInterview = useCallback(() => {
    if (!socket || !isConnected || !interviewId) {
      console.error('Cannot reconnect: WebSocket not ready');
      return;
    }

    const effectiveUserId = userId || `interview-${interviewId}`;
    console.log('🔄 Requesting reconnection...', { userId: effectiveUserId });
    socket.emit('interview:reconnect', { interviewId, userId: effectiveUserId });
  }, [socket, isConnected, interviewId, userId]);

  // Update proctoring data
  const updateProctoringData = useCallback((proctoringData: any) => {
    if (!socket || !isConnected || !interviewId) {
      console.error('Cannot update proctoring data: WebSocket not ready');
      return;
    }

    const effectiveUserId = userId || `interview-${interviewId}`;
    console.log('🔍 Updating proctoring data...', proctoringData);
    socket.emit('proctoring:update', {
      interviewId,
      userId: effectiveUserId,
      proctoringData,
    });
  }, [socket, isConnected, interviewId, userId]);

  // Get proctoring data
  const getProctoringData = useCallback(() => {
    if (!socket || !isConnected || !interviewId) {
      console.error('Cannot get proctoring data: WebSocket not ready');
      return;
    }

    const effectiveUserId = userId || `interview-${interviewId}`;
    console.log('📊 Requesting proctoring data...');
    socket.emit('proctoring:get', {
      interviewId,
      userId: effectiveUserId,
    });
  }, [socket, isConnected, interviewId, userId]);

  return {
    socket,
    isConnected,
    isGenerating,
    isAnalyzing,
    generateFirstQuestion,
    submitAnswer,
    reconnectInterview,
    updateProctoringData,
    getProctoringData,
  };
};
