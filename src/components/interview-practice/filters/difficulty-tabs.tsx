import React from "react";
import { motion } from "framer-motion";

interface DifficultyTabsProps {
  selectedDifficulty: "Beginner" | "Intermediate" | "Expert";
  onSelectDifficulty: (difficulty: "Beginner" | "Intermediate" | "Expert") => void;
}

export const DifficultyTabs: React.FC<DifficultyTabsProps> = ({
  selectedDifficulty,
  onSelectDifficulty,
}) => {
  const difficulties: ("Beginner" | "Intermediate" | "Expert")[] = [
    "Beginner",
    "Intermediate",
    "Expert",
  ];

  return (
    <div className="flex flex-row space-x-2">
      {difficulties.map((difficulty) => (
        <motion.button
          key={difficulty}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelectDifficulty(difficulty)}
          className={`px-4 py-2.5 rounded-lg text-xs font-medium transition-all duration-200 flex-1 border-2 ${
            selectedDifficulty === difficulty
              ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md border-blue-400"
              : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border-transparent hover:border-blue-200 dark:hover:border-blue-700"
          }`}
        >
          {difficulty}
        </motion.button>
      ))}
    </div>
  );
};
