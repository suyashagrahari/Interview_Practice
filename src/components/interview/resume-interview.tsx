"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
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
import { useInterviewers } from "@/hooks/useInterviewers";
import { ResumeApiService, InterviewApiService } from "@/lib/api";
import {
  getIncompleteInterview,
  clearInterviewState,
} from "@/lib/interview-persistence";
import { interviewRealtimeApi } from "@/lib/api/interview-realtime";

interface ResumeInterviewProps {
  onBack?: () => void;
  onStartInterview?: (formData?: any) => void;
}

const ResumeInterview = ({
  onBack,
  onStartInterview,
}: ResumeInterviewProps) => {
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
  const [hasActiveInterview, setHasActiveInterview] = useState(false);
  const [activeInterviewData, setActiveInterviewData] = useState<any>(null);

  // Form states - Initialize with all values as strings to prevent undefined
  const [formData, setFormData] = useState({
    resumeName: "",
    interviewType: "technical",
    level: "0-2",
    difficultyLevel: "beginner",
    jobRole: "",
    selectedResume: "",
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
    companyName: "",
    experienceLevel: "",
    skills: [] as string[],
    additionalNotes: "",
  });

  // Resume and interview states
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null);
  const [isStartingInterview, setIsStartingInterview] = useState(false);

  // Resume selection states
  const [resumeOptions, setResumeOptions] = useState([
    "Software Engineer Resume",
    "Frontend Developer Resume",
    "Backend Developer Resume",
    "Full Stack Developer Resume",
    "Data Scientist Resume",
  ]);
  const [resumeSearchTerm, setResumeSearchTerm] = useState("");
  const [showResumeDropdown, setShowResumeDropdown] = useState(false);
  const [showResumeNameWarning, setShowResumeNameWarning] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });
  const [isResumeNameSubmitted, setIsResumeNameSubmitted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch interviewers from API
  const {
    data: interviewers = [],
    isLoading: isLoadingInterviewers,
    error: interviewersError,
  } = useInterviewers();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!allowedTypes.includes(file.type)) {
        alert("Invalid file type. Please upload a PDF, DOC, or DOCX file.");
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
        resumeName: file.name.replace(/\.[^/.]+$/, ""), // Set default name from filename
      }));
    }
  };

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

  const handleResumeNameChange = (value: string) => {
    // Ensure value is always a string
    const safeValue = typeof value === "string" ? value : "";
    setFormData((prev) => ({
      ...prev,
      resumeName: safeValue,
    }));

    // Clear warning when user starts typing
    if (showResumeNameWarning) {
      setShowResumeNameWarning(false);
    }
  };

  const handleResumeNameSubmit = async () => {
    // Ensure resumeName is always a string
    const resumeName =
      typeof formData.resumeName === "string" ? formData.resumeName : "";
    if (!resumeName.trim()) {
      setShowResumeNameWarning(true);
      return;
    }

    if (!uploadedFile) {
      setShowResumeNameWarning(true);
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

      // Upload the file with the custom resume name
      const response = await ResumeApiService.uploadResume({
        resume: uploadedFile,
        resumeName: resumeName.trim(),
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      // Add the new resume name to options if it doesn't exist
      if (!resumeOptions.includes(resumeName)) {
        setResumeOptions((prev) => [...prev, resumeName]);
      }

      // Store the resume ID for later use
      setSelectedResumeId(response.data.id);

      // Set the selected resume to the entered name
      setFormData((prev) => ({
        ...prev,
        selectedResume: resumeName,
      }));
      setResumeSearchTerm(resumeName);
      setShowResumeNameWarning(false);

      // Enable all form fields after resume name is submitted
      setIsResumeNameSubmitted(true);

      console.log("Resume uploaded with custom name:", response.data);
    } catch (error: any) {
      console.error("Error uploading resume with custom name:", error);
      setShowResumeNameWarning(true);
      alert(error.message || "Failed to upload resume. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleResumeSelection = async (resumeName: string) => {
    // Ensure resumeName is always a string
    const safeResumeName = typeof resumeName === "string" ? resumeName : "";

    // Get resume ID from stored data
    let resumeData = (window as any).resumeData;

    // If resume data is not available, fetch it
    if (!resumeData || !resumeData[safeResumeName]) {
      console.log("Resume data not found, fetching...");
      try {
        const response = await ResumeApiService.getUserResumes();
        if (response.success && response.data) {
          resumeData = response.data.reduce(
            (acc: Record<string, string>, resume: any) => {
              acc[resume.resumeName] = resume.id;
              return acc;
            },
            {} as Record<string, string>
          );
          (window as any).resumeData = resumeData;
        }
      } catch (error) {
        console.error("Error fetching resume details:", error);
      }
    }

    if (resumeData && resumeData[safeResumeName]) {
      setSelectedResumeId(resumeData[safeResumeName]);
      console.log("Selected resume ID:", resumeData[safeResumeName]);
    } else {
      console.warn("Resume ID not found for:", safeResumeName);
      console.log("Available resumes:", resumeData);
    }

    setFormData((prev) => ({
      ...prev,
      selectedResume: safeResumeName,
    }));
    setResumeSearchTerm(safeResumeName);
    // Small delay to ensure the selection is processed before closing
    setTimeout(() => {
      setShowResumeDropdown(false);
    }, 100);
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

  const filteredResumeOptions = resumeOptions.filter((option) =>
    option.toLowerCase().includes(resumeSearchTerm.toLowerCase())
  );

  const handleStartInterview = async () => {
    console.log("Starting interview with:", {
      selectedResumeId,
      selectedResume: formData.selectedResume,
      resumeSearchTerm,
    });

    // Check if resume is selected and resume ID is available
    if (!selectedResumeId) {
      alert(
        "Please select a resume from the dropdown or upload a new one first."
      );
      return;
    }

    // Check required fields
    if (!formData.jobRole.trim() || !formData.interviewerId.trim()) {
      alert(
        "Please fill in all required fields (Job Role and Interviewer ID)."
      );
      return;
    }

    // Check interviewer selection
    if (!formData.interviewerId.trim()) {
      alert("Please select an interviewer first.");
      return;
    }

    // If onStartInterview prop is provided, use it (this will check for incomplete interviews)
    if (onStartInterview) {
      // Prepare interview data from form
      const interviewData = {
        resumeId: selectedResumeId,
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
      };
      onStartInterview(interviewData);
      return;
    }

    setIsStartingInterview(true);

    try {
      // Prepare interview data
      const interviewData = {
        resumeId: selectedResumeId,
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
        companyName: formData.companyName.trim() || undefined,
        experienceLevel: formData.experienceLevel.trim() || undefined,
        skills: formData.skills.length > 0 ? formData.skills : undefined,
        additionalNotes: formData.additionalNotes.trim() || undefined,
        scheduled: formData.scheduled,
        scheduledDate: formData.scheduledDate || undefined,
        scheduledTime: formData.scheduledTime || undefined,
      };

      // Start the interview
      const response = await InterviewApiService.startInterview(interviewData);

      if (response.success) {
        // Redirect to interview page with the interview ID
        window.location.href = `/interview?type=resume&interviewId=${response.data.interviewId}`;
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

  // Load user's existing resumes
  const loadUserResumes = async () => {
    try {
      const response = await ResumeApiService.getUserResumes();
      const userResumes = response.data.map((resume) => resume.resumeName);
      setResumeOptions((prev) => {
        const combined = [...new Set([...prev, ...userResumes])];
        return combined;
      });

      // Store resume data for easy access
      const resumeData = response.data.reduce((acc, resume) => {
        acc[resume.resumeName] = resume.id;
        return acc;
      }, {} as Record<string, string>);

      // Store in a ref or state for later use
      (window as any).resumeData = resumeData;
      console.log("Loaded user resumes:", userResumes);
      console.log("Resume data mapping:", resumeData);
    } catch (error) {
      console.error("Error loading user resumes:", error);
      // Don't show error to user as this is not critical
    }
  };

  // Set client state to prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
    // Ensure resumeSearchTerm is always a string on mount
    if (typeof resumeSearchTerm !== "string") {
      setResumeSearchTerm("");
    }
    // Load user's existing resumes
    loadUserResumes();
  }, []);

  // Close resume dropdown when clicking outside and update position
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // Don't close if clicking on the dropdown container or the portal dropdown
      if (
        !target.closest(".resume-dropdown-container") &&
        !target.closest("[data-resume-dropdown]")
      ) {
        setShowResumeDropdown(false);
      }
    };

    if (showResumeDropdown) {
      updateDropdownPosition();
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("scroll", updateDropdownPosition);
      window.addEventListener("resize", updateDropdownPosition);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        window.removeEventListener("scroll", updateDropdownPosition);
        window.removeEventListener("resize", updateDropdownPosition);
      };
    }
  }, [showResumeDropdown]);

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

    if (!isClient) return;

    // Initial check
    checkActiveInterview();

    // Set up periodic check every 10 seconds
    const intervalId = setInterval(() => {
      checkActiveInterview();
    }, 10000);

    // Check when window/tab gains focus (user comes back to the page)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkActiveInterview();
      }
    };

    const handleFocus = () => {
      checkActiveInterview();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);

    // Cleanup
    return () => {
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
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
        className="sticky top-0 z-40 py-2 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-white/20 shadow-sm">
        <div className="max-w-7xl mx-auto ">
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
                                {uploadProgress < 100
                                  ? "Uploading & Parsing..."
                                  : "Processing..."}
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
                        ) : uploadedFile && isResumeNameSubmitted ? (
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
                                Enter resume name and click "Add" to upload
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

                      {/* Resume Name Input - Always visible */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Resume Name <span className="text-red-500">*</span>
                        </label>
                        {!uploadedFile ? (
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value=""
                              disabled
                              placeholder="Upload a resume first to enable this field"
                              className="flex-1 px-3 py-2 text-sm border border-gray-200 dark:border-white/10 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 placeholder-gray-400 dark:placeholder-gray-500 cursor-not-allowed"
                            />
                            <button
                              disabled
                              className="px-4 py-2 text-sm font-medium rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed flex items-center space-x-1">
                              <CheckCircle className="w-4 h-4" />
                              <span>Add</span>
                            </button>
                          </div>
                        ) : uploadedFile && !isResumeNameSubmitted ? (
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={formData.resumeName || ""}
                              onChange={(e) => {
                                const value = e.target.value || "";
                                handleResumeNameChange(value);
                              }}
                              placeholder="Enter unique resume name"
                              disabled={isResumeNameSubmitted}
                              className={`flex-1 px-3 py-2 text-sm border rounded-lg bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                                showResumeNameWarning
                                  ? "border-red-500 focus:ring-red-500"
                                  : isResumeNameSubmitted
                                  ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                                  : "border-gray-300 dark:border-white/20 focus:ring-blue-500"
                              } ${
                                isResumeNameSubmitted
                                  ? "cursor-not-allowed"
                                  : ""
                              }`}
                              onKeyPress={(e) => {
                                if (
                                  e.key === "Enter" &&
                                  !isResumeNameSubmitted
                                ) {
                                  handleResumeNameSubmit();
                                }
                              }}
                            />
                            {!isResumeNameSubmitted ? (
                              <motion.button
                                onClick={handleResumeNameSubmit}
                                disabled={
                                  !formData.resumeName.trim() || isUploading
                                }
                                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center space-x-1 ${
                                  formData.resumeName.trim() && !isUploading
                                    ? "bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg"
                                    : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                                }`}
                                whileHover={{
                                  scale:
                                    formData.resumeName.trim() && !isUploading
                                      ? 1.02
                                      : 1,
                                }}
                                whileTap={{
                                  scale:
                                    formData.resumeName.trim() && !isUploading
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
                              value={formData.resumeName || ""}
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
                        {showResumeNameWarning && (
                          <p className="text-xs text-red-500 mt-1 flex items-center">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Please enter a resume name before proceeding
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
                              !!(uploadedFile && !isResumeNameSubmitted)
                            }
                            className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                              uploadedFile && !isResumeNameSubmitted
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
                            value={formData.level || "0-2"}
                            onChange={(e) =>
                              safeHandleInputChange(
                                "level",
                                e.target.value || ""
                              )
                            }
                            disabled={
                              !!(uploadedFile && !isResumeNameSubmitted)
                            }
                            className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                              uploadedFile && !isResumeNameSubmitted
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
                              !!(uploadedFile && !isResumeNameSubmitted)
                            }
                            className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                              uploadedFile && !isResumeNameSubmitted
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
                            value={formData.difficultyLevel || "beginner"}
                            onChange={(e) =>
                              safeHandleInputChange(
                                "difficultyLevel",
                                e.target.value || ""
                              )
                            }
                            disabled={
                              !!(uploadedFile && !isResumeNameSubmitted)
                            }
                            className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                              uploadedFile && !isResumeNameSubmitted
                                ? "border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                                : "border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:ring-blue-500"
                            }`}>
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="expert">Expert</option>
                          </select>
                        </div>
                      </div>

                      {/* Resume Selection Dropdown */}
                      <div className="relative resume-dropdown-container">
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Select Resume <span className="text-red-500">*</span>
                        </label>
                        <div className="relative" ref={dropdownRef}>
                          <input
                            type="text"
                            value={resumeSearchTerm || ""}
                            onChange={(e) => {
                              const value = e.target.value || "";
                              setResumeSearchTerm(value);
                              setShowResumeDropdown(true);
                            }}
                            onFocus={() => setShowResumeDropdown(true)}
                            placeholder="Search or select resume"
                            disabled={
                              !!(uploadedFile && !isResumeNameSubmitted)
                            }
                            className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                              uploadedFile && !isResumeNameSubmitted
                                ? "border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                                : "border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:ring-blue-500"
                            }`}
                          />
                          {selectedResumeId && (
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
                          disabled={!!(uploadedFile && !isResumeNameSubmitted)}
                          className={`w-3 h-3 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 ${
                            uploadedFile && !isResumeNameSubmitted
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        />
                        <label
                          htmlFor="schedule"
                          className={`text-xs font-medium ${
                            uploadedFile && !isResumeNameSubmitted
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
                    uploadedFile && !isResumeNameSubmitted
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
                        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
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
                          disabled={!!(uploadedFile && !isResumeNameSubmitted)}
                          className={`p-3 rounded-lg border-2 transition-all duration-200 text-left hover:scale-105 ${
                            formData.interviewerId === interviewer._id
                              ? "border-blue-500 bg-blue-50 dark:bg-blue-500/20 shadow-lg"
                              : "border-gray-200 dark:border-white/20 hover:border-blue-300 dark:hover:border-blue-400"
                          } ${
                            uploadedFile && !isResumeNameSubmitted
                              ? "cursor-not-allowed"
                              : ""
                          }`}
                          whileHover={{
                            scale: !(uploadedFile && !isResumeNameSubmitted)
                              ? 1.02
                              : 1,
                          }}
                          whileTap={{
                            scale: !(uploadedFile && !isResumeNameSubmitted)
                              ? 0.98
                              : 1,
                          }}>
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
                      !formData.jobRole ||
                      !formData.interviewerId ||
                      isStartingInterview
                    }
                    className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2 ${
                      formData.jobRole &&
                      formData.interviewerId &&
                      !isStartingInterview
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl"
                        : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                    }`}
                    whileHover={{
                      scale:
                        formData.jobRole &&
                        formData.interviewerId &&
                        !isStartingInterview
                          ? 1.05
                          : 1,
                    }}
                    whileTap={{
                      scale:
                        formData.jobRole && formData.interviewerId ? 0.95 : 1,
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
                className="space-y-6 ">
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

      {/* Portal-based Resume Dropdown */}
      {showResumeDropdown &&
        isClient &&
        createPortal(
          <div
            data-resume-dropdown
            className="fixed z-[99999] bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/20 rounded-lg shadow-2xl max-h-48 overflow-y-auto"
            style={{
              top: dropdownPosition.top,
              left: dropdownPosition.left,
              width: dropdownPosition.width,
              zIndex: 99999,
            }}>
            {filteredResumeOptions.length > 0 ? (
              filteredResumeOptions.map((option, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleResumeSelection(option);
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg">
                  {option}
                </button>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                No resumes found
              </div>
            )}
          </div>,
          document.body
        )}
    </div>
  );
};

export default ResumeInterview;
