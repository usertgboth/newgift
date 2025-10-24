import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import tonLogo from "@assets/toncoin_1760893904370.png";

export default function TopHeader() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-3 sm:px-4 py-3 sm:py-4 bg-background/95 backdrop-blur-sm border-b border-border/50">
      <div className="text-base sm:text-lg font-bold text-foreground" data-testid="text-title">
        🎁 LootGifts
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/10 border border-primary/20" data-testid="display-balance">
          <img src={tonLogo} alt="TON" className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover" />
          <span className="text-xs sm:text-sm font-semibold text-foreground">0 TON</span>
        </div>
        <Button
          size="icon"
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary hover-elevate active-elevate-2 shadow-lg"
          data-testid="button-add-balance"
          onClick={() => console.log('Add balance clicked')}
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
        </Button>
      </div>
    </header>
  );
}
