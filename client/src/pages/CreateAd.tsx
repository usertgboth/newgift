import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Plus, X, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAdmin } from "@/contexts/AdminContext";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useMutation, useQuery } from "@tanstack/react-query";
import tonLogo from "@assets/toncoin_1760893904370.png";
import GiftPickerModal from "@/components/GiftPickerModal";

interface Gift {
  id: string;
  name: string;
  image: string;
}

interface SelectedGift {
  giftId: string;
  quantity: number;
}

export default function CreateAd() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const { isAdmin } = useAdmin();
  const [isGiftPickerOpen, setIsGiftPickerOpen] = useState(false);
  const [adType, setAdType] = useState<"channel" | "guarantor">("channel");
  
  const [formData, setFormData] = useState({
    telegramLink: "",
    price: "",
  });

  const [selectedGifts, setSelectedGifts] = useState<SelectedGift[]>([]);
  const [telegramVerification, setTelegramVerification] = useState<{
    isVerifying: boolean;
    isVerified: boolean;
    hasGift: boolean;
    message: string;
  }>({
    isVerifying: false,
    isVerified: false,
    hasGift: false,
    message: ""
  });

  const { data: allGifts = [] } = useQuery<Gift[]>({
    queryKey: ["/api/gifts"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/gifts");
      return res.json();
    },
  });

  // Filter gifts based on type
  const gifts = allGifts.filter((gift: any) => {
    if (adType === "guarantor") {
      return gift.category === "guarantor";
    } else {
      return gift.category === "regular" || !gift.category;
    }
  });

  const createChannelMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/channels", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/channels"] });
      toast({
        title: t.toast.success,
        description: t.toast.channelCreated,
      });
      navigate("/");
    },
    onError: () => {
      toast({
        title: t.toast.error,
        description: t.toast.failedToCreate,
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    // Clear selected gifts when switching type
    setSelectedGifts([]);
  }, [adType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedGifts.length === 0 || !formData.price) {
      toast({
        title: t.toast.error,
        description: t.toast.fillAllFields,
        variant: "destructive",
      });
      return;
    }

    if (adType === "channel" && !formData.telegramLink) {
      toast({
        title: t.toast.error,
        description: t.toast.fillAllFields,
        variant: "destructive",
      });
      return;
    }

    if (!isAdmin && adType === "channel" && !telegramVerification.isVerified) {
      toast({
        title: t.toast.warning,
        description: t.toast.verificationRequired,
        variant: "destructive",
      });
      return;
    }

    // Extract channel name from telegram link (only for channel type)
    let channelName = null;
    if (adType === "channel") {
      const channelMatch = formData.telegramLink.match(/t\.me\/([a-zA-Z0-9_]+)/);
      channelName = channelMatch ? channelMatch[1] : "Unknown Channel";
    }

    const submitData = {
      ...formData,
      type: adType,
      channelName,
      giftId: selectedGifts[0].giftId,
      gifts: JSON.stringify(selectedGifts),
    };

    createChannelMutation.mutate(submitData);
  };

  const addGift = (giftId: string) => {
    if (selectedGifts.find(g => g.giftId === giftId)) {
      toast({
        title: t.toast.warning,
        description: t.toast.giftAlreadyAdded,
        variant: "destructive",
      });
      return;
    }
    
    setSelectedGifts([...selectedGifts, { giftId, quantity: 1 }]);
    setIsGiftPickerOpen(false);
  };

  const removeGift = (giftId: string) => {
    setSelectedGifts(selectedGifts.filter(g => g.giftId !== giftId));
  };

  const updateQuantity = (giftId: string, quantity: number) => {
    if (quantity < 1) return;
    setSelectedGifts(selectedGifts.map(g => 
      g.giftId === giftId ? { ...g, quantity } : g
    ));
  };

  const verifyTelegramChannel = async () => {
    if (!formData.telegramLink || selectedGifts.length === 0) {
      toast({
        title: t.toast.warning,
        description: t.toast.enterTelegramLink,
        variant: "destructive",
      });
      return;
    }

    setTelegramVerification(prev => ({ ...prev, isVerifying: true }));

    try {
      const response = await apiRequest("POST", "/api/verify-telegram", {
        telegramLink: formData.telegramLink,
        giftName: selectedGifts[0].giftId // Use first selected gift
      });
      
      const result = await response.json();
      
      setTelegramVerification({
        isVerifying: false,
        isVerified: result.channelValid,
        hasGift: result.hasGift,
        message: result.message
      });

      toast({
        title: result.channelValid ? t.toast.channelVerified : t.toast.verificationFailed,
        description: result.message,
        variant: result.channelValid ? "default" : "destructive",
      });
    } catch (error) {
      setTelegramVerification(prev => ({ ...prev, isVerifying: false }));
      toast({
        title: t.toast.error,
        description: t.toast.failedToVerify,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="h-screen bg-background text-foreground flex flex-col overflow-hidden">
      <header className="sticky top-0 z-50 flex items-center gap-3 px-4 py-3 bg-background border-b border-border flex-shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className="hover-elevate"
          onClick={() => navigate("/")}
          data-testid="button-back"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-semibold">{t.createAd.title}</h1>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-6">
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-6">
          <h3 className="text-sm font-semibold text-blue-400 mb-3">{t.createAd.importantInfo}</h3>
          <div className="space-y-2 text-xs text-blue-200/80">
            <p className="font-medium">{t.createAd.beforeAdding}</p>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>{t.createAd.step1}</li>
              <li>{t.createAd.step2}</li>
            </ol>
            <p className="font-medium mt-3">{t.createAd.makeSure}</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>{t.createAd.cloudPassword}</li>
              <li>{t.createAd.sessionActive}</li>
              <li>{t.createAd.giftsNotHidden}</li>
            </ul>
          </div>
        </div>

        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-6">
          <h3 className="text-sm font-semibold text-green-400 mb-2">
            {language === 'ru' ? '🎉 Тестовая система' : '🎉 Test System'}
          </h3>
          <p className="text-xs text-green-200/80">
            {language === 'ru' 
              ? 'После создания объявления, через 30 секунд автоматически будет создана тестовая покупка. Вы получите уведомление как продавец, а тестовый покупатель (админ) получит уведомление как покупатель. Проверьте вкладку "Мои объявления" через 30 секунд после создания!'
              : 'After creating an ad, a test purchase will be automatically created in 30 seconds. You will receive a notification as a seller, and the test buyer (admin) will receive a notification as a buyer. Check the "My Ads" tab 30 seconds after creation!'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-4 space-y-6 pb-6">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">
            {language === 'ru' ? 'Тип объявления' : 'Ad Type'} *
          </Label>
          <div className="flex gap-2">
            <Button
              type="button"
              variant={adType === "channel" ? "default" : "outline"}
              className="flex-1"
              onClick={() => setAdType("channel")}
              data-testid="button-type-channel"
            >
              {t.home.typeChannel}
            </Button>
            <Button
              type="button"
              variant={adType === "guarantor" ? "default" : "outline"}
              className="flex-1"
              onClick={() => setAdType("guarantor")}
              data-testid="button-type-guarantor"
            >
              {t.home.typeGuarantor}
            </Button>
          </div>
        </div>

        {adType === "channel" && (
          <div className="space-y-2">
            <Label htmlFor="telegramLink" className="text-sm font-medium text-foreground">
              {t.createAd.telegramLink} *
            </Label>
            <Input
              id="telegramLink"
              value={formData.telegramLink}
              onChange={(e) => setFormData({ ...formData, telegramLink: e.target.value })}
              placeholder="@channel, channel или https://t.me/channel"
              className="bg-card border-card-border text-foreground"
              data-testid="input-telegram-link"
            />
            
            {/* Verification Status */}
            {telegramVerification.message && (
              <div className={`flex items-center gap-2 p-3 rounded-lg ${
                telegramVerification.isVerified 
                  ? 'bg-green-500/10 border border-green-500/20' 
                  : 'bg-red-500/10 border border-red-500/20'
              }`}>
                {telegramVerification.isVerified ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-500" />
                )}
                <span className={`text-sm ${
                  telegramVerification.isVerified ? 'text-green-600' : 'text-red-600'
                }`}>
                  {telegramVerification.message}
                </span>
              </div>
            )}
          </div>
        )}

        <div className="space-y-3">
          <Label className="text-sm font-medium text-foreground">
            {t.createAd.gifts} *
          </Label>
          
          {selectedGifts.map((selected) => {
            const gift = gifts.find(g => g.id === selected.giftId);
            if (!gift) return null;
            
            return (
              <div 
                key={selected.giftId}
                className="flex items-center gap-3 p-3 bg-zinc-900/30 border border-zinc-800/50 rounded-lg"
              >
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-white flex-shrink-0">
                  <img
                    src={gift.image}
                    alt={gift.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{gift.name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor={`quantity-${gift.id}`} className="text-xs text-zinc-400 whitespace-nowrap">
                    Qty:
                  </Label>
                  <Input
                    id={`quantity-${gift.id}`}
                    type="number"
                    min="1"
                    value={selected.quantity}
                    onChange={(e) => updateQuantity(selected.giftId, parseInt(e.target.value) || 1)}
                    className="w-16 h-8 text-center bg-zinc-800/50 border-zinc-700/50 text-sm"
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 flex-shrink-0"
                  onClick={() => removeGift(selected.giftId)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            );
          })}

          <button
            type="button"
            onClick={() => setIsGiftPickerOpen(true)}
            className="w-full flex items-center justify-center gap-2 p-4 bg-zinc-900/30 border border-zinc-800/50 border-dashed rounded-lg hover:bg-zinc-900/50 hover:border-zinc-700/70 transition-all text-zinc-400 hover:text-zinc-300"
            data-testid="button-add-gift"
          >
            <Plus className="w-5 h-5" />
            <span>{t.createAd.addGift}</span>
          </button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="price" className="text-sm font-medium text-foreground">
            {t.createAd.price} *
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
          {formData.price && parseFloat(formData.price) > 0 && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
              <span className="text-xs text-muted-foreground">🎁 {t.home.cashback} 7.5%</span>
              <div className="flex items-center gap-1.5">
                <img src={tonLogo} alt="TON" className="w-3.5 h-3.5 rounded-full" />
                <span className="text-sm font-bold text-blue-500">
                  +{(parseFloat(formData.price) * 0.075).toFixed(2)}
                </span>
                <span className="text-xs text-muted-foreground">TON</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => navigate("/")}
            data-testid="button-cancel"
          >
            {t.createAd.cancel}
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-primary hover-elevate active-elevate-2"
            disabled={createChannelMutation.isPending || (adType === "channel" && !telegramVerification.isVerified)}
            data-testid="button-submit"
          >
            {createChannelMutation.isPending ? t.createAd.creating : 
             (adType === "channel" && !telegramVerification.isVerified) ? t.createAd.verifyFirst : t.createAd.create}
          </Button>
        </div>
      </form>

      <GiftPickerModal
          open={isGiftPickerOpen}
          onClose={() => setIsGiftPickerOpen(false)}
          gifts={gifts}
          selectedGiftIds={selectedGifts.map(g => g.giftId)}
          onSelectGifts={(giftIds) => {
            setSelectedGifts(giftIds.map(id => ({ giftId: id, quantity: 1 })));
            setIsGiftPickerOpen(false);
          }}
        />
      </div>
    </div>
  );
}
