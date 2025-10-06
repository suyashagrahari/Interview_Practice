import { useRouter } from "next/navigation";
import { SidebarInterviewTypes } from "./SidebarInterviewTypes";
import { SidebarNavItem } from "./SidebarNavItem";
import { MAIN_NAVIGATION_ITEMS } from "@/constants/dashboard";
import { InterviewTab } from "@/types/dashboard";

interface SidebarNavigationProps {
  isCollapsed: boolean;
  isMockInterviewOpen: boolean;
  activeTab: InterviewTab;
  isInterviewActive: boolean;
  onToggleMockInterview: () => void;
  onSelectInterviewType: (type: InterviewTab) => void;
}

/**
 * Main navigation section of the sidebar
 */
export const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  isCollapsed,
  isMockInterviewOpen,
  activeTab,
  isInterviewActive,
  onToggleMockInterview,
  onSelectInterviewType,
}) => {
  const router = useRouter();

  const handleNavigationClick = (path: string) => {
    router.push(path);
  };

  return (
    <div className="flex-1 overflow-y-auto p-3 space-y-2">
      {/* Mock Interview - Collapsible */}
      <SidebarInterviewTypes
        isCollapsed={isCollapsed}
        isMockInterviewOpen={isMockInterviewOpen}
        activeTab={activeTab}
        isInterviewActive={isInterviewActive}
        onToggleMockInterview={onToggleMockInterview}
        onSelectInterviewType={onSelectInterviewType}
      />

      {/* Other Navigation Items */}
      {MAIN_NAVIGATION_ITEMS.map((item) => (
        <SidebarNavItem
          key={item.id}
          icon={item.icon}
          label={item.label}
          isCollapsed={isCollapsed}
          onClick={() => handleNavigationClick(item.path)}
          tooltip={item.label}
        />
      ))}
    </div>
  );
};
