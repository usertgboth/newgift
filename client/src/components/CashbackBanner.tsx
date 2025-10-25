
import { useEffect, useState } from "react";
import banner1 from "@assets/dzyajn_1761334897223.jpg";
import banner2 from "@assets/dzyajn_1761390312644.jpg";

export default function CashbackBanner() {
  const [currentBanner, setCurrentBanner] = useState(0);
  const banners = [banner1, banner2];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 3000); // Change banner every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="px-3 sm:px-4 pt-3 pb-2">
      <div className="relative overflow-hidden rounded-2xl">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentBanner * 100}%)` }}
        >
          {banners.map((banner, index) => (
            <div key={index} className="min-w-full flex-shrink-0">
              <img
                src={banner}
                alt={`Promotional banner ${index + 1}`}
                className="w-full h-auto rounded-2xl object-cover"
              />
            </div>
          ))}
        </div>

        {/* Dots indicator */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBanner(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                currentBanner === index
                  ? "bg-white w-4"
                  : "bg-white/50"
              }`}
              aria-label={`Go to banner ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
