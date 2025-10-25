
import { useEffect, useState } from "react";
import banner1 from "@assets/photo_2025-10-21_17-01-20_1761391349387.png";
import banner2 from "@assets/photo_2025-10-21_17-01-23_1761391347603.png";

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
      <div className="relative overflow-hidden rounded-2xl h-32 sm:h-40">
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

        {/* Dots indicator */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBanner(index)}
              className={`h-2 rounded-full transition-all ${
                currentBanner === index
                  ? "bg-white w-4"
                  : "bg-white/50 w-2"
              }`}
              aria-label={`Go to banner ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
