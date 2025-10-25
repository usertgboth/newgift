import { type User, type InsertUser, type Gift, type Channel, type InsertChannel } from "@shared/schema";
import { AVAILABLE_GIFTS } from "@shared/gifts";
import { randomUUID } from "crypto";
import { db } from "@db";
import { gifts, channels, users, referrals, referralEarnings } from "@shared/schema";
import { eq, ilike, or } from "drizzle-orm";


export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getAllGifts(): Promise<Gift[]>;
  getGiftById(id: string): Promise<Gift | undefined>;

  getAllChannels(): Promise<(Channel & { giftName: string; giftImage: string })[]>;
  getChannelById(id: string): Promise<(Channel & { giftName: string; giftImage: string }) | undefined>;
  createChannel(channel: InsertChannel): Promise<Channel & { giftName: string; giftImage: string }>;
  updateChannel(id: string, channel: Partial<InsertChannel>): Promise<(Channel & { giftName: string; giftImage: string }) | undefined>;
  deleteChannel(id: string): Promise<boolean>;
  searchChannelsByGiftName(query: string): Promise<(Channel & { giftName: string; giftImage: string })[]>;
  getUserByTelegramId(telegramId: string);
  getReferralStats(userId: string): Promise<{ count: number; earnings: string }>;
  updateUserBalance(telegramId: string, amount: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private gifts: Map<string, Gift>;
  private channels: Map<string, Channel>;

  constructor() {
    this.users = new Map();
    this.gifts = new Map();
    this.channels = new Map();
    this.seedGifts();
    this.seedChannels();
  }

  private seedGifts() {
    AVAILABLE_GIFTS.forEach((gift) => {
      this.gifts.set(gift.id, gift);
    });
  }

  private seedChannels() {
    const seedData: Channel[] = [
      {
        id: randomUUID(),
        channelName: "Bear Shop",
        telegramLink: "https://t.me/bears_shop",
        giftId: "box-of-chocolates",
        price: "29",
        ownerId: null,
        gifts: JSON.stringify([{ giftId: "box-of-chocolates", quantity: 1 }]),
      },
      {
        id: randomUUID(),
        channelName: "Anna's Sweets",
        telegramLink: "https://t.me/anna_sweets",
        giftId: "cherry-cake",
        price: "10.49",
        ownerId: null,
        gifts: JSON.stringify([{ giftId: "cherry-cake", quantity: 1 }]),
      },
      {
        id: randomUUID(),
        channelName: "Holiday Gifts",
        telegramLink: "https://t.me/holiday_gifts",
        giftId: "gift-bag",
        price: "15.99",
        ownerId: null,
        gifts: JSON.stringify([{ giftId: "gift-bag", quantity: 1 }]),
      },
      {
        id: randomUUID(),
        channelName: "Ice Cream Joy",
        telegramLink: "https://t.me/icecream_joy",
        giftId: "ice-cream-cone",
        price: "22.50",
        ownerId: null,
        gifts: JSON.stringify([{ giftId: "ice-cream-cone", quantity: 1 }]),
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
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllGifts(): Promise<Gift[]> {
    return Array.from(this.gifts.values());
  }

  async getGiftById(id: string): Promise<Gift | undefined> {
    return this.gifts.get(id);
  }

  async getAllChannels(): Promise<(Channel & { giftName: string; giftImage: string })[]> {
    return Array.from(this.channels.values()).map(channel => {
      const gift = this.gifts.get(channel.giftId);
      return {
        ...channel,
        giftName: gift?.name || "",
        giftImage: gift?.image || "",
      };
    });
  }

  async getChannelById(id: string): Promise<(Channel & { giftName: string; giftImage: string }) | undefined> {
    const channel = this.channels.get(id);
    if (!channel) return undefined;

    const gift = this.gifts.get(channel.giftId);
    return {
      ...channel,
      giftName: gift?.name || "",
      giftImage: gift?.image || "",
    };
  }

  async createChannel(insertChannel: InsertChannel): Promise<Channel & { giftName: string; giftImage: string }> {
    const id = randomUUID();
    const channel: Channel = { 
      ...insertChannel,
      id,
      ownerId: insertChannel.ownerId ?? null,
      gifts: insertChannel.gifts ?? null,
    };
    this.channels.set(id, channel);

    const gift = this.gifts.get(channel.giftId);
    return {
      ...channel,
      giftName: gift?.name || "",
      giftImage: gift?.image || "",
    };
  }

  async updateChannel(id: string, updates: Partial<InsertChannel>): Promise<(Channel & { giftName: string; giftImage: string }) | undefined> {
    const channel = this.channels.get(id);
    if (!channel) return undefined;

    const updated = { ...channel, ...updates };
    this.channels.set(id, updated);

    const gift = this.gifts.get(updated.giftId);
    return {
      ...updated,
      giftName: gift?.name || "",
      giftImage: gift?.image || "",
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

  async getUserByTelegramId(telegramId: string) {
    try {
      const result = await db.select().from(users).where(eq(users.telegramId, telegramId)).limit(1);
      return result[0] || null;
    } catch (error) {
      console.error('Error getting user by telegram ID:', error);
      return null;
    }
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
    try {
      const user = await this.getUserByTelegramId(telegramId);
      if (!user) return false;

      const currentBalance = parseFloat(user.balance);
      const newBalance = (currentBalance + amount).toFixed(2);

      await db
        .update(users)
        .set({ balance: newBalance })
        .where(eq(users.telegramId, telegramId));

      return true;
    } catch (error) {
      console.error('Error updating user balance:', error);
      return false;
    }
  }
}

export const storage = new MemStorage();