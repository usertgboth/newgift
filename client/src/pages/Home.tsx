import { useState } from "react";
import TopHeader from "@/components/TopHeader";
import CashbackBanner from "@/components/CashbackBanner";
import FilterBar from "@/components/FilterBar";
import SearchBar from "@/components/SearchBar";
import { type SortOption } from "@/components/SortPanel";
import NFTGrid from "@/components/NFTGrid";
import BottomNav from "@/components/BottomNav";
import MyAds from "./MyAds";
import Tasks from "./Tasks";
import Profile from "./Profile";

type Page = "store" | "myads" | "tasks" | "profile";

export default function Home() {
  const [currentPage, setCurrentPage] = useState<Page>("store");
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
    <div className="h-screen bg-background text-foreground telegram-mini-app flex flex-col overflow-hidden">
      <TopHeader />
      <CashbackBanner />
      <FilterBar
        selectedGifts={giftFilter}
        onGiftChange={setGiftFilter}
      />
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortOption={sortOption}
        onSortChange={setSortOption}
      />
      <div className="flex-1 overflow-y-auto pb-20 sm:pb-24" style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-y' }}>
        <NFTGrid
          searchQuery={searchQuery}
          giftFilter={giftFilter}
          sortOption={sortOption}
        />
      </div>
      <BottomNav activeTab={currentPage} onTabChange={setCurrentPage} />
    </div>
  );
}