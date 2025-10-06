"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  User,
  Star,
  Award,
  Briefcase,
  MessageCircle,
  Users,
} from "lucide-react";
import { Interviewer } from "@/lib/api/interviewer";

interface InterviewerDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  interviewerData: Interviewer | null;
  isLoading: boolean;
  isDarkMode?: boolean;
}

const InterviewerDetailsModal: React.FC<InterviewerDetailsModalProps> = ({
  isOpen,
  onClose,
  interviewerData,
  isLoading,
  isDarkMode = false,
}) => {
  if (!isOpen) return null;

  const getStatusColor = (isActive: boolean) => {
    return isActive
      ? "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20"
      : "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20";
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
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
          className={`relative w-full max-w-2xl max-h-[80vh] overflow-hidden rounded-2xl shadow-2xl ${
            isDarkMode
              ? "bg-slate-800 border border-slate-700"
              : "bg-white border border-slate-200"
          }`}
          onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div
            className={`flex items-center justify-between p-4 border-b ${
              isDarkMode ? "border-slate-700" : "border-slate-200"
            }`}>
            <div className="flex items-center space-x-3">
              <div
                className={`p-2 rounded-lg ${
                  isDarkMode ? "bg-slate-700" : "bg-slate-100"
                }`}>
                <User
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
                  Interviewer Details
                </h2>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-slate-400" : "text-slate-500"
                  }`}>
                  Complete interviewer information
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
          <div className="overflow-hidden">
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
            ) : interviewerData ? (
              <div className="p-4 space-y-4">
                {/* Profile Section */}
                <div className="flex items-start space-x-4">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div
                      className={`w-16 h-16 rounded-full overflow-hidden border-2 ${
                        isDarkMode ? "border-slate-600" : "border-slate-200"
                      }`}>
                      {(() => {
                        // Validate avatar URL
                        const isValidUrl = (url: string) => {
                          try {
                            new URL(url);
                            return true;
                          } catch {
                            return false;
                          }
                        };

                        const hasValidAvatar =
                          interviewerData.avatar &&
                          typeof interviewerData.avatar === "string" &&
                          interviewerData.avatar.length > 0 &&
                          interviewerData.avatar.trim() !== "" &&
                          !interviewerData.avatar.includes("ED") &&
                          (interviewerData.avatar.startsWith("http") ||
                            interviewerData.avatar.startsWith("/") ||
                            isValidUrl(interviewerData.avatar));

                        if (hasValidAvatar) {
                          return (
                            <img
                              src={interviewerData.avatar}
                              alt={interviewerData.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                console.warn(
                                  "Failed to load interviewer avatar in modal:",
                                  interviewerData.avatar
                                );
                                // Hide the image and show fallback
                                e.currentTarget.style.display = "none";
                                e.currentTarget.nextElementSibling?.classList.remove(
                                  "hidden"
                                );
                              }}
                            />
                          );
                        }

                        return (
                          <div
                            className={`w-full h-full flex items-center justify-center ${
                              isDarkMode ? "bg-slate-700" : "bg-slate-100"
                            }`}>
                            <User
                              className={`w-8 h-8 ${
                                isDarkMode ? "text-slate-400" : "text-slate-500"
                              }`}
                            />
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Basic Info */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h1
                        className={`text-xl font-bold ${
                          isDarkMode ? "text-white" : "text-slate-900"
                        }`}>
                        {interviewerData.name}
                      </h1>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          interviewerData.isActive
                        )}`}>
                        {interviewerData.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <p
                      className={`text-base font-semibold mb-2 ${
                        isDarkMode ? "text-slate-300" : "text-slate-600"
                      }`}>
                      {interviewerData.role}
                    </p>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        <Star
                          className={`w-4 h-4 ${
                            isDarkMode
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-yellow-500 fill-yellow-500"
                          }`}
                        />
                        <span
                          className={`text-sm font-medium ${
                            isDarkMode ? "text-slate-400" : "text-slate-500"
                          }`}>
                          {interviewerData.rating}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users
                          className={`w-3 h-3 ${
                            isDarkMode ? "text-slate-400" : "text-slate-500"
                          }`}
                        />
                        <span
                          className={`text-sm font-medium ${
                            isDarkMode ? "text-slate-400" : "text-slate-500"
                          }`}>
                          {interviewerData.numberOfInterviewers} interviews
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Experience and Bio */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Experience */}
                  <div
                    className={`p-3 rounded-lg ${
                      isDarkMode ? "bg-slate-700/50" : "bg-slate-50"
                    }`}>
                    <h3
                      className={`text-sm font-semibold mb-2 flex items-center space-x-2 ${
                        isDarkMode ? "text-white" : "text-slate-900"
                      }`}>
                      <Briefcase
                        className={`w-4 h-4 ${
                          isDarkMode ? "text-blue-400" : "text-blue-600"
                        }`}
                      />
                      <span>Experience</span>
                    </h3>
                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-slate-300" : "text-slate-600"
                      }`}>
                      {interviewerData.experience}
                    </p>
                  </div>

                  {/* Bio */}
                  <div
                    className={`p-3 rounded-lg ${
                      isDarkMode ? "bg-slate-700/50" : "bg-slate-50"
                    }`}>
                    <h3
                      className={`text-sm font-semibold mb-2 flex items-center space-x-2 ${
                        isDarkMode ? "text-white" : "text-slate-900"
                      }`}>
                      <MessageCircle
                        className={`w-4 h-4 ${
                          isDarkMode ? "text-green-400" : "text-green-600"
                        }`}
                      />
                      <span>About</span>
                    </h3>
                    <p
                      className={`text-xs leading-relaxed ${
                        isDarkMode ? "text-slate-300" : "text-slate-600"
                      }`}>
                      {interviewerData.bio}
                    </p>
                  </div>
                </div>

                {/* Introduction */}
                {interviewerData.introduction && (
                  <div
                    className={`p-3 rounded-lg ${
                      isDarkMode ? "bg-slate-700/50" : "bg-slate-50"
                    }`}>
                    <h3
                      className={`text-sm font-semibold mb-2 flex items-center space-x-2 ${
                        isDarkMode ? "text-white" : "text-slate-900"
                      }`}>
                      <MessageCircle
                        className={`w-4 h-4 ${
                          isDarkMode ? "text-purple-400" : "text-purple-600"
                        }`}
                      />
                      <span>Introduction</span>
                    </h3>
                    <p
                      className={`text-xs leading-relaxed ${
                        isDarkMode ? "text-slate-300" : "text-slate-600"
                      }`}>
                      {interviewerData.introduction}
                    </p>
                  </div>
                )}

                {/* Specialties */}
                {interviewerData.specialties &&
                  interviewerData.specialties.length > 0 && (
                    <div
                      className={`p-3 rounded-lg ${
                        isDarkMode ? "bg-slate-700/50" : "bg-slate-50"
                      }`}>
                      <h3
                        className={`text-sm font-semibold mb-2 flex items-center space-x-2 ${
                          isDarkMode ? "text-white" : "text-slate-900"
                        }`}>
                        <Award
                          className={`w-4 h-4 ${
                            isDarkMode ? "text-yellow-400" : "text-yellow-600"
                          }`}
                        />
                        <span>Specialties</span>
                      </h3>
                      <div className="flex flex-wrap gap-1">
                        {interviewerData.specialties.map((specialty, index) => (
                          <span
                            key={index}
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              isDarkMode
                                ? "bg-slate-600 text-slate-200"
                                : "bg-slate-200 text-slate-700"
                            }`}>
                            {specialty}
                          </span>
                        ))}
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
                  <User
                    className={`w-12 h-12 mx-auto mb-4 ${
                      isDarkMode ? "text-slate-500" : "text-slate-400"
                    }`}
                  />
                  <h3
                    className={`text-lg font-semibold mb-2 ${
                      isDarkMode ? "text-white" : "text-slate-900"
                    }`}>
                    No Interviewer Data Available
                  </h3>
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-slate-400" : "text-slate-500"
                    }`}>
                    Unable to load interviewer details. Please try refreshing
                    the page.
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

export default InterviewerDetailsModal;
