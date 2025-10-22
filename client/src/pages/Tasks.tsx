import { useState } from "react";
import { CheckCircle2, Circle, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import TopHeader from "@/components/TopHeader";
import BottomNav from "@/components/BottomNav";
import { useToast } from "@/hooks/use-toast";
import tonLogo from "@assets/toncoin_1760893904370.png";

//todo: remove mock functionality
interface Task {
  id: string;
  title: string;
  description: string;
  reward: string;
  completed: boolean;
}

const mockTasks: Task[] = [
  {
    id: "1",
    title: "Create first listing",
    description: "Add your first NFT to the marketplace",
    reward: "5",
    completed: false,
  },
  {
    id: "2",
    title: "Invite a friend",
    description: "Share the link with a friend",
    reward: "10",
    completed: false,
  },
  {
    id: "3",
    title: "Make a purchase",
    description: "Buy any NFT in the store",
    reward: "3",
    completed: false,
  },
  {
    id: "4",
    title: "Daily check-in",
    description: "Open the app every day",
    reward: "2",
    completed: false,
  },
  {
    id: "5",
    title: "Share on social media",
    description: "Tell about LootGifts on social networks",
    reward: "7",
    completed: false,
  },
];

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const { toast } = useToast();

  const handleClaimReward = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: true } : task
    ));
    
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      toast({
        title: "Reward claimed!",
        description: `+${task.reward} TON added to balance`,
      });
    }
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const totalReward = tasks.filter(t => t.completed).reduce((sum, t) => sum + parseFloat(t.reward), 0);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopHeader />
      
      <div className="px-4 py-6 pb-24">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold text-foreground" data-testid="text-title">
            Tasks
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
              <p className="text-sm text-muted-foreground">Total earned</p>
              <div className="flex items-center gap-1.5 mt-1">
                <img src={tonLogo} alt="TON" className="w-4 h-4 rounded-full object-cover" />
                <span className="text-lg font-semibold text-foreground" data-testid="text-total-reward">
                  {totalReward.toFixed(2)} TON
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
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
                    {task.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {task.description}
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
                        Claim
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
