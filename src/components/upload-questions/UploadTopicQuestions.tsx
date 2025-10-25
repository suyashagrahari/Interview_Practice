"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/contexts/theme-context";
import { QuestionForm } from "./QuestionForm";
import { QuestionCards } from "./QuestionCards";
import { PublishModal } from "./PublishModal";
import { QuestionData, QuestionFormData } from "@/types/upload-questions";

interface UploadTopicQuestionsProps {
  onClose?: () => void;
}

export const UploadTopicQuestions: React.FC<UploadTopicQuestionsProps> = ({
  onClose,
}) => {
  const { theme, isDarkMode } = useTheme();
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [editingQuestion, setEditingQuestion] = useState<QuestionData | null>(
    null
  );
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  const handleAddQuestion = (formData: QuestionFormData) => {
    const newQuestion: QuestionData = {
      id: Date.now().toString(),
      ...formData,
      createdAt: new Date(),
    };

    if (editingQuestion) {
      // Update existing question
      setQuestions((prev) =>
        prev.map((q) => (q.id === editingQuestion.id ? newQuestion : q))
      );
      setEditingQuestion(null);
    } else {
      // Add new question
      setQuestions((prev) => [...prev, newQuestion]);
    }
  };

  const handleEditQuestion = (question: QuestionData) => {
    setEditingQuestion(question);
  };

  const handleDeleteQuestion = (questionId: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== questionId));
  };

  const handlePublish = async () => {
    // Here you would typically send the data to your backend API
    console.log("Publishing questions:", questions);
    setIsPublishModalOpen(false);
    // Reset form after successful publish
    setQuestions([]);
  };

  const handleCancelPublish = () => {
    setIsPublishModalOpen(false);
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-blue-900 dark:to-purple-900">
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-gray-200/20 dark:border-white/10 px-6 py-[1.1rem] shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                Upload Topic Questions
              </h1>
              <span className="text-sm text-gray-500 dark:text-gray-400 hidden lg:inline">
                |
              </span>
              <p className="text-sm text-gray-600 dark:text-gray-400 hidden lg:block">
                Create and manage topic-based interview questions
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsPublishModalOpen(true)}
            disabled={questions.length === 0}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
            <span className="flex items-center gap-1.5">
              <svg
                className="w-4 h-4"
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
              Publish ({questions.length})
            </span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden gap-4 p-4">
        {/* Left Side - Question Form */}
        <div className="w-1/2 flex flex-col">
          <QuestionForm
            onSubmit={handleAddQuestion}
            editingQuestion={editingQuestion}
            onCancelEdit={() => setEditingQuestion(null)}
            isDarkMode={isDarkMode}
          />
        </div>

        {/* Right Side - Question Cards */}
        <div className="w-1/2 flex flex-col">
          <QuestionCards
            questions={questions}
            onEdit={handleEditQuestion}
            onDelete={handleDeleteQuestion}
            isDarkMode={isDarkMode}
          />
        </div>
      </div>

      {/* Publish Modal */}
      <PublishModal
        isOpen={isPublishModalOpen}
        questions={questions}
        onPublish={handlePublish}
        onCancel={handleCancelPublish}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};
