import { useState, useEffect } from "react";
import { Copy, CheckCircle2, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

  return (
    <div className="h-screen bg-background text-foreground flex flex-col">
      <TopHeader />

      <div className="flex-1 flex flex-col">
        <div className="px-4 py-4 border-b border-border flex-shrink-0">
          <h1 className="text-xl font-semibold text-foreground" data-testid="text-title">
            {t.profile.title}
          </h1>
        </div>

        <div className="px-4 py-6 space-y-6 pb-24 overflow-y-auto flex-1">
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
      </div>

      <BottomNav activeTab="profile" />
    </div>
  );
}