
import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            {language === 'ru' ? 'Новая покупка!' : 'New Purchase!'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">
              {language === 'ru' ? 'Покупатель:' : 'Buyer:'}
            </p>
            <p className="font-bold text-blue-500">@{buyerUsername}</p>
          </div>

          <div className="p-4 bg-card border border-card-border rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">
              {language === 'ru' ? 'Канал:' : 'Channel:'}
            </p>
            <p className="font-bold">{channelName}</p>
          </div>

          <div className="flex items-center justify-center gap-2 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
            <Clock className="w-5 h-5 text-orange-500" />
            <span className="text-2xl font-bold text-orange-500">{timeLeft}</span>
          </div>

          <div className="p-4 bg-card border border-card-border rounded-lg space-y-2">
            <p className="text-sm font-medium">
              {language === 'ru' ? 'Инструкции:' : 'Instructions:'}
            </p>
            <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
              <li>{language === 'ru' ? 'Дождитесь, пока покупатель зайдет в ваш канал' : 'Wait for the buyer to join your channel'}</li>
              <li>{language === 'ru' ? 'Передайте владельца канала этому человеку' : 'Transfer channel ownership to this person'}</li>
              <li className="text-red-500 font-medium">
                {language === 'ru' 
                  ? '⚠️ НЕ УДАЛЯЙТЕ БОТА ИЗ АДМИНИСТРАТОРОВ, иначе не получите деньги!' 
                  : '⚠️ DO NOT REMOVE THE BOT FROM ADMINS or you won\'t receive payment!'}
              </li>
            </ol>
          </div>

          <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-muted-foreground">
              {language === 'ru' 
                ? 'Передача канала подтверждается после того, как подтвердят обе стороны' 
                : 'Channel transfer is confirmed after both parties confirm'}
            </p>
          </div>

          <Button
            onClick={() => confirmMutation.mutate()}
            disabled={confirmMutation.isPending || confirmed}
            className="w-full"
          >
            {confirmed 
              ? (language === 'ru' ? 'Ожидание покупателя...' : 'Waiting for buyer...') 
              : (language === 'ru' ? 'Подтвердить передачу' : 'Confirm Transfer')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
