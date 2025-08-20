"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Search, TrendingUp, Clock, Star } from "lucide-react";

interface SearchSuggestion {
  id: string;
  text: string;
  type: "trending" | "recent" | "popular";
  icon: React.ReactNode;
}

interface SearchSuggestionsProps {
  isVisible: boolean;
  searchQuery: string;
  onSuggestionClick: (suggestion: string) => void;
}

const SearchSuggestions = ({
  isVisible,
  searchQuery,
  onSuggestionClick,
}: SearchSuggestionsProps) => {
  const suggestions: SearchSuggestion[] = [
    {
      id: "1",
      text: "JavaScript Fundamentals",
      type: "trending",
      icon: <TrendingUp className="w-4 h-4" />,
    },
    {
      id: "2",
      text: "React Hooks",
      type: "trending",
      icon: <TrendingUp className="w-4 h-4" />,
    },
    {
      id: "3",
      text: "Node.js Backend",
      type: "popular",
      icon: <Star className="w-4 h-4" />,
    },
    {
      id: "4",
      text: "MongoDB Database",
      type: "popular",
      icon: <Star className="w-4 h-4" />,
    },
    {
      id: "5",
      text: "TypeScript Basics",
      type: "recent",
      icon: <Clock className="w-4 h-4" />,
    },
    {
      id: "6",
      text: "Next.js Framework",
      type: "recent",
      icon: <Clock className="w-4 h-4" />,
    },
  ];

  const filteredSuggestions = suggestions.filter((suggestion) =>
    suggestion.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isVisible || !searchQuery.trim()) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="absolute top-full left-0 right-0 mt-2 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-2xl border border-gray-200/50 dark:border-white/20 shadow-xl z-50 max-h-80 overflow-y-auto">
        <div className="p-4">
          {filteredSuggestions.length > 0 ? (
            <div className="space-y-2">
              {filteredSuggestions.map((suggestion, index) => (
                <motion.button
                  key={suggestion.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.1)" }}
                  onClick={() => onSuggestionClick(suggestion.text)}
                  className="w-full flex items-center space-x-3 p-3 rounded-xl text-left hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200 group">
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                    {suggestion.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                      {suggestion.text}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                      {suggestion.type}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <Search className="w-4 h-4 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200" />
                  </div>
                </motion.button>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                No suggestions found for "{searchQuery}"
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SearchSuggestions;

