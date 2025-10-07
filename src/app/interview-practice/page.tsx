"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import Navigation from "@/components/layout/navigation";
import Footer from "@/components/layout/footer";
import FloatingActionButton from "@/components/ui/floating-action-button";
import ParticleBackground from "@/components/ui/particle-background";

// Interview Practice Components
import {
  SearchBar,
  CategoryFilter,
  TechnologyCard,
  LoadingSkeleton,
  EmptyState,
  ErrorMessage,
} from "@/components/interview-practice";

// Interview Practice Hooks
import {
  useCategories,
  useTechnologies,
} from "@/hooks/interview-practice";

// Interview Practice Constants
import { ANIMATION_DELAYS } from "@/constants/interview-practice";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const InterviewPracticePage = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Fetch categories
  const {
    categories,
    isLoading: isLoadingCategories,
    error: categoriesError,
  } = useCategories();

  // Fetch technologies
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

  // Filter technologies based on search query
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
            className="text-center mb-16"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: ANIMATION_DELAYS.HERO }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6"
            >
              Explore Interview Technologies
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed"
            >
              Master the latest technologies with curated interview questions
              and answers. Filter by category to focus on your area of
              expertise.
            </motion.p>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: ANIMATION_DELAYS.SEARCH }}
            className="mb-12"
          >
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search technologies..."
                showSuggestions={showSuggestions}
                onSuggestionClick={(suggestion) => {
                  setSearchQuery(suggestion);
                  setShowSuggestions(false);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              />
            </div>

            {/* Category Filters */}
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              isLoading={isLoadingCategories}
            />

            {/* Error Display for Categories */}
            {categoriesError && (
              <div className="mt-4">
                <ErrorMessage
                  message={`Failed to load categories: ${categoriesError}`}
                  variant="compact"
                />
              </div>
            )}
          </motion.div>

          {/* Technologies Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence>
              {isLoadingTechnologies ? (
                <LoadingSkeleton count={8} type="technology" />
              ) : (
                filteredTechnologies.map((tech) => (
                  <TechnologyCard
                    key={tech.id}
                    technology={tech}
                    onClick={() => {
                      router.push(`/interview-practice/${tech.slug}`);
                    }}
                  />
                ))
              )}
            </AnimatePresence>
          </motion.div>

          {/* Load More Button */}
          {hasMore && !isLoadingTechnologies && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center mt-12"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={loadMore}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Load More Technologies
              </motion.button>
            </motion.div>
          )}

          {/* Pagination Info */}
          {!isLoadingTechnologies && totalCount > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mt-8 text-gray-600 dark:text-gray-400"
            >
              Showing {filteredTechnologies.length} of {totalCount} technologies
              {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
            </motion.div>
          )}

          {/* Empty State */}
          {!isLoadingTechnologies && filteredTechnologies.length === 0 && (
            <EmptyState
              icon={Search}
              title="No technologies found"
              description="Try adjusting your search or filter criteria."
            />
          )}

          {/* Error Display for Technologies */}
          {technologiesError && (
            <div className="mt-8">
              <ErrorMessage
                message={`Failed to load technologies: ${technologiesError}`}
              />
            </div>
          )}
        </div>
      </main>

      <Footer />
      <FloatingActionButton />
    </div>
  );
};

export default InterviewPracticePage;
