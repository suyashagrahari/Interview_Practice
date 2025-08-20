"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, BookOpen, Search, Home } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface FloatingActionButtonProps {
  className?: string;
}

const FloatingActionButton = ({
  className = "",
}: FloatingActionButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const actions = [
    {
      icon: <Home className="w-5 h-5" />,
      label: "Home",
      action: () => router.push("/"),
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      icon: <Search className="w-5 h-5" />,
      label: "Search",
      action: () => router.push("/interview-practice"),
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      icon: <BookOpen className="w-5 h-5" />,
      label: "Topics",
      action: () => router.push("/interview-practice"),
      color: "bg-purple-500 hover:bg-purple-600",
    },
  ];

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="mb-4 space-y-3">
            {actions.map((action, index) => (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-end">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={action.action}
                  className={`${action.color} text-white p-3 rounded-full shadow-lg transition-all duration-300 group`}>
                  {action.icon}
                </motion.button>
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="mr-3 px-3 py-1 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg shadow-lg text-sm font-medium whitespace-nowrap">
                  {action.label}
                </motion.span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:shadow-xl">
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}>
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="plus"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}>
              <Plus className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};

export default FloatingActionButton;

