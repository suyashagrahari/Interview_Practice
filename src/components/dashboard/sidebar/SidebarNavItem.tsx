import { LucideIcon } from "lucide-react";

interface SidebarNavItemProps {
  icon: LucideIcon;
  label: string;
  description?: string;
  isCollapsed: boolean;
  isActive?: boolean;
  onClick: () => void;
  tooltip?: string;
}

/**
 * Individual navigation item component
 */
export const SidebarNavItem: React.FC<SidebarNavItemProps> = ({
  icon: Icon,
  label,
  description,
  isCollapsed,
  isActive = false,
  onClick,
  tooltip,
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center rounded-lg text-left transition-all duration-200 ${
        isActive
          ? "bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/20 dark:border-blue-500/30"
          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100/60 dark:hover:bg-white/15 hover:shadow-md"
      } ${isCollapsed ? "justify-center p-2" : "space-x-2 px-3 py-2"}`}
      title={isCollapsed ? tooltip || label : ""}
    >
      <div className="p-1.5 rounded-lg bg-gray-100/50 dark:bg-white/10">
        <Icon className="w-4 h-4 flex-shrink-0" />
      </div>
      {!isCollapsed && (
        <div className="min-w-0 flex-1">
          <div className="font-semibold text-base truncate">{label}</div>
          {description && (
            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {description}
            </div>
          )}
        </div>
      )}
    </button>
  );
};
