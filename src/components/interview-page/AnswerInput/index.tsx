import React from "react";
import { motion } from "framer-motion";
import { Send, Mic, MicOff } from "lucide-react";

interface AnswerInputProps {
  isDarkMode: boolean;
  userAnswer: string;
  setUserAnswer: (value: string) => void;
  isGeneratingQuestion: boolean;
  isSubmittingAnswer: boolean;
  currentQuestion: any;
  isRecording: boolean;
  isListening: boolean;
  onSubmit: () => void;
  hasRecordedAudio?: boolean; // New prop to check if audio is recorded
}

export const AnswerInput: React.FC<AnswerInputProps> = ({
  isDarkMode,
  isGeneratingQuestion,
  isSubmittingAnswer,
  currentQuestion,
  isRecording,
  isListening,
  onSubmit,
  hasRecordedAudio = false,
}) => {
  return (
    <div className="w-full">
      {/* Voice Recording Status & Send Button Container */}
      <div
        className={`relative rounded-2xl shadow-lg transition-all duration-300 min-h-[80px] flex items-center justify-between px-6 py-4 ${
          isDarkMode
            ? "bg-slate-800/90 border border-slate-600/30"
            : "bg-white/90 border border-slate-300/30"
        } ${
          isRecording && isListening
            ? "ring-2 ring-blue-500/50 border-blue-500/50 bg-gradient-to-r from-blue-500/10 to-purple-500/10"
            : hasRecordedAudio
            ? "ring-2 ring-green-500/30 border-green-500/50"
            : ""
        }`}>
        {/* Left Side - Recording Status */}
        <div className="flex items-center gap-4 flex-1">
          {isRecording ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-3">
              {/* Pulsing Microphone Icon */}
              <div className="relative">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className={`absolute inset-0 rounded-full ${
                    isDarkMode ? "bg-red-500/30" : "bg-red-500/20"
                  }`}></motion.div>
                <Mic
                  className={`w-6 h-6 ${
                    isDarkMode ? "text-red-400" : "text-red-500"
                  }`}
                />
              </div>
              <div className="flex flex-col">
                <span
                  className={`text-sm font-semibold ${
                    isDarkMode ? "text-white" : "text-slate-900"
                  }`}>
                  Recording...
                </span>
                <span
                  className={`text-xs ${
                    isDarkMode ? "text-slate-400" : "text-slate-600"
                  }`}>
                  {isListening ? "Listening" : "Processing"}
                </span>
              </div>
            </motion.div>
          ) : hasRecordedAudio ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-3">
              <div
                className={`w-3 h-3 rounded-full ${
                  isDarkMode ? "bg-green-400" : "bg-green-500"
                } animate-pulse`}></div>
              <span
                className={`text-sm font-medium ${
                  isDarkMode ? "text-green-400" : "text-green-600"
                }`}>
                Voice recorded and ready to send
              </span>
            </motion.div>
          ) : (
            <div className="flex items-center gap-3">
              <MicOff
                className={`w-5 h-5 ${
                  isDarkMode ? "text-slate-500" : "text-slate-400"
                }`}
              />
              <span
                className={`text-sm ${
                  isDarkMode ? "text-slate-400" : "text-slate-600"
                }`}>
                {isGeneratingQuestion
                  ? "Generating question..."
                  : "Click 'Start Answering' to record your voice"}
              </span>
            </div>
          )}
        </div>

        {/* Right Side - Send Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onSubmit}
          disabled={
            isGeneratingQuestion ||
            isSubmittingAnswer ||
            !currentQuestion ||
            (!isRecording && !hasRecordedAudio)
          }
          className={`px-6 py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-semibold shadow-lg ${
            isGeneratingQuestion ||
            isSubmittingAnswer ||
            !currentQuestion ||
            (!isRecording && !hasRecordedAudio)
              ? "opacity-50 cursor-not-allowed bg-slate-500 text-white"
              : isRecording || hasRecordedAudio
              ? isDarkMode
                ? "bg-gradient-to-r from-green-600 to-emerald-500 text-white hover:from-green-500 hover:to-emerald-400 shadow-green-500/25"
                : "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-400 hover:to-emerald-500 shadow-green-500/25"
              : isDarkMode
              ? "bg-blue-500/10 border border-blue-400 text-blue-400 hover:bg-blue-500/20"
              : "bg-blue-500/10 border border-blue-500 text-blue-500 hover:bg-blue-500/20"
          }`}>
          {isSubmittingAnswer ? (
            <>
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm">Sending...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span className="text-sm">
                {isRecording ? "Send & Stop" : "Send Voice"}
              </span>
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
};
