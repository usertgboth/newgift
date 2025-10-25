import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import GiftPickerModal from "./GiftPickerModal";
import { useLanguage } from "@/contexts/LanguageContext";

interface Gift {
  id: string;
  name: string;
  image: string;
}

interface FilterBarProps {
  onGiftFilterChange?: (giftIds: string[]) => void;
}

export default function FilterBar({ onGiftFilterChange }: FilterBarProps) {
  const { t } = useLanguage();
  const [selectedGiftIds, setSelectedGiftIds] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: gifts = [] } = useQuery<Gift[]>({
    queryKey: ["/api/gifts"],
    queryFn: async () => {
      const res = await fetch("/api/gifts");
      return res.json();
    },
  });

  const selectedGifts = gifts.filter((g) => selectedGiftIds.includes(g.id));

  const handleGiftSelect = (giftIds: string[]) => {
    setSelectedGiftIds(giftIds);
    onGiftFilterChange?.(giftIds);
  };

  return (
    <>
      <div className="px-3 sm:px-4 py-2">
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full flex items-center justify-between p-3 sm:p-3.5 bg-card/50 border border-card-border rounded-xl hover:bg-card/80 active:scale-[0.98] transition-all duration-200"
          data-testid="button-select-filter"
        >
          <div className="flex items-center gap-2.5 sm:gap-3 flex-1 min-w-0">
            {selectedGifts.length > 0 ? (
              <>
                <div className="flex -space-x-2 flex-shrink-0">
                  {selectedGifts.slice(0, 3).map((gift) => (
                    <div key={gift.id} className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg overflow-hidden bg-white shadow-sm border-2 border-background">
                      <img
                        src={gift.image}
                        alt={gift.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                  {selectedGifts.length > 3 && (
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-primary/20 flex items-center justify-center border-2 border-background">
                      <span className="text-xs font-bold text-primary">+{selectedGifts.length - 3}</span>
                    </div>
                  )}
                </div>
                <span className="text-xs sm:text-sm font-medium text-foreground truncate">
                  {t.home.giftsSelected(selectedGifts.length)}
                </span>
              </>
            ) : (
              <>
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-muted/50 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm sm:text-base">🎁</span>
                </div>
                <span className="text-xs sm:text-sm font-medium text-foreground">{t.home.selectGift}</span>
              </>
            )}
          </div>
          <span className="text-muted-foreground text-base flex-shrink-0">›</span>
        </button>
      </div>

      <GiftPickerModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        gifts={gifts}
        selectedGiftIds={selectedGiftIds}
        onSelectGifts={handleGiftSelect}
      />
    </>
  );
}
