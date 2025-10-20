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
      <div className="px-4 py-3">
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full flex items-center justify-between p-3 bg-card border border-card-border rounded-lg hover:bg-card/80 transition-colors"
          data-testid="button-select-filter"
        >
          <div className="flex items-center gap-2">
            {selectedGift ? (
              <>
                <div className="w-6 h-6 rounded overflow-hidden bg-white">
                  <img
                    src={selectedGift.image}
                    alt={selectedGift.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-sm text-foreground">{selectedGift.name}</span>
              </>
            ) : (
              <span className="text-sm text-foreground">Все подарки</span>
            )}
          </div>
          <span className="text-muted-foreground">›</span>
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
