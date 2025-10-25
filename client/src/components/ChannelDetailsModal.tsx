import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ExternalLink, X, Gift } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
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

    toast({
      title: t.toast.success,
      description: language === 'ru' ? `Покупка канала "${channelName}"` : `Buying channel "${channelName}"`,
    });
  };

  const mainGift = gifts.find(g => g.giftName === giftName) || gifts[0];
  const hasMultipleGifts = gifts.length > 1;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="p-0 gap-0 max-w-[95vw] w-full sm:max-w-md border-0 overflow-hidden">
        <VisuallyHidden>
          <DialogTitle>{giftName}</DialogTitle>
        </VisuallyHidden>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-50 w-8 h-8 rounded-full bg-background/95 backdrop-blur-sm border border-border/50 hover:bg-background shadow-lg flex items-center justify-center transition-all"
          data-testid="button-close-modal"
        >
          <X className="w-4 h-4 text-foreground" />
        </button>

        <div className="flex flex-col sm:flex-row">
          <div className="relative w-full sm:w-2/5 aspect-square sm:aspect-auto bg-gradient-to-br from-primary/10 to-primary/5 flex-shrink-0">
            <img
              src={image}
              alt={giftName}
              className="w-full h-full object-cover"
              data-testid="img-modal-gift"
            />
          </div>

          <div className="flex-1 p-4 flex flex-col">
            <div className="flex-1 space-y-3">
              <div>
                <h3 className="text-lg font-bold text-foreground line-clamp-1" data-testid="text-modal-gift-name">
                  {giftName}
                </h3>
                <p className="text-xs text-muted-foreground">x{mainGift?.quantity || 1}</p>
              </div>

              {hasMultipleGifts && gifts.length > 1 && (
                <div className="flex flex-wrap gap-1">
                  {gifts.slice(0, 3).map((gift, index) => (
                    <span
                      key={index}
                      className="px-2 py-0.5 rounded-md bg-primary/10 text-xs text-foreground"
                    >
                      {gift.giftName} x{gift.quantity}
                    </span>
                  ))}
                  {gifts.length > 3 && (
                    <span className="px-2 py-0.5 rounded-md bg-muted text-xs text-muted-foreground">
                      +{gifts.length - 3}
                    </span>
                  )}
                </div>
              )}

              <a
                href={telegramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2.5 rounded-lg bg-card border border-card-border hover:border-blue-500/50 transition-all group"
                data-testid="link-telegram-channel"
              >
                <div className="flex-1 min-w-0 mr-2">
                  <p className="text-xs text-blue-500 group-hover:text-blue-600 font-medium truncate">
                    {channelName}
                  </p>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
              </a>

              <div className="space-y-2">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
                  <span className="text-xs text-muted-foreground">{t.home.price}</span>
                  <div className="flex items-center gap-1.5">
                    <img src={tonLogo} alt="TON" className="w-4 h-4 rounded-full" />
                    <span className="text-lg font-bold text-foreground" data-testid="text-modal-price">
                      {price}
                    </span>
                    <span className="text-xs font-medium text-muted-foreground">TON</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
                  <div className="flex items-center gap-1.5">
                    <Gift className="w-3.5 h-3.5 text-blue-500" />
                    <span className="text-xs text-muted-foreground">{t.home.cashback} 7.5%</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <img src={tonLogo} alt="TON" className="w-3.5 h-3.5 rounded-full" />
                    <span className="text-sm font-bold text-blue-500">+{cashback}</span>
                    <span className="text-xs text-muted-foreground">TON</span>
                  </div>
                </div>
              </div>
            </div>

            <Button
              onClick={handleBuy}
              className="w-full h-11 mt-3 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 shadow-lg shadow-blue-500/20 text-white font-bold transition-all duration-300 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
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
