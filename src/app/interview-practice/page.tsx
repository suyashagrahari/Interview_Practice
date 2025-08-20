"use client";

import { useState, useEffect } from "react";
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
  const [filteredTopics, setFilteredTopics] = useState<Topic[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const topics: Topic[] = [
    {
      id: "javascript",
      title: "JavaScript",
      description:
        "Master the fundamentals and advanced concepts of JavaScript.",
      icon: <Code className="w-8 h-8" />,
      color: "text-orange-500",
      bgColor: "bg-orange-100 dark:bg-orange-900/20",
      category: "frontend",
    },
    {
      id: "react",
      title: "React",
      description: "Build dynamic and interactive user interfaces with React.",
      icon: <Zap className="w-8 h-8" />,
      color: "text-blue-500",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
      category: "frontend",
    },
    {
      id: "nodejs",
      title: "Node.js",
      description:
        "Develop scalable and efficient server-side applications with Node.js.",
      icon: <Server className="w-8 h-8" />,
      color: "text-green-500",
      bgColor: "bg-green-100 dark:bg-green-900/20",
      category: "backend",
    },
    {
      id: "mongodb",
      title: "MongoDB",
      description: "Manage and query your data effectively with MongoDB.",
      icon: <Database className="w-8 h-8" />,
      color: "text-teal-500",
      bgColor: "bg-teal-100 dark:bg-teal-900/20",
      category: "database",
    },
    {
      id: "nextjs",
      title: "Next.js",
      description: "Create production-ready applications with Next.js.",
      icon: <Globe className="w-8 h-8" />,
      color: "text-gray-800 dark:text-gray-200",
      bgColor: "bg-gray-100 dark:bg-gray-800/20",
      category: "frontend",
    },
    {
      id: "expressjs",
      title: "Express.js",
      description: "Build robust and flexible APIs with Express.js.",
      icon: <Layers className="w-8 h-8" />,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/20",
      category: "backend",
    },
    {
      id: "typescript",
      title: "TypeScript",
      description:
        "Add type safety and modern features to your JavaScript code.",
      icon: <Code className="w-8 h-8" />,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
      category: "frontend",
    },
    {
      id: "python",
      title: "Python",
      description:
        "Learn Python programming for data science and web development.",
      icon: <Code className="w-8 h-8" />,
      color: "text-blue-500",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
      category: "backend",
    },
    {
      id: "java",
      title: "Java",
      description: "Master object-oriented programming with Java.",
      icon: <Code className="w-8 h-8" />,
      color: "text-red-500",
      bgColor: "bg-red-100 dark:bg-red-900/20",
      category: "backend",
    },
    {
      id: "sql",
      title: "SQL",
      description: "Learn database querying and management with SQL.",
      icon: <Database className="w-8 h-8" />,
      color: "text-purple-500",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
      category: "database",
    },
  ];

  const categories = [
    { id: "all", name: "All Topics", color: "bg-gray-500" },
    { id: "frontend", name: "Frontend", color: "bg-blue-500" },
    { id: "backend", name: "Backend", color: "bg-green-500" },
    { id: "database", name: "Database", color: "bg-purple-500" },
  ];

  useEffect(() => {
    let filtered = topics;

    if (searchQuery) {
      filtered = filtered.filter(
        (topic) =>
          topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          topic.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (topic) => topic.category === selectedCategory
      );
    }

    setFilteredTopics(filtered);
  }, [searchQuery, selectedCategory]);

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
              Explore Interview Topics
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Dive into a wide range of interview topics to enhance your
              preparation and boost your confidence.
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
                  placeholder="Search topics..."
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
              {categories.map((category, index) => (
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
          </motion.div>

          {/* Topics Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {filteredTopics.map((topic, index) => (
                <motion.div
                  key={topic.id}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  layout
                  className="group cursor-pointer"
                  onClick={() =>
                    router.push(`/interview-practice/${topic.id}`)
                  }>
                  <motion.div
                    className={`p-6 rounded-2xl ${topic.bgColor} border border-gray-200/50 dark:border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm h-full`}>
                    {/* Icon and Progress */}
                    <div className="flex items-center justify-between mb-4">
                      <motion.div
                        className={`w-16 h-16 ${topic.bgColor} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                        whileHover={{ rotate: 5 }}>
                        <div className={topic.color}>{topic.icon}</div>
                      </motion.div>
                      <ProgressRing
                        progress={Math.floor(Math.random() * 100)}
                        size={40}
                        strokeWidth={3}
                        color={
                          topic.color.replace("text-", "").includes("blue")
                            ? "#3b82f6"
                            : topic.color.replace("text-", "").includes("green")
                            ? "#10b981"
                            : "#f59e0b"
                        }
                      />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                      {topic.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {topic.description}
                    </p>

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

          {/* Empty State */}
          {filteredTopics.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No topics found
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Try adjusting your search or filter criteria.
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
