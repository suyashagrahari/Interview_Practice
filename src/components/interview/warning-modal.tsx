"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X, Shield, AlertCircle } from "lucide-react";
import { WarningData, WarningStatus } from "@/lib/api/interview-realtime";

interface ExtendedWarningData extends WarningData {
  reason?: string;
  isProfessional?: boolean;
  containsInappropriateContent?: boolean;
  sentiment?: "POSITIVE" | "NEGATIVE" | "NEUTRAL";
  message?: string;
  warningType?: string;
  severity?: string;
}

interface WarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  warningData: ExtendedWarningData;
  warningStatus: WarningStatus;
}

const WarningModal: React.FC<WarningModalProps> = ({
  isOpen,
  onClose,
  warningData,
  warningStatus,
}) => {
  if (!warningData.issued) return null;

  const getWarningIcon = () => {
    if (warningStatus.isTerminated) {
      return <AlertCircle className="w-5 h-5 text-red-500" />;
    }
    if (warningStatus.warningCount === 1) {
      return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    }
    return <Shield className="w-5 h-5 text-orange-500" />;
  };

  const getWarningTitle = () => {
    if (warningStatus.isTerminated) {
      return "Interview Terminated";
    }
    if (warningStatus.warningCount === 1) {
      return "First Warning";
    }
    return "Warning Issued";
  };

  const getWarningColor = () => {
    if (warningStatus.isTerminated) {
      return "red";
    }
    if (warningStatus.warningCount === 1) {
      return "yellow";
    }
    return "orange";
  };

  const getWarningMessage = () => {
    if (warningStatus.isTerminated) {
      return "Your interview has been terminated due to continued inappropriate behavior. This type of conduct is not acceptable in a professional setting.";
    }
    if (warningStatus.warningCount === 1) {
      return "This is your first and last warning. This type of behavior is not acceptable in a professional interview setting. If this continues, your interview will be terminated.";
    }
    return "Warning issued for inappropriate content.";
  };

  const getWarningDetails = () => {
    if (warningData.reason) {
      return (
        <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h4 className="text-xs font-medium text-gray-900 dark:text-gray-100 mb-2">
            Analysis Details:
          </h4>
          <div className="space-y-1 text-xs text-gray-600 dark:text-gray-300">
            <div className="flex justify-between">
              <span>Sentiment:</span>
              <span
                className={`font-medium ${
                  warningData.sentiment === "NEGATIVE"
                    ? "text-red-500"
                    : warningData.sentiment === "POSITIVE"
                    ? "text-green-500"
                    : "text-gray-500"
                }`}>
                {warningData.sentiment}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Professional:</span>
              <span
                className={`font-medium ${
                  warningData.isProfessional ? "text-green-500" : "text-red-500"
                }`}>
                {warningData.isProfessional ? "Yes" : "No"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Inappropriate Content:</span>
              <span
                className={`font-medium ${
                  warningData.containsInappropriateContent
                    ? "text-red-500"
                    : "text-green-500"
                }`}>
                {warningData.containsInappropriateContent
                  ? "Detected"
                  : "Not Detected"}
              </span>
            </div>
            <div className="mt-2">
              <span className="block mb-1 font-medium">Reason:</span>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                {warningData.reason}
              </p>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const warningColor = getWarningColor();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className={`relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[85vh] overflow-hidden ${
              warningColor === "red"
                ? "border-2 border-red-500"
                : warningColor === "yellow"
                ? "border-2 border-yellow-500"
                : "border-2 border-orange-500"
            }`}
            onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div
              className={`relative p-3 text-center ${
                warningColor === "red"
                  ? "bg-red-50 dark:bg-red-900/20"
                  : warningColor === "yellow"
                  ? "bg-yellow-50 dark:bg-yellow-900/20"
                  : "bg-orange-50 dark:bg-orange-900/20"
              }`}>
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                disabled={warningStatus.isTerminated}>
                <X className="w-4 h-4 text-gray-500" />
              </button>

              {/* Warning Icon */}
              <div className="flex justify-center mb-2">{getWarningIcon()}</div>

              {/* Warning Title */}
              <h2
                className={`text-lg font-bold mb-1 ${
                  warningColor === "red"
                    ? "text-red-700 dark:text-red-300"
                    : warningColor === "yellow"
                    ? "text-yellow-700 dark:text-yellow-300"
                    : "text-orange-700 dark:text-orange-300"
                }`}>
                {getWarningTitle()}
              </h2>
            </div>

            {/* Content */}
            <div className="p-4 max-h-[50vh] overflow-y-auto">
              {/* Warning Message */}
              <div className="mb-4">
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed text-center">
                  {warningData.message || getWarningMessage()}
                </p>
              </div>

              {/* Warning Details */}
              {getWarningDetails()}

              {/* Warning Type */}
              {warningData.warningType && (
                <div className="mt-3 p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Warning Type:</span>{" "}
                    {warningData.warningType
                      ?.replace("_", " ")
                      .replace(/\b\w/g, (l: string) => l.toUpperCase())}
                  </p>
                  {warningData.severity && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      <span className="font-medium">Severity:</span>{" "}
                      {warningData.severity?.charAt(0).toUpperCase() +
                        warningData.severity?.slice(1)}
                    </p>
                  )}
                </div>
              )}

              {/* Next Steps */}
              {!warningStatus.isTerminated && (
                <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="text-xs font-medium text-blue-900 dark:text-blue-100 mb-2">
                    Next Steps:
                  </h4>
                  <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
                    <li>
                      • Maintain professional language throughout the interview
                    </li>
                    <li>
                      • Focus on providing relevant and constructive answers
                    </li>
                    <li>
                      • Remember this is a professional assessment environment
                    </li>
                    {warningStatus.warningCount === 1 && (
                      <li className="font-medium text-red-600 dark:text-red-400">
                        • Another warning will result in interview termination
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 pt-0">
              {warningStatus.isTerminated ? (
                <div className="space-y-3">
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <h4 className="text-sm font-semibold text-red-900 dark:text-red-100 mb-2">
                      Interview Terminated
                    </h4>
                    <p className="text-xs text-red-800 dark:text-red-200 leading-relaxed">
                      Your interview has been terminated due to repeated
                      violations of professional conduct guidelines. This
                      incident will be permanently recorded in your profile and
                      may affect future interview opportunities.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      // Clear all interview-related localStorage data
                      localStorage.removeItem("interview-terminated");
                      localStorage.removeItem("interview-termination-reason");
                      localStorage.removeItem("interview-termination-time");
                      localStorage.removeItem("interview-warning-count");
                      localStorage.removeItem("interview-last-warning");
                      localStorage.removeItem("interview-warning-seen");
                      onClose();
                    }}
                    className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium text-sm transition-colors shadow-lg hover:shadow-xl">
                    Acknowledge & Exit Interview
                  </button>
                </div>
              ) : (
                <button
                  onClick={onClose}
                  className={`w-full px-4 py-3 rounded-lg font-medium text-sm transition-colors shadow-lg hover:shadow-xl ${
                    warningColor === "yellow"
                      ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                      : "bg-orange-600 hover:bg-orange-700 text-white"
                  }`}>
                  I Understand - Continue Interview
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WarningModal;
