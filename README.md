# CodeCraft - Interview Practice Platform

A beautiful, modern, and interactive interview practice platform built with Next.js, TypeScript, and Tailwind CSS. Master various programming topics with an engaging user experience featuring animations, dark/light mode, and responsive design.

## ✨ Features

### 🎨 **Beautiful Design**

- Modern, minimalist UI with glassmorphism effects
- Responsive design that works on all devices
- Smooth animations and transitions using Framer Motion
- Particle background effects for enhanced visual appeal
- Beautiful gradient color schemes

### 🌓 **Theme Support**

- Dark and light mode with automatic system preference detection
- Smooth theme transitions
- Consistent color schemes across all components

### 🔍 **Advanced Search & Filtering**

- Real-time search with intelligent suggestions
- Category-based filtering (Frontend, Backend, Database)
- Search suggestions with trending, popular, and recent topics
- Beautiful search interface with backdrop blur effects

### 📚 **Comprehensive Topic Coverage**

- **Frontend**: JavaScript, React, Next.js, TypeScript
- **Backend**: Node.js, Express.js, Python, Java
- **Database**: MongoDB, SQL
- Interactive topic cards with progress tracking
- Detailed topic pages with structured content

### 🎯 **Interactive Learning Experience**

- Progress tracking with beautiful circular progress indicators
- Topic completion system with visual feedback
- Toast notifications for user actions
- Floating action button for quick navigation
- Sticky navigation with smooth scrolling

### 🚀 **Performance & UX**

- Optimized animations and transitions
- Lazy loading and efficient state management
- Smooth scrolling and navigation
- Responsive grid layouts
- Beautiful loading states

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom animations
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Theme**: next-themes
- **State Management**: React Hooks
- **Build Tool**: Vite (via Next.js)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd Interview_client/interview_client
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── interview-practice/       # Interview practice pages
│   │   ├── page.tsx             # Main topics page
│   │   └── [topic]/             # Dynamic topic routes
│   │       └── page.tsx         # Individual topic page
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Global styles
├── components/                   # Reusable components
│   ├── layout/                  # Layout components
│   │   ├── navigation.tsx       # Main navigation
│   │   └── footer.tsx           # Footer component
│   ├── ui/                      # UI components
│   │   ├── loading-spinner.tsx  # Loading spinner
│   │   ├── floating-action-button.tsx # FAB component
│   │   ├── particle-background.tsx    # Particle effects
│   │   ├── search-suggestions.tsx     # Search suggestions
│   │   ├── progress-ring.tsx          # Progress indicator
│   │   └── notification-toast.tsx     # Toast notifications
│   └── blog/                    # Blog-related components
├── contexts/                     # React contexts
├── lib/                         # Utility functions
└── types/                       # TypeScript type definitions
```

## 🎨 Component Features

### Navigation Component

- Sticky navigation with backdrop blur
- Smooth scroll animations
- Theme toggle with beautiful icons
- Mobile-responsive hamburger menu
- Brand logo with gradient text

### Topic Cards

- Interactive hover effects
- Progress rings with animations
- Category-based color coding
- Smooth transitions and transforms
- Click to navigate to detailed views

### Search Interface

- Real-time search with debouncing
- Intelligent search suggestions
- Category filtering
- Beautiful backdrop blur effects
- Responsive design

### Individual Topic Pages

- Detailed topic information
- Progress tracking
- Interactive content sections
- Completion system
- Beautiful statistics display

## 🌈 Color Scheme

The platform uses a carefully crafted color palette:

- **Primary**: Blue gradients (#3b82f6 to #8b5cf6)
- **Secondary**: Purple accents (#8b5cf6)
- **Success**: Green (#10b981)
- **Warning**: Yellow (#f59e0b)
- **Error**: Red (#ef4444)
- **Neutral**: Gray scale with dark mode support

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Tablet**: Responsive grid layouts
- **Desktop**: Full-featured experience
- **Touch Friendly**: Optimized touch interactions
- **Accessibility**: WCAG compliant design

## 🎭 Animation System

Built with Framer Motion for smooth, performant animations:

- **Page Transitions**: Smooth page loading
- **Hover Effects**: Interactive element feedback
- **Loading States**: Beautiful loading animations
- **Particle Effects**: Floating background elements
- **Progress Indicators**: Animated progress rings

## 🔧 Customization

### Adding New Topics

1. Add topic data to the `topics` array in the main page
2. Create detailed content in the `topicsData` object
3. Add appropriate icons and color schemes
4. Update category filters if needed

### Modifying Themes

1. Update color variables in `globals.css`
2. Modify component color classes
3. Adjust gradient definitions
4. Update dark mode variants

### Adding New Components

1. Create component in appropriate directory
2. Export with proper TypeScript interfaces
3. Import and use in parent components
4. Add animations and responsive design

## 🚀 Deployment

### Build for Production

```bash
npm run build
# or
yarn build
```

### Start Production Server

```bash
npm start
# or
yarn start
```

### Environment Variables

Create a `.env.local` file for environment-specific configurations.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **Next.js Team** for the amazing framework
- **Framer Motion** for smooth animations
- **Tailwind CSS** for utility-first styling
- **Lucide** for beautiful icons
- **Vercel** for hosting and deployment

---

**Built with ❤️ using modern web technologies**

_Transform your coding skills with CodeCraft - where learning meets beautiful design._
