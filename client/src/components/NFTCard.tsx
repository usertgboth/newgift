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
      className="group rounded-2xl p-4 cursor-pointer transition-all duration-300 bg-card border border-card-border hover:border-primary/30 hover:bg-card/80 active:scale-[0.96] shadow-sm hover:shadow-md"
      onClick={() => console.log(`Channel clicked: ${channelName}`)}
      data-testid={`card-channel-${channelName}`}
    >
      <div className="relative aspect-square rounded-xl overflow-hidden mb-4 bg-muted/30">
        <img
          src={image}
          alt={giftName}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          data-testid={`img-gift-${giftName}`}
        />
        {locked && (
          <div className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center bg-background/90 rounded-full border border-border">
            <Lock className="w-3 h-3 text-muted-foreground" />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground line-clamp-2" data-testid={`text-gift-name-${giftName}`}>
          {giftName}
        </h3>
        <p className="text-xs text-muted-foreground line-clamp-1" data-testid={`text-channel-name-${channelName}`}>
          {channelName}
        </p>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2 px-3 py-2 bg-primary/10 rounded-full border border-primary/20">
          <img src={tonLogo} alt="TON" className="w-4 h-4 rounded-full object-cover" />
          <span className="text-sm font-semibold text-foreground" data-testid={`text-price-${channelName}`}>
            {price} TON
          </span>
        </div>
        <div className="w-8 h-8 flex items-center justify-center bg-muted/50 rounded-lg">
          <span className="text-lg">🎁</span>
        </div>
      </div>
    </div>
  );
}
