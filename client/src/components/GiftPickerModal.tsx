import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

interface Gift {
  id: string;
  name: string;
  image: string;
}

interface GiftPickerModalProps {
  open: boolean;
  onClose: () => void;
  gifts: Gift[];
  selectedGiftIds?: string[];
  onSelectGifts: (giftIds: string[]) => void;
}

export default function GiftPickerModal({
  open,
  onClose,
  gifts,
  selectedGiftIds = [],
  onSelectGifts,
}: GiftPickerModalProps) {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [localSelectedIds, setLocalSelectedIds] = useState<string[]>(selectedGiftIds);

  useEffect(() => {
    if (open) {
      setLocalSelectedIds(selectedGiftIds);
      setSearchQuery("");
    }
  }, [open, selectedGiftIds]);

  const filteredGifts = gifts.filter((gift) =>
    gift.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleGift = (giftId: string) => {
    if (giftId === "") {
      setLocalSelectedIds([]);
    } else {
      setLocalSelectedIds((prev) =>
        prev.includes(giftId)
          ? prev.filter((id) => id !== giftId)
          : [...prev, giftId]
      );
    }
  };

  const handleApply = () => {
    onSelectGifts(localSelectedIds);
    onClose();
  };

  const handleCancel = () => {
    setLocalSelectedIds([]);
    setSearchQuery("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(open) => { if (!open) return; handleCancel(); }}>
      <DialogContent className="max-w-[95vw] sm:max-w-md max-h-[90vh] p-0 bg-card border-card-border rounded-2xl mx-4">
        <DialogHeader className="px-4 sm:px-6 pt-5 sm:pt-6 pb-3 sm:pb-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-foreground text-lg sm:text-xl font-bold">
                🎁 {t.giftPicker.title}
              </DialogTitle>
              {localSelectedIds.length > 0 && (
                <span className="text-primary text-xs sm:text-sm font-medium mt-1 block">
                  {t.giftPicker.selected(localSelectedIds.length)}
                </span>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCancel}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full hover:bg-muted flex-shrink-0"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
            </Button>
          </div>
          <DialogDescription className="text-muted-foreground text-xs sm:text-sm mt-1.5">
            {t.giftPicker.description}
          </DialogDescription>
        </DialogHeader>

        <div className="px-4 sm:px-6 py-3 sm:py-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground/60 pointer-events-none z-10" />
            <input
              type="text"
              inputMode="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.giftPicker.searchPlaceholder}
              className="w-full h-11 sm:h-12 pl-8 sm:pl-10 pr-3 sm:pr-4 text-sm sm:text-base bg-muted/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:border-primary/50 focus:bg-muted/80 transition-all duration-200 appearance-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 sm:px-6 pb-4 sm:pb-6 max-h-[45vh] sm:max-h-[50vh] scroll-smooth">
          <div className="space-y-2.5 sm:space-y-3">
            <button
              onClick={() => handleToggleGift("")}
              className={`w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl transition-all duration-200 active:scale-[0.98] ${
                localSelectedIds.length === 0
                  ? "bg-primary/10 border-2 border-primary/30"
                  : "hover:bg-muted/50 border-2 border-transparent"
              }`}
            >
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-muted flex items-center justify-center shadow-sm flex-shrink-0">
                <span className="text-xl sm:text-2xl">🎁</span>
              </div>
              <div className="flex-1 text-left min-w-0">
                <span className="text-foreground font-medium text-sm block truncate">{t.giftPicker.allGifts}</span>
                <p className="text-muted-foreground text-xs mt-0.5 truncate">{t.giftPicker.clearFilters}</p>
              </div>
              {localSelectedIds.length === 0 && (
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-[10px] sm:text-xs">✓</span>
                </div>
              )}
            </button>

            {filteredGifts.map((gift) => (
              <button
                key={gift.id}
                onClick={() => handleToggleGift(gift.id)}
                className={`w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl transition-all duration-200 active:scale-[0.98] ${
                  localSelectedIds.includes(gift.id)
                    ? "bg-primary/10 border-2 border-primary/30"
                    : "hover:bg-muted/50 border-2 border-transparent"
                }`}
              >
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden bg-white shadow-sm flex-shrink-0">
                  <img
                    src={gift.image}
                    alt={gift.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <span className="text-foreground font-medium text-sm block truncate">{gift.name}</span>
                  <p className="text-muted-foreground text-xs mt-0.5 truncate">
                    {localSelectedIds.includes(gift.id) ? t.giftPicker.tapToRemove : t.giftPicker.tapToAdd}
                  </p>
                </div>
                {localSelectedIds.includes(gift.id) && (
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-[10px] sm:text-xs">✓</span>
                  </div>
                )}
              </button>
            ))}

            {filteredGifts.length === 0 && searchQuery && (
              <div className="text-center py-8">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <span className="text-xl sm:text-2xl">🔍</span>
                </div>
                <p className="text-muted-foreground text-sm">{t.giftPicker.noGiftsFound}</p>
                <p className="text-muted-foreground text-xs mt-1">{t.giftPicker.tryDifferentSearch}</p>
              </div>
            )}
          </div>
        </div>

        <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-3 sm:pt-4 border-t border-border bg-background sticky bottom-0">
          <div className="flex gap-2.5 sm:gap-3">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="flex-1 h-11 sm:h-12 rounded-xl border-border hover:bg-muted/50 text-sm"
            >
              {t.giftPicker.cancel}
            </Button>
            <Button
              onClick={handleApply}
              className="flex-1 h-11 sm:h-12 rounded-xl bg-primary hover:bg-primary/90 text-sm"
            >
              {t.giftPicker.apply} {localSelectedIds.length > 0 && `(${localSelectedIds.length})`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}