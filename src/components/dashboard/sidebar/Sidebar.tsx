import { motion } from "framer-motion";
import { SidebarHeader } from "./SidebarHeader";
import { SidebarNavigation } from "./SidebarNavigation";
import { SidebarProfile } from "./SidebarProfile";
import { useSidebarState } from "@/hooks/dashboard";
import { ANIMATION_VARIANTS } from "@/constants/dashboard";
import { UserDisplay, ContentView, InterviewTab } from "@/types/dashboard";

interface SidebarProps {
  displayUser: UserDisplay | null;
  displayName: string;
  displayEmail: string;
  activeTab: InterviewTab;
  contentView: ContentView;
  onChangeContentView: (view: ContentView) => void;
  onChangeInterviewTab: (tab: InterviewTab) => void;
  onLogout: () => void;
}

/**
 * Main sidebar component for dashboard
 * Contains navigation, interview types, and profile sections
 */
export const Sidebar: React.FC<SidebarProps> = ({
  displayUser,
  displayName,
  displayEmail,
  activeTab,
  contentView,
  onChangeContentView,
  onChangeInterviewTab,
  onLogout,
}) => {
  const {
    isSidebarCollapsed,
    isMockInterviewOpen,
    isProfileOpen,
    toggleSidebar,
    toggleMockInterview,
    toggleProfile,
  } = useSidebarState();

  const handleSelectInterviewType = (type: InterviewTab) => {
    onChangeInterviewTab(type);
    onChangeContentView("interview");
  };

  const handleOpenSettings = () => {
    onChangeContentView("settings");
    toggleProfile(); // Close profile menu after selection
  };

  const handleOpenProfile = () => {
    onChangeContentView("profile");
    toggleProfile(); // Close profile menu after selection
  };

  const isInterviewActive = contentView === "interview";

  return (
    <motion.aside
      initial={ANIMATION_VARIANTS.sidebar.initial}
      animate={ANIMATION_VARIANTS.sidebar.animate}
      transition={ANIMATION_VARIANTS.sidebar.transition}
      className={`${
        isSidebarCollapsed ? "w-16" : "w-[20%]"
      } bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border-r border-gray-200/30 dark:border-white/20 flex flex-col h-screen transition-all duration-300 ease-in-out flex-shrink-0 shadow-xl`}
    >
      {/* Header */}
      <SidebarHeader
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={toggleSidebar}
      />

      {/* Navigation */}
      <SidebarNavigation
        isCollapsed={isSidebarCollapsed}
        isMockInterviewOpen={isMockInterviewOpen}
        activeTab={activeTab}
        isInterviewActive={isInterviewActive}
        onToggleMockInterview={toggleMockInterview}
        onSelectInterviewType={handleSelectInterviewType}
      />

      {/* Profile Settings - Fixed at Bottom */}
      <SidebarProfile
        isCollapsed={isSidebarCollapsed}
        isProfileOpen={isProfileOpen}
        displayName={displayName}
        displayEmail={displayEmail}
        contentView={contentView}
        onToggleProfile={toggleProfile}
        onOpenSettings={handleOpenSettings}
        onOpenProfile={handleOpenProfile}
        onLogout={onLogout}
      />
    </motion.aside>
  );
};
