import type { ExtractedData, WorkExperience, Education, Certification, Skill, Language, FeaturedPost, Recommendation } from "@shared/schema";

// LinkedIn profile extraction service using Fresh LinkedIn Profile Data API from RapidAPI

export type LinkedInProgressStepId =
  | "profile"
  | "experience"
  | "education"
  | "certifications"
  | "skills"
  | "recommendations"
  | "posts"
  | "images";

export type LinkedInProgressStatus = "pending" | "in_progress" | "completed" | "error";

export interface LinkedInExtractOptions {
  onStepUpdate?: (update: {
    stepId: LinkedInProgressStepId;
    status: LinkedInProgressStatus;
    count?: number;
    message?: string;
  }) => void;
}

export class LinkedInExtractionError extends Error {
  public code:
    | "RAPIDAPI_KEY_MISSING"
    | "INVALID_LINKEDIN_INPUT"
    | "RATE_LIMITED"
    | "UPSTREAM_ERROR"
    | "NETWORK_ERROR";
  public httpStatus?: number;
  public hint?: string;

  constructor(params: {
    message: string;
    code: LinkedInExtractionError["code"];
    httpStatus?: number;
    hint?: string;
    cause?: unknown;
  }) {
    super(params.message);
    this.name = "LinkedInExtractionError";
    this.code = params.code;
    this.httpStatus = params.httpStatus;
    this.hint = params.hint;
    if (params.cause) (this as any).cause = params.cause;
  }
}

export async function extractLinkedInProfile(
  linkedinUrlOrUsername: string,
  options?: LinkedInExtractOptions
): Promise<ExtractedData> {
  // Check for RapidAPI key
  const rapidApiKey = process.env.RAPIDAPI_KEY;
  
  if (!rapidApiKey) {
    throw new LinkedInExtractionError({
      code: "RAPIDAPI_KEY_MISSING",
      message: "RAPIDAPI_KEY is not configured. Please add your RapidAPI key to extract LinkedIn profiles.",
      hint: "Set RAPIDAPI_KEY in your server environment variables (RapidAPI → Fresh LinkedIn Scraper API).",
    });
  }

  // Extract username from full LinkedIn URL or use as-is if already a username
  const username = extractUsernameFromUrl(linkedinUrlOrUsername);
  
  if (!username) {
    throw new LinkedInExtractionError({
      code: "INVALID_LINKEDIN_INPUT",
      message: "Invalid LinkedIn URL or username provided.",
      hint: "Use linkedin.com/in/<username> or just the username.",
    });
  }

  try {
    return await fetchFromLinkedInApi(username, rapidApiKey, options);
  } catch (error) {
    console.error("LinkedIn API error:", error);
    throw error;
  }
}

// Extract username from LinkedIn URL (handles various formats)
function extractUsernameFromUrl(input: string): string {
  // Remove whitespace
  const cleaned = input.trim();
  
  if (!cleaned) {
    throw new LinkedInExtractionError({
      code: "INVALID_LINKEDIN_INPUT",
      message: "LinkedIn URL or username is required",
      hint: "Provide linkedin.com/in/<username> or just the username.",
    });
  }
  
  // If it's already just a username (no slashes or protocol), validate it
  // Valid usernames are alphanumeric with hyphens and underscores, no special chars
  if (!cleaned.includes('/') && !cleaned.includes('://')) {
    // Validate username format
    if (/^[a-zA-Z0-9\-_]+$/.test(cleaned)) {
      return cleaned;
    }
    throw new LinkedInExtractionError({
      code: "INVALID_LINKEDIN_INPUT",
      message: `Invalid LinkedIn username format: ${cleaned}`,
      hint: "Usernames can contain letters, numbers, hyphens and underscores.",
    });
  }
  
  // Try to extract from LinkedIn URL patterns
  // Matches: linkedin.com/in/username, www.linkedin.com/in/username, https://linkedin.com/in/username
  // Also handles locale segments: linkedin.com/in/username/en
  const patterns = [
    /linkedin\.com\/in\/([a-zA-Z0-9\-_]+)/i,
    /linkedin\.com\/pub\/([a-zA-Z0-9\-_]+)/i,
  ];
  
  for (const pattern of patterns) {
    const match = cleaned.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  // No valid LinkedIn profile URL pattern found
  throw new LinkedInExtractionError({
    code: "INVALID_LINKEDIN_INPUT",
    message: "Invalid LinkedIn profile URL. Please use format: linkedin.com/in/username or just the username",
    hint: "Example: https://linkedin.com/in/williamhgates",
  });
}

const DEFAULT_RETRYABLE_STATUSES = new Set([429, 500, 502, 503, 504]);

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchWithRetry(
  url: string,
  init: RequestInit,
  opts?: { retries?: number; baseDelayMs?: number }
): Promise<Response> {
  const retries = Math.max(0, opts?.retries ?? 2);
  const baseDelayMs = Math.max(50, opts?.baseDelayMs ?? 350);

  let lastError: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await globalThis.fetch(url, init);
      if (!DEFAULT_RETRYABLE_STATUSES.has(res.status) || attempt === retries) {
        return res;
      }
      // Retry on 429/5xx with exponential backoff + jitter
      const delay = baseDelayMs * Math.pow(2, attempt) + Math.floor(Math.random() * 150);
      await sleep(delay);
      continue;
    } catch (e) {
      lastError = e;
      if (attempt === retries) break;
      const delay = baseDelayMs * Math.pow(2, attempt) + Math.floor(Math.random() * 150);
      await sleep(delay);
    }
  }

  throw new LinkedInExtractionError({
    code: "NETWORK_ERROR",
    message: "Network error while calling LinkedIn extraction API.",
    hint: "Please try again in a moment.",
    cause: lastError,
  });
}

