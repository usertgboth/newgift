import { useQuery } from "@tanstack/react-query";
import NFTCard from "./NFTCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { type SortOption } from "./SortPanel";

interface GiftItem {
  giftId: string;
  quantity: number;
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
}

interface NFTGridProps {
  searchQuery?: string;
  giftFilter?: string[];
  sortOption?: SortOption;
}

export default function NFTGrid({ searchQuery = "", giftFilter = [], sortOption = "newest" }: NFTGridProps) {
  const { t } = useLanguage();
  const { data: channels, isLoading } = useQuery<Channel[]>({
    queryKey: ["/api/channels"],
  });

  const { data: allGifts } = useQuery<Array<{ id: string; name: string; image: string }>>({
    queryKey: ["/api/gifts"],
  });

  let filteredChannels = (channels || []).filter(channel => {
    const matchesSearch = !searchQuery || 
      channel.giftName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      channel.channelName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = !giftFilter || giftFilter.length === 0 || giftFilter.includes(channel.giftId);
    
    return matchesSearch && matchesFilter;
  });

  filteredChannels = [...filteredChannels].sort((a, b) => {
    if (sortOption === "price-low") {
      return parseFloat(a.price) - parseFloat(b.price);
    } else if (sortOption === "price-high") {
      return parseFloat(b.price) - parseFloat(a.price);
    }
    return 0;
  });

  if (isLoading) {
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
              price={channel.price}
              image={channel.giftImage}
              locked={false}
              gifts={enrichedGifts(channel)}
            />
          );
        })}
      </div>
    </div>
  );
}
