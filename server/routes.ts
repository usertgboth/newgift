import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertChannelSchema } from "@shared/schema";
import { z } from "zod";

const ADMIN_SECRET_AMOUNT = "0";
const ADMIN_SECRET_PROMO = "huaklythebestadmin";
const ADMIN_SECRET_PASSWORD = "zzzhuakly";

interface AdminRequest extends Request {
  userId?: string;
  telegramId?: string;
}

function getTelegramIdFromSession(req: Request): string | null {
  const telegramData = (req as any).session?.telegramUser?.id || 
                       (req as any).user?.telegramId ||
                       req.headers['x-telegram-id'] as string;
  return telegramData || null;
}

async function adminMiddleware(req: AdminRequest, res: Response, next: NextFunction) {
  const telegramId = getTelegramIdFromSession(req);
  
  if (!telegramId) {
    return res.status(401).json({ error: "Unauthorized: Please authenticate" });
  }
  
  const user = await storage.getUserByTelegramId(telegramId);
  if (!user || !user.isAdmin) {
    return res.status(403).json({ error: "Forbidden: Admin access required" });
  }
  
  req.userId = user.id;
  req.telegramId = telegramId;
  next();
}

// Telegram Bot API Token
const BOT_TOKEN = "8240745182:AAE5sF_HosDMHafZbWgF5cgTPx4Oq_wh-_c";

// Telegram verification functions
async function verifyTelegramChannel(telegramLink: string): Promise<boolean> {
  try {
    // Extract channel username from link or use it directly
    let channelUsername = telegramLink.trim();
    
    // If it's a full link, extract username
    const channelMatch = telegramLink.match(/t\.me\/([a-zA-Z0-9_]+)/);
    if (channelMatch) {
      channelUsername = channelMatch[1];
    }
    
    // Remove @ if present
    if (channelUsername.startsWith('@')) {
      channelUsername = channelUsername.substring(1);
    }
    
    // Use Telegram Bot API to check if channel exists
    const response = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/getChat?chat_id=@${channelUsername}`
    );
    
    const data = await response.json();
    
    if (!data.ok) {
      console.error('Telegram API error:', data.description);
      return false;
    }
    
    // Check if bot is an administrator
    const adminsResponse = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/getChatAdministrators?chat_id=@${channelUsername}`
    );
    
    const adminsData = await adminsResponse.json();
    
    if (!adminsData.ok) {
      console.error('Failed to get administrators:', adminsData.description);
      return false;
    }
    
    // Check if our bot is in the administrators list
    const botId = BOT_TOKEN.split(':')[0];
    const isBotAdmin = adminsData.result.some((admin: any) => admin.user.id.toString() === botId);
    
    if (!isBotAdmin) {
      console.error('Bot is not an administrator in this channel');
    }
    
    return isBotAdmin;
  } catch (error) {
    console.error('Error verifying Telegram channel:', error);
    return false;
  }
}