async function fetchFromLinkedInApi(
  username: string,
  apiKey: string,
  options?: LinkedInExtractOptions
): Promise<ExtractedData> {
  const fetchFn = globalThis.fetch;
  const baseUrl = "https://fresh-linkedin-scraper-api.p.rapidapi.com/api/v1/user";
  const headers = {
    "x-rapidapi-key": apiKey,
    "x-rapidapi-host": "fresh-linkedin-scraper-api.p.rapidapi.com",
  };

  // Fetch profile data (required)
  options?.onStepUpdate?.({ stepId: "profile", status: "in_progress" });
  const profileResponse = await fetchWithRetry(
    `${baseUrl}/profile?username=${encodeURIComponent(username)}`,
    { method: "GET", headers }
  );

  if (!profileResponse.ok) {
    const errorText = await profileResponse.text();
    console.error("LinkedIn API error response:", errorText);
    if (profileResponse.status === 429) {
      throw new LinkedInExtractionError({
        code: "RATE_LIMITED",
        httpStatus: 429,
        message: "LinkedIn extraction API rate-limited the request (HTTP 429).",
        hint: "Wait 30–60 seconds and try again, or upgrade your RapidAPI plan.",
      });
    }
    throw new LinkedInExtractionError({
      code: "UPSTREAM_ERROR",
      httpStatus: profileResponse.status,
      message: `LinkedIn API returned ${profileResponse.status}: ${errorText}`,
      hint: "Check your RapidAPI subscription and that the username exists.",
    });
  }

  const profileResult = await profileResponse.json() as Record<string, unknown>;
  if (profileResult.success === false || profileResult.status === 'error') {
    throw new LinkedInExtractionError({
      code: "UPSTREAM_ERROR",
      message: `LinkedIn API request failed: ${profileResult.message || 'Unknown error'}`,
      hint: "Check your RapidAPI subscription and that the username exists.",
    });
  }
  
  const profileData = profileResult.data as Record<string, unknown>;
  if (!profileData) {
    throw new LinkedInExtractionError({
      code: "UPSTREAM_ERROR",
      message: "LinkedIn API returned empty profile data",
      hint: "Try again or verify the LinkedIn username.",
    });
  }
  options?.onStepUpdate?.({ stepId: "profile", status: "completed" });

  // Fetch additional data in parallel (experience, skills, certifications, recommendations)
  const endpoints: Array<{
    stepId: LinkedInProgressStepId;
    url: string;
  }> = [
    { stepId: "experience", url: `${baseUrl}/experience?username=${encodeURIComponent(username)}` },
    { stepId: "skills", url: `${baseUrl}/skills?username=${encodeURIComponent(username)}` },
    { stepId: "certifications", url: `${baseUrl}/certifications?username=${encodeURIComponent(username)}` },
    { stepId: "recommendations", url: `${baseUrl}/recommendations?username=${encodeURIComponent(username)}` },
  ];

  for (const e of endpoints) options?.onStepUpdate?.({ stepId: e.stepId, status: "in_progress" });

  const results = await Promise.allSettled(
    endpoints.map((e) => fetchApiEndpoint(e.url, headers))
  );

  const experienceResult = results[0].status === "fulfilled" ? results[0].value : null;
  const skillsResult = results[1].status === "fulfilled" ? results[1].value : null;
  const certificationsResult = results[2].status === "fulfilled" ? results[2].value : null;
  const recommendationsResult = results[3].status === "fulfilled" ? results[3].value : null;

  const stepCounts: Record<string, number> = {
    experience: experienceResult?.length || 0,
    skills: skillsResult?.length || 0,
    certifications: certificationsResult?.length || 0,
    recommendations: recommendationsResult?.length || 0,
  };

  endpoints.forEach((e, idx) => {
    const settled = results[idx];
    if (settled.status === "fulfilled") {
      options?.onStepUpdate?.({ stepId: e.stepId, status: "completed", count: stepCounts[e.stepId] });
    } else {
      options?.onStepUpdate?.({
        stepId: e.stepId,
        status: "error",
        message: "Failed to fetch this section; continuing with partial data.",
      });
    }
  });

  console.log(`[LinkedIn API] Profile: ${profileData.full_name || profileData.first_name}`);
  console.log(`[LinkedIn API] Experience: ${experienceResult?.length || 0} items`);
  console.log(`[LinkedIn API] Skills: ${skillsResult?.length || 0} items`);
  console.log(`[LinkedIn API] Certifications: ${certificationsResult?.length || 0} items`);
  console.log(`[LinkedIn API] Recommendations: ${recommendationsResult?.length || 0} items`);

  // The remaining sections are derived from profile payload (best-effort).
  options?.onStepUpdate?.({
    stepId: "education",
    status: "completed",
    count: Array.isArray((profileData as any).education) ? (profileData as any).education.length : 0,
  });
  options?.onStepUpdate?.({
    stepId: "posts",
    status: "completed",
    count: Array.isArray((profileData as any).posts)
      ? (profileData as any).posts.length
      : Array.isArray((profileData as any).articles)
        ? (profileData as any).articles.length
        : 0,
  });
  options?.onStepUpdate?.({
    stepId: "images",
    status: "completed",
    count:
      (Array.isArray((profileData as any).avatar) ? (profileData as any).avatar.length : 0) +
      (Array.isArray((profileData as any).background_cover_image_url) ? (profileData as any).background_cover_image_url.length : 0),
  });

  return transformApiResponse(profileData, username, {
    experience: experienceResult || [],
    skills: skillsResult || [],
    certifications: certificationsResult || [],
    recommendations: recommendationsResult || [],
  });
}

