"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Title {
  id: string;
  text: string;
  createdAt: Date;
}

interface TitlePublishModalProps {
  isOpen: boolean;
  companyTitles: Title[];
  topicTitles: Title[];
  jobTitles: Title[];
  onPublish: () => void;
  onCancel: () => void;
  isDarkMode: boolean;
}

export const TitlePublishModal: React.FC<TitlePublishModalProps> = ({
  isOpen,
  companyTitles,
  topicTitles,
  jobTitles,
  onPublish,
  onCancel,
  isDarkMode,
}) => {
  const [companyTitlesToPublish, setCompanyTitlesToPublish] =
    useState<Title[]>(companyTitles);
  const [topicTitlesToPublish, setTopicTitlesToPublish] =
    useState<Title[]>(topicTitles);
  const [jobTitlesToPublish, setJobTitlesToPublish] =
    useState<Title[]>(jobTitles);

  // Update local state when props change
  React.useEffect(() => {
    setCompanyTitlesToPublish(companyTitles);
    setTopicTitlesToPublish(topicTitles);
    setJobTitlesToPublish(jobTitles);
  }, [companyTitles, topicTitles, jobTitles]);

  const handleRemoveCompanyTitle = (id: string) => {
    setCompanyTitlesToPublish((prev) => prev.filter((t) => t.id !== id));
  };

  const handleRemoveTopicTitle = (id: string) => {
    setTopicTitlesToPublish((prev) => prev.filter((t) => t.id !== id));
  };

  const handleRemoveJobTitle = (id: string) => {
    setJobTitlesToPublish((prev) => prev.filter((t) => t.id !== id));
  };

  const totalTitles =
    companyTitlesToPublish.length +
    topicTitlesToPublish.length +
    jobTitlesToPublish.length;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`w-full max-w-2xl max-h-[70vh] rounded-xl shadow-2xl overflow-hidden ${
              isDarkMode ? "bg-slate-800 text-white" : "bg-white text-gray-900"
            }`}>
            {/* Compact Header */}
            <div
              className={`px-4 py-3 border-b ${
                isDarkMode
                  ? "border-gray-700 bg-slate-900"
                  : "border-gray-200 bg-gray-50"
              }`}>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold">
                    Review & Publish Titles
                  </h2>
                  <p
                    className={`text-xs mt-0.5 ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}>
                    Remove any titles you don't want to publish
                  </p>
                </div>
                <button
                  onClick={onCancel}
                  className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content with Dynamic Chips */}
            <div className="overflow-y-auto max-h-[45vh] px-4 py-3 space-y-4">
              {/* Company Titles */}
              {companyTitlesToPublish.length > 0 && (
                <div>
                  <h3
                    className={`text-sm font-semibold mb-2 ${
                      isDarkMode ? "text-blue-400" : "text-blue-600"
                    }`}>
                    Company Titles ({companyTitlesToPublish.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {companyTitlesToPublish.map((title) => (
                      <motion.div
                        key={title.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 border border-blue-400 dark:border-blue-500 shadow-sm group">
                        <span className="text-white text-xs font-medium whitespace-nowrap">
                          {title.text}
                        </span>
                        <button
                          onClick={() => handleRemoveCompanyTitle(title.id)}
                          className="opacity-80 hover:opacity-100 transition-opacity duration-200 rounded-full hover:bg-white/20 p-0.5">
                          <svg
                            className="w-3 h-3 text-white"
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
                </div>
              )}

              {/* Topic Titles */}
              {topicTitlesToPublish.length > 0 && (
                <div>
                  <h3
                    className={`text-sm font-semibold mb-2 ${
                      isDarkMode ? "text-purple-400" : "text-purple-600"
                    }`}>
                    Topic Titles ({topicTitlesToPublish.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {topicTitlesToPublish.map((title) => (
                      <motion.div
                        key={title.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700 border border-purple-400 dark:border-purple-500 shadow-sm group">
                        <span className="text-white text-xs font-medium whitespace-nowrap">
                          {title.text}
                        </span>
                        <button
                          onClick={() => handleRemoveTopicTitle(title.id)}
                          className="opacity-80 hover:opacity-100 transition-opacity duration-200 rounded-full hover:bg-white/20 p-0.5">
                          <svg
                            className="w-3 h-3 text-white"
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
                </div>
              )}

              {/* Job Titles */}
              {jobTitlesToPublish.length > 0 && (
                <div>
                  <h3
                    className={`text-sm font-semibold mb-2 ${
                      isDarkMode ? "text-emerald-400" : "text-emerald-600"
                    }`}>
                    Job Titles ({jobTitlesToPublish.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {jobTitlesToPublish.map((title) => (
                      <motion.div
                        key={title.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 dark:from-emerald-600 dark:to-emerald-700 border border-emerald-400 dark:border-emerald-500 shadow-sm group">
                        <span className="text-white text-xs font-medium whitespace-nowrap">
                          {title.text}
                        </span>
                        <button
                          onClick={() => handleRemoveJobTitle(title.id)}
                          className="opacity-80 hover:opacity-100 transition-opacity duration-200 rounded-full hover:bg-white/20 p-0.5">
                          <svg
                            className="w-3 h-3 text-white"
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
                </div>
              )}

              {/* Empty State */}
              {totalTitles === 0 && (
                <div className="text-center py-8 text-gray-500 text-sm">
                  <p>No titles to publish</p>
                </div>
              )}
            </div>

            {/* Compact Footer */}
            <div
              className={`px-4 py-3 border-t flex items-center justify-end gap-2 ${
                isDarkMode
                  ? "border-gray-700 bg-slate-900"
                  : "border-gray-200 bg-gray-50"
              }`}>
              <button
                onClick={onCancel}
                className="px-3 py-1.5 rounded-lg font-medium text-sm transition-all duration-200 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                Cancel
              </button>
              <button
                onClick={() => {
                  onPublish();
                }}
                disabled={totalTitles === 0}
                className="px-4 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white rounded-lg font-medium text-sm transition-all duration-200 shadow-md hover:shadow-lg disabled:shadow-none">
                Publish {totalTitles > 0 && `(${totalTitles})`}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
