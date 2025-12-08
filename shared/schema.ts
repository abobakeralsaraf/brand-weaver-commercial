import { z } from "zod";

// LinkedIn Profile Data Types
export const linkedInProfileSchema = z.object({
  username: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  fullName: z.string(),
  headline: z.string().optional(),
  summary: z.string().optional(),
  location: z.string().optional(),
  profilePicture: z.string().optional(),
  headerImage: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  linkedinUrl: z.string(),
  connections: z.number().optional(),
});

export const workExperienceSchema = z.object({
  id: z.string(),
  title: z.string(),
  company: z.string(),
  companyLogo: z.string().optional(),
  location: z.string().optional(),
  startDate: z.string(),
  endDate: z.string().optional(),
  isCurrent: z.boolean().default(false),
  description: z.string().optional(),
});

export const educationSchema = z.object({
  id: z.string(),
  school: z.string(),
  degree: z.string().optional(),
  fieldOfStudy: z.string().optional(),
  schoolLogo: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  description: z.string().optional(),
});

export const certificationSchema = z.object({
  id: z.string(),
  name: z.string(),
  issuer: z.string(),
  issuerLogo: z.string().optional(),
  issueDate: z.string().optional(),
  expirationDate: z.string().optional(),
  credentialId: z.string().optional(),
  credentialUrl: z.string().optional(),
});

export const skillSchema = z.object({
  name: z.string(),
  endorsements: z.number().optional(),
});

export const languageSchema = z.object({
  name: z.string(),
  proficiency: z.string().optional(),
});

export const featuredPostSchema = z.object({
  id: z.string(),
  embedCode: z.string().optional(),
  postUrl: z.string(),
  contentPreview: z.string().optional(),
  date: z.string().optional(),
  engagement: z.object({
    likes: z.number().optional(),
    comments: z.number().optional(),
    shares: z.number().optional(),
  }).optional(),
});

export const recommendationSchema = z.object({
  id: z.string(),
  recommenderName: z.string(),
  recommenderHeadline: z.string().optional(),
  recommenderProfilePicture: z.string().optional(),
  recommenderLinkedInUrl: z.string().optional(),
  text: z.string(),
  relationship: z.string().optional(),
  date: z.string().optional(),
});

export const extractedDataSchema = z.object({
  profile: linkedInProfileSchema,
  experience: z.array(workExperienceSchema),
  education: z.array(educationSchema),
  certifications: z.array(certificationSchema),
  skills: z.array(skillSchema),
  languages: z.array(languageSchema),
  featuredPosts: z.array(featuredPostSchema),
  recommendations: z.array(recommendationSchema),
  extractedAt: z.string(),
});

// Website Configuration Types
export const colorSchemeSchema = z.object({
  id: z.string(),
  name: z.string(),
  primary: z.string(),
  secondary: z.string(),
  accent: z.string(),
});

export const typographySchema = z.object({
  id: z.string(),
  name: z.string(),
  headingFont: z.string(),
  bodyFont: z.string(),
});

export const aestheticLevelSchema = z.enum(["standard", "enhanced", "premium"]);
export const languageSelectionSchema = z.enum(["english", "arabic", "both"]);

export const portfolioProjectSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  image: z.string().optional(),
  technologies: z.array(z.string()).default([]),
  liveUrl: z.string().optional(),
  sourceUrl: z.string().optional(),
  featured: z.boolean().default(false),
});

export const analyticsConfigSchema = z.object({
  googleAnalyticsId: z.string().optional(),
  enableConsentBanner: z.boolean().default(true),
});

export const websiteConfigSchema = z.object({
  language: languageSelectionSchema,
  colorScheme: colorSchemeSchema,
  typography: typographySchema,
  aestheticLevel: aestheticLevelSchema,
  whatsappNumber: z.string().optional(),
  phoneNumber: z.string().optional(),
  analytics: analyticsConfigSchema.optional(),
  portfolioProjects: z.array(portfolioProjectSchema).default([]),
});

// Extraction Progress Types
export const extractionStepSchema = z.object({
  id: z.string(),
  label: z.string(),
  status: z.enum(["pending", "in_progress", "completed", "error"]),
  count: z.number().optional(),
});

export const extractionProgressSchema = z.object({
  percentage: z.number(),
  currentStep: z.string(),
  steps: z.array(extractionStepSchema),
});

// Generation Progress Types
export const generationStepSchema = z.object({
  id: z.string(),
  label: z.string(),
  status: z.enum(["pending", "in_progress", "completed", "error"]),
});

