import React from "react";
import { Info } from "lucide-react";
import type { Interview } from "@/lib/api/interview";

interface UserDetailsProps {
  isDarkMode: boolean;
  isLoadingInterviewData: boolean;
  interviewData: Interview | null;
  interviewId: string | null;
  onDetailsClick: () => void;
}

export const UserDetails: React.FC<UserDetailsProps> = ({
  isDarkMode,
  isLoadingInterviewData,
  interviewData,
  interviewId,
  onDetailsClick,
}) => {
  return (
    <div className="flex-1 flex justify-center items-center space-x-4">
      <div
        className={`flex items-center space-x-6 px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 ${
          isDarkMode
            ? "bg-slate-700/50 border border-slate-600 hover:bg-slate-700/70 hover:border-slate-500"
            : "bg-slate-100/50 border border-slate-200 hover:bg-slate-200/70 hover:border-slate-300"
        }`}
        onClick={onDetailsClick}
        title="Click to view detailed interview information">
        {/* Show message when no interview data is available */}
        {!isLoadingInterviewData && !interviewData && interviewId && (
          <div className="text-center">
            <div
              className={`text-sm ${
                isDarkMode ? "text-slate-400" : "text-slate-500"
              }`}>
              No interview data available
            </div>
          </div>
        )}

        {/* Show loading state */}
        {isLoadingInterviewData && (
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="animate-pulse bg-slate-300 dark:bg-slate-600 h-4 w-16 rounded mb-1"></div>
              <div className="animate-pulse bg-slate-300 dark:bg-slate-600 h-3 w-12 rounded"></div>
            </div>
            <div className="w-px h-8 bg-slate-300 dark:bg-slate-600"></div>
            <div className="text-center">
              <div className="animate-pulse bg-slate-300 dark:bg-slate-600 h-4 w-8 rounded mb-1"></div>
              <div className="animate-pulse bg-slate-300 dark:bg-slate-600 h-3 w-8 rounded"></div>
            </div>
            <div className="w-px h-8 bg-slate-300 dark:bg-slate-600"></div>
            <div className="text-center">
              <div className="animate-pulse bg-slate-300 dark:bg-slate-600 h-4 w-32 rounded mb-1"></div>
              <div className="animate-pulse bg-slate-300 dark:bg-slate-600 h-3 w-24 rounded"></div>
            </div>
          </div>
        )}

        {/* Experience Level */}
        {!isLoadingInterviewData && interviewData && (
          <div className="text-center">
            <div
              className={`text-xs font-medium ${
                isDarkMode ? "text-slate-400" : "text-slate-500"
              }`}>
              Experience
            </div>
            <div
              className={`text-sm font-semibold ${
                isDarkMode ? "text-white" : "text-slate-900"
              }`}>
              {interviewData?.level || "N/A"} years
            </div>
          </div>
        )}

        {/* Divider */}
        {!isLoadingInterviewData && interviewData && (
          <div
            className={`w-px h-8 ${
              isDarkMode ? "bg-slate-600" : "bg-slate-300"
            }`}></div>
        )}

        {/* Job Level */}
        {!isLoadingInterviewData && interviewData && (
          <div className="text-center">
            <div
              className={`text-xs font-medium ${
                isDarkMode ? "text-slate-400" : "text-slate-500"
              }`}>
              Level
            </div>
            <div
              className={`text-sm font-semibold ${
                isDarkMode ? "text-white" : "text-slate-900"
              }`}>
              {interviewData?.difficultyLevel || "N/A"}
            </div>
          </div>
        )}

        {/* Divider */}
        {!isLoadingInterviewData && interviewData && (
          <div
            className={`w-px h-8 ${
              isDarkMode ? "bg-slate-600" : "bg-slate-300"
            }`}></div>
        )}

        {/* Job Title */}
        {!isLoadingInterviewData && interviewData && (
          <div className="text-center">
            <div
              className={`text-xs font-medium ${
                isDarkMode ? "text-slate-400" : "text-slate-500"
              }`}>
              Position
            </div>
            <div
              className={`text-sm font-semibold ${
                isDarkMode ? "text-white" : "text-slate-900"
              }`}>
              {interviewData?.jobRole || "N/A"}
            </div>
          </div>
        )}

        {/* Experience Years */}
        {!isLoadingInterviewData && interviewData?.experienceLevel && (
          <>
            {/* Divider */}
            <div
              className={`w-px h-8 ${
                isDarkMode ? "bg-slate-600" : "bg-slate-300"
              }`}></div>

            <div className="text-center">
              <div
                className={`text-xs font-medium ${
                  isDarkMode ? "text-slate-400" : "text-slate-500"
                }`}>
                Years
              </div>
              <div
                className={`text-sm font-semibold ${
                  isDarkMode ? "text-white" : "text-slate-900"
                }`}>
                {interviewData?.experienceLevel || "N/A"}
              </div>
            </div>
          </>
        )}

        {/* Company Name */}
        {!isLoadingInterviewData && interviewData?.companyName && (
          <>
            {/* Divider */}
            <div
              className={`w-px h-8 ${
                isDarkMode ? "bg-slate-600" : "bg-slate-300"
              }`}></div>

            <div className="text-center">
              <div
                className={`text-xs font-medium ${
                  isDarkMode ? "text-slate-400" : "text-slate-500"
                }`}>
                Company
              </div>
              <div
                className={`text-sm font-semibold ${
                  isDarkMode ? "text-white" : "text-slate-900"
                }`}>
                {interviewData?.companyName || "N/A"}
              </div>
            </div>
          </>
        )}

        {/* Click indicator */}
        {!isLoadingInterviewData && interviewData && (
          <div className="ml-2">
            <Info
              className={`w-4 h-4 ${
                isDarkMode ? "text-slate-400" : "text-slate-500"
              } opacity-60`}
            />
          </div>
        )}
      </div>
    </div>
  );
};
