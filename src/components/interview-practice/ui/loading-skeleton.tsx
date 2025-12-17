import React from "react";
import { motion } from "framer-motion";

interface LoadingSkeletonProps {
  count?: number;
  type?: "card" | "list" | "technology" | "question";
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  count = 1,
  type = "card",
}) => {
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  const renderSkeletonByType = () => {
    switch (type) {
      case "technology":
        return (
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="p-6 rounded-2xl bg-gray-200 dark:bg-gray-700 animate-pulse h-64"
          >
            <div className="w-16 h-16 bg-gray-300 dark:bg-gray-600 rounded-2xl mb-4"></div>
            <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded mb-3"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
          </motion.div>
        );

      case "question":
        return (
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="mb-6 p-4 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
              <div className="flex-1">
                <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-24"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
            </div>
          </motion.div>
        );

      case "list":
        return (
          <div className="px-6 py-3 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse w-32 h-12"></div>
        );

      default:
        return (
          <div className="p-6 rounded-2xl bg-gray-200 dark:bg-gray-700 animate-pulse h-48">
            <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
          </div>
        );
    }
  };

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <React.Fragment key={index}>{renderSkeletonByType()}</React.Fragment>
      ))}
    </>
  );
};
