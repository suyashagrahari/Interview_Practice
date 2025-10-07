import React from "react";
import { motion } from "framer-motion";

export interface CategoryOption {
  id: string;
  name: string;
  color?: string;
}

interface CategoryFilterProps {
  categories: CategoryOption[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  isLoading?: boolean;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-wrap justify-center gap-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="px-6 py-3 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse"
            style={{ width: "120px", height: "48px" }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-3">
      {categories.map((category, index) => (
        <motion.button
          key={category.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelectCategory(category.id)}
          className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
            selectedCategory === category.id
              ? `bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg`
              : `bg-white/80 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-white/20 border border-gray-200/50 dark:border-white/20`
          } backdrop-blur-sm`}
        >
          {category.name}
        </motion.button>
      ))}
    </div>
  );
};
