import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/theme-context";

/**
 * Theme toggle component for sidebar
 */
export const SidebarThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="px-2 py-2 border-t border-gray-200/20 dark:border-white/10">
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs font-semibold text-gray-700 dark:text-gray-300">
          Theme
        </div>
        <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
      </div>
      <div className="grid grid-cols-2 gap-1 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-600 rounded-xl p-1 shadow-inner">
        <button
          onClick={() => setTheme("light")}
          className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-md transition-all duration-300 group ${
            theme === "light"
              ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-lg border border-blue-200/50 dark:border-blue-500/30 scale-105"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-white/50 dark:hover:bg-slate-600/50 hover:scale-105"
          }`}
          title="Light Mode"
        >
          <Sun
            className={`w-3 h-3 mb-1 transition-all duration-300 ${
              theme === "light"
                ? "text-yellow-500 dark:text-yellow-400"
                : "group-hover:text-yellow-500 dark:group-hover:text-yellow-400"
            }`}
          />
          <span className="text-xs font-medium">Light</span>
        </button>
        <button
          onClick={() => setTheme("dark")}
          className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-md transition-all duration-300 group ${
            theme === "dark"
              ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-lg border border-blue-200/50 dark:border-blue-500/30 scale-105"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-white/50 dark:hover:bg-slate-600/50 hover:scale-105"
          }`}
          title="Dark Mode"
        >
          <Moon
            className={`w-3 h-3 mb-1 transition-all duration-300 ${
              theme === "dark"
                ? "text-indigo-500 dark:text-indigo-400"
                : "group-hover:text-indigo-500 dark:group-hover:text-indigo-400"
            }`}
          />
          <span className="text-xs font-medium">Dark</span>
        </button>
      </div>
    </div>
  );
};
