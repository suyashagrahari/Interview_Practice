import React from "react";
import { Timer, AlertTriangle, PhoneOff } from "lucide-react";
import type { WarningStatus } from "@/lib/api/interview-realtime";

interface TimerDisplayProps {
  isDarkMode: boolean;
  timeRemaining: number;
  isLowTime: boolean;
  formatTime: (seconds: number) => string;
  warningStatus: WarningStatus;
  onEndInterview: () => void;
  isGeneratingQuestion: boolean;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({
  isDarkMode,
  timeRemaining,
  isLowTime,
  formatTime,
  warningStatus,
  onEndInterview,
  isGeneratingQuestion,
}) => {
  return (
    <div className="flex items-center space-x-4 flex-1 justify-end">
      {/* Timer */}
      <div
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
          isLowTime
            ? isDarkMode
              ? "bg-red-900/30 border border-red-700"
              : "bg-red-50 border border-red-200"
            : isDarkMode
            ? "bg-slate-700/50 border border-slate-600"
            : "bg-slate-100/50 border border-slate-200"
        }`}>
        <Timer
          className={`w-4 h-4 ${
            isLowTime
              ? "text-red-500"
              : isDarkMode
              ? "text-slate-300"
              : "text-slate-600"
          }`}
        />
        <div className="text-center">
          <div
            className={`text-sm font-bold ${
              isLowTime
                ? "text-red-500"
                : isDarkMode
                ? "text-slate-200"
                : "text-slate-800"
            }`}>
            {formatTime(timeRemaining)}
          </div>
        </div>
      </div>

      {/* Warning Indicator - Moved from StatusIndicators for right side */}
      {warningStatus.warningCount > 0 && !warningStatus.isTerminated && (
        <div
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
            warningStatus.warningCount === 1
              ? isDarkMode
                ? "bg-yellow-900/30 border border-yellow-700"
                : "bg-yellow-50 border border-yellow-200"
              : isDarkMode
              ? "bg-red-900/30 border border-red-700"
              : "bg-red-50 border border-red-200"
          }`}>
          <AlertTriangle
            className={`w-4 h-4 animate-pulse ${
              warningStatus.warningCount === 1
                ? "text-yellow-500"
                : "text-red-500"
            }`}
          />
          <div className="flex items-center space-x-1">
            <span
              className={`text-xs ${
                warningStatus.warningCount === 1
                  ? "text-yellow-400"
                  : "text-red-400"
              }`}>
              Warning :
            </span>
            <span
              className={`text-sm font-bold ${
                warningStatus.warningCount === 1
                  ? "text-yellow-500"
                  : "text-red-500"
              }`}>
              {warningStatus.warningCount}
            </span>
          </div>
        </div>
      )}

      {/* End Interview Button */}
      <div className="relative">
        <button
          onClick={onEndInterview}
          disabled={isGeneratingQuestion}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 group ${
            isGeneratingQuestion ? "opacity-50 cursor-not-allowed" : ""
          } ${
            isDarkMode
              ? "bg-red-700/50 hover:bg-red-600/50 text-red-300 border border-red-600"
              : "bg-red-100/50 hover:bg-red-200/50 text-red-600 border border-red-200"
          }`}
          title="Exit Interview">
          <PhoneOff className="w-4 h-4" />
          <span className="text-sm font-medium">End</span>
          {/* Tooltip */}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
            Exit Interview
          </div>
        </button>
      </div>
    </div>
  );
};
