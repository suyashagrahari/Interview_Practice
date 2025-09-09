"use client";

import { useState } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  addSkill,
  updateSkill,
  deleteSkill,
} from "@/store/slices/profileSlice";
import { Plus, X, Edit3, Trash2, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SkillsSection() {
  const dispatch = useAppDispatch();
  const { skills } = useAppSelector((state) => state.profile);
  const [newSkill, setNewSkill] = useState("");
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);
  const [editingSkillName, setEditingSkillName] = useState("");

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      const skill = {
        id: Date.now().toString(),
        name: newSkill.trim(),
      };
      dispatch(addSkill(skill));
      setNewSkill("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddSkill();
    }
  };

  const handleEditSkill = (skill: { id: string; name: string }) => {
    setEditingSkillId(skill.id);
    setEditingSkillName(skill.name);
  };

  const handleSaveEdit = () => {
    if (editingSkillId && editingSkillName.trim()) {
      dispatch(
        updateSkill({
          id: editingSkillId,
          updates: { name: editingSkillName.trim() },
        })
      );
      setEditingSkillId(null);
      setEditingSkillName("");
    }
  };

  const handleCancelEdit = () => {
    setEditingSkillId(null);
    setEditingSkillName("");
  };

  const handleDeleteSkill = (id: string) => {
    dispatch(deleteSkill(id));
  };

  return (
    <div className="p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            Skills
          </h2>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Add your technical and professional skills
          </p>
        </div>

        {/* Add Skill Input */}
        <div className="mb-6">
          <div className="flex space-x-3">
            <div className="flex-1">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter the skills"
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <button
              onClick={handleAddSkill}
              disabled={!newSkill.trim()}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center space-x-1.5 disabled:opacity-50 disabled:cursor-not-allowed text-xs">
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>
        </div>

        {/* Skills Grid */}
        <div className="space-y-4">
          {skills.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              <AnimatePresence>
                {skills.map((skill) => (
                  <motion.div
                    key={skill.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="group relative">
                    {editingSkillId === skill.id ? (
                      <div className="flex items-center space-x-2 p-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg">
                        <input
                          type="text"
                          value={editingSkillName}
                          onChange={(e) => setEditingSkillName(e.target.value)}
                          className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                          autoFocus
                        />
                        <button
                          onClick={handleSaveEdit}
                          className="p-1 text-green-600 hover:text-green-700 transition-colors">
                          <Save className="w-3 h-3" />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between p-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-200 group-hover:shadow-md">
                        <span className="text-xs font-medium text-gray-900 dark:text-white">
                          {skill.name}
                        </span>
                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button
                            onClick={() => handleEditSkill(skill)}
                            className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                            <Edit3 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDeleteSkill(skill.id)}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                <Plus className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="text-base font-medium text-gray-900 dark:text-white mb-1">
                No skills added yet
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                Start adding your skills to showcase your expertise
              </p>
            </div>
          )}
        </div>

        {/* Skills Categories */}
        {skills.length > 0 && (
          <div className="mt-8">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
              Skill Categories
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Technical Skills */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-3">
                  Technical Skills
                </h4>
                <div className="space-y-1">
                  {skills
                    .filter((skill) =>
                      [
                        "JavaScript",
                        "Python",
                        "React",
                        "Node.js",
                        "TypeScript",
                        "Java",
                        "C++",
                        "SQL",
                        "MongoDB",
                        "AWS",
                        "Docker",
                        "Git",
                      ].includes(skill.name)
                    )
                    .map((skill) => (
                      <span
                        key={skill.id}
                        className="inline-block px-2 py-1 text-xs font-medium text-blue-800 dark:text-blue-200 bg-blue-200 dark:bg-blue-800/30 rounded-full mr-1 mb-1">
                        {skill.name}
                      </span>
                    ))}
                </div>
              </div>

              {/* Soft Skills */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <h4 className="text-sm font-semibold text-green-900 dark:text-green-100 mb-3">
                  Soft Skills
                </h4>
                <div className="space-y-1">
                  {skills
                    .filter((skill) =>
                      [
                        "Leadership",
                        "Communication",
                        "Teamwork",
                        "Problem Solving",
                        "Time Management",
                        "Adaptability",
                        "Creativity",
                        "Critical Thinking",
                      ].includes(skill.name)
                    )
                    .map((skill) => (
                      <span
                        key={skill.id}
                        className="inline-block px-2 py-1 text-xs font-medium text-green-800 dark:text-green-200 bg-green-200 dark:bg-green-800/30 rounded-full mr-1 mb-1">
                        {skill.name}
                      </span>
                    ))}
                </div>
              </div>

              {/* Tools & Technologies */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                <h4 className="text-sm font-semibold text-purple-900 dark:text-purple-100 mb-3">
                  Tools & Technologies
                </h4>
                <div className="space-y-1">
                  {skills
                    .filter(
                      (skill) =>
                        ![
                          "JavaScript",
                          "Python",
                          "React",
                          "Node.js",
                          "TypeScript",
                          "Java",
                          "C++",
                          "SQL",
                          "MongoDB",
                          "AWS",
                          "Docker",
                          "Git",
                          "Leadership",
                          "Communication",
                          "Teamwork",
                          "Problem Solving",
                          "Time Management",
                          "Adaptability",
                          "Creativity",
                          "Critical Thinking",
                        ].includes(skill.name)
                    )
                    .map((skill) => (
                      <span
                        key={skill.id}
                        className="inline-block px-2 py-1 text-xs font-medium text-purple-800 dark:text-purple-200 bg-purple-200 dark:bg-purple-800/30 rounded-full mr-1 mb-1">
                        {skill.name}
                      </span>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
