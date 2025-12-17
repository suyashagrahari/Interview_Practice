import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle } from "lucide-react";

interface ExitConfirmModalProps {
  isOpen: boolean;
  isDarkMode: boolean;
  isGeneratingQuestion: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ExitConfirmModal: React.FC<ExitConfirmModalProps> = ({
  isOpen,
  isDarkMode,
  isGeneratingQuestion,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className={`rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl border-2 ${
            isDarkMode
              ? "bg-slate-800/90 backdrop-blur-sm border-slate-600"
              : "bg-white/90 backdrop-blur-sm border-slate-200"
          }`}>
          <div className="text-center">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                isDarkMode ? "bg-red-500/20" : "bg-red-100"
              }`}>
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h3
              className={`text-xl font-bold mb-2 ${
                isDarkMode ? "text-white" : "text-slate-900"
              }`}>
              Are you sure to end the interview?
            </h3>
            <p
              className={`mb-6 ${
                isDarkMode ? "text-slate-300" : "text-slate-600"
              }`}>
              If you end the interview now, you won't be able to continue this
              interview again.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={onCancel}
                className={`flex-1 px-4 py-3 border-2 rounded-xl transition-all duration-200 font-medium ${
                  isDarkMode
                    ? "border-slate-600 text-slate-300 hover:bg-slate-700/90 backdrop-blur-sm"
                    : "border-slate-300 text-slate-700 hover:bg-slate-100/90 backdrop-blur-sm"
                }`}>
                No
              </button>
              <button
                onClick={onConfirm}
                disabled={isGeneratingQuestion}
                className={`flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-xl transition-all duration-200 font-medium shadow-lg ${
                  isGeneratingQuestion ? "opacity-50 cursor-not-allowed" : ""
                }`}>
                {isGeneratingQuestion ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Ending...</span>
                  </div>
                ) : (
                  "Yes, Sure"
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
