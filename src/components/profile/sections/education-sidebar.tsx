"use client";

import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  addEducation,
  setSelectedEducation,
  deleteEducation,
} from "@/store/slices/profileSlice";
import { Plus, Edit3, GraduationCap, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

export default function EducationSidebar() {
  const dispatch = useAppDispatch();
  const { educations, selectedEducationId } = useAppSelector(
    (state) => state.profile
  );

  const handleAddNew = () => {
    const newEducation = {
      id: Date.now().toString(),
      degree: "",
      institution: "",
      location: "",
      graduationDate: "",
      minor: "",
      gpa: "",
      additionalInfo: "",
    };
    dispatch(addEducation(newEducation));
    dispatch(setSelectedEducation(newEducation.id));
  };

  const handleSelectEducation = (id: string) => {
    dispatch(setSelectedEducation(id));
  };

  const handleEdit = (education: any, e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(setSelectedEducation(education.id));
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this education?")) {
      dispatch(deleteEducation(id));
      if (selectedEducationId === id) {
        dispatch(setSelectedEducation(null));
      }
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Your Education
        </h3>
        <button
          onClick={handleAddNew}
          className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors">
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3">
        {educations.map((education) => (
          <motion.div
            key={education.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 group ${
              selectedEducationId === education.id
                ? "border-blue-500/50 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-500/20 dark:to-purple-500/20 shadow-md"
                : "border-gray-200/20 dark:border-white/10 hover:border-blue-300/50 dark:hover:border-blue-500/30 hover:shadow-sm"
            }`}
            onClick={() => handleSelectEducation(education.id)}>
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                  {education.degree || "Untitled Education"}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                  {education.institution || "Institution Name"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  {education.graduationDate}
                </p>
              </div>
              <div className="flex space-x-1 ml-2">
                <button
                  onClick={(e) => handleEdit(education, e)}
                  className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/20 rounded-lg transition-all duration-200 group-hover:opacity-100 opacity-0">
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => handleDelete(education.id, e)}
                  className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/20 rounded-lg transition-all duration-200 group-hover:opacity-100 opacity-0">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {educations.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <GraduationCap className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No education added yet</p>
            <p className="text-sm">
              Click the + button to add your first education
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
