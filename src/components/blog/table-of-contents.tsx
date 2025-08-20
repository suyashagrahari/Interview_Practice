"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { List, ChevronDown, ChevronUp } from "lucide-react";

interface TableOfContentsItem {
  id: string;
  title: string;
  level: number;
}

interface TableOfContentsProps {
  items: TableOfContentsItem[];
}

const TableOfContents = ({ items }: TableOfContentsProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const handleScroll = () => {
      const headings = items.map((item) => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 100;

      for (let i = headings.length - 1; i >= 0; i--) {
        const heading = headings[i];
        if (heading && heading.offsetTop <= scrollPosition) {
          setActiveId(items[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [items]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (items.length === 0) return null;

  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-gray-200/20 dark:border-white/10 p-4 sticky top-24">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-left font-semibold text-gray-900 dark:text-white mb-3">
        <div className="flex items-center space-x-2">
          <List className="w-5 h-5" />
          <span>Table of Contents</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5" />
        ) : (
          <ChevronDown className="w-5 h-5" />
        )}
      </button>

      <motion.div
        initial={false}
        animate={{ height: isExpanded ? "auto" : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden">
        <nav className="space-y-2">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToHeading(item.id)}
              className={`w-full text-left p-2 rounded-lg transition-all duration-200 text-sm ${
                activeId === item.id
                  ? "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 font-medium"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10"
              }`}
              style={{ paddingLeft: `${item.level * 12 + 8}px` }}>
              {item.title}
            </button>
          ))}
        </nav>
      </motion.div>
    </div>
  );
};

export default TableOfContents;

