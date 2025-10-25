import { useState } from "react";
import { Copy, CheckCircle2, Globe, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import TopHeader from "@/components/TopHeader";
import BottomNav from "@/components/BottomNav";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTelegramUser } from "@/hooks/use-telegram-user";
import { useToast } from "@/hooks/use-toast";
import tonLogo from "@assets/toncoin_1760893904370.png";

export default function Profile() {
  const { language, setLanguage, t } = useLanguage();
  const { username, avatarLetter } = useTelegramUser();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [promoCode, setPromoCode] = useState("");

  const referralCode = "123456789";
  const referralLink = `https://t.me/LootGifts_bot?start=${referralCode}`;
  const totalReferrals = 0;
  const referralEarnings = "0.00";

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      toast({
        title: t.profile.linkCopied,
        duration: 2000,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDeposit = () => {
    const amount = parseFloat(depositAmount);
    if (!amount || amount <= 0) {
      toast({
        title: t.toast.error,
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    let finalAmount = amount;
    if (promoCode.trim().toUpperCase() === "GIFT") {
      finalAmount = amount * 1.15;
      toast({
        title: t.toast.success,
        description: `${amount} TON + 15% bonus = ${finalAmount.toFixed(2)} TON`,
      });
    } else {
      toast({
        title: t.toast.success,
        description: `Deposited ${finalAmount.toFixed(2)} TON`,
      });
    }

    setIsDepositOpen(false);
    setDepositAmount("");
    setPromoCode("");
  };

  const handleWithdraw = () => {
    toast({
      title: t.profile.suspiciousActivity,
      description: t.profile.withdrawalBlocked,
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <TopHeader />
      
      <div className="flex-1 px-4 py-6 pb-24 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-foreground" data-testid="text-title">
            {t.profile.title}
          </h1>
        </div>

        <Card className="bg-card border-card-border rounded-2xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">{avatarLetter}</span>
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-foreground">{username}</h2>
              <p className="text-sm text-muted-foreground">@{username.toLowerCase()}</p>
            </div>
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button 
              onClick={() => setIsDepositOpen(true)}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              data-testid="button-deposit"
            >
              <Plus className="w-4 h-4 mr-2" />
              {t.profile.deposit}
            </Button>
            <Button 
              onClick={() => setIsWithdrawOpen(true)}
              variant="outline"
              className="flex-1 border-red-500/30 text-red-500 hover:bg-red-500/10 hover:text-red-400"
              data-testid="button-withdraw"
            >
              <Minus className="w-4 h-4 mr-2" />
              {t.profile.withdraw}
            </Button>
          </div>
        </Card>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <span className="text-2xl">🎁</span>
            {t.profile.referralSystem}
          </h3>
          
          <Card className="bg-card border-card-border rounded-2xl p-5">
            <p className="text-sm text-muted-foreground mb-3">{t.profile.earnPercent}</p>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground mb-2 block">
                  {t.profile.referralLink}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={referralLink}
                    readOnly
                    className="flex-1 px-3 py-2 text-sm bg-muted border border-border rounded-lg text-foreground"
                    data-testid="input-referral-link"
                  />
                  <Button
                    onClick={handleCopyLink}
                    className="px-4 bg-primary hover:bg-primary/90"
                    data-testid="button-copy-link"
                  >
                    {copied ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-muted/50 rounded-xl p-4">
                  <p className="text-xs text-muted-foreground mb-1">{t.profile.referralsCount}</p>
                  <p className="text-2xl font-bold text-foreground" data-testid="text-referrals-count">
                    {totalReferrals}
                  </p>
                </div>
                <div className="bg-muted/50 rounded-xl p-4">
                  <p className="text-xs text-muted-foreground mb-1">{t.profile.referralEarnings}</p>
                  <div className="flex items-center gap-1.5">
                    <img src={tonLogo} alt="TON" className="w-4 h-4 rounded-full" />
                    <p className="text-2xl font-bold text-foreground" data-testid="text-referral-earnings">
                      {referralEarnings}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Globe className="w-5 h-5" />
            {t.profile.language}
          </h3>
          
          <Card className="bg-card border-card-border rounded-2xl p-5">
            <label className="text-sm text-muted-foreground mb-3 block">
              {t.profile.selectLanguage}
            </label>
            <Select value={language} onValueChange={(value) => setLanguage(value as any)}>
              <SelectTrigger className="w-full bg-muted border-border" data-testid="select-language">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en" data-testid="option-en">
                  🇬🇧 {t.profile.english}
                </SelectItem>
                <SelectItem value="ru" data-testid="option-ru">
                  🇷🇺 {t.profile.russian}
                </SelectItem>
              </SelectContent>
            </Select>
          </Card>
        </div>
      </div>

      <BottomNav activeTab="profile" />

      <Dialog open={isDepositOpen} onOpenChange={setIsDepositOpen}>
        <DialogContent className="bg-card border-card-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">{t.profile.depositTitle}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <Label htmlFor="deposit-amount" className="text-sm text-muted-foreground mb-2 block">
                {t.profile.amount}
              </Label>
              <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-2 border border-border">
                <img src={tonLogo} alt="TON" className="w-5 h-5 rounded-full flex-shrink-0" />
                <Input
                  id="deposit-amount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="0.00"
                  className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="promo-code" className="text-sm text-muted-foreground mb-2 block">
                {t.profile.promoCode}
              </Label>
              <Input
                id="promo-code"
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                placeholder="GIFT"
                className="uppercase bg-muted/50 border-border"
              />
              <p className="text-xs text-green-400 mt-1.5 font-medium">{t.profile.promoCodeBonus}</p>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsDepositOpen(false);
                  setDepositAmount("");
                  setPromoCode("");
                }}
                className="flex-1"
              >
                {t.profile.cancel}
              </Button>
              <Button
                onClick={handleDeposit}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {t.profile.confirm}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isWithdrawOpen} onOpenChange={setIsWithdrawOpen}>
        <DialogContent className="bg-card border-card-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">{t.profile.withdrawTitle}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-red-400 mb-2">{t.profile.suspiciousActivity}</h3>
              <p className="text-xs text-red-300">{t.profile.withdrawalBlocked}</p>
            </div>

            <Button
              onClick={() => setIsWithdrawOpen(false)}
              className="w-full"
            >
              {t.profile.cancel}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
