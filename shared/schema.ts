import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, decimal, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  telegramId: text("telegram_id").unique(),
  username: text("username").notNull(),
  avatarUrl: text("avatar_url"),
  referralCode: text("referral_code").notNull().unique(),
  referredBy: varchar("referred_by").references((): any => users.id),
  language: text("language").notNull().default("en"),
  balance: decimal("balance", { precision: 10, scale: 2 }).notNull().default("0.00"),
  isAdmin: boolean("is_admin").notNull().default(false),
  adminActivatedAt: timestamp("admin_activated_at"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  referralCode: true,
  balance: true,
  isAdmin: true,
  adminActivatedAt: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const referrals = pgTable("referrals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  referrerId: varchar("referrer_id").notNull().references(() => users.id),
  referredUserId: varchar("referred_user_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export type Referral = typeof referrals.$inferSelect;

export const referralEarnings = pgTable("referral_earnings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  fromUserId: varchar("from_user_id").notNull().references(() => users.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  depositAmount: decimal("deposit_amount", { precision: 10, scale: 2 }).notNull(),
  percentage: integer("percentage").notNull().default(3),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export type ReferralEarning = typeof referralEarnings.$inferSelect;

export const gifts = pgTable("gifts", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull().unique(),
  image: text("image").notNull(),
});

export type Gift = typeof gifts.$inferSelect;

export const channels = pgTable("channels", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  channelName: text("channel_name").notNull(),
  telegramLink: text("telegram_link").notNull(),
  giftId: varchar("gift_id").notNull().references(() => gifts.id),
  price: text("price").notNull(),
  ownerId: varchar("owner_id"),
  gifts: text("gifts"),
});

export const insertChannelSchema = createInsertSchema(channels).omit({
  id: true,
});

export type InsertChannel = z.infer<typeof insertChannelSchema>;
export type Channel = typeof channels.$inferSelect;

export const giftItemSchema = z.object({
  giftId: z.string(),
  quantity: z.number().int().positive(),
});

export type GiftItem = z.infer<typeof giftItemSchema>;

export const purchases = pgTable("purchases", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  buyerId: varchar("buyer_id").notNull().references(() => users.id),
  sellerId: varchar("seller_id"),
  channelId: varchar("channel_id").notNull().references(() => channels.id),
  giftId: varchar("gift_id").notNull().references(() => gifts.id),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending_confirmation"),
  buyerConfirmed: boolean("buyer_confirmed").notNull().default(false),
  sellerConfirmed: boolean("seller_confirmed").notNull().default(false),
  buyerNotifiedAt: timestamp("buyer_notified_at"),
  sellerCountdownExpiresAt: timestamp("seller_countdown_expires_at"),
  buyerDebitTxCompleted: boolean("buyer_debit_tx_completed").notNull().default(false),
  sellerCreditTxCompleted: boolean("seller_credit_tx_completed").notNull().default(false),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const insertPurchaseSchema = createInsertSchema(purchases).omit({
  id: true,
  status: true,
  buyerConfirmed: true,
  sellerConfirmed: true,
  buyerNotifiedAt: true,
  sellerCountdownExpiresAt: true,
  buyerDebitTxCompleted: true,
  sellerCreditTxCompleted: true,
  createdAt: true,
});

export type InsertPurchase = z.infer<typeof insertPurchaseSchema>;
export type Purchase = typeof purchases.$inferSelect;
