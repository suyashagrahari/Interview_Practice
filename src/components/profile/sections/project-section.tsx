"use client";

import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  addProject,
  updateProject,
  deleteProject,
  setSelectedProject,
} from "@/store/slices/profileSlice";
import { ProfileApiService } from "@/lib/api/profile";
import {
  Plus,
  Edit3,
  Trash2,
  Globe,
  Building,
  Save,
  X,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProjectSection() {
  const dispatch = useAppDispatch();
  const { projects, selectedProjectId } = useAppSelector(
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
    title: "",
    organization: "",
    startDate: "",
    endDate: "",
    url: "",
    description: "",
  });

  // Effect to handle when a project is selected from sidebar
  useEffect(() => {
    if (selectedProjectId && !isAdding && !isEditing) {
      const project = projects.find((proj) => proj.id === selectedProjectId);
      if (project) {
        setFormData({
          title: project.title || "",
          organization: project.organization || "",
          startDate: project.startDate || "",
          endDate: project.endDate || "",
          url: project.url || "",
          description: project.description || "",
        });
        setIsEditing(true);
        setIsAdding(false);
      }
    }
  }, [selectedProjectId, projects, isAdding, isEditing]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddNew = () => {
    setFormData({
      title: "",
      organization: "",
      startDate: "",
      endDate: "",
      url: "",
      description: "",
    });
    setIsAdding(true);
    setIsEditing(false);
    dispatch(setSelectedProject(null));
  };

  const handleEdit = (project: typeof formData & { id: string }) => {
    setFormData(project);
    setIsEditing(true);
    setIsAdding(false);
    dispatch(setSelectedProject(project.id));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage(null);

    try {
      let updatedProjects = [...projects];

      if (isAdding) {
        const newProject = {
          id: Date.now().toString(),
          ...formData,
        };
        updatedProjects.push(newProject);
        dispatch(addProject(newProject));
      } else if (isEditing && selectedProjectId) {
        const updatedProject = { id: selectedProjectId, ...formData };
        updatedProjects = updatedProjects.map((proj) =>
          proj.id === selectedProjectId ? updatedProject : proj
        );
        dispatch(updateProject({ id: selectedProjectId, updates: formData }));
      }

      // Save to backend
      await ProfileApiService.updateProjects(updatedProjects);

      setSaveMessage({
        type: "success",
        text: "Project saved successfully!",
      });

      setIsAdding(false);
      setIsEditing(false);
      setFormData({
        title: "",
        organization: "",
        startDate: "",
        endDate: "",
        url: "",
        description: "",
      });

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveMessage(null);
      }, 3000);
    } catch (error: any) {
      console.error("Error saving project:", error);
      setSaveMessage({
        type: "error",
        text: error.message || "Failed to save project. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setIsEditing(false);
    setFormData({
      title: "",
      organization: "",
      startDate: "",
      endDate: "",
      url: "",
      description: "",
    });
    dispatch(setSelectedProject(null));
  };

  const handleDelete = async (id: string) => {
    try {
      const updatedProjects = projects.filter((proj) => proj.id !== id);
      dispatch(deleteProject(id));

      // Save to backend
      await ProfileApiService.updateProjects(updatedProjects);

      if (selectedProjectId === id) {
        dispatch(setSelectedProject(null));
        setIsEditing(false);
      }

      setSaveMessage({
        type: "success",
        text: "Project deleted successfully!",
      });
      setTimeout(() => {
        setSaveMessage(null);
      }, 3000);
    } catch (error: any) {
      console.error("Error deleting project:", error);
      setSaveMessage({
        type: "error",
        text: error.message || "Failed to delete project. Please try again.",
      });
    }
  };

  const handleSelectProject = (id: string) => {
    dispatch(setSelectedProject(id));
    const project = projects.find((proj) => proj.id === id);
    if (project) {
      setFormData(project);
      setIsEditing(true);
      setIsAdding(false);
    }
  };

  return (
    <div className="p-4">
      <div className="max-w-4xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Project Details
            </h2>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {isAdding
                ? "Add your project details"
                : isEditing
                ? "Edit project details"
                : "Select a project to edit"}
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
                <span>{isSaving ? "Saving..." : "Save to Project List"}</span>
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
              {/* Project Title */}
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Give your project a title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., E-commerce Website, Mobile App"
                />
              </div>

              {/* Organization */}
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  In which organization did you do your project?
                </label>
                <input
                  type="text"
                  value={formData.organization}
                  onChange={(e) =>
                    handleInputChange("organization", e.target.value)
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., Google, Microsoft, Personal Project"
                />
              </div>

              {/* Duration */}
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  When did you do your project?
                </label>
                <div className="grid grid-cols-2 gap-3">
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
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>
              </div>

              {/* Project URL */}
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Project URL
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="url"
                    value={formData.url}
                    onChange={(e) => handleInputChange("url", e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="https://your-project.com"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Now describe what you did
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  rows={4}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Describe your project, technologies used, and your contributions..."
                />
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                    <div className="w-3 h-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center">
                      💡
                    </div>
                    <span>
                      Aim for a balanced mix of descriptive and key number
                      bullet points.
                    </span>
                  </div>
                  <button className="px-2 py-1 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-slate-600 rounded-md hover:bg-gray-200 dark:hover:bg-slate-500 transition-colors">
                    + AI WRITER NOT READY
                  </button>
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
                No project selected
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                Select a project from the sidebar to edit, or add a new one.
              </p>
              <button
                onClick={handleAddNew}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center space-x-1.5 mx-auto text-xs">
                <Plus className="w-4 h-4" />
                <span>Add Project</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
