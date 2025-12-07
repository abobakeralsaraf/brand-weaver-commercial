import { randomUUID } from "crypto";
import type { ExtractedData, WebsiteConfig } from "@shared/schema";

export interface IStorage {
  saveExtractedData(sessionId: string, data: ExtractedData): Promise<void>;
  getExtractedData(sessionId: string): Promise<ExtractedData | undefined>;
  saveWebsiteConfig(sessionId: string, config: WebsiteConfig): Promise<void>;
  getWebsiteConfig(sessionId: string): Promise<WebsiteConfig | undefined>;
  saveGeneratedWebsite(sessionId: string, files: Map<string, string>): Promise<void>;
  getGeneratedWebsite(sessionId: string): Promise<Map<string, string> | undefined>;
  getLatestExtractedData(): Promise<ExtractedData | undefined>;
  getLatestWebsiteConfig(): Promise<WebsiteConfig | undefined>;
  getLatestGeneratedWebsite(): Promise<Map<string, string> | undefined>;
  createSession(): Promise<string>;
}

export class MemStorage implements IStorage {
  private extractedData: Map<string, ExtractedData>;
  private websiteConfigs: Map<string, WebsiteConfig>;
  private generatedWebsites: Map<string, Map<string, string>>;
  private latestSessionId: string | null = null;

  constructor() {
    this.extractedData = new Map();
    this.websiteConfigs = new Map();
    this.generatedWebsites = new Map();
  }

  async createSession(): Promise<string> {
    this.latestSessionId = randomUUID();
    return this.latestSessionId;
  }

  async saveExtractedData(sessionId: string, data: ExtractedData): Promise<void> {
    this.extractedData.set(sessionId, data);
    this.latestSessionId = sessionId;
  }

  async getExtractedData(sessionId: string): Promise<ExtractedData | undefined> {
    return this.extractedData.get(sessionId);
  }

  async getLatestExtractedData(): Promise<ExtractedData | undefined> {
    if (!this.latestSessionId) return undefined;
    return this.extractedData.get(this.latestSessionId);
  }

  async saveWebsiteConfig(sessionId: string, config: WebsiteConfig): Promise<void> {
    this.websiteConfigs.set(sessionId, config);
  }

  async getWebsiteConfig(sessionId: string): Promise<WebsiteConfig | undefined> {
    return this.websiteConfigs.get(sessionId);
  }

  async getLatestWebsiteConfig(): Promise<WebsiteConfig | undefined> {
    if (!this.latestSessionId) return undefined;
    return this.websiteConfigs.get(this.latestSessionId);
  }

  async saveGeneratedWebsite(sessionId: string, files: Map<string, string>): Promise<void> {
    this.generatedWebsites.set(sessionId, files);
  }

  async getGeneratedWebsite(sessionId: string): Promise<Map<string, string> | undefined> {
    return this.generatedWebsites.get(sessionId);
  }

  async getLatestGeneratedWebsite(): Promise<Map<string, string> | undefined> {
    if (!this.latestSessionId) return undefined;
    return this.generatedWebsites.get(this.latestSessionId);
  }
}

export const storage = new MemStorage();
