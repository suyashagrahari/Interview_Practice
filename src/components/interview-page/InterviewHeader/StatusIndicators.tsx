import React from "react";
import { AlertTriangle } from "lucide-react";
import type { WarningStatus } from "@/lib/api/interview-realtime";

interface StatusIndicatorsProps {
  isDarkMode: boolean;
  isInterviewStarted: boolean;
  tabSwitchCount: number;
  isCVLoading: boolean;
  isCVModelLoaded: boolean;
  persistentCheatingDetected: boolean;
  warningStatus: WarningStatus;
  onCVDetectionClick: () => void;
}

export const StatusIndicators: React.FC<StatusIndicatorsProps> = ({
  isDarkMode,
  isInterviewStarted,
  tabSwitchCount,
  isCVLoading,
  isCVModelLoaded,
  persistentCheatingDetected,
  warningStatus,
  onCVDetectionClick,
}) => {
  if (!isInterviewStarted) return null;

  return (
    <div className="flex items-center space-x-3 flex-1">
      {/* Tab Switch Monitor */}
      <div
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
          tabSwitchCount > 0
            ? isDarkMode
              ? "bg-yellow-900/30 border border-yellow-700"
              : "bg-yellow-50 border border-yellow-200"
            : isDarkMode
            ? "bg-green-900/30 border border-green-700"
            : "bg-green-50 border border-green-200"
        }`}>
        <AlertTriangle
          className={`w-4 h-4 animate-pulse ${
            tabSwitchCount > 0 ? "text-yellow-500" : "text-green-500"
          }`}
        />
        <div className="flex items-center space-x-1">
          <span
            className={`text-xs ${
              tabSwitchCount > 0 ? "text-yellow-400" : "text-green-400"
            }`}>
            Tabs Switches :
          </span>
          <span
            className={`text-sm font-bold ${
              tabSwitchCount > 0 ? "text-yellow-500" : "text-green-500"
            }`}>
            {tabSwitchCount}
          </span>
        </div>
      </div>

      {/* Computer Vision Loading Indicator */}
      {isCVLoading && (
        <div className="flex items-center space-x-2 px-2.5 py-1.5 rounded-lg bg-blue-50 border border-blue-200">
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="flex flex-col">
            <span className="text-xs text-blue-400 font-light tracking-tight">
              Proctoring
            </span>
            <span className="text-xs font-light text-blue-500">
              Initializing...
            </span>
          </div>
        </div>
      )}

      {/* Professional Cheating Detection Monitor */}
      {isCVModelLoaded && !isCVLoading && (
        <div
          onClick={onCVDetectionClick}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 cursor-pointer hover:scale-105 ${
            persistentCheatingDetected
              ? isDarkMode
                ? "bg-red-900/30 border border-red-700"
                : "bg-red-50 border border-red-200"
              : isDarkMode
              ? "bg-green-900/30 border border-green-700"
              : "bg-green-50 border border-green-200"
          }`}
          title="Click to view all CV detection points in console">
          {persistentCheatingDetected ? (
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse" />
              <div className="flex items-center space-x-1">
                <span className="text-xs text-red-400">Cheating :</span>
                <span className="text-sm font-bold text-red-500">
                  Detected
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-xs text-green-400">Proctoring :</span>
                <span className="text-sm font-bold text-green-500">
                  Normal
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Warning Indicator */}
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
    </div>
  );
};
