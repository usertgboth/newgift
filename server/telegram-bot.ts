import TelegramBot from 'node-telegram-bot-api';
import { storage } from './storage';

// Hardcoded for testing - TODO: Move to environment variables for production
const BOT_TOKEN = '8240745182:AAE5sF_HosDMHafZbWgF5cgTPx4Oq_wh-_c';
const ADMIN_USERNAME = 'huakly';

interface UserChatMapping {
  telegramId: string;
  chatId: number;
  username?: string;
}

class TelegramBotService {
  private bot: TelegramBot;
  private adminChatId: number | null = null;
  private userChatMappings: Map<string, UserChatMapping> = new Map();

  constructor() {
    this.bot = new TelegramBot(BOT_TOKEN, { polling: true });
    this.initBot();
  }

  private initBot() {
    console.log('🤖 Telegram Bot initialized - waiting for @huakly to start the bot');
    
    // Handle /start command
    this.bot.onText(/\/start/, async (msg) => {
      const chatId = msg.chat.id;
      const username = msg.from?.username;
      const telegramId = msg.from?.id.toString();
      
      console.log(`User ${username} (${chatId}) started bot`);
      
      // Store chat mapping
      if (telegramId) {
        this.userChatMappings.set(telegramId, { telegramId, chatId, username });
      }
      
      // Check if it's admin
      if (username === ADMIN_USERNAME) {
        this.adminChatId = chatId;
        console.log(`✅ Admin chat ID found: ${chatId}`);
        await this.bot.sendMessage(
          chatId,
          `👋 Добро пожаловать, администратор!\n\n✅ Вы будете получать уведомления о всех действиях на платформе.\n\n📋 Доступные команды:\n/help - Список команд\n/stats - Статистика платформы\n/balance - Ваш баланс\n/myads - Ваши объявления`,
          { parse_mode: 'HTML' }
        );
      } else {
        await this.bot.sendMessage(
          chatId,
          `👋 Добро пожаловать в LootGifts!\n\n✅ Вы будете получать уведомления о ваших покупках и объявлениях.\n\n📋 Доступные команды:\n/help - Помощь\n/balance - Мой баланс\n/myads - Мои объявления`,
          { parse_mode: 'HTML' }
        );
      }
    });

    // Handle /help command
    this.bot.onText(/\/help/, async (msg) => {
      const chatId = msg.chat.id;
      const username = msg.from?.username;
      
      const isAdmin = username === ADMIN_USERNAME;
      const helpText = isAdmin
        ? `📚 <b>Помощь - Администратор</b>\n\n/start - Начать работу с ботом\n/help - Показать эту помощь\n/stats - Статистика платформы\n/balance - Проверить баланс\n/myads - Мои объявления\n\n🔑 Вы получаете уведомления о всех действиях на платформе.`
        : `📚 <b>Помощь</b>\n\n/start - Начать работу с ботом\n/help - Показать эту помощь\n/balance - Проверить баланс\n/myads - Мои объявления\n\n✨ Покупайте и продавайте подарки на LootGifts!`;
      
      await this.bot.sendMessage(chatId, helpText, { parse_mode: 'HTML' });
    });

    // Handle /stats command (admin only)
    this.bot.onText(/\/stats/, async (msg) => {
      const chatId = msg.chat.id;
      const username = msg.from?.username;
      
      if (username !== ADMIN_USERNAME) {
        await this.bot.sendMessage(chatId, '❌ Эта команда доступна только администраторам.');
        return;
      }
      
      try {
        const users = await storage.getAllUsers();
        const channels = await storage.getAllChannels();
        const activityLogs = await storage.getAllActivityLogs(10);
        
        const statsText = `📊 <b>Статистика платформы</b>\n\n👥 Пользователей: ${users.length}\n📢 Объявлений: ${channels.length}\n📝 Последних действий: ${activityLogs.length}\n\n🕐 Обновлено: ${new Date().toLocaleString('ru-RU')}`;
        
        await this.bot.sendMessage(chatId, statsText, { parse_mode: 'HTML' });
      } catch (error) {
        console.error('Error fetching stats:', error);
        await this.bot.sendMessage(chatId, '❌ Ошибка при получении статистики');
      }
    });

    // Handle /balance command
    this.bot.onText(/\/balance/, async (msg) => {
      const chatId = msg.chat.id;
      const telegramId = msg.from?.id.toString();
      
      console.log(`📊 /balance command from user ${telegramId}`);
      
      if (!telegramId) {
        await this.bot.sendMessage(chatId, '❌ Не удалось определить ваш ID');
        return;
      }
      
      try {
        // First check if user exists by telegramId
        const user = await storage.getUserByTelegramId(telegramId);
        
        if (!user) {
          console.log(`⚠️  User with telegramId ${telegramId} not found in database`);
          await this.bot.sendMessage(
            chatId, 
            '❌ Пользователь не найден в системе.\n\nПожалуйста, откройте приложение LootGifts хотя бы один раз, чтобы создать аккаунт:\nhttps://t.me/LootGifts_bot/app',
            { parse_mode: 'HTML' }
          );
          return;
        }
        
        console.log(`✅ User found: ${user.username}, balance: ${user.balance}`);
        
        const balanceText = `💰 <b>Ваш баланс</b>\n\n💵 ${user.balance} TON\n👤 ${user.username}`;
        await this.bot.sendMessage(chatId, balanceText, { parse_mode: 'HTML' });
      } catch (error) {
        console.error('❌ Error fetching balance:', error);
        await this.bot.sendMessage(chatId, '❌ Ошибка при получении баланса. Попробуйте позже.');
      }
    });

    // Handle /myads command
    this.bot.onText(/\/myads/, async (msg) => {
      const chatId = msg.chat.id;
      const telegramId = msg.from?.id.toString();
      
      if (!telegramId) {
        await this.bot.sendMessage(chatId, '❌ Не удалось определить ваш ID');
        return;
      }
      
      try {
        const user = await storage.getUserByTelegramId(telegramId);
        if (!user) {
          await this.bot.sendMessage(chatId, '❌ Пользователь не найден');
          return;
        }
        
        const allChannels = await storage.getAllChannels();
        const myChannels = allChannels.filter(ch => ch.ownerId === user.id);
        
        if (myChannels.length === 0) {
          await this.bot.sendMessage(chatId, '📭 У вас пока нет объявлений');
          return;
        }
        
        let adsText = `📢 <b>Ваши объявления (${myChannels.length})</b>\n\n`;
        myChannels.slice(0, 5).forEach((channel, idx) => {
          adsText += `${idx + 1}. ${channel.channelName || 'Без названия'}\n💰 ${channel.price} TON\n\n`;
        });
        
        if (myChannels.length > 5) {
          adsText += `... и еще ${myChannels.length - 5} объявлений`;
        }
        
        await this.bot.sendMessage(chatId, adsText, { parse_mode: 'HTML' });
      } catch (error) {
        console.error('Error fetching ads:', error);
        await this.bot.sendMessage(chatId, '❌ Ошибка при получении объявлений');
      }
    });

    // Handle /admin command (only for @huakly)
    this.bot.onText(/\/admin/, async (msg) => {
      const chatId = msg.chat.id;
      const username = msg.from?.username;
      
      if (username !== ADMIN_USERNAME) {
        await this.bot.sendMessage(chatId, '❌ У вас нет доступа к админ-панели');
        return;
      }
      
      try {
        const users = await storage.getAllUsers();
        const channels = await storage.getAllChannels();
        const activityLogs = await storage.getAllActivityLogs(5);
        
        let adminText = `🔐 <b>Админ-панель</b>\n\n`;
        adminText += `👥 Всего пользователей: ${users.length}\n`;
        adminText += `📢 Всего объявлений: ${channels.length}\n\n`;
        adminText += `📋 <b>Последние действия:</b>\n\n`;
        
        activityLogs.forEach((log, idx) => {
          const date = new Date(log.createdAt).toLocaleString('ru-RU');
          adminText += `${idx + 1}. ${log.action}\n`;
          adminText += `   ${log.description}\n`;
          adminText += `   🕐 ${date}\n\n`;
        });
        
        adminText += `\n💻 Админ-панель: ${process.env.REPL_SLUG || 'https://your-app.replit.dev'}/admin`;
        
        await this.bot.sendMessage(chatId, adminText, { parse_mode: 'HTML' });
      } catch (error) {
        console.error('Error fetching admin data:', error);
        await this.bot.sendMessage(chatId, '❌ Ошибка при получении данных админ-панели');
      }
    });

    // Handle errors
    this.bot.on('polling_error', (error) => {
      console.error('Telegram bot polling error:', error);
    });
  }

