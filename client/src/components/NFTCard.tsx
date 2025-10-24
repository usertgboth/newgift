import { Lock } from "lucide-react";
import tonLogo from "@assets/toncoin_1760893904370.png";

interface NFTCardProps {
  giftName: string;
  channelName: string;
  price: string;
  image: string;
  locked?: boolean;
}

export default function NFTCard({ giftName, channelName, price, image, locked = false }: NFTCardProps) {
  return (
    <div
      className="group rounded-xl sm:rounded-2xl p-3 sm:p-4 cursor-pointer transition-all duration-300 bg-card border border-card-border hover:border-primary/30 hover:bg-card/80 active:scale-[0.96] shadow-sm hover:shadow-md"
      onClick={() => console.log(`Channel clicked: ${channelName}`)}
      data-testid={`card-channel-${channelName}`}
    >
      <div className="relative aspect-square rounded-lg sm:rounded-xl overflow-hidden mb-3 sm:mb-4 bg-muted/30">
        <img
          src={image}
          alt={giftName}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          data-testid={`img-gift-${giftName}`}
        />
        {locked && (
          <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center bg-background/90 rounded-full border border-border">
            <Lock className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-muted-foreground" />
          </div>
        )}
      </div>

      <div className="space-y-1.5 sm:space-y-2">
        <h3 className="text-xs sm:text-sm font-semibold text-foreground line-clamp-2 leading-tight" data-testid={`text-gift-name-${giftName}`}>
          {giftName}
        </h3>
        <p className="text-[10px] sm:text-xs text-muted-foreground line-clamp-1" data-testid={`text-channel-name-${channelName}`}>
          {channelName}
        </p>
      </div>

      <div className="flex items-center justify-between mt-3 sm:mt-4">
        <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-primary/10 rounded-full border border-primary/20">
          <img src={tonLogo} alt="TON" className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full object-cover" />
          <span className="text-xs sm:text-sm font-semibold text-foreground" data-testid={`text-price-${channelName}`}>
            {price}
          </span>
        </div>
        <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-muted/50 rounded-lg">
          <span className="text-base sm:text-lg">🎁</span>
        </div>
      </div>
    </div>
  );
}
