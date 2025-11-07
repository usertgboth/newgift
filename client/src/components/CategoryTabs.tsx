export type CategoryTab = "gifts" | "channels";

interface CategoryTabsProps {
  activeTab: CategoryTab;
  onTabChange: (tab: CategoryTab) => void;
}

export default function CategoryTabs({ activeTab, onTabChange }: CategoryTabsProps) {
  return (
    <div className="px-3 sm:px-4 pb-3">
      <div className="flex gap-2 bg-card/30 p-1 rounded-xl border border-card-border">
        <button
          onClick={() => onTabChange("gifts")}
          className={`flex-1 py-2.5 px-4 rounded-lg text-sm sm:text-base font-medium transition-all duration-200 ${
            activeTab === "gifts"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-card/50"
          }`}
          data-testid="tab-gifts"
        >
          Gifts
        </button>
        <button
          onClick={() => onTabChange("channels")}
          className={`flex-1 py-2.5 px-4 rounded-lg text-sm sm:text-base font-medium transition-all duration-200 ${
            activeTab === "channels"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-card/50"
          }`}
          data-testid="tab-channels"
        >
          Channels
        </button>
      </div>
    </div>
  );
}
