
import { useEffect, useState } from "react";
import banner1 from "@assets/photo_2025-10-21_17-01-20_1761392183281.png";
import banner2 from "@assets/photo_2025-10-21_17-01-23_1761392181787.png";

export default function CashbackBanner() {
  const [currentBanner, setCurrentBanner] = useState(0);
  const banners = [banner1, banner2];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [banners.length]);

  return (
    <div className="px-3 sm:px-4 pt-3 pb-2">
      <div className="relative overflow-hidden rounded-2xl h-16 sm:h-20">
        <div
          className="flex h-full transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentBanner * 100}%)` }}
        >
          {banners.map((banner, index) => (
            <div key={index} className="min-w-full flex-shrink-0 h-full">
              <img
                src={banner}
                alt={`Promotional banner ${index + 1}`}
                className="w-full h-full rounded-2xl object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
