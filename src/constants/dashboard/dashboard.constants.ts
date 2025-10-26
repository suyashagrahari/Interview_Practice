import {
  FileText,
  Briefcase,
  BookOpen,
  Building,
  BarChart3,
  MessageSquare,
  Trophy,
  Users,
  Target,
  Upload,
  FileTextIcon,
} from "lucide-react";
import { InterviewType } from "@/types/dashboard";

/**
 * Interview types configuration
 */
export const INTERVIEW_TYPES: InterviewType[] = [
  {
    id: "resume",
    label: "Resume Based",
    icon: FileText,
    description: "Interview based on your resume",
  },
  {
    id: "job-description",
    label: "Job Description Based",
    icon: Briefcase,
    description: "Interview based on job requirements",
  },
  {
    id: "topic",
    label: "Topic Based",
    icon: BookOpen,
    description: "Interview on specific topics",
  },
  {
    id: "company",
    label: "Company Based",
    icon: Building,
    description: "Company-specific interview",
  },
];

/**
 * Main navigation items (non-interview related)
 */
export const MAIN_NAVIGATION_ITEMS = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: BarChart3,
    path: "/dashboard/analytics",
  },
  {
    id: "practice",
    label: "Question Practice",
    icon: BookOpen,
    path: "/interview-practice",
  },
  {
    id: "upload-questions",
    label: "Upload Topic Questions",
    icon: Upload,
    path: "/dashboard/upload-questions",
  },
  {
    id: "upload-company-questions",
    label: "Upload Company Questions",
    icon: Building,
    path: "/dashboard/upload-company-questions",
  },
  {
    id: "upload-title",
    label: "Upload Title",
    icon: FileTextIcon,
    path: "/dashboard/upload-title",
  },
  {
    id: "history",
    label: "Interview History",
    icon: MessageSquare,
    path: "/interview-history",
  },
  {
    id: "performance",
    label: "Performance",
    icon: Trophy,
    path: "/performance",
  },
  {
    id: "community",
    label: "Community",
    icon: Users,
    path: "/community",
  },
];

/**
 * Mock interview configuration
 */
export const MOCK_INTERVIEW_CONFIG = {
  id: "mock-interview",
  label: "Mock Interview",
  icon: Target,
};

/**
 * Animation variants for framer-motion
 */
export const ANIMATION_VARIANTS = {
  sidebar: {
    initial: { x: -300 },
    animate: { x: 0 },
    transition: { duration: 0.5 },
  },
  content: {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
    transition: { duration: 0.3 },
  },
  collapsible: {
    initial: { opacity: 0, height: 0 },
    animate: { opacity: 1, height: "auto" },
    exit: { opacity: 0, height: 0 },
    transition: { duration: 0.2 },
  },
};

/**
 * Theme options
 */
export const THEME_OPTIONS = [
  {
    value: "light",
    label: "Light",
  },
  {
    value: "dark",
    label: "Dark",
  },
] as const;
