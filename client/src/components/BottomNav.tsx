import { Home, Megaphone, CheckSquare, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

type NavItem = "store" | "myads" | "tasks" | "profile";

interface BottomNavProps {
  activeTab?: NavItem;
  onTabChange?: (tab: NavItem) => void;
}

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const { t } = useLanguage();
  
  const navItems = [
    { id: "store" as NavItem, label: t.nav.store, icon: Home },
    { id: "myads" as NavItem, label: t.nav.myAds, icon: Megaphone },
    { id: "tasks" as NavItem, label: t.nav.tasks, icon: CheckSquare },
    { id: "profile" as NavItem, label: t.nav.profile, icon: User },
  ];

  const handleClick = (id: NavItem) => {
    onTabChange?.(id);
    console.log(`Navigation: ${id}`);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950 via-slate-900 to-slate-900/95 backdrop-blur-xl border-t border-white/5 z-50 safe-area-bottom shadow-2xl">
      <div className="flex items-center justify-around h-[72px] sm:h-20 px-1 sm:px-2 pb-1.5 sm:pb-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleClick(item.id)}
              className={`flex flex-col items-center justify-center gap-1.5 sm:gap-2 flex-1 h-full transition-all duration-300 rounded-2xl mx-0.5 sm:mx-1 relative ${
                isActive ? "bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30" : "hover:bg-white/5"
              }`}
              data-testid={`button-nav-${item.id}`}
            >
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl animate-pulse"></div>
              )}
              <Icon
                className={`w-6 h-6 sm:w-7 sm:h-7 transition-all duration-300 relative z-10 ${
                  isActive ? "text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" : "text-slate-400"
                }`}
              />
              <span
                className={`text-[10px] sm:text-xs font-bold transition-all duration-300 relative z-10 ${
                  isActive ? "text-blue-400" : "text-slate-400"
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