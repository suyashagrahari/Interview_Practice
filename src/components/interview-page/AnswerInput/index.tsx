import React from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";

interface AnswerInputProps {
  isDarkMode: boolean;
  userAnswer: string;
  setUserAnswer: (value: string) => void;
  isGeneratingQuestion: boolean;
  isSubmittingAnswer: boolean;
  currentQuestion: any; // Use proper InterviewQuestion type
  isRecording: boolean;
  isListening: boolean;
  onSubmit: () => void;
}

export const AnswerInput: React.FC<AnswerInputProps> = ({
  isDarkMode,
  userAnswer,
  setUserAnswer,
  isGeneratingQuestion,
  isSubmittingAnswer,
  currentQuestion,
  isRecording,
  isListening,
  onSubmit,
}) => {
  return (
    <div
      className={`relative rounded-2xl shadow-lg transition-all duration-300 ${
        isDarkMode
          ? "bg-slate-800/90 border border-slate-600/30 focus-within:border-blue-500/50"
          : "bg-white/90 border border-slate-300/30 focus-within:border-blue-500/50"
      } ${
        userAnswer.trim()
          ? isDarkMode
            ? "ring-2 ring-green-500/30 border-green-500/50 bg-slate-800/95"
            : "ring-2 ring-green-500/30 border-green-500/50 bg-white/95"
          : ""
      } ${
        isRecording && isListening
          ? "ring-2 ring-blue-500/30 border-blue-500/50"
          : ""
      }`}>
      <div className="px-2">
        {/* Content Indicator */}
        {userAnswer.trim() && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="flex items-center justify-between px-2 py-1 mb-2">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                ✨ Answer ready to send
              </span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {userAnswer.length} characters
            </div>
          </motion.div>
        )}

        {/* Input Field */}
        <div className="pr-20">
          <textarea
            placeholder={
              isGeneratingQuestion
                ? "Generating question..."
                : isRecording
                ? "Your speech will appear here... Click 'Send & Stop' to submit and stop recording..."
                : "Type your answer here or click 'Start Answering' to speak..."
            }
            rows={4}
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            disabled={
              isGeneratingQuestion || isSubmittingAnswer || !currentQuestion
            }
            className={`w-full text-sm resize-none focus:outline-none transition-all duration-300 py-3 px-2 leading-relaxed ${
              isDarkMode
                ? "bg-transparent text-white placeholder-slate-400"
                : "bg-transparent text-slate-900 placeholder-slate-500"
            } ${
              isGeneratingQuestion || isSubmittingAnswer || !currentQuestion
                ? "opacity-50 cursor-not-allowed"
                : ""
            } ${
              isRecording && isListening
                ? "border-l-4 border-blue-500 pl-2"
                : ""
            }`}
          />
        </div>

        {/* Send Button - Bottom Right */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onSubmit}
          disabled={
            isGeneratingQuestion ||
            isSubmittingAnswer ||
            !currentQuestion ||
            !userAnswer.trim()
          }
          className={`absolute bottom-3 right-3 px-4 py-2 rounded-xl transition-all duration-300 flex items-center justify-center space-x-1 font-bold ${
            isGeneratingQuestion ||
            isSubmittingAnswer ||
            !currentQuestion ||
            !userAnswer.trim()
              ? "opacity-50 cursor-not-allowed bg-slate-500"
              : userAnswer.trim()
              ? isDarkMode
                ? "bg-gradient-to-r from-green-600 to-green-500 text-white hover:from-green-500 hover:to-green-400 shadow-lg hover:shadow-green-500/25"
                : "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-400 hover:to-green-500 shadow-lg hover:shadow-green-500/25"
              : isDarkMode
              ? "bg-blue-500/10 border border-blue-400 text-blue-400 hover:bg-blue-500/20 hover:border-blue-300 hover:text-blue-300"
              : "bg-blue-500/10 border border-blue-500 text-blue-500 hover:bg-blue-500/20 hover:border-blue-400 hover:text-blue-400"
          }`}>
          {isSubmittingAnswer ? (
            <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <span className="text-xs font-bold">
                {isRecording ? "Send & Stop" : "Send"}
              </span>
              <Send className="w-3 h-3" />
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
};
