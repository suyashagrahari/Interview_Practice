"use client";

import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  addEducation,
  updateEducation,
  deleteEducation,
  setSelectedEducation,
} from "@/store/slices/profileSlice";
import { Plus, Edit3, Trash2, GraduationCap, Save, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function EducationSection() {
  const dispatch = useAppDispatch();
  const { educations, selectedEducationId } = useAppSelector(
    (state) => state.profile
  );
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    degree: "",
    institution: "",
    location: "",
    graduationDate: "",
    minor: "",
    gpa: "",
    additionalInfo: "",
  });

  // Effect to handle when an education is selected from sidebar
  useEffect(() => {
    if (selectedEducationId && !isAdding && !isEditing) {
      const education = educations.find(
        (edu) => edu.id === selectedEducationId
      );
      if (education) {
        setFormData({
          degree: education.degree || "",
          institution: education.institution || "",
          location: education.location || "",
          graduationDate: education.graduationDate || "",
          minor: education.minor || "",
          gpa: education.gpa || "",
          additionalInfo: education.additionalInfo || "",
        });
        setIsEditing(true);
        setIsAdding(false);
      }
    }
  }, [selectedEducationId, educations, isAdding, isEditing]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddNew = () => {
    setFormData({
      degree: "",
      institution: "",
      location: "",
      graduationDate: "",
      minor: "",
      gpa: "",
      additionalInfo: "",
    });
    setIsAdding(true);
    setIsEditing(false);
    dispatch(setSelectedEducation(null));
  };

  const handleEdit = (education: typeof formData & { id: string }) => {
    setFormData(education);
    setIsEditing(true);
    setIsAdding(false);
    dispatch(setSelectedEducation(education.id));
  };

  const handleSave = () => {
    if (isAdding) {
      const newEducation = {
        id: Date.now().toString(),
        ...formData,
      };
      dispatch(addEducation(newEducation));
    } else if (isEditing && selectedEducationId) {
      dispatch(updateEducation({ id: selectedEducationId, updates: formData }));
    }

    setIsAdding(false);
    setIsEditing(false);
    setFormData({
      degree: "",
      institution: "",
      location: "",
      graduationDate: "",
      minor: "",
      gpa: "",
      additionalInfo: "",
    });
  };

  const handleCancel = () => {
    setIsAdding(false);
    setIsEditing(false);
    setFormData({
      degree: "",
      institution: "",
      location: "",
      graduationDate: "",
      minor: "",
      gpa: "",
      additionalInfo: "",
    });
    dispatch(setSelectedEducation(null));
  };

  const handleDelete = (id: string) => {
    dispatch(deleteEducation(id));
    if (selectedEducationId === id) {
      dispatch(setSelectedEducation(null));
      setIsEditing(false);
    }
  };

  const handleSelectEducation = (id: string) => {
    dispatch(setSelectedEducation(id));
    const education = educations.find((edu) => edu.id === id);
    if (education) {
      setFormData({
        degree: education.degree || "",
        institution: education.institution || "",
        location: education.location || "",
        graduationDate: education.graduationDate || "",
        minor: education.minor || "",
        gpa: education.gpa || "",
        additionalInfo: education.additionalInfo || "",
      });
      setIsEditing(true);
      setIsAdding(false);
    }
  };

  return (
    <div className="p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="mb-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-3">
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                Education Details
              </h2>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {isAdding
                  ? "Add your education details and qualifications"
                  : isEditing
                  ? "Edit your education information"
                  : "Select an education from the sidebar to edit or add a new one"}
              </p>
            </div>
            {(isAdding || isEditing) && (
              <div className="flex space-x-2">
                <button
                  onClick={handleCancel}
                  className="px-3 py-1.5 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors flex items-center space-x-1.5">
                  <X className="w-3 h-3" />
                  <span>Cancel</span>
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center space-x-1.5 shadow-lg hover:shadow-xl text-xs">
                  <Save className="w-3 h-3" />
                  <span>Save Education</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {isAdding || isEditing ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4">
              {/* Degree */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  What is your degree or other qualification and major?{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.degree}
                  onChange={(e) => handleInputChange("degree", e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., Bachelor of Technology in Computer Science"
                />
              </div>

              {/* Institution */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Where did you earn your degree/qualification?
                </label>
                <input
                  type="text"
                  value={formData.institution}
                  onChange={(e) =>
                    handleInputChange("institution", e.target.value)
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., Indian Institute of Technology"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Where is the institution located?
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., Mumbai, India"
                />
              </div>

              {/* Graduation Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  When did you earn your degree/qualification?
                </label>
                <input
                  type="month"
                  value={formData.graduationDate}
                  onChange={(e) =>
                    handleInputChange("graduationDate", e.target.value)
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Minor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Did you minor in anything?
                </label>
                <input
                  type="text"
                  value={formData.minor}
                  onChange={(e) => handleInputChange("minor", e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., Mathematics, Business"
                />
              </div>

              {/* GPA */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  GPA (if applicable)
                </label>
                <input
                  type="text"
                  value={formData.gpa}
                  onChange={(e) => handleInputChange("gpa", e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., 3.8/4.0, 8.5/10"
                />
              </div>

              {/* Additional Info */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Open field for additional information
                </label>
                <textarea
                  value={formData.additionalInfo}
                  onChange={(e) =>
                    handleInputChange("additionalInfo", e.target.value)
                  }
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="e.g., Dean's List, Honors, Scholarships, Relevant coursework..."
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-8">
              <GraduationCap className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-600 mb-3" />
              <h3 className="text-base font-medium text-gray-900 dark:text-white mb-1">
                No education selected
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                Select an education from the sidebar to edit, or add a new one.
              </p>
              <button
                onClick={handleAddNew}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center space-x-1.5 mx-auto text-xs">
                <Plus className="w-4 h-4" />
                <span>Add Education</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
