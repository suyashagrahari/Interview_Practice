"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Clock, PlayCircle, XCircle, X } from "lucide-react";

interface IncompleteInterviewModalProps {
  isOpen: boolean;
  interviewData: {
    interviewId: string;
    interviewType: string;
    questionNumber: number;
    totalQuestions: number;
    timeRemaining: number;
    startTime: Date;
  } | null;
  onResume: () => void;
  onEnd: () => void;
  onCancel: () => void;
}

const IncompleteInterviewModal = ({
  isOpen,
  interviewData,
  onResume,
  onEnd,
  onCancel,
}: IncompleteInterviewModalProps) => {
  if (!interviewData) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const formatInterviewType = (type: string) => {
    const types: Record<string, string> = {
      resume: "Resume-Based",
      topic: "Topic-Based",
      company: "Company-Based",
      jd: "Job Description",
    };
    return types[type] || type;
  };

  const isExpired = interviewData.timeRemaining <= 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onCancel}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-sm bg-white dark:bg-slate-800 rounded-xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-orange-100 dark:bg-orange-500/20 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Active Interview Found
                    </h2>
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      {isExpired
                        ? "Your previous interview has expired"
                        : "You have an active interview session"}
                    </p>
                  </div>
                </div>

                {/* Close Button */}
                <button
                  onClick={onCancel}
                  className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors duration-200"
                  aria-label="Close modal">
                  <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
              {/* Interview Details */}
              <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600 dark:text-gray-300">
                    Interview Type
                  </span>
                  <span className="text-xs font-semibold text-gray-900 dark:text-white">
                    {formatInterviewType(interviewData.interviewType)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600 dark:text-gray-300">
                    Progress
                  </span>
                  <span className="text-xs font-semibold text-gray-900 dark:text-white">
                    Question {interviewData.questionNumber} of{" "}
                    {interviewData.totalQuestions}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600 dark:text-gray-300">
                    Time Remaining
                  </span>
                  <div className="flex items-center space-x-1">
                    <Clock
                      className={`w-3 h-3 ${
                        isExpired
                          ? "text-red-500"
                          : interviewData.timeRemaining < 300
                          ? "text-orange-500"
                          : "text-green-500"
                      }`}
                    />
                    <span
                      className={`text-xs font-semibold ${
                        isExpired
                          ? "text-red-600 dark:text-red-400"
                          : interviewData.timeRemaining < 300
                          ? "text-orange-600 dark:text-orange-400"
                          : "text-gray-900 dark:text-white"
                      }`}>
                      {isExpired
                        ? "Expired"
                        : formatTime(interviewData.timeRemaining)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600 dark:text-gray-300">
                    Started At
                  </span>
                  <span className="text-xs font-semibold text-gray-900 dark:text-white">
                    {new Date(interviewData.startTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>

              {/* Warning Message */}
              {!isExpired ? (
                <div className="bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/30 rounded-lg p-3">
                  <p className="text-xs text-orange-900 dark:text-orange-200 leading-relaxed">
                    You already have an active interview session. Please
                    complete or cancel it before starting a new one.
                  </p>
                  <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">
                    <strong>Note:</strong> Time continues to count down based on
                    when you started.
                  </p>
                </div>
              ) : (
                <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-lg p-3">
                  <p className="text-xs text-red-900 dark:text-red-200 leading-relaxed">
                    <strong>Interview Expired:</strong> The 45-minute time limit
                    has been exceeded. You must end this interview to start a
                    new one.
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="p-4 bg-gray-50 dark:bg-slate-900/50 border-t border-gray-200 dark:border-slate-700">
              {isExpired ? (
                <button
                  onClick={onEnd}
                  className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2">
                  <XCircle className="w-4 h-4" />
                  <span className="text-sm">End Expired Interview</span>
                </button>
              ) : (
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={onEnd}
                    className="flex-1 px-4 py-2 bg-white dark:bg-slate-700 border-2 border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-200 font-medium rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 whitespace-nowrap">
                    <XCircle className="w-4 h-4" />
                    <span className="text-sm">End Interview</span>
                  </button>

                  <button
                    onClick={onResume}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl whitespace-nowrap">
                    <PlayCircle className="w-4 h-4" />
                    <span className="text-sm">Continue Interview</span>
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default IncompleteInterviewModal;
