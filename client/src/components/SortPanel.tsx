import { ArrowUpDown, DollarSign, Clock } from "lucide-react";
import { useState } from "react";

export type SortOption = "newest" | "price-low" | "price-high";

interface SortPanelProps {
  onSortChange: (sort: SortOption) => void;
}

export default function SortPanel({ onSortChange }: SortPanelProps) {
  const [activeSort, setActiveSort] = useState<SortOption>("newest");

  const sortOptions = [
    { id: "newest" as SortOption, label: "Новые", icon: Clock },
    { id: "price-low" as SortOption, label: "Дешевые", icon: DollarSign },
    { id: "price-high" as SortOption, label: "Дорогие", icon: ArrowUpDown },
  ];

  const handleSortChange = (sort: SortOption) => {
    setActiveSort(sort);
    onSortChange(sort);
  };

  return (
    <div className="px-3 sm:px-4 pb-3">
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {sortOptions.map((option) => {
          const Icon = option.icon;
          return (
            <button
              key={option.id}
              onClick={() => handleSortChange(option.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                activeSort === option.id
                  ? "bg-blue-500 text-white"
                  : "bg-card border border-card-border text-muted-foreground hover:bg-card/80"
              }`}
              data-testid={`button-sort-${option.id}`}
            >
              <Icon className="w-3.5 h-3.5" />
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
