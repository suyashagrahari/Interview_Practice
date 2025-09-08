"use client";

import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  addExperience,
  setSelectedExperience,
  deleteExperience,
} from "@/store/slices/profileSlice";
import { Plus, Edit3, Trash2, Building } from "lucide-react";
import { motion } from "framer-motion";

export default function ExperienceSidebar() {
  const dispatch = useAppDispatch();
  const { experiences, selectedExperienceId } = useAppSelector(
    (state) => state.profile
  );

  const handleAddNew = () => {
    const newExperience = {
      id: Date.now().toString(),
      role: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      description: "",
      isCurrent: false,
    };
    dispatch(addExperience(newExperience));
    dispatch(setSelectedExperience(newExperience.id));
  };

  const handleSelectExperience = (id: string) => {
    dispatch(setSelectedExperience(id));
  };

  const handleEdit = (experience: any, e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(setSelectedExperience(experience.id));
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this experience?")) {
      dispatch(deleteExperience(id));
      if (selectedExperienceId === id) {
        dispatch(setSelectedExperience(null));
      }
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Your Experience
        </h3>
        <button
          onClick={handleAddNew}
          className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors">
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3">
        {experiences.map((experience) => (
          <motion.div
            key={experience.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 group ${
              selectedExperienceId === experience.id
                ? "border-blue-500/50 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-500/20 dark:to-purple-500/20 shadow-md"
                : "border-gray-200/20 dark:border-white/10 hover:border-blue-300/50 dark:hover:border-blue-500/30 hover:shadow-sm"
            }`}
            onClick={() => handleSelectExperience(experience.id)}>
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                  {experience.role || "Untitled Experience"}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                  {experience.company || "Company Name"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  {experience.startDate} -{" "}
                  {experience.isCurrent ? "Present" : experience.endDate}
                </p>
              </div>
              <div className="flex space-x-1 ml-2">
                <button
                  onClick={(e) => handleEdit(experience, e)}
                  className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/20 rounded-lg transition-all duration-200 group-hover:opacity-100 opacity-0">
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => handleDelete(experience.id, e)}
                  className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/20 rounded-lg transition-all duration-200 group-hover:opacity-100 opacity-0">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {experiences.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Building className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No experience added yet</p>
            <p className="text-sm">
              Click the + button to add your first experience
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
