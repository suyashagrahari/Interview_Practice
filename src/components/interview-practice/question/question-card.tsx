import React from "react";
import { motion } from "framer-motion";
import {
  Lightbulb,
  Target,
  Code,
  CheckCircle,
} from "lucide-react";
import { DifficultyBadge } from "../ui/difficulty-badge";

export interface QuestionCardProps {
  question: {
    id: number | string;
    title: string;
    answer: string;
    level: "Beginner" | "Intermediate" | "Expert";
    keyPoints?: string[];
    example?: string;
    explanation?: string;
    author: {
      name: string;
    };
  };
  index: number;
  isSelected: boolean;
  isCompleted: boolean;
  currentPage: number;
  onToggleComplete: (questionId: string) => void;
  isFocusMode?: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  index,
  isSelected,
  isCompleted,
  currentPage,
  onToggleComplete,
  isFocusMode = false,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`${
        isFocusMode ? "mb-4" : "mb-6"
      } p-4 rounded-lg transition-all duration-300 ${
        isSelected
          ? "bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-blue-200 dark:border-blue-800"
          : "bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-white/20"
      }`}
      id={`question-${question.id}`}
    >
      {/* Question Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            Q{(currentPage - 1) * 25 + index + 1}
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              {question.title}
            </h2>
            <div className="flex items-center space-x-2 mt-1">
              <DifficultyBadge level={question.level} />
              <button
                onClick={() => onToggleComplete(question.id.toString())}
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                  isCompleted
                    ? "bg-green-500 border-green-500 text-white"
                    : "border-gray-300 dark:border-gray-600 hover:border-blue-500"
                }`}
              >
                {isCompleted && <CheckCircle className="w-3 h-3" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Answer */}
      <div className="mb-6">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
          <Lightbulb className="w-4 h-4 text-yellow-500 mr-2" />
          Answer
        </h3>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
          {question.answer}
        </p>
      </div>

      {/* Key Points */}
      {question.keyPoints && question.keyPoints.length > 0 && (
        <div className="mb-6">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
            <Target className="w-4 h-4 text-blue-500 mr-2" />
            Key Points
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {question.keyPoints.map((point, pointIndex) => (
              <motion.div
                key={pointIndex}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.5,
                  delay: pointIndex * 0.1,
                }}
                className="flex items-start space-x-2 p-2 bg-white/80 dark:bg-white/10 rounded-lg border border-gray-200/50 dark:border-white/20"
              >
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                <span className="text-gray-700 dark:text-gray-300 text-xs">
                  {point}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Example */}
      {question.example && (
        <div className="mb-6">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
            <Code className="w-4 h-4 text-green-500 mr-2" />
            Example
          </h3>
          <div className="bg-gray-900 dark:bg-gray-800 rounded-lg p-3 overflow-x-auto">
            <pre className="text-green-400 text-xs">
              <code>{question.example}</code>
            </pre>
          </div>
          {question.explanation && (
            <p className="text-gray-600 dark:text-gray-400 text-xs mt-2 italic">
              {question.explanation}
            </p>
          )}
        </div>
      )}

      {/* Author Information */}
      <div className="flex justify-end mt-4 pt-3 border-t border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
          <span>By</span>
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {question.author.name}
          </span>
        </div>
      </div>
    </motion.div>
  );
};
