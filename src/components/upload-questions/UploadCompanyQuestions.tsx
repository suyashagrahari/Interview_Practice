"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/contexts/theme-context";
import { CompanyQuestionForm } from "./CompanyQuestionForm";
import { CompanyQuestionCards } from "./CompanyQuestionCards";
import { CompanyPublishModal } from "./CompanyPublishModal";
import {
  CompanyQuestionData,
  CompanyQuestionFormData,
} from "@/types/upload-questions";
import {
  CompanyTitleApiService,
  JobTitleApiService,
  Title,
} from "@/lib/api/titles";
import { CompanyQuestionApiService } from "@/lib/api/company-questions";
import { toast } from "@/utils/toast";

interface UploadCompanyQuestionsProps {
  onClose?: () => void;
}

export const UploadCompanyQuestions: React.FC<UploadCompanyQuestionsProps> = ({
  onClose,
}) => {
  const { theme, isDarkMode } = useTheme();
  const [questions, setQuestions] = useState<CompanyQuestionData[]>([]);
  const [editingQuestion, setEditingQuestion] =
    useState<CompanyQuestionData | null>(null);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [companies, setCompanies] = useState<Title[]>([]);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(true);
  const [companiesError, setCompaniesError] = useState<string | null>(null);
  const [jobTitles, setJobTitles] = useState<Title[]>([]);
  const [isLoadingJobTitles, setIsLoadingJobTitles] = useState(true);
  const [jobTitlesError, setJobTitlesError] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);

  // Fetch companies from API
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setIsLoadingCompanies(true);
        setCompaniesError(null);
        const response = await CompanyTitleApiService.getTitles({
          limit: 1000,
        });
        setCompanies(response.data.titles);
      } catch (error) {
        console.error("Error fetching companies:", error);
        setCompaniesError(
          error instanceof Error ? error.message : "Failed to fetch companies"
        );
      } finally {
        setIsLoadingCompanies(false);
      }
    };

    fetchCompanies();
  }, []);

  // Fetch job titles from API
  useEffect(() => {
    const fetchJobTitles = async () => {
      try {
        setIsLoadingJobTitles(true);
        setJobTitlesError(null);
        const response = await JobTitleApiService.getTitles({
          limit: 1000,
        });
        setJobTitles(response.data.titles);
      } catch (error) {
        console.error("Error fetching job titles:", error);
        setJobTitlesError(
          error instanceof Error ? error.message : "Failed to fetch job titles"
        );
      } finally {
        setIsLoadingJobTitles(false);
      }
    };

    fetchJobTitles();
  }, []);

  const handleAddQuestion = (formData: CompanyQuestionFormData) => {
    const newQuestion: CompanyQuestionData = {
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

  const handleEditQuestion = (question: CompanyQuestionData) => {
    setEditingQuestion(question);
  };

  const handleDeleteQuestion = (questionId: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== questionId));
  };

  const handlePublish = async (selectedQuestions: CompanyQuestionData[]) => {
    if (selectedQuestions.length === 0) {
      toast.error("Please select at least one question to publish");
      return;
    }

    try {
      setIsPublishing(true);

      // Transform questions to match API payload
      const questionsToPublish = selectedQuestions.map((q) => ({
        companyName: q.companyName,
        jobRole: q.jobRole,
        experienceLevel: q.experienceLevel,
        difficultyLevel: q.difficultyLevel,
        questionType: q.questionType,
        questionText: q.questionText,
        expectedAnswer: q.expectedAnswer,
        keywords: q.keywords,
        createdAt: q.createdAt,
      }));

      // Upload questions to backend
      const response = await CompanyQuestionApiService.uploadQuestions({
        questions: questionsToPublish,
      });

      toast.success(
        `Successfully published ${response.data.totalQuestions} question(s) to ${response.data.companies.length} company(s)`
      );

      // Close modal and reset form
      setIsPublishModalOpen(false);
      setQuestions([]);
    } catch (error) {
      console.error("Error publishing company questions:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to publish questions. Please try again."
      );
    } finally {
      setIsPublishing(false);
    }
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
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                Upload Company Questions
              </h1>
              <span className="text-sm text-gray-500 dark:text-gray-400 hidden lg:inline">
                |
              </span>
              <p className="text-sm text-gray-600 dark:text-gray-400 hidden lg:block">
                Create and manage company-based interview questions
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsPublishModalOpen(true)}
            disabled={questions.length === 0 || isPublishing}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
            <span className="flex items-center gap-1.5">
              {isPublishing ? (
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
              ) : (
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
              )}
              {isPublishing ? "Publishing..." : `Publish (${questions.length})`}
            </span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden gap-4 p-4">
        {/* Left Side - Question Form */}
        <div className="w-1/2 flex flex-col">
          <CompanyQuestionForm
            onSubmit={handleAddQuestion}
            editingQuestion={editingQuestion}
            onCancelEdit={() => setEditingQuestion(null)}
            isDarkMode={isDarkMode}
            companies={companies}
            isLoadingCompanies={isLoadingCompanies}
            companiesError={companiesError}
            jobTitles={jobTitles}
            isLoadingJobTitles={isLoadingJobTitles}
            jobTitlesError={jobTitlesError}
          />
        </div>

        {/* Right Side - Question Cards */}
        <div className="w-1/2 flex flex-col">
          <CompanyQuestionCards
            questions={questions}
            onEdit={handleEditQuestion}
            onDelete={handleDeleteQuestion}
            isDarkMode={isDarkMode}
          />
        </div>
      </div>

      {/* Publish Modal */}
      <CompanyPublishModal
        isOpen={isPublishModalOpen}
        questions={questions}
        onPublish={handlePublish}
        onCancel={handleCancelPublish}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};