async function fetchApiEndpoint(url: string, headers: Record<string, string>): Promise<any[] | null> {
  try {
    const response = await fetchWithRetry(url, { method: "GET", headers });
    if (!response.ok) return null;
    const result = await response.json() as Record<string, unknown>;
    return (result.data as any[]) || null;
  } catch (error) {
    console.error(`API endpoint error for ${url}:`, error);
    return null;
  }
}

interface AdditionalData {
  experience: any[];
  skills: any[];
  certifications: any[];
  recommendations: any[];
}

function transformApiResponse(apiData: any, username: string, additionalData: AdditionalData): ExtractedData {
  // Fresh LinkedIn Scraper API field mappings
  
  // Extract name - API returns first_name, last_name, full_name
  const fullName = apiData.full_name || `${apiData.first_name || ''} ${apiData.last_name || ''}`.trim() || '';
  const firstName = apiData.first_name || '';
  const lastName = apiData.last_name || '';
  
  // Extract profile picture - API returns avatar as array of image objects
  let profilePicture = '';
  if (apiData.avatar && Array.isArray(apiData.avatar) && apiData.avatar.length > 0) {
    // Get the highest resolution image (last in array)
    profilePicture = apiData.avatar[apiData.avatar.length - 1]?.url || apiData.avatar[0]?.url || '';
  } else if (typeof apiData.avatar === 'string') {
    profilePicture = apiData.avatar;
  } else if (apiData.profile_picture) {
    profilePicture = typeof apiData.profile_picture === 'string' ? apiData.profile_picture : '';
  }
  
  // Extract background image - API returns background_cover_image_url as array
  let headerImage = '';
  if (apiData.background_cover_image_url && Array.isArray(apiData.background_cover_image_url) && apiData.background_cover_image_url.length > 0) {
    headerImage = apiData.background_cover_image_url[apiData.background_cover_image_url.length - 1]?.url || apiData.background_cover_image_url[0]?.url || '';
  } else if (typeof apiData.background_cover_image_url === 'string') {
    headerImage = apiData.background_cover_image_url;
  }

  // Extract location
  const location = apiData.location || apiData.geoLocation || '';
  
  // Extract follower/connection count
  const connections = apiData.follower_count || apiData.followers || apiData.connections || 0;

  // Use additionalData from separate API calls, fall back to apiData fields if present
  const experienceData = additionalData.experience.length > 0 ? additionalData.experience : (apiData.experience || apiData.experiences || []);
  const skillsData = additionalData.skills.length > 0 ? additionalData.skills : (apiData.skills || []);
  const certificationsData = additionalData.certifications.length > 0 ? additionalData.certifications : (apiData.certifications || []);
  const recommendationsData = additionalData.recommendations.length > 0 ? additionalData.recommendations : (apiData.recommendations || []);

  return {
    profile: {
      username: apiData.username || apiData.vanityName || apiData.public_identifier || username,
      firstName,
      lastName,
      fullName,
      headline: apiData.headline || '',
      summary: apiData.about || apiData.summary || '',
      location: typeof location === 'string' ? location : (location?.city || location?.country || ''),
      profilePicture,
      headerImage,
      linkedinUrl: `https://linkedin.com/in/${apiData.public_identifier || apiData.username || username}`,
      connections,
    },
    experience: transformExperience(experienceData),
    education: transformEducation(apiData.education || []),
    certifications: transformCertifications(certificationsData),
    skills: transformSkills(skillsData),
    languages: transformLanguages(apiData.languages || []),
    featuredPosts: extractFeaturedPosts(apiData),
    recommendations: transformRecommendations(recommendationsData),
    extractedAt: new Date().toISOString(),
  };
}

