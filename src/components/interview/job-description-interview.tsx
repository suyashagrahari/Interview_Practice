"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Upload,
  CheckCircle,
  User,
  Star,
  Play,
  Square,
  ArrowLeft,
  Users,
  FileText,
  Building,
  Briefcase,
} from "lucide-react";
import {
  getIncompleteInterview,
  clearInterviewState,
} from "@/lib/interview-persistence";
import { interviewRealtimeApi } from "@/lib/api/interview-realtime";

interface JobDescriptionInterviewProps {
  onBack?: () => void;
  onStartInterview?: (formData?: any) => void;
}

const JobDescriptionInterview = ({
  onBack,
  onStartInterview,
}: JobDescriptionInterviewProps) => {
  const [isConfiguring, setIsConfiguring] = useState(true);
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [hasActiveInterview, setHasActiveInterview] = useState(false);
  const [activeInterviewData, setActiveInterviewData] = useState<any>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isClient, setIsClient] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    jobTitle: "",
    companyName: "",
    experienceLevel: "intermediate",
    interviewType: "technical",
    duration: "30",
    scheduled: false,
    scheduledDate: "",
    scheduledTime: "",
    interviewerId: "",
  });

  const interviewers = [
    {
      id: "1",
      name: "Sarah Chen",
      role: "Senior HR Manager",
      experience: "8+ years",
      rating: "4.9",
      avatar: "SC",
      specialties: ["HR", "Behavioral", "Leadership"],
    },
    {
      id: "2",
      name: "Michael Rodriguez",
      role: "Tech Lead",
      experience: "10+ years",
      rating: "4.8",
      avatar: "MR",
      specialties: ["Technical", "System Design", "Architecture"],
    },
    {
      id: "3",
      name: "Emily Johnson",
      role: "Product Manager",
      experience: "6+ years",
      rating: "4.7",
      avatar: "EJ",
      specialties: ["Product", "Strategy", "Analytics"],
    },
    {
      id: "4",
      name: "David Kim",
      role: "Engineering Manager",
      experience: "12+ years",
      rating: "4.9",
      avatar: "DK",
      specialties: ["Management", "Technical", "Team Building"],
    },
    {
      id: "5",
      name: "Lisa Wang",
      role: "Senior Developer",
      experience: "7+ years",
      rating: "4.6",
      avatar: "LW",
      specialties: ["Frontend", "React", "JavaScript"],
    },
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      setUploadProgress(0);

      // Simulate file upload progress
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

  const handleStartInterview = () => {
    // If onStartInterview prop is provided, use it (this will check for incomplete interviews)
    if (onStartInterview) {
      // Prepare interview data from form
      const interviewData = {
        jobTitle: formData.jobTitle,
        companyName: formData.companyName,
        experienceLevel: formData.experienceLevel,
        interviewType: "job-description",
        interviewerId: formData.interviewerId,
        duration: formData.duration,
      };
      onStartInterview(interviewData);
      return;
    }

    // Redirect to full-screen interview page
    window.location.href = `/interview?type=job-description`;
  };

  const handleBackToConfig = () => {
    setIsInterviewStarted(false);
    setIsConfiguring(true);
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

  // Check for active interviews
  useEffect(() => {
    const checkActiveInterview = async () => {
      try {
        // First check server for active interview
        const serverCheck = await interviewRealtimeApi.checkActiveInterview();

        if (
          serverCheck.success &&
          serverCheck.hasActiveInterview &&
          serverCheck.data
        ) {
          setHasActiveInterview(true);
          setActiveInterviewData(serverCheck.data);
          return;
        }

        // If server explicitly says no active interview, clear everything
        if (serverCheck.success && !serverCheck.hasActiveInterview) {
          setHasActiveInterview(false);
          setActiveInterviewData(null);
          // Clear localStorage as well to keep it in sync
          clearInterviewState();
          return;
        }

        // Fallback: Check localStorage only if server check failed
        const incomplete = getIncompleteInterview();
        if (incomplete.hasIncomplete && incomplete.data) {
          setHasActiveInterview(true);
          setActiveInterviewData(incomplete.data);
        } else {
          setHasActiveInterview(false);
          setActiveInterviewData(null);
        }
      } catch (error) {
        console.error("Error checking for active interview:", error);
        // Fallback to localStorage check
        const incomplete = getIncompleteInterview();
        if (incomplete.hasIncomplete && incomplete.data) {
          setHasActiveInterview(true);
          setActiveInterviewData(incomplete.data);
        } else {
          setHasActiveInterview(false);
          setActiveInterviewData(null);
        }
      }
    };

    if (isClient) {
      checkActiveInterview();
    }
  }, [isClient]);

  // Handler to show active interview modal
  const handleShowActiveInterviewModal = () => {
    if (onStartInterview) {
      // This will trigger the dashboard's incomplete interview modal
      onStartInterview();
    }
  };

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
        className="sticky top-0 z-40 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-white/20 shadow-sm  py-2">
        <div className="max-w-7xl mx-auto ">
          <div className="flex items-center justify-between h-14">
            {/* Left Section */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                  Job Description Interview
                </h1>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  Mock Interview Session - Job Description Analysis
                </p>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-3">
              {/* Status Indicator - Only show if there's an active interview */}
              {hasActiveInterview && (
                <div
                  className="hidden md:flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                  onClick={handleShowActiveInterviewModal}>
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-200">
                    Interview in Progress
                  </span>
                </div>
              )}

              {/* Video/Mic Controls - Only show when interview started */}
              {isInterviewStarted && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleToggleVideo}
                    className={`p-2 rounded-lg transition-colors ${
                      isVideoOn
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                    }`}>
                    <Users className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleToggleMic}
                    className={`p-2 rounded-lg transition-colors ${
                      isMicOn
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                    }`}>
                    <Users className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="h-full overflow-y-auto">
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
                {/* Job Description Upload Section */}
                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-white/20 shadow-lg p-4 lg:p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Upload Job Description
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Upload job description to get targeted interview
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
                          accept=".pdf,.doc,.docx,.txt"
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
                              <FileText className="w-6 h-6 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
                            </div>
                            <div>
                              <p className="text-base font-medium text-gray-900 dark:text-white">
                                Click to upload or drag and drop
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                PDF, DOC, DOCX, TXT (max 5MB)
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Job Title Input */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Job Title <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.jobTitle}
                          onChange={(e) =>
                            handleInputChange("jobTitle", e.target.value)
                          }
                          placeholder="e.g., Software Engineer, Product Manager"
                          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-white/20 rounded-lg bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                    </div>

                    {/* Configuration Form */}
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Company Name <span className="text-red-500">*</span>
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

                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Experience Level{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={formData.experienceLevel}
                            onChange={(e) =>
                              handleInputChange(
                                "experienceLevel",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-white/20 rounded-lg bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                            <option value="entry">
                              Entry Level (0-1 years)
                            </option>
                            <option value="intermediate">
                              Intermediate (2-5 years)
                            </option>
                            <option value="senior">Senior (5+ years)</option>
                            <option value="lead">
                              Lead/Principal (8+ years)
                            </option>
                          </select>
                        </div>
                      </div>

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
                            <option value="case">Case Study Interview</option>
                          </select>
                        </div>

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
                      !formData.jobTitle ||
                      !formData.companyName ||
                      !formData.interviewerId
                    }
                    className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2 ${
                      formData.jobTitle &&
                      formData.companyName &&
                      formData.interviewerId
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl"
                        : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                    }`}
                    whileHover={{
                      scale:
                        formData.jobTitle &&
                        formData.companyName &&
                        formData.interviewerId
                          ? 1.05
                          : 1,
                    }}
                    whileTap={{
                      scale:
                        formData.jobTitle &&
                        formData.companyName &&
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
                {/* Interview Interface */}
                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-white/20 shadow-lg p-4 lg:p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Interview Area */}
                    <div className="lg:col-span-2 space-y-4">
                      {/* Interview Header */}
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            Job Description Interview
                          </h2>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            AI Interviewer:{" "}
                            {interviewers.find(
                              (i) => i.id === formData.interviewerId
                            )?.name || "AI Assistant"}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {formData.duration}:00
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Time remaining
                          </p>
                        </div>
                      </div>

                      {/* Video Area */}
                      <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-6 text-center">
                        <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                          <FileText className="w-12 h-12 text-white" />
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 text-base">
                          AI Interviewer Ready
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Job description analyzed - Questions generated
                        </p>
                      </div>

                      {/* Interview Controls */}
                      <div className="flex flex-col sm:flex-row gap-3">
                        <motion.button
                          onClick={handleToggleRecording}
                          className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
                            isRecording
                              ? "bg-red-500 hover:bg-red-600 text-white"
                              : "bg-green-500 hover:bg-green-600 text-white"
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}>
                          {isRecording ? (
                            <Square className="w-4 h-4" />
                          ) : (
                            <Play className="w-4 h-4" />
                          )}
                          <span className="text-sm">
                            {isRecording ? "Stop Recording" : "Start Recording"}
                          </span>
                        </motion.button>

                        <motion.button
                          onClick={handleBackToConfig}
                          className="flex-1 px-4 py-2 border border-gray-300 dark:border-white/20 text-gray-700 dark:text-white font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-white/10 transition-all duration-200 flex items-center justify-center space-x-2"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}>
                          <ArrowLeft className="w-4 h-4" />
                          <span className="text-sm">Back to Configuration</span>
                        </motion.button>
                      </div>

                      {/* Interview Type Indicators */}
                      <div className="flex flex-wrap gap-2">
                        <div className="px-3 py-1.5 bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-200 rounded-lg text-xs font-medium">
                          {formData.experienceLevel.charAt(0).toUpperCase() +
                            formData.experienceLevel.slice(1)}{" "}
                          Level
                        </div>
                        <div className="px-3 py-1.5 bg-purple-100 dark:bg-purple-500/20 text-purple-800 dark:text-purple-200 rounded-lg text-xs font-medium">
                          {formData.interviewType.charAt(0).toUpperCase() +
                            formData.interviewType.slice(1)}{" "}
                          Interview
                        </div>
                        <div className="px-3 py-1.5 bg-green-100 dark:bg-green-500/20 text-green-800 dark:text-green-200 rounded-lg text-xs font-medium">
                          Job Description Based
                        </div>
                      </div>
                    </div>

                    {/* Sidebar - Interview Log */}
                    <div className="lg:col-span-1">
                      <h3 className="text-base font-bold text-gray-900 dark:text-white mb-3">
                        Interview Log
                      </h3>
                      <div className="space-y-2 max-h-80 overflow-y-auto">
                        <div className="p-2 bg-blue-50 dark:bg-blue-500/20 border border-blue-200 dark:border-blue-500/30 rounded-lg">
                          <div className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">
                            AI Interviewer
                          </div>
                          <div className="text-xs text-blue-800 dark:text-blue-200">
                            Hello! I've analyzed the job description for{" "}
                            {formData.jobTitle} at {formData.companyName}. Let's
                            start with your background.
                          </div>
                        </div>
                        <div className="p-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg">
                          <div className="text-xs text-gray-600 dark:text-gray-400 font-medium mb-1">
                            You
                          </div>
                          <div className="text-xs text-gray-800 dark:text-gray-200">
                            Ready to begin!
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default JobDescriptionInterview;
