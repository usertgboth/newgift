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
      className="group rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 bg-card border border-card-border hover:border-primary/40 active:scale-[0.96] shadow-sm hover:shadow-2xl hover:shadow-primary/10 animate-in fade-in-0 zoom-in-95 duration-500"
      onClick={() => console.log(`Channel clicked: ${channelName}`)}
      data-testid={`card-channel-${channelName}`}
      style={{ animationDelay: '100ms' }}
    >
      <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 overflow-hidden">
        <img
          src={image}
          alt={giftName}
          className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110 group-hover:rotate-1"
          data-testid={`img-gift-${giftName}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        {locked && (
          <div className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center bg-background/90 rounded-full border border-border animate-in zoom-in-75 duration-300">
            <Lock className="w-3 h-3 text-muted-foreground animate-pulse" />
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
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 bg-blue-500 hover:bg-blue-600 rounded-xl transition-all duration-300 active:scale-95 hover:shadow-lg hover:shadow-blue-500/50 relative overflow-hidden group/btn"
          onClick={(e) => {
            e.stopPropagation();
            console.log(`Buy clicked: ${channelName}`);
          }}
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500 ease-out" />
          <img src={tonLogo} alt="TON" className="w-4 h-4 sm:w-5 sm:h-5 rounded-full object-cover animate-in zoom-in-0 duration-300 relative z-10" />
          <span className="text-sm sm:text-base font-bold text-white relative z-10" data-testid={`text-price-${channelName}`}>
            {price} TON
          </span>
        </button>
      </div>
    </div>
  );
}
