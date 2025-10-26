import { useState, useEffect } from "react";
import { CheckCircle2, Circle, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import TopHeader from "@/components/TopHeader";
import BottomNav from "@/components/BottomNav";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { useTelegramUser } from "@/hooks/use-telegram-user";
import BuyerNotification from '@/components/BuyerNotification';
import tonLogo from "@assets/toncoin_1760893904370.png";
import type { User, Purchase } from '@shared/schema';

interface Task {
  id: string;
  titleKey: keyof typeof import("@/lib/i18n").translations.en.tasks;
  descriptionKey: string;
  reward: string;
  completed: boolean;
}

export default function Tasks() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const telegramUser = useTelegramUser();
  const [activePurchase, setActivePurchase] = useState<Purchase | null>(null);

  const { data: user } = useQuery<User>({
    queryKey: ["/api/user/me"],
  });

  const { data: channels = [] } = useQuery<Array<{
    id: string;
    channelName: string;
    telegramLink: string;
    price: string;
  }>>({
    queryKey: ["/api/channels"],
  });

  const { data: purchases = [] } = useQuery<Purchase[]>({
    queryKey: ['/api/purchases/buyer', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const res = await fetch(`/api/purchases/buyer/${user.id}`);
      if (!res.ok) return [];
      return res.json();
    },
    enabled: !!user?.id,
    refetchInterval: 5000,
  });

  useEffect(() => {
    const notifiedPurchase = purchases.find(p =>
      p.buyerNotifiedAt && !p.buyerConfirmed
    );
    if (notifiedPurchase) {
      setActivePurchase(notifiedPurchase);
    }
  }, [purchases]);

  const mockTasks: Task[] = [
    {
      id: "1",
      titleKey: "task1" as any,
      descriptionKey: "title",
      reward: "5",
      completed: false,
    },
    {
      id: "2",
      titleKey: "task2" as any,
      descriptionKey: "title",
      reward: "10",
      completed: false,
    },
    {
      id: "3",
      titleKey: "task3" as any,
      descriptionKey: "title",
      reward: "3",
      completed: false,
    },
    {
      id: "4",
      titleKey: "task4" as any,
      descriptionKey: "title",
      reward: "2",
      completed: false,
    },
    {
      id: "5",
      titleKey: "task5" as any,
      descriptionKey: "title",
      reward: "7",
      completed: false,
    },
  ];

  const [tasks, setTasks] = useState<Task[]>(mockTasks);

  const handleClaimReward = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: true } : task
    ));

    const task = tasks.find(t => t.id === taskId);
    if (task) {
      toast({
        title: t.toast.rewardClaimed,
        description: t.toast.tonAdded(task.reward),
      });
    }
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const totalReward = tasks.filter(t => t.completed).reduce((sum, t) => sum + parseFloat(t.reward), 0);

  const currentChannel = activePurchase ? channels.find(c => c.id === activePurchase.channelId) : null;

  return (
    <div className="h-screen bg-background text-foreground flex flex-col overflow-hidden">
      <TopHeader />

      {activePurchase && activePurchase.sellerCountdownExpiresAt && currentChannel && (
        <BuyerNotification
          open={true}
          onClose={() => setActivePurchase(null)}
          purchaseId={activePurchase.id}
          sellerUsername="seller_user"
          channelName={currentChannel.channelName}
          channelLink={currentChannel.telegramLink}
          expiresAt={new Date(activePurchase.sellerCountdownExpiresAt)}
          price={currentChannel.price}
        />
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="px-4 py-4 border-b border-border flex-shrink-0">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-semibold text-foreground" data-testid="text-title">
              {t.tasks.title}
            </h1>
            <div className="text-sm text-muted-foreground" data-testid="text-progress">
              {completedCount} / {tasks.length}
            </div>
          </div>

          <div className="bg-card border border-card-border rounded-2xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Gift className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">{t.tasks.totalEarned}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <img src={tonLogo} alt="TON" className="w-4 h-4 rounded-full object-cover" />
                  <span className="text-lg font-semibold text-foreground" data-testid="text-total-reward">
                    {totalReward.toFixed(2)} TON
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 py-6 space-y-4 pb-24 overflow-y-auto flex-1">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`bg-card border border-card-border rounded-xl p-4 transition-all ${
                task.completed ? 'opacity-60' : ''
              }`}
              data-testid={`task-${task.id}`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  {task.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  ) : (
                    <Circle className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1" data-testid={`text-task-title-${task.id}`}>
                    {(t.tasks[task.titleKey] as any).title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {(t.tasks[task.titleKey] as any).description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 rounded-full">
                      <img src={tonLogo} alt="TON" className="w-3.5 h-3.5 rounded-full object-cover" />
                      <span className="text-sm font-semibold text-primary" data-testid={`text-reward-${task.id}`}>
                        +{task.reward} TON
                      </span>
                    </div>

                    {!task.completed && (
                      <Button
                        size="sm"
                        className="bg-primary hover-elevate active-elevate-2"
                        onClick={() => handleClaimReward(task.id)}
                        data-testid={`button-claim-${task.id}`}
                      >
                        {t.tasks.claim}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav activeTab="tasks" />
    </div>
  );
}