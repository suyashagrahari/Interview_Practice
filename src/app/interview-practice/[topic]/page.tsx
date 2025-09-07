"use client";

import { useState, useEffect, useCallback } from "react";
import { useQuestions } from "@/hooks/useQuestions";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  Clock,
  Users,
  Star,
  Play,
  CheckCircle,
  XCircle,
  Search,
  Code,
  Lightbulb,
  Target,
  TrendingUp,
  Maximize2,
  X,
} from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Navigation from "@/components/layout/navigation";
import Footer from "@/components/layout/footer";
import FloatingActionButton from "@/components/ui/floating-action-button";
import ParticleBackground from "@/components/ui/particle-background";
// Removed Toast notifications

// Custom scrollbar styles
const customScrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(156, 163, 175, 0.1);
    border-radius: 10px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
    border-radius: 10px;
    transition: all 0.3s ease;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(135deg, #2563eb, #7c3aed);
  }
  
  .dark .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(75, 85, 99, 0.3);
  }
  
  .custom-scrollbar-thin::-webkit-scrollbar {
    width: 4px
  }
  
  .custom-scrollbar-thin::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .custom-scrollbar-thin::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
    border-radius: 4px;
    transition: all 0.3s ease;
  }
  
  .custom-scrollbar-thin::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(135deg, #2563eb, #7c3aed);
  }
  
  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

interface Question {
  id: string;
  title: string;
  difficulty: "Beginner" | "Intermediate" | "Expert";
  answer: string;
  keyPoints: string[];
  example?: string;
  explanation?: string;
}

interface TopicContent {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  participants: number;
  rating: number;
  questions: Question[];
}

