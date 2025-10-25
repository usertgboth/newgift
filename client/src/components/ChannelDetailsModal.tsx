import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ExternalLink, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import tonLogo from "@assets/toncoin_1760893904370.png";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { useTonWallet } from '@tonconnect/ui-react';

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

  const handleBuy = () => {
    if (!wallet) {
      toast({
        title: t.toast.error,
        description: language === 'ru' ? "Подключите кошелёк TON" : "Connect TON wallet first",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: t.toast.success,
      description: language === 'ru' ? `Покупка канала "${channelName}"` : `Buying channel "${channelName}"`,
    });
  };

  const mainGift = gifts.find(g => g.giftName === giftName) || gifts[0];
  const hasMultipleGifts = gifts.length > 1;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="p-0 gap-0 max-w-md border-0 overflow-hidden bg-gradient-to-b from-background to-muted/20">
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm border border-border hover:bg-background transition-all flex items-center justify-center"
            data-testid="button-close-modal"
          >
            <X className="w-5 h-5 text-foreground" />
          </button>

          <div className="relative aspect-square bg-gradient-to-br from-primary/5 to-primary/10">
            <img
              src={image}
              alt={giftName}
              className="w-full h-full object-cover"
              data-testid="img-modal-gift"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
          </div>

          <div className="p-6 space-y-6">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-foreground mb-1" data-testid="text-modal-gift-name">
                    {giftName} {mainGift && `x${mainGift.quantity}`}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {hasMultipleGifts ? t.home.includes : t.home.channelName}
                  </p>
                </div>
              </div>

              {hasMultipleGifts && gifts.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {gifts.map((gift, index) => (
                    <div
                      key={index}
                      className="px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-foreground"
                    >
                      {gift.giftName} x{gift.quantity}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 rounded-xl bg-card/50 border border-card-border">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{t.home.channelName}</p>
                  <a
                    href={telegramLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base font-semibold text-blue-500 hover:text-blue-600 flex items-center gap-1.5 transition-colors"
                    data-testid="link-telegram-channel"
                  >
                    {channelName}
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{t.home.price}</p>
                  <div className="flex items-center gap-2">
                    <img src={tonLogo} alt="TON" className="w-6 h-6 rounded-full" />
                    <span className="text-2xl font-bold text-foreground" data-testid="text-modal-price">
                      {price}
                    </span>
                    <span className="text-lg font-semibold text-muted-foreground">TON</span>
                  </div>
                </div>
              </div>
            </div>

            <Button
              onClick={handleBuy}
              className="w-full h-14 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-700 hover:via-blue-600 hover:to-cyan-600 shadow-lg shadow-blue-500/30 text-white font-bold text-lg transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98]"
              data-testid="button-modal-buy"
            >
              {t.home.buy}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
