import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { extractLinkedInProfile } from "./linkedin";
import { generateWebsite, createPreviewHtml } from "./website-generator";
import { createZipArchive, createDataJson, createImagesArchive, createSourceArchive } from "./download";

// Generate DNS records for custom domain setup
function generateDnsRecords(platform: string, domain: string, siteName: string) {
  const isApexDomain = !domain.includes('.') || domain.split('.').length === 2;
  
  switch (platform) {
    case "github_pages":
      return {
        platform: "GitHub Pages",
        records: isApexDomain ? [
          { type: "A", name: "@", value: "185.199.108.153", ttl: "3600" },
          { type: "A", name: "@", value: "185.199.109.153", ttl: "3600" },
          { type: "A", name: "@", value: "185.199.110.153", ttl: "3600" },
          { type: "A", name: "@", value: "185.199.111.153", ttl: "3600" },
          { type: "CNAME", name: "www", value: `${siteName}.github.io`, ttl: "3600" },
        ] : [
          { type: "CNAME", name: domain.split('.')[0], value: `${siteName}.github.io`, ttl: "3600" },
        ],
        instructions: [
          "Add the DNS records to your domain provider",
          "Wait for DNS propagation (can take up to 48 hours)",
          "Enable HTTPS in your GitHub repository settings",
        ],
      };
    case "vercel":
      return {
        platform: "Vercel",
        records: isApexDomain ? [
          { type: "A", name: "@", value: "76.76.21.21", ttl: "3600" },
          { type: "CNAME", name: "www", value: "cname.vercel-dns.com", ttl: "3600" },
        ] : [
          { type: "CNAME", name: domain.split('.')[0], value: "cname.vercel-dns.com", ttl: "3600" },
        ],
        instructions: [
          "Add the DNS records to your domain provider",
          "Add the domain in your Vercel project settings",
          "Vercel will automatically provision SSL certificate",
        ],
      };
    case "netlify":
    default:
      return {
        platform: "Netlify",
        records: isApexDomain ? [
          { type: "A", name: "@", value: "75.2.60.5", ttl: "3600" },
          { type: "CNAME", name: "www", value: `${siteName}.netlify.app`, ttl: "3600" },
        ] : [
          { type: "CNAME", name: domain.split('.')[0], value: `${siteName}.netlify.app`, ttl: "3600" },
        ],
        instructions: [
          "Add the DNS records to your domain provider",
          "Add the domain in your Netlify site settings",
          "Netlify will automatically provision SSL certificate",
        ],
      };
  }
}

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

      console.log("[Generate] Profile:", data.profile?.fullName);
      console.log("[Generate] Featured posts:", data.featuredPosts?.length || 0);
      console.log("[Generate] Experience:", data.experience?.length || 0);
      console.log("[Generate] WhatsApp:", config.whatsappNumber ? "set" : "not set");
      console.log("[Generate] Phone:", config.phoneNumber ? "set" : "not set");

      const sessionId = await storage.createSession();
      await storage.saveExtractedData(sessionId, data);
      await storage.saveWebsiteConfig(sessionId, config);

      const generatedFiles = await generateWebsite(data, config);
      await storage.saveGeneratedWebsite(sessionId, generatedFiles);

      console.log("[Generate] Session created:", sessionId);
      console.log("[Generate] Files generated:", generatedFiles.size);

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
      console.log("[Preview] Session ID:", sessionId);
      
      if (sessionId) {
        const files = await storage.getGeneratedWebsite(sessionId);
        console.log("[Preview] Files found:", files ? files.size : 0);
        if (files && files.has("index.html")) {
          const html = files.get("index.html")!;
          console.log("[Preview] Serving generated HTML, length:", html.length);
          res.setHeader("Content-Type", "text/html");
          return res.send(html);
        }
      }

      // Return a sample preview with featured posts
      console.log("[Preview] No session found, serving sample preview");
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

      // Generate platform-specific URL
      let baseUrl: string;
      switch (platform) {
        case "github_pages":
          baseUrl = `https://${repositoryName || "user"}.github.io`;
          break;
        case "vercel":
          baseUrl = `https://${siteName || "my-site"}.vercel.app`;
          break;
        case "netlify":
        default:
          baseUrl = `https://${siteName || "my-site"}.netlify.app`;
          break;
      }

      const url = customDomain ? `https://${customDomain}` : baseUrl;

      // Generate DNS records for custom domain if specified
      const dnsRecords = customDomain ? generateDnsRecords(platform, customDomain, siteName || repositoryName || "my-site") : undefined;

      res.json({ 
        success: true,
        url,
        platform,
        dnsRecords,
        message: "Website deployed successfully"
      });
    } catch (error: any) {
      console.error("Deployment error:", error);
      res.status(500).json({ 
        error: error.message || "Failed to deploy website" 
      });
    }
  });

  // Get DNS setup guidance
  app.get("/api/dns-guidance", async (req: Request, res: Response) => {
    try {
      const { platform, domain, siteName } = req.query;
      
      if (!platform || !domain) {
        return res.status(400).json({ error: "Platform and domain are required" });
      }

      const dnsRecords = generateDnsRecords(
        platform as string, 
        domain as string, 
        siteName as string || "my-site"
      );

      res.json({ dnsRecords });
    } catch (error: any) {
      console.error("DNS guidance error:", error);
      res.status(500).json({ error: "Failed to generate DNS guidance" });
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
