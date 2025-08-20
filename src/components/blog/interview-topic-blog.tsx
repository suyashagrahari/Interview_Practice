"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Search,
  Bell,
  Settings,
  Moon,
  User,
  BookOpen,
  Code,
  Database,
  Layers,
  Zap,
  Coffee,
  Clock,
  Star,
  Calendar,
  User as UserIcon,
  Eye,
  Share2,
  Bookmark,
  MessageCircle,
  ThumbsUp,
  ExternalLink,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import Breadcrumbs from "./breadcrumbs";
import RelatedTopics from "./related-topics";
import SocialSharing from "./social-sharing";

interface Question {
  id: number;
  title: string;
  content: string;
  difficulty: string;
  readTime: string;
  tags: string[];
  author: string;
  lastUpdated: string;
  views: number;
  likes: number;
  comments: number;
}

interface Topic {
  id: string;
  name: string;
  icon: any;
  color: string;
  description: string;
  totalQuestions: number;
  difficulty: string;
  lastUpdated: string;
  author: string;
  views: number;
}

interface InterviewTopicBlogProps {
  topic: string;
}

const InterviewTopicBlog = ({ topic }: InterviewTopicBlogProps) => {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null
  );
  const [mounted, setMounted] = useState(false);

  // Sample topics data
  const topics: Topic[] = [
    {
      id: "javascript",
      name: "JavaScript",
      icon: Code,
      color: "from-yellow-400 to-orange-500",
      description:
        "Master JavaScript fundamentals, ES6+, and modern web development concepts",
      totalQuestions: 45,
      difficulty: "Beginner to Advanced",
      lastUpdated: "2024-01-15",
      author: "Sarah Chen",
      views: 12450,
    },
    {
      id: "react",
      name: "React.js",
      icon: Zap,
      color: "from-blue-400 to-cyan-500",
      description:
        "Learn React hooks, components, state management, and best practices",
      totalQuestions: 38,
      difficulty: "Intermediate to Advanced",
      lastUpdated: "2024-01-12",
      author: "Mike Johnson",
      views: 9870,
    },
  ];

  // Sample questions data
  const questions: Question[] = [
    {
      id: 1,
      title: "What are the different data types present in JavaScript?",
      content: `To know the type of a JavaScript variable, we can use the typeof operator.

**1. Primitive types**
- **String**: Represents textual data. Example: \`var str = "Hello World";\`
- **Number**: Represents both integer and floating-point numbers. Example: \`var x = 3;\`
- **Boolean**: Represents logical entities. Example: \`var a = 2; var b = 3; var c = 2; (a == b) // returns false\`
- **Undefined**: Represents a variable that has been declared but not assigned a value.
- **Null**: Represents intentional absence of any object value.

**2. Reference types**
- **Object**: Represents a collection of key-value pairs.
- **Array**: Represents a collection of elements.
- **Function**: Represents a reusable block of code.`,
      difficulty: "beginner",
      readTime: "5 min read",
      tags: ["data-types", "fundamentals", "variables"],
      author: "Sarah Chen",
      lastUpdated: "2024-01-15",
      views: 3420,
      likes: 156,
      comments: 23,
    },
    {
      id: 2,
      title: "Explain Hoisting in JavaScript",
      content: `Hoisting is a JavaScript mechanism where variables and function declarations are moved to the top of their scope during the compilation phase.

**Variable Hoisting:**
\`\`\`javascript
console.log(x); // undefined
var x = 5;
\`\`\`

**Function Hoisting:**
\`\`\`javascript
hoistedFunction(); // "Hello World"

function hoistedFunction() {
  console.log("Hello World");
}
\`\`\`

**Key Points:**
- Only declarations are hoisted, not initializations
- \`let\` and \`const\` are hoisted but not initialized (temporal dead zone)
- Function expressions are not hoisted`,
      difficulty: "intermediate",
      readTime: "8 min read",
      tags: ["hoisting", "scope", "functions"],
      author: "Mike Johnson",
      lastUpdated: "2024-01-12",
      views: 2890,
      likes: 134,
      comments: 18,
    },
  ];

  useEffect(() => {
    setMounted(true);
    if (questions.length > 0) {
      setSelectedQuestion(questions[0]);
    }
  }, []);

  const handleQuestionSelect = (question: Question) => {
    setSelectedQuestion(question);
  };

  const currentTopic = topics.find((t) => t.id === topic) || topics[0];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return (views / 1000000).toFixed(1) + "M";
    } else if (views >= 1000) {
      return (views / 1000).toFixed(1) + "K";
    }
    return views.toString();
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-blue-900 dark:to-purple-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-gray-200/20 dark:border-white/10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="flex items-center space-x-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10">
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Back</span>
              </button>

              <div className="flex items-center space-x-3">
                <div
                  className={`w-10 h-10 bg-gradient-to-r ${currentTopic.color} rounded-xl flex items-center justify-center shadow-lg`}>
                  <currentTopic.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    {currentTopic.name}
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Interview Practice Blog
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10">
                <Moon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Topic Introduction */}
      <section className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div
            className={`w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6`}>
            <currentTopic.icon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4">
            {currentTopic.name} Interview Questions
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-6">
            {currentTopic.description}
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5" />
              <span>{currentTopic.totalQuestions} Questions</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>{currentTopic.difficulty}</span>
            </div>
            <div className="flex items-center space-x-2">
              <UserIcon className="w-5 h-5" />
              <span>{currentTopic.author}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>{formatDate(currentTopic.lastUpdated)}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: "Interview Practice", href: "/interview-practice" },
            { label: currentTopic.name },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Questions List */}
          <aside className="lg:col-span-1">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/20 dark:border-white/10 shadow-xl p-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Questions ({questions.length})
              </h2>
              <div className="space-y-3">
                {questions.map((question) => (
                  <motion.button
                    key={question.id}
                    onClick={() => handleQuestionSelect(question)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                      selectedQuestion?.id === question.id
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-500/20 shadow-lg"
                        : "border-gray-200 dark:border-white/20 hover:border-blue-300 dark:hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-white/5"
                    }`}>
                    <div className="flex items-start space-x-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0 ${
                          question.difficulty === "beginner"
                            ? "bg-green-500"
                            : question.difficulty === "intermediate"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}>
                        {question.id}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-white text-sm leading-relaxed mb-2">
                          {question.title}
                        </h3>
                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              question.difficulty === "beginner"
                                ? "bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400"
                                : question.difficulty === "intermediate"
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-400"
                                : "bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-400"
                            }`}>
                            {question.difficulty.charAt(0).toUpperCase() +
                              question.difficulty.slice(1)}
                          </span>
                          <span className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{question.readTime}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </aside>

          {/* Right Column - Question Details */}
          <article className="lg:col-span-2">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/20 dark:border-white/10 shadow-xl p-6">
              {selectedQuestion ? (
                <motion.div
                  key={selectedQuestion.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}>
                  {/* Blog Post Header */}
                  <header className="mb-8">
                    <div className="flex items-center space-x-3 mb-4">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white ${
                          selectedQuestion.difficulty === "beginner"
                            ? "bg-green-500"
                            : selectedQuestion.difficulty === "intermediate"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}>
                        {selectedQuestion.id}
                      </div>
                      <div className="flex-1">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                          {selectedQuestion.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              selectedQuestion.difficulty === "beginner"
                                ? "bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400"
                                : selectedQuestion.difficulty === "intermediate"
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-400"
                                : "bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-400"
                            }`}>
                            {selectedQuestion.difficulty
                              .charAt(0)
                              .toUpperCase() +
                              selectedQuestion.difficulty.slice(1)}{" "}
                            Level
                          </span>
                          <span className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{selectedQuestion.readTime}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <UserIcon className="w-4 h-4" />
                            <span>{selectedQuestion.author}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {formatDate(selectedQuestion.lastUpdated)}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {selectedQuestion.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-200 text-xs font-medium rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Engagement Stats */}
                    <div className="flex items-center justify-between py-4 border-t border-gray-200/20 dark:border-white/10">
                      <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
                        <span className="flex items-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>
                            {formatViews(selectedQuestion.views)} views
                          </span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <ThumbsUp className="w-4 h-4" />
                          <span>{selectedQuestion.likes} likes</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <MessageCircle className="w-4 h-4" />
                          <span>{selectedQuestion.comments} comments</span>
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10">
                          <Bookmark className="w-4 h-4" />
                        </button>
                        <SocialSharing
                          title={selectedQuestion.title}
                          url={window.location.href}
                          description={`${selectedQuestion.title} - ${currentTopic.name} Interview Practice`}
                        />
                      </div>
                    </div>
                  </header>

                  {/* Blog Post Content */}
                  <div className="prose prose-gray dark:prose-invert max-w-none mb-8">
                    <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed text-base">
                      {selectedQuestion.content}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <footer className="pt-6 border-t border-gray-200/20 dark:border-white/10">
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                      <button className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center space-x-2">
                        <BookOpen className="w-5 h-5" />
                        <span>Practice This Question</span>
                      </button>
                      <button className="flex-1 px-6 py-3 border border-gray-300 dark:border-white/20 text-gray-700 dark:text-white font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-white/10 transition-all duration-200 flex items-center space-x-2">
                        <Code className="w-5 h-5" />
                        <span>View Solution</span>
                      </button>
                    </div>
                  </footer>
                </motion.div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Select a Question
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Choose a question from the left panel to view its details
                    and start practicing.
                  </p>
                </div>
              )}
            </div>
          </article>
        </div>

        {/* Related Topics */}
        <RelatedTopics
          currentTopicId={currentTopic.id}
          topics={topics.map((t) => ({
            id: t.id,
            name: t.name,
            description: t.description,
            questionCount: t.totalQuestions,
            difficulty: t.difficulty,
            color: t.color,
          }))}
        />
      </main>
    </div>
  );
};

export default InterviewTopicBlog;
