import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ExternalLink, X, Package } from "lucide-react";
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
      <DialogContent className="p-0 gap-0 max-w-[90vw] sm:max-w-[500px] max-h-[85vh] border-0 overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-50 w-9 h-9 rounded-full bg-background/90 backdrop-blur-md border border-border/50 hover:bg-background hover:border-border shadow-lg flex items-center justify-center transition-all"
          data-testid="button-close-modal"
        >
          <X className="w-4 h-4 text-foreground" />
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-0">
          <div className="relative sm:col-span-2 aspect-square sm:aspect-auto bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
            <img
              src={image}
              alt={giftName}
              className="w-full h-full object-cover"
              data-testid="img-modal-gift"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent sm:bg-gradient-to-r sm:from-transparent sm:to-background/60" />
          </div>

          <div className="sm:col-span-3 p-5 sm:p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-1 line-clamp-2" data-testid="text-modal-gift-name">
                  {giftName}
                </h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Package className="w-4 h-4" />
                  <span>x{mainGift?.quantity || 1}</span>
                </div>
              </div>

              {hasMultipleGifts && gifts.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">{t.home.includes}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {gifts.slice(0, 5).map((gift, index) => (
                      <div
                        key={index}
                        className="px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20 text-xs font-medium text-foreground"
                      >
                        {gift.giftName} x{gift.quantity}
                      </div>
                    ))}
                    {gifts.length > 5 && (
                      <div className="px-2.5 py-1 rounded-lg bg-muted text-xs font-medium text-muted-foreground">
                        +{gifts.length - 5}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <a
                href={telegramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-card/50 border border-card-border hover:border-blue-500/50 hover:bg-card transition-all group"
                data-testid="link-telegram-channel"
              >
                <div className="flex-1 min-w-0 mr-2">
                  <p className="text-xs text-muted-foreground mb-0.5">{t.home.channelName}</p>
                  <p className="text-sm font-semibold text-blue-500 group-hover:text-blue-600 truncate">
                    {channelName}
                  </p>
                </div>
                <ExternalLink className="w-4 h-4 text-blue-500 flex-shrink-0" />
              </a>
            </div>

            <div className="space-y-3 mt-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">{t.home.price}</p>
                <div className="flex items-center gap-2">
                  <img src={tonLogo} alt="TON" className="w-5 h-5 rounded-full" />
                  <span className="text-2xl font-bold text-foreground" data-testid="text-modal-price">
                    {price}
                  </span>
                  <span className="text-sm font-semibold text-muted-foreground">TON</span>
                </div>
              </div>

              <Button
                onClick={handleBuy}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 shadow-lg shadow-blue-500/20 text-white font-bold transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98]"
                data-testid="button-modal-buy"
              >
                {t.home.buy}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
