import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, LucideIcon } from "lucide-react";
import { ReactNode } from "react";
import { ANIMATION_VARIANTS } from "@/constants/dashboard";

interface CollapsibleSectionProps {
  icon: LucideIcon;
  title: string;
  isOpen: boolean;
  isCollapsed: boolean;
  isActive?: boolean;
  onToggle: () => void;
  children?: ReactNode;
  tooltip?: string;
}

/**
 * Reusable collapsible section component for sidebar
 */
export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  icon: Icon,
  title,
  isOpen,
  isCollapsed,
  isActive = false,
  onToggle,
  children,
  tooltip,
}) => {
  return (
    <div>
      <button
        onClick={onToggle}
        className={`w-full flex items-center rounded-lg text-left transition-all duration-200 ${
          isActive
            ? "bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/20 dark:border-blue-500/30"
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100/60 dark:hover:bg-white/15 hover:shadow-md"
        } ${isCollapsed ? "justify-center p-2" : "justify-between px-3 py-2"}`}
        title={isCollapsed ? tooltip || title : ""}
      >
        <div className={`flex items-center ${isCollapsed ? "" : "space-x-2"}`}>
          <div className="p-1.5 rounded-lg bg-gray-100/50 dark:bg-white/10">
            <Icon className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
          </div>
          {!isCollapsed && <span className="font-semibold text-base">{title}</span>}
        </div>
        {!isCollapsed && (
          <div className="flex-shrink-0">
            {isOpen ? (
              <ChevronUp className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            )}
          </div>
        )}
      </button>

      {/* Collapsible Content */}
      {!isCollapsed && (
        <AnimatePresence>
          {isOpen && children && (
            <motion.div
              initial={ANIMATION_VARIANTS.collapsible.initial}
              animate={ANIMATION_VARIANTS.collapsible.animate}
              exit={ANIMATION_VARIANTS.collapsible.exit}
              transition={ANIMATION_VARIANTS.collapsible.transition}
              className="ml-6 mt-1 space-y-1 overflow-hidden"
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};
