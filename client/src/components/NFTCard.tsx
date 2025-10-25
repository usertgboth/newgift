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
      className="group rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 bg-card border border-card-border hover:border-primary/30 active:scale-[0.98] shadow-sm hover:shadow-md"
      onClick={() => console.log(`Channel clicked: ${channelName}`)}
      data-testid={`card-channel-${channelName}`}
    >
      <div className="relative aspect-square bg-gray-100 dark:bg-gray-800">
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

      <div className="p-3 sm:p-4 space-y-3">
        <div className="space-y-1">
          <h3 className="text-sm sm:text-base font-semibold text-foreground line-clamp-1" data-testid={`text-gift-name-${giftName}`}>
            {giftName}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1" data-testid={`text-channel-name-${channelName}`}>
            {channelName}
          </p>
        </div>

        <button
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 bg-blue-500 hover:bg-blue-600 rounded-xl transition-all active:scale-95"
          onClick={(e) => {
            e.stopPropagation();
            console.log(`Buy clicked: ${channelName}`);
          }}
        >
          <img src={tonLogo} alt="TON" className="w-4 h-4 sm:w-5 sm:h-5 rounded-full object-cover" />
          <span className="text-sm sm:text-base font-bold text-white" data-testid={`text-price-${channelName}`}>
            {price} TON
          </span>
        </button>
      </div>
    </div>
  );
}
