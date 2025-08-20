export interface InterviewSession {
  id: string
  candidateId: string
  aiModelId: string
  status: 'pending' | 'active' | 'completed' | 'failed'
  startTime: Date
  endTime?: Date
  questions: InterviewQuestion[]
  feedback?: InterviewFeedback
  score?: number
}

export interface InterviewQuestion {
  id: string
  question: string
  category: 'technical' | 'behavioral' | 'situational' | 'case-study'
  difficulty: 'easy' | 'medium' | 'hard' | 'expert'
  timeLimit: number
  answer?: string
  aiFeedback?: string
}

export interface InterviewFeedback {
  overallScore: number
  technicalScore: number
  communicationScore: number
  problemSolvingScore: number
  strengths: string[]
  areasForImprovement: string[]
  detailedFeedback: string
  recommendations: string[]
}

export interface AIModel {
  id: string
  name: string
  description: string
  capabilities: string[]
  avatar: string
  personality: string
  specialties: string[]
}

export interface Candidate {
  id: string
  name: string
  email: string
  avatar?: string
  experience: number
  skills: string[]
  completedInterviews: number
  averageScore: number
}

export interface Testimonial {
  id: string
  candidateName: string
  candidateRole: string
  candidateCompany: string
  candidateAvatar: string
  content: string
  rating: number
  interviewType: string
  date: Date
}

export interface Feature {
  id: string
  title: string
  description: string
  icon: string
  benefits: string[]
  animationDelay: number
}

export interface PricingPlan {
  id: string
  name: string
  price: number
  billingCycle: 'monthly' | 'yearly'
  features: string[]
  popular?: boolean
  cta: string
}
