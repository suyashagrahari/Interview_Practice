"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Play, ArrowRight, Star, Users, Target, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import AuthModal from "@/components/auth/auth-modal";
import { useAuth } from "@/contexts/auth-context";
import { checkUserAuthentication } from "@/lib/auth-utils";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const Hero = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const floatingElementsRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!heroRef.current) return;

    const ctx = gsap.context(() => {
      // Floating elements animation
      gsap.to(".floating-element", {
        y: -20,
        duration: 3,
        ease: "power2.inOut",
        stagger: 0.2,
        repeat: -1,
        yoyo: true,
      });

      // Text reveal animation
      gsap.fromTo(
        ".hero-text",
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          stagger: 0.1,
        }
      );

      // CTA button animation
      gsap.fromTo(
        ".hero-cta",
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.8,
          ease: "back.out(1.7)",
          delay: 0.5,
        }
      );

      // Parallax effect on scroll
      gsap.to(".floating-bg", {
        y: (i, target) => -target.offsetHeight * 0.5,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const stats = [
    { icon: Users, value: "50K+", label: "Active Users" },
    { icon: Target, value: "94%", label: "Success Rate" },
    { icon: Zap, value: "250K+", label: "Interviews" },
  ];

  const handleGetStarted = () => {
    // Check authentication from multiple sources for reliability
    const authResult = checkUserAuthentication(isAuthenticated, user);

    console.log("🔍 handleGetStarted - Auth state:", {
      isAuthenticated: authResult.isAuthenticated,
      user: authResult.user,
      source: authResult.source,
      userEmail: authResult.user?.email,
      userFirstName: authResult.user?.firstName,
      debugInfo: authResult.debugInfo,
    });

    // If user is already authenticated (from any source), redirect to dashboard
    if (authResult.isAuthenticated) {
      console.log(
        `✅ User is authenticated via ${authResult.source}, redirecting to dashboard`
      );
      router.push("/dashboard");
      return;
    }

    console.log("❌ User not authenticated, showing auth modal");
    // Otherwise, show auth modal
    setIsAuthModalOpen(true);
  };

  return (
    <>
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-blue-900 dark:to-purple-900">
        {/* Floating Background Elements */}
        <div
          ref={floatingElementsRef}
          className="absolute inset-0 pointer-events-none">
          <div className="floating-bg floating-element absolute top-16 sm:top-20 left-5 sm:left-10 w-32 h-32 sm:w-48 sm:h-48 sm:w-72 sm:h-72 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse-slow" />
          <div className="floating-bg floating-element absolute top-32 sm:top-40 right-10 sm:right-20 w-40 h-40 sm:w-64 sm:h-64 sm:w-96 sm:h-96 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse-slow" />
          <div className="floating-bg floating-element absolute bottom-16 sm:bottom-20 left-1/4 w-36 h-36 sm:w-56 sm:h-56 sm:w-80 sm:h-80 bg-gradient-to-br from-pink-500/20 to-rose-500/20 rounded-full blur-3xl animate-pulse-slow" />

          {/* Geometric Shapes */}
          <div className="floating-element absolute top-1/4 right-1/3 w-8 h-8 sm:w-12 sm:h-12 sm:w-16 sm:h-16 border-2 border-blue-400/30 rounded-lg rotate-45 animate-float" />
          <div className="floating-element absolute top-1/3 left-1/4 w-6 h-6 sm:w-8 sm:h-8 sm:w-12 sm:h-12 bg-purple-500/20 rounded-full animate-float-delayed" />
          <div className="floating-element absolute bottom-1/3 right-1/4 w-10 h-10 sm:w-16 sm:h-16 sm:w-20 sm:h-20 border-2 border-cyan-400/30 rounded-full animate-float-slow" />
        </div>

        {/* Main Content */}
        <div className="relative z-10 text-center px-3 sm:px-4 sm:px-6 max-w-6xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 px-3 sm:px-4 py-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full border border-blue-500/20 mb-4 sm:mb-6 mt-8 sm:mt-16">
            <Star className="w-4 h-4 fill-blue-500 dark:fill-blue-400" />
            <span className="text-xs sm:text-sm font-medium">
              AI-Powered Interview Platform
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            ref={textRef}
            className="hero-text text-3xl sm:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-3 sm:mb-4 sm:mb-6 leading-tight px-1 sm:px-2">
            <motion.span
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-gray-900 dark:text-white">
              Master Your
            </motion.span>
            <br />
            <motion.span
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              Interview Skills
            </motion.span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-base sm:text-lg sm:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-6 sm:mb-8 sm:mb-12 leading-relaxed px-3 sm:px-4">
            Transform your interview preparation with our advanced AI platform.
            Practice with intelligent models, get real-time feedback, and ace
            your next interview with confidence.
          </motion.p>

          {/* CTA Buttons */}
          <div
            ref={ctaRef}
            className="hero-cta flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-8 sm:mb-12 px-3 sm:px-4">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGetStarted}
              className="group relative w-full sm:w-auto px-5 sm:px-6 sm:px-8 py-2.5 sm:py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl text-sm sm:text-base sm:text-lg shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 overflow-hidden">
              <span className="relative z-10 flex items-center justify-center space-x-2">
                <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Start Free Trial</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto px-5 sm:px-6 sm:px-8 py-2.5 sm:py-3 sm:py-4 border-2 border-gray-300 dark:border-white/20 text-gray-700 dark:text-white font-semibold rounded-xl text-sm sm:text-base sm:text-lg hover:bg-gray-50 dark:hover:bg-white/10 transition-all duration-300 group backdrop-blur-sm">
              <span className="flex items-center justify-center space-x-2">
                <span>Watch Demo</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </span>
            </motion.button>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 sm:gap-8 max-w-2xl mx-auto px-3 sm:px-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                className="text-center group">
                <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 sm:w-16 sm:h-16 mx-auto mb-2 sm:mb-3 sm:mb-4 bg-blue-500/10 dark:bg-white/10 rounded-2xl group-hover:bg-blue-500/20 dark:group-hover:bg-white/20 transition-colors duration-300 backdrop-blur-sm">
                  <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-xl sm:text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm sm:text-base text-gray-600 dark:text-gray-300">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-gray-400/30 dark:border-white/30 rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-gray-400/50 dark:bg-white/50 rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
};

export default Hero;
