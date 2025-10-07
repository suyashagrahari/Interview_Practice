"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "@/contexts/theme-context";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import AuthModal from "@/components/auth/auth-modal";
import { useAuth } from "@/contexts/auth-context";
import { checkUserAuthentication } from "@/lib/auth-utils";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme, mounted } = useTheme();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Topics", href: "/interview-practice" },
    { name: "Roadmaps", href: "#roadmaps" },
    { name: "Resources", href: "#resources" },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleGetStarted = () => {
    // Check authentication from multiple sources for reliability
    const authResult = checkUserAuthentication(isAuthenticated, user);

    console.log("🔍 Navigation handleGetStarted - Auth state:", {
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
      setIsOpen(false); // Close mobile menu if open
      return;
    }

    console.log("❌ User not authenticated, showing auth modal");
    // Otherwise, show auth modal
    setIsAuthModalOpen(true);
    setIsOpen(false); // Close mobile menu if open
  };

  if (!mounted) return null;

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full",
          scrolled
            ? "bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-gray-200/20 dark:border-white/10 shadow-lg"
            : "bg-transparent"
        )}>
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo - Left Corner */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 flex-shrink-0">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg lg:text-xl">
                  C
                </span>
              </div>
              <div className="hidden sm:block">
                <span className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  CodeCraft
                </span>
              </div>
            </motion.div>

            {/* Desktop Navigation - Center */}
            <div className="hidden lg:flex items-center justify-center flex-1 px-8">
              <div className="flex items-center space-x-8">
                {navItems.map((item, index) => (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -2 }}
                    className="text-gray-700 dark:text-white/80 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 font-medium relative group">
                    {item.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 dark:bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Right Side - Theme Toggle and Get Started */}
            <div className="flex items-center space-x-3 flex-shrink-0">
              {/* Theme Toggle */}
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors duration-200 text-gray-700 dark:text-white"
                aria-label="Toggle theme">
                {theme === "dark" ? (
                  <Sun className="w-5 h-5 text-yellow-500" />
                ) : theme === "light" ? (
                  <Moon className="w-5 h-5 text-blue-600" />
                ) : (
                  <Monitor className="w-5 h-5 text-gray-600" />
                )}
              </motion.button>

              {/* CTA Button */}
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGetStarted}
                className="hidden sm:inline-flex items-center px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl">
                Get Started
              </motion.button>

              {/* Mobile Menu Button */}
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleMenu}
                className="lg:hidden p-2 rounded-lg bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors duration-200 text-gray-700 dark:text-white"
                aria-label="Toggle menu">
                {isOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </motion.button>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="lg:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-gray-200/20 dark:border-white/10">
                <div className="w-full px-4 py-6 space-y-4">
                  {/* Mobile Logo */}
                  <div className="flex items-center justify-center pb-4 border-b border-gray-200/20 dark:border-white/10">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-lg">C</span>
                      </div>
                      <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        CodeCraft
                      </span>
                    </div>
                  </div>

                  {/* Navigation Links */}
                  {navItems.map((item, index) => (
                    <motion.a
                      key={item.name}
                      href={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      onClick={() => setIsOpen(false)}
                      className="block py-3 text-lg font-medium text-gray-700 dark:text-white/80 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 border-b border-gray-200/20 dark:border-white/10 last:border-b-0">
                      {item.name}
                    </motion.a>
                  ))}

                  {/* Mobile CTA */}
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: navItems.length * 0.1 }}
                    onClick={handleGetStarted}
                    className="w-full mt-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300">
                    Get Started
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
};

export default Navigation;
