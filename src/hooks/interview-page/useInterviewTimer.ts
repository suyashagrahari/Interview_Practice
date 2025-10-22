import { useState, useEffect, useCallback, useRef } from "react";
import { INTERVIEW_CONSTANTS } from "../../constants/interview-page/interview.constants";
import { toast } from "@/utils/toast";

interface UseInterviewTimerProps {
  isInterviewStarted: boolean;
  onTimeExpired: () => void;
}

export const useInterviewTimer = ({
  isInterviewStarted,
  onTimeExpired,
}: UseInterviewTimerProps) => {
  const [timeRemaining, setTimeRemaining] = useState(
    INTERVIEW_CONSTANTS.TIMER.INITIAL_TIME
  );
  const [interviewStartTime, setInterviewStartTime] = useState<Date | null>(
    null
  );

  // Use refs to avoid recreating the interval on every render
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const onTimeExpiredRef = useRef(onTimeExpired);
  const hasExpiredRef = useRef(false);

  // Keep the callback ref updated without recreating the interval
  useEffect(() => {
    onTimeExpiredRef.current = onTimeExpired;
  }, [onTimeExpired]);

  // Timer countdown with automatic interview ending
  useEffect(() => {
    // Clear any existing timer when interview starts/stops
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (isInterviewStarted && timeRemaining > 0) {
      console.log(`⏱️ Starting interview timer with ${timeRemaining} seconds remaining`);
      hasExpiredRef.current = false;

      // Create a robust timer using requestAnimationFrame for better accuracy
      let lastTime = Date.now();
      let accumulatedTime = 0;

      const tick = () => {
        const now = Date.now();
        const delta = now - lastTime;
        lastTime = now;

        // Accumulate time to handle sub-second intervals
        accumulatedTime += delta;

        if (accumulatedTime >= 1000) {
          accumulatedTime -= 1000;

          setTimeRemaining((prev) => {
            const newTime = Math.max(0, prev - 1);

            // Handle time expiration
            if (newTime === 0 && !hasExpiredRef.current) {
              hasExpiredRef.current = true;
              console.log("⏰ Time's up! Automatically ending interview...");
              toast.info("Time's up! Interview ending automatically...");

              // Call the callback after a slight delay to ensure state updates
              setTimeout(() => {
                onTimeExpiredRef.current();
              }, 100);
            }

            return newTime;
          });
        }

        if (timerRef.current) {
          timerRef.current = setTimeout(tick, 100) as any; // Check every 100ms for better accuracy
        }
      };

      // Start the timer
      timerRef.current = setTimeout(tick, 100) as any;

      console.log("✅ Interview timer started successfully");
    }

    // Cleanup function
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
        console.log("🧹 Interview timer cleaned up");
      }
    };
  }, [isInterviewStarted]); // Only depend on isInterviewStarted, not timeRemaining

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }, []);

  const resetTimer = useCallback(() => {
    hasExpiredRef.current = false;
    setTimeRemaining(INTERVIEW_CONSTANTS.TIMER.INITIAL_TIME);
    setInterviewStartTime(new Date());
    console.log("🔄 Timer reset to initial time");
  }, []);

  const pauseTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
      console.log("⏸️ Timer paused");
    }
  }, []);

  const resumeTimer = useCallback(() => {
    if (!timerRef.current && isInterviewStarted && timeRemaining > 0) {
      console.log("▶️ Timer resumed");
      // The main effect will restart the timer
      setTimeRemaining((prev) => prev);
    }
  }, [isInterviewStarted, timeRemaining]);

  const isLowTime = timeRemaining < INTERVIEW_CONSTANTS.TIMER.LOW_TIME_THRESHOLD;

  return {
    timeRemaining,
    setTimeRemaining,
    interviewStartTime,
    setInterviewStartTime,
    formatTime,
    resetTimer,
    pauseTimer,
    resumeTimer,
    isLowTime,
  };
};
