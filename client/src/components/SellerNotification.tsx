
import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Clock, AlertCircle, CheckCircle2, User, Info, ShieldAlert } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';

interface SellerNotificationProps {
  open: boolean;
  onClose: () => void;
  purchaseId: string;
  buyerUsername: string;
  channelName: string;
  expiresAt: Date;
}

export default function SellerNotification({
  open,
  onClose,
  purchaseId,
  buyerUsername,
  channelName,
  expiresAt,
}: SellerNotificationProps) {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [timeLeft, setTimeLeft] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = new Date(expiresAt).getTime() - now;

      if (distance < 0) {
        setTimeLeft(language === 'ru' ? 'Время истекло' : 'Time expired');
        clearInterval(timer);
        return;
      }

      const hours = Math.floor(distance / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(`${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(timer);
  }, [expiresAt, language]);

  const confirmMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/purchases/${purchaseId}/confirm-seller`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        throw new Error('Failed to confirm transfer');
      }

      return res.json();
    },
    onSuccess: () => {
      setConfirmed(true);
      toast({
        title: language === 'ru' ? 'Ожидание покупателя' : 'Waiting for buyer',
        description: language === 'ru' 
          ? 'Ожидаем подтверждения от покупателя' 
          : 'Waiting for buyer confirmation',
      });
    },
    onError: () => {
      toast({
        title: language === 'ru' ? 'Ошибка' : 'Error',
        description: language === 'ru' 
          ? 'Не удалось подтвердить передачу' 
          : 'Failed to confirm transfer',
        variant: 'destructive',
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <CheckCircle2 className="w-6 h-6 text-green-500" />
            {language === 'ru' ? '🎉 Новая покупка!' : '🎉 New Purchase!'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Покупатель */}
          <div className="p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-xl">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  {language === 'ru' ? 'Покупатель:' : 'Buyer:'}
                </p>
                <p className="text-lg font-bold text-blue-500">@{buyerUsername}</p>
              </div>
            </div>
          </div>

          {/* Канал */}
          <div className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl">
            <p className="text-xs text-muted-foreground mb-2">
              {language === 'ru' ? 'Канал для передачи:' : 'Channel to transfer:'}
            </p>
            <p className="text-lg font-bold text-foreground">{channelName}</p>
          </div>

          {/* Таймер */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-red-500/5 to-orange-500/5 animate-pulse" />
            <div className="relative flex flex-col items-center justify-center gap-2 p-5 bg-gradient-to-br from-orange-500/10 to-red-500/10 border-2 border-orange-500/30 rounded-xl">
              <Clock className="w-6 h-6 text-orange-500" />
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">
                  {language === 'ru' ? 'Осталось времени' : 'Time remaining'}
                </p>
                <span className="text-3xl font-bold text-orange-500 tabular-nums">{timeLeft}</span>
              </div>
            </div>
          </div>

          {/* Подробные инструкции */}
          <div className="p-5 bg-gradient-to-br from-indigo-500/5 to-blue-500/5 border border-indigo-500/20 rounded-xl space-y-4">
            <div className="flex items-center gap-2">
              <Info className="w-5 h-5 text-indigo-500" />
              <p className="text-sm font-bold text-foreground">
                {language === 'ru' ? 'Что нужно сделать:' : 'What you need to do:'}
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs font-bold">1</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground mb-1">
                    {language === 'ru' ? 'Дождитесь покупателя' : 'Wait for the buyer'}
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {language === 'ru' 
                      ? 'Покупатель @' + buyerUsername + ' должен связаться с вами и вступить в ваш канал.'
                      : 'The buyer @' + buyerUsername + ' should contact you and join your channel.'}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs font-bold">2</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground mb-1">
                    {language === 'ru' ? 'Добавьте в администраторы' : 'Add as administrator'}
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {language === 'ru' 
                      ? 'Добавьте покупателя в администраторы канала с полными правами.'
                      : 'Add the buyer as a channel administrator with full rights.'}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs font-bold">3</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground mb-1">
                    {language === 'ru' ? 'Передайте права владельца' : 'Transfer ownership rights'}
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {language === 'ru' 
                      ? 'Передайте все права владельца канала покупателю. Это делается в настройках канала.'
                      : 'Transfer all channel ownership rights to the buyer. This is done in channel settings.'}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold">4</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground mb-1">
                    {language === 'ru' ? 'Подтвердите передачу' : 'Confirm the transfer'}
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {language === 'ru' 
                      ? 'После передачи прав, нажмите кнопку "Подтвердить передачу" ниже.'
                      : 'After transferring rights, click the "Confirm Transfer" button below.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Критичное предупреждение */}
          <div className="p-4 bg-red-500/10 border-2 border-red-500/30 rounded-xl">
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <p className="text-sm font-bold text-red-600 dark:text-red-400">
                  {language === 'ru' ? '⚠️ КРИТИЧНО ВАЖНО!' : '⚠️ CRITICALLY IMPORTANT!'}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {language === 'ru' 
                    ? 'НЕ УДАЛЯЙТЕ БОТА ИЗ АДМИНИСТРАТОРОВ КАНАЛА! Если вы удалите бота, деньги не будут зачислены на ваш баланс, и сделка будет отменена. Бот должен оставаться в администраторах для подтверждения передачи.'
                    : 'DO NOT REMOVE THE BOT FROM CHANNEL ADMINS! If you remove the bot, the money will not be credited to your balance and the deal will be cancelled. The bot must remain in admins to confirm the transfer.'}
                </p>
              </div>
            </div>
          </div>

          {/* Информация о двустороннем подтверждении */}
          <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                {language === 'ru' 
                  ? 'Сделка завершится только после подтверждения от обеих сторон. Вы получите деньги после того, как и вы, и покупатель подтвердите передачу канала.'
                  : 'The deal will be completed only after confirmation from both parties. You will receive payment after both you and the buyer confirm the channel transfer.'}
              </p>
            </div>
          </div>

          {/* Кнопка подтверждения */}
          <Button
            onClick={() => confirmMutation.mutate()}
            disabled={confirmMutation.isPending || confirmed}
            className="w-full h-12 text-base font-bold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg"
            data-testid="button-confirm-seller"
          >
            {confirmed 
              ? (language === 'ru' ? '✅ Подтверждено - Ожидание покупателя...' : '✅ Confirmed - Waiting for buyer...') 
              : (language === 'ru' ? '✅ Подтвердить передачу канала' : '✅ Confirm Channel Transfer')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