function transformExperience(experiences: any[]): WorkExperience[] {
  if (!Array.isArray(experiences)) return [];
  
  return experiences.map((exp: any, idx: number) => {
    // Handle date from API format: { start: "Jan 2018", end: "Present" }
    const dateInfo = exp.date || {};
    const startDate = dateInfo.start || formatDate(exp.starts_at || exp.start_date || exp.startDate);
    const endDateRaw = dateInfo.end || exp.ends_at || exp.end_date || exp.endDate;
    const isCurrent = endDateRaw === 'Present' || exp.is_current || !endDateRaw;
    const endDate = isCurrent ? undefined : (typeof endDateRaw === 'string' ? endDateRaw : formatDate(endDateRaw));
    
    // Get company logo - API returns company.logo array
    let companyLogo = '';
    if (exp.company?.logo && Array.isArray(exp.company.logo) && exp.company.logo.length > 0) {
      companyLogo = exp.company.logo[0]?.url || '';
    } else {
      companyLogo = exp.company_logo || exp.companyLogo || '';
    }
    
    return {
      id: `exp-${idx}`,
      title: exp.title || exp.position || '',
      company: exp.company?.name || exp.company || exp.company_name || exp.companyName || '',
      companyLogo,
      location: exp.location || '',
      startDate,
      endDate,
      isCurrent,
      description: exp.description || exp.summary || '',
    };
  });
}

function transformEducation(education: any[]): Education[] {
  if (!Array.isArray(education)) return [];
  
  return education.map((edu: any, idx: number) => ({
    id: `edu-${idx}`,
    school: edu.school || edu.school_name || edu.institution || '',
    degree: edu.degree || edu.degree_name || '',
    fieldOfStudy: edu.field_of_study || edu.fieldOfStudy || edu.major || '',
    startDate: formatDate(edu.starts_at || edu.start_date || edu.startDate),
    endDate: edu.ends_at || edu.end_date || edu.endDate ? formatDate(edu.ends_at || edu.end_date || edu.endDate) : undefined,
  }));
}

