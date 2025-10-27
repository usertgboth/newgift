import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle2, AlertCircle, Info, User, Package } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';

interface BuyerNotificationProps {
  open: boolean;
  onClose: () => void;
  purchaseId: string;
  sellerUsername: string;
  channelName: string;
  channelLink: string;
  expiresAt: Date;
  price: string;
}

export default function BuyerNotification({
  open,
  onClose,
  purchaseId,
  sellerUsername,
  channelName,
  channelLink,
  expiresAt,
  price,
}: BuyerNotificationProps) {
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
      const res = await fetch(`/api/purchases/${purchaseId}/confirm-buyer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        throw new Error('Failed to confirm');
      }

      return res.json();
    },
    onSuccess: () => {
      setConfirmed(true);
      toast({
        title: language === 'ru' ? '✅ Подтверждено!' : '✅ Confirmed!',
        description: language === 'ru' 
          ? 'Ожидаем подтверждения от продавца' 
          : 'Waiting for seller confirmation',
      });
    },
    onError: () => {
      toast({
        title: language === 'ru' ? 'Ошибка' : 'Error',
        description: language === 'ru' 
          ? 'Не удалось подтвердить получение канала' 
          : 'Failed to confirm receipt',
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
            {language === 'ru' ? '🎉 Покупка успешна!' : '🎉 Purchase Successful!'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Информация о покупке */}
          <div className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-2 border-green-500/30 rounded-xl">
            <div className="flex items-start gap-3">
              <Package className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                  {language === 'ru' ? 'Ваша покупка обрабатывается' : 'Your purchase is being processed'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {language === 'ru' 
                    ? `Вы купили канал "${channelName}" за ${price} TON`
                    : `You purchased "${channelName}" for ${price} TON`}
                </p>
              </div>
            </div>
          </div>

          {/* Продавец */}
          <div className="p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-xl">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  {language === 'ru' ? 'Продавец:' : 'Seller:'}
                </p>
                <p className="text-lg font-bold text-blue-500">@{sellerUsername}</p>
              </div>
            </div>
          </div>

          {/* Таймер */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-red-500/5 to-orange-500/5 animate-pulse" />
            <div className="relative flex flex-col items-center justify-center gap-2 p-5 bg-gradient-to-br from-orange-500/10 to-red-500/10 border-2 border-orange-500/30 rounded-xl">
              <Clock className="w-6 h-6 text-orange-500" />
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">
                  {language === 'ru' ? 'Время на подтверждение' : 'Time to confirm'}
                </p>
                <span className="text-3xl font-bold text-orange-500 tabular-nums">{timeLeft}</span>
              </div>
            </div>
          </div>

          {/* Подробные инструкции */}
          <div className="p-5 bg-gradient-to-br from-purple-500/5 to-pink-500/5 border border-purple-500/20 rounded-xl space-y-4">
            <div className="flex items-center gap-2">
              <Info className="w-5 h-5 text-purple-500" />
              <p className="text-sm font-bold text-foreground">
                {language === 'ru' ? 'Что нужно сделать:' : 'What you need to do:'}
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center text-xs font-bold">1</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground mb-1">
                    {language === 'ru' ? 'Свяжитесь с продавцом' : 'Contact the seller'}
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {language === 'ru' 
                      ? 'Напишите продавцу @' + sellerUsername + ' в Telegram и сообщите ему о покупке'
                      : 'Message seller @' + sellerUsername + ' on Telegram and inform about the purchase'}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center text-xs font-bold">2</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground mb-1">
                    {language === 'ru' ? 'Зайдите в канал' : 'Join the channel'}
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                    {language === 'ru' 
                      ? 'Перейдите по ссылке и вступите в канал. Продавец добавит вас в администраторы.'
                      : 'Follow the link and join the channel. The seller will add you as admin.'}
                  </p>
                  <a
                    href={channelLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium rounded-lg transition-colors"
                  >
                    {language === 'ru' ? '🔗 Открыть канал' : '🔗 Open Channel'}
                  </a>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center text-xs font-bold">3</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground mb-1">
                    {language === 'ru' ? 'Получите права владельца' : 'Get owner rights'}
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {language === 'ru' 
                      ? 'Продавец передаст вам полные права владельца канала. Убедитесь, что вы получили все права.'
                      : 'The seller will transfer full ownership rights to you. Make sure you received all rights.'}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold">4</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground mb-1">
                    {language === 'ru' ? 'Подтвердите получение' : 'Confirm receipt'}
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {language === 'ru' 
                      ? 'После получения прав владельца, нажмите кнопку "Подтвердить получение канала" ниже.'
                      : 'After receiving owner rights, click the "Confirm Receipt" button below.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Важное предупреждение */}
          <div className="p-4 bg-red-500/10 border-2 border-red-500/30 rounded-xl">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <p className="text-sm font-bold text-red-600 dark:text-red-400">
                  {language === 'ru' ? '⚠️ ВАЖНО!' : '⚠️ IMPORTANT!'}
                </p>
                <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                  <li>
                    {language === 'ru' 
                      ? 'НЕ подтверждайте получение, пока не станете полноправным владельцем канала'
                      : 'DO NOT confirm until you become the full owner of the channel'}
                  </li>
                  <li>
                    {language === 'ru' 
                      ? 'НЕ удаляйте бота из администраторов канала'
                      : 'DO NOT remove the bot from channel admins'}
                  </li>
                  <li>
                    {language === 'ru' 
                      ? 'Проверьте все права доступа перед подтверждением'
                      : 'Check all access rights before confirming'}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Информация о подтверждении */}
          <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                {language === 'ru' 
                  ? 'Сделка завершится только после подтверждения от обеих сторон. Продавец получит деньги только после вашего подтверждения.'
                  : 'The deal will be completed only after confirmation from both parties. The seller will receive payment only after your confirmation.'}
              </p>
            </div>
          </div>

          {/* Кнопки действий */}
          <div className="flex gap-3">
            <Button
              onClick={() => {
                if (confirm(language === 'ru' ? 'Отклонить эту покупку?' : 'Reject this purchase?')) {
                  onClose();
                  toast({
                    title: language === 'ru' ? 'Покупка отклонена' : 'Purchase Rejected',
                    description: language === 'ru' ? 'Покупка была отклонена' : 'The purchase has been rejected',
                    variant: 'destructive',
                  });
                }
              }}
              variant="outline"
              className="flex-1 h-12 text-base font-bold border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
              data-testid="button-reject-buyer"
            >
              {language === 'ru' ? '❌ Отклонить' : '❌ Reject'}
            </Button>
            <Button
              onClick={() => confirmMutation.mutate()}
              disabled={confirmMutation.isPending || confirmed}
              className="flex-1 h-12 text-base font-bold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg"
              data-testid="button-confirm-buyer"
            >
              {confirmed 
                ? (language === 'ru' ? '✅ Подтверждено' : '✅ Confirmed') 
                : (language === 'ru' ? '✅ Подтвердить' : '✅ Confirm')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
