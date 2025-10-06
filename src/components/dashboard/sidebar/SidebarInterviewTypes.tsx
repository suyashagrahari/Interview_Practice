import { CollapsibleSection } from "./CollapsibleSection";
import { INTERVIEW_TYPES, MOCK_INTERVIEW_CONFIG } from "@/constants/dashboard";
import { InterviewTab } from "@/types/dashboard";

interface SidebarInterviewTypesProps {
  isCollapsed: boolean;
  isMockInterviewOpen: boolean;
  activeTab: InterviewTab;
  isInterviewActive: boolean;
  onToggleMockInterview: () => void;
  onSelectInterviewType: (type: InterviewTab) => void;
}

/**
 * Sidebar section for interview types selection
 */
export const SidebarInterviewTypes: React.FC<SidebarInterviewTypesProps> = ({
  isCollapsed,
  isMockInterviewOpen,
  activeTab,
  isInterviewActive,
  onToggleMockInterview,
  onSelectInterviewType,
}) => {
  return (
    <CollapsibleSection
      icon={MOCK_INTERVIEW_CONFIG.icon}
      title={MOCK_INTERVIEW_CONFIG.label}
      isOpen={isMockInterviewOpen}
      isCollapsed={isCollapsed}
      isActive={isInterviewActive}
      onToggle={onToggleMockInterview}
      tooltip="Mock Interview"
    >
      {INTERVIEW_TYPES.map((type) => (
        <button
          key={type.id}
          onClick={() => onSelectInterviewType(type.id as InterviewTab)}
          className={`w-full flex items-center space-x-2 px-2 py-1.5 rounded-md text-left transition-all duration-200 ${
            activeTab === type.id && isInterviewActive
              ? "bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/20 dark:border-blue-500/30"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100/30 dark:hover:bg-white/5"
          }`}
        >
          <type.icon
            className={`w-3.5 h-3.5 ${
              activeTab === type.id && isInterviewActive
                ? "text-blue-600 dark:text-blue-400"
                : "text-gray-500 dark:text-gray-400"
            }`}
          />
          <div className="min-w-0">
            <div className="font-medium text-base truncate">{type.label}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {type.description}
            </div>
          </div>
        </button>
      ))}
    </CollapsibleSection>
  );
};
