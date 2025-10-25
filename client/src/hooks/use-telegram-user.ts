
import { useEffect, useState } from 'react';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
}

export function useTelegramUser() {
  const [user, setUser] = useState<TelegramUser | null>(null);

  useEffect(() => {
    // Check if Telegram WebApp is available
    if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
      const tg = (window as any).Telegram.WebApp;
      const tgUser = tg.initDataUnsafe?.user;
      
      if (tgUser) {
        setUser(tgUser);
      }
    }
  }, []);

  return {
    user,
    username: user?.username || user?.first_name || 'johndoe',
    avatarLetter: (user?.first_name?.[0] || user?.username?.[0] || 'J').toUpperCase(),
    photoUrl: user?.photo_url
  };
}
