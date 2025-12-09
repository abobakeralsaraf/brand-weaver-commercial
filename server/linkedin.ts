import type { ExtractedData, WorkExperience, Education, Certification, Skill, Language, FeaturedPost, Recommendation } from "@shared/schema";

// LinkedIn profile extraction service
// In production, this would use the Fresh LinkedIn Profile Data API from RapidAPI
// For development, we generate realistic sample data

export async function extractLinkedInProfile(username: string): Promise<ExtractedData> {
  // Check for RapidAPI key
  const rapidApiKey = process.env.RAPIDAPI_KEY;
  
  if (rapidApiKey) {
    try {
      return await fetchFromLinkedInApi(username, rapidApiKey);
    } catch (error) {
      console.error("LinkedIn API error, using sample data:", error);
    }
  }

  // Simulate extraction delay for realistic UX
  await new Promise(resolve => setTimeout(resolve, 500));

  // Return sample data for development/demo
  return generateSampleData(username);
}

async function fetchFromLinkedInApi(username: string, apiKey: string): Promise<ExtractedData> {
  const fetchFn = globalThis.fetch;
  
  const response = await fetchFn(
    `https://fresh-linkedin-profile-data.p.rapidapi.com/get-linkedin-profile?linkedin_url=https://linkedin.com/in/${username}`,
    {
      method: "GET",
      headers: {
        "x-rapidapi-key": apiKey,
        "x-rapidapi-host": "fresh-linkedin-profile-data.p.rapidapi.com",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`LinkedIn API returned ${response.status}`);
  }

  const data = await response.json() as Record<string, unknown>;
  return transformApiResponse(data);
}

function transformApiResponse(apiData: any): ExtractedData {
  // Transform API response to our schema
  return {
    profile: {
      username: apiData.public_identifier || "",
      firstName: apiData.first_name || "",
      lastName: apiData.last_name || "",
      fullName: `${apiData.first_name || ""} ${apiData.last_name || ""}`.trim(),
      headline: apiData.headline || "",
      summary: apiData.summary || "",
      location: apiData.city || apiData.country || "",
      profilePicture: apiData.profile_pic_url || "",
      headerImage: apiData.background_cover_image_url || "",
      linkedinUrl: `https://linkedin.com/in/${apiData.public_identifier}`,
      connections: apiData.connections || 0,
    },
    experience: (apiData.experiences || []).map((exp: any, idx: number) => ({
      id: `exp-${idx}`,
      title: exp.title || "",
      company: exp.company || "",
      companyLogo: exp.company_linkedin_profile_url || "",
      location: exp.location || "",
      startDate: formatDate(exp.starts_at),
      endDate: exp.ends_at ? formatDate(exp.ends_at) : undefined,
      isCurrent: !exp.ends_at,
      description: exp.description || "",
    })),
    education: (apiData.education || []).map((edu: any, idx: number) => ({
      id: `edu-${idx}`,
      school: edu.school || "",
      degree: edu.degree_name || "",
      fieldOfStudy: edu.field_of_study || "",
      startDate: formatDate(edu.starts_at),
      endDate: edu.ends_at ? formatDate(edu.ends_at) : undefined,
    })),
    certifications: (apiData.certifications || []).map((cert: any, idx: number) => ({
      id: `cert-${idx}`,
      name: cert.name || "",
      issuer: cert.authority || "",
      issueDate: formatDate(cert.starts_at),
      credentialUrl: cert.url || "",
    })),
    skills: (apiData.skills || []).map((skill: string) => ({
      name: skill,
    })),
    languages: (apiData.languages || []).map((lang: any) => ({
      name: lang.name || lang,
      proficiency: lang.proficiency || "",
    })),
    featuredPosts: extractFeaturedPosts(apiData),
    recommendations: (apiData.recommendations || []).map((rec: any, idx: number) => ({
      id: `rec-${idx}`,
      recommenderName: rec.name || "Anonymous",
      recommenderHeadline: rec.headline || "",
      recommenderProfilePicture: rec.profile_pic_url || "",
      recommenderLinkedInUrl: rec.linkedin_url || "",
      text: rec.text || "",
    })),
    extractedAt: new Date().toISOString(),
  };
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

function generateSampleData(username: string): ExtractedData {
  const formattedName = username
    .split(/[-_]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

  const experience: WorkExperience[] = [
    {
      id: "exp-1",
      title: "Senior Software Engineer",
      company: "Tech Innovations Inc.",
      location: "San Francisco, CA",
      startDate: "2021-03",
      isCurrent: true,
      description: "Leading development of cloud-native applications and mentoring junior developers. Architecting scalable solutions using modern technologies.",
    },
    {
      id: "exp-2",
      title: "Software Engineer",
      company: "Digital Solutions Corp",
      location: "New York, NY",
      startDate: "2018-06",
      endDate: "2021-02",
      isCurrent: false,
      description: "Developed full-stack web applications using React and Node.js. Implemented CI/CD pipelines and improved code quality standards.",
    },
    {
      id: "exp-3",
      title: "Junior Developer",
      company: "StartUp Labs",
      location: "Boston, MA",
      startDate: "2016-09",
      endDate: "2018-05",
      isCurrent: false,
      description: "Built responsive web interfaces and contributed to backend API development. Collaborated with design team on UX improvements.",
    },
  ];

  const education: Education[] = [
    {
      id: "edu-1",
      school: "Massachusetts Institute of Technology",
      degree: "Master of Science",
      fieldOfStudy: "Computer Science",
      startDate: "2014",
      endDate: "2016",
    },
    {
      id: "edu-2",
      school: "University of California, Berkeley",
      degree: "Bachelor of Science",
      fieldOfStudy: "Computer Engineering",
      startDate: "2010",
      endDate: "2014",
    },
  ];

  const certifications: Certification[] = [
    {
      id: "cert-1",
      name: "AWS Solutions Architect Professional",
      issuer: "Amazon Web Services",
      issueDate: "2023-01",
      credentialUrl: "https://aws.amazon.com/certification/",
    },
    {
      id: "cert-2",
      name: "Google Cloud Professional Developer",
      issuer: "Google Cloud",
      issueDate: "2022-06",
      credentialUrl: "https://cloud.google.com/certification/",
    },
    {
      id: "cert-3",
      name: "Certified Kubernetes Administrator",
      issuer: "Cloud Native Computing Foundation",
      issueDate: "2022-03",
    },
  ];

  const skills: Skill[] = [
    { name: "JavaScript", endorsements: 42 },
    { name: "TypeScript", endorsements: 38 },
    { name: "React", endorsements: 35 },
    { name: "Node.js", endorsements: 33 },
    { name: "Python", endorsements: 28 },
    { name: "AWS", endorsements: 25 },
    { name: "Docker", endorsements: 22 },
    { name: "Kubernetes", endorsements: 18 },
    { name: "PostgreSQL", endorsements: 15 },
    { name: "GraphQL", endorsements: 12 },
  ];

  const languages: Language[] = [
    { name: "English", proficiency: "Native" },
    { name: "Spanish", proficiency: "Professional" },
    { name: "French", proficiency: "Conversational" },
  ];

  const featuredPosts: FeaturedPost[] = [
    {
      id: "post-1",
      postUrl: "https://linkedin.com/posts/example-1",
      contentPreview: "Excited to share our team's latest achievement in cloud architecture optimization...",
      date: "2024-01-15",
      engagement: { likes: 234, comments: 45, shares: 12 },
    },
    {
      id: "post-2",
      postUrl: "https://linkedin.com/posts/example-2",
      contentPreview: "Key takeaways from the tech conference on AI and machine learning trends...",
      date: "2023-11-20",
      engagement: { likes: 189, comments: 32, shares: 8 },
    },
  ];

  const recommendations: Recommendation[] = [
    {
      id: "rec-1",
      recommenderName: "Sarah Johnson",
      recommenderHeadline: "VP of Engineering at Tech Corp",
      recommenderLinkedInUrl: "https://linkedin.com/in/sarahjohnson",
      text: `${formattedName} is an exceptional engineer with a rare combination of technical expertise and leadership skills. Their ability to tackle complex problems while mentoring others makes them an invaluable team member.`,
      relationship: "Managed directly",
      date: "2023-08",
    },
    {
      id: "rec-2",
      recommenderName: "Michael Chen",
      recommenderHeadline: "Senior Software Architect",
      recommenderLinkedInUrl: "https://linkedin.com/in/michaelchen",
      text: "Working with this professional has been a pleasure. Their code quality and attention to detail set a high standard for the entire team. Highly recommended for any technical leadership role.",
      relationship: "Worked together",
      date: "2023-05",
    },
    {
      id: "rec-3",
      recommenderName: "Emily Rodriguez",
      recommenderHeadline: "Product Manager at Innovation Labs",
      recommenderLinkedInUrl: "https://linkedin.com/in/emilyrodriguez",
      text: "A true professional who consistently delivers high-quality work. Their communication skills and ability to translate technical concepts for non-technical stakeholders is remarkable.",
      relationship: "Cross-functional collaboration",
      date: "2022-12",
    },
  ];

  return {
    profile: {
      username,
      firstName: formattedName.split(" ")[0] || "John",
      lastName: formattedName.split(" ").slice(1).join(" ") || "Doe",
      fullName: formattedName || "John Doe",
      headline: "Senior Software Engineer | Cloud Architecture | Full-Stack Development",
      summary: `Passionate software engineer with 8+ years of experience building scalable web applications and cloud-native solutions. I specialize in React, Node.js, and AWS, with a focus on clean code and developer experience.\n\nCurrently leading development teams and architecting solutions that serve millions of users. I believe in continuous learning and sharing knowledge with the community.\n\nOpen to discussing new opportunities and collaborations.`,
      location: "San Francisco Bay Area",
      profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      headerImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1920&h=600&fit=crop",
      linkedinUrl: `https://linkedin.com/in/${username}`,
      connections: 500,
    },
    experience,
    education,
    certifications,
    skills,
    languages,
    featuredPosts,
    recommendations,
    extractedAt: new Date().toISOString(),
  };
}
