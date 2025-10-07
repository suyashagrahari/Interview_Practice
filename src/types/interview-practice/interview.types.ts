export interface Question {
  id: string | number;
  title: string;
  question?: string;
  answer: string;
  level: "Beginner" | "Intermediate" | "Expert";
  keyPoints?: string[];
  example?: string;
  explanation?: string;
  slug?: string;
  order?: number;
  viewCount?: number;
  isFeatured?: boolean;
  technology: {
    name: string;
    category?: {
      name: string;
    };
  };
  author: {
    name: string;
  };
  createdAt?: string;
  updatedAt?: string;
  metaTitle?: string;
  metaDescription?: string;
}

export interface TopicContent {
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

export interface Technology {
  id: string;
  name: string;
  title: string;
  description: string;
  slug: string;
  difficultyLevel: string;
  popularity: string;
  color: string;
  bgColor: string;
  icon: string;
  category?: {
    name: string;
    slug: string;
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  color?: string;
}
