import { Plus, Layers3, Trash2 } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import TopHeader from "@/components/TopHeader";
import BottomNav from "@/components/BottomNav";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTelegramUser } from "@/hooks/use-telegram-user";
import tonLogo from "@assets/toncoin_1760893904370.png";
import SellerNotification from '@/components/SellerNotification';
import { useState, useEffect } from 'react';
import type { User, Purchase } from '@shared/schema';

interface Channel {
  id: string;
  channelName: string;
  telegramLink: string;
  giftId: string;
  giftName: string;
  giftImage: string;
  price: string;
  ownerId: string | null;
}

export default function MyAds() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { t } = useLanguage();
  const telegramUser = useTelegramUser();
  const [activePurchase, setActivePurchase] = useState<Purchase | null>(null);
  const [notifiedChannels, setNotifiedChannels] = useState<Set<string>>(new Set());

  // Fetch user data to enable conditional query for purchases
  const { data: user } = useQuery<User>({
    queryKey: ["/api/user/me"],
  });

  const { data: channels = [], isLoading } = useQuery<Array<{
    id: string;
    channelName: string;
    telegramLink: string;
    price: string;
    giftId: string;
    giftName: string;
    giftImage: string;
    ownerId: string | null;
    parsedGifts: any[];
    createdAt?: string;
  }>>({
    queryKey: ["/api/channels"],
  });

  // Fetch purchases only if user data is available
  const { data: purchases = [] } = useQuery<Purchase[]>({
    queryKey: ['/api/purchases/seller', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const res = await fetch(`/api/purchases/seller/${user.id}`);
      if (!res.ok) return [];
      return res.json();
    },
    enabled: !!user?.id,
    refetchInterval: 3000, // Poll every 3 seconds
  });

  useEffect(() => {
    console.log('=== PURCHASES UPDATE ===');
    console.log('Total purchases:', purchases.length);
    console.log('User ID:', user?.id);
    purchases.forEach(p => {
      console.log('Purchase:', {
        id: p.id,
        channelId: p.channelId,
        sellerNotifiedAt: p.sellerNotifiedAt,
        sellerConfirmed: p.sellerConfirmed,
        buyerNotifiedAt: p.buyerNotifiedAt,
        expiresAt: p.sellerCountdownExpiresAt
      });
    });

    // Find purchases where seller needs to be notified
    const notifiedPurchase = purchases.find(p =>
      p.sellerNotifiedAt && !p.sellerConfirmed
    );
    
    if (notifiedPurchase) {
      console.log('✅ FOUND NOTIFIED PURCHASE:', notifiedPurchase.id);
      setActivePurchase(notifiedPurchase);
    } else {
      console.log('❌ NO NOTIFIED PURCHASE FOUND');
      setActivePurchase(null);
    }
  }, [purchases, user?.id]);

  const deleteChannelMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/channels/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/channels"] });
      toast({
        title: t.toast.success,
        description: t.toast.channelDeleted,
      });
    },
    onError: () => {
      toast({
        title: t.toast.error,
        description: t.toast.failedToDelete,
        variant: "destructive",
      });
    },
  });

  const handleDelete = (id: string, name: string) => {
    if (confirm(t.myAds.deleteConfirm(name))) {
      deleteChannelMutation.mutate(id);
    }
  };

  return (
    <div className="h-screen bg-background text-foreground flex flex-col">
      <TopHeader />

      {(() => {
        console.log('Rendering notification check:', {
          hasActivePurchase: !!activePurchase,
          hasExpiresAt: !!activePurchase?.sellerCountdownExpiresAt,
          channelId: activePurchase?.channelId,
          channelName: channels.find(c => c.id === activePurchase?.channelId)?.channelName
        });
        
        if (activePurchase && activePurchase.sellerCountdownExpiresAt) {
          console.log('🔔 SHOWING SELLER NOTIFICATION');
          return (
            <SellerNotification
              open={true}
              onClose={() => setActivePurchase(null)}
              purchaseId={activePurchase.id}
              buyerUsername="anykaj"
              channelName={channels.find(c => c.id === activePurchase.channelId)?.channelName || ''}
              expiresAt={new Date(activePurchase.sellerCountdownExpiresAt)}
            />
          );
        }
        return null;
      })()}

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-4 py-4 border-b border-border bg-background">
          <h1 className="text-xl font-semibold text-foreground" data-testid="text-title">
            {t.myAds.title}
          </h1>
          <Button
            size="icon"
            className="w-10 h-10 rounded-lg bg-primary hover-elevate active-elevate-2"
            data-testid="button-add-ad"
            onClick={() => navigate("/create-ad")}
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto pb-20" style={{ WebkitOverflowScrolling: 'touch' }}>

        {isLoading ? (
            <div className="px-4 py-6">
              <div className="grid grid-cols-2 gap-3">
                {[1, 2].map((i) => (
                  <div key={i} className="rounded-2xl p-3 bg-card animate-pulse">
                    <div className="aspect-square rounded-xl bg-muted mb-3" />
                    <div className="h-4 bg-muted rounded mb-2" />
                    <div className="h-3 bg-muted rounded w-2/3" />
                  </div>
                ))}
              </div>
            </div>
          ) : !channels || channels.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-20">
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-24 h-24 rounded-2xl bg-card border border-card-border flex items-center justify-center">
                  <Layers3 className="w-12 h-12 text-muted-foreground" />
                </div>

                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-foreground" data-testid="text-empty-title">
                    {t.myAds.noChannels}
                  </h2>
                  <p className="text-sm text-muted-foreground" data-testid="text-empty-subtitle">
                    {t.myAds.createFirst}
                  </p>
                </div>

              </div>
            </div>
          ) : (
            <div className="px-4 py-6">
              <div className="grid grid-cols-2 gap-3">
                {channels.map((channel) => {
                  return (
                    <div
                      key={channel.id}
                      className="rounded-2xl p-3 relative bg-gradient-to-br from-[#4A90E2] to-[#357ABD]"
                      data-testid={`card-channel-${channel.id}`}
                    >
                      <button
                        onClick={() => handleDelete(channel.id, channel.channelName)}
                        className="absolute top-2 right-2 w-8 h-8 rounded-lg bg-black/30 backdrop-blur-sm flex items-center justify-center hover:bg-black/50 transition-colors z-10"
                        data-testid={`button-delete-${channel.id}`}
                      >
                        <Trash2 className="w-4 h-4 text-white" />
                      </button>

                      <div className="relative aspect-square rounded-xl overflow-hidden mb-3">
                        <img
                          src={channel.giftImage}
                          alt={channel.giftName}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="space-y-1">
                        <h3 className="text-base font-semibold text-white">
                          {channel.giftName}
                        </h3>
                        <p className="text-xs text-white/70">
                          {channel.channelName}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-primary rounded-full mt-3 w-fit">
                        <img src={tonLogo} alt="TON" className="w-3.5 h-3.5 rounded-full object-cover" />
                        <span className="text-sm font-semibold text-primary-foreground">
                          {channel.price} TON
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <BottomNav activeTab="myads" />
    </div>
  );
}