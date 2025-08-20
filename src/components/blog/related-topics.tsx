"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface RelatedTopic {
  id: string;
  name: string;
  description: string;
  questionCount: number;
  difficulty: string;
  color: string;
}

interface RelatedTopicsProps {
  currentTopicId: string;
  topics: RelatedTopic[];
}

const RelatedTopics = ({ currentTopicId, topics }: RelatedTopicsProps) => {
  const relatedTopics = topics
    .filter((topic) => topic.id !== currentTopicId)
    .slice(0, 3);

  if (relatedTopics.length === 0) return null;

  return (
    <section className="mt-16 bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-8">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Related Topics
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedTopics.map((topic, index) => (
          <motion.div
            key={topic.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -2 }}
            className="bg-white dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                {topic.name}
              </h4>
              <div
                className={`w-8 h-8 bg-gradient-to-r ${topic.color} rounded-lg flex items-center justify-center`}>
                <ArrowRight className="w-4 h-4 text-white" />
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
              {topic.description}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-200 text-xs font-medium rounded-full">
                  {topic.questionCount} Questions
                </span>
                <span className="px-2 py-1 bg-green-100 dark:bg-green-500/20 text-green-800 dark:text-green-200 text-xs font-medium rounded-full">
                  {topic.difficulty}
                </span>
              </div>

              <Link
                href={`/interview-practice/${topic.id}`}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium transition-colors duration-200">
                Explore →
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default RelatedTopics;