export const generationProgressSchema = z.object({
  percentage: z.number(),
  currentStep: z.string(),
  steps: z.array(generationStepSchema),
});

// Deployment Types
export const deploymentOptionsSchema = z.object({
  platform: z.enum(["github_pages", "netlify", "vercel"]),
  repositoryName: z.string().optional(),
  siteName: z.string().optional(),
  customDomain: z.string().optional(),
});

export const deploymentResultSchema = z.object({
  success: z.boolean(),
  url: z.string().optional(),
  error: z.string().optional(),
});

// Type exports
export type LinkedInProfile = z.infer<typeof linkedInProfileSchema>;
export type WorkExperience = z.infer<typeof workExperienceSchema>;
export type Education = z.infer<typeof educationSchema>;
export type Certification = z.infer<typeof certificationSchema>;
export type Skill = z.infer<typeof skillSchema>;
export type Language = z.infer<typeof languageSchema>;
export type FeaturedPost = z.infer<typeof featuredPostSchema>;
export type Recommendation = z.infer<typeof recommendationSchema>;
export type ExtractedData = z.infer<typeof extractedDataSchema>;
export type ColorScheme = z.infer<typeof colorSchemeSchema>;
export type Typography = z.infer<typeof typographySchema>;
export type AestheticLevel = z.infer<typeof aestheticLevelSchema>;
export type LanguageSelection = z.infer<typeof languageSelectionSchema>;
export type PortfolioProject = z.infer<typeof portfolioProjectSchema>;
export type AnalyticsConfig = z.infer<typeof analyticsConfigSchema>;
export type WebsiteConfig = z.infer<typeof websiteConfigSchema>;
export type ExtractionStep = z.infer<typeof extractionStepSchema>;
export type ExtractionProgress = z.infer<typeof extractionProgressSchema>;
export type GenerationStep = z.infer<typeof generationStepSchema>;
export type GenerationProgress = z.infer<typeof generationProgressSchema>;
export type DeploymentOptions = z.infer<typeof deploymentOptionsSchema>;
export type DeploymentResult = z.infer<typeof deploymentResultSchema>;

// Predefined Color Schemes
export const COLOR_SCHEMES: ColorScheme[] = [
  { id: "modern-blue", name: "Modern Blue", primary: "#2563eb", secondary: "#1e40af", accent: "#60a5fa" },
  { id: "professional-gray", name: "Professional Gray", primary: "#374151", secondary: "#1f2937", accent: "#9ca3af" },
  { id: "vibrant-orange", name: "Vibrant Orange", primary: "#ea580c", secondary: "#c2410c", accent: "#fb923c" },
  { id: "elegant-purple", name: "Elegant Purple", primary: "#7c3aed", secondary: "#5b21b6", accent: "#a78bfa" },
  { id: "fresh-green", name: "Fresh Green", primary: "#059669", secondary: "#047857", accent: "#34d399" },
  { id: "custom", name: "Custom Colors", primary: "#2563eb", secondary: "#1e40af", accent: "#60a5fa" },
];

// Predefined Typography Options
export const TYPOGRAPHY_OPTIONS: Typography[] = [
  { id: "modern-professional", name: "Modern Professional", headingFont: "Inter", bodyFont: "Roboto" },
  { id: "classic-elegant", name: "Classic Elegant", headingFont: "Playfair Display", bodyFont: "Merriweather" },
  { id: "tech-minimalist", name: "Tech Minimalist", headingFont: "Space Grotesk", bodyFont: "IBM Plex Sans" },
  { id: "creative-bold", name: "Creative Bold", headingFont: "Montserrat", bodyFont: "Open Sans" },
];

// Aesthetic Level Descriptions
export const AESTHETIC_LEVELS = [
  {
    id: "standard" as const,
    name: "Standard",
    nameAr: "عادي",
    description: "Simple, clean, fast loading with basic animations",
    features: ["Clean design", "Basic hover effects", "Fast loading", "Minimal animations"],
  },
  {
    id: "enhanced" as const,
    name: "Enhanced",
    nameAr: "جمال متوسط",
    description: "Professional polish with smooth transitions",
    features: ["Smooth transitions", "Parallax scrolling", "Hover effects", "Staggered reveals"],
  },
  {
    id: "premium" as const,
    name: "Premium",
    nameAr: "جمال عالي",
    description: "Stunning design with advanced animations",
    features: ["GSAP animations", "Particle effects", "Micro-interactions", "Gradient animations"],
  },
];

// User schema (kept for compatibility)
export const users = {
  id: "",
  username: "",
  password: "",
};

export const insertUserSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = { id: string; username: string; password: string };
