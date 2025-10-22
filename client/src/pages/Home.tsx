import { useState } from "react";
import TopHeader from "@/components/TopHeader";
import TabNavigation from "@/components/TabNavigation";
import FilterBar from "@/components/FilterBar";
import SearchBar from "@/components/SearchBar";
import NFTGrid from "@/components/NFTGrid";
import BottomNav from "@/components/BottomNav";
import MyAds from "./MyAds";
import Tasks from "./Tasks";

type Page = "store" | "myads" | "tasks";

export default function Home() {
  const [currentPage, setCurrentPage] = useState<Page>("store");
  const [searchQuery, setSearchQuery] = useState("");
  const [giftFilter, setGiftFilter] = useState("");

  if (currentPage === "myads") {
    return (
      <div className="min-h-screen bg-background text-foreground telegram-mini-app">
        <MyAds />
        <BottomNav activeTab={currentPage} onTabChange={setCurrentPage} />
      </div>
    );
  }

  if (currentPage === "tasks") {
    return (
      <div className="min-h-screen bg-background text-foreground telegram-mini-app">
        <Tasks />
        <BottomNav activeTab={currentPage} onTabChange={setCurrentPage} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground telegram-mini-app">
      <TopHeader />
      <TabNavigation />
      <FilterBar onGiftFilterChange={setGiftFilter} />
      <SearchBar onSearchChange={setSearchQuery} />
      <NFTGrid searchQuery={searchQuery} giftFilter={giftFilter} />
      <BottomNav activeTab={currentPage} onTabChange={setCurrentPage} />
    </div>
  );
}
