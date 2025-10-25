"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { userStorage } from "@/lib/localStorage";
import { interviewRealtimeApi } from "@/lib/api/interview-realtime";
import { isAuthenticated as checkIsAuthenticated } from "@/lib/cookies";
import { useIncompleteInterview, useDashboardState } from "@/hooks/dashboard";
import {
  Sidebar,
  ContentArea,
  DashboardLayout,
  LoadingState,
  RedirectState,
  IncompleteInterviewModal,
} from "@/components/dashboard";
import { UserDisplay, ContentView, InterviewTab } from "@/types/dashboard";

/**
 * Main Dashboard Component
 * Clean, modular, and production-ready implementation
 */
const Dashboard = () => {
  const { user, logout, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  // Get user data from localStorage as fallback
  const storedUserData = userStorage.get();
  const displayUser: UserDisplay | null = user || storedUserData;

  // Get display name and email with proper fallbacks
  const displayName =
    displayUser?.firstName || displayUser?.email?.split("@")[0] || "User";
  const displayEmail = displayUser?.email || "No email available";

  // Dashboard state management
  const {
    activeTab,
    contentView,
    isClient,
    changeInterviewTab,
    changeContentView,
    closeAllViews,
  } = useDashboardState(isAuthenticated, user);

  // Incomplete interview management
  const {
    showIncompleteModal,
    incompleteInterviewData,
    checkBeforeStarting,
    handleResumeInterview,
    handleEndInterview,
    handleCancelModal,
  } = useIncompleteInterview(isClient, isAuthenticated);

  // Debug: Log user data availability
  useEffect(() => {
    console.log("🔍 Dashboard user data debug:", {
      hasUser: !!user,
      hasStoredUserData: !!storedUserData,
      userEmail: user?.email,
      storedUserEmail: storedUserData?.email,
      displayUserEmail: displayUser?.email,
      userFirstName: user?.firstName,
      storedUserFirstName: storedUserData?.firstName,
      displayUserFirstName: displayUser?.firstName,
    });
  }, [user, storedUserData, displayUser]);

  // Check authentication - if not authenticated, redirect to home
  useEffect(() => {
    // Also check cookies and localStorage directly for more reliable auth check
    const hasAuthCookie = checkIsAuthenticated();
    const hasStoredUser = !!storedUserData;

    // Only redirect if ALL auth checks fail
    if (!isLoading && !isAuthenticated && !hasAuthCookie && !hasStoredUser) {
      console.log("❌ Not authenticated - redirecting to home");
      router.push("/");
    } else if (!isLoading && (hasAuthCookie || hasStoredUser)) {
      console.log("✅ User authenticated via cookie/localStorage");
    }
  }, [isLoading, isAuthenticated, storedUserData, router]);

  /**
   * Handle starting a new interview
   * Checks for incomplete interviews before proceeding
   */
  const handleStartInterview = async (formData?: Record<string, unknown>) => {
    const proceedWithNewInterview = async () => {
      try {
        // If form data is provided, use it; otherwise use default values
        const interviewData = formData || {
          resumeId: "your-resume-id",
          interviewType: "technical",
          level: "3-4",
          difficultyLevel: "intermediate",
          jobRole: "Frontend Developer",
          interviewerId: "ai-interviewer-1",
          interviewer: {
            name: "AI Interviewer",
            experience: "5+ years in technical interviews",
            bio: "I'm an AI interviewer with extensive experience in conducting technical interviews. I'll help you practice and improve your interview skills.",
          },
        };

        // Determine the correct API service based on active tab
        let response;
        const interviewTab = activeTab; // Use activeTab from dashboard state

        if (interviewTab === "job-description") {
          // Use job description API service
          const { JobDescriptionBasedInterviewApiService } = await import(
            "@/lib/api/interview-types"
          );
          response =
            await JobDescriptionBasedInterviewApiService.startInterview(
              interviewData as any
            );
        } else if (interviewTab === "company") {
          // Use company API service
          const { CompanyBasedInterviewApiService } = await import(
            "@/lib/api/interview-types"
          );
          response = await CompanyBasedInterviewApiService.startInterview(
            interviewData as any
          );
        } else if (interviewTab === "topic") {
          // Use topic API service
          const { TopicBasedInterviewApiService } = await import(
            "@/lib/api/interview-types"
          );
          response = await TopicBasedInterviewApiService.startInterview(
            interviewData as any
          );
        } else {
          // Default to resume-based interview API service
          response = await interviewRealtimeApi.startInterview(interviewData);
        }

        const interviewId = response.data.interviewId;

        // Navigate to interview page with real interview ID
        router.push(
          `/interview?interviewId=${interviewId}&type=${interviewTab}`
        );
      } catch (error) {
        console.error("Error starting interview:", error);
        // Fallback to mock ID if API fails
        const mockInterviewId = `mock-${Date.now()}`;
        router.push(
          `/interview?interviewId=${mockInterviewId}&type=${activeTab}`
        );
      }
    };

    // Check for incomplete interview before starting
    const canProceed = await checkBeforeStarting(proceedWithNewInterview);
    if (canProceed) {
      await proceedWithNewInterview();
    }
  };

  /**
   * Handle content view changes
   */
  const handleChangeContentView = (view: ContentView) => {
    changeContentView(view);
  };

  /**
   * Handle interview tab changes
   */
  const handleChangeInterviewTab = (tab: InterviewTab) => {
    changeInterviewTab(tab);
  };

  /**
   * Handle closing profile view
   */
  const handleCloseProfile = () => {
    closeAllViews();
  };

  /**
   * Handle closing settings view
   */
  const handleCloseSettings = () => {
    closeAllViews();
  };

  /**
   * Handle closing interview view
   */
  const handleCloseInterview = () => {
    closeAllViews();
  };

  /**
   * Handle resuming incomplete interview
   */
  const handleResumeIncompleteInterview = () => {
    handleResumeInterview((url: string) => router.push(url));
  };

  // Show loading while authentication is being checked
  if (isLoading) {
    return <LoadingState message="Loading Dashboard" />;
  }

  // Check all auth sources
  const hasAuthCookie = checkIsAuthenticated();
  const hasStoredUser = !!storedUserData;

  // If not authenticated via any method, show redirect message
  if (!isAuthenticated && !hasAuthCookie && !hasStoredUser) {
    return <RedirectState />;
  }

  // Show loading while client-side hydration is in progress
  if (!isClient) {
    return <LoadingState message="Loading Dashboard" />;
  }

  return (
    <DashboardLayout>
      {/* Sidebar */}
      <Sidebar
        displayUser={displayUser}
        displayName={displayName}
        displayEmail={displayEmail}
        activeTab={activeTab}
        contentView={contentView}
        onChangeContentView={handleChangeContentView}
        onChangeInterviewTab={handleChangeInterviewTab}
        onLogout={logout}
      />

      {/* Main Content Area */}
      <ContentArea
        contentView={contentView}
        activeTab={activeTab}
        onCloseProfile={handleCloseProfile}
        onCloseSettings={handleCloseSettings}
        onCloseInterview={handleCloseInterview}
        onStartInterview={handleStartInterview}
      />

      {/* Incomplete Interview Modal */}
      <IncompleteInterviewModal
        isOpen={showIncompleteModal}
        interviewData={incompleteInterviewData}
        onResume={handleResumeIncompleteInterview}
        onEnd={handleEndInterview}
        onCancel={handleCancelModal}
      />
    </DashboardLayout>
  );
};

export default Dashboard;
