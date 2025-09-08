"use client";

import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  addProject,
  updateProject,
  deleteProject,
  setSelectedProject,
} from "@/store/slices/profileSlice";
import { Plus, Edit3, Trash2, Globe, Building, Save, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProjectSection() {
  const dispatch = useAppDispatch();
  const { projects, selectedProjectId } = useAppSelector(
    (state) => state.profile
  );
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

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

  const handleSave = () => {
    if (isAdding) {
      const newProject = {
        id: Date.now().toString(),
        ...formData,
      };
      dispatch(addProject(newProject));
    } else if (isEditing && selectedProjectId) {
      dispatch(updateProject({ id: selectedProjectId, updates: formData }));
    }

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

  const handleDelete = (id: string) => {
    dispatch(deleteProject(id));
    if (selectedProjectId === id) {
      dispatch(setSelectedProject(null));
      setIsEditing(false);
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
    <div className="p-6">
      <div className="max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Project Details
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {isAdding
                ? "Add your project details"
                : isEditing
                ? "Edit project details"
                : "Select a project to edit"}
            </p>
          </div>
          {(isAdding || isEditing) && (
            <div className="flex space-x-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors flex items-center space-x-2">
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2">
                <Save className="w-4 h-4" />
                <span>Save to Project List</span>
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
              className="space-y-6">
              {/* Project Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Give your project a title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., E-commerce Website, Mobile App"
                />
              </div>

              {/* Organization */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  In which organization did you do your project?
                </label>
                <input
                  type="text"
                  value={formData.organization}
                  onChange={(e) =>
                    handleInputChange("organization", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., Google, Microsoft, Personal Project"
                />
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  When did you do your project?
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
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>
              </div>

              {/* Project URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Project URL
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="url"
                    value={formData.url}
                    onChange={(e) => handleInputChange("url", e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="https://your-project.com"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Now describe what you did
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Describe your project, technologies used, and your contributions..."
                />
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                    <div className="w-4 h-4 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center">
                      💡
                    </div>
                    <span>
                      Aim for a balanced mix of descriptive and key number
                      bullet points.
                    </span>
                  </div>
                  <button className="px-3 py-1 text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-slate-600 rounded-md hover:bg-gray-200 dark:hover:bg-slate-500 transition-colors">
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
              className="text-center py-12">
              <Building className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No project selected
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Select a project from the sidebar to edit, or add a new one.
              </p>
              <button
                onClick={handleAddNew}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 mx-auto">
                <Plus className="w-5 h-5" />
                <span>Add Project</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
