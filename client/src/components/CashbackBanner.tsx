
import { useEffect, useState } from "react";
import banner1 from "@assets/photo_2025-10-21_17-01-20_1761392183281.png";
import banner2 from "@assets/photo_2025-10-21_17-01-23_1761392181787.png";

export default function CashbackBanner() {
  const [currentBanner, setCurrentBanner] = useState(0);
  const banners = [banner1, banner2];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full px-3 pt-3 pb-2">
      <div className="relative w-full h-24 sm:h-32 md:h-36 overflow-hidden rounded-lg bg-card">
        <div
          className="absolute inset-0 flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentBanner * 100}%)` }}
        >
          {banners.map((banner, index) => (
            <div key={index} className="flex-shrink-0 w-full h-full">
              <img
                src={banner}
                alt={`Banner ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
