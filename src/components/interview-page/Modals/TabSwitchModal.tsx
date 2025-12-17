import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle } from "lucide-react";

interface TabSwitchModalProps {
  isOpen: boolean;
  isDarkMode: boolean;
  tabSwitchCount: number;
  onClose: () => void;
}

export const TabSwitchModal: React.FC<TabSwitchModalProps> = ({
  isOpen,
  isDarkMode,
  tabSwitchCount,
  onClose,
}) => {
  if (!isOpen || tabSwitchCount !== 1) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
        onClick={onClose}>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className={`rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl border-2 relative ${
            isDarkMode
              ? "bg-slate-800/95 backdrop-blur-sm border-yellow-500"
              : "bg-white/95 backdrop-blur-sm border-yellow-500"
          }`}>
          {/* Close button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
            className={`absolute top-4 right-4 p-2 rounded-full hover:bg-opacity-20 transition-colors ${
              isDarkMode ? "hover:bg-white" : "hover:bg-gray-200"
            }`}>
            <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
          </button>
          <div className="text-center">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                isDarkMode ? "bg-yellow-500/20" : "bg-yellow-100"
              }`}>
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
            </div>
            <h3
              className={`text-xl font-bold mb-2 ${
                isDarkMode ? "text-white" : "text-slate-900"
              }`}>
              Warning!
            </h3>
            <p
              className={`mb-6 ${
                isDarkMode ? "text-slate-300" : "text-slate-600"
              }`}>
              You are not allowed to switch tabs during the interview. Please
              stay focused on the interview tab to ensure a smooth experience.
            </p>
            <div
              className={`p-4 rounded-lg mb-6 ${
                isDarkMode
                  ? "bg-yellow-500/10 border border-yellow-500/30"
                  : "bg-yellow-50 border border-yellow-200"
              }`}>
              <p
                className={`text-sm font-medium ${
                  isDarkMode ? "text-yellow-400" : "text-yellow-600"
                }`}>
                ⚠️ Tab switches detected: {tabSwitchCount}
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onClose();
                }}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-500 hover:to-yellow-600 text-white rounded-xl transition-all duration-200 font-medium shadow-lg">
                I Understand - Continue
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
