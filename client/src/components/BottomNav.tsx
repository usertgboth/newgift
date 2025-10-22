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
    <nav className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border z-50">
      <div className="flex items-center justify-around h-20 px-2 pb-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleClick(item.id)}
              className={`flex flex-col items-center justify-center gap-2 flex-1 h-full transition-all duration-200 rounded-lg mx-1 ${
                isActive ? "bg-primary/10" : "hover:bg-muted/50"
              }`}
              data-testid={`button-nav-${item.id}`}
            >
              <Icon
                className={`w-6 h-6 transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              />
              <span
                className={`text-[11px] font-medium transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
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
