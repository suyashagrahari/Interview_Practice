import React from "react";
import { Search } from "lucide-react";
import SearchSuggestions from "@/components/ui/search-suggestions";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  showSuggestions?: boolean;
  onSuggestionClick?: (suggestion: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = "Search...",
  showSuggestions = false,
  onSuggestionClick,
  onFocus,
  onBlur,
}) => {
  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        className="w-full pl-12 pr-4 py-4 bg-white/80 dark:bg-white/10 border border-gray-200/50 dark:border-white/20 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm shadow-lg"
      />
      {showSuggestions && onSuggestionClick && (
        <SearchSuggestions
          isVisible={showSuggestions}
          searchQuery={value}
          onSuggestionClick={onSuggestionClick}
        />
      )}
    </div>
  );
};
