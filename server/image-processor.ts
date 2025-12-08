import sharp from "sharp";
import type { ExtractedData } from "@shared/schema";

interface ProcessedImage {
  original: Buffer;
  webp: Buffer;
  sizes: {
    mobile: Buffer;
    tablet: Buffer;
    desktop: Buffer;
  };
  filename: string;
  mimeType: string;
}

interface ImageProcessingResult {
  profileImage?: ProcessedImage;
  headerImage?: ProcessedImage;
  companyLogos: ProcessedImage[];
  schoolLogos: ProcessedImage[];
  recommenderImages: ProcessedImage[];
}

// Image size configurations for responsive images
const SIZES = {
  mobile: { width: 320, quality: 80 },
  tablet: { width: 640, quality: 85 },
  desktop: { width: 1024, quality: 90 },
};

const PROFILE_SIZES = {
  mobile: { width: 80, height: 80, quality: 85 },
  tablet: { width: 120, height: 120, quality: 85 },
  desktop: { width: 160, height: 160, quality: 90 },
};

async function fetchImage(url: string): Promise<Buffer | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (error) {
    console.error(`Failed to fetch image from ${url}:`, error);
    return null;
  }
}

async function processImage(
  imageBuffer: Buffer,
  filename: string,
  isProfile: boolean = false
): Promise<ProcessedImage> {
  const sizesConfig = isProfile ? PROFILE_SIZES : SIZES;
  
  // Create WebP version
  const webp = await sharp(imageBuffer)
    .webp({ quality: 85 })
    .toBuffer();
  
  // Create responsive sizes
  const mobile = await sharp(imageBuffer)
    .resize(sizesConfig.mobile.width, isProfile ? (sizesConfig.mobile as any).height : undefined, {
      fit: isProfile ? 'cover' : 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality: sizesConfig.mobile.quality })
    .toBuffer();
  
  const tablet = await sharp(imageBuffer)
    .resize(sizesConfig.tablet.width, isProfile ? (sizesConfig.tablet as any).height : undefined, {
      fit: isProfile ? 'cover' : 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality: sizesConfig.tablet.quality })
    .toBuffer();
  
  const desktop = await sharp(imageBuffer)
    .resize(sizesConfig.desktop.width, isProfile ? (sizesConfig.desktop as any).height : undefined, {
      fit: isProfile ? 'cover' : 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality: sizesConfig.desktop.quality })
    .toBuffer();
  
  return {
    original: imageBuffer,
    webp,
    sizes: { mobile, tablet, desktop },
    filename,
    mimeType: 'image/webp',
  };
}

export async function processAllImages(data: ExtractedData): Promise<ImageProcessingResult> {
  const result: ImageProcessingResult = {
    companyLogos: [],
    schoolLogos: [],
    recommenderImages: [],
  };
  
  // Process profile picture
  if (data.profile.profilePicture) {
    const buffer = await fetchImage(data.profile.profilePicture);
    if (buffer) {
      result.profileImage = await processImage(buffer, 'profile', true);
    }
  }
  
  // Process header image
  if (data.profile.headerImage) {
    const buffer = await fetchImage(data.profile.headerImage);
    if (buffer) {
      result.headerImage = await processImage(buffer, 'header', false);
    }
  }
  
  // Process company logos
  for (const exp of data.experience) {
    if (exp.companyLogo) {
      const buffer = await fetchImage(exp.companyLogo);
      if (buffer) {
        const processed = await processImage(buffer, `company-${exp.id}`, false);
        result.companyLogos.push(processed);
      }
    }
  }
  
  // Process school logos
  for (const edu of data.education) {
    if (edu.schoolLogo) {
      const buffer = await fetchImage(edu.schoolLogo);
      if (buffer) {
        const processed = await processImage(buffer, `school-${edu.id}`, false);
        result.schoolLogos.push(processed);
      }
    }
  }
  
  // Process recommender profile pictures
  for (const rec of data.recommendations) {
    if (rec.recommenderProfilePicture) {
      const buffer = await fetchImage(rec.recommenderProfilePicture);
      if (buffer) {
        const processed = await processImage(buffer, `recommender-${rec.id}`, true);
        result.recommenderImages.push(processed);
      }
    }
  }
  
  return result;
}

export async function createOptimizedImageBundle(
  data: ExtractedData
): Promise<Map<string, Buffer>> {
  const images = new Map<string, Buffer>();
  const processed = await processAllImages(data);
  
  // Add profile image variants
  if (processed.profileImage) {
    images.set('images/profile.webp', processed.profileImage.webp);
    images.set('images/profile-mobile.webp', processed.profileImage.sizes.mobile);
    images.set('images/profile-tablet.webp', processed.profileImage.sizes.tablet);
    images.set('images/profile-desktop.webp', processed.profileImage.sizes.desktop);
  }
  
  // Add header image variants
  if (processed.headerImage) {
    images.set('images/header.webp', processed.headerImage.webp);
    images.set('images/header-mobile.webp', processed.headerImage.sizes.mobile);
    images.set('images/header-tablet.webp', processed.headerImage.sizes.tablet);
    images.set('images/header-desktop.webp', processed.headerImage.sizes.desktop);
  }
  
  // Add company logos
  for (const logo of processed.companyLogos) {
    images.set(`images/${logo.filename}.webp`, logo.webp);
  }
  
  // Add school logos
  for (const logo of processed.schoolLogos) {
    images.set(`images/${logo.filename}.webp`, logo.webp);
  }
  
  // Add recommender images
  for (const img of processed.recommenderImages) {
    images.set(`images/${img.filename}.webp`, img.webp);
  }
  
  return images;
}

export async function getOptimizedImageSrcSet(
  originalUrl: string,
  type: 'profile' | 'header' | 'logo'
): Promise<string> {
  const baseName = type;
  const sizes = type === 'logo' 
    ? '64w' 
    : '(max-width: 480px) 320w, (max-width: 768px) 640w, 1024w';
  
  return `
    images/${baseName}-mobile.webp 320w,
    images/${baseName}-tablet.webp 640w,
    images/${baseName}-desktop.webp 1024w
  `.trim();
}
