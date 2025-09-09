"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Video,
  VideoOff,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Play,
  Pause,
  Square,
} from "lucide-react";
import InterviewGuidelinesModal from "@/components/interview/interview-guidelines-modal";

const InterviewPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isClient, setIsClient] = useState(false);
  const [isGuidelinesModalOpen, setIsGuidelinesModalOpen] = useState(true);
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(10);
  const [timeRemaining, setTimeRemaining] = useState(30 * 60); // 30 minutes in seconds
  const [interviewType, setInterviewType] = useState("");

  // Get interview type from URL params
  useEffect(() => {
    setIsClient(true);
    const type = searchParams.get("type") || "resume";
    setInterviewType(type);
  }, [searchParams]);

  // Timer countdown
  useEffect(() => {
    if (isInterviewStarted && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isInterviewStarted, timeRemaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleGuidelinesComplete = () => {
    setIsGuidelinesModalOpen(false);
    setIsInterviewStarted(true);
  };

  const handleToggleVideo = () => {
    setIsVideoOn(!isVideoOn);
  };

  const handleToggleMic = () => {
    setIsMicOn(!isMicOn);
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleStartRecording = () => {
    setIsRecording(true);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
  };

  const handleEndInterview = () => {
    setIsInterviewStarted(false);
    router.push("/dashboard");
  };

  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-blue-900 dark:to-purple-900">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Loading Interview
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Please wait while we prepare your interview...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-blue-900 dark:to-purple-900">
      {/* Guidelines Modal */}
      <InterviewGuidelinesModal
        isOpen={isGuidelinesModalOpen}
        onClose={() => setIsGuidelinesModalOpen(false)}
        onStartInterview={handleGuidelinesComplete}
      />

      {/* Main Interview Interface */}
      <div className="h-screen flex flex-col">
        {/* Main Content */}
        <div className="flex-1 flex">
          {/* Left Panel - Main Interview Area */}
          <div className="w-[70%] flex flex-col bg-white/30 dark:bg-slate-800/30 backdrop-blur-sm">
            {/* Interview Header */}
            <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border-b border-gray-200/30 dark:border-white/20 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                      Interviewer Name
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Total Interview Taken: 1,234
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {formatTime(timeRemaining)}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      It will go reduce as time spent
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Video Area */}
            <div className="flex-1 p-6">
              <div className="h-full flex flex-col">
                {/* Main Video Area - Split View */}
                <div className="flex-1 mb-4">
                  <div className="h-full grid grid-cols-2 gap-4">
                    {/* User Video */}
                    <div className="relative bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden shadow-lg">
                      {isVideoOn ? (
                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                          <div className="text-center">
                            <Users className="w-16 h-16 text-white mx-auto mb-3" />
                            <p className="text-white text-lg font-medium">
                              You
                            </p>
                            <p className="text-white/80 text-sm">Interviewee</p>
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                          <VideoOff className="w-16 h-16 text-gray-500 dark:text-gray-400" />
                        </div>
                      )}

                      {/* User Status */}
                      <div className="absolute top-3 left-3 px-2 py-1 bg-black/50 text-white text-xs rounded">
                        {isVideoOn ? "Video On" : "Video Off"}
                      </div>

                      {/* Recording Indicator */}
                      {isRecording && (
                        <div className="absolute top-3 right-3 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      )}
                    </div>

                    {/* AI Video */}
                    <div className="relative bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden shadow-lg">
                      <div className="w-full h-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                            <span className="text-white text-2xl font-bold">
                              AI
                            </span>
                          </div>
                          <p className="text-white text-lg font-medium">
                            AI Interviewer
                          </p>
                          <p className="text-white/80 text-sm">Sarah Chen</p>
                        </div>
                      </div>

                      {/* AI Status */}
                      <div className="absolute top-3 left-3 px-2 py-1 bg-green-500 text-white text-xs rounded">
                        AI Active
                      </div>

                      {/* AI Speaking Indicator */}
                      <div className="absolute bottom-3 right-3 flex space-x-1">
                        <div className="w-1 h-4 bg-white/60 rounded animate-pulse"></div>
                        <div
                          className="w-1 h-4 bg-white/60 rounded animate-pulse"
                          style={{ animationDelay: "0.2s" }}></div>
                        <div
                          className="w-1 h-4 bg-white/60 rounded animate-pulse"
                          style={{ animationDelay: "0.4s" }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Current Question */}
                <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-lg border border-gray-200/30 dark:border-white/20 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Question {currentQuestion}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span>2 minutes remaining</span>
                    </div>
                  </div>
                  <p className="text-gray-800 dark:text-gray-200 text-base leading-relaxed">
                    Tell me about yourself and walk me through your resume. What
                    are your key strengths and how do they align with this role?
                  </p>
                </div>

                {/* Subtitle Area */}
                <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-lg border border-gray-200/30 dark:border-white/20 mb-4">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Live Transcription
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    "I'm a software engineer with 3 years of experience in
                    full-stack development, specializing in React and
                    Node.js..."
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* Video Controls */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={handleToggleVideo}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                          isVideoOn
                            ? "bg-green-500 hover:bg-green-600 text-white"
                            : "bg-red-500 hover:bg-red-600 text-white"
                        }`}>
                        {isVideoOn ? (
                          <Video className="w-5 h-5" />
                        ) : (
                          <VideoOff className="w-5 h-5" />
                        )}
                      </button>

                      <button
                        onClick={handleToggleMic}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                          isMicOn
                            ? "bg-green-500 hover:bg-green-600 text-white"
                            : "bg-red-500 hover:bg-red-600 text-white"
                        }`}>
                        {isMicOn ? (
                          <Mic className="w-5 h-5" />
                        ) : (
                          <MicOff className="w-5 h-5" />
                        )}
                      </button>
                    </div>

                    {/* Recording Controls */}
                    {!isRecording ? (
                      <button
                        onClick={handleStartRecording}
                        className="flex items-center space-x-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all duration-200 font-medium">
                        <Play className="w-4 h-4" />
                        <span>Start Answering</span>
                      </button>
                    ) : (
                      <button
                        onClick={handleStopRecording}
                        className="flex items-center space-x-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-200 font-medium">
                        <Square className="w-4 h-4" />
                        <span>Stop Answering</span>
                      </button>
                    )}

                    <button
                      onClick={handleEndInterview}
                      className="px-6 py-3 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all duration-200 font-medium">
                      Exit Interview
                    </button>
                  </div>

                  {/* Interview Type Buttons */}
                  <div className="flex items-center space-x-2">
                    <button className="px-4 py-2 border-2 border-blue-500 text-blue-500 rounded-lg text-sm font-medium">
                      Entry Level
                    </button>
                    <button className="px-4 py-2 border-2 border-purple-500 text-purple-500 rounded-lg text-sm font-medium">
                      Technical Interview
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Chat */}
          <div className="w-[30%] bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-l border-gray-200/30 dark:border-white/20">
            <div className="h-full flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200/30 dark:border-white/20">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Interview Chat
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Real-time conversation log
                </p>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 p-4 space-y-3 overflow-y-auto">
                {/* AI Message */}
                <div className="flex justify-start">
                  <div className="max-w-xs bg-blue-50 dark:bg-blue-500/20 border border-blue-200 dark:border-blue-500/30 rounded-lg p-3">
                    <div className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">
                      AI Interviewer
                    </div>
                    <div className="text-sm text-blue-800 dark:text-blue-200">
                      Hello! I've analyzed your resume. Let's start with your
                      introduction. Tell me about yourself and your background.
                    </div>
                  </div>
                </div>

                {/* User Message */}
                <div className="flex justify-end">
                  <div className="max-w-xs bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                    <div className="text-xs text-gray-600 dark:text-gray-400 font-medium mb-1">
                      You
                    </div>
                    <div className="text-sm text-gray-800 dark:text-gray-200">
                      Thank you for having me. I'm a software engineer with 3
                      years of experience in full-stack development.
                    </div>
                  </div>
                </div>

                {/* AI Message */}
                <div className="flex justify-start">
                  <div className="max-w-xs bg-blue-50 dark:bg-blue-500/20 border border-blue-200 dark:border-blue-500/30 rounded-lg p-3">
                    <div className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">
                      AI Interviewer
                    </div>
                    <div className="text-sm text-blue-800 dark:text-blue-200">
                      Great! Can you walk me through a challenging project
                      you've worked on recently?
                    </div>
                  </div>
                </div>

                {/* User Message */}
                <div className="flex justify-end">
                  <div className="max-w-xs bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                    <div className="text-xs text-gray-600 dark:text-gray-400 font-medium mb-1">
                      You
                    </div>
                    <div className="text-sm text-gray-800 dark:text-gray-200">
                      I recently built a real-time chat application using React
                      and Node.js with WebSocket integration.
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Interview Features */}
              <div className="p-4 border-t border-gray-200/30 dark:border-white/20 space-y-3">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                  AI Features
                </h4>

                <div className="space-y-2">
                  <button className="w-full flex items-center space-x-2 px-3 py-2 bg-blue-50 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-500/30 transition-all duration-200">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">Ask AI Question</span>
                  </button>

                  <button className="w-full flex items-center space-x-2 px-3 py-2 bg-green-50 dark:bg-green-500/20 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-100 dark:hover:bg-green-500/30 transition-all duration-200">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm">Get Feedback</span>
                  </button>

                  <button className="w-full flex items-center space-x-2 px-3 py-2 bg-purple-50 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-500/30 transition-all duration-200">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">Hint</span>
                  </button>
                </div>
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-gray-200/30 dark:border-white/20">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-white/20 rounded-lg bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200">
                    <Users className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewPage;
