import { Plus, Layers3, Trash2 } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import TopHeader from "@/components/TopHeader";
import BottomNav from "@/components/BottomNav";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import tonLogo from "@assets/toncoin_1760893904370.png";

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

export default function MyAds() {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const { data: channels, isLoading } = useQuery<Channel[]>({
    queryKey: ["/api/channels"],
  });

  const deleteChannelMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/channels/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/channels"] });
      toast({
        title: "Success!",
        description: "Channel deleted",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete channel",
        variant: "destructive",
      });
    },
  });

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Delete channel "${name}"?`)) {
      deleteChannelMutation.mutate(id);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <TopHeader />
      
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between px-4 py-4 border-b border-border">
          <h1 className="text-xl font-semibold text-foreground" data-testid="text-title">
            My Channels
          </h1>
          <Button
            size="icon"
            className="w-10 h-10 rounded-lg bg-primary hover-elevate active-elevate-2"
            data-testid="button-add-ad"
            onClick={() => navigate("/create-ad")}
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>

        {isLoading ? (
          <div className="px-4 py-6">
            <div className="grid grid-cols-2 gap-3">
              {[1, 2].map((i) => (
                <div key={i} className="rounded-2xl p-3 bg-card animate-pulse">
                  <div className="aspect-square rounded-xl bg-muted mb-3" />
                  <div className="h-4 bg-muted rounded mb-2" />
                  <div className="h-3 bg-muted rounded w-2/3" />
                </div>
              ))}
            </div>
          </div>
        ) : !channels || channels.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6 pb-24">
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="w-24 h-24 rounded-2xl bg-card border border-card-border flex items-center justify-center">
                <Layers3 className="w-12 h-12 text-muted-foreground" />
              </div>
              
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-foreground" data-testid="text-empty-title">
                  No Channels
                </h2>
                <p className="text-sm text-muted-foreground" data-testid="text-empty-subtitle">
                  Create your first channel
                </p>
              </div>

            </div>
          </div>
        ) : (
          <div className="px-4 py-6 pb-24">
            <div className="grid grid-cols-2 gap-3">
              {channels.map((channel) => {
                return (
                  <div
                    key={channel.id}
                    className="rounded-2xl p-3 relative bg-gradient-to-br from-[#4A90E2] to-[#357ABD]"
                    data-testid={`card-channel-${channel.id}`}
                  >
                    <button
                      onClick={() => handleDelete(channel.id, channel.channelName)}
                      className="absolute top-2 right-2 w-8 h-8 rounded-lg bg-black/30 backdrop-blur-sm flex items-center justify-center hover:bg-black/50 transition-colors z-10"
                      data-testid={`button-delete-${channel.id}`}
                    >
                      <Trash2 className="w-4 h-4 text-white" />
                    </button>

                    <div className="relative aspect-square rounded-xl overflow-hidden mb-3">
                      <img
                        src={channel.giftImage}
                        alt={channel.giftName}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-base font-semibold text-white">
                        {channel.giftName}
                      </h3>
                      <p className="text-xs text-white/70">
                        {channel.channelName}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-primary rounded-full mt-3 w-fit">
                      <img src={tonLogo} alt="TON" className="w-3.5 h-3.5 rounded-full object-cover" />
                      <span className="text-sm font-semibold text-primary-foreground">
                        {channel.price} TON
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <BottomNav activeTab="myads" />
    </div>
  );
}
