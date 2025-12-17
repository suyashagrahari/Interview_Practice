import { useState } from "react";

/**
 * Custom hook for managing sidebar state
 * Handles sidebar collapse, profile menu, and mock interview menu
 */
export const useSidebarState = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMockInterviewOpen, setIsMockInterviewOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  /**
   * Toggle sidebar collapse state
   */
  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  /**
   * Toggle mock interview section
   */
  const toggleMockInterview = () => {
    setIsMockInterviewOpen((prev) => !prev);
  };

  /**
   * Toggle profile section
   */
  const toggleProfile = () => {
    setIsProfileOpen((prev) => !prev);
  };

  /**
   * Collapse sidebar
   */
  const collapseSidebar = () => {
    setIsSidebarCollapsed(true);
  };

  /**
   * Expand sidebar
   */
  const expandSidebar = () => {
    setIsSidebarCollapsed(false);
  };

  /**
   * Open mock interview section
   */
  const openMockInterview = () => {
    setIsMockInterviewOpen(true);
  };

  /**
   * Close mock interview section
   */
  const closeMockInterview = () => {
    setIsMockInterviewOpen(false);
  };

  /**
   * Open profile section
   */
  const openProfile = () => {
    setIsProfileOpen(true);
  };

  /**
   * Close profile section
   */
  const closeProfile = () => {
    setIsProfileOpen(false);
  };

  return {
    isSidebarCollapsed,
    isMockInterviewOpen,
    isProfileOpen,
    toggleSidebar,
    toggleMockInterview,
    toggleProfile,
    collapseSidebar,
    expandSidebar,
    openMockInterview,
    closeMockInterview,
    openProfile,
    closeProfile,
  };
};
