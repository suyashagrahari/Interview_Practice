import React from "react";
import { StatusIndicators } from "./StatusIndicators";
import { UserDetails } from "./UserDetails";
import { TimerDisplay } from "./TimerDisplay";
import type { Interview } from "@/lib/api/interview";
import type { WarningStatus } from "@/lib/api/interview-realtime";

interface InterviewHeaderProps {
  isDarkMode: boolean;
  isInterviewStarted: boolean;
  tabSwitchCount: number;
  isCVLoading: boolean;
  isCVModelLoaded: boolean;
  persistentCheatingDetected: boolean;
  warningStatus: WarningStatus;
  onCVDetectionClick: () => void;
  isLoadingInterviewData: boolean;
  interviewData: Interview | null;
  interviewId: string | null;
  onInterviewDetailsClick: () => void;
  timeRemaining: number;
  isLowTime: boolean;
  formatTime: (seconds: number) => string;
  onEndInterview: () => void;
  isGeneratingQuestion: boolean;
}

export const InterviewHeader: React.FC<InterviewHeaderProps> = (props) => {
  return (
    <div
      className={`h-16 px-6 flex items-center justify-between border-b ${
        props.isDarkMode
          ? "bg-slate-800/90 backdrop-blur-sm border-slate-700"
          : "bg-white/90 backdrop-blur-sm border-slate-200"
      }`}>
      {/* Left Side - Alert & Warning Status Indicators */}
      <StatusIndicators
        isDarkMode={props.isDarkMode}
        isInterviewStarted={props.isInterviewStarted}
        tabSwitchCount={props.tabSwitchCount}
        isCVLoading={props.isCVLoading}
        isCVModelLoaded={props.isCVModelLoaded}
        persistentCheatingDetected={props.persistentCheatingDetected}
        warningStatus={props.warningStatus}
        onCVDetectionClick={props.onCVDetectionClick}
      />

      {/* Middle Section - User Details */}
      <UserDetails
        isDarkMode={props.isDarkMode}
        isLoadingInterviewData={props.isLoadingInterviewData}
        interviewData={props.interviewData}
        interviewId={props.interviewId}
        onDetailsClick={props.onInterviewDetailsClick}
      />

      {/* Right Side - Timer, Warning, End Interview */}
      <TimerDisplay
        isDarkMode={props.isDarkMode}
        timeRemaining={props.timeRemaining}
        isLowTime={props.isLowTime}
        formatTime={props.formatTime}
        warningStatus={props.warningStatus}
        onEndInterview={props.onEndInterview}
        isGeneratingQuestion={props.isGeneratingQuestion}
      />
    </div>
  );
};
