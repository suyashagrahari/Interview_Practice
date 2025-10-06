"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Calendar,
  Clock,
  User,
  Building,
  Briefcase,
  Star,
  Award,
  FileText,
  Users,
  Info,
} from "lucide-react";
import { Interview } from "@/lib/api/interview";

interface InterviewDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  interviewData: Interview | null;
  isLoading: boolean;
  isDarkMode?: boolean;
  onInterviewerClick?: () => void;
}

const InterviewDetailsModal: React.FC<InterviewDetailsModalProps> = ({
  isOpen,
  onClose,
  interviewData,
  isLoading,
  isDarkMode = false,
  onInterviewerClick,
}) => {
  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20";
      case "in_progress":
        return "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20";
      case "scheduled":
        return "text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20";
      case "cancelled":
        return "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20";
      case "paused":
        return "text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/20";
      default:
        return "text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "expert":
        return "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20";
      case "intermediate":
        return "text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20";
      case "beginner":
        return "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20";
      default:
        return "text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20";
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}>
        {/* Backdrop */}
        <div
          className={`absolute inset-0 ${
            isDarkMode ? "bg-black/60" : "bg-black/40"
          } backdrop-blur-sm`}
        />

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", duration: 0.3 }}
          className={`relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl ${
            isDarkMode
              ? "bg-slate-800 border border-slate-700"
              : "bg-white border border-slate-200"
          }`}
          onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div
            className={`flex items-center justify-between p-6 border-b ${
              isDarkMode ? "border-slate-700" : "border-slate-200"
            }`}>
            <div className="flex items-center space-x-3">
              <div
                className={`p-2 rounded-lg ${
                  isDarkMode ? "bg-slate-700" : "bg-slate-100"
                }`}>
                <FileText
                  className={`w-6 h-6 ${
                    isDarkMode ? "text-slate-300" : "text-slate-600"
                  }`}
                />
              </div>
              <div>
                <h2
                  className={`text-xl font-semibold ${
                    isDarkMode ? "text-white" : "text-slate-900"
                  }`}>
                  Interview Details
                </h2>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-slate-400" : "text-slate-500"
                  }`}>
                  Complete interview information
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode
                  ? "hover:bg-slate-700 text-slate-400 hover:text-slate-300"
                  : "hover:bg-slate-100 text-slate-500 hover:text-slate-700"
              }`}>
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
            {isLoading ? (
              <div className="p-6">
                <div className="space-y-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <div
                        className={`h-4 w-24 rounded animate-pulse ${
                          isDarkMode ? "bg-slate-700" : "bg-slate-200"
                        }`}
                      />
                      <div
                        className={`h-6 w-full rounded animate-pulse ${
                          isDarkMode ? "bg-slate-700" : "bg-slate-200"
                        }`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : interviewData ? (
              <div className="p-6 space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Job Information */}
                  <div
                    className={`p-4 rounded-xl ${
                      isDarkMode ? "bg-slate-700/50" : "bg-slate-50"
                    }`}>
                    <h3
                      className={`text-lg font-semibold mb-4 flex items-center space-x-2 ${
                        isDarkMode ? "text-white" : "text-slate-900"
                      }`}>
                      <Briefcase
                        className={`w-5 h-5 ${
                          isDarkMode ? "text-blue-400" : "text-blue-600"
                        }`}
                      />
                      <span>Job Information</span>
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label
                          className={`text-sm font-medium ${
                            isDarkMode ? "text-slate-400" : "text-slate-500"
                          }`}>
                          Position
                        </label>
                        <p
                          className={`text-base font-semibold ${
                            isDarkMode ? "text-white" : "text-slate-900"
                          }`}>
                          {interviewData.jobRole || "N/A"}
                        </p>
                      </div>
                      <div>
                        <label
                          className={`text-sm font-medium ${
                            isDarkMode ? "text-slate-400" : "text-slate-500"
                          }`}>
                          Level
                        </label>
                        <p
                          className={`text-base font-semibold ${
                            isDarkMode ? "text-white" : "text-slate-900"
                          }`}>
                          {interviewData.level || "N/A"}
                        </p>
                      </div>
                      <div>
                        <label
                          className={`text-sm font-medium ${
                            isDarkMode ? "text-slate-400" : "text-slate-500"
                          }`}>
                          Experience Level
                        </label>
                        <p
                          className={`text-base font-semibold ${
                            isDarkMode ? "text-white" : "text-slate-900"
                          }`}>
                          {interviewData.experienceLevel || "N/A"}
                        </p>
                      </div>
                      <div>
                        <label
                          className={`text-sm font-medium ${
                            isDarkMode ? "text-slate-400" : "text-slate-500"
                          }`}>
                          Difficulty
                        </label>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(
                            interviewData.difficultyLevel
                          )}`}>
                          {interviewData.difficultyLevel || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Interview Details */}
                  <div
                    className={`p-4 rounded-xl ${
                      isDarkMode ? "bg-slate-700/50" : "bg-slate-50"
                    }`}>
                    <h3
                      className={`text-lg font-semibold mb-4 flex items-center space-x-2 ${
                        isDarkMode ? "text-white" : "text-slate-900"
                      }`}>
                      <Calendar
                        className={`w-5 h-5 ${
                          isDarkMode ? "text-green-400" : "text-green-600"
                        }`}
                      />
                      <span>Interview Details</span>
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label
                          className={`text-sm font-medium ${
                            isDarkMode ? "text-slate-400" : "text-slate-500"
                          }`}>
                          Type
                        </label>
                        <p
                          className={`text-base font-semibold capitalize ${
                            isDarkMode ? "text-white" : "text-slate-900"
                          }`}>
                          {interviewData.interviewType || "N/A"}
                        </p>
                      </div>
                      <div>
                        <label
                          className={`text-sm font-medium ${
                            isDarkMode ? "text-slate-400" : "text-slate-500"
                          }`}>
                          Status
                        </label>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            interviewData.status
                          )}`}>
                          {interviewData.status?.replace("_", " ") || "N/A"}
                        </span>
                      </div>
                      <div>
                        <label
                          className={`text-sm font-medium ${
                            isDarkMode ? "text-slate-400" : "text-slate-500"
                          }`}>
                          Duration
                        </label>
                        <p
                          className={`text-base font-semibold ${
                            isDarkMode ? "text-white" : "text-slate-900"
                          }`}>
                          {interviewData.totalDuration
                            ? `${interviewData.totalDuration} minutes`
                            : "N/A"}
                        </p>
                      </div>
                      {interviewData.startedAt && (
                        <div>
                          <label
                            className={`text-sm font-medium ${
                              isDarkMode ? "text-slate-400" : "text-slate-500"
                            }`}>
                            Started At
                          </label>
                          <p
                            className={`text-base font-semibold ${
                              isDarkMode ? "text-white" : "text-slate-900"
                            }`}>
                            {formatDate(interviewData.startedAt)} at{" "}
                            {formatTime(interviewData.startedAt)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Company & Interviewer Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Company Information */}
                  {interviewData.companyName && (
                    <div
                      className={`p-4 rounded-xl ${
                        isDarkMode ? "bg-slate-700/50" : "bg-slate-50"
                      }`}>
                      <h3
                        className={`text-lg font-semibold mb-4 flex items-center space-x-2 ${
                          isDarkMode ? "text-white" : "text-slate-900"
                        }`}>
                        <Building
                          className={`w-5 h-5 ${
                            isDarkMode ? "text-purple-400" : "text-purple-600"
                          }`}
                        />
                        <span>Company</span>
                      </h3>
                      <div>
                        <p
                          className={`text-base font-semibold ${
                            isDarkMode ? "text-white" : "text-slate-900"
                          }`}>
                          {interviewData.companyName}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Interviewer Information */}
                  {interviewData.interviewer && (
                    <div
                      className={`p-4 rounded-xl cursor-pointer transition-all duration-200 hover:scale-105 ${
                        isDarkMode
                          ? "bg-slate-700/50 hover:bg-slate-700/70 border border-slate-600 hover:border-slate-500"
                          : "bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300"
                      }`}
                      onClick={onInterviewerClick}
                      title="Click to view detailed interviewer information">
                      <h3
                        className={`text-lg font-semibold mb-4 flex items-center justify-between ${
                          isDarkMode ? "text-white" : "text-slate-900"
                        }`}>
                        <div className="flex items-center space-x-2">
                          <Users
                            className={`w-5 h-5 ${
                              isDarkMode ? "text-orange-400" : "text-orange-600"
                            }`}
                          />
                          <span>Interviewer</span>
                        </div>
                        <Info
                          className={`w-4 h-4 ${
                            isDarkMode ? "text-slate-400" : "text-slate-500"
                          } opacity-60`}
                        />
                      </h3>
                      <div className="space-y-2">
                        <div>
                          <label
                            className={`text-sm font-medium ${
                              isDarkMode ? "text-slate-400" : "text-slate-500"
                            }`}>
                            Name
                          </label>
                          <p
                            className={`text-base font-semibold ${
                              isDarkMode ? "text-white" : "text-slate-900"
                            }`}>
                            {interviewData.interviewer.name}
                          </p>
                        </div>
                        <div>
                          <label
                            className={`text-sm font-medium ${
                              isDarkMode ? "text-slate-400" : "text-slate-500"
                            }`}>
                            Experience
                          </label>
                          <p
                            className={`text-base font-semibold ${
                              isDarkMode ? "text-white" : "text-slate-900"
                            }`}>
                            {interviewData.interviewer.experience}
                          </p>
                        </div>
                        {interviewData.interviewer.bio && (
                          <div>
                            <label
                              className={`text-sm font-medium ${
                                isDarkMode ? "text-slate-400" : "text-slate-500"
                              }`}>
                              Bio
                            </label>
                            <p
                              className={`text-sm ${
                                isDarkMode ? "text-slate-300" : "text-slate-600"
                              }`}>
                              {interviewData.interviewer.bio}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Skills */}
                {interviewData.skills && interviewData.skills.length > 0 && (
                  <div
                    className={`p-4 rounded-xl ${
                      isDarkMode ? "bg-slate-700/50" : "bg-slate-50"
                    }`}>
                    <h3
                      className={`text-lg font-semibold mb-4 flex items-center space-x-2 ${
                        isDarkMode ? "text-white" : "text-slate-900"
                      }`}>
                      <Award
                        className={`w-5 h-5 ${
                          isDarkMode ? "text-yellow-400" : "text-yellow-600"
                        }`}
                      />
                      <span>Required Skills</span>
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {interviewData.skills.map((skill, index) => (
                        <span
                          key={index}
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            isDarkMode
                              ? "bg-slate-600 text-slate-200"
                              : "bg-slate-200 text-slate-700"
                          }`}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Additional Notes */}
                {interviewData.additionalNotes && (
                  <div
                    className={`p-4 rounded-xl ${
                      isDarkMode ? "bg-slate-700/50" : "bg-slate-50"
                    }`}>
                    <h3
                      className={`text-lg font-semibold mb-4 flex items-center space-x-2 ${
                        isDarkMode ? "text-white" : "text-slate-900"
                      }`}>
                      <FileText
                        className={`w-5 h-5 ${
                          isDarkMode ? "text-indigo-400" : "text-indigo-600"
                        }`}
                      />
                      <span>Additional Notes</span>
                    </h3>
                    <p
                      className={`text-sm leading-relaxed ${
                        isDarkMode ? "text-slate-300" : "text-slate-600"
                      }`}>
                      {interviewData.additionalNotes}
                    </p>
                  </div>
                )}

                {/* Resume Information */}
                {interviewData.resume && (
                  <div
                    className={`p-4 rounded-xl ${
                      isDarkMode ? "bg-slate-700/50" : "bg-slate-50"
                    }`}>
                    <h3
                      className={`text-lg font-semibold mb-4 flex items-center space-x-2 ${
                        isDarkMode ? "text-white" : "text-slate-900"
                      }`}>
                      <FileText
                        className={`w-5 h-5 ${
                          isDarkMode ? "text-teal-400" : "text-teal-600"
                        }`}
                      />
                      <span>Resume Information</span>
                    </h3>
                    <div className="space-y-2">
                      <div>
                        <label
                          className={`text-sm font-medium ${
                            isDarkMode ? "text-slate-400" : "text-slate-500"
                          }`}>
                          File Name
                        </label>
                        <p
                          className={`text-base font-semibold ${
                            isDarkMode ? "text-white" : "text-slate-900"
                          }`}>
                          {interviewData.resume.originalFileName}
                        </p>
                      </div>
                      <div>
                        <label
                          className={`text-sm font-medium ${
                            isDarkMode ? "text-slate-400" : "text-slate-500"
                          }`}>
                          Resume Name
                        </label>
                        <p
                          className={`text-base font-semibold ${
                            isDarkMode ? "text-white" : "text-slate-900"
                          }`}>
                          {interviewData.resume.name}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6 text-center">
                <div
                  className={`p-4 rounded-xl ${
                    isDarkMode ? "bg-slate-700/50" : "bg-slate-50"
                  }`}>
                  <FileText
                    className={`w-12 h-12 mx-auto mb-4 ${
                      isDarkMode ? "text-slate-500" : "text-slate-400"
                    }`}
                  />
                  <h3
                    className={`text-lg font-semibold mb-2 ${
                      isDarkMode ? "text-white" : "text-slate-900"
                    }`}>
                    No Interview Data Available
                  </h3>
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-slate-400" : "text-slate-500"
                    }`}>
                    Unable to load interview details. Please try refreshing the
                    page.
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default InterviewDetailsModal;
