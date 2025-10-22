import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Plus, X, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
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

interface SelectedGift {
  giftId: string;
  quantity: number;
}

export default function CreateAd() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isGiftPickerOpen, setIsGiftPickerOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    channelName: "",
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

  const { data: gifts = [] } = useQuery<Gift[]>({
    queryKey: ["/api/gifts"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/gifts");
      return res.json();
    },
  });

  const createChannelMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/channels", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/channels"] });
      toast({
        title: "Success!",
        description: "Channel created",
      });
      navigate("/");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create channel",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.channelName || !formData.telegramLink || selectedGifts.length === 0 || !formData.price) {
      toast({
        title: "Error",
        description: "Please fill all required fields and add at least one gift",
        variant: "destructive",
      });
      return;
    }

    if (!telegramVerification.isVerified) {
      toast({
        title: "Verification Required",
        description: "Please verify your Telegram channel before creating the listing",
        variant: "destructive",
      });
      return;
    }

    const submitData = {
      ...formData,
      giftId: selectedGifts[0].giftId,
      gifts: JSON.stringify(selectedGifts),
    };

    createChannelMutation.mutate(submitData);
  };

  const addGift = (giftId: string) => {
    if (selectedGifts.find(g => g.giftId === giftId)) {
      toast({
        title: "Warning",
        description: "This gift is already added",
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
        title: "Warning",
        description: "Please enter Telegram link and select at least one gift",
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
        title: result.channelValid ? "Channel Verified" : "Verification Failed",
        description: result.message,
        variant: result.channelValid ? "default" : "destructive",
      });
    } catch (error) {
      setTelegramVerification(prev => ({ ...prev, isVerifying: false }));
      toast({
        title: "Error",
        description: "Failed to verify Telegram channel",
        variant: "destructive",
      });
    }
  };

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
        <h1 className="text-lg font-semibold">Create Channel</h1>
      </header>

      <form onSubmit={handleSubmit} className="px-4 py-6 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="channelName" className="text-sm font-medium text-foreground">
            Channel Name *
          </Label>
          <Input
            id="channelName"
            value={formData.channelName}
            onChange={(e) => setFormData({ ...formData, channelName: e.target.value })}
            placeholder="e.g. Gift Shop"
            className="bg-card border-card-border text-foreground"
            data-testid="input-channel-name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="telegramLink" className="text-sm font-medium text-foreground">
            Telegram Channel Link *
          </Label>
          <div className="flex gap-2">
            <Input
              id="telegramLink"
              value={formData.telegramLink}
              onChange={(e) => setFormData({ ...formData, telegramLink: e.target.value })}
              placeholder="https://t.me/your_channel"
              className="bg-card border-card-border text-foreground flex-1"
              data-testid="input-telegram-link"
            />
            <Button
              type="button"
              onClick={verifyTelegramChannel}
              disabled={telegramVerification.isVerifying}
              className="px-4 bg-primary hover:bg-primary/90"
            >
              {telegramVerification.isVerifying ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Verify"
              )}
            </Button>
          </div>
          
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

        <div className="space-y-3">
          <Label className="text-sm font-medium text-foreground">
            Gifts *
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
            <span>Add Gift</span>
          </button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="price" className="text-sm font-medium text-foreground">
            Price (TON) *
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
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-primary hover-elevate active-elevate-2"
            disabled={createChannelMutation.isPending || !telegramVerification.isVerified}
            data-testid="button-submit"
          >
            {createChannelMutation.isPending ? "Creating..." : 
             !telegramVerification.isVerified ? "Verify Channel First" : "Create"}
          </Button>
        </div>
      </form>

      <GiftPickerModal
        open={isGiftPickerOpen}
        onClose={() => setIsGiftPickerOpen(false)}
        gifts={gifts}
        selectedGiftId=""
        onSelectGift={addGift}
      />
    </div>
  );
}
