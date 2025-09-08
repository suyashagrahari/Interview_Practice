"use client";

import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { setActiveTab } from "@/store/slices/profileSlice";
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
        <div className="sticky top-0 z-50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b-2 dark:border-b border-gray-200/20 dark:border-white/10 shadow-lg">
          <div className="px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <User className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Profile Management
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Manage your professional profile and resume information
                  </p>
                </div>
              </div>
              {onClose && (
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tab Navigation - Sticky */}
        <div className="mt-4 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-b border-gray-200/20 dark:border-white/10 shadow-md">
          <div className="px-6 py-4">
            <nav className="flex space-x-2 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 whitespace-nowrap ${
                      isActive
                        ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 dark:from-blue-500/30 dark:to-purple-500/30 text-blue-700 dark:text-blue-200 border border-blue-500/30 dark:border-blue-500/50 shadow-md"
                        : "text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-300 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 dark:hover:from-blue-500/10 dark:hover:to-purple-500/10 hover:shadow-sm"
                    }`}>
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="h-full p-6">
            <div className="flex gap-6 h-full">
              {/* Left Sidebar for Experience/Project/Education - Only when needed */}
              {(activeTab === "experience" ||
                activeTab === "project" ||
                activeTab === "education") && (
                <div className="w-80 flex-shrink-0">
                  <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/20 dark:border-white/10 shadow-xl p-6 h-fit sticky top-6">
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
                  className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/20 dark:border-white/10 shadow-xl h-full">
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
