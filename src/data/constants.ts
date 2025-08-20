import { Feature, Testimonial, PricingPlan, AIModel } from '@/types'

export const FEATURES: Feature[] = [
  {
    id: '1',
    title: 'AI-Powered Interviews',
    description: 'Practice with advanced AI models that adapt to your skill level and provide real-time feedback',
    icon: '🤖',
    benefits: ['Personalized questions', 'Adaptive difficulty', 'Real-time feedback'],
    animationDelay: 0
  },
  {
    id: '2',
    title: 'Comprehensive Analytics',
    description: 'Get detailed insights into your performance with advanced analytics and progress tracking',
    icon: '📊',
    benefits: ['Performance metrics', 'Progress tracking', 'Skill assessment'],
    animationDelay: 0.1
  },
  {
    id: '3',
    title: 'Industry-Specific Questions',
    description: 'Access thousands of questions tailored to your industry and role',
    icon: '🎯',
    benefits: ['Role-specific content', 'Industry expertise', 'Current trends'],
    animationDelay: 0.2
  },
  {
    id: '4',
    title: 'Mock Interview Sessions',
    description: 'Full-length interview simulations with realistic timing and pressure',
    icon: '⏱️',
    benefits: ['Realistic timing', 'Pressure simulation', 'Complete experience'],
    animationDelay: 0.3
  },
  {
    id: '5',
    title: 'Video Recording & Review',
    description: 'Record your interviews and review them to improve your presentation skills',
    icon: '📹',
    benefits: ['Self-review', 'Presentation skills', 'Body language analysis'],
    animationDelay: 0.4
  },
  {
    id: '6',
    title: 'Expert Feedback',
    description: 'Receive detailed feedback from AI experts and industry professionals',
    icon: '💡',
    benefits: ['Expert insights', 'Actionable advice', 'Continuous improvement'],
    animationDelay: 0.5
  }
]

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    candidateName: 'Sarah Chen',
    candidateRole: 'Senior Software Engineer',
    candidateCompany: 'Google',
    candidateAvatar: '/avatars/sarah.jpg',
    content: 'This platform completely transformed my interview preparation. The AI feedback was incredibly detailed and helped me identify areas I never knew needed improvement.',
    rating: 5,
    interviewType: 'Technical Interview',
    date: new Date('2024-01-15')
  },
  {
    id: '2',
    candidateName: 'Marcus Rodriguez',
    candidateRole: 'Product Manager',
    candidateCompany: 'Microsoft',
    candidateAvatar: '/avatars/marcus.jpg',
    content: 'The behavioral interview practice was game-changing. I went from being nervous to confident, and it showed in my actual interviews.',
    rating: 5,
    interviewType: 'Behavioral Interview',
    date: new Date('2024-01-10')
  },
  {
    id: '3',
    candidateName: 'Priya Patel',
    candidateRole: 'Data Scientist',
    candidateCompany: 'Netflix',
    candidateAvatar: '/avatars/priya.jpg',
    content: 'The case study simulations were incredibly realistic. I felt prepared for any curveball questions that came my way.',
    rating: 5,
    interviewType: 'Case Study Interview',
    date: new Date('2024-01-08')
  }
]

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: '1',
    name: 'Starter',
    price: 29,
    billingCycle: 'monthly',
    features: [
      '5 AI interview sessions per month',
      'Basic analytics dashboard',
      'Standard question bank',
      'Email support'
    ],
    cta: 'Start Free Trial'
  },
  {
    id: '2',
    name: 'Professional',
    price: 79,
    billingCycle: 'monthly',
    features: [
      'Unlimited AI interview sessions',
      'Advanced analytics & insights',
      'Premium question bank',
      'Video recording & review',
      'Priority support',
      'Custom interview scenarios'
    ],
    popular: true,
    cta: 'Get Started'
  },
  {
    id: '3',
    name: 'Enterprise',
    price: 199,
    billingCycle: 'monthly',
    features: [
      'Everything in Professional',
      'Team collaboration tools',
      'Custom AI model training',
      'API access',
      'Dedicated success manager',
      'White-label solutions'
    ],
    cta: 'Contact Sales'
  }
]

export const AI_MODELS: AIModel[] = [
  {
    id: '1',
    name: 'Alex',
    description: 'Technical Interview Specialist',
    capabilities: ['System Design', 'Algorithms', 'Data Structures', 'System Architecture'],
    avatar: '/ai-models/alex.jpg',
    personality: 'Analytical and thorough, Alex specializes in deep technical discussions and problem-solving scenarios.',
    specialties: ['Software Engineering', 'Computer Science', 'System Design']
  },
  {
    id: '2',
    name: 'Emma',
    description: 'Behavioral Interview Coach',
    capabilities: ['Leadership', 'Communication', 'Problem Solving', 'Team Collaboration'],
    avatar: '/ai-models/emma.jpg',
    personality: 'Warm and encouraging, Emma helps candidates showcase their soft skills and leadership potential.',
    specialties: ['Product Management', 'Leadership', 'Consulting']
  },
  {
    id: '3',
    name: 'David',
    description: 'Case Study Expert',
    capabilities: ['Business Strategy', 'Market Analysis', 'Financial Modeling', 'Strategic Thinking'],
    avatar: '/ai-models/david.jpg',
    personality: 'Strategic and business-focused, David excels at complex case studies and business scenarios.',
    specialties: ['Consulting', 'Investment Banking', 'Strategy']
  }
]

export const STATS = {
  users: 50000,
  interviews: 250000,
  successRate: 94,
  companies: 500
}
