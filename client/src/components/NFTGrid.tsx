import { useQuery } from "@tanstack/react-query";
import NFTCard from "./NFTCard";

interface Channel {
  id: string;
  channelName: string;
  telegramLink: string;
  giftId: string;
  giftName: string;
  giftImage: string;
  price: string;
  ownerId: string | null;
}

interface NFTGridProps {
  searchQuery?: string;
  giftFilter?: string;
}

export default function NFTGrid({ searchQuery = "", giftFilter = "" }: NFTGridProps) {
  const { data: channels, isLoading } = useQuery<Channel[]>({
    queryKey: searchQuery ? ["/api/channels", { search: searchQuery }] : ["/api/channels"],
    queryFn: async ({ queryKey }) => {
      const [url, params] = queryKey as [string, { search?: string } | undefined];
      const searchParam = params?.search ? `?search=${encodeURIComponent(params.search)}` : '';
      const response = await fetch(`${url}${searchParam}`);
      return response.json();
    },
  });

  const filteredChannels = (channels || []).filter(channel => {
    if (!giftFilter) return true;
    return channel.giftId === giftFilter;
  });

  if (isLoading) {
    return (
      <div className="px-4 pb-20 pt-2">
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-2xl p-3 bg-card animate-pulse"
            >
              <div className="aspect-square rounded-xl bg-muted mb-3" />
              <div className="h-4 bg-muted rounded mb-2" />
              <div className="h-3 bg-muted rounded w-2/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (filteredChannels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
        <p className="text-muted-foreground">Нет каналов</p>
      </div>
    );
  }

  return (
    <div className="px-4 pb-20 pt-2">
      <div className="grid grid-cols-2 gap-3">
        {filteredChannels.map((channel) => {
          return (
            <NFTCard
              key={channel.id}
              giftName={channel.giftName}
              channelName={channel.channelName}
              price={channel.price}
              image={channel.giftImage}
              locked={false}
            />
          );
        })}
      </div>
    </div>
  );
}
