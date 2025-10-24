import { Search } from "lucide-react";
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
    <div className="px-3 sm:px-4 pb-3">
      <div className="relative flex items-center">
        <Search className="absolute left-3 sm:left-4 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search gifts..."
          className="w-full h-10 sm:h-11 pl-10 sm:pl-12 pr-3 sm:pr-4 text-sm bg-card/50 border border-card-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:bg-card/80 transition-all duration-200"
          data-testid="input-search"
        />
      </div>
    </div>
  );
}
