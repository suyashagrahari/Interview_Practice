"use client";

import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  addExperience,
  updateExperience,
  deleteExperience,
  setSelectedExperience,
} from "@/store/slices/profileSlice";
import { ProfileApiService } from "@/lib/api/profile";
import { Plus, Edit3, Trash2, Building, Save, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ExperienceSection() {
  const dispatch = useAppDispatch();
  const { experiences, selectedExperienceId } = useAppSelector(
    (state) => state.profile
  );
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    role: "",
    company: "",
    location: "",
    startDate: "",
    endDate: "",
    description: "",
    isCurrent: false,
  });

  // Effect to handle when an experience is selected from sidebar
  useEffect(() => {
    if (selectedExperienceId && !isAdding && !isEditing) {
      const experience = experiences.find(
        (exp) => exp.id === selectedExperienceId
      );
      if (experience) {
        setFormData({
          role: experience.role || "",
          company: experience.company || "",
          location: experience.location || "",
          startDate: experience.startDate || "",
          endDate: experience.endDate || "",
          description: experience.description || "",
          isCurrent: experience.isCurrent || false,
        });
        setIsEditing(true);
        setIsAdding(false);
      }
    }
  }, [selectedExperienceId, experiences, isAdding, isEditing]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddNew = () => {
    setFormData({
      role: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      description: "",
      isCurrent: false,
    });
    setIsAdding(true);
    setIsEditing(false);
    dispatch(setSelectedExperience(null));
  };

  const handleEdit = (experience: typeof formData & { id: string }) => {
    setFormData(experience);
    setIsEditing(true);
    setIsAdding(false);
    dispatch(setSelectedExperience(experience.id));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage(null);

    try {
      let updatedExperiences = [...experiences];

      if (isAdding) {
        const newExperience = {
          id: Date.now().toString(),
          ...formData,
        };
        updatedExperiences.push(newExperience);
        dispatch(addExperience(newExperience));
      } else if (isEditing && selectedExperienceId) {
        const updatedExperience = { id: selectedExperienceId, ...formData };
        updatedExperiences = updatedExperiences.map((exp) =>
          exp.id === selectedExperienceId ? updatedExperience : exp
        );
        dispatch(
          updateExperience({ id: selectedExperienceId, updates: formData })
        );
      }

      // Save to backend
      await ProfileApiService.updateExperiences(updatedExperiences);

      setSaveMessage({
        type: "success",
        text: "Experience saved successfully!",
      });

      setIsAdding(false);
      setIsEditing(false);
      setFormData({
        role: "",
        company: "",
        location: "",
        startDate: "",
        endDate: "",
        description: "",
        isCurrent: false,
      });

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveMessage(null);
      }, 3000);
    } catch (error: any) {
      console.error("Error saving experience:", error);
      setSaveMessage({
        type: "error",
        text: error.message || "Failed to save experience. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setIsEditing(false);
    setFormData({
      role: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      description: "",
      isCurrent: false,
    });
    dispatch(setSelectedExperience(null));
  };

  const handleDelete = async (id: string) => {
    try {
      const updatedExperiences = experiences.filter((exp) => exp.id !== id);
      dispatch(deleteExperience(id));

      // Save to backend
      await ProfileApiService.updateExperiences(updatedExperiences);

      if (selectedExperienceId === id) {
        dispatch(setSelectedExperience(null));
        setIsEditing(false);
      }

      setSaveMessage({
        type: "success",
        text: "Experience deleted successfully!",
      });
      setTimeout(() => {
        setSaveMessage(null);
      }, 3000);
    } catch (error: any) {
      console.error("Error deleting experience:", error);
      setSaveMessage({
        type: "error",
        text: error.message || "Failed to delete experience. Please try again.",
      });
    }
  };

  const handleSelectExperience = (id: string) => {
    dispatch(setSelectedExperience(id));
    const experience = experiences.find((exp) => exp.id === id);
    if (experience) {
      setFormData(experience);
      setIsEditing(true);
      setIsAdding(false);
    }
  };

  return (
    <div className="p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              Experience Details
            </h2>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {isAdding
                ? "Add your work experience"
                : isEditing
                ? "Edit experience details"
                : "Select an experience to edit"}
            </p>
          </div>

          {/* Save Message */}
          {saveMessage && (
            <div
              className={`p-3 rounded-lg text-sm ${
                saveMessage.type === "success"
                  ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800"
                  : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800"
              }`}>
              {saveMessage.text}
            </div>
          )}
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
                disabled={isSaving}
                className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center space-x-1.5 text-xs disabled:opacity-50 disabled:cursor-not-allowed">
                {isSaving ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Save className="w-3 h-3" />
                )}
                <span>{isSaving ? "Saving..." : "Save Experience"}</span>
              </button>
            </div>
          )}
        </div>

        <AnimatePresence mode="wait">
          {isAdding || isEditing ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4">
              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  What was your role at the company? *
                </label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => handleInputChange("role", e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., Software Engineer, Marketing Manager"
                />
              </div>

              {/* Company */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  For which company did you work? *
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => handleInputChange("company", e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., Google, Microsoft, Apple"
                />
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  How long were you with the company?
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Start Date
                    </label>
                    <input
                      type="month"
                      value={formData.startDate}
                      onChange={(e) =>
                        handleInputChange("startDate", e.target.value)
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                      End Date
                    </label>
                    <input
                      type="month"
                      value={formData.endDate}
                      onChange={(e) =>
                        handleInputChange("endDate", e.target.value)
                      }
                      disabled={formData.isCurrent}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 dark:disabled:bg-slate-600"
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.isCurrent}
                      onChange={(e) =>
                        handleInputChange("isCurrent", e.target.checked)
                      }
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      I currently work here
                    </span>
                  </label>
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Where was the company located?
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., New York, NY"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  What did you do at the company?
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  rows={4}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Describe your responsibilities and achievements..."
                />
                <div className="mt-2 flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                  <div className="w-3 h-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center">
                    💡
                  </div>
                  <span>
                    Aim for a balanced mix of descriptive and key number bullet
                    points.
                  </span>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-8">
              <Building className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-600 mb-3" />
              <h3 className="text-base font-medium text-gray-900 dark:text-white mb-1">
                No experience selected
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                Select an experience from the sidebar to edit, or add a new one.
              </p>
              <button
                onClick={handleAddNew}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center space-x-1.5 mx-auto text-xs">
                <Plus className="w-4 h-4" />
                <span>Add Experience</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
