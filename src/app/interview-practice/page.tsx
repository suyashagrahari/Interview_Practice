"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Code,
  Zap,
  Database,
  Globe,
  Server,
  Layers,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Navigation from "@/components/layout/navigation";
import Footer from "@/components/layout/footer";
import FloatingActionButton from "@/components/ui/floating-action-button";
import ParticleBackground from "@/components/ui/particle-background";
import SearchSuggestions from "@/components/ui/search-suggestions";
import ProgressRing from "@/components/ui/progress-ring";
import { useCategories } from "@/hooks/useCategories";
import { useTechnologies } from "@/hooks/useTechnologies";

interface Topic {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  category: string;
}

const InterviewPracticePage = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Use the custom hook for categories
  const {
    categories,
    isLoading: isLoadingCategories,
    error: categoriesError,
  } = useCategories();

  // Use the custom hook for technologies
  const {
    technologies,
    isLoading: isLoadingTechnologies,
    error: technologiesError,
    hasMore,
    loadMore,
    currentPage,
    totalPages,
    totalCount,
  } = useTechnologies({
    category: selectedCategory,
    pageSize: 25,
  });
  // Filter technologies based on search query with memoization
  const filteredTechnologies = useMemo(() => {
    if (!searchQuery) return technologies;
    return technologies.filter((tech) => {
      return (
        tech.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tech.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tech.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [technologies, searchQuery]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <ParticleBackground />
      <Navigation />

      {/* Main Content */}
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Explore Interview Technologies
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Master the latest technologies with curated interview questions
              and answers. Filter by category to focus on your area of
              expertise.
            </motion.p>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-12">
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search technologies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() =>
                    setTimeout(() => setShowSuggestions(false), 200)
                  }
                  className="w-full pl-12 pr-4 py-4 bg-white/80 dark:bg-white/10 border border-gray-200/50 dark:border-white/20 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm shadow-lg"
                />
                <SearchSuggestions
                  isVisible={showSuggestions}
                  searchQuery={searchQuery}
                  onSuggestionClick={(suggestion) => {
                    setSearchQuery(suggestion);
                    setShowSuggestions(false);
                  }}
                />
              </div>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap justify-center gap-3">
              {isLoadingCategories
                ? // Loading skeleton for categories
                  Array.from({ length: 4 }).map((_, index) => (
                    <div
                      key={index}
                      className="px-6 py-3 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse"
                      style={{ width: "120px", height: "48px" }}
                    />
                  ))
                : categories.map((category, index) => (
                    <motion.button
                      key={category.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                        selectedCategory === category.id
                          ? `bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg`
                          : `bg-white/80 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-white/20 border border-gray-200/50 dark:border-white/20`
                      } backdrop-blur-sm`}>
                      {category.name}
                    </motion.button>
                  ))}
            </div>

            {/* Error Display for Categories */}
            {categoriesError && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                <p className="text-red-600 dark:text-red-400 text-sm text-center">
                  Failed to load categories: {categoriesError}
                </p>
              </motion.div>
            )}
          </motion.div>

          {/* Technologies Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {isLoadingTechnologies
                ? // Loading skeleton for technologies
                  Array.from({ length: 8 }).map((_, index) => (
                    <motion.div
                      key={index}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      className="p-6 rounded-2xl bg-gray-200 dark:bg-gray-700 animate-pulse h-64">
                      <div className="w-16 h-16 bg-gray-300 dark:bg-gray-600 rounded-2xl mb-4"></div>
                      <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded mb-3"></div>
                      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                    </motion.div>
                  ))
                : filteredTechnologies.map((tech, index) => (
                    <motion.div
                      key={tech.id}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover="hover"
                      layout
                      className="group cursor-pointer"
                      onClick={() => {
                        console.log("🚀 Navigating to technology:", tech.slug);
                        console.log("🚀 Technology details:", {
                          name: tech.name,
                          title: tech.title,
                          slug: tech.slug,
                          difficultyLevel: tech.difficultyLevel,
                        });
                        router.push(`/interview-practice/${tech.slug}`);
                      }}>
                      <motion.div
                        className={`p-6 rounded-2xl ${tech.bgColor} border border-gray-200/50 dark:border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm h-full`}>
                        {/* Icon and Progress */}
                        <div className="flex items-center justify-between mb-4">
                          <motion.div
                            className={`w-16 h-16 ${tech.bgColor} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                            whileHover={{ rotate: 5 }}>
                            <div className="text-3xl">{tech.icon}</div>
                          </motion.div>
                          <ProgressRing
                            progress={Math.floor(Math.random() * 100)}
                            size={40}
                            strokeWidth={3}
                            color={
                              tech.color.replace("text-", "").includes("blue")
                                ? "#3b82f6"
                                : tech.color
                                    .replace("text-", "")
                                    .includes("green")
                                ? "#10b981"
                                : tech.color
                                    .replace("text-", "")
                                    .includes("purple")
                                ? "#8b5cf6"
                                : "#f59e0b"
                            }
                          />
                        </div>

                        {/* Content */}
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                          {tech.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
                          {tech.description}
                        </p>

                        {/* Difficulty and Popularity */}
                        <div className="flex items-center justify-between mb-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${tech.color} ${tech.bgColor}`}>
                            {tech.difficultyLevel}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {tech.popularity} questions
                          </span>
                        </div>

                        {/* Hover Effect */}
                        <motion.div
                          className="mt-4 flex items-center text-blue-600 dark:text-blue-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          initial={{ x: -10 }}
                          whileHover={{ x: 0 }}>
                          Start Learning
                          <motion.div
                            className="ml-2 w-4 h-4"
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}>
                            →
                          </motion.div>
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  ))}
            </AnimatePresence>
          </motion.div>

          {/* Load More Button */}
          {hasMore && !isLoadingTechnologies && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center mt-12">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={loadMore}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                Load More Technologies
              </motion.button>
            </motion.div>
          )}

          {/* Pagination Info */}
          {!isLoadingTechnologies && totalCount > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mt-8 text-gray-600 dark:text-gray-400">
              Showing {filteredTechnologies.length} of {totalCount} technologies
              {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
            </motion.div>
          )}

          {/* Empty State */}
          {!isLoadingTechnologies && filteredTechnologies.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No technologies found
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Try adjusting your search or filter criteria.
              </p>
            </motion.div>
          )}

          {/* Error Display for Technologies */}
          {technologiesError && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
              <p className="text-red-600 dark:text-red-400 text-sm text-center">
                Failed to load technologies: {technologiesError}
              </p>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
      <FloatingActionButton />
    </div>
  );
};

export default InterviewPracticePage;
