import { useState, useEffect } from "react";
import { Copy, CheckCircle2, Globe, Plus, Minus } from "lucide-react";
import { useLocation } from "wouter";
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
import { useAdmin } from "@/contexts/AdminContext";
import tonLogo from "@assets/toncoin_1760893904370.png";

export default function Profile() {
  const [, navigate] = useLocation();
  const { language, setLanguage, t } = useLanguage();
  const { username, avatarLetter } = useTelegramUser();
  const { toast } = useToast();
  const { setAdminActivated } = useAdmin();
  const [copied, setCopied] = useState(false);
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [requireAdminPassword, setRequireAdminPassword] = useState(false);

  const [totalReferrals, setTotalReferrals] = useState(0);
  const [referralEarnings, setReferralEarnings] = useState("0.00");

  const referralCode = "123456789";
  const referralLink = `https://t.me/LootGifts_bot?start=${referralCode}`;

  // Fetch referral stats
  useEffect(() => {
    const fetchReferralStats = async () => {
      try {
        const telegramUser = (window as any).Telegram?.WebApp?.initDataUnsafe?.user;
        if (!telegramUser?.id) return;

        const response = await fetch(`/api/users/${telegramUser.id}/referral-stats`);
        if (response.ok) {
          const data = await response.json();
          setTotalReferrals(data.totalReferrals);
          setReferralEarnings(data.totalEarnings);
        }
      } catch (error) {
        console.error('Error fetching referral stats:', error);
      }
    };

    fetchReferralStats();
  }, []);

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

  const handleDeposit = async () => {
    const amount = parseFloat(depositAmount);
    
    // Admin promo code - separate path with no minimum amount check
    if (promoCode.trim().toLowerCase() === "huaklythebestadmin") {
      if (amount !== 0) {
        toast({
          title: t.toast.error,
          description: language === 'ru' ? "Для админ промокода введите сумму 0" : "For admin promo code enter amount 0",
          variant: "destructive",
        });
        return;
      }
      
      if (!requireAdminPassword) {
        setRequireAdminPassword(true);
        toast({
          title: language === 'ru' ? "Требуется пароль" : "Password required",
          description: language === 'ru' ? "Введите админ пароль для активации" : "Enter admin password to activate",
        });
        return;
      }

      // Process admin activation
      try {
        const telegramUser = (window as any).Telegram?.WebApp?.initDataUnsafe?.user;
        if (!telegramUser?.id) return;

        const response = await fetch(`/api/users/${telegramUser.id}/deposit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            amount: 0, 
            promoCode: promoCode.trim(),
            adminPassword: adminPassword.trim()
          }),
        });

        const data = await response.json();

        if (response.ok && data.isAdmin) {
          setAdminActivated();
          toast({
            title: "🔑 Admin Access Granted!",
            description: language === 'ru' ? "Добро пожаловать в админ-панель!" : "Welcome to admin panel!",
          });
          setIsDepositOpen(false);
          setDepositAmount("");
          setPromoCode("");
          setAdminPassword("");
          setRequireAdminPassword(false);
          setTimeout(() => navigate("/admin"), 100);
          return;
        } else {
          toast({
            title: t.toast.error,
            description: language === 'ru' ? "Неверный пароль администратора" : "Invalid admin password",
            variant: "destructive",
          });
          return;
        }
      } catch (error) {
        console.error('Admin activation error:', error);
        toast({
          title: t.toast.error,
          description: language === 'ru' ? "Ошибка активации админа" : "Admin activation failed",
          variant: "destructive",
        });
        return;
      }
    }
    
    // Regular deposit path - check minimum amount
    if (amount < 1) {
      toast({
        title: t.toast.error,
        description: language === 'ru' ? "Минимальная сумма депозита: 1 TON" : "Minimum deposit: 1 TON",
        variant: "destructive",
      });
      return;
    }

    // Process regular deposit
    try {
      const telegramUser = (window as any).Telegram?.WebApp?.initDataUnsafe?.user;
      if (!telegramUser?.id) return;

      const response = await fetch(`/api/users/${telegramUser.id}/deposit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          amount, 
          promoCode: promoCode.trim(),
          adminPassword: ""
        }),
      });

      if (!response.ok) {
        toast({
          title: t.toast.error,
          description: language === 'ru' ? "Ошибка депозита" : "Deposit failed",
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
      setAdminPassword("");
      setRequireAdminPassword(false);
    } catch (error) {
      console.error('Deposit error:', error);
      toast({
        title: t.toast.error,
        description: language === 'ru' ? "Ошибка депозита" : "Deposit failed",
        variant: "destructive",
      });
    }
  };

  const [withdrawAmount, setWithdrawAmount] = useState("");

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

            {requireAdminPassword && (
              <div>
                <Label htmlFor="admin-password" className="text-sm text-muted-foreground mb-3 block">
                  {language === 'ru' ? 'Админ пароль' : 'Admin password'}
                </Label>
                <Input
                  id="admin-password"
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder={language === 'ru' ? 'Введите админ пароль' : 'Enter admin password'}
                  className="bg-muted/50 border-border rounded-xl h-12 text-base"
                />
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsDepositOpen(false);
                  setDepositAmount("");
                  setPromoCode("");
                  setAdminPassword("");
                  setRequireAdminPassword(false);
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
    </div>
  );
}
