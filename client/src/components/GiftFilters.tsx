import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { GIFT_MODELS, GIFT_BACKGROUNDS, type GiftModel, type GiftBackground } from "@shared/gifts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface GiftFiltersProps {
  selectedModel: GiftModel | null;
  selectedBackground: GiftBackground | null;
  onModelChange: (model: GiftModel | null) => void;
  onBackgroundChange: (background: GiftBackground | null) => void;
}

export default function GiftFilters({
  selectedModel,
  selectedBackground,
  onModelChange,
  onBackgroundChange,
}: GiftFiltersProps) {
  return (
    <div className="px-3 sm:px-4 pb-3">
      <div className="flex gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="flex-1 flex items-center justify-between px-4 py-2.5 bg-card/50 border border-card-border rounded-xl hover:bg-card/80 transition-all duration-200"
              data-testid="button-model-filter"
            >
              <span className="text-sm sm:text-base font-medium text-foreground truncate">
                {selectedModel || "All Models"}
              </span>
              <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0 ml-2" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56 max-h-64 overflow-y-auto">
            <DropdownMenuItem
              onClick={() => onModelChange(null)}
              className={!selectedModel ? "bg-blue-500 text-white" : ""}
              data-testid="model-option-all"
            >
              All Models
            </DropdownMenuItem>
            {GIFT_MODELS.map((model) => (
              <DropdownMenuItem
                key={model}
                onClick={() => onModelChange(model)}
                className={selectedModel === model ? "bg-blue-500 text-white" : ""}
                data-testid={`model-option-${model.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {model}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="flex-1 flex items-center justify-between px-4 py-2.5 bg-card/50 border border-card-border rounded-xl hover:bg-card/80 transition-all duration-200"
              data-testid="button-background-filter"
            >
              <span className="text-sm sm:text-base font-medium text-foreground truncate">
                {selectedBackground || "All Patterns"}
              </span>
              <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0 ml-2" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 max-h-64 overflow-y-auto">
            <DropdownMenuItem
              onClick={() => onBackgroundChange(null)}
              className={!selectedBackground ? "bg-blue-500 text-white" : ""}
              data-testid="background-option-all"
            >
              All Patterns
            </DropdownMenuItem>
            {GIFT_BACKGROUNDS.map((background) => (
              <DropdownMenuItem
                key={background}
                onClick={() => onBackgroundChange(background)}
                className={selectedBackground === background ? "bg-blue-500 text-white" : ""}
                data-testid={`background-option-${background.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {background}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