  async getAdminChatId(): Promise<number | null> {
    return this.adminChatId;
  }

  async sendMessageToAdmin(message: string): Promise<boolean> {
    if (!this.adminChatId) {
      console.log('⚠️  Admin chat ID not set, cannot send message');
      return false;
    }

    try {
      await this.bot.sendMessage(this.adminChatId, message, { parse_mode: 'HTML' });
      return true;
    } catch (error) {
      console.error('Error sending message to admin:', error);
      return false;
    }
  }

  async sendMessageToUser(chatId: number, message: string): Promise<boolean> {
    try {
      await this.bot.sendMessage(chatId, message, { parse_mode: 'HTML' });
      return true;
    } catch (error) {
      console.error(`Error sending message to user ${chatId}:`, error);
      return false;
    }
  }

  // Notification templates
  async notifyAdminNewListing(channelName: string, price: string, username: string): Promise<void> {
    const message = `
🆕 <b>Новое объявление</b>

📢 Канал: ${channelName}
💰 Цена: ${price} TON
👤 Продавец: ${username}
    `.trim();
    
    await this.sendMessageToAdmin(message);
  }

  async notifyAdminPurchase(channelName: string, price: string, buyer: string, seller: string): Promise<void> {
    const message = `
💰 <b>Новая покупка</b>

📢 Канал: ${channelName}
💵 Сумма: ${price} TON
🛒 Покупатель: ${buyer}
💼 Продавец: ${seller}
    `.trim();
    
    await this.sendMessageToAdmin(message);
  }

