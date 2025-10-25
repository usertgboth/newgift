
import { useState, useEffect } from "react";
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
    setLocalSelectedIds(selectedGiftIds);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] p-0 bg-card border-card-border rounded-3xl overflow-hidden">
        <DialogHeader className="px-5 pt-5 pb-3 border-b border-border/50 bg-gradient-to-b from-background to-background/50">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <DialogTitle className="text-foreground text-xl font-bold mb-1">
                🎁 Оберіть подарунки
              </DialogTitle>
              <DialogDescription className="text-muted-foreground text-sm">
                {localSelectedIds.length > 0 
                  ? `Обрано ${localSelectedIds.length} ${localSelectedIds.length === 1 ? 'подарунок' : 'подарунки'}`
                  : 'Виберіть один або кілька подарунків'
                }
              </DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCancel}
              className="w-9 h-9 rounded-full hover:bg-muted/80 flex-shrink-0"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </Button>
          </div>
        </DialogHeader>

        <div className="px-5 py-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Пошук подарунків..."
              className="w-full h-12 pl-12 pr-4 text-sm bg-muted/30 border border-border/50 rounded-2xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:bg-muted/50 transition-all duration-200"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-5 max-h-[55vh]">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleToggleGift("")}
              className={`relative overflow-hidden rounded-2xl transition-all duration-200 active:scale-95 ${
                localSelectedIds.length === 0
                  ? "ring-2 ring-primary shadow-lg"
                  : "hover:shadow-md"
              }`}
            >
              <div className="aspect-square bg-gradient-to-br from-primary/10 to-primary/5 flex flex-col items-center justify-center p-4 border border-border/50">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-3 shadow-sm">
                  <span className="text-3xl">🎁</span>
                </div>
                <span className="text-foreground font-semibold text-sm">Всі подарунки</span>
                <p className="text-muted-foreground text-xs mt-1">Скинути фільтр</p>
              </div>
              {localSelectedIds.length === 0 && (
                <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-primary flex items-center justify-center shadow-lg">
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
              )}
            </button>

            {filteredGifts.map((gift) => (
              <button
                key={gift.id}
                onClick={() => handleToggleGift(gift.id)}
                className={`relative overflow-hidden rounded-2xl transition-all duration-200 active:scale-95 ${
                  localSelectedIds.includes(gift.id)
                    ? "ring-2 ring-primary shadow-lg"
                    : "hover:shadow-md"
                }`}
              >
                <div className="aspect-square bg-white border border-border/50">
                  <img
                    src={gift.image}
                    alt={gift.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent p-3 pt-8">
                  <span className="text-white font-semibold text-sm line-clamp-2 drop-shadow-lg">
                    {gift.name}
                  </span>
                </div>
                {localSelectedIds.includes(gift.id) && (
                  <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-primary flex items-center justify-center shadow-lg">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                )}
              </button>
            ))}

            {filteredGifts.length === 0 && searchQuery && (
              <div className="col-span-2 text-center py-12">
                <div className="w-20 h-20 bg-muted/50 rounded-3xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">🔍</span>
                </div>
                <p className="text-muted-foreground text-base font-medium">Нічого не знайдено</p>
                <p className="text-muted-foreground text-sm mt-2">Спробуйте інший запит</p>
              </div>
            )}
          </div>
        </div>

        <div className="px-5 pb-5 pt-3 border-t border-border/50 bg-gradient-to-t from-background to-background/50">
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="flex-1 h-12 rounded-2xl border-border/50 hover:bg-muted/50 font-medium"
            >
              Скасувати
            </Button>
            <Button
              onClick={handleApply}
              className="flex-1 h-12 rounded-2xl bg-primary hover:bg-primary/90 font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Застосувати {localSelectedIds.length > 0 && `(${localSelectedIds.length})`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
