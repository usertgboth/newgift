import { type User, type InsertUser, type Gift, type Channel, type InsertChannel } from "@shared/schema";
import { AVAILABLE_GIFTS } from "@shared/gifts";
import { randomUUID } from "crypto";

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
    return this.channels.delete(id);
  }

  async searchChannelsByGiftName(query: string): Promise<(Channel & { giftName: string; giftImage: string })[]> {
    const lowerQuery = query.toLowerCase();
    const allChannels = await this.getAllChannels();
    
    return allChannels.filter(channel => 
      channel.giftName.toLowerCase().includes(lowerQuery) ||
      channel.channelName.toLowerCase().includes(lowerQuery)
    );
  }
}

export const storage = new MemStorage();
