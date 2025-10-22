import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertChannelSchema } from "@shared/schema";
import { z } from "zod";

// Telegram verification functions
async function verifyTelegramChannel(telegramLink: string): Promise<boolean> {
  try {
    // Extract channel username from link
    const channelMatch = telegramLink.match(/t\.me\/([a-zA-Z0-9_]+)/);
    if (!channelMatch) {
      return false;
    }
    
    const channelUsername = channelMatch[1];
    
    // In real implementation, you would use Telegram Bot API
    // For now, we'll simulate a check
    // You would use: https://api.telegram.org/bot<BOT_TOKEN>/getChat?chat_id=@channel_username
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo purposes, accept most channels
    return channelUsername.length > 0;
  } catch (error) {
    console.error('Error verifying Telegram channel:', error);
    return false;
  }
}

async function checkGiftInChannel(telegramLink: string, giftName: string): Promise<boolean> {
  try {
    // In real implementation, you would:
    // 1. Use Telegram Bot API to get recent messages
    // 2. Search for the gift name in message content
    // 3. Check for images or media related to the gift
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // For demo purposes, simulate finding the gift 70% of the time
    const random = Math.random();
    return random > 0.3;
  } catch (error) {
    console.error('Error checking gift in channel:', error);
    return false;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
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

  const httpServer = createServer(app);
  return httpServer;
}
