import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import tonLogo from "@assets/toncoin_1760893904370.png";

export default function TopHeader() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 bg-background border-b border-border">
      <div className="text-sm font-semibold text-foreground" data-testid="text-title">
        LootGifts
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20" data-testid="display-balance">
          <img src={tonLogo} alt="TON" className="w-5 h-5 rounded-full object-cover" />
          <span className="text-sm font-semibold text-foreground">0 TON</span>
        </div>
        <Button
          size="icon"
          className="w-7 h-7 rounded-full bg-primary hover-elevate active-elevate-2"
          data-testid="button-add-balance"
          onClick={() => console.log('Add balance clicked')}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
}
