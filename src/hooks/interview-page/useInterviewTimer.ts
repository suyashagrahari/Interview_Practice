import { useState, useEffect, useCallback } from "react";
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

  // Timer countdown with automatic interview ending
  useEffect(() => {
    if (isInterviewStarted && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          const newTime = prev <= 1 ? 0 : prev - 1;

          if (newTime === 0) {
            console.log("⏰ Time's up! Automatically ending interview...");
            toast.info("Time's up! Interview ending automatically...");
            onTimeExpired();
          }

          return newTime;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isInterviewStarted, timeRemaining, onTimeExpired]);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }, []);

  const resetTimer = useCallback(() => {
    setTimeRemaining(INTERVIEW_CONSTANTS.TIMER.INITIAL_TIME);
    setInterviewStartTime(new Date());
  }, []);

  const isLowTime = timeRemaining < INTERVIEW_CONSTANTS.TIMER.LOW_TIME_THRESHOLD;

  return {
    timeRemaining,
    setTimeRemaining,
    interviewStartTime,
    setInterviewStartTime,
    formatTime,
    resetTimer,
    isLowTime,
  };
};