const TopicPage = () => {
  const router = useRouter();
  const [topic, setTopic] = useState<TopicContent | null>(null);
  const [technologyData, setTechnologyData] = useState<any>(null);
  const [isLoadingTechnology, setIsLoadingTechnology] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<
    "Beginner" | "Intermediate" | "Expert"
  >("Beginner");
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isLoadingFromURL, setIsLoadingFromURL] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [completedQuestions, setCompletedQuestions] = useState<Set<string>>(
    new Set()
  );
  const [isProgrammaticScroll, setIsProgrammaticScroll] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  // Removed toast state and helpers

  // Static data for all technologies
  const staticTopicData = {
    icon: <Code className="w-8 h-8" />,
    color: "text-blue-500",
    bgColor: "bg-blue-100 dark:bg-blue-900/20",
    duration: "10-15 hours",
    participants: 12850,
    rating: 4.9,
    questions: [],
  };

  // Get the topic from URL params
  const urlParams = useParams();
  const searchParams = useSearchParams();
  const topicSlug = urlParams.topic as string;
  const questionSlug = urlParams.question as string;
  const questionFromQuery = searchParams.get("question");

  // Log the technology slug being used
  useEffect(() => {
    console.log("🔗 Technology slug from URL:", topicSlug);
    console.log("🔗 Question slug from URL:", questionSlug);
    console.log("🔗 Question from query:", questionFromQuery);
    console.log("🔗 Full URL params:", urlParams);
    console.log("🔗 Search params:", searchParams.toString());
  }, [topicSlug, questionSlug, questionFromQuery, urlParams, searchParams]);

  // Use the custom hook for questions - initially fetch all questions to determine difficulty
  const {
    questions: apiQuestions,
    isLoading: isLoadingQuestions,
    error: questionsError,
    hasMore,
    loadMore,
    currentPage,
    totalPages,
    totalCount,
  } = useQuestions({
    technology: topicSlug,
    level: isInitialLoad ? undefined : selectedDifficulty, // Don't filter by level on initial load
    pageSize: 25,
    sort: "order:asc",
  });

  // Fetch technology data from API
  useEffect(() => {
    const fetchTechnologyData = async () => {
      if (!topicSlug) return;

      setIsLoadingTechnology(true);
      try {
        const response = await fetch(
          `http://localhost:1337/api/technologies?filters[slug][$eq]=${topicSlug}&populate=category`
        );
        const data = await response.json();
        if (data.data && data.data.length > 0) {
          setTechnologyData(data.data[0]);
          console.log("🔧 Technology data from API:", data.data[0]);
        }
      } catch (error) {
        console.error("Error fetching technology data:", error);
      } finally {
        setIsLoadingTechnology(false);
      }
    };

    fetchTechnologyData();
  }, [topicSlug]);

  // Function to update URL with question slug
  const updateQuestionURL = useCallback(
    (questionId: string) => {
      const question = apiQuestions.find((q) => q.id.toString() === questionId);
      if (question && question.slug) {
        const newUrl = `/interview-practice/${topicSlug}/${question.slug}`;
        window.history.pushState({}, "", newUrl);
        console.log("🔗 URL updated to:", newUrl);
      }
    },
    [apiQuestions, topicSlug]
  );

  // Handle URL changes to select correct question and set difficulty level
  useEffect(() => {
    const targetQuestionSlug = questionSlug || questionFromQuery;

    if (targetQuestionSlug && apiQuestions.length > 0) {
      setIsLoadingFromURL(true);
      const question = apiQuestions.find((q) => q.slug === targetQuestionSlug);
      if (question) {
        setSelectedQuestion(question.id.toString());
        setSelectedDifficulty(
          question.level as "Beginner" | "Intermediate" | "Expert"
        );
        setIsInitialLoad(false);
        console.log("🔗 Question selected from URL:", question.slug);
        console.log("🔗 Difficulty level set to:", question.level);

        // If we came from a query parameter, update the URL to the proper format
        if (questionFromQuery && !questionSlug) {
          const newUrl = `/interview-practice/${topicSlug}/${question.slug}`;
          window.history.replaceState({}, "", newUrl);
          console.log("🔗 URL updated to proper format:", newUrl);
        }

        // Scroll to the question after a short delay to ensure it's rendered
        setTimeout(() => {
          const questionElement = document.getElementById(
            `question-${question.id}`
          );
          if (questionElement) {
            questionElement.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
            console.log("🔗 Scrolled to question from URL:", question.slug);
          }
          setIsLoadingFromURL(false);
        }, 500);
      } else {
        setIsLoadingFromURL(false);
      }
    } else if (apiQuestions.length > 0 && isInitialLoad) {
      // If no specific question in URL, set to first question and its difficulty
      const firstQuestion = apiQuestions[0];
      setSelectedQuestion(firstQuestion.id.toString());
      setSelectedDifficulty(
        firstQuestion.level as "Beginner" | "Intermediate" | "Expert"
      );
      setIsInitialLoad(false);
      console.log(
        "🔗 No specific question in URL, selecting first question:",
        firstQuestion.slug
      );
      console.log("🔗 Difficulty level set to:", firstQuestion.level);
    }
  }, [questionSlug, questionFromQuery, apiQuestions, topicSlug, isInitialLoad]);

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const currentPath = window.location.pathname;
      const pathParts = currentPath.split("/");
      const questionSlugFromPath = pathParts[pathParts.length - 1];
      const currentSearchParams = new URLSearchParams(window.location.search);
      const questionFromSearch = currentSearchParams.get("question");

      const targetQuestionSlug =
        questionSlugFromPath !== topicSlug
          ? questionSlugFromPath
          : questionFromSearch;

      if (targetQuestionSlug) {
        // Find question by slug and select it
        const question = apiQuestions.find(
          (q) => q.slug === targetQuestionSlug
        );
        if (question) {
          setSelectedQuestion(question.id.toString());
          console.log(
            "🔗 Question selected from browser navigation:",
            question.slug
          );
        }
      } else {
        // No question in URL, select first question
        if (apiQuestions.length > 0) {
          setSelectedQuestion(apiQuestions[0].id.toString());
        }
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [apiQuestions, topicSlug]);

  // Update meta tags for SEO when question changes
  useEffect(() => {
    if (selectedQuestion && apiQuestions.length > 0) {
      const question = apiQuestions.find(
        (q) => q.id.toString() === selectedQuestion
      );
      if (question) {
        // Update document title
        document.title = `${question.metaTitle || question.title} | ${
          topic?.title || topicSlug
        } Interview Questions`;

        // Update meta description
        const metaDescription = document.querySelector(
          'meta[name="description"]'
        );
        if (metaDescription) {
          metaDescription.setAttribute(
            "content",
            question.metaDescription || question.answer.substring(0, 160)
          );
        }

        // Update Open Graph tags
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) {
          ogTitle.setAttribute("content", question.metaTitle || question.title);
        }

        const ogDescription = document.querySelector(
          'meta[property="og:description"]'
        );
        if (ogDescription) {
          ogDescription.setAttribute(
            "content",
            question.metaDescription || question.answer.substring(0, 160)
          );
        }

        console.log("🔍 SEO meta tags updated for question:", question.slug);
      }
    }
  }, [selectedQuestion, apiQuestions, topic, topicSlug]);

  // Log when difficulty level changes
  useEffect(() => {
    console.log("📊 Selected difficulty level:", selectedDifficulty);
    console.log("📊 Fetching questions for:", {
      technology: topicSlug,
      level: selectedDifficulty,
    });
    console.log(
      "📊 Available questions for this difficulty:",
      apiQuestions.filter((q) => q.level === selectedDifficulty).length
    );
  }, [selectedDifficulty, topicSlug, apiQuestions]);

  // Log the questions data when it changes
  useEffect(() => {
    if (apiQuestions.length > 0) {
      console.log("=== QUESTIONS DATA ===");
      console.log("Technology:", topicSlug);
      console.log("Difficulty Level:", selectedDifficulty);
      console.log("Questions data:", apiQuestions);
      console.log("Total questions:", totalCount);
      console.log("Current page:", currentPage);
      console.log("Total pages:", totalPages);
      console.log("Has more:", hasMore);

      // Log detailed question information
      apiQuestions.forEach((question, index) => {
        console.log(`\n--- Question ${index + 1} ---`);
        console.log("Title:", question.title);
        console.log("Question:", question.question);
        console.log("Answer:", question.answer);
        console.log("Level:", question.level);
        console.log("Order:", question.order);
        console.log("View Count:", question.viewCount);
        console.log("Is Featured:", question.isFeatured);
        console.log("Technology:", question.technology.name);
        console.log(
          "Technology Category:",
          question.technology.category?.name || "No category"
        );
        console.log("Author:", question.author.name);
        console.log("Created At:", question.createdAt);
        console.log("Updated At:", question.updatedAt);
      });
    }
  }, [
    apiQuestions,
    totalCount,
    currentPage,
    totalPages,
    hasMore,
    topicSlug,
    selectedDifficulty,
  ]);

  // Set first question as selected when API questions load or difficulty changes
  useEffect(() => {
    if (apiQuestions.length > 0) {
      // If no question is selected or no question slug in URL, select first question
      if (!selectedQuestion && !questionSlug && !questionFromQuery) {
        setSelectedQuestion(apiQuestions[0].id.toString());
        console.log("🎯 Auto-selecting first question:", apiQuestions[0].slug);
      }
    }
  }, [apiQuestions, selectedQuestion, questionSlug, questionFromQuery]);

  // Handle difficulty level changes - select first question of new difficulty
  useEffect(() => {
    if (
      apiQuestions.length > 0 &&
      !questionSlug &&
      !questionFromQuery &&
      !isInitialLoad
    ) {
      // Find first question of the current difficulty level
      const firstQuestionOfDifficulty = apiQuestions.find(
        (q) => q.level === selectedDifficulty
      );
      if (firstQuestionOfDifficulty) {
        setSelectedQuestion(firstQuestionOfDifficulty.id.toString());
        updateQuestionURL(firstQuestionOfDifficulty.id.toString());
        console.log(
          "🎯 Difficulty changed - selecting first question:",
          firstQuestionOfDifficulty.slug
        );
      }
    }
  }, [
    selectedDifficulty,
    apiQuestions,
    questionSlug,
    questionFromQuery,
    updateQuestionURL,
    isInitialLoad,
  ]);

  // Infinite scroll functionality
  useEffect(() => {
    const handleScroll = () => {
      const scrollContainer = document.querySelector(".custom-scrollbar");
      if (!scrollContainer) return;

      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

      // Load more when user scrolls to 80% of the content
      if (scrollPercentage > 0.8 && hasMore && !isLoadingQuestions) {
        console.log("🔄 Loading more questions...");
        console.log("📊 Current questions loaded:", apiQuestions.length);
        console.log("📊 Total questions available:", totalCount);
        console.log("📊 Current page:", currentPage);
        console.log("📊 Has more pages:", hasMore);
        loadMore();
      }
    };

    const scrollContainer = document.querySelector(".custom-scrollbar");
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
      return () => scrollContainer.removeEventListener("scroll", handleScroll);
    }
  }, [hasMore, isLoadingQuestions, loadMore]);

  // Set topic data combining API data with static data
  useEffect(() => {
    if (technologyData) {
      const topicData: TopicContent = {
        id: technologyData.slug,
        title: technologyData.title,
        description: technologyData.description,
        icon: staticTopicData.icon,
        color: staticTopicData.color,
        bgColor: staticTopicData.bgColor,
        category: technologyData.category?.slug || "general",
        difficulty: technologyData.difficultyLevel as
          | "Beginner"
          | "Intermediate"
          | "Advanced",
        duration: staticTopicData.duration,
        participants: staticTopicData.participants,
        rating: staticTopicData.rating,
        questions: staticTopicData.questions,
      };
      setTopic(topicData);
      console.log("🎯 Combined topic data:", topicData);
    }
  }, [technologyData]);

  // Handle ESC key for focus mode
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isFocusMode) {
        setIsFocusMode(false);
      }
    };

    if (isFocusMode) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isFocusMode]);

  // Handle scroll-based question switching
  useEffect(() => {
    const handleScroll = () => {
      const questions = document.querySelectorAll('[id^="question-"]');
      const windowHeight = window.innerHeight;
      const scrollContainer = document.querySelector(".custom-scrollbar");

      if (!scrollContainer) return;

      questions.forEach((questionEl) => {
        const rect = questionEl.getBoundingClientRect();
        const questionId = questionEl.id.replace("question-", "");

        // Check if question is in the center of the viewport
        const questionCenter = rect.top + rect.height / 2;
        const viewportCenter = windowHeight / 2;

        // If question center is within 200px of viewport center, select it
        // But don't override if we're loading from URL
        if (
          Math.abs(questionCenter - viewportCenter) < 200 &&
          !isLoadingFromURL
        ) {
          setSelectedQuestion(questionId);
          // Update URL with question slug
          updateQuestionURL(questionId);
        }
      });
    };

    // Listen to scroll events on the questions container
    const scrollContainer = document.querySelector(".custom-scrollbar");
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll, {
        passive: true,
      });
      return () => scrollContainer.removeEventListener("scroll", handleScroll);
    }

    // Fallback to window scroll if container not found
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLoadingFromURL, updateQuestionURL]);

  if (!topic) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <ParticleBackground />
        <Navigation />
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Topic not found
            </h1>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Filter API questions based on difficulty and search query
  const filteredQuestions = apiQuestions.filter((q) => {
    const matchesDifficulty = isInitialLoad || q.level === selectedDifficulty;
    const matchesSearch = q.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesDifficulty && matchesSearch;
  });

  const currentQuestion = apiQuestions.find(
    (q) => q.id.toString() === selectedQuestion
  );

  const toggleQuestionCompletion = (questionId: string) => {
    const newCompleted = new Set(completedQuestions);
    if (newCompleted.has(questionId)) {
      newCompleted.delete(questionId);
    } else {
      newCompleted.add(questionId);
    }
    setCompletedQuestions(newCompleted);
  };

  const scrollToQuestion = (questionId: string) => {
    const questionElement = document.getElementById(`question-${questionId}`);
    if (questionElement) {
      const scrollContainer = document.querySelector(".custom-scrollbar");
      if (scrollContainer) {
        // Set programmatic scroll flag to prevent scroll handler interference
        setIsProgrammaticScroll(true);

        // Calculate the target scroll position
        const containerRect = scrollContainer.getBoundingClientRect();
        const questionRect = questionElement.getBoundingClientRect();
        const scrollTop = scrollContainer.scrollTop;
        const targetScrollTop =
          scrollTop + questionRect.top - containerRect.top - 100;

        // Smooth scroll to the question
        scrollContainer.scrollTo({
          top: targetScrollTop,
          behavior: "smooth",
        });

        // Reset programmatic scroll flag after scroll animation
        setTimeout(() => {
          setIsProgrammaticScroll(false);
        }, 1200); // Slightly longer delay to ensure smooth navigation
      }
    }
  };

  const getProgressPercentage = () => {
    const totalQuestions = apiQuestions.length;
    const completedCount = completedQuestions.size;
    return Math.round((completedCount / totalQuestions) * 100);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: customScrollbarStyles }} />
      <div
        className={`${
          isFocusMode ? "h-screen" : "min-h-screen"
        } bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900`}>
        <AnimatePresence>
          {!isFocusMode && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}>
              <ParticleBackground />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation - Hidden in focus mode */}
        <AnimatePresence>
          {!isFocusMode && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}>
              <Navigation />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main
          className={`${isFocusMode ? "pt-0" : "pt-24"} ${
            isFocusMode ? "pb-0" : "pb-16"
          }`}>
          <div className={`w-full ${isFocusMode ? "px-0" : "px-0"}`}>
            {/* Error Display for Questions */}
            {questionsError && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mx-4 mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                <p className="text-red-600 dark:text-red-400 text-sm text-center">
                  Failed to load questions: {questionsError}
                </p>
              </motion.div>
            )}

            {/* Loading State for Questions */}
            {isLoadingQuestions && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mx-4 mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                <p className="text-blue-600 dark:text-blue-400 text-sm text-center">
                  Loading questions for <strong>{topicSlug}</strong>...
                </p>
              </motion.div>
            )}
            {/* Focus Mode Exit Button - Only visible in focus mode */}
            <AnimatePresence>
              {isFocusMode && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="fixed top-2 right-1 z-50">
                  <motion.button
                    onClick={() => setIsFocusMode(false)}
                    className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title="Exit Focus Mode">
                    <X className="w-4 h-4" />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Topic Header - Hidden in focus mode */}
            <AnimatePresence>
              {!isFocusMode && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.6 }}
                  className="mb-4">
                  <div className="bg-white/80 dark:bg-white/10 rounded-none p-4 backdrop-blur-sm border-b border-gray-200/50 dark:border-white/20 shadow-md">
                    <div className="flex items-center justify-between w-full">
                      {/* Left Side - Icon and Text */}
                      <div className="flex items-center space-x-3">
                        {/* Back Button */}
                        <motion.button
                          onClick={() => router.back()}
                          className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}>
                          <ArrowLeft className="w-5 h-5" />
                        </motion.button>

                        <motion.div
                          className={`w-10 h-10 ${topic.bgColor} rounded-lg flex items-center justify-center ${topic.color}`}
                          whileHover={{ rotate: 5, scale: 1.05 }}
                          transition={{ duration: 0.3 }}>
                          {topic.icon}
                        </motion.div>
                        <div>
                          <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                            {isLoadingTechnology ? (
                              <div className="animate-pulse bg-gray-300 dark:bg-gray-600 h-5 w-32 rounded"></div>
                            ) : (
                              `${topic?.title || topicSlug} Interview Questions`
                            )}
                          </h1>
                          <p className="text-xs text-gray-600 dark:text-gray-300">
                            {isLoadingTechnology ? (
                              <div className="animate-pulse bg-gray-300 dark:bg-gray-600 h-3 w-48 rounded mt-1"></div>
                            ) : (
                              topic?.description ||
                              "Loading technology description..."
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Right Side - Progress and Stats */}
                      <div className="flex items-center space-x-4">
                        {/* Compact Stats - Horizontal */}
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3 text-blue-600" />
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              {topic.duration}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="w-3 h-3 text-green-600" />
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              {topic.participants.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 text-yellow-600" />
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              {topic.rating}/5.0
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <BookOpen className="w-3 h-3 text-purple-600" />
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              {apiQuestions.length}
                              {totalCount > 0 && `/${totalCount}`}
                            </span>
                          </div>
                        </div>

                        {/* Progress Circle - Even Smaller */}
                        <div className="relative">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <div className="w-9 h-9 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center">
                              <span className="text-xs font-bold text-gray-900 dark:text-white">
                                {getProgressPercentage()}%
                              </span>
                            </div>
                          </div>
                          <div className="absolute inset-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-20 animate-pulse"></div>
                        </div>

                        {/* Focus Mode Button */}
                        <motion.button
                          onClick={() => setIsFocusMode(!isFocusMode)}
                          className="w-10 h-10 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center justify-center transition-all duration-200"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          title="Enter Focus Mode">
                          <Maximize2 className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main Content Grid */}
            <div
              className={`grid ${
                isFocusMode
                  ? "grid-cols-1 h-[calc(100vh-32px)]"
                  : "grid-cols-1 lg:grid-cols-7 gap-4"
              }`}>
              {/* Left Sidebar - Questions (Hidden in focus mode) */}
              <AnimatePresence>
                {!isFocusMode && (
                  <motion.div
                    initial={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.3 }}
                    className="lg:col-span-2">
                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="bg-white/80 dark:bg-white/10 rounded-2xl p-6 backdrop-blur-sm border border-gray-200/50 dark:border-white/20 shadow-lg sticky top-24">
                      {/* Search Bar */}
                      <div className="relative mb-6">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search questions..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-9 pr-3 py-3 bg-white/80 dark:bg-white/10 border border-gray-200/50 dark:border-white/20 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm"
                        />
                      </div>

                      {/* Difficulty Tabs */}
                      <div className="flex flex-row space-x-2 mb-6">
                        {(["Beginner", "Intermediate", "Expert"] as const).map(
                          (difficulty) => (
                            <motion.button
                              key={difficulty}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setSelectedDifficulty(difficulty)}
                              className={`px-4 py-2.5 rounded-lg text-xs font-medium transition-all duration-200 flex-1 border-2 ${
                                selectedDifficulty === difficulty
                                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md border-blue-400"
                                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border-transparent hover:border-blue-200 dark:hover:border-blue-700"
                              }`}>
                              {difficulty}
                            </motion.button>
                          )
                        )}
                      </div>

                      {/* Questions List */}
                      <div className="space-y-2 max-h-[600px] overflow-y-auto custom-scrollbar-thin pr-2">
                        {filteredQuestions.map((question, index) => (
                          <motion.button
                            key={question.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                              duration: 0.5,
                              delay: 0.3 + index * 0.1,
                            }}
                            onClick={() => {
                              // Update selected question immediately for sidebar highlighting
                              setSelectedQuestion(question.id.toString());
                              // Update URL with question slug
                              updateQuestionURL(question.id.toString());
                              // Scroll to the question smoothly
                              scrollToQuestion(question.id.toString());
                            }}
                            className={`w-full text-left p-3 rounded-lg transition-all duration-200 border-2 ${
                              selectedQuestion === question.id.toString()
                                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md border-blue-400"
                                : "hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 border-transparent hover:border-blue-200 dark:hover:border-blue-700"
                            }`}>
                            <div className="flex items-center  space-x-3">
                              <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-200 ${
                                  selectedQuestion === question.id.toString()
                                    ? "bg-white/20 scale-110"
                                    : "bg-gray-100 dark:bg-gray-700 hover:scale-105"
                                }`}>
                                <span
                                  className={`text-xs font-bold ${
                                    selectedQuestion === question.id.toString()
                                      ? "text-white"
                                      : "text-gray-600 dark:text-gray-300"
                                  }`}>
                                  {(currentPage - 1) * 25 + index + 1}
                                </span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium leading-tight line-clamp-3">
                                  {question.title}
                                </div>
                                {completedQuestions.has(
                                  question.id.toString()
                                ) && (
                                  <div className="flex items-center mt-1">
                                    <CheckCircle className="w-3 h-3 text-green-500 mr-1" />
                                    <span className="text-xs text-green-600 dark:text-green-400">
                                      Completed
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Right Pane - All Questions Scrollable */}
              <div className={isFocusMode ? "col-span-1" : "lg:col-span-5"}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className={`${
                    isFocusMode
                      ? "h-full bg-white/80 dark:bg-white/10 rounded-none border-0 shadow-none"
                      : "bg-white/80 dark:bg-white/10 rounded-2xl backdrop-blur-sm border border-gray-200/50 dark:border-white/20 shadow-lg"
                  }`}>
                  {/* Questions Container with Scroll */}
                  <div
                    className={`overflow-y-auto custom-scrollbar ${
                      isFocusMode ? "h-full p-4" : "p-8 max-h-[800px]"
                    }`}
                    onScroll={(e) => {
                      const container = e.currentTarget;

                      // Only update selection if not during programmatic scroll
                      if (isProgrammaticScroll) return;

                      const questions =
                        container.querySelectorAll('[id^="question-"]');

                      questions.forEach((questionEl) => {
                        const rect = questionEl.getBoundingClientRect();
                        const containerRect = container.getBoundingClientRect();
                        const questionId = questionEl.id.replace(
                          "question-",
                          ""
                        );

                        // Calculate relative position within the scroll container
                        const relativeTop = rect.top - containerRect.top;
                        const containerHeight = containerRect.height;

                        // If question is in the center area of the container, select it
                        if (
                          relativeTop >= containerHeight * 0.2 &&
                          relativeTop <= containerHeight * 0.8
                        ) {
                          setSelectedQuestion(questionId);
                        }
                      });
                    }}>
                    {/* Initial Loading State */}
                    {isLoadingQuestions && apiQuestions.length === 0 && (
                      <div className="flex justify-center items-center py-12">
                        <div className="flex items-center space-x-3 text-gray-500 dark:text-gray-400">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                          <span className="text-lg">Loading questions...</span>
                        </div>
                      </div>
                    )}

                    {/* Questions List */}
                    {filteredQuestions.map((question, index) => (
                      <motion.div
                        key={question.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className={`${
                          isFocusMode ? "mb-4" : "mb-6"
                        } p-4 rounded-lg transition-all duration-300 ${
                          selectedQuestion === question.id.toString()
                            ? "bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-blue-200 dark:border-blue-800"
                            : "bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-white/20"
                        }`}
                        id={`question-${question.id}`}>
                        {/* Question Header */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                              Q{(currentPage - 1) * 25 + index + 1}
                            </div>
                            <div>
                              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                {question.title}
                              </h2>
                              <div className="flex items-center space-x-2 mt-1">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    question.level === "Beginner"
                                      ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                                      : question.level === "Intermediate"
                                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300"
                                      : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
                                  }`}>
                                  {question.level}
                                </span>
                                <button
                                  onClick={() =>
                                    toggleQuestionCompletion(
                                      question.id.toString()
                                    )
                                  }
                                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                                    completedQuestions.has(
                                      question.id.toString()
                                    )
                                      ? "bg-green-500 border-green-500 text-white"
                                      : "border-gray-300 dark:border-gray-600 hover:border-blue-500"
                                  }`}>
                                  {completedQuestions.has(
                                    question.id.toString()
                                  ) && <CheckCircle className="w-3 h-3" />}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Answer */}
                        <div className="mb-6">
                          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                            <Lightbulb className="w-4 h-4 text-yellow-500 mr-2" />
                            Answer
                          </h3>
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
                            {question.answer}
                          </p>
                        </div>

                        {/* Key Points */}
                        {question.keyPoints && (
                          <div className="mb-6">
                            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                              <Target className="w-4 h-4 text-blue-500 mr-2" />
                              Key Points
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {question.keyPoints.map((point, pointIndex) => (
                                <motion.div
                                  key={pointIndex}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{
                                    duration: 0.5,
                                    delay: pointIndex * 0.1,
                                  }}
                                  className="flex items-start space-x-2 p-2 bg-white/80 dark:bg-white/10 rounded-lg border border-gray-200/50 dark:border-white/20">
                                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                                  <span className="text-gray-700 dark:text-gray-300 text-xs">
                                    {point}
                                  </span>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Example */}
                        {question.example && (
                          <div className="mb-6">
                            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                              <Code className="w-4 h-4 text-green-500 mr-2" />
                              Example
                            </h3>
                            <div className="bg-gray-900 dark:bg-gray-800 rounded-lg p-3 overflow-x-auto">
                              <pre className="text-green-400 text-xs">
                                <code>{question.example}</code>
                              </pre>
                            </div>
                            {question.explanation && (
                              <p className="text-gray-600 dark:text-gray-400 text-xs mt-2 italic">
                                {question.explanation}
                              </p>
                            )}
                          </div>
                        )}

                        {/* Author Information */}
                        <div className="flex justify-end mt-4 pt-3 border-t border-gray-200/50 dark:border-gray-700/50">
                          <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                            <span>By</span>
                            <span className="font-medium text-gray-700 dark:text-gray-300">
                              {question.author.name}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}

                    {/* Infinite Scroll Loading Indicator */}
                    {hasMore && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-center items-center py-8">
                        <div className="flex items-center space-x-3 text-gray-500 dark:text-gray-400">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                          <span className="text-sm">
                            Loading more questions...
                          </span>
                        </div>
                      </motion.div>
                    )}

                    {/* End of Questions Indicator */}
                    {!hasMore && apiQuestions.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-center items-center py-8">
                        <div className="text-center">
                          <div className="text-gray-400 dark:text-gray-500 text-sm">
                            🎉 You've reached the end! All {totalCount}{" "}
                            questions loaded.
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer - Hidden in focus mode */}
        <AnimatePresence>
          {!isFocusMode && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}>
              <Footer />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Action Button - Hidden in focus mode */}
        <AnimatePresence>
          {!isFocusMode && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}>
              <FloatingActionButton />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default TopicPage;
