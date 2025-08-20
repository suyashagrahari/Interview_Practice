import { Suspense } from "react";
import Navigation from "@/components/layout/navigation";
import Hero from "@/components/sections/hero";
import Features from "@/components/sections/features";
import Footer from "@/components/layout/footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Interview Platform - Master Your Interviews with AI",
  description:
    "Transform your interview preparation with our AI-powered platform. Practice with intelligent AI models, get real-time feedback, and ace your next interview with confidence.",
  keywords: [
    "AI interview platform",
    "interview preparation",
    "mock interviews",
    "AI practice interviews",
    "interview coaching",
    "career development",
    "job interview practice",
    "AI feedback",
    "interview skills",
    "professional development",
  ],
  openGraph: {
    title: "AI Interview Platform - Master Your Interviews with AI",
    description:
      "Transform your interview preparation with our AI-powered platform. Practice with intelligent AI models, get real-time feedback, and ace your next interview with confidence.",
    type: "website",
    locale: "en_US",
    url: "https://ai-interview-platform.com",
    siteName: "AI Interview Platform",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AI Interview Platform - Master Your Interviews with AI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Interview Platform - Master Your Interviews with AI",
    description:
      "Transform your interview preparation with our AI-powered platform. Practice with intelligent AI models, get real-time feedback, and ace your next interview with confidence.",
    images: ["/og-image.jpg"],
    creator: "@aiinterview",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

// Loading component for better UX
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-primary rounded-full animate-ping opacity-20"></div>
    </div>
  </div>
);

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Suspense fallback={<LoadingSpinner />}>
        <Navigation />
        <Hero />
        <Features />

        {/* Additional sections will be added here */}
        <section className="py-20 bg-gray-50/50 dark:bg-slate-800/50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">
              More Coming Soon...
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              We&apos;re building an amazing platform. Stay tuned for more
              features!
            </p>
          </div>
        </section>

        <Footer />
      </Suspense>
    </main>
  );
}
