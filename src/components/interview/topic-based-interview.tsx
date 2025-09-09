"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  User,
  Star,
  Play,
  Square,
  ArrowLeft,
  Users,
  Lightbulb,
} from "lucide-react";

interface TopicBasedInterviewProps {
  onBack?: () => void;
}

const TopicBasedInterview = ({ onBack }: TopicBasedInterviewProps) => {
  const [isConfiguring, setIsConfiguring] = useState(true);
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isClient, setIsClient] = useState(false);

  const [formData, setFormData] = useState({
    topic: "",
    subtopic: "",
    difficultyLevel: "intermediate",
    interviewType: "technical",
    duration: "30",
    scheduled: false,
    scheduledDate: "",
    scheduledTime: "",
    interviewerId: "",
  });

  const topics = [
    "JavaScript",
    "React",
    "Node.js",
    "Python",
    "Data Structures",
    "Algorithms",
    "System Design",
    "Database Design",
    "Machine Learning",
    "DevOps",
    "Cloud Computing",
    "Cybersecurity",
  ];

  const subtopics = {
    JavaScript: [
      "ES6+ Features",
      "Async/Await",
      "Closures",
      "Prototypes",
      "Event Loop",
      "Promises",
    ],
    React: [
      "Hooks",
      "State Management",
      "Component Lifecycle",
      "Virtual DOM",
      "Performance Optimization",
      "Testing",
    ],
    "Node.js": [
      "Event Loop",
      "Streams",
      "Middleware",
      "Error Handling",
      "Security",
      "Performance",
    ],
    Python: [
      "Data Types",
      "OOP Concepts",
      "Decorators",
      "Generators",
      "Async Programming",
      "Testing",
    ],
    "Data Structures": [
      "Arrays",
      "Linked Lists",
      "Trees",
      "Graphs",
      "Hash Tables",
      "Stacks & Queues",
    ],
    Algorithms: [
      "Sorting",
      "Searching",
      "Dynamic Programming",
      "Greedy Algorithms",
      "Graph Algorithms",
      "Time Complexity",
    ],
    "System Design": [
      "Scalability",
      "Load Balancing",
      "Caching",
      "Database Design",
      "Microservices",
      "API Design",
    ],
    "Database Design": [
      "Normalization",
      "Indexing",
      "Query Optimization",
      "ACID Properties",
      "NoSQL vs SQL",
      "Transactions",
    ],
    "Machine Learning": [
      "Supervised Learning",
      "Unsupervised Learning",
      "Neural Networks",
      "Feature Engineering",
      "Model Evaluation",
      "Deep Learning",
    ],
    DevOps: [
      "CI/CD",
      "Containerization",
      "Orchestration",
      "Infrastructure as Code",
      "Monitoring",
      "Security",
    ],
    "Cloud Computing": [
      "AWS Services",
      "Azure Services",
      "GCP Services",
      "Serverless",
      "Auto Scaling",
      "Cost Optimization",
    ],
    Cybersecurity: [
      "Network Security",
      "Application Security",
      "Cryptography",
      "Vulnerability Assessment",
      "Incident Response",
      "Compliance",
    ],
  };

  const interviewers = [
    {
      id: "1",
      name: "Alex Chen",
      role: "Senior Developer",
      experience: "8+ years",
      rating: "4.9",
      avatar: "AC",
      specialties: ["JavaScript", "React", "Node.js"],
    },
    {
      id: "2",
      name: "Maria Rodriguez",
      role: "Tech Lead",
      experience: "10+ years",
      rating: "4.8",
      avatar: "MR",
      specialties: ["Python", "Machine Learning", "Data Science"],
    },
    {
      id: "3",
      name: "James Wilson",
      role: "Principal Engineer",
      experience: "12+ years",
      rating: "4.9",
      avatar: "JW",
      specialties: ["System Design", "Architecture", "Scalability"],
    },
    {
      id: "4",
      name: "Sarah Kim",
      role: "Senior Developer",
      experience: "7+ years",
      rating: "4.7",
      avatar: "SK",
      specialties: ["Algorithms", "Data Structures", "Competitive Programming"],
    },
    {
      id: "5",
      name: "David Park",
      role: "DevOps Engineer",
      experience: "6+ years",
      rating: "4.6",
      avatar: "DP",
      specialties: ["DevOps", "Cloud", "Infrastructure"],
    },
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleStartInterview = () => {
    // Redirect to full-screen interview page
    window.location.href = `/interview?type=topic`;
  };

  const handleBackToConfig = () => {
    setIsInterviewStarted(false);
    setIsConfiguring(true);
  };

  const handleToggleRecording = () => {
    setIsRecording(!isRecording);
  };

  const handleToggleVideo = () => {
    setIsVideoOn(!isVideoOn);
  };

  const handleToggleMic = () => {
    setIsMicOn(!isMicOn);
  };

  // Set client state to prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-blue-900 dark:to-purple-900">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Loading Interview
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Please wait while we prepare your interview...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-blue-900 dark:to-purple-900">
      {/* Sticky Header */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-40 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-white/20 shadow-sm  py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Left Section */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                  Topic Based Interview
                </h1>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  Mock Interview Session - Topic Focused Questions
                </p>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-3">
              {/* Status Indicator */}
              <div className="hidden sm:flex items-center space-x-2 px-2 py-1 bg-green-100 dark:bg-green-500/20 text-green-800 dark:text-green-200 rounded-lg text-xs font-medium">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Ready</span>
              </div>

              {/* Video/Mic Controls - Only show when interview started */}
              {isInterviewStarted && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleToggleVideo}
                    className={`p-2 rounded-lg transition-colors ${
                      isVideoOn
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                    }`}>
                    <Users className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleToggleMic}
                    className={`p-2 rounded-lg transition-colors ${
                      isMicOn
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                    }`}>
                    <Users className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Back Button */}
              <motion.button
                onClick={onBack}
                className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}>
                <ArrowLeft className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="h-full overflow-y-auto">
        <div className="p-4">
          <AnimatePresence mode="wait">
            {!isInterviewStarted ? (
              <motion.div
                key="configuration"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6">
                {/* Topic Selection Section */}
                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-white/20 shadow-lg p-4 lg:p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Select Interview Topic
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Choose a topic to focus your interview questions on
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Topic Selection */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Main Topic <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={formData.topic}
                          onChange={(e) => {
                            handleInputChange("topic", e.target.value);
                            handleInputChange("subtopic", ""); // Reset subtopic
                          }}
                          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-white/20 rounded-lg bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                          <option value="">Select a topic</option>
                          {topics.map((topic) => (
                            <option key={topic} value={topic}>
                              {topic}
                            </option>
                          ))}
                        </select>
                      </div>

                      {formData.topic &&
                        subtopics[formData.topic as keyof typeof subtopics] && (
                          <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Subtopic (Optional)
                            </label>
                            <select
                              value={formData.subtopic}
                              onChange={(e) =>
                                handleInputChange("subtopic", e.target.value)
                              }
                              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-white/20 rounded-lg bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                              <option value="">Select a subtopic</option>
                              {subtopics[
                                formData.topic as keyof typeof subtopics
                              ].map((subtopic) => (
                                <option key={subtopic} value={subtopic}>
                                  {subtopic}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}

                      <div className="p-4 bg-blue-50 dark:bg-blue-500/20 rounded-lg">
                        <div className="flex items-start space-x-2">
                          <Lightbulb className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs font-medium text-blue-800 dark:text-blue-200 mb-1">
                              Topic Focus
                            </p>
                            <p className="text-xs text-blue-700 dark:text-blue-300">
                              {formData.topic
                                ? `Questions will focus on ${formData.topic}${
                                    formData.subtopic
                                      ? ` - ${formData.subtopic}`
                                      : ""
                                  }`
                                : "Select a topic to see what questions will focus on"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Configuration Form */}
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Difficulty Level{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={formData.difficultyLevel}
                            onChange={(e) =>
                              handleInputChange(
                                "difficultyLevel",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-white/20 rounded-lg bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                            <option value="expert">Expert</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Interview Type{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={formData.interviewType}
                            onChange={(e) =>
                              handleInputChange("interviewType", e.target.value)
                            }
                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-white/20 rounded-lg bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                            <option value="technical">
                              Technical Interview
                            </option>
                            <option value="behavioral">
                              Behavioral Interview
                            </option>
                            <option value="mixed">Mixed Interview</option>
                            <option value="practical">
                              Practical Interview
                            </option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Duration <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={formData.duration}
                            onChange={(e) =>
                              handleInputChange("duration", e.target.value)
                            }
                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-white/20 rounded-lg bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                            <option value="15">15 minutes</option>
                            <option value="30">30 minutes</option>
                            <option value="45">45 minutes</option>
                            <option value="60">60 minutes</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Question Count
                          </label>
                          <select className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-white/20 rounded-lg bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                            <option value="5">5 Questions</option>
                            <option value="8">8 Questions</option>
                            <option value="10">10 Questions</option>
                            <option value="12">12 Questions</option>
                          </select>
                        </div>
                      </div>

                      {/* Schedule Option */}
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="schedule"
                          checked={formData.scheduled}
                          onChange={(e) =>
                            handleInputChange("scheduled", e.target.checked)
                          }
                          className="w-3 h-3 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <label
                          htmlFor="schedule"
                          className="text-xs font-medium text-gray-700 dark:text-gray-300">
                          Schedule for later (Optional)
                        </label>
                      </div>

                      {formData.scheduled && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Date
                            </label>
                            <input
                              type="date"
                              value={formData.scheduledDate}
                              onChange={(e) =>
                                handleInputChange(
                                  "scheduledDate",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-white/20 rounded-lg bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Time
                            </label>
                            <input
                              type="time"
                              value={formData.scheduledTime}
                              onChange={(e) =>
                                handleInputChange(
                                  "scheduledTime",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-white/20 rounded-lg bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Interviewer Selection */}
                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-white/20 shadow-lg p-4 lg:p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Choose Your Interviewer
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Select an AI interviewer specialized in your topic
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                    {interviewers.map((interviewer) => (
                      <motion.button
                        key={interviewer.id}
                        onClick={() =>
                          handleInputChange("interviewerId", interviewer.id)
                        }
                        className={`p-3 rounded-lg border-2 transition-all duration-200 text-left hover:scale-105 ${
                          formData.interviewerId === interviewer.id
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-500/20 shadow-lg"
                            : "border-gray-200 dark:border-white/20 hover:border-blue-300 dark:hover:border-blue-400"
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}>
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm mx-auto mb-2">
                          {interviewer.avatar}
                        </div>
                        <div className="text-center">
                          <div className="font-medium text-gray-900 dark:text-white text-xs mb-1">
                            {interviewer.name}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-300 mb-1">
                            {interviewer.role}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                            {interviewer.experience}
                          </div>
                          <div className="flex items-center justify-center space-x-1 mb-1">
                            <Star className="w-2.5 h-2.5 text-yellow-500 fill-yellow-500" />
                            <span className="text-xs text-gray-600 dark:text-gray-300">
                              {interviewer.rating}
                            </span>
                          </div>
                          <div className="text-xs text-blue-600 dark:text-blue-400 leading-tight">
                            {interviewer.specialties.slice(0, 2).join(", ")}
                            {interviewer.specialties.length > 2 && "..."}
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Start Interview Button */}
                <div className="flex justify-center">
                  <motion.button
                    onClick={handleStartInterview}
                    disabled={!formData.topic || !formData.interviewerId}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2 ${
                      formData.topic && formData.interviewerId
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl"
                        : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                    }`}
                    whileHover={{
                      scale:
                        formData.topic && formData.interviewerId ? 1.05 : 1,
                    }}
                    whileTap={{
                      scale:
                        formData.topic && formData.interviewerId ? 0.95 : 1,
                    }}>
                    <Play className="w-5 h-5" />
                    <span className="text-base">
                      {formData.scheduled
                        ? "Schedule Interview"
                        : "Start Interview Now"}
                    </span>
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="interview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6">
                {/* Interview Interface */}
                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-white/20 shadow-lg p-4 lg:p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Interview Area */}
                    <div className="lg:col-span-2 space-y-4">
                      {/* Interview Header */}
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            Topic Based Interview
                          </h2>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            AI Interviewer:{" "}
                            {interviewers.find(
                              (i) => i.id === formData.interviewerId
                            )?.name || "AI Assistant"}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {formData.duration}:00
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Time remaining
                          </p>
                        </div>
                      </div>

                      {/* Video Area */}
                      <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-6 text-center">
                        <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                          <BookOpen className="w-12 h-12 text-white" />
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 text-base">
                          AI Interviewer Ready
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Topic: {formData.topic}
                          {formData.subtopic && ` - ${formData.subtopic}`}
                        </p>
                      </div>

                      {/* Interview Controls */}
                      <div className="flex flex-col sm:flex-row gap-3">
                        <motion.button
                          onClick={handleToggleRecording}
                          className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
                            isRecording
                              ? "bg-red-500 hover:bg-red-600 text-white"
                              : "bg-green-500 hover:bg-green-600 text-white"
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}>
                          {isRecording ? (
                            <Square className="w-4 h-4" />
                          ) : (
                            <Play className="w-4 h-4" />
                          )}
                          <span className="text-sm">
                            {isRecording ? "Stop Recording" : "Start Recording"}
                          </span>
                        </motion.button>

                        <motion.button
                          onClick={handleBackToConfig}
                          className="flex-1 px-4 py-2 border border-gray-300 dark:border-white/20 text-gray-700 dark:text-white font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-white/10 transition-all duration-200 flex items-center justify-center space-x-2"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}>
                          <ArrowLeft className="w-4 h-4" />
                          <span className="text-sm">Back to Configuration</span>
                        </motion.button>
                      </div>

                      {/* Interview Type Indicators */}
                      <div className="flex flex-wrap gap-2">
                        <div className="px-3 py-1.5 bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-200 rounded-lg text-xs font-medium">
                          {formData.difficultyLevel.charAt(0).toUpperCase() +
                            formData.difficultyLevel.slice(1)}{" "}
                          Level
                        </div>
                        <div className="px-3 py-1.5 bg-purple-100 dark:bg-purple-500/20 text-purple-800 dark:text-purple-200 rounded-lg text-xs font-medium">
                          {formData.interviewType.charAt(0).toUpperCase() +
                            formData.interviewType.slice(1)}{" "}
                          Interview
                        </div>
                        <div className="px-3 py-1.5 bg-green-100 dark:bg-green-500/20 text-green-800 dark:text-green-200 rounded-lg text-xs font-medium">
                          {formData.topic} Focus
                        </div>
                      </div>
                    </div>

                    {/* Sidebar - Interview Log */}
                    <div className="lg:col-span-1">
                      <h3 className="text-base font-bold text-gray-900 dark:text-white mb-3">
                        Interview Log
                      </h3>
                      <div className="space-y-2 max-h-80 overflow-y-auto">
                        <div className="p-2 bg-blue-50 dark:bg-blue-500/20 border border-blue-200 dark:border-blue-500/30 rounded-lg">
                          <div className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">
                            AI Interviewer
                          </div>
                          <div className="text-xs text-blue-800 dark:text-blue-200">
                            Hello! Let's discuss {formData.topic}
                            {formData.subtopic &&
                              `, specifically ${formData.subtopic}`}
                            . Tell me what you know about this topic.
                          </div>
                        </div>
                        <div className="p-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg">
                          <div className="text-xs text-gray-600 dark:text-gray-400 font-medium mb-1">
                            You
                          </div>
                          <div className="text-xs text-gray-800 dark:text-gray-200">
                            Ready to begin!
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default TopicBasedInterview;
