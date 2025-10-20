import { Home, Megaphone, CheckSquare } from "lucide-react";
import { useState } from "react";

type NavItem = "store" | "myads" | "tasks";

interface BottomNavProps {
  activeTab?: NavItem;
  onTabChange?: (tab: NavItem) => void;
}

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const [internalActive, setInternalActive] = useState<NavItem>("store");
  const activeNav = activeTab || internalActive;

  const navItems = [
    { id: "store" as NavItem, label: "Store", icon: Home },
    { id: "myads" as NavItem, label: "My Ads", icon: Megaphone },
    { id: "tasks" as NavItem, label: "Tasks", icon: CheckSquare },
  ];

  const handleClick = (id: NavItem) => {
    setInternalActive(id);
    onTabChange?.(id);
    console.log(`Navigation: ${id}`);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeNav === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleClick(item.id)}
              className="flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors"
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
