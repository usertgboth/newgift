import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ExternalLink, X, Gift } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Button } from "@/components/ui/button";
import tonLogo from "@assets/toncoin_1760893904370.png";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { useTonWallet } from '@tonconnect/ui-react';
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useTelegramUser } from "@/hooks/use-telegram-user";
import type { User } from "@shared/schema";

interface GiftItem {
  giftId: string;
  quantity: number;
  giftName?: string;
}

interface ChannelDetailsModalProps {
  open: boolean;
  onClose: () => void;
  channelName: string;
  telegramLink: string;
  price: string;
  giftName: string;
  image: string;
  gifts?: GiftItem[];
}

export default function ChannelDetailsModal({
  open,
  onClose,
  channelName,
  telegramLink,
  price,
  giftName,
  image,
  gifts = [],
}: ChannelDetailsModalProps) {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const wallet = useTonWallet();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const telegramUser = useTelegramUser();

  const { data: user } = useQuery<User>({
    queryKey: ['/api/users', telegramUser.user?.id, 'profile'],
    queryFn: async () => {
      if (!telegramUser.user?.id) return null;
      const res = await fetch(`/api/users/${telegramUser.user.id}/profile`);
      if (!res.ok) {
        if (res.status === 404) return null;
        throw new Error('Failed to fetch user');
      }
      return res.json();
    },
    enabled: !!telegramUser.user?.id,
  });

  const { data: channels } = useQuery<Array<{id: string; channelName: string; giftId: string; ownerId: string | null}>>({
    queryKey: ['/api/channels'],
  });

  const currentChannel = channels?.find(c => c.channelName === channelName);

  const purchaseMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id || !currentChannel?.id) {
        throw new Error('Missing user or channel data');
      }

      const res = await fetch('/api/purchases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyerId: user.id,
          sellerId: currentChannel.ownerId,
          channelId: currentChannel.id,
          giftId: currentChannel.giftId,
          price: price,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to create purchase');
      }

      return res.json();
    },
    onSuccess: () => {
      toast({
        title: language === 'ru' ? 'Ошибка' : 'Error',
        description: language === 'ru' ? 'Произошла ошибка при обработке покупки' : 'An error occurred while processing the purchase',
        variant: 'destructive',
      });
      setShowConfirmDialog(false);
      onClose();
    },
    onError: (error: Error) => {
      toast({
        title: language === 'ru' ? 'Ошибка' : 'Error',
        description: error.message,
        variant: 'destructive',
      });
      setShowConfirmDialog(false);
    },
  });

  const priceNum = parseFloat(price);
  const cashback = (priceNum * 0.075).toFixed(2);

  const handleBuy = () => {
    if (!wallet) {
      toast({
        title: t.toast.error,
        description: language === 'ru' ? "Подключите кошелёк TON" : "Connect TON wallet first",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: t.toast.error,
        description: language === 'ru' ? "Пользователь не найден" : "User not found",
        variant: "destructive",
      });
      return;
    }

    setShowConfirmDialog(true);
  };

  const confirmPurchase = () => {
    purchaseMutation.mutate();
  };

  const mainGift = gifts.find(g => g.giftName === giftName) || gifts[0];
  const hasMultipleGifts = gifts.length > 1;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="p-0 gap-0 max-w-[90vw] w-full sm:max-w-md max-h-[80vh] border-0 overflow-hidden flex flex-col">
        <VisuallyHidden>
          <DialogTitle>{giftName}</DialogTitle>
        </VisuallyHidden>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-50 w-7 h-7 rounded-full bg-background/95 backdrop-blur-sm border border-border/50 hover:bg-background shadow-lg flex items-center justify-center transition-all"
          data-testid="button-close-modal"
        >
          <X className="w-3.5 h-3.5 text-foreground" />
        </button>

        <div className="flex flex-col sm:flex-row flex-1 min-h-0 overflow-hidden">
          <div className="relative w-full sm:w-2/5 h-40 sm:h-auto bg-gradient-to-br from-primary/10 to-primary/5 flex-shrink-0 flex items-center justify-center p-3">
            <img
              src={image}
              alt={giftName}
              className="max-w-full max-h-full object-contain"
              data-testid="img-modal-gift"
            />
          </div>

          <div className="flex-1 flex flex-col min-h-0">
            <div className="px-3 py-2 space-y-2">
              <div>
                <h3 className="text-sm font-bold text-foreground line-clamp-1" data-testid="text-modal-gift-name">
                  {giftName}
                </h3>
                <p className="text-xs text-muted-foreground">x{mainGift?.quantity || 1}</p>
              </div>

              {hasMultipleGifts && gifts.length > 1 && (
                <div className="flex flex-wrap gap-1">
                  {gifts.slice(0, 2).map((gift, index) => (
                    <span
                      key={index}
                      className="px-1.5 py-0.5 rounded-md bg-primary/10 text-xs text-foreground"
                    >
                      {gift.giftName} x{gift.quantity}
                    </span>
                  ))}
                  {gifts.length > 2 && (
                    <span className="px-1.5 py-0.5 rounded-md bg-muted text-xs text-muted-foreground">
                      +{gifts.length - 2}
                    </span>
                  )}
                </div>
              )}

              <a
                href={telegramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2 rounded-lg bg-card border border-card-border hover:border-blue-500/50 transition-all group"
                data-testid="link-telegram-channel"
              >
                <div className="flex-1 min-w-0 mr-2">
                  <p className="text-xs text-blue-500 group-hover:text-blue-600 font-medium truncate">
                    {channelName}
                  </p>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
              </a>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between p-2 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
                  <span className="text-xs text-muted-foreground">{t.home.price}</span>
                  <div className="flex items-center gap-1">
                    <img src={tonLogo} alt="TON" className="w-3.5 h-3.5 rounded-full" />
                    <span className="text-base font-bold text-foreground" data-testid="text-modal-price">
                      {price}
                    </span>
                    <span className="text-xs font-medium text-muted-foreground">TON</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
                  <div className="flex items-center gap-1">
                    <Gift className="w-3.5 h-3.5 text-blue-500" />
                    <span className="text-xs text-muted-foreground">{t.home.cashback} 7.5%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <img src={tonLogo} alt="TON" className="w-3.5 h-3.5 rounded-full" />
                    <span className="text-sm font-bold text-blue-500">+{cashback}</span>
                    <span className="text-xs text-muted-foreground">TON</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-3 pb-3 pt-2">
              <Button
                onClick={handleBuy}
                disabled={purchaseMutation.isPending}
                className="w-full h-9 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 shadow-lg shadow-blue-500/20 text-white font-bold text-sm transition-all duration-300 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                data-testid="button-modal-buy"
              >
                {purchaseMutation.isPending ? (language === 'ru' ? 'Обработка...' : 'Processing...') : t.home.buy}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent data-testid="dialog-confirm-purchase">
          <AlertDialogHeader>
            <AlertDialogTitle data-testid="text-confirm-title">
              {language === 'ru' ? 'Подтвердить покупку?' : 'Confirm Purchase?'}
            </AlertDialogTitle>
            <AlertDialogDescription data-testid="text-confirm-description">
              {language === 'ru' 
                ? `Вы уверены, что хотите купить канал "${channelName}" за ${price} TON?` 
                : `Are you sure you want to buy "${channelName}" for ${price} TON?`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-purchase">
              {language === 'ru' ? 'Нет' : 'No'}
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmPurchase} 
              disabled={purchaseMutation.isPending}
              data-testid="button-confirm-purchase"
            >
              {language === 'ru' ? 'Да' : 'Yes'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}