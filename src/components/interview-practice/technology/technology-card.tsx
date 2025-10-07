import React from "react";
import { motion } from "framer-motion";
import ProgressRing from "@/components/ui/progress-ring";

export interface TechnologyCardProps {
  technology: {
    id: string;
    title: string;
    description: string;
    slug: string;
    difficultyLevel: string;
    popularity: string;
    color: string;
    bgColor: string;
    icon: string;
  };
  onClick: () => void;
}

const cardVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
    },
  },
  hover: {
    scale: 1.05,
    y: -5,
    transition: {
      duration: 0.2,
    },
  },
};

export const TechnologyCard: React.FC<TechnologyCardProps> = ({
  technology,
  onClick,
}) => {
  const getProgressColor = () => {
    if (technology.color.includes("blue")) return "#3b82f6";
    if (technology.color.includes("green")) return "#10b981";
    if (technology.color.includes("purple")) return "#8b5cf6";
    return "#f59e0b";
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      layout
      className="group cursor-pointer"
      onClick={onClick}
    >
      <motion.div
        className={`p-6 rounded-2xl ${technology.bgColor} border border-gray-200/50 dark:border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm h-full`}
      >
        {/* Icon and Progress */}
        <div className="flex items-center justify-between mb-4">
          <motion.div
            className={`w-16 h-16 ${technology.bgColor} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
            whileHover={{ rotate: 5 }}
          >
            <div className="text-3xl">{technology.icon}</div>
          </motion.div>
          <ProgressRing
            progress={Math.floor(Math.random() * 100)}
            size={40}
            strokeWidth={3}
            color={getProgressColor()}
          />
        </div>

        {/* Content */}
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
          {technology.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
          {technology.description}
        </p>

        {/* Difficulty and Popularity */}
        <div className="flex items-center justify-between mb-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${technology.color} ${technology.bgColor}`}
          >
            {technology.difficultyLevel}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {technology.popularity} questions
          </span>
        </div>

        {/* Hover Effect */}
        <motion.div
          className="mt-4 flex items-center text-blue-600 dark:text-blue-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          initial={{ x: -10 }}
          whileHover={{ x: 0 }}
        >
          Start Learning
          <motion.div
            className="ml-2 w-4 h-4"
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            →
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
