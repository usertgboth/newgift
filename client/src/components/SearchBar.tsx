import { Search } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface SearchBarProps {
  onSearchChange?: (query: string) => void;
}

export default function SearchBar({ onSearchChange }: SearchBarProps) {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearchChange?.(value);
    console.log('Search query:', value);
  };

  return (
    <div className="px-3 sm:px-4 pb-3">
      <div className="relative flex items-center">
        <Search className="absolute left-4 sm:left-5 w-5 h-5 text-slate-400 pointer-events-none transition-colors" />
        <input
          type="search"
          placeholder={t.home.searchPlaceholder}
          value={searchQuery}
          onChange={(e) => onSearchChange?.(e.target.value)}
          className="w-full h-12 sm:h-14 pl-12 sm:pl-14 pr-4 text-sm bg-gradient-to-r from-slate-900/80 to-slate-800/80 border border-white/10 rounded-2xl text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500/50 focus:bg-slate-900/90 transition-all duration-300 backdrop-blur-sm shadow-lg focus:shadow-blue-500/20"
          data-testid="input-search"
        />
      </div>
    </div>
  );
}