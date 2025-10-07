import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Eye, Info, Star, Play, Square, AlertCircle, RotateCcw } from "lucide-react";
import Image from "next/image";
import AiImage from "../../../../../public/images/ai_image.jpeg";
import VideoAvatar from "@/components/interview/video-avatar";
import type { Interviewer } from "@/lib/api/interviewer";
import type { AudioData, QuestionData } from "../../types/interview.types";

interface VideoOverlaysProps {
  isDarkMode: boolean;
  isRecording: boolean;
  isInterviewStarted: boolean;
  interviewerData: Interviewer | null;
  isLoadingInterviewerData: boolean;
  onInterviewerClick: () => void;
  isRecordingState: boolean;
  isSpeechInitializing: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  isListening: boolean;
  speechRecognitionError: string | null;
  retrySpeechRecognition: () => void;
  showHint: boolean;
  onHintToggle: () => void;
  currentQuestionData: QuestionData;
  isAudioPlaying: boolean;
  currentAudio: AudioData | null;
  selectedAvatarVideoSrc?: string;
  onAvatarClick: () => void;
  isAnalyzing: boolean;
  showSubtitles: boolean;
  webkitInterimTranscript: string;
  speechDisabled: boolean;
}

export const VideoOverlays: React.FC<VideoOverlaysProps> = ({
  isDarkMode,
  isRecording,
  isInterviewStarted,
  interviewerData,
  isLoadingInterviewerData,
  onInterviewerClick,
  isRecordingState,
  isSpeechInitializing,
  onStartRecording,
  onStopRecording,
  isListening,
  speechRecognitionError,
  retrySpeechRecognition,
  showHint,
  onHintToggle,
  currentQuestionData,
  isAudioPlaying,
  currentAudio,
  selectedAvatarVideoSrc,
  onAvatarClick,
  isAnalyzing,
  showSubtitles,
  webkitInterimTranscript,
  speechDisabled,
}) => {
  return (
    <>
      {/* Recording Indicator */}
      {isRecording && (
        <div className="absolute top-4 left-4 flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-white text-xs bg-red-500 px-2 py-1 rounded">
            REC
          </span>
        </div>
      )}

      {/* Transparent Interviewer Info Overlay */}
      {isInterviewStarted && (
        <div
          className="absolute top-4 left-4 flex items-center space-x-3 bg-black/20 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl border border-white/10 cursor-pointer transition-all duration-200 hover:bg-black/30 hover:scale-105"
          onClick={(e) => {
            e.stopPropagation();
            console.log("👤 Interviewer tab clicked, opening modal...");
            onInterviewerClick();
          }}
          title="Click to view detailed interviewer information">
          {/* AI Profile Image */}
          <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20">
            {(() => {
              // Validate avatar URL
              const isValidUrl = (url: string) => {
                try {
                  new URL(url);
                  return true;
                } catch {
                  return false;
                }
              };

              const hasValidAvatar =
                interviewerData?.avatar &&
                typeof interviewerData.avatar === "string" &&
                interviewerData.avatar.length > 0 &&
                interviewerData.avatar.trim() !== "" &&
                !interviewerData.avatar.includes("ED") &&
                (interviewerData.avatar.startsWith("http") ||
                  interviewerData.avatar.startsWith("/") ||
                  isValidUrl(interviewerData.avatar));

              if (hasValidAvatar) {
                return (
                  <Image
                    src={interviewerData.avatar}
                    alt={interviewerData.name || "AI Interviewer"}
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.warn(
                        "Failed to load interviewer avatar:",
                        interviewerData.avatar
                      );
                      // Fallback to default image on error
                      e.currentTarget.src = AiImage.src;
                    }}
                  />
                );
              } else {
                return (
                  <Image
                    src={AiImage}
                    alt="AI Interviewer"
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                  />
                );
              }
            })()}
          </div>

          {/* Interviewer Info */}
          <div className="text-white">
            <div className="text-sm font-medium">
              {isLoadingInterviewerData ? (
                <div className="animate-pulse bg-white/20 h-4 w-24 rounded"></div>
              ) : (
                interviewerData?.name || "Test Interviewer"
              )}
            </div>
            <div className="text-xs opacity-80 flex items-center space-x-2">
              {isLoadingInterviewerData ? (
                <div className="animate-pulse bg-white/20 h-3 w-32 rounded"></div>
              ) : (
                <>
                  {/* Rating */}
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs font-medium text-white/90">
                      {interviewerData?.rating || 4.5}
                    </span>
                  </div>
                  <span>
                    Total Interviews:{" "}
                    {interviewerData?.numberOfInterviewers || 12}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Click indicator */}
          <Info className="w-3 h-3 text-white/60 opacity-60" />
        </div>
      )}

      {/* Start Answering Button - Bottom Left */}
      <div className="absolute bottom-4 left-4">
        {!isRecordingState ? (
          <motion.button
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStartRecording}
            disabled={isSpeechInitializing}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 font-bold text-xs shadow-lg ${
              isSpeechInitializing
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white hover:shadow-blue-500/25"
            }`}>
            <Play className="w-4 h-4" />
            <span>
              {isSpeechInitializing ? "Initializing..." : "Start Answering"}
            </span>
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStopRecording}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-xl transition-all duration-300 font-bold text-xs shadow-lg hover:shadow-red-500/25">
            <Square className="w-4 h-4" />
            <span>{isListening ? "Stop Listening" : "Stop Answering"}</span>
          </motion.button>
        )}
      </div>

      {/* Speech Recognition Error Display - Completely hidden during interview mode */}
      {false && speechRecognitionError && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute bottom-20 left-4 right-4 bg-red-500/90 backdrop-blur-sm rounded-lg p-3 border border-red-400/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-white" />
              <p className="text-white text-sm font-medium">
                {speechRecognitionError}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={retrySpeechRecognition}
              className="flex items-center space-x-1 px-3 py-1 bg-white/20 hover:bg-white/30 text-white rounded-md transition-all duration-200 text-xs font-medium">
              <RotateCcw className="w-3 h-3" />
              <span>Retry</span>
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* View Hint Button - Top Right */}
      <div className="absolute top-4 right-4 z-10">
        <motion.button
          whileHover={{ scale: 1.05, y: -1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onHintToggle}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 shadow-lg backdrop-blur-md ${
            showHint
              ? isDarkMode
                ? "bg-gradient-to-r from-yellow-500 to-yellow-400 text-yellow-900 shadow-yellow-500/25 hover:shadow-yellow-500/40"
                : "bg-gradient-to-r from-yellow-400 to-yellow-300 text-yellow-900 shadow-yellow-400/25 hover:shadow-yellow-400/40"
              : isDarkMode
              ? "bg-slate-800/80 text-white border border-slate-600/50 hover:bg-slate-700/80 hover:border-slate-500/50"
              : "bg-white/80 text-slate-800 border border-slate-200/50 hover:bg-slate-50/80 hover:border-slate-300/50"
          }`}>
          <Eye className={`w-4 h-4 ${showHint ? "animate-pulse" : ""}`} />
          <span className="font-bold">
            {showHint ? "Hide Copilot" : "AI Copilot"}
          </span>
        </motion.button>
      </div>

      {/* Hint Overlay */}
      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute inset-6 flex items-center justify-center pointer-events-auto">
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.2 }}
              className={`max-w-3xl mx-4 p-6 rounded-2xl shadow-2xl ${
                isDarkMode
                  ? "bg-black/30 text-white backdrop-blur-sm border border-white/20"
                  : "bg-white/30 text-slate-900 backdrop-blur-sm border border-black/20"
              }`}>
              <div className="flex items-center justify-between mb-3">
                <h3
                  className={`text-lg font-semibold flex items-center space-x-2 ${
                    isDarkMode ? "text-yellow-300" : "text-yellow-600"
                  }`}>
                  <Eye className="w-5 h-5 animate-pulse" />
                  <span>AI Copilot Assistant</span>
                </h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onHintToggle}
                  className={`p-1 rounded-full transition-colors ${
                    isDarkMode
                      ? "hover:bg-white/20 text-white/80 hover:text-white"
                      : "hover:bg-black/20 text-slate-600 hover:text-slate-900"
                  }`}>
                  <X className="w-4 h-4" />
                </motion.button>
              </div>
              <div
                className={`text-sm leading-relaxed mb-3 ${
                  isDarkMode ? "text-white/90" : "text-slate-800"
                }`}>
                {currentQuestionData.answer}
              </div>
              <div className="flex items-center justify-between">
                <div
                  className={`text-xs px-2 py-1 rounded-full flex items-center space-x-1 ${
                    isDarkMode
                      ? "bg-yellow-500/30 text-yellow-200"
                      : "bg-yellow-200/50 text-yellow-800"
                  }`}>
                  <span>🤖</span>
                  <span>AI Assistant</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onHintToggle}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    isDarkMode
                      ? "bg-white/20 hover:bg-white/30 text-white"
                      : "bg-black/20 hover:bg-black/30 text-slate-800"
                  }`}>
                  Got it
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtitle Overlay - Shows at bottom center of video */}
      {showSubtitles && webkitInterimTranscript && !speechDisabled && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-sm rounded-lg px-6 py-3 border border-white/20">
          <p className="text-white text-lg font-medium text-center leading-relaxed">
            {webkitInterimTranscript}
          </p>
        </motion.div>
      )}

      {/* AI Speaking Indicator - Bottom Right */}
      <div className="absolute bottom-2 right-2">
        <VideoAvatar
          isSpeaking={isAudioPlaying}
          isListening={isRecordingState && isListening}
          isAnalyzing={isAnalyzing}
          currentAudio={currentAudio}
          videoSrc={selectedAvatarVideoSrc}
          onClick={onAvatarClick}
        />
      </div>
    </>
  );
};
