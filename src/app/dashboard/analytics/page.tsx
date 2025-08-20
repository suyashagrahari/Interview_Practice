"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Bell,
  Settings,
  User,
  ChevronDown,
  ChevronUp,
  BarChart3,
  Target,
  MessageSquare,
  Trophy,
  Users,
  Clock,
  Award,
  Shield,
  CheckCircle,
  AlertTriangle,
  Home,
  Search,
  Filter,
  Download,
  Share2,
  Eye,
  Edit,
  Trash2,
  Plus,
  Star,
  TrendingUp,
  Users2,
  Calendar,
  Timer,
  Zap,
  CheckCircle2,
  XCircle,
  Minus,
  MoreHorizontal,
  TrendingDown,
  Activity,
  PieChart,
  LineChart,
  BarChart,
  FileText,
  BookOpen,
  Brain,
  Code,
  Database,
  Globe,
  Smartphone,
  Monitor,
  Server,
  X,
  Sun,
  Moon,
  Building,
} from "lucide-react";
import { useRouter } from "next/navigation";

const AnalyticsDashboard = () => {
  const router = useRouter();
  const [selectedLevel, setSelectedLevel] = useState("beginner");
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJobDescription, setSelectedJobDescription] = useState(1);
  const [selectedInterview, setSelectedInterview] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedAnalyticsType, setSelectedAnalyticsType] =
    useState("job-description");

  const interviewLevels = [
    { id: "beginner", label: "Beginner", count: 15 },
    { id: "intermediate", label: "Intermediate", count: 23 },
    { id: "expert", label: "Expert", count: 8 },
  ];

  const analyticsTypes = [
    { id: "resume", label: "Resume Analytics", icon: FileText },
    { id: "job-description", label: "Job Description Analytics", icon: Target },
    { id: "company", label: "Company Analytics", icon: Building },
    {
      id: "topic-interview",
      label: "Topic Interview Analytics",
      icon: BookOpen,
    },
  ];

  // 10-15 Job Description Categories
  const jobDescriptions = [
    {
      id: 1,
      name: "Job_Description_1",
      correct: 10,
      incorrect: 0,
      selected: true,
      category: "General",
    },
    {
      id: 2,
      name: "Job_Description_2",
      correct: 8,
      incorrect: 2,
      selected: false,
      category: "General",
    },
    {
      id: 3,
      name: "Job_Description_3",
      correct: 9,
      incorrect: 1,
      selected: false,
      category: "General",
    },
    {
      id: 4,
      name: "Job_Description_4",
      correct: 10,
      incorrect: 0,
      selected: false,
      category: "General",
    },
    {
      id: 5,
      name: "Job_Description_5",
      correct: 7,
      incorrect: 3,
      selected: false,
      category: "General",
    },
    {
      id: 6,
      name: "Job_Description_6",
      correct: 9,
      incorrect: 1,
      selected: false,
      category: "General",
    },
    {
      id: 7,
      name: "Job_Description_7",
      correct: 8,
      incorrect: 2,
      selected: false,
      category: "General",
    },
    {
      id: 8,
      name: "Job_Description_8",
      correct: 10,
      incorrect: 0,
      selected: false,
      category: "General",
    },
    {
      id: 9,
      name: "Job_Description_9",
      correct: 6,
      incorrect: 4,
      selected: false,
      category: "General",
    },
    {
      id: 10,
      name: "Job_Description_10",
      correct: 9,
      incorrect: 1,
      selected: false,
      category: "General",
    },
    {
      id: 11,
      name: "Job_Description_11",
      correct: 8,
      incorrect: 2,
      selected: false,
      category: "General",
    },
    {
      id: 12,
      name: "Job_Description_12",
      correct: 7,
      incorrect: 3,
      selected: false,
      category: "General",
    },
    {
      id: 13,
      name: "Job_Description_13",
      correct: 10,
      incorrect: 0,
      selected: false,
      category: "General",
    },
    {
      id: 14,
      name: "Job_Description_14",
      correct: 9,
      incorrect: 1,
      selected: false,
      category: "General",
    },
    {
      id: 15,
      name: "Job_Description_15",
      correct: 8,
      incorrect: 2,
      selected: false,
      category: "General",
    },
  ];

  // Topic Analytics Data
  const topicAnalytics = [
    {
      id: 1,
      name: "JavaScript Fundamentals",
      correct: 15,
      incorrect: 2,
      selected: true,
      category: "Programming",
    },
    {
      id: 2,
      name: "React.js Core Concepts",
      correct: 12,
      incorrect: 3,
      selected: false,
      category: "Frontend",
    },
    {
      id: 3,
      name: "Node.js Backend",
      correct: 18,
      incorrect: 1,
      selected: false,
      category: "Backend",
    },
    {
      id: 4,
      name: "Database Design",
      correct: 14,
      incorrect: 4,
      selected: false,
      category: "Database",
    },
    {
      id: 5,
      name: "System Architecture",
      correct: 16,
      incorrect: 2,
      selected: false,
      category: "Architecture",
    },
    {
      id: 6,
      name: "API Development",
      correct: 13,
      incorrect: 3,
      selected: false,
      category: "Backend",
    },
    {
      id: 7,
      name: "UI/UX Design",
      correct: 11,
      incorrect: 5,
      selected: false,
      category: "Design",
    },
    {
      id: 8,
      name: "DevOps Practices",
      correct: 17,
      incorrect: 1,
      selected: false,
      category: "DevOps",
    },
    {
      id: 9,
      name: "Security Best Practices",
      correct: 19,
      incorrect: 0,
      selected: false,
      category: "Security",
    },
    {
      id: 10,
      name: "Testing Strategies",
      correct: 15,
      incorrect: 3,
      selected: false,
      category: "Testing",
    },
    {
      id: 11,
      name: "Performance Optimization",
      correct: 14,
      incorrect: 2,
      selected: false,
      category: "Performance",
    },
    {
      id: 12,
      name: "Mobile Development",
      correct: 12,
      incorrect: 4,
      selected: false,
      category: "Mobile",
    },
    {
      id: 13,
      name: "Cloud Computing",
      correct: 16,
      incorrect: 2,
      selected: false,
      category: "Cloud",
    },
    {
      id: 14,
      name: "Machine Learning Basics",
      correct: 13,
      incorrect: 5,
      selected: false,
      category: "AI/ML",
    },
    {
      id: 15,
      name: "Data Structures",
      correct: 18,
      incorrect: 1,
      selected: false,
      category: "Programming",
    },
  ];

  // Resume Analytics Data
  const resumeAnalytics = [
    {
      id: 1,
      name: "Resume_Review_1",
      correct: 8,
      incorrect: 2,
      selected: true,
      category: "Format",
    },
    {
      id: 2,
      name: "Resume_Review_2",
      correct: 9,
      incorrect: 1,
      selected: false,
      category: "Content",
    },
    {
      id: 3,
      name: "Resume_Review_3",
      correct: 7,
      incorrect: 3,
      selected: false,
      category: "Skills",
    },
    {
      id: 4,
      name: "Resume_Review_4",
      correct: 10,
      incorrect: 0,
      selected: false,
      category: "Experience",
    },
    {
      id: 5,
      name: "Resume_Review_5",
      correct: 6,
      incorrect: 4,
      selected: false,
      category: "Education",
    },
    {
      id: 6,
      name: "Resume_Review_6",
      correct: 9,
      incorrect: 1,
      selected: false,
      category: "Projects",
    },
    {
      id: 7,
      name: "Resume_Review_7",
      correct: 8,
      incorrect: 2,
      selected: false,
      category: "Achievements",
    },
    {
      id: 8,
      name: "Resume_Review_8",
      correct: 11,
      incorrect: 0,
      selected: false,
      category: "Certifications",
    },
    {
      id: 9,
      name: "Resume_Review_9",
      correct: 7,
      incorrect: 3,
      selected: false,
      category: "Languages",
    },
    {
      id: 10,
      name: "Resume_Review_10",
      correct: 9,
      incorrect: 1,
      selected: false,
      category: "References",
    },
  ];

  // Company Analytics Data
  const companyAnalytics = [
    {
      id: 1,
      name: "Company_Culture_1",
      correct: 12,
      incorrect: 1,
      selected: true,
      category: "Culture",
    },
    {
      id: 2,
      name: "Company_Values_2",
      correct: 10,
      incorrect: 3,
      selected: false,
      category: "Values",
    },
    {
      id: 3,
      name: "Company_Process_3",
      correct: 11,
      incorrect: 2,
      selected: false,
      category: "Process",
    },
    {
      id: 4,
      name: "Company_Team_4",
      correct: 13,
      incorrect: 0,
      selected: false,
      category: "Team",
    },
    {
      id: 5,
      name: "Company_Technology_5",
      correct: 9,
      incorrect: 4,
      selected: false,
      category: "Technology",
    },
    {
      id: 6,
      name: "Company_Leadership_6",
      correct: 14,
      incorrect: 1,
      selected: false,
      category: "Leadership",
    },
    {
      id: 7,
      name: "Company_Innovation_7",
      correct: 8,
      incorrect: 5,
      selected: false,
      category: "Innovation",
    },
    {
      id: 8,
      name: "Company_Growth_8",
      correct: 15,
      incorrect: 0,
      selected: false,
      category: "Growth",
    },
    {
      id: 9,
      name: "Company_Strategy_9",
      correct: 12,
      incorrect: 2,
      selected: false,
      category: "Strategy",
    },
    {
      id: 10,
      name: "Company_Impact_10",
      correct: 11,
      incorrect: 3,
      selected: false,
      category: "Impact",
    },
  ];

  // 10-15 Interviews per level
  const getInterviewsByLevel = (level: string) => {
    const baseInterviews = [
      {
        id: 1,
        name: "Interview Name or Id",
        timeTaken: "15m",
        points: 85,
        cheating: "None",
        status: "success",
      },
      {
        id: 2,
        name: "Interview Name or Id",
        timeTaken: "20m",
        points: 92,
        cheating: "None",
        status: "success",
      },
      {
        id: 3,
        name: "Interview Name or Id",
        timeTaken: "12m",
        points: 65,
        cheating: "Detected",
        status: "warning",
      },
      {
        id: 4,
        name: "Interview Name or Id",
        timeTaken: "18m",
        points: 88,
        cheating: "None",
        status: "success",
      },
      {
        id: 5,
        name: "Interview Name or Id",
        timeTaken: "25m",
        points: 95,
        cheating: "None",
        status: "success",
      },
      {
        id: 6,
        name: "Interview Name or Id",
        timeTaken: "14m",
        points: 78,
        cheating: "None",
        status: "success",
      },
      {
        id: 7,
        name: "Interview Name or Id",
        timeTaken: "22m",
        points: 90,
        cheating: "None",
        status: "success",
      },
      {
        id: 8,
        name: "Interview Name or Id",
        timeTaken: "16m",
        points: 82,
        cheating: "None",
        status: "success",
      },
      {
        id: 9,
        name: "Interview Name or Id",
        timeTaken: "19m",
        points: 87,
        cheating: "None",
        status: "success",
      },
      {
        id: 10,
        name: "Interview Name or Id",
        timeTaken: "21m",
        points: 93,
        cheating: "None",
        status: "success",
      },
      {
        id: 11,
        name: "Interview Name or Id",
        timeTaken: "17m",
        points: 84,
        cheating: "None",
        status: "success",
      },
      {
        id: 12,
        name: "Interview Name or Id",
        timeTaken: "23m",
        points: 89,
        cheating: "None",
        status: "success",
      },
      {
        id: 13,
        name: "Interview Name or Id",
        timeTaken: "13m",
        points: 76,
        cheating: "None",
        status: "success",
      },
      {
        id: 14,
        name: "Interview Name or Id",
        timeTaken: "26m",
        points: 96,
        cheating: "None",
        status: "success",
      },
      {
        id: 15,
        name: "Interview Name or Id",
        timeTaken: "20m",
        points: 91,
        cheating: "None",
        status: "success",
      },
    ];

    // Add level-specific variations
    return baseInterviews.map((interview, index) => ({
      ...interview,
      id: interview.id + index * 100, // Unique IDs per level
      points:
        level === "beginner"
          ? Math.max(60, interview.points - 15)
          : level === "expert"
          ? Math.min(100, interview.points + 5)
          : interview.points,
    }));
  };

  // 20 Questions for better scrolling
  const questions = [
    {
      id: 1,
      title: "What is Proust? Explain in-depth Details?",
      difficulty: "Intermediate",
      category: "General Knowledge",
      timeSpent: "3m 45s",
      points: 8,
      status: "completed",
    },
    {
      id: 2,
      title: "Explain the concept of React Hooks with examples",
      difficulty: "Expert",
      category: "Frontend Development",
      timeSpent: "5m 12s",
      points: 9,
      status: "completed",
    },
    {
      id: 3,
      title: "What are the differences between SQL and NoSQL?",
      difficulty: "Intermediate",
      category: "Database",
      timeSpent: "4m 30s",
      points: 7,
      status: "completed",
    },
    {
      id: 4,
      title: "Describe the MVC architecture pattern",
      difficulty: "Beginner",
      category: "Software Architecture",
      timeSpent: "2m 15s",
      points: 6,
      status: "completed",
    },
    {
      id: 5,
      title: "How does authentication work in web applications?",
      difficulty: "Intermediate",
      category: "Security",
      timeSpent: "6m 20s",
      points: 8,
      status: "completed",
    },
    {
      id: 6,
      title: "Explain the concept of microservices architecture",
      difficulty: "Expert",
      category: "System Design",
      timeSpent: "7m 45s",
      points: 9,
      status: "completed",
    },
    {
      id: 7,
      title: "What is the difference between HTTP and HTTPS?",
      difficulty: "Beginner",
      category: "Networking",
      timeSpent: "1m 50s",
      points: 5,
      status: "completed",
    },
    {
      id: 8,
      title: "How do you handle state management in large applications?",
      difficulty: "Expert",
      category: "Frontend Development",
      timeSpent: "8m 10s",
      points: 10,
      status: "completed",
    },
    {
      id: 9,
      title: "Explain the concept of Docker containers",
      difficulty: "Intermediate",
      category: "DevOps",
      timeSpent: "4m 55s",
      points: 7,
      status: "completed",
    },
    {
      id: 10,
      title: "What is the difference between REST and GraphQL?",
      difficulty: "Intermediate",
      category: "API Design",
      timeSpent: "5m 30s",
      points: 8,
      status: "completed",
    },
    {
      id: 11,
      title: "How does garbage collection work in Java?",
      difficulty: "Expert",
      category: "Programming Languages",
      timeSpent: "6m 15s",
      points: 9,
      status: "completed",
    },
    {
      id: 12,
      title: "Explain the concept of load balancing",
      difficulty: "Intermediate",
      category: "System Design",
      timeSpent: "4m 20s",
      points: 7,
      status: "completed",
    },
    {
      id: 13,
      title: "What is the difference between TCP and UDP?",
      difficulty: "Beginner",
      category: "Networking",
      timeSpent: "2m 45s",
      points: 6,
      status: "completed",
    },
    {
      id: 14,
      title: "How do you implement caching strategies?",
      difficulty: "Expert",
      category: "Performance",
      timeSpent: "7m 30s",
      points: 9,
      status: "completed",
    },
    {
      id: 15,
      title: "Explain the concept of CI/CD pipelines",
      difficulty: "Intermediate",
      category: "DevOps",
      timeSpent: "5m 45s",
      points: 8,
      status: "completed",
    },
    {
      id: 16,
      title:
        "What is the difference between synchronous and asynchronous programming?",
      difficulty: "Beginner",
      category: "Programming Concepts",
      timeSpent: "3m 20s",
      points: 6,
      status: "completed",
    },
    {
      id: 17,
      title: "How do you handle database transactions?",
      difficulty: "Intermediate",
      category: "Database",
      timeSpent: "4m 10s",
      points: 7,
      status: "completed",
    },
    {
      id: 18,
      title: "Explain the concept of design patterns",
      difficulty: "Expert",
      category: "Software Design",
      timeSpent: "8m 25s",
      points: 10,
      status: "completed",
    },
    {
      id: 19,
      title: "What is the difference between monolithic and microservices?",
      difficulty: "Intermediate",
      category: "Architecture",
      timeSpent: "6m 40s",
      points: 8,
      status: "completed",
    },
    {
      id: 20,
      title: "How do you implement security best practices?",
      difficulty: "Expert",
      category: "Security",
      timeSpent: "9m 15s",
      points: 10,
      status: "completed",
    },
  ];

  const questionAnalysis = {
    1: {
      question: "What is Proust? Explain in-depth Details?",
      userAnswer:
        "Proust refers to Marcel Proust, a French novelist, critic, and essayist who wrote the monumental novel 'In Search of Lost Time' (À la recherche du temps perdu). He is best known for his innovative narrative techniques and exploration of memory, time, and consciousness. His work is considered one of the most important contributions to modern literature, influencing countless writers and artists. Proust's unique style involves long, complex sentences that capture the flow of consciousness and the intricate nature of human memory. His exploration of involuntary memory, particularly through the famous 'madeleine' episode, has become a cornerstone of literary analysis and psychological understanding.",
      aiFeedback:
        "Excellent answer! You provided a comprehensive overview of Marcel Proust and his literary significance. The mention of 'In Search of Lost Time' and his narrative techniques shows good understanding. Your explanation of involuntary memory and the madeleine episode demonstrates deep knowledge of his work.",
      score: 8,
      maxScore: 10,
      timeSpent: "3m 45s",
      category: "General Knowledge",
      difficulty: "Intermediate",
      strengths: [
        "Historical accuracy",
        "Literary knowledge",
        "Clear explanation",
        "Specific examples",
        "Understanding of themes",
      ],
      improvements: [
        "Could mention his influence on modern literature",
        "More examples of his writing style",
        "Discussion of his philosophical ideas",
      ],
      relatedTopics: [
        "French Literature",
        "Modernism",
        "Memory in Literature",
        "Stream of Consciousness",
        "20th Century Literature",
      ],
    },
    2: {
      question: "Explain the concept of React Hooks with examples",
      userAnswer:
        "React Hooks are functions that allow you to use state and other React features in functional components. Examples include useState for state management, useEffect for side effects, and useContext for consuming context. Hooks provide a way to use state and other React features without writing a class. They allow you to reuse stateful logic between components without changing their hierarchy. The Rules of Hooks state that hooks must be called at the top level of your component and cannot be called inside loops, conditions, or nested functions.",
      aiFeedback:
        "Good basic understanding of React Hooks. You correctly identified the main purpose and mentioned key hooks. However, the explanation could be more detailed with practical examples and code snippets.",
      score: 9,
      maxScore: 10,
      timeSpent: "5m 12s",
      category: "Frontend Development",
      difficulty: "Expert",
      strengths: [
        "Correct concept understanding",
        "Good hook identification",
        "Clear structure",
        "Rules of Hooks",
        "Purpose explanation",
      ],
      improvements: [
        "Provide code examples",
        "Explain custom hooks",
        "Discuss hook dependencies",
        "Show practical use cases",
      ],
      relatedTopics: [
        "React Components",
        "State Management",
        "Functional Programming",
        "JavaScript",
        "Frontend Architecture",
      ],
    },
  };

  // Set default selections on component mount
  useEffect(() => {
    setSelectedLevel("beginner");
    setSelectedQuestion(1);
    setSelectedJobDescription(1);
    setSelectedInterview(1);
  }, []);

  const handleJobDescriptionClick = (jobId: number) => {
    setSelectedJobDescription(jobId);
    setSelectedInterview(1); // Reset to first interview when job description changes
  };

  const handleInterviewClick = (interviewId: number) => {
    setSelectedInterview(interviewId);
  };

  const handleQuestionClick = (questionId: number) => {
    setSelectedQuestion(questionId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // Toggle body class for global theme
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  };

  // Reset selections when analytics type changes
  const handleAnalyticsTypeChange = (newType: string) => {
    setSelectedAnalyticsType(newType);
    setSelectedJobDescription(1);
    setSelectedInterview(1);
    setSelectedQuestion(1);
    setSearchQuery("");
  };

  const currentInterviews = getInterviewsByLevel(selectedLevel);

  // Get current analytics data based on selection
  const getCurrentAnalyticsData = () => {
    switch (selectedAnalyticsType) {
      case "resume":
        return resumeAnalytics;
      case "company":
        return companyAnalytics;
      case "topic-interview":
        return topicAnalytics;
      default:
        return jobDescriptions;
    }
  };

  const currentAnalyticsData = getCurrentAnalyticsData();

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-blue-900 dark:to-purple-900 overflow-hidden">
      {/* Top Header Bar */}
      <div className="h-16 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border-b border-gray-200/20 dark:border-white/10 shadow-sm flex items-center justify-between px-6">
        <div className="flex items-center space-x-6">
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>
          <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
          {/* <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {selectedAnalyticsType === "resume" && "Resume Analytics"}
            {selectedAnalyticsType === "job-description" &&
              "Job Description Analytics"}
            {selectedAnalyticsType === "company" && "Company Analytics"}
            {selectedAnalyticsType === "topic-interview" &&
              "Topic Interview Analytics"}
          </h1> */}
          {/* Analytics Type Selector */}
          <div className="p-6 border-b border-gray-200/20 dark:border-white/10">
            {/* <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Analytics Type
            </h2> */}
            <div className="relative ">
              <select
                value={selectedAnalyticsType}
                onChange={(e) => handleAnalyticsTypeChange(e.target.value)}
                className="w-full pr-10 pl-5 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer">
                {analyticsTypes.map((type) => {
                  const IconComponent = type.icon;
                  return (
                    <option key={type.id} value={type.id} className="py-2">
                      {type.label}
                    </option>
                  );
                })}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button className="w-10 h-10 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 rounded-xl flex items-center justify-center transition-all duration-200">
            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <button className="w-10 h-10 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 rounded-xl flex items-center justify-center transition-all duration-200">
            <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <button
            onClick={toggleTheme}
            className="w-10 h-10 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 rounded-xl flex items-center justify-center transition-all duration-200">
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            )}
          </button>
          <button className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center transition-all duration-200">
            <User className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Left Sidebar - Job Description Interview */}
        <div className="w-96 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border-r border-gray-200/20 dark:border-white/10 shadow-xl flex flex-col">
          {/* Job Description Interview Section */}
          <div className="p-6 border-b border-gray-200/20 dark:border-white/10">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {selectedAnalyticsType === "resume" && "Resume Interview"}
              {selectedAnalyticsType === "job-description" &&
                "Job Description Interview"}
              {selectedAnalyticsType === "company" && "Company Interview"}
              {selectedAnalyticsType === "topic-interview" && "Topic Interview"}
            </h2>

            {/* Search Bar - Fixed positioning to prevent overlap */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={
                  selectedAnalyticsType === "resume"
                    ? "Search Resume Topics"
                    : selectedAnalyticsType === "job-description"
                    ? "Search Job Topics"
                    : selectedAnalyticsType === "company"
                    ? "Search Company Topics"
                    : "Search Topic Areas"
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Analytics Data List - Scrollable with fixed height */}
            <div className="h-48 overflow-y-auto custom-scrollbar">
              <div className="space-y-3 pl-1 pr-2 py-1">
                {currentAnalyticsData.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleJobDescriptionClick(item.id)}
                    className={`p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                      selectedJobDescription === item.id
                        ? "bg-gradient-to-br from-blue-50/80 to-purple-50/80 dark:from-blue-900/30 dark:to-purple-900/30 shadow-lg ring-1 ring-purple-200 dark:ring-purple-500/50"
                        : "bg-white dark:bg-white/5 border-gray-200 dark:border-white/20 hover:bg-gray-50 dark:hover:bg-white/10"
                    }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <span className="font-medium text-gray-900 dark:text-white text-sm block">
                          {item.name}
                        </span>
                        {item.category && (
                          <span className="text-xs text-gray-500 dark:text-gray-400 block mt-1">
                            {item.category}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold text-green-600 dark:text-green-400">
                          {item.correct}
                        </span>
                        <span className="text-sm font-bold text-red-600 dark:text-red-400">
                          {item.incorrect}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Interview Levels Section - Fixed positioning */}
          <div className="p-6 border-b border-gray-200/20 dark:border-white/10">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Interview Levels
            </h3>
            <div className="flex flex-wrap gap-2">
              {interviewLevels.map((level) => (
                <button
                  key={level.id}
                  onClick={() => setSelectedLevel(level.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    selectedLevel === level.id
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white ring-1 ring-purple-200 dark:ring-purple-500/50"
                      : "bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20"
                  }`}>
                  {level.label}
                </button>
              ))}
            </div>
          </div>

          {/* Interview Cards Section - Scrollable with fixed height */}
          <div className="flex-1 p-6 overflow-hidden">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Interview Details
            </h3>
            <div className="h-full overflow-y-auto custom-scrollbar pt-2 pb-10">
              <div className="space-y-3 pr-2">
                {currentInterviews.map((card) => (
                  <div
                    key={card.id}
                    onClick={() => handleInterviewClick(card.id)}
                    className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                      selectedInterview === card.id
                        ? "ring-1 ring-purple-200 dark:ring-purple-500/50 bg-gradient-to-br from-blue-50/80 to-purple-50/80 dark:from-blue-900/30 dark:to-purple-900/30 shadow-lg"
                        : ""
                    } ${
                      card.status === "warning"
                        ? "bg-red-50 dark:bg-red-500/20 border-red-200 dark:border-red-500/30"
                        : "bg-white dark:bg-white/5 border-gray-200 dark:border-white/20"
                    }`}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-bold text-gray-900 dark:text-white text-sm">
                        {card.id}. {card.name}
                      </span>
                      {card.status === "warning" && (
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                    <div className=" flex flex-row gap-2 items-center  text-[10px]">
                      <div className="flex flex-row items-center gap-2 ">
                        <span className="text-gray-600 dark:text-gray-400">
                          Time Taken:
                        </span>
                        <span className="font-bold text-gray-900 dark:text-white">
                          {card.timeTaken}
                        </span>
                      </div>
                      <div className="flex flex-row items-center gap-2 ">
                        <span className="text-gray-600 dark:text-gray-400">
                          Points:
                        </span>
                        <span className="font-bold text-green-600 dark:text-green-400">
                          {card.points}
                        </span>
                      </div>
                      <div className="flex flex-row items-center gap-2 ">
                        <span className="text-gray-600 dark:text-gray-400">
                          Cheating:
                        </span>
                        <span
                          className={`font-bold ${
                            card.status === "warning"
                              ? "text-red-600 dark:text-red-400"
                              : "text-gray-900 dark:text-white"
                          }`}>
                          {card.cheating}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Center Content - Fixed Graphs + Scrollable Questions */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Fixed Graphs Section */}
          <div className="h-80 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border-b border-gray-200/20 dark:border-white/10 p-6">
            <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Average Points Chart */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-blue-200/20 dark:border-blue-500/20">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Average Points by Topic and Level
                </h3>
                <div className="h-full bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <BarChart3 className="w-10 h-10 text-white" />
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 font-medium">
                      Chart visualization
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                      Y-axis: 103.00 - 232.00
                    </p>
                  </div>
                </div>
              </div>

              {/* Total Interviews Chart */}
              <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-2xl p-6 border border-green-200/20 dark:border-green-500/20">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Total Interviews Count by Topic
                </h3>
                <div className="h-full bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <BarChart3 className="w-10 h-10 text-white" />
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 font-medium">
                      Chart visualization
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                      Mock 0, Mock 0, Mock 0...
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scrollable Questions Section */}
          <div className="flex-1 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md p-6 overflow-hidden">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              {selectedAnalyticsType === "resume" &&
                "Resume Questions & Analysis"}
              {selectedAnalyticsType === "job-description" &&
                "Interview Questions & Analysis"}
              {selectedAnalyticsType === "company" &&
                "Company Questions & Analysis"}
              {selectedAnalyticsType === "topic-interview" &&
                "Topic Questions & Analysis"}
            </h3>
            <div className="h-full overflow-y-auto custom-scrollbar ">
              <div className="space-y-4 px-2 pt-2 pb-10">
                {questions.map((question) => (
                  <div
                    key={question.id}
                    onClick={() => handleQuestionClick(question.id)}
                    className={`border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer ${
                      selectedQuestion === question.id
                        ? "ring-1 ring-purple-200 dark:ring-purple-500/50 bg-gradient-to-br from-blue-50/80 to-purple-50/80 dark:from-blue-900/30 dark:to-purple-900/30 shadow-lg"
                        : ""
                    }`}>
                    <div className="p-5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                            {question.id}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                              {question.title}
                            </h4>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                              <span className="flex items-center space-x-1">
                                <Target className="w-4 h-4" />
                                <span>{question.difficulty}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <BookOpen className="w-4 h-4" />
                                <span>{question.category}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <Clock className="w-4 h-4" />
                                <span>{question.timeSpent}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <Award className="w-4 h-4" />
                                <span>{question.points}/10</span>
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Question Analysis Right Sidebar */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-sm z-[9999]"
            onClick={closeModal}>
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-96 bg-white dark:bg-slate-800 shadow-2xl border-l border-gray-200 dark:border-white/20 overflow-hidden z-[10000]"
              onClick={(e) => e.stopPropagation()}>
              {/* Sidebar Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-white/20 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Question Analysis
                </h2>
                <button
                  onClick={closeModal}
                  className="w-8 h-8 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 rounded-lg flex items-center justify-center transition-all duration-200">
                  <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              {/* Sidebar Content */}
              <div className="h-[calc(100vh-6rem)] overflow-y-auto custom-scrollbar pb-6">
                {selectedQuestion && (
                  <div className="p-4 space-y-4">
                    {/* Question Details */}
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">
                        {
                          questionAnalysis[
                            selectedQuestion as keyof typeof questionAnalysis
                          ]?.question
                        }
                      </h4>
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-gray-400">
                            Difficulty:
                          </span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {
                              questionAnalysis[
                                selectedQuestion as keyof typeof questionAnalysis
                              ]?.difficulty
                            }
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-gray-400">
                            Category:
                          </span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {
                              questionAnalysis[
                                selectedQuestion as keyof typeof questionAnalysis
                              ]?.category
                            }
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-gray-400">
                            Time Spent:
                          </span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {
                              questionAnalysis[
                                selectedQuestion as keyof typeof questionAnalysis
                              ]?.timeSpent
                            }
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-gray-400">
                            Score:
                          </span>
                          <span className="font-bold text-green-600 dark:text-green-400">
                            {
                              questionAnalysis[
                                selectedQuestion as keyof typeof questionAnalysis
                              ]?.score
                            }
                            /
                            {
                              questionAnalysis[
                                selectedQuestion as keyof typeof questionAnalysis
                              ]?.maxScore
                            }
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* User Answer */}
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">
                        Your Answer
                      </h4>
                      <div className="bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-200 dark:border-gray-600">
                        <p className="text-gray-700 dark:text-gray-300 text-xs leading-relaxed">
                          {
                            questionAnalysis[
                              selectedQuestion as keyof typeof questionAnalysis
                            ]?.userAnswer
                          }
                        </p>
                      </div>
                    </div>

                    {/* AI Feedback */}
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">
                        AI Feedback
                      </h4>
                      <div className="bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-200 dark:border-gray-600">
                        <p className="text-gray-700 dark:text-gray-300 text-xs leading-relaxed mb-3">
                          {
                            questionAnalysis[
                              selectedQuestion as keyof typeof questionAnalysis
                            ]?.aiFeedback
                          }
                        </p>

                        {/* Strengths */}
                        <div className="mb-3">
                          <h5 className="font-medium text-green-700 dark:text-green-400 mb-1 flex items-center text-xs">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Strengths
                          </h5>
                          <ul className="space-y-1">
                            {questionAnalysis[
                              selectedQuestion as keyof typeof questionAnalysis
                            ]?.strengths.map((strength, index) => (
                              <li
                                key={index}
                                className="text-xs text-gray-600 dark:text-gray-400 flex items-center">
                                <CheckCircle className="w-2 h-2 text-green-500 mr-1" />
                                {strength}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Areas for Improvement */}
                        <div className="mb-3">
                          <h5 className="font-medium text-yellow-700 dark:text-yellow-400 mb-1 flex items-center">
                            <Minus className="w-3 h-3 mr-1" />
                            Areas for Improvement
                          </h5>
                          <ul className="space-y-1">
                            {questionAnalysis[
                              selectedQuestion as keyof typeof questionAnalysis
                            ]?.improvements.map((improvement, index) => (
                              <li
                                key={index}
                                className="text-xs text-gray-600 dark:text-gray-400 flex items-center">
                                <Minus className="w-2 h-2 text-yellow-500 mr-1" />
                                {improvement}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Related Topics */}
                        <div>
                          <h5 className="font-medium text-blue-700 dark:text-blue-400 mb-1 flex items-center text-xs">
                            <BookOpen className="w-3 h-3 mr-1" />
                            Related Topics
                          </h5>
                          <div className="flex flex-wrap gap-1">
                            {questionAnalysis[
                              selectedQuestion as keyof typeof questionAnalysis
                            ]?.relatedTopics.map((topic, index) => (
                              <span
                                key={index}
                                className="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                                {topic}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AnalyticsDashboard;
