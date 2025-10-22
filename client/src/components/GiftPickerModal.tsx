import { useState } from "react";
import { Search, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Gift {
  id: string;
  name: string;
  image: string;
}

interface GiftPickerModalProps {
  open: boolean;
  onClose: () => void;
  gifts: Gift[];
  selectedGiftId?: string;
  onSelectGift: (giftId: string) => void;
}

export default function GiftPickerModal({
  open,
  onClose,
  gifts,
  selectedGiftId,
  onSelectGift,
}: GiftPickerModalProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredGifts = gifts.filter((gift) =>
    gift.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (giftId: string) => {
    onSelectGift(giftId);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[85vh] p-0 bg-card border-card-border rounded-2xl">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-foreground text-xl font-bold">
              🎁 Select Gift
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="w-10 h-10 rounded-full hover:bg-muted"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </Button>
          </div>
          <DialogDescription className="text-muted-foreground text-sm mt-1">
            Choose a gift from the list or search by name
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search gifts..."
              className="w-full h-12 pl-12 pr-4 text-sm bg-muted/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:bg-muted/80 transition-all duration-200"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-6 max-h-[50vh] scroll-smooth">
          <div className="space-y-3">
            <button
              onClick={() => handleSelect("")}
              className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-200 active:scale-[0.98] ${
                !selectedGiftId
                  ? "bg-primary/10 border-2 border-primary/30"
                  : "hover:bg-muted/50 border-2 border-transparent"
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center shadow-sm">
                <span className="text-2xl">🎁</span>
              </div>
              <div className="flex-1 text-left">
                <span className="text-foreground font-medium text-sm">All Gifts</span>
                <p className="text-muted-foreground text-xs mt-1">Show all available gifts</p>
              </div>
              {!selectedGiftId && (
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
            </button>

            {filteredGifts.map((gift) => (
              <button
                key={gift.id}
                onClick={() => handleSelect(gift.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-200 active:scale-[0.98] ${
                  selectedGiftId === gift.id
                    ? "bg-primary/10 border-2 border-primary/30"
                    : "hover:bg-muted/50 border-2 border-transparent"
                }`}
              >
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-white shadow-sm">
                  <img
                    src={gift.image}
                    alt={gift.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 text-left">
                  <span className="text-foreground font-medium text-sm">{gift.name}</span>
                  <p className="text-muted-foreground text-xs mt-1">Tap to select</p>
                </div>
                {selectedGiftId === gift.id && (
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </button>
            ))}

            {filteredGifts.length === 0 && searchQuery && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔍</span>
                </div>
                <p className="text-muted-foreground text-sm">No gifts found</p>
                <p className="text-muted-foreground text-xs mt-1">Try a different search query</p>
              </div>
            )}
          </div>
        </div>

        <div className="px-6 pb-6 pt-4 border-t border-border bg-background sticky bottom-0">
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 h-12 rounded-xl border-border hover:bg-muted/50"
            >
              Cancel
            </Button>
            <Button
              onClick={() => selectedGiftId && handleSelect(selectedGiftId)}
              className="flex-1 h-12 rounded-xl bg-primary hover:bg-primary/90"
              disabled={!selectedGiftId}
            >
              Select
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
