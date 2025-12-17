import React from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

export interface QuestionListItem {
  id: string | number;
  title: string;
}

interface QuestionListSidebarProps {
  questions: QuestionListItem[];
  selectedQuestionId: string;
  completedQuestions: Set<string>;
  currentPage: number;
  onQuestionClick: (questionId: string) => void;
}

export const QuestionListSidebar: React.FC<QuestionListSidebarProps> = ({
  questions,
  selectedQuestionId,
  completedQuestions,
  currentPage,
  onQuestionClick,
}) => {
  return (
    <div className="space-y-2 max-h-[600px] overflow-y-auto custom-scrollbar-thin pr-2">
      {questions.map((question, index) => (
        <motion.button
          key={question.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.3 + index * 0.1,
          }}
          onClick={() => onQuestionClick(question.id.toString())}
          className={`w-full text-left p-3 rounded-lg transition-all duration-200 border-2 ${
            selectedQuestionId === question.id.toString()
              ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md border-blue-400"
              : "hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 border-transparent hover:border-blue-200 dark:hover:border-blue-700"
          }`}
        >
          <div className="flex items-center space-x-3">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-200 ${
                selectedQuestionId === question.id.toString()
                  ? "bg-white/20 scale-110"
                  : "bg-gray-100 dark:bg-gray-700 hover:scale-105"
              }`}
            >
              <span
                className={`text-xs font-bold ${
                  selectedQuestionId === question.id.toString()
                    ? "text-white"
                    : "text-gray-600 dark:text-gray-300"
                }`}
              >
                {(currentPage - 1) * 25 + index + 1}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium leading-tight line-clamp-3">
                {question.title}
              </div>
              {completedQuestions.has(question.id.toString()) && (
                <div className="flex items-center mt-1">
                  <CheckCircle className="w-3 h-3 text-green-500 mr-1" />
                  <span className="text-xs text-green-600 dark:text-green-400">
                    Completed
                  </span>
                </div>
              )}
            </div>
          </div>
        </motion.button>
      ))}
    </div>
  );
};
