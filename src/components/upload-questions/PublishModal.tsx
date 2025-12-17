"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Tag, Calendar, User, AlertCircle } from "lucide-react";
import { QuestionData } from "@/types/upload-questions";

interface PublishModalProps {
  isOpen: boolean;
  questions: QuestionData[];
  onPublish: (selectedQuestions: QuestionData[]) => void;
  onCancel: () => void;
  isDarkMode: boolean;
}

export const PublishModal: React.FC<PublishModalProps> = ({
  isOpen,
  questions,
  onPublish,
  onCancel,
  isDarkMode,
}) => {
  const [selectedQuestions, setSelectedQuestions] = useState<Set<string>>(
    new Set(questions.map((q) => q.id))
  );

  const handleToggleQuestion = (questionId: string) => {
    setSelectedQuestions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedQuestions.size === questions.length) {
      setSelectedQuestions(new Set());
    } else {
      setSelectedQuestions(new Set(questions.map((q) => q.id)));
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "expert":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  const getExperienceColor = (experience: string) => {
    switch (experience) {
      case "0-2":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "3-4":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300";
      case "5-6":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      case "7-8":
        return "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300";
      case "9-10":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  const selectedQuestionsData = questions.filter((q) =>
    selectedQuestions.has(q.id)
  );
  const isAllSelected = selectedQuestions.size === questions.length;
  const isSomeSelected = selectedQuestions.size > 0;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onCancel}>
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
              isDarkMode ? "border-slate-700" : "border-gray-200"
            }`}>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Publish Questions
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Review and confirm your questions before publishing
              </p>
            </div>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            {/* Selection Controls */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleSelectAll}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                    isAllSelected
                      ? "bg-blue-600 text-white border-blue-600"
                      : isSomeSelected
                      ? "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800"
                      : "bg-gray-50 text-gray-600 border-gray-200 dark:bg-slate-700 dark:text-gray-400 dark:border-slate-600"
                  }`}>
                  <Check className="w-4 h-4" />
                  {isAllSelected ? "Deselect All" : "Select All"}
                </button>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedQuestions.size} of {questions.length} selected
                </span>
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-4">
              {questions.map((question, index) => {
                const isSelected = selectedQuestions.has(question.id);
                return (
                  <motion.div
                    key={question.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600"
                    }`}
                    onClick={() => handleToggleQuestion(question.id)}>
                    <div className="flex items-start gap-4">
                      {/* Checkbox */}
                      <div
                        className={`w-6 h-6 rounded border-2 flex items-center justify-center mt-1 ${
                          isSelected
                            ? "bg-blue-600 border-blue-600"
                            : "border-gray-300 dark:border-slate-600"
                        }`}>
                        {isSelected && <Check className="w-4 h-4 text-white" />}
                      </div>

                      {/* Question Content */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            #{index + 1}
                          </span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {question.topicName}
                          </span>
                        </div>

                        <p className="text-gray-700 dark:text-gray-300 mb-3 line-clamp-2">
                          {question.questionText}
                        </p>

                        <div className="flex items-center gap-2 mb-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getExperienceColor(
                              question.experienceLevel
                            )}`}>
                            {question.experienceLevel} years
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                              question.difficultyLevel
                            )}`}>
                            {question.difficultyLevel}
                          </span>
                        </div>

                        {question.keywords.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {question.keywords
                              .slice(0, 5)
                              .map((keyword, idx) => (
                                <span
                                  key={idx}
                                  className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 rounded text-xs">
                                  <Tag className="w-3 h-3" />
                                  {keyword}
                                </span>
                              ))}
                            {question.keywords.length > 5 && (
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                +{question.keywords.length - 5} more
                              </span>
                            )}
                          </div>
                        )}

                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-1 mb-1">
                            <Calendar className="w-3 h-3" />
                            Created: {question.createdAt.toLocaleDateString()}
                          </div>
                          <div className="line-clamp-2">
                            <strong>Answer:</strong> {question.expectedAnswer}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {questions.length === 0 && (
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No questions to publish
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Add some questions first before publishing
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div
            className={`flex items-center justify-between p-6 border-t ${
              isDarkMode ? "border-slate-700" : "border-gray-200"
            }`}>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {selectedQuestionsData.length} question
              {selectedQuestionsData.length !== 1 ? "s" : ""} selected
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onCancel}
                className="px-6 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
                Cancel
              </button>
              <button
                onClick={() => onPublish(selectedQuestionsData)}
                disabled={selectedQuestionsData.length === 0}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors duration-200">
                Publish ({selectedQuestionsData.length})
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
