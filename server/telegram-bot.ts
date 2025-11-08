import TelegramBot from 'node-telegram-bot-api';

// Hardcoded for testing - TODO: Move to environment variables for production
const BOT_TOKEN = '8240745182:AAE5sF_HosDMHafZbWgF5cgTPx4Oq_wh-_c';
const ADMIN_USERNAME = 'huakly';

class TelegramBotService {
  private bot: TelegramBot;
  private adminChatId: number | null = null;

  constructor() {
    this.bot = new TelegramBot(BOT_TOKEN, { polling: true });
    this.initBot();
  }

  private initBot() {
    console.log('🤖 Telegram Bot initialized');
    
    // Handle /start command
    this.bot.onText(/\/start/, async (msg) => {
      const chatId = msg.chat.id;
      const username = msg.from?.username;
      
      console.log(`User ${username} (${chatId}) started bot`);
      
      // Check if it's admin
      if (username === ADMIN_USERNAME) {
        this.adminChatId = chatId;
        console.log(`✅ Admin chat ID found: ${chatId}`);
        await this.bot.sendMessage(
          chatId,
          `👋 Добро пожаловать, администратор!\n\n✅ Вы будете получать уведомления о всех действиях на платформе.`
        );
      } else {
        await this.bot.sendMessage(
          chatId,
          `👋 Добро пожаловать в LootGifts!\n\n✅ Вы будете получать уведомления о ваших покупках и объявлениях.`
        );
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
