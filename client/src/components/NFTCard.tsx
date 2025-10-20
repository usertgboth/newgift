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
      className="group rounded-2xl p-3 cursor-pointer transition-all duration-300 bg-zinc-900/50 border border-zinc-800/50 hover:border-zinc-700/70 hover:bg-zinc-900/70 active:scale-[0.98]"
      onClick={() => console.log(`Channel clicked: ${channelName}`)}
      data-testid={`card-channel-${channelName}`}
    >
      <div className="relative aspect-square rounded-xl overflow-hidden mb-3 bg-zinc-950/30">
        <img
          src={image}
          alt={giftName}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          data-testid={`img-gift-${giftName}`}
        />
      </div>

      <div className="space-y-1">
        <h3 className="text-base font-semibold text-zinc-100" data-testid={`text-gift-name-${giftName}`}>
          {giftName}
        </h3>
        <p className="text-xs text-zinc-400" data-testid={`text-channel-name-${channelName}`}>
          {channelName}
        </p>
      </div>

      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800/60 rounded-full border border-zinc-700/50">
          <img src={tonLogo} alt="TON" className="w-3.5 h-3.5 rounded-full object-cover" />
          <span className="text-sm font-semibold text-zinc-100" data-testid={`text-price-${channelName}`}>
            {price} TON
          </span>
        </div>
        {locked && (
          <div className="w-8 h-8 flex items-center justify-center bg-zinc-800/40 rounded-lg border border-zinc-700/30">
            <Lock className="w-4 h-4 text-zinc-400" />
          </div>
        )}
      </div>
    </div>
  );
}
