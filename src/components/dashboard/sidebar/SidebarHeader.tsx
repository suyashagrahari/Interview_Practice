import { ArrowRight, Target } from "lucide-react";

interface SidebarHeaderProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

/**
 * Sidebar header component with logo and collapse toggle
 */
export const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  isCollapsed,
  onToggleCollapse,
}) => {
  return (
    <div className={`border-b border-gray-200/20 dark:border-white/10 ${isCollapsed ? "p-3" : "p-4"}`}>
      <div className={`flex items-center ${isCollapsed ? "justify-center" : "justify-between"}`}>
        {/* Logo and Text Section */}
        <div className={`flex items-center ${isCollapsed ? "justify-center" : "space-x-3"}`}>
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
            <Target className="w-4 h-4 text-white" />
          </div>
          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <h1 className="text-lg font-bold text-gray-900 dark:text-white truncate leading-tight">
                AI Interview
              </h1>
              <p className="text-xs text-gray-600 dark:text-gray-300 truncate font-medium">
                Practice Platform
              </p>
            </div>
          )}
        </div>

        {/* Toggle Button - Only show when expanded */}
        {!isCollapsed && (
          <button
            onClick={onToggleCollapse}
            className="w-8 h-8 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 rounded-lg flex items-center justify-center transition-all duration-200 flex-shrink-0 shadow-sm hover:shadow-md group"
            title="Collapse Sidebar"
          >
            <ArrowRight className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors duration-200" />
          </button>
        )}
      </div>

      {/* Toggle Button - Only show when collapsed */}
      {isCollapsed && (
        <button
          onClick={onToggleCollapse}
          className="mt-3 w-full flex items-center justify-center p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          title="Expand Sidebar"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
        </button>
      )}
    </div>
  );
};