function transformCertifications(certifications: any[]): Certification[] {
  if (!Array.isArray(certifications)) return [];
  
  return certifications.map((cert: any, idx: number) => {
    // Get issuer logo - API may return logo array
    let issuerLogo = '';
    if (cert.company?.logo && Array.isArray(cert.company.logo) && cert.company.logo.length > 0) {
      issuerLogo = cert.company.logo[0]?.url || '';
    } else if (cert.issuer_logo) {
      issuerLogo = typeof cert.issuer_logo === 'string' ? cert.issuer_logo : '';
    }
    
    return {
      id: `cert-${idx}`,
      name: cert.name || cert.title || '',
      issuer: cert.authority || cert.issuer || cert.organization || '',
      issuerLogo,
      issueDate: formatDate(cert.starts_at || cert.issue_date || cert.issueDate),
      credentialUrl: cert.url || cert.credential_url || '',
    };
  });
}

function transformSkills(skills: any[]): Skill[] {
  if (!Array.isArray(skills)) return [];
  
  return skills.map((skill: any) => {
    // Skills can be strings or objects
    if (typeof skill === 'string') {
      return { name: skill };
    }
    return {
      name: skill.name || skill.skill || '',
      endorsements: skill.endorsements || skill.endorsement_count || 0,
    };
  });
}

function transformLanguages(languages: any[]): Language[] {
  if (!Array.isArray(languages)) return [];
  
  return languages.map((lang: any) => {
    if (typeof lang === 'string') {
      return { name: lang, proficiency: '' };
    }
    return {
      name: lang.name || lang.language || '',
      proficiency: lang.proficiency || lang.level || '',
    };
  });
}

function transformRecommendations(recommendations: any[]): Recommendation[] {
  if (!Array.isArray(recommendations)) return [];
  
  return recommendations.map((rec: any, idx: number) => {
    // API returns recommender object with full_name, description, avatar, url
    const recommender = rec.recommender || {};
    
    // Get recommender avatar - API returns avatar array
    let recommenderPicture = '';
    if (recommender.avatar && Array.isArray(recommender.avatar) && recommender.avatar.length > 0) {
      recommenderPicture = recommender.avatar[0]?.url || '';
    } else {
      recommenderPicture = rec.profile_pic_url || rec.avatar || '';
    }
    
    return {
      id: `rec-${idx}`,
      recommenderName: recommender.full_name || rec.name || rec.recommender_name || rec.author || 'Anonymous',
      recommenderHeadline: recommender.description || rec.headline || rec.recommender_headline || rec.title || '',
      recommenderProfilePicture: recommenderPicture,
      recommenderLinkedInUrl: recommender.url || rec.linkedin_url || rec.profile_url || '',
      text: rec.text || rec.recommendation || rec.content || '',
    };
  });
}

function extractFeaturedPosts(apiData: any): any[] {
  // Try different field names that LinkedIn API might use for posts/articles
  const possibleFields = ['articles', 'posts', 'featured', 'activities', 'publications'];
  
  for (const field of possibleFields) {
    if (apiData[field] && Array.isArray(apiData[field]) && apiData[field].length > 0) {
      return apiData[field].map((post: any, idx: number) => ({
        id: `post-${idx}`,
        postUrl: post.url || post.link || post.article_link || `https://linkedin.com/posts/${idx}`,
        contentPreview: post.title || post.description || post.text || post.content || "Featured content",
        date: formatDate(post.published_on) || formatDate(post.date) || new Date().toISOString().split('T')[0],
        engagement: {
          likes: post.likes || post.num_likes || 0,
          comments: post.comments || post.num_comments || 0,
          shares: post.shares || post.num_shares || 0,
        },
        imageUrl: post.image_url || post.cover_image || post.thumbnail || "",
      }));
    }
  }
  
  return [];
}

function formatDate(dateObj: any): string {
  if (!dateObj) return "";
  if (typeof dateObj === "string") return dateObj;
  if (dateObj.year) {
    const month = dateObj.month ? String(dateObj.month).padStart(2, "0") : "01";
    return `${dateObj.year}-${month}`;
  }
  return "";
}

