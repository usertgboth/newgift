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
      className="group rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 hover:border-blue-500/50 active:scale-[0.97] shadow-xl hover:shadow-2xl hover:shadow-blue-500/20 relative"
      onClick={() => console.log(`Channel clicked: ${channelName}`)}
      data-testid={`card-channel-${channelName}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative aspect-square bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden">
        <img
          src={image}
          alt={giftName}
          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:rotate-2"
          data-testid={`img-gift-${giftName}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        {locked && (
          <div className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-black/60 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg">
            <Lock className="w-4 h-4 text-white" />
          </div>
        )}
      </div>

      <div className="p-4 space-y-3 relative z-10">
        <div className="space-y-1.5">
          <h3 className="text-sm sm:text-base font-bold text-white line-clamp-1 group-hover:text-blue-400 transition-colors" data-testid={`text-gift-name-${giftName}`}>
            {giftName}
          </h3>
          <p className="text-xs text-slate-400 line-clamp-1" data-testid={`text-channel-name-${channelName}`}>
            {channelName}
          </p>
        </div>

        <button
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 rounded-2xl transition-all duration-300 active:scale-95 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 border border-blue-400/20"
          onClick={(e) => {
            e.stopPropagation();
            console.log(`Buy clicked: ${channelName}`);
          }}
        >
          <img src={tonLogo} alt="TON" className="w-5 h-5 rounded-full object-cover shadow-md" />
          <span className="text-sm sm:text-base font-bold text-white drop-shadow-md" data-testid={`text-price-${channelName}`}>
            {price} TON
          </span>
        </button>
      </div>
    </div>
  );
}
