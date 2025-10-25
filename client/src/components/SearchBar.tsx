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
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground/60 pointer-events-none z-10" />
        <input
          type="text"
          inputMode="search"
          placeholder={t.home.searchPlaceholder}
          value={searchQuery}
          onChange={(e) => onSearchChange?.(e.target.value)}
          className="w-full h-11 sm:h-12 pl-10 sm:pl-12 pr-4 text-sm sm:text-base bg-card/50 border border-card-border rounded-xl text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:border-primary/50 focus:bg-card/80 transition-all duration-200 appearance-none"
          data-testid="input-search"
        />
      </div>
    </div>
  );
}