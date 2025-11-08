import { useQuery } from "@tanstack/react-query";
import NFTCard from "./NFTCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { type SortOption } from "./SortPanel";
import { type CategoryTab } from "./CategoryTabs";

interface GiftItem {
  giftId: string;
  quantity: number;
  giftName?: string;
  giftImage?: string;
}

interface Channel {
  id: string;
  channelName: string;
  telegramLink: string;
  giftId: string;
  giftName: string;
  giftImage: string;
  price: string;
  ownerId: string | null;
  parsedGifts?: GiftItem[];
  type?: string;
}

interface TelegramGift {
  id: string;
  stickerFileId: string;
  stickerUniqueId: string;
  stickerEmoji: string;
  starCount: number;
  upgradeStarCount: number | null;
  totalCount: number | null;
  remainingCount: number | null;
  isLimited: boolean;
  isCollectible: boolean;
  stickerThumbnail: string | null;
  sticker: {
    file_id: string;
    file_unique_id: string;
    width: number;
    height: number;
    is_animated: boolean;
    is_video: boolean;
    type: string;
    emoji?: string;
    thumbnail?: {
      file_id: string;
      file_unique_id: string;
      width: number;
      height: number;
    };
  };
}

interface NFTGridProps {
  categoryTab?: CategoryTab;
  searchQuery?: string;
  giftFilter?: string[];
  sortOption?: SortOption;
}

export default function NFTGrid({ 
  categoryTab = "gifts",
  searchQuery = "", 
  giftFilter = [], 
  sortOption = "newest" 
}: NFTGridProps) {
  const { t } = useLanguage();
  const { data: channels, isLoading: isLoadingChannels } = useQuery<Channel[]>({
    queryKey: ["/api/channels"],
    enabled: categoryTab === "channels",
  });

  const { data: allGifts } = useQuery<Array<{ id: string; name: string; image: string }>>({
    queryKey: ["/api/gifts"],
  });

  const { data: telegramGifts, isLoading: isLoadingGifts } = useQuery<TelegramGift[]>({
    queryKey: ["/api/telegram-gifts"],
    enabled: categoryTab === "gifts",
  });

  if (categoryTab === "gifts") {
    if (isLoadingGifts) {
      return (
        <div className="px-3 sm:px-4 pb-24 pt-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="rounded-2xl p-3 sm:p-4 bg-card animate-pulse border border-card-border"
              >
                <div className="aspect-square rounded-xl bg-muted mb-3 sm:mb-4" />
                <div className="h-4 bg-muted rounded mb-2" />
                <div className="h-3 bg-muted rounded w-2/3" />
              </div>
            ))}
          </div>
        </div>
      );
    }

    const gifts = telegramGifts || [];
    
    let filteredGifts = gifts.filter(gift => {
      const matchesSearch = !searchQuery || 
        gift.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        gift.stickerEmoji.includes(searchQuery);
      
      return matchesSearch;
    });

    if (filteredGifts.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">🎁</span>
          </div>
          <p className="text-muted-foreground text-sm">{t.home.noGifts}</p>
          <p className="text-muted-foreground text-xs mt-1">{t.home.tryChangingFilter}</p>
        </div>
      );
    }

    return (
      <div className="px-3 sm:px-4 pb-24 pt-2">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {filteredGifts.map((gift) => (
            <div
              key={gift.id}
              className="rounded-2xl p-3 sm:p-4 bg-card border border-card-border hover:border-primary/50 transition-all duration-200"
              data-testid={`telegram-gift-${gift.id}`}
            >
              <div className="aspect-square rounded-xl overflow-hidden mb-3 sm:mb-4 bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center relative">
                <div className="text-7xl sm:text-8xl">{gift.stickerEmoji}</div>
                {gift.isCollectible && (
                  <div className="absolute top-2 right-2 bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                    NFT
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-yellow-500 flex items-center gap-1">
                  ⭐ {gift.starCount}
                </span>
                {gift.isLimited && (
                  <span className="text-xs text-red-500 font-medium">Limited</span>
                )}
              </div>
              {gift.isCollectible && gift.upgradeStarCount && (
                <p className="text-xs text-purple-400 mb-1 flex items-center gap-1">
                  <span>🎨 Collectible:</span>
                  <span className="font-semibold">+{gift.upgradeStarCount} ⭐</span>
                </p>
              )}
              <p className="text-xs text-muted-foreground mb-1">
                ID: {gift.id.substring(0, 12)}...
              </p>
              {gift.isLimited && (
                <p className="text-xs text-muted-foreground">
                  {gift.remainingCount}/{gift.totalCount} left
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  let filteredChannels = (channels || []).filter(channel => {
    const matchesSearch = !searchQuery || 
      channel.giftName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      channel.channelName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = !giftFilter || giftFilter.length === 0 || giftFilter.includes(channel.giftId);
    
    return matchesSearch && matchesFilter;
  });

  filteredChannels = [...filteredChannels].sort((a, b) => {
    // Sort guarantor type first
    const aType = a.type || "channel";
    const bType = b.type || "channel";
    if (aType === "guarantor" && bType !== "guarantor") return -1;
    if (aType !== "guarantor" && bType === "guarantor") return 1;
    
    // Then sort by price if specified
    if (sortOption === "price-low") {
      return parseFloat(a.price) - parseFloat(b.price);
    } else if (sortOption === "price-high") {
      return parseFloat(b.price) - parseFloat(a.price);
    }
    return 0;
  });

  if (isLoadingChannels) {
    return (
      <div className="px-3 sm:px-4 pb-24 pt-2">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="rounded-2xl p-3 sm:p-4 bg-card animate-pulse border border-card-border"
            >
              <div className="aspect-square rounded-xl bg-muted mb-3 sm:mb-4" />
              <div className="h-4 bg-muted rounded mb-2" />
              <div className="h-3 bg-muted rounded w-2/3 mb-3 sm:mb-4" />
              <div className="flex justify-between items-center">
                <div className="h-6 bg-muted rounded-full w-16" />
                <div className="h-8 bg-muted rounded-lg w-8" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (filteredChannels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl">🎁</span>
        </div>
        <p className="text-muted-foreground text-sm">{t.home.noGifts}</p>
        <p className="text-muted-foreground text-xs mt-1">{t.home.tryChangingFilter}</p>
      </div>
    );
  }

  const enrichedGifts = (channel: Channel) => {
    if (!channel.parsedGifts || !allGifts) return [];
    return channel.parsedGifts.map((gift: GiftItem) => {
      const giftData = allGifts.find((g) => g.id === gift.giftId);
      return {
        ...gift,
        giftName: giftData?.name || "",
        giftImage: giftData?.image || "",
      };
    });
  };

  return (
    <div className="px-3 sm:px-4 pb-24 pt-2">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
        {filteredChannels.map((channel) => {
          return (
            <NFTCard
              key={channel.id}
              giftName={channel.giftName}
              channelName={channel.channelName}
              telegramLink={channel.telegramLink}
              price={channel.price}
              image={channel.giftImage}
              locked={false}
              gifts={enrichedGifts(channel)}
              type={channel.type || "channel"}
            />
          );
        })}
      </div>
    </div>
  );
}
