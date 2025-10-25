import { Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import tonLogo from "@assets/toncoin_1760893904370.png";
import { useTelegramUser } from "@/hooks/use-telegram-user";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";

export default function TopHeader() {
  const { username, avatarLetter } = useTelegramUser();
  const { language, t } = useLanguage();
  const { toast } = useToast();
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [promoCode, setPromoCode] = useState("");

  const handleDeposit = () => {
    const amount = parseFloat(depositAmount);
    if (!amount || amount < 1) {
      toast({
        title: t.toast.error,
        description: language === 'ru' ? "Минимальная сумма депозита: 1 TON" : "Minimum deposit: 1 TON",
        variant: "destructive",
      });
      return;
    }

    let finalAmount = amount;
    if (promoCode.trim().toUpperCase() === "GIFT") {
      finalAmount = amount * 1.15;
      toast({
        title: t.toast.success,
        description: `${amount} TON + 15% ${language === 'ru' ? 'бонус' : 'bonus'} = ${finalAmount.toFixed(2)} TON`,
      });
    } else {
      toast({
        title: t.toast.success,
        description: `${language === 'ru' ? 'Депозит' : 'Deposited'} ${finalAmount.toFixed(2)} TON`,
      });
    }

    setIsDepositOpen(false);
    setDepositAmount("");
    setPromoCode("");
  };

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (!amount || amount < 1) {
      toast({
        title: t.toast.error,
        description: language === 'ru' ? "Минимальная сумма вывода: 1 TON" : "Minimum withdrawal: 1 TON",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: t.profile.suspiciousActivity,
      description: t.profile.withdrawalBlocked,
      variant: "destructive",
    });
    setIsWithdrawOpen(false);
    setWithdrawAmount("");
  };

  return (
    <>
      <header className="sticky top-0 z-50 flex items-center justify-between px-3 sm:px-4 py-3 sm:py-4 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 backdrop-blur-xl border-b border-white/5 shadow-xl">
        <div className="flex items-center gap-2 sm:gap-3" data-testid="text-title">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-blue-500/30 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
            <span className="text-base sm:text-lg font-bold text-white relative z-10">{avatarLetter}</span>
          </div>
          <span className="text-base sm:text-lg font-bold text-white">{username}</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 backdrop-blur-sm shadow-lg shadow-blue-500/5" data-testid="display-balance">
            <img src={tonLogo} alt="TON" className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover shadow-md" />
            <span className="text-sm sm:text-base font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">0 TON</span>
          </div>
          <Button
            size="icon"
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transition-all duration-300 hover:scale-105 active:scale-95 border border-green-400/20"
            data-testid="button-deposit"
            onClick={() => setIsDepositOpen(true)}
          >
            <Plus className="w-5 h-5 sm:w-6 sm:h-6 text-white drop-shadow-md" />
          </Button>
          <Button
            size="icon"
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transition-all duration-300 hover:scale-105 active:scale-95 border border-red-400/20"
            data-testid="button-withdraw"
            onClick={() => setIsWithdrawOpen(true)}
          >
            <Minus className="w-5 h-5 sm:w-6 sm:h-6 text-white drop-shadow-md" />
          </Button>
        </div>
      </header>

      <Dialog open={isDepositOpen} onOpenChange={setIsDepositOpen}>
        <DialogContent className="bg-card border-card-border rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-foreground text-xl">{t.profile.depositTitle}</DialogTitle>
          </DialogHeader>
          <div className="space-y-5 pt-2">
            <div>
              <Label htmlFor="deposit-amount" className="text-sm text-muted-foreground mb-3 block">
                {t.profile.amount}
              </Label>
              <div className="flex items-center gap-3 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-2xl p-4 border-2 border-blue-500/20">
                <img src={tonLogo} alt="TON" className="w-8 h-8 rounded-full flex-shrink-0" />
                <Input
                  id="deposit-amount"
                  type="number"
                  step="0.01"
                  min="1"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="1.00"
                  className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-lg font-semibold"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2 ml-1">{language === 'ru' ? 'Минимум: 1 TON' : 'Minimum: 1 TON'}</p>
            </div>

            <div>
              <Label htmlFor="promo-code" className="text-sm text-muted-foreground mb-3 block">
                {t.profile.promoCode}
              </Label>
              <Input
                id="promo-code"
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                placeholder={language === 'ru' ? 'Введите промокод' : 'Enter promo code'}
                className="uppercase bg-muted/50 border-border rounded-xl h-12 text-base"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsDepositOpen(false);
                  setDepositAmount("");
                  setPromoCode("");
                }}
                className="flex-1 h-12 rounded-xl"
              >
                {t.profile.cancel}
              </Button>
              <Button
                onClick={handleDeposit}
                className="flex-1 h-12 rounded-xl bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 shadow-lg shadow-green-500/25"
              >
                {t.profile.confirm}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isWithdrawOpen} onOpenChange={setIsWithdrawOpen}>
        <DialogContent className="bg-card border-card-border rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-foreground text-xl">{t.profile.withdrawTitle}</DialogTitle>
          </DialogHeader>
          <div className="space-y-5 pt-2">
            <div>
              <Label htmlFor="withdraw-amount" className="text-sm text-muted-foreground mb-3 block">
                {t.profile.amount}
              </Label>
              <div className="flex items-center gap-3 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-2xl p-4 border-2 border-red-500/20">
                <img src={tonLogo} alt="TON" className="w-8 h-8 rounded-full flex-shrink-0" />
                <Input
                  id="withdraw-amount"
                  type="number"
                  step="0.01"
                  min="1"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="1.00"
                  className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-lg font-semibold"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2 ml-1">{language === 'ru' ? 'Минимум: 1 TON' : 'Minimum: 1 TON'}</p>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsWithdrawOpen(false);
                  setWithdrawAmount("");
                }}
                className="flex-1 h-12 rounded-xl"
              >
                {t.profile.cancel}
              </Button>
              <Button
                onClick={handleWithdraw}
                className="flex-1 h-12 rounded-xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 shadow-lg shadow-red-500/25"
              >
                {t.profile.confirm}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}