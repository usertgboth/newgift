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
    <div className="px-4 pb-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Поиск по названию подарка"
          className="w-full h-10 pl-10 pr-4 text-sm bg-card border border-card-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          data-testid="input-search"
        />
      </div>
    </div>
  );
}
