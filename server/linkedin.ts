import type { ExtractedData, WorkExperience, Education, Certification, Skill, Language, FeaturedPost, Recommendation } from "@shared/schema";

// LinkedIn profile extraction service using Fresh LinkedIn Profile Data API from RapidAPI

export async function extractLinkedInProfile(linkedinUrlOrUsername: string): Promise<ExtractedData> {
  // Check for RapidAPI key
  const rapidApiKey = process.env.RAPIDAPI_KEY;
  
  if (!rapidApiKey) {
    throw new Error("RAPIDAPI_KEY is not configured. Please add your RapidAPI key to extract LinkedIn profiles.");
  }

  // Extract username from full LinkedIn URL or use as-is if already a username
  const username = extractUsernameFromUrl(linkedinUrlOrUsername);
  
  if (!username) {
    throw new Error("Invalid LinkedIn URL or username provided.");
  }

  try {
    return await fetchFromLinkedInApi(username, rapidApiKey);
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
    throw new Error("LinkedIn URL or username is required");
  }
  
  // If it's already just a username (no slashes or protocol), validate it
  // Valid usernames are alphanumeric with hyphens and underscores, no special chars
  if (!cleaned.includes('/') && !cleaned.includes('://')) {
    // Validate username format
    if (/^[a-zA-Z0-9\-_]+$/.test(cleaned)) {
      return cleaned;
    }
    throw new Error(`Invalid LinkedIn username format: ${cleaned}`);
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
  throw new Error(`Invalid LinkedIn profile URL. Please use format: linkedin.com/in/username or just the username`);
}

async function fetchFromLinkedInApi(username: string, apiKey: string): Promise<ExtractedData> {
  const fetchFn = globalThis.fetch;
  const baseUrl = "https://fresh-linkedin-scraper-api.p.rapidapi.com/api/v1/user";
  const headers = {
    "x-rapidapi-key": apiKey,
    "x-rapidapi-host": "fresh-linkedin-scraper-api.p.rapidapi.com",
  };

  // Fetch profile data (required)
  const profileResponse = await fetchFn(
    `${baseUrl}/profile?username=${encodeURIComponent(username)}`,
    { method: "GET", headers }
  );

  if (!profileResponse.ok) {
    const errorText = await profileResponse.text();
    console.error("LinkedIn API error response:", errorText);
    throw new Error(`LinkedIn API returned ${profileResponse.status}: ${errorText}`);
  }

  const profileResult = await profileResponse.json() as Record<string, unknown>;
  if (profileResult.success === false || profileResult.status === 'error') {
    throw new Error(`LinkedIn API request failed: ${profileResult.message || 'Unknown error'}`);
  }
  
  const profileData = profileResult.data as Record<string, unknown>;
  if (!profileData) {
    throw new Error("LinkedIn API returned empty profile data");
  }

  // Fetch additional data in parallel (experience, skills, certifications, recommendations)
  const [experienceResult, skillsResult, certificationsResult, recommendationsResult] = await Promise.all([
    fetchApiEndpoint(`${baseUrl}/experience?username=${encodeURIComponent(username)}`, headers),
    fetchApiEndpoint(`${baseUrl}/skills?username=${encodeURIComponent(username)}`, headers),
    fetchApiEndpoint(`${baseUrl}/certifications?username=${encodeURIComponent(username)}`, headers),
    fetchApiEndpoint(`${baseUrl}/recommendations?username=${encodeURIComponent(username)}`, headers),
  ]);

  console.log(`[LinkedIn API] Profile: ${profileData.full_name || profileData.first_name}`);
  console.log(`[LinkedIn API] Experience: ${experienceResult?.length || 0} items`);
  console.log(`[LinkedIn API] Skills: ${skillsResult?.length || 0} items`);
  console.log(`[LinkedIn API] Certifications: ${certificationsResult?.length || 0} items`);
  console.log(`[LinkedIn API] Recommendations: ${recommendationsResult?.length || 0} items`);

  return transformApiResponse(profileData, username, {
    experience: experienceResult || [],
    skills: skillsResult || [],
    certifications: certificationsResult || [],
    recommendations: recommendationsResult || [],
  });
}

async function fetchApiEndpoint(url: string, headers: Record<string, string>): Promise<any[] | null> {
  try {
    const response = await globalThis.fetch(url, { method: "GET", headers });
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
  
  // Extract profile picture from various possible fields
  const profilePicture = apiData.profile_picture || apiData.avatar || apiData.profilePicture || 
    (apiData.logo && Array.isArray(apiData.logo) && apiData.logo[0]?.url) ||
    (apiData.images && apiData.images.profile_images && apiData.images.profile_images[0]) || '';
  
  // Extract background image
  const headerImage = apiData.background_cover_image_url || apiData.cover || 
    (apiData.images && apiData.images.background_images && apiData.images.background_images[0]) || '';

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
  
  return certifications.map((cert: any, idx: number) => ({
    id: `cert-${idx}`,
    name: cert.name || cert.title || '',
    issuer: cert.authority || cert.issuer || cert.organization || '',
    issueDate: formatDate(cert.starts_at || cert.issue_date || cert.issueDate),
    credentialUrl: cert.url || cert.credential_url || '',
  }));
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

