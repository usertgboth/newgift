import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import GiftPickerModal from "./GiftPickerModal";

interface Gift {
  id: string;
  name: string;
  image: string;
}

interface FilterBarProps {
  onGiftFilterChange?: (giftId: string) => void;
}

export default function FilterBar({ onGiftFilterChange }: FilterBarProps) {
  const [selectedGiftId, setSelectedGiftId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: gifts = [] } = useQuery<Gift[]>({
    queryKey: ["/api/gifts"],
    queryFn: async () => {
      const res = await fetch("/api/gifts");
      return res.json();
    },
  });

  const selectedGift = gifts.find((g) => g.id === selectedGiftId);

  const handleGiftSelect = (giftId: string) => {
    setSelectedGiftId(giftId);
    onGiftFilterChange?.(giftId);
  };

  return (
    <>
      <div className="px-4 py-2">
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full flex items-center justify-between p-4 bg-card border border-card-border rounded-xl hover:bg-card/80 active:scale-[0.98] transition-all duration-200 shadow-sm"
          data-testid="button-select-filter"
        >
          <div className="flex items-center gap-3">
            {selectedGift ? (
              <>
                <div className="w-8 h-8 rounded-lg overflow-hidden bg-white shadow-sm">
                  <img
                    src={selectedGift.image}
                    alt={selectedGift.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-sm font-medium text-foreground">{selectedGift.name}</span>
              </>
            ) : (
              <>
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                  <span className="text-lg">🎁</span>
                </div>
                <span className="text-sm font-medium text-foreground">Select Gift</span>
              </>
            )}
          </div>
          <span className="text-muted-foreground text-lg">›</span>
        </button>
      </div>

      <GiftPickerModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        gifts={gifts}
        selectedGiftId={selectedGiftId}
        onSelectGift={handleGiftSelect}
      />
    </>
  );
}
