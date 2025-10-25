import { Search, X } from "lucide-react";
import { useState } from "react";

interface SearchBarProps {
  onSearchChange?: (query: string) => void;
}

export default function SearchBar({ onSearchChange }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearchChange?.(value);
    console.log('Search query:', value);
  };

  return (
    <div className="px-3 sm:px-4 py-2 sm:py-3 animate-in fade-in-0 slide-in-from-top duration-500" style={{ animationDelay: '200ms' }}>
      <div className="relative group">
        <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground transition-all duration-300 group-focus-within:text-primary group-focus-within:scale-110" />
        <input
          type="search"
          placeholder="Search channels or gifts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 text-sm sm:text-base transition-all duration-300 placeholder:text-muted-foreground hover:bg-muted/70 focus:shadow-lg focus:shadow-primary/10"
          data-testid="input-search"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full transition-all duration-300 hover:rotate-90 hover:scale-110 animate-in zoom-in-0 duration-200"
            aria-label="Clear search"
          >
            <X className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors duration-200" />
          </button>
        )}
      </div>
    </div>
  );
}