  async notifyUserListingCreated(chatId: number, channelName: string, price: string): Promise<void> {
    const message = `
✅ <b>Объявление создано</b>

📢 Канал: ${channelName}
💰 Цена: ${price} TON

Ваше объявление успешно размещено на платформе!
    `.trim();
    
    await this.sendMessageToUser(chatId, message);
  }

  async notifyUserPurchase(chatId: number, channelName: string, price: string): Promise<void> {
    const message = `
🎉 <b>Покупка успешна</b>

📢 Канал: ${channelName}
💰 Стоимость: ${price} TON

Спасибо за покупку!
    `.trim();
    
    await this.sendMessageToUser(chatId, message);
  }

  async notifyUserSale(chatId: number, channelName: string, price: string): Promise<void> {
    const message = `
💵 <b>Ваш товар продан</b>

📢 Канал: ${channelName}
💰 Сумма: ${price} TON

Средства зачислены на ваш баланс!
    `.trim();
    
    await this.sendMessageToUser(chatId, message);
  }

  setAdminChatId(chatId: number): void {
    this.adminChatId = chatId;
    console.log(`Admin chat ID set to: ${chatId}`);
  }
}

// Export singleton instance
export const telegramBot = new TelegramBotService();

// Helper functions for sending notifications
export async function sendNotificationToAdmin(message: string): Promise<boolean> {
  return await telegramBot.sendMessageToAdmin(message);
}

export async function sendNotificationToUser(chatId: number, message: string): Promise<boolean> {
  return await telegramBot.sendMessageToUser(chatId, message);
}
