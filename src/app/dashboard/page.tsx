"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import ProfileContent from "@/components/profile/profile-content";
import SettingsContent from "@/components/settings/settings-content";
import {
  User,
  FileText,
  Briefcase,
  Building,
  Target,
  BarChart3,
  MessageSquare,
  Trophy,
  Settings,
  Play,
  Clock,
  Calendar,
  Upload,
  Edit3,
  Users,
  Star,
  CheckCircle,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Sun,
  Moon,
  Monitor,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

type InterviewLevel = "beginner" | "intermediate" | "expert";
type InterviewDuration = "15" | "30" | "45";

interface InterviewConfig {
  type: string;
  level: InterviewLevel;
  duration: InterviewDuration;
  scheduled: boolean;
  scheduledDate?: string;
  scheduledTime?: string;
  resumeName?: string;
  companyName?: string;
  topicName?: string;
  interviewerId?: string;
}

const Dashboard = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<string>("resume");
  const [isMockInterviewOpen, setIsMockInterviewOpen] = useState(true);
  const [interviewConfig, setInterviewConfig] = useState<InterviewConfig>({
    type: "resume",
    level: "beginner",
    duration: "30",
    scheduled: false,
  });

  const [isConfiguring, setIsConfiguring] = useState(true);
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isProfileSelected, setIsProfileSelected] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const closeProfile = () => {
    setIsProfileOpen(false);
    setIsProfileSelected(false);
  };

  const closeSettings = () => {
    setIsSettingsOpen(false);
    setIsProfileSelected(false);
  };
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Check for profile parameter and open profile automatically
  useEffect(() => {
    const profileParam = searchParams.get("profile");
    if (profileParam === "true") {
      setIsProfileOpen(true);
      setIsConfiguring(false);
      // Clean up the URL parameter
      const url = new URL(window.location.href);
      url.searchParams.delete("profile");
      window.history.replaceState({}, "", url.toString());
    }
  }, [searchParams]);

  const interviewTypes = [
    {
      id: "resume",
      label: "Resume Based",
      icon: FileText,
      description: "Interview based on your resume",
    },
    {
      id: "jobDescription",
      label: "Job Description Based",
      icon: Briefcase,
      description: "Interview based on job requirements",
    },
    {
      id: "topic",
      label: "Topic Based",
      icon: Target,
      description: "Interview on specific topics",
    },
    {
      id: "company",
      label: "Company Based",
      icon: Building,
      description: "Company-specific interview",
    },
  ];

  const levels = [
    { id: "beginner", label: "Beginner", description: "0-2 years experience" },
    {
      id: "intermediate",
      label: "Intermediate",
      description: "2-5 years experience",
    },
    { id: "expert", label: "Expert", description: "5+ years experience" },
  ];

  const durations = [
    { id: "15", label: "15 min", description: "Quick practice" },
    { id: "30", label: "30 min", description: "Standard session" },
    { id: "45", label: "45 min", description: "Comprehensive interview" },
  ];

  const interviewers = [
    {
      id: "1",
      name: "Sarah Chen",
      role: "Senior Developer",
      avatar: "SC",
      rating: 4.8,
    },
    {
      id: "2",
      name: "Mike Johnson",
      role: "Tech Lead",
      avatar: "MJ",
      rating: 4.9,
    },
    {
      id: "3",
      name: "Emily Davis",
      role: "Engineering Manager",
      avatar: "ED",
      rating: 4.7,
    },
    {
      id: "4",
      name: "Alex Kumar",
      role: "Full Stack Developer",
      avatar: "AK",
      rating: 4.6,
    },
    {
      id: "5",
      name: "Lisa Wang",
      role: "Senior Engineer",
      avatar: "LW",
      rating: 4.8,
    },
  ];

  const handleStartInterview = () => {
    setIsConfiguring(false);
    setIsInterviewStarted(true);
  };

  const handleBackToConfig = () => {
    setIsConfiguring(true);
    setIsInterviewStarted(false);
  };

  const handleScheduleInterview = () => {
    setInterviewConfig((prev) => ({ ...prev, scheduled: true }));
    // Here you would typically save to backend
    console.log("Interview scheduled:", interviewConfig);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-blue-900 dark:to-purple-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Please log in to continue
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            You need to be authenticated to access the dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-blue-900 dark:to-purple-900">
      <div className="flex h-screen">
        {/* Sidebar */}
        <motion.aside
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.5 }}
          className={`${
            isSidebarCollapsed ? "w-20" : "w-80"
          } bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border-r border-gray-200/30 dark:border-white/20 flex flex-col h-screen transition-all duration-300 ease-in-out flex-shrink-0 shadow-xl`}>
          {/* Header */}
          <div
            className={`border-b border-gray-200/20 dark:border-white/10 ${
              isSidebarCollapsed ? "p-4" : "p-6"
            }`}>
            <div
              className={`flex items-center ${
                isSidebarCollapsed ? "justify-center" : "justify-between"
              }`}>
              {/* Logo and Text Section */}
              <div
                className={`flex items-center ${
                  isSidebarCollapsed ? "justify-center" : "space-x-4"
                }`}>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Target className="w-7 h-7 text-white" />
                </div>
                {!isSidebarCollapsed && (
                  <div className="min-w-0 flex-1">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white truncate leading-tight">
                      AI Interview
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-300 truncate font-medium">
                      Practice Platform
                    </p>
                  </div>
                )}
              </div>

              {/* Toggle Button - Only show when expanded */}
              {!isSidebarCollapsed && (
                <button
                  onClick={() => setIsSidebarCollapsed(true)}
                  className="w-10 h-10 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 rounded-xl flex items-center justify-center transition-all duration-200 flex-shrink-0 shadow-sm hover:shadow-md group"
                  title="Collapse Sidebar">
                  <ArrowRight className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors duration-200" />
                </button>
              )}
            </div>

            {/* Toggle Button - Only show when collapsed */}
            {isSidebarCollapsed && (
              <button
                onClick={() => setIsSidebarCollapsed(false)}
                className="mt-4 w-full flex items-center justify-center p-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                title="Expand Sidebar">
                <ArrowRight className="w-5 h-5 rotate-180" />
              </button>
            )}
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {/* Mock Interview - Collapsible */}
            <div>
              <button
                onClick={() => setIsMockInterviewOpen(!isMockInterviewOpen)}
                className={`w-full flex items-center rounded-xl text-left transition-all duration-200 text-gray-700 dark:text-gray-300 hover:bg-gray-100/60 dark:hover:bg-white/15 hover:shadow-md ${
                  isSidebarCollapsed
                    ? "justify-center p-3"
                    : "justify-between px-4 py-3"
                }`}
                title={isSidebarCollapsed ? "Mock Interview" : ""}>
                <div
                  className={`flex items-center ${
                    isSidebarCollapsed ? "" : "space-x-3"
                  }`}>
                  <div className="p-2 rounded-lg bg-gray-100/50 dark:bg-white/10">
                    <Target className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                  </div>
                  {!isSidebarCollapsed && (
                    <span className="font-semibold">Mock Interview</span>
                  )}
                </div>
                {!isSidebarCollapsed && (
                  <div className="flex-shrink-0">
                    {isMockInterviewOpen ? (
                      <ChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    )}
                  </div>
                )}
              </button>

              {/* Collapsible Interview Types */}
              {!isSidebarCollapsed && (
                <AnimatePresence>
                  {isMockInterviewOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="ml-8 mt-2 space-y-2 overflow-hidden">
                      {interviewTypes.map((type) => (
                        <button
                          key={type.id}
                          onClick={() => {
                            setActiveTab(type.id);
                            setInterviewConfig((prev) => ({
                              ...prev,
                              type: type.id,
                            }));
                            setIsProfileSelected(false);
                            setIsSettingsOpen(false);
                            setIsConfiguring(true);
                            setIsInterviewStarted(false);
                          }}
                          className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 ${
                            activeTab === type.id
                              ? "bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/20 dark:border-blue-500/30"
                              : "text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100/30 dark:hover:bg-white/5"
                          }`}>
                          <type.icon
                            className={`w-4 h-4 ${
                              activeTab === type.id
                                ? "text-blue-600 dark:text-blue-400"
                                : "text-gray-500 dark:text-gray-400"
                            }`}
                          />
                          <div className="min-w-0">
                            <div className="font-medium truncate">
                              {type.label}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {type.description}
                            </div>
                          </div>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>

            {/* Dashboard */}
            <button
              onClick={() => {
                setIsProfileSelected(false);
                setIsSettingsOpen(false);
                router.push("/dashboard/analytics");
              }}
              className={`w-full flex items-center rounded-xl text-left transition-all duration-200 text-gray-700 dark:text-gray-300 hover:bg-gray-100/60 dark:hover:bg-white/15 hover:shadow-md ${
                isSidebarCollapsed
                  ? "justify-center p-3"
                  : "space-x-3 px-4 py-3"
              }`}
              title={isSidebarCollapsed ? "Dashboard" : ""}>
              <div className="p-2 rounded-lg bg-gray-100/50 dark:bg-white/10">
                <BarChart3 className="w-5 h-5 flex-shrink-0" />
              </div>
              {!isSidebarCollapsed && (
                <span className="font-semibold">Dashboard</span>
              )}
            </button>

            {/* Question Practice */}
            <button
              onClick={() => {
                setIsProfileSelected(false);
                setIsSettingsOpen(false);
                router.push("/interview-practice");
              }}
              className={`w-full flex items-center rounded-xl text-left transition-all duration-200 text-gray-700 dark:text-gray-300 hover:bg-gray-100/60 dark:hover:bg-white/15 hover:shadow-md ${
                isSidebarCollapsed
                  ? "justify-center p-3"
                  : "space-x-3 px-4 py-3"
              }`}
              title={isSidebarCollapsed ? "Question Practice" : ""}>
              <div className="p-2 rounded-lg bg-gray-100/50 dark:bg-white/10">
                <BookOpen className="w-5 h-5 flex-shrink-0" />
              </div>
              {!isSidebarCollapsed && (
                <span className="font-semibold">Question Practice</span>
              )}
            </button>

            {/* Other Navigation Items */}
            <button
              onClick={() => {
                setIsProfileSelected(false);
                setIsSettingsOpen(false);
                // Add navigation logic for Interview History
                console.log("Interview History clicked");
              }}
              className={`w-full flex items-center rounded-xl text-left transition-all duration-200 text-gray-700 dark:text-gray-300 hover:bg-gray-100/60 dark:hover:bg-white/15 hover:shadow-md ${
                isSidebarCollapsed
                  ? "justify-center p-3"
                  : "space-x-3 px-4 py-3"
              }`}
              title={isSidebarCollapsed ? "Interview History" : ""}>
              <div className="p-2 rounded-lg bg-gray-100/50 dark:bg-white/10">
                <MessageSquare className="w-5 h-5 flex-shrink-0" />
              </div>
              {!isSidebarCollapsed && (
                <span className="font-semibold">Interview History</span>
              )}
            </button>

            <button
              onClick={() => {
                setIsProfileSelected(false);
                setIsSettingsOpen(false);
                // Add navigation logic for Performance
                console.log("Performance clicked");
              }}
              className={`w-full flex items-center rounded-xl text-left transition-all duration-200 text-gray-700 dark:text-gray-300 hover:bg-gray-100/60 dark:hover:bg-white/15 hover:shadow-md ${
                isSidebarCollapsed
                  ? "justify-center p-3"
                  : "space-x-3 px-4 py-3"
              }`}
              title={isSidebarCollapsed ? "Performance" : ""}>
              <div className="p-2 rounded-lg bg-gray-100/50 dark:bg-white/10">
                <Trophy className="w-5 h-5 flex-shrink-0" />
              </div>
              {!isSidebarCollapsed && (
                <span className="font-semibold">Performance</span>
              )}
            </button>

            <button
              onClick={() => {
                setIsProfileSelected(false);
                setIsSettingsOpen(false);
                // Add navigation logic for Community
                console.log("Community clicked");
              }}
              className={`w-full flex items-center rounded-xl text-left transition-all duration-200 text-gray-700 dark:text-gray-300 hover:bg-gray-100/60 dark:hover:bg-white/15 hover:shadow-md ${
                isSidebarCollapsed
                  ? "justify-center p-3"
                  : "space-x-3 px-4 py-3"
              }`}
              title={isSidebarCollapsed ? "Community" : ""}>
              <div className="p-2 rounded-lg bg-gray-100/50 dark:bg-white/10">
                <Users className="w-5 h-5 flex-shrink-0" />
              </div>
              {!isSidebarCollapsed && (
                <span className="font-semibold">Community</span>
              )}
            </button>
          </div>

          {/* Profile Settings - Fixed at Bottom */}
          <div className="border-t border-gray-200/30 dark:border-white/20 p-4">
            {/* Collapsible Profile Section */}
            <div>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className={`w-full flex items-center rounded-xl text-left transition-all duration-200 group  ${
                  isProfileOpen
                    ? "bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-500/10 dark:to-purple-500/10 border border-blue-200/50 dark:border-blue-500/30 shadow-md "
                    : "hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 dark:hover:from-white/5 dark:hover:to-white/10 hover:shadow-md"
                } ${
                  isSidebarCollapsed
                    ? "justify-center p-3"
                    : "justify-between px-4 py-3"
                }`}
                title={isSidebarCollapsed ? "Profile" : ""}>
                <div
                  className={`flex items-center  ${
                    isSidebarCollapsed ? "" : "space-x-2"
                  }`}>
                  <div
                    className={`w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg transition-all duration-200 ${
                      isProfileOpen
                        ? "ring-2 ring-blue-200 dark:ring-blue-500/50"
                        : "group-hover:ring-2 group-hover:ring-blue-200 dark:group-hover:ring-blue-500/50"
                    }`}>
                    <User className="w-5 h-5 text-white" />
                  </div>
                  {!isSidebarCollapsed && (
                    <div className="min-w-0 flex-1">
                      <div
                        className={`font-semibold text-gray-900 dark:text-white truncate transition-all duration-200 ${
                          isProfileOpen
                            ? "text-blue-700 dark:text-blue-200"
                            : "group-hover:text-blue-600 dark:group-hover:text-blue-300"
                        }`}>
                        {user?.firstName ||
                          user?.email?.split("@")[0] ||
                          "User"}
                      </div>
                      <div
                        className={`text-xs truncate transition-all duration-200 ${
                          isProfileOpen
                            ? "text-blue-600 dark:text-blue-300"
                            : "text-gray-600 dark:text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400"
                        }`}>
                        {user?.email}
                      </div>
                    </div>
                  )}
                </div>
                {!isSidebarCollapsed && (
                  <div className="flex-shrink-0">
                    {isProfileOpen ? (
                      <ChevronUp
                        className={`w-5 h-5 transition-all duration-200 ${
                          isProfileOpen
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      />
                    ) : (
                      <ChevronDown
                        className={`w-5 h-5 transition-all duration-200 ${
                          isProfileOpen
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-gray-500 dark:text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400"
                        }`}
                      />
                    )}
                  </div>
                )}
              </button>

              {/* Collapsible Profile Options */}
              {!isSidebarCollapsed && (
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="ml-0 mt-3 space-y-2 overflow-hidden">
                      <button
                        onClick={() => {
                          setIsSettingsOpen(true);
                          setIsProfileSelected(false);
                          setIsConfiguring(false);
                          setIsInterviewStarted(false);
                        }}
                        className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 group ${
                          isSettingsOpen
                            ? "bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-500/20 dark:to-blue-500/30 text-blue-700 dark:text-blue-200 border border-blue-200/50 dark:border-blue-500/30 shadow-sm"
                            : "text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-300 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-blue-100/50 dark:hover:from-blue-500/10 dark:hover:to-blue-500/20 hover:shadow-sm"
                        }`}>
                        <Settings
                          className={`w-4 h-4 transition-colors duration-200 ${
                            isSettingsOpen
                              ? "text-blue-600 dark:text-blue-300"
                              : "group-hover:text-blue-500 dark:group-hover:text-blue-400"
                          }`}
                        />
                        <span className="text-sm font-medium">Settings</span>
                      </button>
                      <button
                        onClick={() => {
                          setIsProfileSelected(true);
                          setIsSettingsOpen(false);
                          // Don't reset isConfiguring and isInterviewStarted to maintain resume-based interview state
                        }}
                        className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 group ${
                          isProfileSelected
                            ? "bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-500/20 dark:to-blue-500/30 text-blue-700 dark:text-blue-200 border border-blue-200/50 dark:border-blue-500/30 shadow-sm"
                            : "text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-300 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-blue-100/50 dark:hover:from-blue-500/10 dark:hover:to-blue-500/20 hover:shadow-sm"
                        }`}>
                        <User
                          className={`w-4 h-4 transition-colors duration-200 ${
                            isProfileSelected
                              ? "text-blue-600 dark:text-blue-300"
                              : "group-hover:text-blue-500 dark:group-hover:text-blue-400"
                          }`}
                        />
                        <span className="text-sm font-medium">Profile</span>
                      </button>

                      {/* Theme Toggle Section */}
                      <div className="px-3 py-3 border-t border-gray-200/20 dark:border-white/10">
                        <div className="flex items-center justify-between mb-3">
                          <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Theme
                          </div>
                          <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                        </div>
                        <div className="grid grid-cols-2 gap-1 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-600 rounded-xl p-1 shadow-inner">
                          <button
                            onClick={() => setTheme("light")}
                            className={`flex flex-col items-center justify-center py-2.5 px-3 rounded-lg transition-all duration-300 group ${
                              theme === "light"
                                ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-lg border border-blue-200/50 dark:border-blue-500/30 scale-105"
                                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-white/50 dark:hover:bg-slate-600/50 hover:scale-105"
                            }`}
                            title="Light Mode">
                            <Sun
                              className={`w-4 h-4 mb-1 transition-all duration-300 ${
                                theme === "light"
                                  ? "text-yellow-500 dark:text-yellow-400"
                                  : "group-hover:text-yellow-500 dark:group-hover:text-yellow-400"
                              }`}
                            />
                            <span className="text-xs font-medium">Light</span>
                          </button>
                          <button
                            onClick={() => setTheme("dark")}
                            className={`flex flex-col items-center justify-center py-2.5 px-3 rounded-lg transition-all duration-300 group ${
                              theme === "dark"
                                ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-lg border border-blue-200/50 dark:border-blue-500/30 scale-105"
                                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-white/50 dark:hover:bg-slate-600/50 hover:scale-105"
                            }`}
                            title="Dark Mode">
                            <Moon
                              className={`w-4 h-4 mb-1 transition-all duration-300 ${
                                theme === "dark"
                                  ? "text-indigo-500 dark:text-indigo-400"
                                  : "group-hover:text-indigo-500 dark:group-hover:text-indigo-400"
                              }`}
                            />
                            <span className="text-xs font-medium">Dark</span>
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={logout}
                        className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 group text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 dark:hover:from-red-500/10 dark:hover:to-red-500/20 hover:shadow-sm">
                        <ArrowRight className="w-4 h-4 rotate-180 group-hover:scale-110 transition-transform duration-200" />
                        <span className="text-sm font-medium">Logout</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          </div>
        </motion.aside>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden min-w-0">
          {/* Content Area */}
          <div className="h-full overflow-y-auto">
            <AnimatePresence mode="wait">
              {isSettingsOpen ? (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="h-full">
                  <SettingsContent onClose={closeSettings} />
                </motion.div>
              ) : isProfileSelected ? (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="h-full">
                  <ProfileContent onClose={closeProfile} />
                </motion.div>
              ) : isConfiguring ? (
                <motion.div
                  key="config"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="max-w-4xl mx-auto p-6">
                  {/* Interview Configuration */}
                  <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/20 dark:border-white/10 shadow-xl p-6">
                    {/* Interview Type Header */}
                    <div className="mb-6">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                        <div className="min-w-0 flex-1">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            {activeTab === "resume" && "Resume Based Interview"}
                            {activeTab === "jobDescription" &&
                              "Job Description Based Interview"}
                            {activeTab === "topic" && "Topic Based Interview"}
                            {activeTab === "company" &&
                              "Company Based Interview"}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300">
                            {activeTab === "resume" &&
                              "Configure your interview based on your resume"}
                            {activeTab === "jobDescription" &&
                              "Configure your interview based on job requirements"}
                            {activeTab === "topic" &&
                              "Configure your interview on specific topics"}
                            {activeTab === "company" &&
                              "Configure company-specific interview"}
                          </p>
                        </div>
                        {/* Current Selection Indicator */}
                        <div className="flex items-center space-x-2 px-3 py-2 bg-blue-50 dark:bg-blue-500/20 border border-blue-200 dark:border-blue-500/30 rounded-lg flex-shrink-0">
                          {activeTab === "resume" && (
                            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          )}
                          {activeTab === "jobDescription" && (
                            <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          )}
                          {activeTab === "topic" && (
                            <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          )}
                          {activeTab === "company" && (
                            <Building className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          )}
                          <span className="text-sm font-medium text-blue-700 dark:text-blue-200">
                            {
                              interviewTypes.find((t) => t.id === activeTab)
                                ?.label
                            }
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Main Configuration Area - Two Columns */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                      {/* Left Column - Input Fields */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                          Interview Configuration
                        </h3>

                        {/* Resume Upload (for Resume Based) */}
                        {activeTab === "resume" && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Upload Resume{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <div className="border-2 border-dashed border-gray-300 dark:border-white/20 rounded-lg p-4 text-center hover:border-blue-400 dark:hover:border-blue-400 transition-colors duration-200">
                              <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                Click to upload or drag and drop
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                PDF, DOC, DOCX (max 5MB)
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Job Description Upload (for Job Description Based) */}
                        {activeTab === "jobDescription" && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Upload Job Description{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <div className="border-2 border-dashed border-gray-300 dark:border-white/20 rounded-lg p-4 text-center hover:border-blue-400 dark:hover:border-blue-400 transition-colors duration-200">
                              <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                Click to upload or drag and drop
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                PDF, DOC, DOCX (max 5MB)
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Interview Type Selection */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Interview Type{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <select className="w-full px-3 py-2.5 border border-gray-300 dark:border-white/20 rounded-lg bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                            <option value="technical">
                              Technical Interview
                            </option>
                            <option value="behavioral">
                              Behavioral Interview
                            </option>
                          </select>
                        </div>

                        {/* Level Selection */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Level <span className="text-red-500">*</span>
                          </label>
                          <select className="w-full px-3 py-2.5 border border-gray-300 dark:border-white/20 rounded-lg bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="expert">Expert</option>
                          </select>
                        </div>

                        {/* Resume Selection (for Resume Based) */}
                        {activeTab === "resume" && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Select Resume To Give Interview{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <select className="w-full px-3 py-2.5 border border-gray-300 dark:border-white/20 rounded-lg bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                              <option value="">Choose a resume</option>
                              <option value="resume1">My Resume 1</option>
                              <option value="resume2">My Resume 2</option>
                              <option value="resume3">My Resume 3</option>
                            </select>
                          </div>
                        )}

                        {/* Company Selection (for Company Based) */}
                        {activeTab === "company" && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Select Company{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <select className="w-full px-3 py-2.5 border border-gray-300 dark:border-white/20 rounded-lg bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                              <option value="">Choose a company</option>
                              <option value="google">Google</option>
                              <option value="microsoft">Microsoft</option>
                              <option value="amazon">Amazon</option>
                              <option value="apple">Apple</option>
                              <option value="meta">Meta</option>
                            </select>
                          </div>
                        )}

                        {/* Topic Selection (for Topic Based) */}
                        {activeTab === "topic" && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Select Topic{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <select className="w-full px-3 py-2.5 border border-gray-300 dark:border-white/20 rounded-lg bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                              <option value="">Choose a topic</option>
                              <option value="react">React.js</option>
                              <option value="node">Node.js</option>
                              <option value="python">Python</option>
                              <option value="java">Java</option>
                              <option value="system-design">
                                System Design
                              </option>
                            </select>
                          </div>
                        )}
                      </div>

                      {/* Right Column - Input Fields */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                          Interview Settings
                        </h3>

                        {/* Resume Name */}
                        {activeTab === "resume" && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Enter Unique Resume Name{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              placeholder="Enter unique resume name"
                              className="w-full px-3 py-2.5 border border-gray-300 dark:border-white/20 rounded-lg bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            />
                          </div>
                        )}

                        {/* Job Description Name */}
                        {activeTab === "jobDescription" && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Enter Unique JD Name{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              placeholder="Enter unique job description name"
                              className="w-full px-3 py-2.5 border border-gray-300 dark:border-white/20 rounded-lg bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            />
                          </div>
                        )}

                        {/* Time Selection */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Select Time <span className="text-red-500">*</span>
                          </label>
                          <select className="w-full px-3 py-2.5 border border-gray-300 dark:border-white/20 rounded-lg bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                            <option value="">Choose duration</option>
                            <option value="15">15 minutes</option>
                            <option value="30">30 minutes</option>
                            <option value="45">45 minutes</option>
                          </select>
                        </div>

                        {/* Schedule Option */}
                        <div>
                          <label className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              checked={interviewConfig.scheduled}
                              onChange={(e) =>
                                setInterviewConfig((prev) => ({
                                  ...prev,
                                  scheduled: e.target.checked,
                                }))
                              }
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                            />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Schedule Resume (Not Compulsory)
                            </span>
                          </label>
                        </div>

                        {/* Schedule Date/Time (if scheduled) */}
                        {interviewConfig.scheduled && (
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Date
                              </label>
                              <input
                                type="date"
                                className="w-full px-3 py-2.5 border border-gray-300 dark:border-white/20 rounded-lg bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Time
                              </label>
                              <input
                                type="time"
                                className="w-full px-3 py-2.5 border border-gray-300 dark:border-white/20 rounded-lg bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Interviewer Selection - Rectangular Cards */}
                    <div className="mb-8 pt-6 border-t border-gray-200/20 dark:border-white/10">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                        Select Interviewer
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                        {interviewers.map((interviewer) => (
                          <button
                            key={interviewer.id}
                            onClick={() =>
                              setInterviewConfig((prev) => ({
                                ...prev,
                                interviewerId: interviewer.id,
                              }))
                            }
                            className={`p-4 rounded-lg border-2 transition-all duration-200 text-center hover:scale-105 ${
                              interviewConfig.interviewerId === interviewer.id
                                ? "border-blue-500 bg-blue-50 dark:bg-blue-500/20 shadow-lg"
                                : "border-gray-200 dark:border-white/20 hover:border-blue-300 dark:hover:border-blue-400"
                            }`}>
                            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-3">
                              {interviewer.avatar}
                            </div>
                            <div className="font-medium text-gray-900 dark:text-white text-sm mb-1">
                              {interviewer.name}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                              {interviewer.role}
                            </div>
                            <div className="flex items-center justify-center space-x-1">
                              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                              <span className="text-xs text-gray-600 dark:text-gray-300">
                                {interviewer.rating}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-6 border-t border-gray-200/20 dark:border-white/10 flex flex-col sm:flex-row gap-4">
                      <button
                        onClick={handleStartInterview}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center space-x-2">
                        <Play className="w-5 h-5" />
                        <span>
                          {interviewConfig.scheduled
                            ? "Schedule Interview"
                            : "Start Interview Now"}
                        </span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="interview"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="max-w-6xl mx-auto p-6">
                  {/* Interview Interface */}
                  <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/20 dark:border-white/10 shadow-xl p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Left Column - Interview Info */}
                      <div className="lg:col-span-2">
                        {/* Interview Header */}
                        <div className="flex items-center justify-between mb-6">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                              Interview Session
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                              AI Interviewer:{" "}
                              {interviewers.find(
                                (i) => i.id === interviewConfig.interviewerId
                              )?.name || "AI Assistant"}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                              20:30
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Time remaining
                            </p>
                          </div>
                        </div>

                        {/* Video/Interview Area */}
                        <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-8 text-center mb-6">
                          <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users className="w-16 h-16 text-white" />
                          </div>
                          <p className="text-gray-600 dark:text-gray-300">
                            AI Interviewer Ready
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                            Subtitle working here...
                          </p>
                        </div>

                        {/* Interview Controls */}
                        <div className="flex flex-col sm:flex-row gap-4">
                          <button className="flex-1 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center space-x-2">
                            <Play className="w-5 h-5" />
                            <span>Start Answering</span>
                          </button>
                          <button className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center space-x-2">
                            <span>Exit Interview</span>
                          </button>
                        </div>

                        {/* Interview Type Indicators */}
                        <div className="mt-6 flex gap-3">
                          <div className="px-4 py-2 bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-200 rounded-lg text-sm font-medium">
                            {
                              levels.find((l) => l.id === interviewConfig.level)
                                ?.label
                            }{" "}
                            Level
                          </div>
                          <div className="px-4 py-2 bg-purple-100 dark:bg-purple-500/20 text-purple-800 dark:text-purple-200 rounded-lg text-sm font-medium">
                            Technical Interview
                          </div>
                        </div>
                      </div>

                      {/* Right Column - Chat/Interaction Log */}
                      <div className="lg:col-span-1">
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                          Interview Log
                        </h4>
                        <div className="space-y-3">
                          <div className="p-3 bg-blue-50 dark:bg-blue-500/20 border border-blue-200 dark:border-blue-500/30 rounded-lg">
                            <div className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">
                              AI Interviewer
                            </div>
                            <div className="text-sm text-blue-800 dark:text-blue-200">
                              Hello! I'm your AI interviewer today. Let's begin
                              with your introduction.
                            </div>
                          </div>
                          <div className="p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg">
                            <div className="text-xs text-gray-600 dark:text-gray-400 font-medium mb-1">
                              You
                            </div>
                            <div className="text-sm text-gray-800 dark:text-gray-200">
                              Hi! I'm excited to be here. I'm a software
                              developer with experience in...
                            </div>
                          </div>
                          <div className="p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg">
                            <div className="text-xs text-gray-600 dark:text-gray-400 font-medium mb-1">
                              You
                            </div>
                            <div className="text-sm text-gray-800 dark:text-gray-200">
                              I've worked on several projects including...
                            </div>
                          </div>
                          <div className="p-3 bg-blue-50 dark:bg-blue-500/20 border border-blue-200 dark:border-blue-500/30 rounded-lg">
                            <div className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">
                              AI Interviewer
                            </div>
                            <div className="text-sm text-blue-800 dark:text-blue-200">
                              That's interesting! Can you tell me more about
                              your technical skills?
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Back Button */}
                    <div className="mt-6 pt-6 border-t border-gray-200/20 dark:border-white/10">
                      <button
                        onClick={handleBackToConfig}
                        className="px-6 py-3 border border-gray-300 dark:border-white/20 text-gray-700 dark:text-white font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-white/10 transition-all duration-200 flex items-center space-x-2">
                        <ArrowRight className="w-5 h-5 rotate-180" />
                        <span>Back to Configuration</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
