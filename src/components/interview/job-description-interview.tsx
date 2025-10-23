"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";
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
  ChevronDown,
  AlertCircle,
  Edit3,
  Save,
  Clipboard,
} from "lucide-react";
import {
  getIncompleteInterview,
  clearInterviewState,
} from "@/lib/interview-persistence";
import { interviewRealtimeApi } from "@/lib/api/interview-realtime";
import { JobDescriptionBasedInterviewApiService } from "@/lib/api/interview-types";
import { useInterviewers } from "@/hooks/useInterviewers";

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
  const [isStartingInterview, setIsStartingInterview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // JD-specific states
  const [showPasteMode, setShowPasteMode] = useState(false);
  const [jdText, setJdText] = useState("");
  const [jdOptions, setJdOptions] = useState<string[]>([]);
  const [jdSearchTerm, setJdSearchTerm] = useState("");
  const [showJdDropdown, setShowJdDropdown] = useState(false);
  const [showJdNameWarning, setShowJdNameWarning] = useState(false);
  const [isJdNameSubmitted, setIsJdNameSubmitted] = useState(false);
  const [selectedJdId, setSelectedJdId] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch interviewers from API
  const {
    data: interviewers = [],
    isLoading: isLoadingInterviewers,
    error: interviewersError,
  } = useInterviewers();

  const [formData, setFormData] = useState({
    jdName: "",
    jobTitle: "",
    companyName: "",
    experienceLevel: "intermediate",
    interviewType: "technical",
    level: "3-4",
    difficultyLevel: "intermediate",
    jobRole: "",
    selectedJd: "",
    duration: "30",
    scheduled: false,
    scheduledDate: "",
    scheduledTime: "",
    interviewerId: "",
    interviewer: {
      name: "",
      numberOfInterviewers: 1,
      experience: "",
      bio: "",
      introduction: "",
    },
    jobDescriptionText: "",
  });

  const handleInputChange = (field: string, value: any) => {
    // Ensure value is never undefined or null
    let safeValue: any = "";
    if (typeof value === "string") {
      safeValue = value;
    } else if (typeof value === "boolean") {
      safeValue = value;
    } else if (Array.isArray(value)) {
      safeValue = value;
    } else if (value !== undefined && value !== null) {
      safeValue = String(value);
    }

    setFormData((prev) => ({
      ...prev,
      [field]: safeValue,
    }));
  };

  // Safe wrapper for all input changes
  const safeHandleInputChange = (field: string, value: any) => {
    try {
      handleInputChange(field, value);
    } catch (error) {
      console.error("Error in handleInputChange:", error);
      // Fallback to empty string
      setFormData((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleJdNameChange = (value: string) => {
    // Ensure value is always a string
    const safeValue = typeof value === "string" ? value : "";
    setFormData((prev) => ({
      ...prev,
      jdName: safeValue,
    }));

    // Clear warning when user starts typing
    if (showJdNameWarning) {
      setShowJdNameWarning(false);
    }
  };

  const handleJdNameSubmit = async () => {
    // Ensure jdName is always a string
    const jdName = typeof formData.jdName === "string" ? formData.jdName : "";
    if (!jdName.trim()) {
      setShowJdNameWarning(true);
      return;
    }

    if (!uploadedFile && !jdText.trim()) {
      setShowJdNameWarning(true);
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90; // Stop at 90% until actual upload completes
          }
          return prev + 10;
        });
      }, 200);

      // Simulate JD upload/creation
      await new Promise((resolve) => setTimeout(resolve, 1000));

      clearInterval(progressInterval);
      setUploadProgress(100);

      // Add the new JD name to options if it doesn't exist
      if (!jdOptions.includes(jdName)) {
        setJdOptions((prev) => [...prev, jdName]);
      }

      // Store the JD ID for later use (simulated)
      setSelectedJdId(`jd-${Date.now()}`);

      // Set the selected JD to the entered name
      setFormData((prev) => ({
        ...prev,
        selectedJd: jdName,
      }));
      setJdSearchTerm(jdName);
      setShowJdNameWarning(false);

      // Enable all form fields after JD name is submitted
      setIsJdNameSubmitted(true);

      console.log("JD created with custom name:", jdName);
    } catch (error: any) {
      console.error("Error creating JD with custom name:", error);
      setShowJdNameWarning(true);
      alert(error.message || "Failed to create JD. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleJdSelection = async (jdName: string) => {
    // Ensure jdName is always a string
    const safeJdName = typeof jdName === "string" ? jdName : "";

    // Simulate getting JD data
    try {
      // Simulate API call to get JD data
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Set the selected JD
      setFormData((prev) => ({
        ...prev,
        selectedJd: safeJdName,
      }));
      setJdSearchTerm(safeJdName);
      setShowJdDropdown(false);

      // Store the JD ID (simulated)
      setSelectedJdId(`jd-${safeJdName.replace(/\s+/g, "-").toLowerCase()}`);

      console.log("JD selected:", safeJdName);
    } catch (error) {
      console.error("Error selecting JD:", error);
    }
  };

  const togglePasteMode = () => {
    setShowPasteMode(!showPasteMode);
    if (showPasteMode) {
      // Clear text when switching back to upload mode
      setJdText("");
    }
  };

  const handleInterviewerSelection = (interviewerId: string) => {
    console.log("Interviewer selected:", interviewerId);

    // Find the selected interviewer
    const selectedInterviewer = interviewers.find(
      (interviewer) => interviewer._id === interviewerId
    );

    if (selectedInterviewer) {
      // Update form data with interviewer details
      setFormData((prev) => ({
        ...prev,
        interviewerId: interviewerId,
        interviewer: {
          name: selectedInterviewer.name,
          numberOfInterviewers: selectedInterviewer.numberOfInterviewers,
          experience: selectedInterviewer.experience,
          bio: selectedInterviewer.bio,
          introduction: selectedInterviewer.introduction,
        },
      }));

      console.log("Interviewer details populated:", {
        name: selectedInterviewer.name,
        numberOfInterviewers: selectedInterviewer.numberOfInterviewers,
        experience: selectedInterviewer.experience,
        bio: selectedInterviewer.bio,
      });
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
      ];
      if (!allowedTypes.includes(file.type)) {
        alert(
          "Invalid file type. Please upload a PDF, DOC, DOCX, or TXT file."
        );
        return;
      }

      // Validate file size (5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        alert("File size exceeds 5MB limit.");
        return;
      }

      // Just store the file, don't upload yet
      setUploadedFile(file);
      setFormData((prev) => ({
        ...prev,
        jdName: file.name.replace(/\.[^/.]+$/, ""), // Set default name from filename
      }));
    }
  };

  const handleStartInterview = async () => {
    // Check required fields based on whether JD is uploaded or selected
    const hasJdContent = (uploadedFile && isJdNameSubmitted) || selectedJdId;
    const hasRequiredFields =
      formData.interviewType &&
      formData.level &&
      formData.jobRole &&
      formData.difficultyLevel &&
      formData.interviewerId;

    if (!hasJdContent || !hasRequiredFields) {
      alert(
        "Please complete all required fields: JD content, Interview Type, Experience Level, Job Role, Difficulty Level, and Interviewer."
      );
      return;
    }

    // If onStartInterview prop is provided, use it (this will check for incomplete interviews)
    if (onStartInterview) {
      // Prepare interview data from form
      const interviewData = {
        jobTitle: formData.jobTitle || formData.jdName,
        companyName: formData.companyName || "Company",
        experienceLevel: formData.experienceLevel,
        interviewType: "job-description",
        level: formData.level,
        difficultyLevel: formData.difficultyLevel,
        jobRole: formData.jobRole,
        interviewerId: formData.interviewerId,
        jobDescriptionText: jdText || formData.jobDescriptionText,
      };
      onStartInterview(interviewData);
      return;
    }

    setIsStartingInterview(true);

    try {
      // Prepare interview data for job description-based interview
      const interviewData = {
        jobTitle: formData.jobTitle.trim() || formData.jdName.trim(),
        companyName: formData.companyName.trim() || "Company",
        experienceLevel: formData.experienceLevel,
        interviewType: formData.interviewType as "technical" | "behavioral",
        level: formData.level,
        difficultyLevel: formData.difficultyLevel as
          | "beginner"
          | "intermediate"
          | "expert",
        jobRole: formData.jobRole.trim(),
        interviewerId: formData.interviewerId.trim(),
        interviewer: {
          name: formData.interviewer.name.trim(),
          numberOfInterviewers: formData.interviewer.numberOfInterviewers,
          experience: formData.interviewer.experience.trim(),
          bio: formData.interviewer.bio.trim(),
          introduction: formData.interviewer.introduction?.trim() || "",
        },
        jobDescriptionText: jdText.trim() || formData.jobDescriptionText.trim(),
        scheduled: formData.scheduled,
        scheduledDate: formData.scheduledDate || undefined,
        scheduledTime: formData.scheduledTime || undefined,
      };

      // Start the job description-based interview
      const response =
        await JobDescriptionBasedInterviewApiService.startInterview(
          interviewData
        );

      if (response.success) {
        // Redirect to interview page with the interview ID
        window.location.href = `/interview?type=job-description&interviewId=${response.data.interviewId}`;
      } else {
        alert(
          response.message || "Failed to start interview. Please try again."
        );
      }
    } catch (error: any) {
      console.error("Error starting interview:", error);
      alert(error.message || "Failed to start interview. Please try again.");
    } finally {
      setIsStartingInterview(false);
    }
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

    // Initialize with some sample JD options
    setJdOptions([
      "Software Engineer - Frontend",
      "Full Stack Developer - React/Node",
      "Backend Developer - Python/Django",
      "Data Scientist - Machine Learning",
      "DevOps Engineer - AWS/Kubernetes",
      "Product Manager - Tech",
      "UI/UX Designer - Mobile Apps",
      "QA Engineer - Automation",
      "Tech Lead - Engineering",
      "System Architect - Cloud",
    ]);
  }, []);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        !target.closest("[data-jd-dropdown]")
      ) {
        setShowJdDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter JD options based on search term
  const filteredJdOptions = jdOptions.filter((option) =>
    option.toLowerCase().includes(jdSearchTerm.toLowerCase())
  );

  // Update dropdown position for portal-based dropdown
  const updateDropdownPosition = () => {
    if (dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  };

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
                        Job Description
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Upload, paste, or write job description to get targeted
                        interview questions
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Upload/Paste Area */}
                    <div className="space-y-3">
                      {!showPasteMode ? (
                        // Upload Mode
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="border-2 border-dashed border-gray-300 dark:border-white/20 rounded-lg p-6 text-center hover:border-blue-400 dark:hover:border-blue-400 transition-colors duration-200 cursor-pointer group relative">
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
                                    style={{
                                      width: `${uploadProgress}%`,
                                    }}></div>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  {uploadProgress}% complete
                                </p>
                              </div>
                            </div>
                          ) : uploadedFile ? (
                            <div className="space-y-3">
                              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto">
                                <FileText className="w-6 h-6 text-yellow-500" />
                              </div>
                              <div>
                                <p className="text-base font-medium text-gray-900 dark:text-white">
                                  {uploadedFile.name}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {(uploadedFile.size / 1024 / 1024).toFixed(2)}{" "}
                                  MB
                                </p>
                                <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                                  Enter JD name and click "Add" to upload
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
                                  PDF, DOC, DOCX, TXT (max 5MB)
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Paste JD Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              togglePasteMode();
                            }}
                            className="absolute bottom-2 right-2 px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-200 flex items-center space-x-1">
                            <Clipboard className="w-3 h-3" />
                            <span>Paste JD</span>
                          </button>
                        </div>
                      ) : (
                        // Paste Mode
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                              Paste or Write Job Description
                            </h3>
                            <button
                              onClick={togglePasteMode}
                              className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                              Switch to Upload
                            </button>
                          </div>
                          <textarea
                            value={jdText}
                            onChange={(e) => setJdText(e.target.value)}
                            placeholder="Paste or write your job description here..."
                            className="w-full h-32 px-3 py-2 text-sm border border-gray-300 dark:border-white/20 rounded-lg bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                          />
                        </div>
                      )}

                      {/* JD Name Input - Always visible */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          JD Name <span className="text-red-500">*</span>
                        </label>
                        {!uploadedFile && !jdText.trim() ? (
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value=""
                              disabled
                              placeholder="Upload a file or paste JD content first to enable this field"
                              className="flex-1 px-3 py-2 text-sm border border-gray-200 dark:border-white/10 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 placeholder-gray-400 dark:placeholder-gray-500 cursor-not-allowed"
                            />
                            <button
                              disabled
                              className="px-4 py-2 text-sm font-medium rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed flex items-center space-x-1">
                              <CheckCircle className="w-4 h-4" />
                              <span>Add</span>
                            </button>
                          </div>
                        ) : (uploadedFile || jdText.trim()) &&
                          !isJdNameSubmitted ? (
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={formData.jdName || ""}
                              onChange={(e) => {
                                const value = e.target.value || "";
                                handleJdNameChange(value);
                              }}
                              placeholder="Enter unique JD name"
                              disabled={isJdNameSubmitted}
                              className={`flex-1 px-3 py-2 text-sm border rounded-lg bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                                showJdNameWarning
                                  ? "border-red-500 focus:ring-red-500"
                                  : isJdNameSubmitted
                                  ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                                  : "border-gray-300 dark:border-white/20 focus:ring-blue-500"
                              } ${
                                isJdNameSubmitted ? "cursor-not-allowed" : ""
                              }`}
                              onKeyPress={(e) => {
                                if (e.key === "Enter" && !isJdNameSubmitted) {
                                  handleJdNameSubmit();
                                }
                              }}
                            />
                            {!isJdNameSubmitted ? (
                              <motion.button
                                onClick={handleJdNameSubmit}
                                disabled={
                                  !formData.jdName.trim() || isUploading
                                }
                                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center space-x-1 ${
                                  formData.jdName.trim() && !isUploading
                                    ? "bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg"
                                    : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                                }`}
                                whileHover={{
                                  scale:
                                    formData.jdName.trim() && !isUploading
                                      ? 1.02
                                      : 1,
                                }}
                                whileTap={{
                                  scale:
                                    formData.jdName.trim() && !isUploading
                                      ? 0.98
                                      : 1,
                                }}>
                                {isUploading ? (
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                ) : (
                                  <CheckCircle className="w-4 h-4" />
                                )}
                                <span>{isUploading ? "Adding..." : "Add"}</span>
                              </motion.button>
                            ) : (
                              <div className="flex items-center px-3 py-2 text-green-600 dark:text-green-400">
                                <CheckCircle className="w-4 h-4 mr-1" />
                                <span className="text-sm font-medium">
                                  Added
                                </span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={formData.jdName || ""}
                              disabled
                              className="flex-1 px-3 py-2 text-sm border border-green-500 rounded-lg bg-green-50 dark:bg-green-900/20 text-gray-900 dark:text-white cursor-not-allowed"
                            />
                            <div className="flex items-center px-3 py-2 text-green-600 dark:text-green-400">
                              <CheckCircle className="w-4 h-4 mr-1" />
                              <span className="text-sm font-medium">
                                Uploaded
                              </span>
                            </div>
                          </div>
                        )}
                        {showJdNameWarning && (
                          <p className="text-xs text-red-500 mt-1 flex items-center">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Please enter a JD name before proceeding
                          </p>
                        )}
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
                            value={formData.interviewType || "technical"}
                            onChange={(e) =>
                              safeHandleInputChange(
                                "interviewType",
                                e.target.value || ""
                              )
                            }
                            disabled={
                              !!(uploadedFile && !isJdNameSubmitted) &&
                              !selectedJdId
                            }
                            className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                              uploadedFile &&
                              !isJdNameSubmitted &&
                              !selectedJdId
                                ? "border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                                : "border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:ring-blue-500"
                            }`}>
                            <option value="technical">
                              Technical Interview
                            </option>
                            <option value="behavioral">
                              Behavioral Interview
                            </option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Experience Level{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={formData.level || "3-4"}
                            onChange={(e) =>
                              safeHandleInputChange(
                                "level",
                                e.target.value || ""
                              )
                            }
                            disabled={
                              !!(uploadedFile && !isJdNameSubmitted) &&
                              !selectedJdId
                            }
                            className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                              uploadedFile &&
                              !isJdNameSubmitted &&
                              !selectedJdId
                                ? "border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                                : "border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:ring-blue-500"
                            }`}>
                            <option value="0-2">0-2 years</option>
                            <option value="3-4">3-4 years</option>
                            <option value="5-6">5-6 years</option>
                            <option value="7-8">7-8 years</option>
                            <option value="9-10">9-10 years</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Job Role <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={formData.jobRole || ""}
                            onChange={(e) =>
                              safeHandleInputChange(
                                "jobRole",
                                e.target.value || ""
                              )
                            }
                            disabled={
                              !!(uploadedFile && !isJdNameSubmitted) &&
                              !selectedJdId
                            }
                            className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                              uploadedFile &&
                              !isJdNameSubmitted &&
                              !selectedJdId
                                ? "border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                                : "border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:ring-blue-500"
                            }`}>
                            <option value="">Select job role</option>
                            <option value="frontend-developer">
                              Frontend Developer
                            </option>
                            <option value="backend-developer">
                              Backend Developer
                            </option>
                            <option value="full-stack-developer">
                              Full Stack Developer
                            </option>
                            <option value="mobile-developer">
                              Mobile Developer
                            </option>
                            <option value="data-scientist">
                              Data Scientist
                            </option>
                            <option value="devops-engineer">
                              DevOps Engineer
                            </option>
                            <option value="software-engineer">
                              Software Engineer
                            </option>
                            <option value="product-manager">
                              Product Manager
                            </option>
                            <option value="ui-ux-designer">
                              UI/UX Designer
                            </option>
                            <option value="qa-engineer">QA Engineer</option>
                            <option value="system-architect">
                              System Architect
                            </option>
                            <option value="tech-lead">Tech Lead</option>
                            <option value="engineering-manager">
                              Engineering Manager
                            </option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Difficulty Level{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={formData.difficultyLevel || "intermediate"}
                            onChange={(e) =>
                              safeHandleInputChange(
                                "difficultyLevel",
                                e.target.value || ""
                              )
                            }
                            disabled={
                              !!(uploadedFile && !isJdNameSubmitted) &&
                              !selectedJdId
                            }
                            className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                              uploadedFile &&
                              !isJdNameSubmitted &&
                              !selectedJdId
                                ? "border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                                : "border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:ring-blue-500"
                            }`}>
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="expert">Expert</option>
                          </select>
                        </div>
                      </div>

                      {/* JD Selection Dropdown */}
                      <div className="relative jd-dropdown-container">
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Select JD <span className="text-red-500">*</span>
                        </label>
                        <div className="relative" ref={dropdownRef}>
                          <input
                            type="text"
                            value={jdSearchTerm || ""}
                            onChange={(e) => {
                              const value = e.target.value || "";
                              setJdSearchTerm(value);
                              setShowJdDropdown(true);
                              updateDropdownPosition();
                            }}
                            onFocus={() => {
                              setShowJdDropdown(true);
                              updateDropdownPosition();
                            }}
                            placeholder="Search or select JD"
                            disabled={
                              !!(uploadedFile && !isJdNameSubmitted) &&
                              !selectedJdId
                            }
                            className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                              uploadedFile &&
                              !isJdNameSubmitted &&
                              !selectedJdId
                                ? "border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                                : "border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:ring-blue-500"
                            }`}
                          />
                          {selectedJdId && (
                            <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
                              <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                                <CheckCircle className="w-4 h-4" />
                                <span className="text-xs font-medium">
                                  Selected
                                </span>
                              </div>
                            </div>
                          )}
                          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        </div>
                      </div>

                      {/* Schedule Option */}
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="schedule"
                          checked={formData.scheduled}
                          onChange={(e) =>
                            safeHandleInputChange("scheduled", e.target.checked)
                          }
                          disabled={
                            !!(uploadedFile && !isJdNameSubmitted) &&
                            !selectedJdId
                          }
                          className={`w-3 h-3 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 ${
                            uploadedFile && !isJdNameSubmitted && !selectedJdId
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        />
                        <label
                          htmlFor="schedule"
                          className={`text-xs font-medium ${
                            uploadedFile && !isJdNameSubmitted && !selectedJdId
                              ? "text-gray-400 dark:text-gray-500"
                              : "text-gray-700 dark:text-gray-300"
                          }`}>
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
                              value={formData.scheduledDate || ""}
                              onChange={(e) =>
                                safeHandleInputChange(
                                  "scheduledDate",
                                  e.target.value || ""
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
                              value={formData.scheduledTime || ""}
                              onChange={(e) =>
                                safeHandleInputChange(
                                  "scheduledTime",
                                  e.target.value || ""
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
                <div
                  className={`bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-white/20 shadow-lg p-4 lg:p-6 transition-all duration-200 ${
                    uploadedFile && !isJdNameSubmitted && !selectedJdId
                      ? "opacity-50 pointer-events-none"
                      : ""
                  }`}>
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
                    {isLoadingInterviewers ? (
                      // Loading state
                      Array.from({ length: 5 }).map((_, index) => (
                        <div
                          key={index}
                          className="p-3 rounded-lg border-2 border-gray-200 dark:border-white/20 bg-gray-50 dark:bg-white/5 animate-pulse">
                          <div className="flex flex-col items-center space-y-2">
                            <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                            <div className="w-20 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                            <div className="w-16 h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
                          </div>
                        </div>
                      ))
                    ) : interviewersError ? (
                      // Error state
                      <div className="col-span-full p-6 text-center">
                        <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                          <User className="w-6 h-6 text-red-500" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          Failed to Load Interviewers
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                          {interviewersError.message ||
                            "Unable to load interviewers. Please try again."}
                        </p>
                        <button
                          onClick={() => window.location.reload()}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                          Retry
                        </button>
                      </div>
                    ) : interviewers.length === 0 ? (
                      // Empty state
                      <div className="col-span-full p-6 text-center">
                        <User className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          No Interviewers Available
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          There are currently no interviewers available. Please
                          try again later.
                        </p>
                      </div>
                    ) : (
                      // Interviewers list
                      interviewers.map((interviewer) => (
                        <motion.button
                          key={interviewer._id}
                          onClick={() =>
                            handleInterviewerSelection(interviewer._id || "")
                          }
                          disabled={
                            !!(uploadedFile && !isJdNameSubmitted) &&
                            !selectedJdId
                          }
                          className={`p-3 rounded-lg border-2 transition-all duration-200 text-left hover:scale-105 ${
                            formData.interviewerId === interviewer._id
                              ? "border-blue-500 bg-blue-50 dark:bg-blue-500/20 shadow-lg"
                              : "border-gray-200 dark:border-white/20 hover:border-blue-300 dark:hover:border-blue-400"
                          } ${
                            uploadedFile && !isJdNameSubmitted && !selectedJdId
                              ? "opacity-50 cursor-not-allowed"
                              : ""
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
                      ))
                    )}
                  </div>
                </div>

                {/* Start Interview Button */}
                <div className="flex justify-center">
                  <motion.button
                    onClick={handleStartInterview}
                    disabled={
                      !((uploadedFile && isJdNameSubmitted) || selectedJdId) ||
                      !formData.interviewType ||
                      !formData.level ||
                      !formData.jobRole ||
                      !formData.difficultyLevel ||
                      !formData.interviewerId ||
                      isStartingInterview
                    }
                    className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2 ${
                      ((uploadedFile && isJdNameSubmitted) || selectedJdId) &&
                      formData.interviewType &&
                      formData.level &&
                      formData.jobRole &&
                      formData.difficultyLevel &&
                      formData.interviewerId &&
                      !isStartingInterview
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl"
                        : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                    }`}
                    whileHover={{
                      scale:
                        ((uploadedFile && isJdNameSubmitted) || selectedJdId) &&
                        formData.interviewType &&
                        formData.level &&
                        formData.jobRole &&
                        formData.difficultyLevel &&
                        formData.interviewerId &&
                        !isStartingInterview
                          ? 1.05
                          : 1,
                    }}
                    whileTap={{
                      scale:
                        ((uploadedFile && isJdNameSubmitted) || selectedJdId) &&
                        formData.interviewType &&
                        formData.level &&
                        formData.jobRole &&
                        formData.difficultyLevel &&
                        formData.interviewerId &&
                        !isStartingInterview
                          ? 0.95
                          : 1,
                    }}>
                    {isStartingInterview ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span className="text-base">Starting Interview...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5" />
                        <span className="text-base">
                          {formData.scheduled
                            ? "Schedule Interview"
                            : "Start Interview Now"}
                        </span>
                      </>
                    )}
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
                              (i) => i._id === formData.interviewerId
                            )?.name || "AI Assistant"}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {formData.duration || "30"}:00
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
                          {(formData.experienceLevel || "intermediate")
                            .charAt(0)
                            .toUpperCase() +
                            (formData.experienceLevel || "intermediate").slice(
                              1
                            )}{" "}
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
                            {formData.jobTitle || formData.jdName} at{" "}
                            {formData.companyName || "the company"}. Let's start
                            with your background.
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

      {/* Portal-based JD Dropdown */}
      {showJdDropdown &&
        isClient &&
        createPortal(
          <div
            data-jd-dropdown
            className="fixed z-[99999] bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/20 rounded-lg shadow-2xl max-h-48 overflow-y-auto"
            style={{
              top: dropdownPosition.top,
              left: dropdownPosition.left,
              width: dropdownPosition.width,
              zIndex: 99999,
            }}>
            {filteredJdOptions.length > 0 ? (
              filteredJdOptions.map((jdName, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleJdSelection(jdName);
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg flex items-center justify-between">
                  <span>{jdName}</span>
                  {formData.selectedJd === jdName && (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  )}
                </button>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                No JDs found
              </div>
            )}
          </div>,
          document.body
        )}
    </div>
  );
};

export default JobDescriptionInterview;
