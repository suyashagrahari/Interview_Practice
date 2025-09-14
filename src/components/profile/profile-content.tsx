"use client";

import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { setActiveTab } from "@/store/slices/profileSlice";
import { useProfileData, useClearDuplicates } from "@/hooks/useProfileData";
import {
  User,
  Settings,
  LogOut,
  ChevronUp,
  Briefcase,
  FolderOpen,
  GraduationCap,
  Award,
  FileText,
  ArrowLeft,
} from "lucide-react";
import { motion } from "framer-motion";
import ContactSection from "./sections/contact-section";
import ExperienceSection from "./sections/experience-section";
import ExperienceSidebar from "./sections/experience-sidebar";
import ProjectSection from "./sections/project-section";
import ProjectSidebar from "./sections/project-sidebar";
import EducationSection from "./sections/education-section";
import EducationSidebar from "./sections/education-sidebar";
import SkillsSection from "./sections/skills-section";
import SummarySection from "./sections/summary-section";

const tabs = [
  { id: "contact", label: "Contact", icon: User },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "project", label: "Project", icon: FolderOpen },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "skills", label: "Skills", icon: Award },
  { id: "summary", label: "Summary", icon: FileText },
] as const;

interface ProfileContentProps {
  onClose?: () => void;
}

export default function ProfileContent({ onClose }: ProfileContentProps) {
  const dispatch = useAppDispatch();
  const { activeTab } = useAppSelector((state) => state.profile);

  // Load profile data from localStorage into Redux store
  useProfileData();

  // Clear duplicates functionality
  const { clearDuplicates } = useClearDuplicates();

  const handleTabChange = (tabId: (typeof tabs)[number]["id"]) => {
    dispatch(setActiveTab(tabId));
  };

  const renderActiveSection = () => {
    switch (activeTab) {
      case "contact":
        return <ContactSection />;
      case "experience":
        return <ExperienceSection />;
      case "project":
        return <ProjectSection />;
      case "education":
        return <EducationSection />;
      case "skills":
        return <SkillsSection />;
      case "summary":
        return <SummarySection />;
      default:
        return <ContactSection />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-blue-900 dark:to-purple-900">
      {/* Right Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Profile Header - Sticky */}
        <div className="sticky top-0 z-40 py-2 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-white/20 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14">
              {/* Left Section - Profile Header */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                    Profile Management
                  </h1>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Manage your professional profile and resume information
                  </p>
                </div>
              </div>

              {/* Right Section - Back Button */}
              <div className="flex items-center space-x-3">
                {onClose && (
                  <button
                    onClick={onClose}
                    className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200">
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation - Sticky */}
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-b border-gray-200/20 dark:border-white/10">
          <div className="px-4 py-2">
            <nav className="flex space-x-1 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`flex items-center space-x-1.5 px-3 py-2 text-xs font-medium rounded-lg transition-all duration-200 whitespace-nowrap ${
                      isActive
                        ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 dark:from-blue-500/30 dark:to-purple-500/30 text-blue-700 dark:text-blue-200 border border-blue-500/30 dark:border-blue-500/50 shadow-sm"
                        : "text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-300 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 dark:hover:from-blue-500/10 dark:hover:to-purple-500/10 hover:shadow-sm"
                    }`}>
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="h-full p-4">
            <div className="flex gap-4 h-full">
              {/* Left Sidebar for Experience/Project/Education - Only when needed */}
              {(activeTab === "experience" ||
                activeTab === "project" ||
                activeTab === "education") && (
                <div className="w-72 flex-shrink-0">
                  <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-gray-200/20 dark:border-white/10 shadow-lg p-4 h-fit sticky top-6">
                    {activeTab === "experience" && <ExperienceSidebar />}
                    {activeTab === "project" && <ProjectSidebar />}
                    {activeTab === "education" && <EducationSidebar />}
                  </div>
                </div>
              )}

              {/* Main Content */}
              <div className="flex-1">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-gray-200/20 dark:border-white/10 shadow-lg h-full">
                  {renderActiveSection()}
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
