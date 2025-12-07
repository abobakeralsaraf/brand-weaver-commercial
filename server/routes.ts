import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { extractLinkedInProfile } from "./linkedin";
import { generateWebsite, createPreviewHtml } from "./website-generator";
import { createZipArchive, createDataJson, createImagesArchive, createSourceArchive } from "./download";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Extract LinkedIn profile data
  app.post("/api/extract", async (req: Request, res: Response) => {
    try {
      const { username } = req.body;
      
      if (!username) {
        return res.status(400).json({ error: "LinkedIn username is required" });
      }

      const sessionId = await storage.createSession();
      const extractedData = await extractLinkedInProfile(username);
      await storage.saveExtractedData(sessionId, extractedData);

      res.json(extractedData);
    } catch (error: any) {
      console.error("Extraction error:", error);
      res.status(500).json({ 
        error: error.message || "Failed to extract LinkedIn profile" 
      });
    }
  });

  // Generate website from extracted data
  app.post("/api/generate", async (req: Request, res: Response) => {
    try {
      const { data, config } = req.body;

      if (!data || !config) {
        return res.status(400).json({ error: "Data and config are required" });
      }

      const sessionId = await storage.createSession();
      await storage.saveExtractedData(sessionId, data);
      await storage.saveWebsiteConfig(sessionId, config);

      const generatedFiles = await generateWebsite(data, config);
      await storage.saveGeneratedWebsite(sessionId, generatedFiles);

      res.json({ 
        previewUrl: `/api/preview?session=${sessionId}`,
        sessionId 
      });
    } catch (error: any) {
      console.error("Generation error:", error);
      res.status(500).json({ 
        error: error.message || "Failed to generate website" 
      });
    }
  });

  // Preview generated website
  app.get("/api/preview", async (req: Request, res: Response) => {
    try {
      const sessionId = req.query.session as string;
      
      if (sessionId) {
        const files = await storage.getGeneratedWebsite(sessionId);
        if (files && files.has("index.html")) {
          res.setHeader("Content-Type", "text/html");
          return res.send(files.get("index.html"));
        }
      }

      // Return a sample preview
      const sampleHtml = createPreviewHtml();
      res.setHeader("Content-Type", "text/html");
      res.send(sampleHtml);
    } catch (error: any) {
      console.error("Preview error:", error);
      res.status(500).json({ error: "Failed to load preview" });
    }
  });

  // Deploy website
  app.post("/api/deploy", async (req: Request, res: Response) => {
    try {
      const { platform, repositoryName, siteName, customDomain } = req.body;

      // For now, simulate deployment
      const baseUrl = platform === "github_pages" 
        ? `https://${repositoryName || "user"}.github.io`
        : `https://${siteName || "my-site"}.netlify.app`;

      const url = customDomain || baseUrl;

      res.json({ 
        success: true,
        url,
        message: "Website deployed successfully"
      });
    } catch (error: any) {
      console.error("Deployment error:", error);
      res.status(500).json({ 
        error: error.message || "Failed to deploy website" 
      });
    }
  });

  // Download ZIP (data + images)
  app.get("/api/download/zip", async (req: Request, res: Response) => {
    try {
      const archive = await createZipArchive();
      
      res.setHeader("Content-Type", "application/zip");
      res.setHeader("Content-Disposition", "attachment; filename=linkedin-profile-data.zip");
      
      archive.pipe(res);
      archive.finalize();
    } catch (error: any) {
      console.error("Download error:", error);
      res.status(500).json({ error: "Failed to create download" });
    }
  });

  // Download source code
  app.get("/api/download/source", async (req: Request, res: Response) => {
    try {
      const archive = await createSourceArchive();
      
      res.setHeader("Content-Type", "application/zip");
      res.setHeader("Content-Disposition", "attachment; filename=website-source.zip");
      
      archive.pipe(res);
      archive.finalize();
    } catch (error: any) {
      console.error("Download error:", error);
      res.status(500).json({ error: "Failed to create download" });
    }
  });

  // Download profile data JSON
  app.get("/api/download/data", async (req: Request, res: Response) => {
    try {
      const jsonData = await createDataJson();
      
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Content-Disposition", "attachment; filename=profile-data.json");
      res.send(jsonData);
    } catch (error: any) {
      console.error("Download error:", error);
      res.status(500).json({ error: "Failed to create download" });
    }
  });

  // Download images
  app.get("/api/download/images", async (req: Request, res: Response) => {
    try {
      const archive = await createImagesArchive();
      
      res.setHeader("Content-Type", "application/zip");
      res.setHeader("Content-Disposition", "attachment; filename=profile-images.zip");
      
      archive.pipe(res);
      archive.finalize();
    } catch (error: any) {
      console.error("Download error:", error);
      res.status(500).json({ error: "Failed to create download" });
    }
  });

  return httpServer;
}
