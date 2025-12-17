"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Edit, Trash2, Tag, Calendar } from "lucide-react";
import { QuestionData } from "@/types/upload-questions";

interface QuestionCardsProps {
  questions: QuestionData[];
  onEdit: (question: QuestionData) => void;
  onDelete: (questionId: string) => void;
  isDarkMode: boolean;
}

export const QuestionCards: React.FC<QuestionCardsProps> = ({
  questions,
  onEdit,
  onDelete,
  isDarkMode,
}) => {
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

  if (questions.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl border border-gray-200/20 dark:border-white/10 shadow-xl">
        <div className="text-center">
          <div className="w-14 h-14 mx-auto mb-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Tag className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
            No questions yet
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Add your first question using the form on the left
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl border border-gray-200/20 dark:border-white/10 shadow-xl p-4 overflow-hidden">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
          Questions ({questions.length})
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-1">
        <AnimatePresence>
          {questions.map((question, index) => (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className="bg-white dark:bg-slate-700/50 rounded-xl border border-gray-200/50 dark:border-slate-600/50 p-3 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-lg">
                      #{index + 1}
                    </span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white truncate">
                      {question.topicName}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-xs line-clamp-2 leading-relaxed">
                    {question.questionText}
                  </p>
                </div>
                <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                  <button
                    onClick={() => onEdit(question)}
                    className="p-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
                    title="Edit question">
                    <Edit className="w-3.5 h-3.5 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400" />
                  </button>
                  <button
                    onClick={() => onDelete(question.id)}
                    className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                    title="Delete question">
                    <Trash2 className="w-3.5 h-3.5 text-gray-500 hover:text-red-600 dark:hover:text-red-400" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-1.5 mb-2">
                <span
                  className={`px-2 py-0.5 rounded-lg text-xs font-semibold border ${getExperienceColor(
                    question.experienceLevel
                  )}`}>
                  {question.experienceLevel} years
                </span>
                <span
                  className={`px-2 py-0.5 rounded-lg text-xs font-semibold border ${getDifficultyColor(
                    question.difficultyLevel
                  )}`}>
                  {question.difficultyLevel}
                </span>
              </div>

              {question.keywords.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {question.keywords.slice(0, 2).map((keyword, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 rounded-md text-xs font-medium border border-blue-200/50 dark:border-blue-800/50">
                      <Tag className="w-2.5 h-2.5" />
                      {keyword}
                    </span>
                  ))}
                  {question.keywords.length > 2 && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 px-1.5 py-0.5">
                      +{question.keywords.length - 2}
                    </span>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-1 border-t border-gray-200/50 dark:border-slate-600/50">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span className="font-medium">
                    {question.createdAt.toLocaleDateString()}
                  </span>
                </div>
                <span className="truncate max-w-[150px] text-[10px]">
                  {question.expectedAnswer.length > 60
                    ? `${question.expectedAnswer.substring(0, 60)}...`
                    : question.expectedAnswer}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
