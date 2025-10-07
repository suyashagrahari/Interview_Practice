// Interview Page Constants
import { AvatarData } from "@/types/interview-page/interview.types";

export const INTERVIEW_CONSTANTS = {
  TIMER: {
    INITIAL_TIME: 45 * 60, // 45 minutes in seconds
    LOW_TIME_THRESHOLD: 300, // 5 minutes warning threshold
  },
  CAMERA: {
    VIDEO_WIDTH: 1280,
    VIDEO_HEIGHT: 720,
    FACING_MODE: "user" as const,
    TIMEOUT: 5000, // 5 seconds
  },
  SPEECH: {
    LANGUAGE: "en-US",
    CONTINUOUS: true,
    INTERIM_RESULTS: true,
    TIMEOUT: 600000, // 10 minutes
    RETRY_ATTEMPTS: 2,
    RETRY_DELAY: 2000, // 2 seconds
  },
  STREAMING: {
    WORD_DELAY: 20, // ms between words
    QUESTION_WORD_DELAY: 100, // ms between words for questions
  },
  SUBTITLE: {
    HIDE_DELAY: 2000, // 2 seconds
  },
  SAVE: {
    DEBOUNCE_DELAY: 1000, // 1 second
  },
  VIDEO: {
    RETRY_ATTEMPTS: 2,
    RETRY_DELAY: 100, // ms
  },
} as const;

export const DEFAULT_AVATAR: AvatarData = {
  id: "avatar1",
  name: "Mike Johnson",
  role: "Tech Lead",
  experience: "10 years",
  rating: 4.9,
  skills: ["Python", "AWS", "Docker"],
  imageSrc: "/images/Avtar1.png",
  videoSrc: "/models/Avtar1.mp4",
};

export const NETWORK_STATUS = {
  ONLINE: "online",
  OFFLINE: "offline",
  CHECKING: "checking",
} as const;

export const WARNING_THRESHOLDS = {
  TAB_SWITCH_WARNING: 1,
  TAB_SWITCH_TERMINATE: 2, // Disabled for now
} as const;

export const TOTAL_QUESTIONS = 10;
