"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/contexts/theme-context";
import { TitlePublishModal } from "./TitlePublishModal";

interface Title {
  id: string;
  text: string;
  createdAt: Date;
}

interface UploadTitleProps {
  onClose?: () => void;
}

export const UploadTitle: React.FC<UploadTitleProps> = ({ onClose }) => {
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState<"company" | "topic" | "job">(
    "company"
  );
  const [companyTitleInput, setCompanyTitleInput] = useState("");
  const [topicTitleInput, setTopicTitleInput] = useState("");
  const [jobTitleInput, setJobTitleInput] = useState("");
  const [companyTitles, setCompanyTitles] = useState<Title[]>([]);
  const [topicTitles, setTopicTitles] = useState<Title[]>([]);
  const [jobTitles, setJobTitles] = useState<Title[]>([]);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  const handleAddCompanyTitle = () => {
    if (companyTitleInput.trim()) {
      const newTitle: Title = {
        id: Date.now().toString(),
        text: companyTitleInput.trim(),
        createdAt: new Date(),
      };
      setCompanyTitles((prev) => [...prev, newTitle]);
      setCompanyTitleInput("");
    }
  };

  const handleAddTopicTitle = () => {
    if (topicTitleInput.trim()) {
      const newTitle: Title = {
        id: Date.now().toString(),
        text: topicTitleInput.trim(),
        createdAt: new Date(),
      };
      setTopicTitles((prev) => [...prev, newTitle]);
      setTopicTitleInput("");
    }
  };

  const handleAddJobTitle = () => {
    if (jobTitleInput.trim()) {
      const newTitle: Title = {
        id: Date.now().toString(),
        text: jobTitleInput.trim(),
        createdAt: new Date(),
      };
      setJobTitles((prev) => [...prev, newTitle]);
      setJobTitleInput("");
    }
  };

  const handleDeleteCompanyTitle = (id: string) => {
    setCompanyTitles((prev) => prev.filter((t) => t.id !== id));
  };

  const handleDeleteTopicTitle = (id: string) => {
    setTopicTitles((prev) => prev.filter((t) => t.id !== id));
  };

  const handleDeleteJobTitle = (id: string) => {
    setJobTitles((prev) => prev.filter((t) => t.id !== id));
  };

  const handleKeyPress = (e: React.KeyboardEvent, addFunction: () => void) => {
    if (e.key === "Enter") {
      addFunction();
    }
  };

  const handlePublish = async () => {
    try {
      // Import API services dynamically
      const {
        CompanyTitleApiService,
        TopicTitleApiService,
        JobTitleApiService,
      } = await import("@/lib/api/titles");
      const { toast } = await import("@/utils/toast");

      let totalPublished = 0;

      // Publish company titles if any exist
      if (companyTitles.length > 0) {
        const result = await CompanyTitleApiService.createTitles(companyTitles);
        totalPublished += result.data.created;
      }

      // Publish topic titles if any exist
      if (topicTitles.length > 0) {
        const result = await TopicTitleApiService.createTitles(topicTitles);
        totalPublished += result.data.created;
      }

      // Publish job titles if any exist
      if (jobTitles.length > 0) {
        const result = await JobTitleApiService.createTitles(jobTitles);
        totalPublished += result.data.created;
      }

      // Show success message
      if (totalPublished > 0) {
        toast.success(`Successfully published ${totalPublished} title(s)!`);
      }

      // Close modal and reset
      setIsPublishModalOpen(false);
      setCompanyTitles([]);
      setTopicTitles([]);
      setJobTitles([]);
    } catch (error) {
      console.error("Error publishing titles:", error);
      const { toast } = await import("@/utils/toast");
      toast.error("Failed to publish titles. Please try again.");
    }
  };

  const handleCancelPublish = () => {
    setIsPublishModalOpen(false);
  };

  const getTotalTitles = () =>
    companyTitles.length + topicTitles.length + jobTitles.length;
  const hasTitles =
    companyTitles.length > 0 || topicTitles.length > 0 || jobTitles.length > 0;

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-blue-900 dark:to-purple-900">
      {/* Compact Header */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-gray-200/20 dark:border-white/10 px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                />
              </svg>
            </div>
            <h1 className="text-base font-bold text-gray-900 dark:text-white">
              Upload Title
            </h1>
          </div>
          <button
            onClick={() => setIsPublishModalOpen(true)}
            disabled={!hasTitles}
            className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white rounded-lg text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg">
            <span className="flex items-center gap-1.5">
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Publish ({getTotalTitles()})
            </span>
          </button>
        </div>
      </div>

      {/* Main Content - More Compact */}
      <div className="flex-1 flex flex-col overflow-hidden p-4">
        {/* Enhanced Tab Buttons with Better Colors */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab("company")}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
              activeTab === "company"
                ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md"
                : "bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500"
            }`}>
            Upload Company Title
          </button>
          <button
            onClick={() => setActiveTab("topic")}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
              activeTab === "topic"
                ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-md"
                : "bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-purple-400 dark:hover:border-purple-500"
            }`}>
            Upload Topic Title
          </button>
          <button
            onClick={() => setActiveTab("job")}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
              activeTab === "job"
                ? "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-md"
                : "bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-emerald-400 dark:hover:border-emerald-500"
            }`}>
            Upload Job Title
          </button>
        </div>

        {/* Compact Input Section */}
        <div className="bg-white dark:bg-slate-800 rounded-lg p-3 shadow-sm mb-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={
                activeTab === "company"
                  ? companyTitleInput
                  : activeTab === "topic"
                  ? topicTitleInput
                  : jobTitleInput
              }
              onChange={(e) =>
                activeTab === "company"
                  ? setCompanyTitleInput(e.target.value)
                  : activeTab === "topic"
                  ? setTopicTitleInput(e.target.value)
                  : setJobTitleInput(e.target.value)
              }
              onKeyPress={(e) =>
                handleKeyPress(
                  e,
                  activeTab === "company"
                    ? handleAddCompanyTitle
                    : activeTab === "topic"
                    ? handleAddTopicTitle
                    : handleAddJobTitle
                )
              }
              placeholder={
                activeTab === "company"
                  ? "Enter Company Title"
                  : activeTab === "topic"
                  ? "Enter Topic Title"
                  : "Enter Job Title"
              }
              className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={
                activeTab === "company"
                  ? handleAddCompanyTitle
                  : activeTab === "topic"
                  ? handleAddTopicTitle
                  : handleAddJobTitle
              }
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg text-sm">
              Add
            </button>
          </div>
        </div>

        {/* Compact Display Section with Dynamic Sizing */}
        <div className="flex-1 overflow-y-auto bg-white dark:bg-slate-800 rounded-lg p-3 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
            {activeTab === "company"
              ? "Company Titles"
              : activeTab === "topic"
              ? "Topic Titles"
              : "Job Titles"}{" "}
            (
            {activeTab === "company"
              ? companyTitles.length
              : activeTab === "topic"
              ? topicTitles.length
              : jobTitles.length}
            )
          </h3>
          <div className="flex flex-wrap gap-2">
            {activeTab === "company"
              ? companyTitles.map((title) => (
                  <motion.div
                    key={title.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 border border-blue-400 dark:border-blue-500 hover:shadow-md transition-all duration-200 group">
                    <span className="text-white text-sm font-medium whitespace-nowrap">
                      {title.text}
                    </span>
                    <button
                      onClick={() => handleDeleteCompanyTitle(title.id)}
                      className="opacity-80 hover:opacity-100 transition-opacity duration-200 rounded-full hover:bg-white/20 p-0.5">
                      <svg
                        className="w-3.5 h-3.5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </motion.div>
                ))
              : activeTab === "topic"
              ? topicTitles.map((title) => (
                  <motion.div
                    key={title.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 border border-blue-400 dark:border-blue-500 hover:shadow-md transition-all duration-200 group">
                    <span className="text-white text-sm font-medium whitespace-nowrap">
                      {title.text}
                    </span>
                    <button
                      onClick={() => handleDeleteTopicTitle(title.id)}
                      className="opacity-80 hover:opacity-100 transition-opacity duration-200 rounded-full hover:bg-white/20 p-0.5">
                      <svg
                        className="w-3.5 h-3.5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </motion.div>
                ))
              : jobTitles.map((title) => (
                  <motion.div
                    key={title.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 dark:from-emerald-600 dark:to-teal-700 border border-emerald-400 dark:border-emerald-500 hover:shadow-md transition-all duration-200 group">
                    <span className="text-white text-sm font-medium whitespace-nowrap">
                      {title.text}
                    </span>
                    <button
                      onClick={() => handleDeleteJobTitle(title.id)}
                      className="opacity-80 hover:opacity-100 transition-opacity duration-200 rounded-full hover:bg-white/20 p-0.5">
                      <svg
                        className="w-3.5 h-3.5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </motion.div>
                ))}
          </div>
          {((activeTab === "company" && companyTitles.length === 0) ||
            (activeTab === "topic" && topicTitles.length === 0) ||
            (activeTab === "job" && jobTitles.length === 0)) && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
              No{" "}
              {activeTab === "company"
                ? "company"
                : activeTab === "topic"
                ? "topic"
                : "job"}{" "}
              titles added yet
            </div>
          )}
        </div>
      </div>

      {/* Publish Modal */}
      <TitlePublishModal
        isOpen={isPublishModalOpen}
        companyTitles={companyTitles}
        topicTitles={topicTitles}
        jobTitles={jobTitles}
        onPublish={handlePublish}
        onCancel={handleCancelPublish}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};