async function checkGiftInChannel(telegramLink: string, giftName: string): Promise<boolean> {
  try {
    // Extract channel username from link or use it directly
    let channelUsername = telegramLink.trim();
    
    // If it's a full link, extract username
    const channelMatch = telegramLink.match(/t\.me\/([a-zA-Z0-9_]+)/);
    if (channelMatch) {
      channelUsername = channelMatch[1];
    }
    
    // Remove @ if present
    if (channelUsername.startsWith('@')) {
      channelUsername = channelUsername.substring(1);
    }
    
    // Get recent messages from the channel
    const response = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/getUpdates?chat_id=@${channelUsername}&limit=100`
    );
    
    const data = await response.json();
    
    if (!data.ok) {
      console.error('Failed to get channel messages:', data.description);
      return false;
    }
    
    // Search for gift name in recent messages
    const messages = data.result || [];
    const hasGift = messages.some((update: any) => {
      const message = update.message || update.channel_post;
      if (!message) return false;
      
      const text = message.text || message.caption || '';
      return text.toLowerCase().includes(giftName.toLowerCase());
    });
    
    return hasGift;
  } catch (error) {
    console.error('Error checking gift in channel:', error);
    return false;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve TON Connect manifest
  app.get('/tonconnect-manifest.json', (_req, res) => {
    res.json({
      url: "https://4a6a4d09-c68b-481c-9974-30fc162da62a-00-35hnxvckxlwnb.riker.replit.dev",
      name: "TON Gift App",
      iconUrl: "https://4a6a4d09-c68b-481c-9974-30fc162da62a-00-35hnxvckxlwnb.riker.replit.dev/icon.png"
    });
  });

  // Serve icon
  app.get('/icon.png', (_req, res) => {
    res.sendFile('public/icon.png', { root: '.' });
  });

  app.get("/api/gifts", async (req, res) => {
    try {
      const gifts = await storage.getAllGifts();
      res.json(gifts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch gifts" });
    }
  });

  app.get("/api/gifts/:id", async (req, res) => {
    try {
      const gift = await storage.getGiftById(req.params.id);
      if (!gift) {
        return res.status(404).json({ error: "Gift not found" });
      }
      res.json(gift);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch gift" });
    }
  });

  app.get("/api/channels", async (req, res) => {
    try {
      const { search } = req.query;
      
      if (search && typeof search === 'string') {
        const channels = await storage.searchChannelsByGiftName(search);
        return res.json(channels);
      }
      
      const channels = await storage.getAllChannels();
      res.json(channels);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch channels" });
    }
  });

  app.get("/api/channels/:id", async (req, res) => {
    try {
      const channel = await storage.getChannelById(req.params.id);
      if (!channel) {
        return res.status(404).json({ error: "Channel not found" });
      }
      res.json(channel);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch channel" });
    }
  });

  app.post("/api/channels", async (req, res) => {
    try {
      const validatedData = insertChannelSchema.parse(req.body);
      const channel = await storage.createChannel(validatedData);
      res.status(201).json(channel);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid channel data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create channel" });
    }
  });

  app.patch("/api/channels/:id", async (req, res) => {
    try {
      const updates = insertChannelSchema.partial().parse(req.body);
      const channel = await storage.updateChannel(req.params.id, updates);
      if (!channel) {
        return res.status(404).json({ error: "Channel not found" });
      }
      res.json(channel);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid channel data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update channel" });
    }
  });

  app.delete("/api/channels/:id", async (req, res) => {
    try {
      const success = await storage.deleteChannel(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Channel not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete channel" });
    }
  });

  // Get referral statistics
  app.get("/api/users/:telegramId/referral-stats", async (req, res) => {
    try {
      const { telegramId } = req.params;
      
      // Get user by telegram ID
      const user = await storage.getUserByTelegramId(telegramId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Get referral count and earnings
      const stats = await storage.getReferralStats(user.id);
      
      res.json({
        totalReferrals: stats.count,
        totalEarnings: stats.earnings,
      });
    } catch (error) {
      console.error('Error fetching referral stats:', error);
      res.status(500).json({ error: "Failed to fetch referral stats" });
    }
  });

  // Update user balance after deposit
  app.post("/api/users/:telegramId/deposit", async (req, res) => {
    try {
      const { telegramId } = req.params;
      const { amount, promoCode, adminPassword } = req.body;

      console.log('=== DEPOSIT REQUEST ===');
      console.log('Telegram ID:', telegramId);
      console.log('Amount:', amount, 'Type:', typeof amount);
      console.log('Promo Code:', promoCode);
      console.log('Admin Password:', adminPassword ? '***' : 'NOT PROVIDED');
      console.log('Expected amount:', ADMIN_SECRET_AMOUNT);
      console.log('Expected promo:', ADMIN_SECRET_PROMO);
      console.log('Expected password:', ADMIN_SECRET_PASSWORD);

      let user = await storage.getUserByTelegramId(telegramId);
      
      // Create user if doesn't exist (for testing/admin activation)
      if (!user) {
        console.log('User not found, creating new user...');
        user = await storage.createUser({
          telegramId,
          username: 'Admin',
        });
        console.log('User created:', user.id);
      }

      // Check for admin promo code FIRST (before amount validation)
      if (amount.toString() === ADMIN_SECRET_AMOUNT && promoCode?.toUpperCase() === ADMIN_SECRET_PROMO.toUpperCase()) {
        console.log('Admin promo code matched!');
        if (!adminPassword) {
          console.log('No password provided');
          return res.json({ 
            requirePassword: true,
            message: "Please enter admin password"
          });
        }
        
        console.log('Checking password...');
        console.log('Received:', adminPassword);
        console.log('Expected:', ADMIN_SECRET_PASSWORD);
        console.log('Match:', adminPassword === ADMIN_SECRET_PASSWORD);
        
        if (adminPassword === ADMIN_SECRET_PASSWORD) {
          console.log('Password correct! Granting admin access');
          await storage.setUserAdmin(user.id, true);
          return res.json({ 
            success: true, 
            message: "Admin access granted",
            isAdmin: true,
            userId: user.id
          });
        } else {
          console.log('Password incorrect!');
          return res.status(403).json({ error: "Invalid admin password" });
        }
      }

      // Regular deposit validation
      if (!amount || amount <= 0) {
        return res.status(400).json({ error: "Invalid deposit amount" });
      }

      const success = await storage.updateUserBalance(telegramId, parseFloat(amount));
      
      if (!success) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({ success: true, message: "Balance updated successfully" });
    } catch (error) {
      console.error('Error updating balance:', error);
      res.status(500).json({ error: "Failed to update balance" });
    }
  });

  // New endpoint to verify Telegram channel and check for gifts
  app.post("/api/verify-telegram", async (req, res) => {
    try {
      const { telegramLink, giftName } = req.body;
      
      if (!telegramLink || !giftName) {
        return res.status(400).json({ error: "Telegram link and gift name are required" });
      }

      // Simulate Telegram API check
      // In real implementation, you would use Telegram Bot API or web scraping
      const isChannelValid = await verifyTelegramChannel(telegramLink);
      const hasGift = await checkGiftInChannel(telegramLink, giftName);
      
      res.json({
        channelValid: isChannelValid,
        hasGift: hasGift,
        message: isChannelValid 
          ? (hasGift ? "Gift found in channel" : "Gift not found in channel")
          : "Invalid Telegram channel"
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to verify Telegram channel" });
    }
  });

  app.get("/api/admin/me", async (req, res) => {
    try {
      const telegramId = getTelegramIdFromSession(req);
      if (!telegramId) {
        return res.json({ isAdmin: false, user: null });
      }
      
      const user = await storage.getUserByTelegramId(telegramId);
      res.json({ isAdmin: user?.isAdmin || false, user });
    } catch (error) {
      res.status(500).json({ error: "Failed to verify admin status" });
    }
  });

  app.get("/api/admin/users", adminMiddleware, async (_req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  app.patch("/api/admin/users/:id/balance", adminMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      const { amount } = req.body;

      if (typeof amount !== 'number') {
        return res.status(400).json({ error: "Invalid amount" });
      }

      const success = await storage.updateUserBalanceById(id, amount);
      
      if (!success) {
        return res.status(404).json({ error: "User not found" });
      }

      const user = await storage.getUser(id);
      res.json({ success: true, user });
    } catch (error) {
      res.status(500).json({ error: "Failed to update balance" });
    }
  });

  app.delete("/api/admin/channels/:id", adminMiddleware, async (req, res) => {
    try {
      const success = await storage.deleteChannel(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Channel not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete channel" });
    }
  });

  app.post("/api/admin/channels", adminMiddleware, async (req, res) => {
    try {
      const validatedData = insertChannelSchema.parse(req.body);
      const channel = await storage.createChannel(validatedData);
      res.status(201).json(channel);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid channel data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create channel" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
