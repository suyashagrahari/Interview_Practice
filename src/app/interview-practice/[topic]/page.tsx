"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Code } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Navigation from "@/components/layout/navigation";
import Footer from "@/components/layout/footer";
import FloatingActionButton from "@/components/ui/floating-action-button";
import ParticleBackground from "@/components/ui/particle-background";

// Interview Practice Components
import {
  SearchBar,
  DifficultyTabs,
  QuestionListSidebar,
  QuestionCard,
  TopicHeader,
  LoadingSkeleton,
  ErrorMessage,
} from "@/components/interview-practice";

// Interview Practice Hooks
import {
  useQuestions,
  useQuestionURL,
  useInfiniteScroll,
  useCompletedQuestions,
} from "@/hooks/interview-practice";

// Interview Practice Constants, Types, Styles
import { STATIC_TOPIC_DATA } from "@/constants/interview-practice";
import { customScrollbarStyles } from "@/styles/interview-practice";
import type { TopicContent } from "@/types/interview-practice";

const TopicPage = () => {
  const router = useRouter();
  const urlParams = useParams();
  const searchParams = useSearchParams();
  const topicSlug = urlParams.topic as string;
  const questionSlug = urlParams.question as string;
  const questionFromQuery = searchParams.get("question");

  // State management
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
  const [isProgrammaticScroll, setIsProgrammaticScroll] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);

  // Custom hooks
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
    level: isInitialLoad ? undefined : selectedDifficulty,
    pageSize: 25,
    sort: "order:asc",
  });

  const { updateQuestionURL } = useQuestionURL(apiQuestions, topicSlug);
  const { completedQuestions, toggleQuestionCompletion, getProgressPercentage } =
    useCompletedQuestions();

  // Infinite scroll
  useInfiniteScroll({
    hasMore,
    isLoading: isLoadingQuestions,
    loadMore,
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
        }
      } catch (error) {
        console.error("Error fetching technology data:", error);
      } finally {
        setIsLoadingTechnology(false);
      }
    };

    fetchTechnologyData();
  }, [topicSlug]);

  // Set topic data combining API data with static data
  useEffect(() => {
    if (technologyData) {
      const topicData: TopicContent = {
        id: technologyData.slug,
        title: technologyData.title,
        description: technologyData.description,
        icon: <Code className="w-8 h-8" />,
        color: STATIC_TOPIC_DATA.color,
        bgColor: STATIC_TOPIC_DATA.bgColor,
        category: technologyData.category?.slug || "general",
        difficulty: technologyData.difficultyLevel as
          | "Beginner"
          | "Intermediate"
          | "Advanced",
        duration: STATIC_TOPIC_DATA.duration,
        participants: STATIC_TOPIC_DATA.participants,
        rating: STATIC_TOPIC_DATA.rating,
        questions: STATIC_TOPIC_DATA.questions,
      };
      setTopic(topicData);
    }
  }, [technologyData]);

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

        if (questionFromQuery && !questionSlug) {
          const newUrl = `/interview-practice/${topicSlug}/${question.slug}`;
          window.history.replaceState({}, "", newUrl);
        }

        setTimeout(() => {
          const questionElement = document.getElementById(
            `question-${question.id}`
          );
          if (questionElement) {
            questionElement.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }
          setIsLoadingFromURL(false);
        }, 500);
      } else {
        setIsLoadingFromURL(false);
      }
    } else if (apiQuestions.length > 0 && isInitialLoad) {
      const firstQuestion = apiQuestions[0];
      setSelectedQuestion(firstQuestion.id.toString());
      setSelectedDifficulty(
        firstQuestion.level as "Beginner" | "Intermediate" | "Expert"
      );
      setIsInitialLoad(false);
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
        const question = apiQuestions.find(
          (q) => q.slug === targetQuestionSlug
        );
        if (question) {
          setSelectedQuestion(question.id.toString());
        }
      } else {
        if (apiQuestions.length > 0) {
          setSelectedQuestion(apiQuestions[0].id.toString());
        }
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [apiQuestions, topicSlug]);

  // Update meta tags for SEO
  useEffect(() => {
    if (selectedQuestion && apiQuestions.length > 0) {
      const question = apiQuestions.find(
        (q) => q.id.toString() === selectedQuestion
      );
      if (question) {
        document.title = `${question.metaTitle || question.title} | ${
          topic?.title || topicSlug
        } Interview Questions`;

        const metaDescription = document.querySelector(
          'meta[name="description"]'
        );
        if (metaDescription) {
          metaDescription.setAttribute(
            "content",
            question.metaDescription || question.answer.substring(0, 160)
          );
        }
      }
    }
  }, [selectedQuestion, apiQuestions, topic, topicSlug]);

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

  // Auto-select first question when questions load
  useEffect(() => {
    if (apiQuestions.length > 0) {
      if (!selectedQuestion && !questionSlug && !questionFromQuery) {
        setSelectedQuestion(apiQuestions[0].id.toString());
      }
    }
  }, [apiQuestions, selectedQuestion, questionSlug, questionFromQuery]);

  // Handle difficulty level changes
  useEffect(() => {
    if (
      apiQuestions.length > 0 &&
      !questionSlug &&
      !questionFromQuery &&
      !isInitialLoad
    ) {
      const firstQuestionOfDifficulty = apiQuestions.find(
        (q) => q.level === selectedDifficulty
      );
      if (firstQuestionOfDifficulty) {
        setSelectedQuestion(firstQuestionOfDifficulty.id.toString());
        updateQuestionURL(firstQuestionOfDifficulty.id.toString());
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

  // Scroll to question handler
  const scrollToQuestion = useCallback((questionId: string) => {
    const questionElement = document.getElementById(`question-${questionId}`);
    if (questionElement) {
      const scrollContainer = document.querySelector(".custom-scrollbar");
      if (scrollContainer) {
        setIsProgrammaticScroll(true);

        const containerRect = scrollContainer.getBoundingClientRect();
        const questionRect = questionElement.getBoundingClientRect();
        const scrollTop = scrollContainer.scrollTop;
        const targetScrollTop =
          scrollTop + questionRect.top - containerRect.top - 100;

        scrollContainer.scrollTo({
          top: targetScrollTop,
          behavior: "smooth",
        });

        setTimeout(() => {
          setIsProgrammaticScroll(false);
        }, 1200);
      }
    }
  }, []);

  // Filter questions based on search and difficulty
  const filteredQuestions = apiQuestions.filter((q) => {
    const matchesDifficulty = isInitialLoad || q.level === selectedDifficulty;
    const matchesSearch = q.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesDifficulty && matchesSearch;
  });

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

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: customScrollbarStyles }} />
      <div
        className={`${
          isFocusMode ? "h-screen" : "min-h-screen"
        } bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900`}
      >
        <AnimatePresence>
          {!isFocusMode && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ParticleBackground />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <AnimatePresence>
          {!isFocusMode && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Navigation />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main
          className={`${isFocusMode ? "pt-0" : "pt-24"} ${
            isFocusMode ? "pb-0" : "pb-16"
          }`}
        >
          <div className={`w-full ${isFocusMode ? "px-0" : "px-0"}`}>
            {/* Error Display */}
            {questionsError && (
              <ErrorMessage
                message={`Failed to load questions: ${questionsError}`}
              />
            )}

            {/* Focus Mode Exit Button */}
            <AnimatePresence>
              {isFocusMode && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="fixed top-2 right-1 z-50"
                >
                  <motion.button
                    onClick={() => setIsFocusMode(false)}
                    className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title="Exit Focus Mode"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Topic Header */}
            <AnimatePresence>
              {!isFocusMode && (
                <TopicHeader
                  topic={topic}
                  topicSlug={topicSlug}
                  isLoading={isLoadingTechnology}
                  questionsCount={apiQuestions.length}
                  totalCount={totalCount}
                  progressPercentage={getProgressPercentage(apiQuestions.length)}
                  onToggleFocusMode={() => setIsFocusMode(true)}
                />
              )}
            </AnimatePresence>

            {/* Main Content Grid */}
            <div
              className={`grid ${
                isFocusMode
                  ? "grid-cols-1 h-[calc(100vh-32px)]"
                  : "grid-cols-1 lg:grid-cols-7 gap-4"
              }`}
            >
              {/* Left Sidebar - Questions */}
              <AnimatePresence>
                {!isFocusMode && (
                  <motion.div
                    initial={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.3 }}
                    className="lg:col-span-2"
                  >
                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="bg-white/80 dark:bg-white/10 rounded-2xl p-6 backdrop-blur-sm border border-gray-200/50 dark:border-white/20 shadow-lg sticky top-24"
                    >
                      {/* Search Bar */}
                      <div className="relative mb-6">
                        <SearchBar
                          value={searchQuery}
                          onChange={setSearchQuery}
                          placeholder="Search questions..."
                        />
                      </div>

                      {/* Difficulty Tabs */}
                      <div className="mb-6">
                        <DifficultyTabs
                          selectedDifficulty={selectedDifficulty}
                          onSelectDifficulty={setSelectedDifficulty}
                        />
                      </div>

                      {/* Questions List */}
                      <QuestionListSidebar
                        questions={filteredQuestions}
                        selectedQuestionId={selectedQuestion}
                        completedQuestions={completedQuestions}
                        currentPage={currentPage}
                        onQuestionClick={(questionId) => {
                          setSelectedQuestion(questionId);
                          updateQuestionURL(questionId);
                          scrollToQuestion(questionId);
                        }}
                      />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Right Pane - Questions */}
              <div className={isFocusMode ? "col-span-1" : "lg:col-span-5"}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className={`${
                    isFocusMode
                      ? "h-full bg-white/80 dark:bg-white/10 rounded-none border-0 shadow-none"
                      : "bg-white/80 dark:bg-white/10 rounded-2xl backdrop-blur-sm border border-gray-200/50 dark:border-white/20 shadow-lg"
                  }`}
                >
                  {/* Questions Container */}
                  <div
                    className={`overflow-y-auto custom-scrollbar ${
                      isFocusMode ? "h-full p-4" : "p-8 max-h-[800px]"
                    }`}
                    onScroll={(e) => {
                      const container = e.currentTarget;
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

                        const relativeTop = rect.top - containerRect.top;
                        const containerHeight = containerRect.height;

                        if (
                          relativeTop >= containerHeight * 0.2 &&
                          relativeTop <= containerHeight * 0.8
                        ) {
                          setSelectedQuestion(questionId);
                        }
                      });
                    }}
                  >
                    {/* Loading State */}
                    {isLoadingQuestions && apiQuestions.length === 0 && (
                      <LoadingSkeleton count={3} type="question" />
                    )}

                    {/* Questions List */}
                    {filteredQuestions.map((question, index) => (
                      <QuestionCard
                        key={question.id}
                        question={question as any}
                        index={index}
                        isSelected={selectedQuestion === question.id.toString()}
                        isCompleted={completedQuestions.has(
                          question.id.toString()
                        )}
                        currentPage={currentPage}
                        onToggleComplete={toggleQuestionCompletion}
                        isFocusMode={isFocusMode}
                      />
                    ))}

                    {/* Infinite Scroll Loading */}
                    {hasMore && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-center items-center py-8"
                      >
                        <div className="flex items-center space-x-3 text-gray-500 dark:text-gray-400">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                          <span className="text-sm">
                            Loading more questions...
                          </span>
                        </div>
                      </motion.div>
                    )}

                    {/* End of Questions */}
                    {!hasMore && apiQuestions.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-center items-center py-8"
                      >
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

        {/* Footer */}
        <AnimatePresence>
          {!isFocusMode && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Footer />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Action Button */}
        <AnimatePresence>
          {!isFocusMode && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <FloatingActionButton />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default TopicPage;
