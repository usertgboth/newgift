import { Search, ArrowUpDown } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { type SortOption } from "./SortPanel";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SearchBarProps {
  onSearchChange?: (query: string) => void;
  onSortChange?: (sort: SortOption) => void;
}

export default function SearchBar({ onSearchChange, onSortChange }: SearchBarProps) {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("newest");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearchChange?.(value);
  };

  const handleSortChange = (sort: SortOption) => {
    setSortOption(sort);
    onSortChange?.(sort);
  };

  const sortLabels = {
    newest: t.home.sortNewest,
    "price-low": t.home.sortCheapest,
    "price-high": t.home.sortExpensive,
  };

  return (
    <div className="px-3 sm:px-4 pb-3">
      <div className="flex gap-2">
        <div className="relative flex-1 bg-card/50 border border-card-border rounded-xl hover:bg-card/80 transition-all duration-200">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground/60 pointer-events-none z-10" />
          <input
            type="text"
            inputMode="search"
            placeholder={t.home.searchPlaceholder}
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full h-11 sm:h-12 pl-10 sm:pl-12 pr-4 text-sm sm:text-base bg-transparent text-foreground placeholder:text-muted-foreground/70 focus:outline-none appearance-none"
            data-testid="input-search"
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="flex items-center justify-center w-11 sm:w-12 h-11 sm:h-12 bg-card border border-card-border rounded-xl hover:bg-card/80 transition-all"
              data-testid="button-sort-menu"
            >
              <ArrowUpDown className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem
              onClick={() => handleSortChange("newest")}
              className={sortOption === "newest" ? "bg-blue-500 text-white" : ""}
              data-testid="sort-option-newest"
            >
              {t.home.sortNewest}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleSortChange("price-low")}
              className={sortOption === "price-low" ? "bg-blue-500 text-white" : ""}
              data-testid="sort-option-price-low"
            >
              {t.home.sortCheapest}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleSortChange("price-high")}
              className={sortOption === "price-high" ? "bg-blue-500 text-white" : ""}
              data-testid="sort-option-price-high"
            >
              {t.home.sortExpensive}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}