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
      <DialogContent className="max-w-md max-h-[80vh] p-0 bg-[#1a1a2e] border-[#2a2a3e]">
        <DialogHeader className="px-4 pt-4 pb-2 border-b border-[#2a2a3e]">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-white text-lg">
              Выберите вид подарка
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="hover:bg-[#2a2a3e]"
            >
              <X className="w-5 h-5 text-white" />
            </Button>
          </div>
          <DialogDescription className="sr-only">
            Выберите подарок из списка или найдите его по названию
          </DialogDescription>
        </DialogHeader>

        <div className="px-4 py-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск"
              className="w-full h-10 pl-10 pr-4 text-sm bg-[#2a2a3e] border border-[#3a3a4e] rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-4 max-h-[50vh]">
          <div className="space-y-2">
            <button
              onClick={() => handleSelect("")}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                !selectedGiftId
                  ? "bg-[#2a2a3e]"
                  : "hover:bg-[#2a2a3e]"
              }`}
            >
              <div className="w-10 h-10 rounded-lg bg-[#3a3a4e] flex items-center justify-center">
                <span className="text-xl">🎁</span>
              </div>
              <span className="text-white text-sm">Все подарки</span>
            </button>

            {filteredGifts.map((gift) => (
              <button
                key={gift.id}
                onClick={() => handleSelect(gift.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  selectedGiftId === gift.id
                    ? "bg-[#2a2a3e]"
                    : "hover:bg-[#2a2a3e]"
                }`}
              >
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-white">
                  <img
                    src={gift.image}
                    alt={gift.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-white text-sm">{gift.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="px-4 pb-4 pt-2 border-t border-[#2a2a3e] flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 bg-transparent border-[#3a3a4e] text-white hover:bg-[#2a2a3e]"
          >
            Отмена
          </Button>
          <Button
            onClick={() => selectedGiftId && handleSelect(selectedGiftId)}
            className="flex-1 bg-primary hover:bg-primary/90"
            disabled={!selectedGiftId}
          >
            Выбрать
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
