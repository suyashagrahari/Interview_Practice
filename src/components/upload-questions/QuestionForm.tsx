"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Plus, Tag } from "lucide-react";
import {
  QuestionFormData,
  QuestionData,
  ExperienceLevel,
  DifficultyLevel,
} from "@/types/upload-questions";

interface QuestionFormProps {
  onSubmit: (data: QuestionFormData) => void;
  editingQuestion: QuestionData | null;
  onCancelEdit: () => void;
  isDarkMode: boolean;
}

const EXPERIENCE_LEVELS: { value: ExperienceLevel; label: string }[] = [
  { value: "0-2", label: "0-2 years" },
  { value: "3-4", label: "3-4 years" },
  { value: "5-6", label: "5-6 years" },
  { value: "7-8", label: "7-8 years" },
  { value: "9-10", label: "9-10 years" },
];

const DIFFICULTY_LEVELS: { value: DifficultyLevel; label: string }[] = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "expert", label: "Expert" },
];

export const QuestionForm: React.FC<QuestionFormProps> = ({
  onSubmit,
  editingQuestion,
  onCancelEdit,
  isDarkMode,
}) => {
  const [formData, setFormData] = useState<QuestionFormData>({
    topicName: "",
    experienceLevel: "0-2",
    difficultyLevel: "beginner",
    questionText: "",
    expectedAnswer: "",
    keywords: [],
  });

  const [newKeyword, setNewKeyword] = useState("");

  useEffect(() => {
    if (editingQuestion) {
      setFormData({
        topicName: editingQuestion.topicName,
        experienceLevel: editingQuestion.experienceLevel,
        difficultyLevel: editingQuestion.difficultyLevel,
        questionText: editingQuestion.questionText,
        expectedAnswer: editingQuestion.expectedAnswer,
        keywords: editingQuestion.keywords,
      });
    } else {
      setFormData({
        topicName: "",
        experienceLevel: "0-2",
        difficultyLevel: "beginner",
        questionText: "",
        expectedAnswer: "",
        keywords: [],
      });
    }
  }, [editingQuestion]);

  const handleInputChange = (field: keyof QuestionFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSelectChange = (
    field: keyof QuestionFormData,
    value: ExperienceLevel | DifficultyLevel
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddKeyword = () => {
    if (newKeyword.trim() && !formData.keywords.includes(newKeyword.trim())) {
      setFormData((prev) => ({
        ...prev,
        keywords: [...prev.keywords, newKeyword.trim()],
      }));
      setNewKeyword("");
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setFormData((prev) => ({
      ...prev,
      keywords: prev.keywords.filter((k) => k !== keyword),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      formData.topicName.trim() &&
      formData.questionText.trim() &&
      formData.expectedAnswer.trim()
    ) {
      onSubmit(formData);
      if (!editingQuestion) {
        setFormData({
          topicName: "",
          experienceLevel: "0-2",
          difficultyLevel: "beginner",
          questionText: "",
          expectedAnswer: "",
          keywords: [],
        });
      }
    }
  };

  const isFormValid =
    formData.topicName.trim() &&
    formData.questionText.trim() &&
    formData.expectedAnswer.trim();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full flex flex-col">
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl border border-gray-200/20 dark:border-white/10 shadow-xl p-5 h-full flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {editingQuestion ? "Edit Question" : "Add New Question"}
            </h2>
          </div>
          {editingQuestion && (
            <button
              onClick={onCancelEdit}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
              <X className="w-4 h-4 text-gray-500" />
            </button>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-1 flex flex-col space-y-4 overflow-y-auto custom-scrollbar pr-1">
          {/* Topic Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">
              Topic Name
            </label>
            <input
              type="text"
              value={formData.topicName}
              onChange={(e) => handleInputChange("topicName", e.target.value)}
              placeholder="Enter topic name"
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all"
              required
            />
          </div>

          {/* Experience and Difficulty Level */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">
                Experience
              </label>
              <select
                value={formData.experienceLevel}
                onChange={(e) =>
                  handleSelectChange(
                    "experienceLevel",
                    e.target.value as ExperienceLevel
                  )
                }
                className="w-full px-3.5 py-2.5 text-sm border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700/50 text-gray-900 dark:text-white transition-all cursor-pointer">
                {EXPERIENCE_LEVELS.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">
                Difficulty
              </label>
              <select
                value={formData.difficultyLevel}
                onChange={(e) =>
                  handleSelectChange(
                    "difficultyLevel",
                    e.target.value as DifficultyLevel
                  )
                }
                className="w-full px-3.5 py-2.5 text-sm border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700/50 text-gray-900 dark:text-white transition-all cursor-pointer">
                {DIFFICULTY_LEVELS.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Question Text */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">
              Question Text
            </label>
            <textarea
              value={formData.questionText}
              onChange={(e) =>
                handleInputChange("questionText", e.target.value)
              }
              placeholder="Enter your question here..."
              rows={3}
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-none transition-all"
              required
            />
          </div>

          {/* Expected Answer */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">
              Expected Answer
            </label>
            <textarea
              value={formData.expectedAnswer}
              onChange={(e) =>
                handleInputChange("expectedAnswer", e.target.value)
              }
              placeholder="Enter the expected answer..."
              rows={3}
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-none transition-all"
              required
            />
          </div>

          {/* Keywords Section */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">
              Keywords
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                placeholder="Add keyword"
                className="flex-1 px-3 py-2 text-sm border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all"
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), handleAddKeyword())
                }
              />
              <button
                type="button"
                onClick={handleAddKeyword}
                className="px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all duration-200 flex items-center gap-1.5 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                <Plus className="w-4 h-4" />
                <span className="text-sm font-medium">Add</span>
              </button>
            </div>

            {/* Keywords Display */}
            {formData.keywords.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {formData.keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium border border-blue-200/50 dark:border-blue-800/50">
                    <Tag className="w-3 h-3" />
                    {keyword}
                    <button
                      type="button"
                      onClick={() => handleRemoveKeyword(keyword)}
                      className="ml-0.5 hover:text-blue-900 dark:hover:text-blue-100 transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={!isFormValid}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none">
              <Plus className="w-4 h-4" />
              {editingQuestion ? "Update Question" : "Add Question"}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};
