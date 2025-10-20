import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useMutation, useQuery } from "@tanstack/react-query";
import tonLogo from "@assets/toncoin_1760893904370.png";
import GiftPickerModal from "@/components/GiftPickerModal";

interface Gift {
  id: string;
  name: string;
  image: string;
}

export default function CreateAd() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isGiftPickerOpen, setIsGiftPickerOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    channelName: "",
    telegramLink: "",
    giftId: "",
    price: "",
  });

  const { data: gifts = [] } = useQuery<Gift[]>({
    queryKey: ["/api/gifts"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/gifts");
      return res.json();
    },
  });

  useEffect(() => {
    if (gifts.length > 0 && !formData.giftId) {
      setFormData(prev => ({ ...prev, giftId: gifts[0].id }));
    }
  }, [gifts, formData.giftId]);

  const createChannelMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await apiRequest("POST", "/api/channels", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/channels"] });
      toast({
        title: "Успешно!",
        description: "Канал создан",
      });
      navigate("/");
    },
    onError: () => {
      toast({
        title: "Ошибка",
        description: "Не удалось создать канал",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.channelName || !formData.telegramLink || !formData.giftId || !formData.price) {
      toast({
        title: "Ошибка",
        description: "Заполните все обязательные поля",
        variant: "destructive",
      });
      return;
    }

    createChannelMutation.mutate(formData);
  };

  const selectedGift = gifts.find(g => g.id === formData.giftId);

  return (
    <div className="min-h-screen bg-background text-foreground pb-6">
      <header className="sticky top-0 z-50 flex items-center gap-3 px-4 py-3 bg-background border-b border-border">
        <Button
          variant="ghost"
          size="icon"
          className="hover-elevate"
          onClick={() => navigate("/")}
          data-testid="button-back"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-semibold">Создать канал</h1>
      </header>

      <form onSubmit={handleSubmit} className="px-4 py-6 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="channelName" className="text-sm font-medium text-foreground">
            Название канала *
          </Label>
          <Input
            id="channelName"
            value={formData.channelName}
            onChange={(e) => setFormData({ ...formData, channelName: e.target.value })}
            placeholder="Например: Магазин подарков"
            className="bg-card border-card-border text-foreground"
            data-testid="input-channel-name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="telegramLink" className="text-sm font-medium text-foreground">
            Ссылка на Telegram канал *
          </Label>
          <Input
            id="telegramLink"
            value={formData.telegramLink}
            onChange={(e) => setFormData({ ...formData, telegramLink: e.target.value })}
            placeholder="https://t.me/your_channel"
            className="bg-card border-card-border text-foreground"
            data-testid="input-telegram-link"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">
            Выберите подарок *
          </Label>
          <button
            type="button"
            onClick={() => setIsGiftPickerOpen(true)}
            className="w-full flex items-center justify-between p-4 bg-card border border-card-border rounded-lg hover:bg-card/80 transition-colors"
            data-testid="button-select-gift"
          >
            {selectedGift ? (
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-white">
                  <img
                    src={selectedGift.image}
                    alt={selectedGift.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-foreground">{selectedGift.name}</span>
              </div>
            ) : (
              <span className="text-muted-foreground">Выберите подарок</span>
            )}
            <span className="text-muted-foreground">›</span>
          </button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="price" className="text-sm font-medium text-foreground">
            Цена (TON) *
          </Label>
          <div className="relative">
            <Input
              id="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="0.00"
              className="bg-card border-card-border text-foreground pr-20"
              data-testid="input-price"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              <img src={tonLogo} alt="TON" className="w-4 h-4 rounded-full object-cover" />
              <span className="text-sm text-muted-foreground">TON</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => navigate("/")}
            data-testid="button-cancel"
          >
            Отмена
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-primary hover-elevate active-elevate-2"
            disabled={createChannelMutation.isPending}
            data-testid="button-submit"
          >
            {createChannelMutation.isPending ? "Создание..." : "Создать"}
          </Button>
        </div>
      </form>

      <GiftPickerModal
        open={isGiftPickerOpen}
        onClose={() => setIsGiftPickerOpen(false)}
        gifts={gifts}
        selectedGiftId={formData.giftId}
        onSelectGift={(giftId) => setFormData({ ...formData, giftId })}
      />
    </div>
  );
}
