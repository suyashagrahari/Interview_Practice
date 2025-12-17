import { Code } from "lucide-react";

export const STATIC_TOPIC_DATA = {
  icon: Code,
  color: "text-blue-500",
  bgColor: "bg-blue-100 dark:bg-blue-900/20",
  duration: "10-15 hours",
  participants: 12850,
  rating: 4.9,
  questions: [],
};

export const PAGE_SIZE = 25;

export const DIFFICULTY_LEVELS = ["Beginner", "Intermediate", "Expert"] as const;

export const SCROLL_THRESHOLD = 0.8;

export const ANIMATION_DELAYS = {
  HERO: 0.2,
  SEARCH: 0.6,
  CATEGORY: 0.8,
  CARD_BASE: 0.1,
};

export const VIEWPORT_CENTER_THRESHOLD = 200;

export const SCROLL_ANIMATION_DELAY = 1200;
