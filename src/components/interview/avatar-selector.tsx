"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { AvatarData } from "@/types/interview-page/interview.types";

const avatars: AvatarData[] = [
  {
    id: "avatar1",
    name: "Mike Johnson",
    role: "Tech Lead",
    experience: "10 years",
    rating: 4.9,
    skills: ["Python", "AWS", "Docker"] as readonly string[],
    imageSrc: "/images/Avtar1.png",
    videoSrc: "/models/Avtar1.mp4",
  },
  {
    id: "avatar2",
    name: "Lisa Wang",
    role: "Senior Engineer",
    experience: "9 years",
    rating: 4.8,
    skills: ["Java", "Spring", "Microservices"] as readonly string[],
    imageSrc: "/images/Avtar2.png",
    videoSrc: "/models/Avtar2.mp4",
  },
  {
    id: "avatar3",
    name: "Sarah Chen",
    role: "Senior Developer",
    experience: "8 years",
    rating: 4.8,
    skills: ["React", "Node.js", "TypeScript"] as readonly string[],
    imageSrc: "/images/Avtar3.png",
    videoSrc: "/models/Avtar3.mp4",
  },
  {
    id: "avatar4",
    name: "Emily Davis",
    role: "Engineering Manager",
    experience: "12 years",
    rating: 4.7,
    skills: ["Leadership", "Product Management", "Agile"] as readonly string[],
    imageSrc: "/images/Avtar4.png",
    videoSrc: "/models/Avtar4.mp4",
  },
  {
    id: "avatar5",
    name: "Alex Kumar",
    role: "Full Stack Developer",
    experience: "6 years",
    rating: 4.6,
    skills: ["JavaScript", "React", "MongoDB"] as readonly string[],
    imageSrc: "/images/Avtar5.png",
    videoSrc: "/models/avtar5.mp4",
  },
];

interface AvatarSelectorProps {
  selectedAvatar: AvatarData | null;
  onAvatarSelect: (avatar: any) => void;
  isVisible: boolean;
  onClose: () => void;
}

export const AvatarSelector = ({
  selectedAvatar,
  onAvatarSelect,
  isVisible,
  onClose,
}: AvatarSelectorProps) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-slate-800 rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">👤</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                Choose Your Interviewer
              </h2>
              <p className="text-gray-400">
                Select an AI interviewer based on your preferences
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
            <span className="text-white text-xl">×</span>
          </button>
        </div>

        {/* Avatar Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {avatars.map((avatar) => (
            <motion.div
              key={avatar.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onAvatarSelect(avatar)}
              className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                selectedAvatar?.id === avatar.id
                  ? "border-blue-400 bg-blue-500/10"
                  : "border-slate-600 bg-slate-700/50 hover:border-slate-500"
              }`}>
              {/* Avatar Image */}
              <div className="flex justify-center mb-3">
                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white">
                  <Image
                    src={avatar.imageSrc}
                    alt={avatar.name}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Avatar Info */}
              <div className="text-center">
                <h3 className="font-semibold text-white text-sm mb-1">
                  {avatar.name}
                </h3>
                <p className="text-gray-400 text-xs mb-2">{avatar.role}</p>
                <p className="text-gray-500 text-xs mb-2">
                  {avatar.experience}
                </p>

                {/* Rating */}
                <div className="flex items-center justify-center mb-2">
                  <span className="text-yellow-400 text-sm">⭐</span>
                  <span className="text-white text-xs ml-1">
                    {avatar.rating}
                  </span>
                </div>

                {/* Skills */}
                <div className="text-xs text-gray-400">
                  {avatar.skills.slice(0, 2).join(", ")}
                  {avatar.skills.length > 2 && "..."}
                </div>
              </div>

              {/* Selection Indicator */}
              {selectedAvatar?.id === avatar.id && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors">
            Cancel
          </button>
          <button
            onClick={() => {
              if (selectedAvatar) {
                onClose();
              }
            }}
            disabled={!selectedAvatar}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors">
            Select Interviewer
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AvatarSelector;
