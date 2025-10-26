import { Home, Megaphone, CheckSquare, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "wouter";

type NavItem = "store" | "myads" | "tasks" | "profile";

interface BottomNavProps {
  activeTab?: NavItem;
  onTabChange?: (tab: NavItem) => void;
}

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const { t } = useLanguage();
  const [, navigate] = useLocation();
  
  const navItems = [
    { id: "store" as NavItem, label: t.nav.store, icon: Home, path: "/" },
    { id: "myads" as NavItem, label: t.nav.myAds, icon: Megaphone, path: "/myads" },
    { id: "tasks" as NavItem, label: t.nav.tasks, icon: CheckSquare, path: "/tasks" },
    { id: "profile" as NavItem, label: t.nav.profile, icon: User, path: "/profile" },
  ];

  const handleClick = (id: NavItem, path: string) => {
    onTabChange?.(id);
    navigate(path);
    console.log(`Navigation: ${id} -> ${path}`);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border z-50 safe-area-bottom">
      <div className="flex items-center justify-around h-[72px] sm:h-20 px-1 sm:px-2 pb-1.5 sm:pb-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleClick(item.id, item.path)}
              className={`flex flex-col items-center justify-center gap-1.5 sm:gap-2 flex-1 h-full transition-all duration-200 rounded-lg mx-0.5 sm:mx-1 ${
                isActive ? "bg-primary/10" : "hover:bg-muted/50"
              }`}
              data-testid={`button-nav-${item.id}`}
            >
              <Icon
                className={`w-6 h-6 sm:w-7 sm:h-7 transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              />
              <span
                className={`text-[10px] sm:text-xs font-medium transition-colors ${
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