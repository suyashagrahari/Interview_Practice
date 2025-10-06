import { motion, AnimatePresence } from "framer-motion";
import { User, Settings, ArrowRight, ChevronUp, ChevronDown } from "lucide-react";
import { SidebarThemeToggle } from "./SidebarThemeToggle";
import { ANIMATION_VARIANTS } from "@/constants/dashboard";
import { UserDisplay, ContentView } from "@/types/dashboard";

interface SidebarProfileProps {
  isCollapsed: boolean;
  isProfileOpen: boolean;
  displayName: string;
  displayEmail: string;
  contentView: ContentView;
  onToggleProfile: () => void;
  onOpenSettings: () => void;
  onOpenProfile: () => void;
  onLogout: () => void;
}

/**
 * Profile section component for sidebar
 */
export const SidebarProfile: React.FC<SidebarProfileProps> = ({
  isCollapsed,
  isProfileOpen,
  displayName,
  displayEmail,
  contentView,
  onToggleProfile,
  onOpenSettings,
  onOpenProfile,
  onLogout,
}) => {
  const isSettingsActive = contentView === "settings";
  const isProfileActive = contentView === "profile";

  return (
    <div className="border-t border-gray-200/30 dark:border-white/20 p-3">
      <div>
        <button
          onClick={onToggleProfile}
          className={`w-full flex items-center rounded-lg text-left transition-all duration-200 group ${
            isProfileOpen
              ? "bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-500/10 dark:to-purple-500/10 border border-blue-200/50 dark:border-blue-500/30 shadow-md"
              : "hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 dark:hover:from-white/5 dark:hover:to-white/10 hover:shadow-md"
          } ${isCollapsed ? "justify-center p-2" : "justify-between px-3 py-2"}`}
          title={isCollapsed ? "Profile" : ""}
        >
          <div className={`flex items-center ${isCollapsed ? "" : "space-x-2"}`}>
            <div
              className={`w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg transition-all duration-200 ${
                isProfileOpen
                  ? "ring-2 ring-blue-200 dark:ring-blue-500/50"
                  : "group-hover:ring-2 group-hover:ring-blue-200 dark:group-hover:ring-blue-500/50"
              }`}
            >
              <User className="w-4 h-4 text-white" />
            </div>
            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <div
                  className={`font-semibold text-base text-gray-900 dark:text-white truncate transition-all duration-200 ${
                    isProfileOpen
                      ? "text-blue-700 dark:text-blue-200"
                      : "group-hover:text-blue-600 dark:group-hover:text-blue-300"
                  }`}
                >
                  {displayName}
                </div>
                <div
                  className={`text-xs truncate transition-all duration-200 ${
                    isProfileOpen
                      ? "text-blue-600 dark:text-blue-300"
                      : "text-gray-600 dark:text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400"
                  }`}
                >
                  {displayEmail}
                </div>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <div className="flex-shrink-0">
              {isProfileOpen ? (
                <ChevronUp
                  className={`w-4 h-4 transition-all duration-200 ${
                    isProfileOpen
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                />
              ) : (
                <ChevronDown
                  className={`w-4 h-4 transition-all duration-200 ${
                    isProfileOpen
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-500 dark:text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400"
                  }`}
                />
              )}
            </div>
          )}
        </button>

        {/* Collapsible Profile Options */}
        {!isCollapsed && (
          <AnimatePresence>
            {isProfileOpen && (
              <motion.div
                initial={ANIMATION_VARIANTS.collapsible.initial}
                animate={ANIMATION_VARIANTS.collapsible.animate}
                exit={ANIMATION_VARIANTS.collapsible.exit}
                transition={ANIMATION_VARIANTS.collapsible.transition}
                className="ml-0 mt-2 space-y-1 overflow-hidden"
              >
                <button
                  onClick={onOpenSettings}
                  className={`w-full flex items-center space-x-2 px-2 py-1.5 rounded-md text-left transition-all duration-200 group ${
                    isSettingsActive
                      ? "bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-500/20 dark:to-blue-500/30 text-blue-700 dark:text-blue-200 border border-blue-200/50 dark:border-blue-500/30 shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-300 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-blue-100/50 dark:hover:from-blue-500/10 dark:hover:to-blue-500/20 hover:shadow-sm"
                  }`}
                >
                  <Settings
                    className={`w-3.5 h-3.5 transition-colors duration-200 ${
                      isSettingsActive
                        ? "text-blue-600 dark:text-blue-300"
                        : "group-hover:text-blue-500 dark:group-hover:text-blue-400"
                    }`}
                  />
                  <span className="text-base font-medium">Settings</span>
                </button>

                <button
                  onClick={onOpenProfile}
                  className={`w-full flex items-center space-x-2 px-2 py-1.5 rounded-md text-left transition-all duration-200 group ${
                    isProfileActive
                      ? "bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-500/20 dark:to-blue-500/30 text-blue-700 dark:text-blue-200 border border-blue-200/50 dark:border-blue-500/30 shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-300 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-blue-100/50 dark:hover:from-blue-500/10 dark:hover:to-blue-500/20 hover:shadow-sm"
                  }`}
                >
                  <User
                    className={`w-3.5 h-3.5 transition-colors duration-200 ${
                      isProfileActive
                        ? "text-blue-600 dark:text-blue-300"
                        : "group-hover:text-blue-500 dark:group-hover:text-blue-400"
                    }`}
                  />
                  <span className="text-base font-medium">Profile</span>
                </button>

                {/* Theme Toggle Section */}
                <SidebarThemeToggle />

                <button
                  onClick={onLogout}
                  className="w-full flex items-center space-x-2 px-2 py-1.5 rounded-md text-left transition-all duration-200 group text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 dark:hover:from-red-500/10 dark:hover:to-red-500/20 hover:shadow-sm"
                >
                  <ArrowRight className="w-3.5 h-3.5 rotate-180 group-hover:scale-110 transition-transform duration-200" />
                  <span className="text-base font-medium">Logout</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};
