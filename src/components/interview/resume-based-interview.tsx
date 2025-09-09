"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Upload,
  FileText,
  User,
  Calendar,
  Clock,
  MapPin,
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  Award,
  Code,
  Globe,
  Linkedin,
  Github,
  Download,
  Edit3,
  Save,
  CheckCircle,
  AlertCircle,
  Play,
  Pause,
  Square,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Settings,
  Maximize2,
  Minimize2,
  X,
  ChevronDown,
  ChevronUp,
  Star,
  Target,
  Zap,
  Shield,
  Eye,
  EyeOff,
  Users,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";

interface ResumeBasedInterviewProps {
  onBack?: () => void;
}

const ResumeBasedInterview = ({ onBack }: ResumeBasedInterviewProps) => {
  const { user } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State management
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    resumeName: "",
    interviewType: "technical",
    level: "beginner",
    duration: "30",
    scheduled: false,
    scheduledDate: "",
    scheduledTime: "",
    interviewerId: "",
    companyName: "",
    jobTitle: "",
    experienceLevel: "",
    skills: [] as string[],
    additionalNotes: "",
  });

  // Mock interviewers data
  const interviewers = [
    {
      id: "1",
      name: "Sarah Chen",
      role: "Senior Developer",
      avatar: "SC",
      rating: 4.8,
      specialties: ["React", "Node.js", "System Design"],
      experience: "8 years",
    },
    {
      id: "2",
      name: "Mike Johnson",
      role: "Tech Lead",
      avatar: "MJ",
      rating: 4.9,
      specialties: ["Python", "AWS", "Architecture"],
      experience: "10 years",
    },
    {
      id: "3",
      name: "Emily Davis",
      role: "Engineering Manager",
      avatar: "ED",
      rating: 4.7,
      specialties: ["Leadership", "Product Management", "Agile"],
      experience: "12 years",
    },
    {
      id: "4",
      name: "Alex Kumar",
      role: "Full Stack Developer",
      avatar: "AK",
      rating: 4.6,
      specialties: ["JavaScript", "React", "MongoDB"],
      experience: "6 years",
    },
    {
      id: "5",
      name: "Lisa Wang",
      role: "Senior Engineer",
      avatar: "LW",
      rating: 4.8,
      specialties: ["Java", "Spring", "Microservices"],
      experience: "9 years",
    },
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      setUploadProgress(0);

      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsUploading(false);
            setUploadedFile(file);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleStartInterview = () => {
    // Redirect to full-screen interview page
    window.location.href = `/interview?type=resume`;
  };

  const handleBackToConfig = () => {
    setIsInterviewStarted(false);
  };

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleToggleRecording = () => {
    setIsRecording(!isRecording);
  };

  const handleToggleVideo = () => {
    setIsVideoOn(!isVideoOn);
  };

  const handleToggleMic = () => {
    setIsMicOn(!isMicOn);
  };

  // Set client state to prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-blue-900 dark:to-purple-900">
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
    <div className="h-full bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-blue-900 dark:to-purple-900">
      {/* Sticky Header */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-40 py-2 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-white/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Left Section - Profile Type Header */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                  Resume-Based Interview
                </h1>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {user?.firstName
                    ? `${user.firstName}'s Professional Interview Session`
                    : "Mock Interview Session - Resume Analysis"}
                </p>
              </div>
            </div>

            {/* Right Section - Back Button */}
            <div className="flex items-center space-x-3">
              {/* Status Indicator */}
              <div className="hidden md:flex items-center space-x-2 px-2 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-600 dark:text-gray-300">
                  {isInterviewStarted ? "Interview Active" : "Ready to Start"}
                </span>
              </div>

              {/* Video Controls - Only show in interview mode */}
              {isInterviewStarted && (
                <div className="hidden sm:flex items-center space-x-2">
                  <motion.button
                    onClick={handleToggleVideo}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 ${
                      isVideoOn
                        ? "bg-green-500 hover:bg-green-600 text-white"
                        : "bg-red-500 hover:bg-red-600 text-white"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}>
                    {isVideoOn ? (
                      <Video className="w-5 h-5" />
                    ) : (
                      <VideoOff className="w-5 h-5" />
                    )}
                  </motion.button>

                  <motion.button
                    onClick={handleToggleMic}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 ${
                      isMicOn
                        ? "bg-green-500 hover:bg-green-600 text-white"
                        : "bg-red-500 hover:bg-red-600 text-white"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}>
                    {isMicOn ? (
                      <Mic className="w-5 h-5" />
                    ) : (
                      <MicOff className="w-5 h-5" />
                    )}
                  </motion.button>
                </div>
              )}

              {/* Back Button */}
              <motion.button
                onClick={onBack || (() => router.back())}
                className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}>
                <ArrowLeft className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="h-[89vh] overflow-y-auto">
        <div className="p-4">
          <AnimatePresence mode="wait">
            {!isInterviewStarted ? (
              <motion.div
                key="configuration"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6">
                {/* Resume Upload Section */}
                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-white/20 shadow-lg p-4 lg:p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Upload className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Upload Your Resume
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Upload your resume to get personalized interview
                        questions
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Upload Area */}
                    <div className="space-y-3">
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-gray-300 dark:border-white/20 rounded-lg p-6 text-center hover:border-blue-400 dark:hover:border-blue-400 transition-colors duration-200 cursor-pointer group">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileUpload}
                          className="hidden"
                        />

                        {isUploading ? (
                          <div className="space-y-3">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto">
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                            </div>
                            <div>
                              <p className="text-base font-medium text-gray-900 dark:text-white">
                                Uploading...
                              </p>
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-2">
                                <div
                                  className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                                  style={{ width: `${uploadProgress}%` }}></div>
                              </div>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {uploadProgress}% complete
                              </p>
                            </div>
                          </div>
                        ) : uploadedFile ? (
                          <div className="space-y-3">
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
                              <CheckCircle className="w-6 h-6 text-green-500" />
                            </div>
                            <div>
                              <p className="text-base font-medium text-gray-900 dark:text-white">
                                {uploadedFile.name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {(uploadedFile.size / 1024 / 1024).toFixed(2)}{" "}
                                MB
                              </p>
                            </div>
                            <button
                              onClick={() => setUploadedFile(null)}
                              className="text-xs text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
                              Remove file
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto group-hover:bg-blue-100 dark:group-hover:bg-blue-900/20 transition-colors duration-200">
                              <Upload className="w-6 h-6 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
                            </div>
                            <div>
                              <p className="text-base font-medium text-gray-900 dark:text-white">
                                Click to upload or drag and drop
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                PDF, DOC, DOCX (max 5MB)
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Resume Name Input */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Resume Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.resumeName}
                          onChange={(e) =>
                            handleInputChange("resumeName", e.target.value)
                          }
                          placeholder="Enter unique resume name"
                          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-white/20 rounded-lg bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                    </div>

                    {/* Configuration Form */}
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Interview Type{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={formData.interviewType}
                            onChange={(e) =>
                              handleInputChange("interviewType", e.target.value)
                            }
                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-white/20 rounded-lg bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                            <option value="technical">
                              Technical Interview
                            </option>
                            <option value="behavioral">
                              Behavioral Interview
                            </option>
                            <option value="mixed">Mixed Interview</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Experience Level{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={formData.level}
                            onChange={(e) =>
                              handleInputChange("level", e.target.value)
                            }
                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-white/20 rounded-lg bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                            <option value="beginner">
                              Beginner (0-2 years)
                            </option>
                            <option value="intermediate">
                              Intermediate (2-5 years)
                            </option>
                            <option value="senior">Senior (5+ years)</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Duration <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={formData.duration}
                            onChange={(e) =>
                              handleInputChange("duration", e.target.value)
                            }
                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-white/20 rounded-lg bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                            <option value="15">15 minutes</option>
                            <option value="30">30 minutes</option>
                            <option value="45">45 minutes</option>
                            <option value="60">60 minutes</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Company (Optional)
                          </label>
                          <input
                            type="text"
                            value={formData.companyName}
                            onChange={(e) =>
                              handleInputChange("companyName", e.target.value)
                            }
                            placeholder="e.g., Google, Microsoft"
                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-white/20 rounded-lg bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          />
                        </div>
                      </div>

                      {/* Schedule Option */}
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="schedule"
                          checked={formData.scheduled}
                          onChange={(e) =>
                            handleInputChange("scheduled", e.target.checked)
                          }
                          className="w-3 h-3 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <label
                          htmlFor="schedule"
                          className="text-xs font-medium text-gray-700 dark:text-gray-300">
                          Schedule for later (Optional)
                        </label>
                      </div>

                      {formData.scheduled && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Date
                            </label>
                            <input
                              type="date"
                              value={formData.scheduledDate}
                              onChange={(e) =>
                                handleInputChange(
                                  "scheduledDate",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-white/20 rounded-lg bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Time
                            </label>
                            <input
                              type="time"
                              value={formData.scheduledTime}
                              onChange={(e) =>
                                handleInputChange(
                                  "scheduledTime",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-white/20 rounded-lg bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Interviewer Selection */}
                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-white/20 shadow-lg p-4 lg:p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Choose Your Interviewer
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Select an AI interviewer based on your preferences
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                    {interviewers.map((interviewer) => (
                      <motion.button
                        key={interviewer.id}
                        onClick={() =>
                          handleInputChange("interviewerId", interviewer.id)
                        }
                        className={`p-3 rounded-lg border-2 transition-all duration-200 text-left hover:scale-105 ${
                          formData.interviewerId === interviewer.id
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-500/20 shadow-lg"
                            : "border-gray-200 dark:border-white/20 hover:border-blue-300 dark:hover:border-blue-400"
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}>
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm mx-auto mb-2">
                          {interviewer.avatar}
                        </div>
                        <div className="text-center">
                          <div className="font-medium text-gray-900 dark:text-white text-xs mb-1">
                            {interviewer.name}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-300 mb-1">
                            {interviewer.role}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                            {interviewer.experience}
                          </div>
                          <div className="flex items-center justify-center space-x-1 mb-1">
                            <Star className="w-2.5 h-2.5 text-yellow-500 fill-yellow-500" />
                            <span className="text-xs text-gray-600 dark:text-gray-300">
                              {interviewer.rating}
                            </span>
                          </div>
                          <div className="text-xs text-blue-600 dark:text-blue-400 leading-tight">
                            {interviewer.specialties.slice(0, 2).join(", ")}
                            {interviewer.specialties.length > 2 && "..."}
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Start Interview Button */}
                <div className="flex justify-center">
                  <motion.button
                    onClick={handleStartInterview}
                    disabled={
                      !uploadedFile ||
                      !formData.resumeName ||
                      !formData.interviewerId
                    }
                    className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2 ${
                      uploadedFile &&
                      formData.resumeName &&
                      formData.interviewerId
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl"
                        : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                    }`}
                    whileHover={{
                      scale:
                        uploadedFile &&
                        formData.resumeName &&
                        formData.interviewerId
                          ? 1.05
                          : 1,
                    }}
                    whileTap={{
                      scale:
                        uploadedFile &&
                        formData.resumeName &&
                        formData.interviewerId
                          ? 0.95
                          : 1,
                    }}>
                    <Play className="w-5 h-5" />
                    <span className="text-base">
                      {formData.scheduled
                        ? "Schedule Interview"
                        : "Start Interview Now"}
                    </span>
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="interview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6">
                {/* Interview panel removed - redirects to full-screen page */}
                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-white/20 shadow-lg p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Play className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Interview Starting...
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Redirecting to full-screen interview experience
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ResumeBasedInterview;
