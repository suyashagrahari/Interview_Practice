import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ContentView, InterviewTab } from "@/types/dashboard";
import { User } from "@/types/auth";

/**
 * Custom hook for managing dashboard state
 * Handles active tab, content view, and URL parameters
 */
export const useDashboardState = (isAuthenticated: boolean, user: User | null) => {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<InterviewTab>("resume");
  const [contentView, setContentView] = useState<ContentView>("interview");
  const [isClient, setIsClient] = useState(false);

  // Set client state to prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Ensure interview is selected by default for authenticated users
  useEffect(() => {
    if (isAuthenticated && user) {
      const profileParam = searchParams.get("profile");
      const interviewParam = searchParams.get("interview");

      if (profileParam === "true") {
        setContentView("profile");
      } else {
        setContentView("interview");

        // Set the active tab based on the interview parameter or default to resume
        if (
          interviewParam &&
          ["resume", "job-description", "topic", "company"].includes(
            interviewParam
          )
        ) {
          setActiveTab(interviewParam as InterviewTab);
        } else {
          setActiveTab("resume");
        }
      }
    }
  }, [isAuthenticated, user, searchParams]);

  // Check for profile parameter and handle profile view
  useEffect(() => {
    const profileParam = searchParams.get("profile");
    if (profileParam === "true") {
      setContentView("profile");

      // Clean up the URL parameter
      const url = new URL(window.location.href);
      url.searchParams.delete("profile");
      window.history.replaceState({}, "", url.toString());
    }
  }, [searchParams]);

  // Check for interview completion status
  useEffect(() => {
    const interviewCompleted = searchParams.get("interviewCompleted");
    if (interviewCompleted === "true") {
      console.log("Interview completed successfully!");
    }
  }, [searchParams]);

  /**
   * Change active interview tab
   */
  const changeInterviewTab = (tab: InterviewTab) => {
    setActiveTab(tab);
    setContentView("interview");
  };

  /**
   * Change content view
   */
  const changeContentView = (view: ContentView) => {
    setContentView(view);
  };

  /**
   * Open profile view
   */
  const openProfile = () => {
    setContentView("profile");
  };

  /**
   * Open settings view
   */
  const openSettings = () => {
    setContentView("settings");
  };

  /**
   * Open interview view
   */
  const openInterview = () => {
    setContentView("interview");
  };

  /**
   * Close all views and return to interview
   */
  const closeAllViews = () => {
    setContentView("interview");
  };

  return {
    activeTab,
    contentView,
    isClient,
    changeInterviewTab,
    changeContentView,
    openProfile,
    openSettings,
    openInterview,
    closeAllViews,
  };
};
