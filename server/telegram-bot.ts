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
          `👋 Welcome, Administrator!\n\n✅ You will receive notifications about all platform activities.\n\n📋 Available commands:\n/help - Command list\n/stats - Platform statistics\n/balance - Your balance\n/myads - Your listings\n/admin - Admin panel`,
          { parse_mode: 'HTML' }
        );
      } else {
        // Use Replit URL for the web app
        const replSlug = process.env.REPL_SLUG || '4a6a4d09-c68b-481c-9974-30fc162da62a-00-35hnxvckxlwnb.riker';
        const appUrl = `https://${replSlug}.replit.dev`;
        
        await this.bot.sendMessage(
          chatId,
          `🚀 Welcome to Telegram Marketplace!\n\n📱 Buy and sell channels\n💰 Secure transactions with guarantee\n🛡️ Protection for buyers and sellers`,
          {
            parse_mode: 'HTML',
            reply_markup: {
              inline_keyboard: [
                [{ text: '🌐 Open Marketplace', url: appUrl }]
              ]
            }
          }
        );
      }
    });

    // Handle /help command (admin only)
    this.bot.onText(/\/help/, async (msg) => {
      const chatId = msg.chat.id;
      const username = msg.from?.username;
      
      if (username !== ADMIN_USERNAME) {
        return; // Ignore for non-admin users
      }
      
      const helpText = `📚 <b>Help - Administrator</b>\n\n/start - Start working with bot\n/help - Show this help\n/stats - Platform statistics\n/balance - Check balance\n/myads - My listings\n/admin - Admin panel\n\n🔑 You receive notifications about all platform activities.`;
      
      await this.bot.sendMessage(chatId, helpText, { parse_mode: 'HTML' });
    });

    // Handle /stats command (admin only)
    this.bot.onText(/\/stats/, async (msg) => {
      const chatId = msg.chat.id;
      const username = msg.from?.username;
      
      if (username !== ADMIN_USERNAME) {
        return; // Ignore for non-admin users
      }
      
      try {
        const users = await storage.getAllUsers();
        const channels = await storage.getAllChannels();
        const activityLogs = await storage.getAllActivityLogs(10);
        
        const statsText = `📊 <b>Platform Statistics</b>\n\n👥 Users: ${users.length}\n📢 Listings: ${channels.length}\n📝 Recent activities: ${activityLogs.length}\n\n🕐 Updated: ${new Date().toLocaleString('en-US')}`;
        
        await this.bot.sendMessage(chatId, statsText, { parse_mode: 'HTML' });
      } catch (error) {
        console.error('Error fetching stats:', error);
        await this.bot.sendMessage(chatId, '❌ Error fetching statistics');
      }
    });

    // Handle /balance command (admin only)
    this.bot.onText(/\/balance/, async (msg) => {
      const chatId = msg.chat.id;
      const username = msg.from?.username;
      const telegramId = msg.from?.id.toString();
      
      if (username !== ADMIN_USERNAME) {
        return; // Ignore for non-admin users
      }
      
      console.log(`📊 /balance command from user ${telegramId}`);
      
      if (!telegramId) {
        await this.bot.sendMessage(chatId, '❌ Unable to determine your ID');
        return;
      }
      
      try {
        const user = await storage.getUserByTelegramId(telegramId);
        
        if (!user) {
          console.log(`⚠️  User with telegramId ${telegramId} not found in database`);
          await this.bot.sendMessage(
            chatId, 
            '❌ User not found in system.\n\nPlease open the LootGifts app at least once to create an account.',
            { parse_mode: 'HTML' }
          );
          return;
        }
        
        console.log(`✅ User found: ${user.username}, balance: ${user.balance}`);
        
        const balanceText = `💰 <b>Your Balance</b>\n\n💵 ${user.balance} TON\n👤 ${user.username}`;
        await this.bot.sendMessage(chatId, balanceText, { parse_mode: 'HTML' });
      } catch (error) {
        console.error('❌ Error fetching balance:', error);
        await this.bot.sendMessage(chatId, '❌ Error fetching balance. Please try again later.');
      }
    });

    // Handle /myads command (admin only)
    this.bot.onText(/\/myads/, async (msg) => {
      const chatId = msg.chat.id;
      const username = msg.from?.username;
      const telegramId = msg.from?.id.toString();
      
      if (username !== ADMIN_USERNAME) {
        return; // Ignore for non-admin users
      }
      
      if (!telegramId) {
        await this.bot.sendMessage(chatId, '❌ Unable to determine your ID');
        return;
      }
      
      try {
        const user = await storage.getUserByTelegramId(telegramId);
        if (!user) {
          await this.bot.sendMessage(chatId, '❌ User not found');
          return;
        }
        
        const allChannels = await storage.getAllChannels();
        const myChannels = allChannels.filter(ch => ch.ownerId === user.id);
        
        if (myChannels.length === 0) {
          await this.bot.sendMessage(chatId, '📭 You have no listings yet');
          return;
        }
        
        let adsText = `📢 <b>Your Listings (${myChannels.length})</b>\n\n`;
        myChannels.slice(0, 5).forEach((channel, idx) => {
          adsText += `${idx + 1}. ${channel.channelName || 'No name'}\n💰 ${channel.price} TON\n\n`;
        });
        
        if (myChannels.length > 5) {
          adsText += `... and ${myChannels.length - 5} more listings`;
        }
        
        await this.bot.sendMessage(chatId, adsText, { parse_mode: 'HTML' });
      } catch (error) {
        console.error('Error fetching ads:', error);
        await this.bot.sendMessage(chatId, '❌ Error fetching listings');
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
