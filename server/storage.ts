import { type User, type InsertUser, type Gift, type Channel, type InsertChannel, type Purchase, type InsertPurchase } from "@shared/schema";
import { AVAILABLE_GIFTS } from "@shared/gifts";
import { randomUUID } from "crypto";
import { db } from "../db/index";
import { gifts, channels, users, referrals, referralEarnings, purchases } from "@shared/schema";
import { eq, ilike, or } from "drizzle-orm";


export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getAllGifts(): Promise<Gift[]>;
  getGiftById(id: string): Promise<Gift | undefined>;

  getAllChannels(): Promise<(Channel & { giftName: string; giftImage: string; parsedGifts: any[] })[]>;
  getChannelById(id: string): Promise<(Channel & { giftName: string; giftImage: string; parsedGifts: any[] }) | undefined>;
  createChannel(channel: InsertChannel): Promise<Channel & { giftName: string; giftImage: string; parsedGifts: any[] }>;
  updateChannel(id: string, channel: Partial<InsertChannel>): Promise<(Channel & { giftName: string; giftImage: string; parsedGifts: any[] }) | undefined>;
  deleteChannel(id: string): Promise<boolean>;
  searchChannelsByGiftName(query: string): Promise<(Channel & { giftName: string; giftImage: string; parsedGifts: any[] })[]>;
  getUserByTelegramId(telegramId: string): Promise<User | null>;
  getReferralStats(userId: string): Promise<{ count: number; earnings: string }>;
  updateUserBalance(telegramId: string, amount: number): Promise<boolean>;
  
  setUserAdmin(userId: string, isAdmin: boolean): Promise<boolean>;
  getAllUsers(): Promise<User[]>;
  updateUserBalanceById(userId: string, amount: number): Promise<boolean>;
  
  createPurchase(purchase: InsertPurchase): Promise<Purchase>;
  getPurchaseById(id: string): Promise<Purchase | undefined>;
  getPurchasesByChannel(channelId: string): Promise<Purchase[]>;
  getPurchasesBySeller(sellerId: string): Promise<Purchase[]>;
  getPurchasesByBuyer(buyerId: string): Promise<Purchase[]>;
  updatePurchase(id: string, updates: Partial<Purchase>): Promise<Purchase | undefined>;
  updatePurchaseStatus(id: string, status: string): Promise<Purchase | undefined>;
  confirmPurchaseBuyer(id: string): Promise<Purchase | undefined>;
  confirmPurchaseSeller(id: string): Promise<Purchase | undefined>;
  setPurchaseBuyerNotified(id: string): Promise<Purchase | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private gifts: Map<string, Gift>;
  private channels: Map<string, Channel>;
  private purchases: Map<string, Purchase>;

  constructor() {
    this.users = new Map();
    this.gifts = new Map();
    this.channels = new Map();
    this.purchases = new Map();
    this.seedGifts();
    this.seedChannels();
  }

  private seedGifts() {
    AVAILABLE_GIFTS.forEach((gift) => {
      this.gifts.set(gift.id, gift);
    });
  }

  private seedChannels() {
    const now = new Date();
    const seedData: Channel[] = [
      {
        id: randomUUID(),
        channelName: "Bear Shop",
        telegramLink: "https://t.me/bears_shop",
        giftId: "box-of-chocolates",
        price: "29",
        ownerId: null,
        gifts: JSON.stringify([
          { giftId: "box-of-chocolates", quantity: 4 },
          { giftId: "cherry-cake", quantity: 2 },
          { giftId: "ice-cream-cone", quantity: 1 }
        ]),
        createdAt: now,
      },
      {
        id: randomUUID(),
        channelName: "Anna's Sweets",
        telegramLink: "https://t.me/anna_sweets",
        giftId: "cherry-cake",
        price: "10.49",
        ownerId: null,
        gifts: JSON.stringify([
          { giftId: "cherry-cake", quantity: 3 },
          { giftId: "gift-bag", quantity: 1 }
        ]),
        createdAt: now,
      },
      {
        id: randomUUID(),
        channelName: "Holiday Gifts",
        telegramLink: "https://t.me/holiday_gifts",
        giftId: "gift-bag",
        price: "15.99",
        ownerId: null,
        gifts: JSON.stringify([
          { giftId: "gift-bag", quantity: 5 },
          { giftId: "box-of-chocolates", quantity: 2 },
          { giftId: "ice-cream-cone", quantity: 3 },
          { giftId: "cherry-cake", quantity: 1 }
        ]),
        createdAt: now,
      },
      {
        id: randomUUID(),
        channelName: "Ice Cream Joy",
        telegramLink: "https://t.me/icecream_joy",
        giftId: "ice-cream-cone",
        price: "22.50",
        ownerId: null,
        gifts: JSON.stringify([
          { giftId: "ice-cream-cone", quantity: 2 }
        ]),
        createdAt: now,
      },
    ];

    seedData.forEach((channel) => {
      this.channels.set(channel.id, channel);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser,
      id,
      telegramId: insertUser.telegramId || null,
      avatarUrl: insertUser.avatarUrl || null,
      referredBy: insertUser.referredBy || null,
      language: insertUser.language || "en",
      referralCode: randomUUID().substring(0, 8),
      balance: "0.00",
      isAdmin: false,
      adminActivatedAt: null,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async getAllGifts(): Promise<Gift[]> {
    return Array.from(this.gifts.values());
  }

  async getGiftById(id: string): Promise<Gift | undefined> {
    return this.gifts.get(id);
  }

  async getAllChannels(): Promise<(Channel & { giftName: string; giftImage: string; parsedGifts: any[] })[]> {
    return Array.from(this.channels.values()).map(channel => {
      const gift = this.gifts.get(channel.giftId);
      let parsedGifts = [];
      try {
        parsedGifts = channel.gifts ? JSON.parse(channel.gifts) : [];
      } catch (e) {
        parsedGifts = [];
      }
      return {
        ...channel,
        giftName: gift?.name || "",
        giftImage: gift?.image || "",
        parsedGifts,
      };
    });
  }

  async getChannelById(id: string): Promise<(Channel & { giftName: string; giftImage: string; parsedGifts: any[] }) | undefined> {
    const channel = this.channels.get(id);
    if (!channel) return undefined;

    const gift = this.gifts.get(channel.giftId);
    let parsedGifts = [];
    try {
      parsedGifts = channel.gifts ? JSON.parse(channel.gifts) : [];
    } catch (e) {
      parsedGifts = [];
    }
    return {
      ...channel,
      giftName: gift?.name || "",
      giftImage: gift?.image || "",
      parsedGifts,
    };
  }

  async createChannel(insertChannel: InsertChannel): Promise<Channel & { giftName: string; giftImage: string; parsedGifts: any[] }> {
    const id = randomUUID();
    const channel: Channel = { 
      ...insertChannel,
      id,
      ownerId: insertChannel.ownerId ?? null,
      gifts: insertChannel.gifts ?? null,
      createdAt: new Date(),
    };
    this.channels.set(id, channel);

    const gift = this.gifts.get(channel.giftId);
    let parsedGifts = [];
    try {
      parsedGifts = channel.gifts ? JSON.parse(channel.gifts) : [];
    } catch (e) {
      parsedGifts = [];
    }
    return {
      ...channel,
      giftName: gift?.name || "",
      giftImage: gift?.image || "",
      parsedGifts,
    };
  }

  async updateChannel(id: string, updates: Partial<InsertChannel>): Promise<(Channel & { giftName: string; giftImage: string; parsedGifts: any[] }) | undefined> {
    const channel = this.channels.get(id);
    if (!channel) return undefined;

    const updated = { ...channel, ...updates };
    this.channels.set(id, updated);

    const gift = this.gifts.get(updated.giftId);
    let parsedGifts = [];
    try {
      parsedGifts = updated.gifts ? JSON.parse(updated.gifts) : [];
    } catch (e) {
      parsedGifts = [];
    }
    return {
      ...updated,
      giftName: gift?.name || "",
      giftImage: gift?.image || "",
      parsedGifts,
    };
  }

  async deleteChannel(id: string): Promise<boolean> {
    try {
      const result = await db.delete(channels).where(eq(channels.id, id));
      return result.rowCount !== null && result.rowCount > 0;
    } catch (error) {
      console.error('Error deleting channel:', error);
      return false;
    }
  }

  async searchChannelsByGiftName(query: string): Promise<(Channel & { giftName: string; giftImage: string; parsedGifts: any[] })[]> {
    const allChannels = await this.getAllChannels();
    return allChannels.filter(channel =>
      channel.giftName.toLowerCase().includes(query.toLowerCase()) ||
      channel.channelName.toLowerCase().includes(query.toLowerCase())
    );
  }

  async getUserByTelegramId(telegramId: string): Promise<User | null> {
    return Array.from(this.users.values()).find(
      (user) => user.telegramId === telegramId,
    ) || null;
  }

  async getReferralStats(userId: string): Promise<{ count: number; earnings: string }> {
    try {
      // Get referral count
      const referralCount = await db
        .select()
        .from(referrals)
        .where(eq(referrals.referrerId, userId));

      // Get total earnings from referrals
      const earnings = await db
        .select()
        .from(referralEarnings)
        .where(eq(referralEarnings.userId, userId));

      const totalEarnings = earnings.reduce((sum, earning) => {
        return sum + parseFloat(earning.amount);
      }, 0);

      return {
        count: referralCount.length,
        earnings: totalEarnings.toFixed(2),
      };
    } catch (error) {
      console.error('Error getting referral stats:', error);
      return { count: 0, earnings: "0.00" };
    }
  }

  async updateUserBalance(telegramId: string, amount: number): Promise<boolean> {
    const user = await this.getUserByTelegramId(telegramId);
    if (!user) return false;

    const currentBalance = parseFloat(user.balance);
    const newBalance = (currentBalance + amount).toFixed(2);
    
    user.balance = newBalance;
    this.users.set(user.id, user);
    
    return true;
  }

  async setUserAdmin(userId: string, isAdmin: boolean): Promise<boolean> {
    const user = this.users.get(userId);
    if (!user) return false;
    
    const updated = {
      ...user,
      isAdmin,
      adminActivatedAt: isAdmin ? new Date() : null,
    };
    this.users.set(userId, updated);
    return true;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async updateUserBalanceById(userId: string, amount: number): Promise<boolean> {
    const user = this.users.get(userId);
    if (!user) return false;

    const currentBalance = parseFloat(user.balance);
    const newBalance = (currentBalance + amount).toFixed(2);
    
    const updated = { ...user, balance: newBalance };
    this.users.set(userId, updated);
    return true;
  }

  async createPurchase(insertPurchase: InsertPurchase): Promise<Purchase> {
    const id = randomUUID();
    const purchase: Purchase = {
      ...insertPurchase,
      id,
      sellerId: insertPurchase.sellerId ?? null,
      status: "pending_confirmation",
      buyerConfirmed: false,
      sellerConfirmed: false,
      buyerNotifiedAt: null,
      sellerCountdownExpiresAt: null,
      buyerDebitTxCompleted: false,
      sellerCreditTxCompleted: false,
      createdAt: new Date(),
    };
    this.purchases.set(id, purchase);
    return purchase;
  }

  async getPurchaseById(id: string): Promise<Purchase | undefined> {
    return this.purchases.get(id);
  }

  async getPurchasesByChannel(channelId: string): Promise<Purchase[]> {
    return Array.from(this.purchases.values()).filter(
      (purchase) => purchase.channelId === channelId
    );
  }

  async getPurchasesBySeller(sellerId: string): Promise<Purchase[]> {
    return Array.from(this.purchases.values()).filter(
      (purchase) => purchase.sellerId === sellerId
    );
  }

  async getPurchasesByBuyer(buyerId: string): Promise<Purchase[]> {
    return Array.from(this.purchases.values()).filter(
      (purchase) => purchase.buyerId === buyerId
    );
  }

  async updatePurchase(id: string, updates: Partial<Purchase>): Promise<Purchase | undefined> {
    const purchase = this.purchases.get(id);
    if (!purchase) return undefined;

    const updated = { ...purchase, ...updates };
    this.purchases.set(id, updated);
    return updated;
  }

  async updatePurchaseStatus(id: string, status: string): Promise<Purchase | undefined> {
    return this.updatePurchase(id, { status });
  }

  async confirmPurchaseBuyer(id: string): Promise<Purchase | undefined> {
    const purchase = this.purchases.get(id);
    if (!purchase) return undefined;

    const updated = { 
      ...purchase, 
      buyerConfirmed: true,
      status: "pending_transfer"
    };
    this.purchases.set(id, updated);
    return updated;
  }

  async confirmPurchaseSeller(id: string): Promise<Purchase | undefined> {
    const purchase = this.purchases.get(id);
    if (!purchase) return undefined;

    const updated = { 
      ...purchase, 
      sellerConfirmed: true,
      status: purchase.buyerConfirmed ? "transfer_completed" : "transfer_in_progress"
    };
    this.purchases.set(id, updated);
    return updated;
  }

  async setPurchaseBuyerNotified(id: string): Promise<Purchase | undefined> {
    const purchase = this.purchases.get(id);
    if (!purchase) return undefined;

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 6 * 60 * 60 * 1000);

    const updated = { 
      ...purchase, 
      buyerNotifiedAt: now,
      sellerCountdownExpiresAt: expiresAt
    };
    this.purchases.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();