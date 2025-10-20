import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertChannelSchema } from "@shared/schema";
import { z } from "zod";

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

  const httpServer = createServer(app);
  return httpServer;
}
