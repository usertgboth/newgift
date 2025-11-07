import { useState } from "react";
import TopHeader from "@/components/TopHeader";
import CashbackBanner from "@/components/CashbackBanner";
import FilterBar from "@/components/FilterBar";
import SearchBar from "@/components/SearchBar";
import CategoryTabs, { type CategoryTab } from "@/components/CategoryTabs";
import GiftFilters from "@/components/GiftFilters";
import { type SortOption } from "@/components/SortPanel";
import NFTGrid from "@/components/NFTGrid";
import BottomNav from "@/components/BottomNav";
import MyAds from "./MyAds";
import Tasks from "./Tasks";
import Profile from "./Profile";

type Page = "store" | "myads" | "tasks" | "profile";

export default function Home() {
  const [currentPage, setCurrentPage] = useState<Page>("store");
  const [categoryTab, setCategoryTab] = useState<CategoryTab>("gifts");
  const [searchQuery, setSearchQuery] = useState("");
  const [giftFilter, setGiftFilter] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>("newest");

  if (currentPage === "myads") {
    return (
      <div className="min-h-screen bg-background text-foreground telegram-mini-app pb-20 sm:pb-24">
        <MyAds />
        <BottomNav activeTab={currentPage} onTabChange={setCurrentPage} />
      </div>
    );
  }

  if (currentPage === "tasks") {
    return (
      <div className="min-h-screen bg-background text-foreground telegram-mini-app pb-20 sm:pb-24">
        <Tasks />
        <BottomNav activeTab={currentPage} onTabChange={setCurrentPage} />
      </div>
    );
  }

  if (currentPage === "profile") {
    return (
      <div className="min-h-screen bg-background text-foreground telegram-mini-app pb-20 sm:pb-24">
        <Profile />
        <BottomNav activeTab={currentPage} onTabChange={setCurrentPage} />
      </div>
    );
  }

  return (
    <div className="h-screen bg-background text-foreground flex flex-col">
      <TopHeader />
      <div className="flex-1 overflow-y-auto overflow-x-hidden pb-20 sm:pb-24" style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-y' }}>
        <CashbackBanner />
        {categoryTab === "channels" && (
          <FilterBar
            onGiftFilterChange={setGiftFilter}
          />
        )}
        <SearchBar
          onSearchChange={setSearchQuery}
          onSortChange={setSortOption}
        />
        <CategoryTabs
          activeTab={categoryTab}
          onTabChange={setCategoryTab}
        />
        <NFTGrid
          categoryTab={categoryTab}
          searchQuery={searchQuery}
          giftFilter={giftFilter}
          sortOption={sortOption}
        />
      </div>
      <BottomNav activeTab={currentPage} onTabChange={setCurrentPage} />
    </div>
  );
}