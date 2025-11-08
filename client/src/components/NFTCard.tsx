import { Lock, Shield, MessageSquare } from "lucide-react";
import tonLogo from "@assets/toncoin_1760893904370.png";
import { useState } from "react";
import ChannelDetailsModal from "./ChannelDetailsModal";
import { useLanguage } from "@/contexts/LanguageContext";

interface GiftItem {
  giftId: string;
  quantity: number;
  giftName?: string;
  giftImage?: string;
}

interface NFTCardProps {
  giftName: string;
  channelName: string;
  telegramLink: string;
  price: string;
  image: string;
  locked?: boolean;
  gifts?: GiftItem[];
  type?: string;
}

export default function NFTCard({ giftName, channelName, telegramLink, price, image, locked = false, gifts = [], type = "channel" }: NFTCardProps) {
  const { t } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const mainGift = gifts.find(g => g.giftName === giftName) || gifts[0];
  const otherGifts = gifts.filter(g => g.giftName !== giftName);
  
  const totalGiftsCount = gifts.length;
  
  const renderOtherGifts = () => {
    if (otherGifts.length === 0) return null;
    
    const maxLength = 40;
    const displayGifts = otherGifts.slice(0, 2);
    const remaining = otherGifts.length - 2;
    
    let giftsText = displayGifts.map(g => `${g.giftName} x${g.quantity}`).join(', ');
    
    if (remaining > 0) {
      giftsText = `${giftsText}, и т.д.`;
    }
    
    if (giftsText.length > maxLength) {
      return giftsText.substring(0, maxLength - 3) + '...';
    }
    
    return giftsText;
  };

  return (
    <>
      <div
        className="group rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 bg-card border border-card-border hover:border-primary/30 active:scale-[0.98] shadow-sm hover:shadow-md flex flex-col"
        onClick={() => setIsModalOpen(true)}
        data-testid={`card-channel-${channelName}`}
      >
        <div className="relative aspect-square bg-gray-100 dark:bg-gray-800">
          <img
            src={image}
            alt={giftName}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            data-testid={`img-gift-${giftName}`}
          />
          
          {totalGiftsCount > 1 && (
            <div className="absolute top-2 left-2 px-2 py-1 bg-black/80 backdrop-blur-sm rounded">
              <span className="text-sm font-bold text-white">x{totalGiftsCount}</span>
            </div>
          )}
          
          <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-background/90 backdrop-blur-sm rounded-lg border border-border">
            {type === "guarantor" ? (
              <>
                <Shield className="w-3 h-3 text-amber-500" />
                <span className="text-xs font-medium text-foreground">{t.home.typeGuarantor}</span>
              </>
            ) : (
              <>
                <MessageSquare className="w-3 h-3 text-blue-500" />
                <span className="text-xs font-medium text-foreground">{t.home.typeChannel}</span>
              </>
            )}
          </div>
          
          {locked && (
            <div className="absolute bottom-2 right-2 w-6 h-6 flex items-center justify-center bg-background/90 rounded-full border border-border">
              <Lock className="w-3 h-3 text-muted-foreground" />
            </div>
          )}
        </div>

        <div className="p-3 sm:p-4 flex flex-col flex-1">
          <div className="flex-1 space-y-1 mb-3">
            <h3 className="text-sm sm:text-base font-semibold text-foreground line-clamp-1" data-testid={`text-gift-name-${giftName}`}>
              {giftName} x{mainGift?.quantity || 1}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2" data-testid={`text-channel-name-${channelName}`}>
              {renderOtherGifts() || channelName}
            </p>
          </div>

          <button
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 bg-blue-500 hover:bg-blue-600 rounded-xl transition-all active:scale-95 mt-auto"
            onClick={(e) => {
              e.stopPropagation();
              setIsModalOpen(true);
            }}
            data-testid={`button-buy-${channelName}`}
          >
            <img src={tonLogo} alt="TON" className="w-4 h-4 sm:w-5 sm:h-5 rounded-full object-cover" />
            <span className="text-sm sm:text-base font-bold text-white" data-testid={`text-price-${channelName}`}>
              {price} TON
            </span>
          </button>
        </div>
      </div>

      <ChannelDetailsModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        channelName={channelName}
        telegramLink={telegramLink}
        price={price}
        giftName={giftName}
        image={image}
        gifts={gifts}
      />
    </>
  );
}
