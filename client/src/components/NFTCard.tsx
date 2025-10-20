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
      className="rounded-2xl p-3 cursor-pointer transition-transform active:scale-[0.98] bg-gradient-to-br from-[#4A90E2] to-[#357ABD]"
      onClick={() => console.log(`Channel clicked: ${channelName}`)}
      data-testid={`card-channel-${channelName}`}
    >
      <div className="relative aspect-square rounded-xl overflow-hidden mb-3">
        <img
          src={image}
          alt={giftName}
          className="w-full h-full object-cover"
          data-testid={`img-gift-${giftName}`}
        />
      </div>

      <div className="space-y-1">
        <h3 className="text-base font-semibold text-white" data-testid={`text-gift-name-${giftName}`}>
          {giftName}
        </h3>
        <p className="text-xs text-white/70" data-testid={`text-channel-name-${channelName}`}>
          {channelName}
        </p>
      </div>

      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-primary rounded-full">
          <img src={tonLogo} alt="TON" className="w-3.5 h-3.5 rounded-full object-cover" />
          <span className="text-sm font-semibold text-primary-foreground" data-testid={`text-price-${channelName}`}>
            {price} TON
          </span>
        </div>
        {locked && (
          <div className="w-8 h-8 flex items-center justify-center bg-black/20 rounded-lg">
            <Lock className="w-4 h-4 text-white" />
          </div>
        )}
      </div>
    </div>
  );
}
