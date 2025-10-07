import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Users, Star, BookOpen, Maximize2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface TopicHeaderProps {
  topic: {
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    bgColor: string;
    duration: string;
    participants: number;
    rating: number;
  };
  topicSlug: string;
  isLoading: boolean;
  questionsCount: number;
  totalCount: number;
  progressPercentage: number;
  onToggleFocusMode: () => void;
}

export const TopicHeader: React.FC<TopicHeaderProps> = ({
  topic,
  topicSlug,
  isLoading,
  questionsCount,
  totalCount,
  progressPercentage,
  onToggleFocusMode,
}) => {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6 }}
      className="mb-4"
    >
      <div className="bg-white/80 dark:bg-white/10 rounded-none p-4 backdrop-blur-sm border-b border-gray-200/50 dark:border-white/20 shadow-md">
        <div className="flex items-center justify-between w-full">
          {/* Left Side - Icon and Text */}
          <div className="flex items-center space-x-3">
            {/* Back Button */}
            <motion.button
              onClick={() => router.back()}
              className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>

            <motion.div
              className={`w-10 h-10 ${topic.bgColor} rounded-lg flex items-center justify-center ${topic.color}`}
              whileHover={{ rotate: 5, scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              {topic.icon}
            </motion.div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                {isLoading ? (
                  <div className="animate-pulse bg-gray-300 dark:bg-gray-600 h-5 w-32 rounded"></div>
                ) : (
                  `${topic?.title || topicSlug} Interview Questions`
                )}
              </h1>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                {isLoading ? (
                  <div className="animate-pulse bg-gray-300 dark:bg-gray-600 h-3 w-48 rounded mt-1"></div>
                ) : (
                  topic?.description || "Loading technology description..."
                )}
              </p>
            </div>
          </div>

          {/* Right Side - Progress and Stats */}
          <div className="flex items-center space-x-4">
            {/* Compact Stats - Horizontal */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3 text-blue-600" />
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  {topic.duration}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="w-3 h-3 text-green-600" />
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  {topic.participants.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="w-3 h-3 text-yellow-600" />
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  {topic.rating}/5.0
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <BookOpen className="w-3 h-3 text-purple-600" />
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  {questionsCount}
                  {totalCount > 0 && `/${totalCount}`}
                </span>
              </div>
            </div>

            {/* Progress Circle */}
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <div className="w-9 h-9 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-gray-900 dark:text-white">
                    {progressPercentage}%
                  </span>
                </div>
              </div>
              <div className="absolute inset-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-20 animate-pulse"></div>
            </div>

            {/* Focus Mode Button */}
            <motion.button
              onClick={onToggleFocusMode}
              className="w-10 h-10 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center justify-center transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Enter Focus Mode"
            >
              <Maximize2 className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
