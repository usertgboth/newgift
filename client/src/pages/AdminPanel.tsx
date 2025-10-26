import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ArrowLeft, Users, MessageSquare, Trash2, Plus, Minus } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAdmin } from "@/contexts/AdminContext";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { User, Channel } from "@shared/schema";

export default function AdminPanel() {
  const [, navigate] = useLocation();
  const { isAdmin, userId } = useAdmin();
  const { toast } = useToast();
  const [balanceInputs, setBalanceInputs] = useState<Record<string, string>>({});

  // Removed redirect - allow access to admin panel for status checking

  const { data: users = [], isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ['/api/admin/users'],
    enabled: isAdmin,
    queryFn: async () => {
      const telegramUser = (window as any).Telegram?.WebApp?.initDataUnsafe?.user;
      const telegramId = telegramUser?.id?.toString() || '';
      
      const res = await apiRequest('GET', '/api/admin/users', undefined, {
        'x-telegram-id': telegramId
      });
      return res.json();
    },
  });

  const { data: channels = [], isLoading: channelsLoading } = useQuery<Channel[]>({
    queryKey: ['/api/channels'],
    enabled: isAdmin,
  });

  const updateBalanceMutation = useMutation({
    mutationFn: async ({ userId: targetUserId, amount }: { userId: string; amount: number }) => {
      const telegramUser = (window as any).Telegram?.WebApp?.initDataUnsafe?.user;
      const telegramId = telegramUser?.id?.toString() || '';
      
      await apiRequest('PATCH', `/api/admin/users/${targetUserId}/balance`, { amount }, {
        'x-telegram-id': telegramId
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({
        title: "Success",
        description: "Balance updated successfully",
      });
      setBalanceInputs({});
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update balance",
        variant: "destructive",
      });
    },
  });

  const deleteChannelMutation = useMutation({
    mutationFn: async (channelId: string) => {
      const telegramUser = (window as any).Telegram?.WebApp?.initDataUnsafe?.user;
      const telegramId = telegramUser?.id?.toString() || '';
      
      await apiRequest('DELETE', `/api/admin/channels/${channelId}`, undefined, {
        'x-telegram-id': telegramId
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/channels'] });
      toast({
        title: "Success",
        description: "Channel deleted successfully",
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

  const handleBalanceChange = (targetUserId: string, amount: string) => {
    setBalanceInputs(prev => ({ ...prev, [targetUserId]: amount }));
  };

  const handleUpdateBalance = (targetUserId: string) => {
    const amount = parseFloat(balanceInputs[targetUserId] || "0");
    if (!isNaN(amount) && amount !== 0) {
      updateBalanceMutation.mutate({ userId: targetUserId, amount });
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="flex items-center gap-3 p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="hover-elevate active-elevate"
            data-testid="button-back"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground">Admin Panel</h1>
            <p className="text-xs text-muted-foreground">Manage users and channels</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        {!isAdmin ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground mb-4">
                У вас нет доступа к админ панели. Введите специальный код в разделе пополнения.
              </p>
              <Button onClick={() => navigate("/profile")}>
                Перейти в профиль
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="users" data-testid="tab-users">
              <Users className="w-4 h-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="channels" data-testid="tab-channels">
              <MessageSquare className="w-4 h-4 mr-2" />
              Channels
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            {usersLoading ? (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  Loading users...
                </CardContent>
              </Card>
            ) : (
              users.map((user) => (
                <Card key={user.id} data-testid={`card-user-${user.id}`}>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium flex items-center justify-between">
                      <span>{user.username}</span>
                      {user.isAdmin && (
                        <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                          Admin
                        </span>
                      )}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      ID: {user.id.substring(0, 8)}...
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Balance:</span>
                      <span className="text-sm font-bold text-foreground">
                        {user.balance} TON
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Amount (+/-)"
                        value={balanceInputs[user.id] || ""}
                        onChange={(e) => handleBalanceChange(user.id, e.target.value)}
                        className="text-sm"
                        data-testid={`input-balance-${user.id}`}
                      />
                      <Button
                        size="sm"
                        onClick={() => handleUpdateBalance(user.id)}
                        disabled={updateBalanceMutation.isPending || !balanceInputs[user.id]}
                        data-testid={`button-update-balance-${user.id}`}
                      >
                        {updateBalanceMutation.isPending ? "..." : "Update"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="channels" className="space-y-4">
            {channelsLoading ? (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  Loading channels...
                </CardContent>
              </Card>
            ) : (
              channels.map((channel) => (
                <Card key={channel.id} data-testid={`card-channel-${channel.id}`}>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">
                      {channel.channelName}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {channel.telegramLink}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Price:</span>
                      <span className="text-sm font-bold text-foreground">
                        {channel.price} TON
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteChannelMutation.mutate(channel.id)}
                      disabled={deleteChannelMutation.isPending}
                      className="w-full"
                      data-testid={`button-delete-channel-${channel.id}`}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Channel
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
        )}
      </div>
    </div>
  );
}
