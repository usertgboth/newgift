import { useEffect, useState } from "react";
import banner1 from "@assets/photo_2025-10-21_17-01-20_1761392183281.png";
import banner2 from "@assets/photo_2025-10-21_17-01-23_1761392181787.png";
import cashbackBanner from "@assets/image_1762683706447.png";

export default function CashbackBanner() {
  return (
    <div className="w-full px-3 pt-3 pb-2">
      <div className="relative w-full h-24 sm:h-32 md:h-36 overflow-hidden rounded-lg bg-card">
        <img
          src={cashbackBanner}
          alt="15% Cashback - 7.5% for seller, 7.5% for buyer"
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
    </div>
  );
}