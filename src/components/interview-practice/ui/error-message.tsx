import React from "react";
import { motion } from "framer-motion";

interface ErrorMessageProps {
  message: string;
  variant?: "default" | "compact";
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  variant = "default",
}) => {
  if (variant === "compact") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl"
      >
        <p className="text-red-600 dark:text-red-400 text-sm text-center">
          {message}
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-4 mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl"
    >
      <p className="text-red-600 dark:text-red-400 text-sm text-center">
        {message}
      </p>
    </motion.div>
  );
};
