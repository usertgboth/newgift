import { Home, Megaphone, CheckSquare } from "lucide-react";

type NavItem = "store" | "myads" | "tasks";

interface BottomNavProps {
  activeTab?: NavItem;
  onTabChange?: (tab: NavItem) => void;
}

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const navItems = [
    { id: "store" as NavItem, label: "Store", icon: Home },
    { id: "myads" as NavItem, label: "My Ads", icon: Megaphone },
    { id: "tasks" as NavItem, label: "Tasks", icon: CheckSquare },
  ];

  const handleClick = (id: NavItem) => {
    onTabChange?.(id);
    console.log(`Navigation: ${id}`);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t border-border safe-area-bottom animate-in slide-in-from-bottom duration-500">
      <div className="flex justify-around items-center h-16 sm:h-20 px-2">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleClick(item.id)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-3 sm:px-4 py-2 rounded-xl transition-all duration-300 min-w-[60px] sm:min-w-[80px] relative group",
                isActive
                  ? "text-primary bg-primary/10 shadow-lg shadow-primary/20 scale-105"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50 hover:scale-105"
              )}
              data-testid={`tab-${item.id}`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {isActive && (
                <div className="absolute inset-0 bg-primary/5 rounded-xl animate-pulse" />
              )}
              <Icon
                className={cn(
                  "w-5 h-5 sm:w-6 sm:h-6 transition-all duration-300 relative z-10",
                  isActive && "animate-in zoom-in-0 duration-300"
                )}
              />
              <span
                className={cn(
                  "text-xs sm:text-sm font-medium transition-all duration-300 relative z-10",
                  isActive && "font-bold"
                )}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}