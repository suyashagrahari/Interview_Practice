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
  ArrowRight,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Sun,
  Moon,
  Users,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import InterviewGuidelinesModal from "@/components/interview/interview-guidelines-modal";
import ResumeBasedInterview from "@/components/interview/resume-based-interview";
import JobDescriptionInterview from "@/components/interview/job-description-interview";
import TopicBasedInterview from "@/components/interview/topic-based-interview";
import CompanyBasedInterview from "@/components/interview/company-based-interview";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<string>("resume");
  const [isMockInterviewOpen, setIsMockInterviewOpen] = useState(true);

  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isProfileSelected, setIsProfileSelected] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isGuidelinesModalOpen, setIsGuidelinesModalOpen] = useState(false);
  const [isInterviewSelected, setIsInterviewSelected] = useState(false);

  const closeProfile = () => {
    setIsProfileOpen(false);
    setIsProfileSelected(false);
  };

  const closeSettings = () => {
    setIsSettingsOpen(false);
    setIsProfileSelected(false);
  };

  const closeInterview = () => {
    setIsInterviewSelected(false);
    setIsProfileSelected(false);
    setIsSettingsOpen(false);
  };
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Set client state to prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Check for profile parameter and open profile automatically
  useEffect(() => {
    const profileParam = searchParams.get("profile");
    if (profileParam === "true") {
      setIsProfileOpen(true);
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
      id: "job-description",
      label: "Job Description Based",
      icon: Briefcase,
      description: "Interview based on job requirements",
    },
    {
      id: "topic",
      label: "Topic Based",
      icon: BookOpen,
      description: "Interview on specific topics",
    },
    {
      id: "company",
      label: "Company Based",
      icon: Building,
      description: "Company-specific interview",
    },
  ];

  const handleStartInterview = () => {
    setIsGuidelinesModalOpen(true);
  };

  const handleGuidelinesComplete = () => {
    setIsGuidelinesModalOpen(false);
    setIsInterviewStarted(true);
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

  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-blue-900 dark:to-purple-900">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Loading Dashboard
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Please wait while we prepare your dashboard...
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
            isSidebarCollapsed ? "w-16" : "w-[20%]"
          } bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border-r border-gray-200/30 dark:border-white/20 flex flex-col h-screen transition-all duration-300 ease-in-out flex-shrink-0 shadow-xl`}>
          {/* Header */}
          <div
            className={`border-b border-gray-200/20 dark:border-white/10 ${
              isSidebarCollapsed ? "p-3" : "p-4"
            }`}>
            <div
              className={`flex items-center ${
                isSidebarCollapsed ? "justify-center" : "justify-between"
              }`}>
              {/* Logo and Text Section */}
              <div
                className={`flex items-center ${
                  isSidebarCollapsed ? "justify-center" : "space-x-3"
                }`}>
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Target className="w-4 h-4 text-white" />
                </div>
                {!isSidebarCollapsed && (
                  <div className="min-w-0 flex-1">
                    <h1 className="text-lg font-bold text-gray-900 dark:text-white truncate leading-tight">
                      AI Interview
                    </h1>
                    <p className="text-xs text-gray-600 dark:text-gray-300 truncate font-medium">
                      Practice Platform
                    </p>
                  </div>
                )}
              </div>

              {/* Toggle Button - Only show when expanded */}
              {!isSidebarCollapsed && (
                <button
                  onClick={() => setIsSidebarCollapsed(true)}
                  className="w-8 h-8 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 rounded-lg flex items-center justify-center transition-all duration-200 flex-shrink-0 shadow-sm hover:shadow-md group"
                  title="Collapse Sidebar">
                  <ArrowRight className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors duration-200" />
                </button>
              )}
            </div>

            {/* Toggle Button - Only show when collapsed */}
            {isSidebarCollapsed && (
              <button
                onClick={() => setIsSidebarCollapsed(false)}
                className="mt-3 w-full flex items-center justify-center p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                title="Expand Sidebar">
                <ArrowRight className="w-4 h-4 rotate-180" />
              </button>
            )}
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {/* Mock Interview - Collapsible */}
            <div>
              <button
                onClick={() => setIsMockInterviewOpen(!isMockInterviewOpen)}
                className={`w-full flex items-center rounded-lg text-left transition-all duration-200 ${
                  isInterviewSelected
                    ? "bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/20 dark:border-blue-500/30"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100/60 dark:hover:bg-white/15 hover:shadow-md"
                } ${
                  isSidebarCollapsed
                    ? "justify-center p-2"
                    : "justify-between px-3 py-2"
                }`}
                title={isSidebarCollapsed ? "Mock Interview" : ""}>
                <div
                  className={`flex items-center ${
                    isSidebarCollapsed ? "" : "space-x-2"
                  }`}>
                  <div className="p-1.5 rounded-lg bg-gray-100/50 dark:bg-white/10">
                    <Target className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                  </div>
                  {!isSidebarCollapsed && (
                    <span className="font-semibold text-base">
                      Mock Interview
                    </span>
                  )}
                </div>
                {!isSidebarCollapsed && (
                  <div className="flex-shrink-0">
                    {isMockInterviewOpen ? (
                      <ChevronUp className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
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
                      className="ml-6 mt-1 space-y-1 overflow-hidden">
                      {interviewTypes.map((type) => (
                        <button
                          key={type.id}
                          onClick={() => {
                            setActiveTab(type.id);
                            setIsProfileSelected(false);
                            setIsSettingsOpen(false);
                            setIsInterviewSelected(true);
                          }}
                          className={`w-full flex items-center space-x-2 px-2 py-1.5 rounded-md text-left transition-all duration-200 ${
                            activeTab === type.id && isInterviewSelected
                              ? "bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/20 dark:border-blue-500/30"
                              : "text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100/30 dark:hover:bg-white/5"
                          }`}>
                          <type.icon
                            className={`w-3.5 h-3.5 ${
                              activeTab === type.id && isInterviewSelected
                                ? "text-blue-600 dark:text-blue-400"
                                : "text-gray-500 dark:text-gray-400"
                            }`}
                          />
                          <div className="min-w-0">
                            <div className="font-medium text-base truncate">
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
              className={`w-full flex items-center rounded-lg text-left transition-all duration-200 text-gray-700 dark:text-gray-300 hover:bg-gray-100/60 dark:hover:bg-white/15 hover:shadow-md ${
                isSidebarCollapsed
                  ? "justify-center p-2"
                  : "space-x-2 px-3 py-2"
              }`}
              title={isSidebarCollapsed ? "Dashboard" : ""}>
              <div className="p-1.5 rounded-lg bg-gray-100/50 dark:bg-white/10">
                <BarChart3 className="w-4 h-4 flex-shrink-0" />
              </div>
              {!isSidebarCollapsed && (
                <span className="font-semibold text-base">Dashboard</span>
              )}
            </button>

            {/* Question Practice */}
            <button
              onClick={() => {
                setIsProfileSelected(false);
                setIsSettingsOpen(false);
                router.push("/interview-practice");
              }}
              className={`w-full flex items-center rounded-lg text-left transition-all duration-200 text-gray-700 dark:text-gray-300 hover:bg-gray-100/60 dark:hover:bg-white/15 hover:shadow-md ${
                isSidebarCollapsed
                  ? "justify-center p-2"
                  : "space-x-2 px-3 py-2"
              }`}
              title={isSidebarCollapsed ? "Question Practice" : ""}>
              <div className="p-1.5 rounded-lg bg-gray-100/50 dark:bg-white/10">
                <BookOpen className="w-4 h-4 flex-shrink-0" />
              </div>
              {!isSidebarCollapsed && (
                <span className="font-semibold text-base">
                  Question Practice
                </span>
              )}
            </button>

            {/* Other Navigation Items */}
            <button
              onClick={() => {
                setIsProfileSelected(false);
                setIsSettingsOpen(false);
                // Add navigation logic for Interview History
                // Navigate to interview history
              }}
              className={`w-full flex items-center rounded-lg text-left transition-all duration-200 text-gray-700 dark:text-gray-300 hover:bg-gray-100/60 dark:hover:bg-white/15 hover:shadow-md ${
                isSidebarCollapsed
                  ? "justify-center p-2"
                  : "space-x-2 px-3 py-2"
              }`}
              title={isSidebarCollapsed ? "Interview History" : ""}>
              <div className="p-1.5 rounded-lg bg-gray-100/50 dark:bg-white/10">
                <MessageSquare className="w-4 h-4 flex-shrink-0" />
              </div>
              {!isSidebarCollapsed && (
                <span className="font-semibold text-base">
                  Interview History
                </span>
              )}
            </button>

            <button
              onClick={() => {
                setIsProfileSelected(false);
                setIsSettingsOpen(false);
                // Add navigation logic for Performance
                // Navigate to performance analytics
              }}
              className={`w-full flex items-center rounded-lg text-left transition-all duration-200 text-gray-700 dark:text-gray-300 hover:bg-gray-100/60 dark:hover:bg-white/15 hover:shadow-md ${
                isSidebarCollapsed
                  ? "justify-center p-2"
                  : "space-x-2 px-3 py-2"
              }`}
              title={isSidebarCollapsed ? "Performance" : ""}>
              <div className="p-1.5 rounded-lg bg-gray-100/50 dark:bg-white/10">
                <Trophy className="w-4 h-4 flex-shrink-0" />
              </div>
              {!isSidebarCollapsed && (
                <span className="font-semibold text-base">Performance</span>
              )}
            </button>

            <button
              onClick={() => {
                setIsProfileSelected(false);
                setIsSettingsOpen(false);
                // Add navigation logic for Community
                // Navigate to community features
              }}
              className={`w-full flex items-center rounded-lg text-left transition-all duration-200 text-gray-700 dark:text-gray-300 hover:bg-gray-100/60 dark:hover:bg-white/15 hover:shadow-md ${
                isSidebarCollapsed
                  ? "justify-center p-2"
                  : "space-x-2 px-3 py-2"
              }`}
              title={isSidebarCollapsed ? "Community" : ""}>
              <div className="p-1.5 rounded-lg bg-gray-100/50 dark:bg-white/10">
                <Users className="w-4 h-4 flex-shrink-0" />
              </div>
              {!isSidebarCollapsed && (
                <span className="font-semibold text-base">Community</span>
              )}
            </button>
          </div>

          {/* Profile Settings - Fixed at Bottom */}
          <div className="border-t border-gray-200/30 dark:border-white/20 p-3">
            {/* Collapsible Profile Section */}
            <div>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className={`w-full flex items-center rounded-lg text-left transition-all duration-200 group  ${
                  isProfileOpen
                    ? "bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-500/10 dark:to-purple-500/10 border border-blue-200/50 dark:border-blue-500/30 shadow-md "
                    : "hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 dark:hover:from-white/5 dark:hover:to-white/10 hover:shadow-md"
                } ${
                  isSidebarCollapsed
                    ? "justify-center p-2"
                    : "justify-between px-3 py-2"
                }`}
                title={isSidebarCollapsed ? "Profile" : ""}>
                <div
                  className={`flex items-center  ${
                    isSidebarCollapsed ? "" : "space-x-2"
                  }`}>
                  <div
                    className={`w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg transition-all duration-200 ${
                      isProfileOpen
                        ? "ring-2 ring-blue-200 dark:ring-blue-500/50"
                        : "group-hover:ring-2 group-hover:ring-blue-200 dark:group-hover:ring-blue-500/50"
                    }`}>
                    <User className="w-4 h-4 text-white" />
                  </div>
                  {!isSidebarCollapsed && (
                    <div className="min-w-0 flex-1">
                      <div
                        className={`font-semibold text-base text-gray-900 dark:text-white truncate transition-all duration-200 ${
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
                        className={`w-4 h-4 transition-all duration-200 ${
                          isProfileOpen
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      />
                    ) : (
                      <ChevronDown
                        className={`w-4 h-4 transition-all duration-200 ${
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
                      className="ml-0 mt-2 space-y-1 overflow-hidden">
                      <button
                        onClick={() => {
                          setIsSettingsOpen(true);
                          setIsProfileSelected(false);
                        }}
                        className={`w-full flex items-center space-x-2 px-2 py-1.5 rounded-md text-left transition-all duration-200 group ${
                          isSettingsOpen
                            ? "bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-500/20 dark:to-blue-500/30 text-blue-700 dark:text-blue-200 border border-blue-200/50 dark:border-blue-500/30 shadow-sm"
                            : "text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-300 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-blue-100/50 dark:hover:from-blue-500/10 dark:hover:to-blue-500/20 hover:shadow-sm"
                        }`}>
                        <Settings
                          className={`w-3.5 h-3.5 transition-colors duration-200 ${
                            isSettingsOpen
                              ? "text-blue-600 dark:text-blue-300"
                              : "group-hover:text-blue-500 dark:group-hover:text-blue-400"
                          }`}
                        />
                        <span className="text-base font-medium">Settings</span>
                      </button>
                      <button
                        onClick={() => {
                          setIsProfileSelected(true);
                          setIsSettingsOpen(false);
                        }}
                        className={`w-full flex items-center space-x-2 px-2 py-1.5 rounded-md text-left transition-all duration-200 group ${
                          isProfileSelected
                            ? "bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-500/20 dark:to-blue-500/30 text-blue-700 dark:text-blue-200 border border-blue-200/50 dark:border-blue-500/30 shadow-sm"
                            : "text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-300 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-blue-100/50 dark:hover:from-blue-500/10 dark:hover:to-blue-500/20 hover:shadow-sm"
                        }`}>
                        <User
                          className={`w-3.5 h-3.5 transition-colors duration-200 ${
                            isProfileSelected
                              ? "text-blue-600 dark:text-blue-300"
                              : "group-hover:text-blue-500 dark:group-hover:text-blue-400"
                          }`}
                        />
                        <span className="text-base font-medium">Profile</span>
                      </button>

                      {/* Theme Toggle Section */}
                      <div className="px-2 py-2 border-t border-gray-200/20 dark:border-white/10">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                            Theme
                          </div>
                          <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                        </div>
                        <div className="grid grid-cols-2 gap-1 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-600 rounded-xl p-1 shadow-inner">
                          <button
                            onClick={() => setTheme("light")}
                            className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-md transition-all duration-300 group ${
                              theme === "light"
                                ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-lg border border-blue-200/50 dark:border-blue-500/30 scale-105"
                                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-white/50 dark:hover:bg-slate-600/50 hover:scale-105"
                            }`}
                            title="Light Mode">
                            <Sun
                              className={`w-3 h-3 mb-1 transition-all duration-300 ${
                                theme === "light"
                                  ? "text-yellow-500 dark:text-yellow-400"
                                  : "group-hover:text-yellow-500 dark:group-hover:text-yellow-400"
                              }`}
                            />
                            <span className="text-xs font-medium">Light</span>
                          </button>
                          <button
                            onClick={() => setTheme("dark")}
                            className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-md transition-all duration-300 group ${
                              theme === "dark"
                                ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-lg border border-blue-200/50 dark:border-blue-500/30 scale-105"
                                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-white/50 dark:hover:bg-slate-600/50 hover:scale-105"
                            }`}
                            title="Dark Mode">
                            <Moon
                              className={`w-3 h-3 mb-1 transition-all duration-300 ${
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
                        className="w-full flex items-center space-x-2 px-2 py-1.5 rounded-md text-left transition-all duration-200 group text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 dark:hover:from-red-500/10 dark:hover:to-red-500/20 hover:shadow-sm">
                        <ArrowRight className="w-3.5 h-3.5 rotate-180 group-hover:scale-110 transition-transform duration-200" />
                        <span className="text-base font-medium">Logout</span>
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
              ) : isInterviewSelected ? (
                <motion.div
                  key="interview"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="h-full">
                  {activeTab === "resume" && (
                    <ResumeBasedInterview onBack={closeInterview} />
                  )}
                  {activeTab === "job-description" && (
                    <JobDescriptionInterview onBack={closeInterview} />
                  )}
                  {activeTab === "topic" && (
                    <TopicBasedInterview onBack={closeInterview} />
                  )}
                  {activeTab === "company" && (
                    <CompanyBasedInterview onBack={closeInterview} />
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="interview"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="h-full">
                  {activeTab === "resume" && (
                    <ResumeBasedInterview onBack={closeInterview} />
                  )}
                  {activeTab === "job-description" && (
                    <JobDescriptionInterview onBack={closeInterview} />
                  )}
                  {activeTab === "topic" && (
                    <TopicBasedInterview onBack={closeInterview} />
                  )}
                  {activeTab === "company" && (
                    <CompanyBasedInterview onBack={closeInterview} />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Interview Guidelines Modal */}
      <InterviewGuidelinesModal
        isOpen={isGuidelinesModalOpen}
        onClose={() => setIsGuidelinesModalOpen(false)}
        onStartInterview={handleGuidelinesComplete}
      />
    </div>
  );
};

export default Dashboard;
