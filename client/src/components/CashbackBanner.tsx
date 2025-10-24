import { Gift } from "lucide-react";

export default function CashbackBanner() {
  return (
    <div className="px-3 sm:px-4 pt-3 pb-2">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 p-4 sm:p-5">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Gift className="w-6 h-6 sm:w-7 sm:h-7 text-white" strokeWidth={2.5} />
            </div>
          </div>
          <div className="flex-1">
            <div className="text-white font-bold text-xl sm:text-2xl mb-0.5">
              15% CASHBACK
            </div>
            <div className="text-white/90 text-xs sm:text-sm font-medium">
              7.5% FOR SELLER, 7.5% FOR BUYER
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
