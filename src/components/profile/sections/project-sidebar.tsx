"use client";

import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  addProject,
  setSelectedProject,
  deleteProject,
} from "@/store/slices/profileSlice";
import { Plus, Edit3, Trash2, Building } from "lucide-react";
import { motion } from "framer-motion";

export default function ProjectSidebar() {
  const dispatch = useAppDispatch();
  const { projects, selectedProjectId } = useAppSelector(
    (state) => state.profile
  );

  const handleAddNew = () => {
    const newProject = {
      id: Date.now().toString(),
      title: "",
      organization: "",
      startDate: "",
      endDate: "",
      url: "",
      description: "",
    };
    dispatch(addProject(newProject));
    dispatch(setSelectedProject(newProject.id));
  };

  const handleSelectProject = (id: string) => {
    dispatch(setSelectedProject(id));
  };

  const handleEdit = (project: any, e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(setSelectedProject(project.id));
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this project?")) {
      dispatch(deleteProject(id));
      if (selectedProjectId === id) {
        dispatch(setSelectedProject(null));
      }
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Your Projects
        </h3>
        <button
          onClick={handleAddNew}
          className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors">
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3">
        {projects.map((project) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 group ${
              selectedProjectId === project.id
                ? "border-blue-500/50 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-500/20 dark:to-purple-500/20 shadow-md"
                : "border-gray-200/20 dark:border-white/10 hover:border-blue-300/50 dark:hover:border-blue-500/30 hover:shadow-sm"
            }`}
            onClick={() => handleSelectProject(project.id)}>
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                  {project.title || "Untitled Project"}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                  {project.organization || "Organization Name"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  {project.startDate} - {project.endDate}
                </p>
              </div>
              <div className="flex space-x-1 ml-2">
                <button
                  onClick={(e) => handleEdit(project, e)}
                  className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/20 rounded-lg transition-all duration-200 group-hover:opacity-100 opacity-0">
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => handleDelete(project.id, e)}
                  className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/20 rounded-lg transition-all duration-200 group-hover:opacity-100 opacity-0">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {projects.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Building className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No projects added yet</p>
            <p className="text-sm">
              Click the + button to add your first project
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
