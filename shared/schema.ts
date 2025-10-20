import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

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
