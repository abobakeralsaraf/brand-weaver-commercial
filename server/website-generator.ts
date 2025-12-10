import type { ExtractedData, WebsiteConfig } from "@shared/schema";

export async function generateWebsite(
  data: ExtractedData,
  config: WebsiteConfig
): Promise<Map<string, string>> {
  const files = new Map<string, string>();
  
  // Generate index.html
  const indexHtml = generateIndexHtml(data, config);
  files.set("index.html", indexHtml);
  
  // Generate CSS
  const css = generateCss(config);
  files.set("styles.css", css);
  
  // Generate JavaScript for interactions
  const js = generateJs(config);
  files.set("script.js", js);
  
  // Generate sitemap.xml
  const sitemap = generateSitemap(data);
  files.set("sitemap.xml", sitemap);
  
  // Generate robots.txt
  const robots = generateRobotsTxt();
  files.set("robots.txt", robots);

  return files;
}

export function createPreviewHtml(data?: any, config?: any): string {
  // If we have actual data, use the full generator
  if (data && config) {
    return generateIndexHtml(data, config);
  }
  
  // Generate a sample preview using full generator with COMPLETE sample data
  const sampleData = {
    profile: {
      username: "sample-user",
      firstName: "Test",
      lastName: "Profile",
      fullName: "Test Profile",
      headline: "Senior Software Engineer | Cloud Architecture | Full-Stack Development",
      summary: "Passionate software engineer with 8+ years of experience building scalable web applications and cloud-native solutions. I specialize in React, Node.js, and AWS, with a focus on clean code and developer experience.\n\nCurrently leading development teams and architecting solutions that serve millions of users. I believe in continuous learning and sharing knowledge with the community.\n\nOpen to discussing new opportunities and collaborations.",
      location: "San Francisco Bay Area",
      profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      headerImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1920&h=600&fit=crop",
      linkedinUrl: "https://linkedin.com/in/sample",
      connections: 500,
    },
    experience: [
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
    ],
    education: [
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
    ],
    certifications: [
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
    ],
    skills: [
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
    ],
    languages: [
      { name: "English", proficiency: "Native" },
      { name: "Spanish", proficiency: "Professional" },
      { name: "French", proficiency: "Conversational" },
    ],
    featuredPosts: [
      {
        id: "post-1",
        postUrl: "https://linkedin.com/posts/sample-1",
        contentPreview: "Excited to share our team's latest achievement in cloud architecture optimization. We reduced infrastructure costs by 40% while improving performance...",
        date: "2024-01-15",
        engagement: { likes: 234, comments: 45, shares: 12 },
      },
      {
        id: "post-2",
        postUrl: "https://linkedin.com/posts/sample-2",
        contentPreview: "Key takeaways from the tech conference on AI and machine learning trends. The future of software development is evolving rapidly...",
        date: "2023-11-20",
        engagement: { likes: 189, comments: 32, shares: 8 },
      },
    ],
    recommendations: [
      {
        id: "rec-1",
        recommenderName: "Sarah Johnson",
        recommenderHeadline: "VP of Engineering at Tech Corp",
        recommenderLinkedInUrl: "https://linkedin.com/in/sarahjohnson",
        text: "An exceptional engineer with a rare combination of technical expertise and leadership skills. Their ability to tackle complex problems while mentoring others makes them an invaluable team member.",
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
    ],
    extractedAt: new Date().toISOString(),
  };

  const sampleConfig = {
    language: "english" as const,
    colorScheme: {
      id: "modern-blue",
      name: "Modern Blue",
      primary: "#2563eb",
      secondary: "#1e40af",
      accent: "#60a5fa",
    },
    typography: {
      id: "modern-professional",
      name: "Modern Professional",
      headingFont: "Inter",
      bodyFont: "Roboto",
    },
    aestheticLevel: "enhanced" as const,
    whatsappNumber: "+1234567890",
    phoneNumber: "+1234567890",
    portfolioProjects: [],
  };

  return generateIndexHtml(sampleData, sampleConfig);
}

function generateIndexHtml(data: ExtractedData, config: WebsiteConfig): string {
  // Add defensive defaults for all data fields
  const profile = data.profile ?? { 
    fullName: "Your Name", 
    headline: "", 
    location: "", 
    summary: "",
    profilePicture: "",
    headerImage: ""
  };
  const experience = data.experience ?? [];
  const education = data.education ?? [];
  const certifications = data.certifications ?? [];
  const skills = data.skills ?? [];
  const recommendations = data.recommendations ?? [];
  const featuredPosts = data.featuredPosts ?? [];
  const languages = data.languages ?? [];
  
  const isRtl = config.language === "arabic";
  const isBilingual = config.language === "both";
  
  const primaryColor = config.colorScheme.primary;
  const secondaryColor = config.colorScheme.secondary;
  const accentColor = config.colorScheme.accent;
  const headingFont = config.typography.headingFont;
  const bodyFont = config.typography.bodyFont;
  
  const aosEnabled = config.aestheticLevel !== "standard";
  const gsapEnabled = config.aestheticLevel === "premium";
  
  // Portfolio projects from config
  const portfolioProjects = config.portfolioProjects || [];
  
  // Google Analytics config
  const gaId = config.analytics?.googleAnalyticsId;
  const showConsentBanner = config.analytics?.enableConsentBanner !== false && gaId;
  
  // Complete translations for all UI elements
  const t = {
    about: { en: "About Me", ar: "نبذة عني" },
    experience: { en: "Experience", ar: "الخبرة العملية" },
    education: { en: "Education", ar: "التعليم" },
    skills: { en: "Skills", ar: "المهارات" },
    certifications: { en: "Certifications", ar: "الشهادات" },
    recommendations: { en: "Recommendations", ar: "التوصيات" },
    featuredPosts: { en: "Featured Posts", ar: "المنشورات المميزة" },
    portfolio: { en: "Portfolio", ar: "معرض الأعمال" },
    viewProject: { en: "View Project", ar: "عرض المشروع" },
    viewCode: { en: "View Code", ar: "عرض الكود" },
    present: { en: "Present", ar: "حتى الآن" },
    viewPost: { en: "View Post", ar: "عرض المنشور" },
    cookieConsent: { en: "This website uses cookies for analytics.", ar: "يستخدم هذا الموقع ملفات تعريف الارتباط للتحليلات." },
    accept: { en: "Accept", ar: "قبول" },
    decline: { en: "Decline", ar: "رفض" },
    viewOnLinkedIn: { en: "View on LinkedIn", ar: "عرض على لينكد إن" },
    connectOnLinkedIn: { en: "Connect on LinkedIn", ar: "تواصل على لينكد إن" },
    issuedBy: { en: "Issued by", ar: "صادرة من" },
    viewCredential: { en: "View Credential", ar: "عرض الشهادة" },
    endorsements: { en: "endorsements", ar: "تأييدات" },
    readMore: { en: "Read More", ar: "اقرأ المزيد" },
    languages: { en: "Languages", ar: "اللغات" },
    contactMe: { en: "Contact Me", ar: "تواصل معي" },
    callMe: { en: "Call Me", ar: "اتصل بي" },
    whatsApp: { en: "WhatsApp", ar: "واتساب" },
    connections: { en: "Connections", ar: "الاتصالات" },
    followers: { en: "Followers", ar: "المتابعون" },
    location: { en: "Location", ar: "الموقع" },
    at: { en: "at", ar: "في" },
    to: { en: "to", ar: "إلى" },
    personalPortfolio: { en: "Personal Portfolio", ar: "الملف الشخصي" },
    professionalProfile: { en: "Professional Profile", ar: "الملف المهني" },
    switchToArabic: { en: "العربية", ar: "العربية" },
    switchToEnglish: { en: "English", ar: "English" },
    allRightsReserved: { en: "All Rights Reserved", ar: "جميع الحقوق محفوظة" },
    builtWith: { en: "Built with Brand Weaver", ar: "صُنع بواسطة براند ويفر" },
    degree: { en: "Degree", ar: "الدرجة العلمية" },
    fieldOfStudy: { en: "Field of Study", ar: "التخصص" },
    technologies: { en: "Technologies", ar: "التقنيات" },
    liveDemo: { en: "Live Demo", ar: "عرض مباشر" },
    sourceCode: { en: "Source Code", ar: "الكود المصدري" },
  };
  
  const getText = (key: keyof typeof t) => {
    if (isBilingual) {
      return `<span class="lang-en">${t[key].en}</span><span class="lang-ar" style="display:none;">${t[key].ar}</span>`;
    }
    return isRtl ? t[key].ar : t[key].en;
  };

  return `
<!DOCTYPE html>
<html lang="${isRtl ? 'ar' : 'en'}" dir="${isRtl ? 'rtl' : 'ltr'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${profile.fullName} - ${profile.headline || 'Personal Portfolio'}</title>
  <meta name="description" content="${(profile.summary || '').substring(0, 160)}">
  <meta name="keywords" content="${skills.map(s => s.name).join(', ')}">
  
  <!-- Open Graph -->
  <meta property="og:title" content="${profile.fullName} - ${profile.headline || 'Portfolio'}">
  <meta property="og:description" content="${(profile.summary || '').substring(0, 160)}">
  <meta property="og:image" content="${profile.profilePicture || ''}">
  <meta property="og:type" content="profile">
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${profile.fullName}">
  <meta name="twitter:description" content="${(profile.summary || '').substring(0, 160)}">
  
  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=${headingFont.replace(/ /g, '+')}:wght@400;600;700&family=${bodyFont.replace(/ /g, '+')}:wght@400;500&family=Cairo:wght@400;600;700&family=Tajawal:wght@400;500;700&display=swap" rel="stylesheet">
  
  ${aosEnabled ? '<!-- AOS Animation Library -->\n  <link rel="stylesheet" href="https://unpkg.com/aos@2.3.1/dist/aos.css">' : ''}
  
  ${featuredPosts.length > 0 ? '<!-- Swiper CSS -->\n  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css">' : ''}
  
  ${gaId ? `<!-- Google Analytics -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=${gaId}"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    ${showConsentBanner ? `
    // Wait for consent before tracking
    if (localStorage.getItem('analytics-consent') === 'accepted') {
      gtag('js', new Date());
      gtag('config', '${gaId}', { anonymize_ip: true });
    }
    ` : `
    gtag('js', new Date());
    gtag('config', '${gaId}', { anonymize_ip: true });
    `}
  </script>` : ''}
  
  <style>
    :root {
      --primary: ${primaryColor};
      --secondary: ${secondaryColor};
      --accent: ${accentColor};
      --heading-font: '${headingFont}', ${isRtl || isBilingual ? "'Cairo', 'Tajawal', " : ''}sans-serif;
      --body-font: '${bodyFont}', ${isRtl || isBilingual ? "'Cairo', 'Tajawal', " : ''}sans-serif;
      --heading-font-ar: 'Cairo', 'Tajawal', sans-serif;
      --body-font-ar: 'Cairo', 'Tajawal', sans-serif;
    }
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    html { scroll-behavior: smooth; }
    
    body {
      font-family: var(--body-font);
      line-height: 1.7;
      color: #1f2937;
      background: #ffffff;
    }
    
    body.rtl {
      direction: rtl;
      font-family: var(--body-font-ar);
    }
    
    body.rtl h1, body.rtl h2, body.rtl h3, body.rtl h4, body.rtl h5, body.rtl h6 {
      font-family: var(--heading-font-ar);
    }
    
    h1, h2, h3, h4, h5, h6 {
      font-family: var(--heading-font);
      font-weight: 700;
    }
    
    ${isBilingual ? `
    /* Language Switcher */
    .lang-switcher {
      position: fixed;
      top: 20px;
      ${isRtl ? 'left' : 'right'}: 20px;
      display: flex;
      gap: 8px;
      z-index: 1001;
      background: rgba(255,255,255,0.95);
      padding: 6px;
      border-radius: 30px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.1);
    }
    
    .lang-btn {
      padding: 8px 18px;
      border-radius: 20px;
      background: transparent;
      color: var(--primary);
      border: none;
      cursor: pointer;
      font-size: 0.9rem;
      font-weight: 600;
      transition: all 0.3s ease;
    }
    
    .lang-btn.active {
      background: var(--primary);
      color: white;
    }
    
    .lang-btn:hover:not(.active) {
      background: rgba(0,0,0,0.05);
    }
    
    .lang-ar { display: none; }
    body.rtl .lang-en { display: none; }
    body.rtl .lang-ar { display: inline; }
    ` : ''}
    
    /* Hero Section */
    .hero {
      background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
      color: white;
      padding: 100px 20px 80px;
      text-align: center;
      position: relative;
      overflow: hidden;
    }
    
    ${profile.headerImage ? `
    .hero::before {
      content: '';
      position: absolute;
      inset: 0;
      background: url('${profile.headerImage}') center/cover;
      opacity: 0.15;
    }
    ` : ''}
    
    ${gsapEnabled ? `
    .hero::after {
      content: '';
      position: absolute;
      bottom: -50%;
      left: -10%;
      width: 120%;
      height: 100%;
      background: radial-gradient(ellipse, rgba(255,255,255,0.1) 0%, transparent 70%);
      animation: heroGlow 8s ease-in-out infinite;
    }
    
    @keyframes heroGlow {
      0%, 100% { transform: translateY(0) scale(1); opacity: 0.3; }
      50% { transform: translateY(-20px) scale(1.1); opacity: 0.5; }
    }
    ` : ''}
    
    .hero-content {
      position: relative;
      z-index: 1;
      max-width: 800px;
      margin: 0 auto;
    }
    
    .profile-image {
      width: 160px;
      height: 160px;
      border-radius: 50%;
      border: 5px solid white;
      box-shadow: 0 8px 24px rgba(0,0,0,0.2);
      margin: 0 auto 24px;
      object-fit: cover;
      background: rgba(255,255,255,0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 3rem;
      font-weight: 700;
    }
    
    .hero h1 {
      font-size: 2.75rem;
      margin-bottom: 12px;
      ${gsapEnabled ? 'opacity: 0; transform: translateY(30px);' : ''}
    }
    
    .hero .headline {
      font-size: 1.25rem;
      opacity: 0.95;
      ${gsapEnabled ? 'opacity: 0; transform: translateY(20px);' : ''}
    }
    
    .hero .location {
      margin-top: 16px;
      opacity: 0.85;
      font-size: 0.95rem;
    }
    
    /* Container */
    .container {
      max-width: 1100px;
      margin: 0 auto;
      padding: 0 20px;
    }
    
    /* Sections */
    section {
      padding: 60px 0;
    }
    
    section:nth-child(even) {
      background: #f9fafb;
    }
    
    .section-title {
      font-size: 2rem;
      color: var(--primary);
      margin-bottom: 32px;
      text-align: center;
    }
    
    /* About */
    .about-text {
      max-width: 700px;
      margin: 0 auto;
      text-align: center;
      color: #4b5563;
      font-size: 1.1rem;
      white-space: pre-line;
    }
    
    /* Timeline */
    .timeline {
      position: relative;
      max-width: 800px;
      margin: 0 auto;
    }
    
    .timeline::before {
      content: '';
      position: absolute;
      ${isRtl ? 'right' : 'left'}: 0;
      top: 0;
      bottom: 0;
      width: 2px;
      background: var(--accent);
    }
    
    body.rtl .timeline::before {
      left: auto;
      right: 0;
    }
    
    .timeline-item {
      position: relative;
      padding-${isRtl ? 'right' : 'left'}: 40px;
      margin-bottom: 32px;
    }
    
    body.rtl .timeline-item {
      padding-left: 0;
      padding-right: 40px;
    }
    
    .timeline-item::before {
      content: '';
      position: absolute;
      ${isRtl ? 'right' : 'left'}: -6px;
      top: 6px;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: var(--primary);
      border: 3px solid white;
      box-shadow: 0 0 0 2px var(--accent);
    }
    
    body.rtl .timeline-item::before {
      left: auto;
      right: -6px;
    }
    
    .timeline-item h3 {
      font-size: 1.2rem;
      color: #111827;
      margin-bottom: 4px;
    }
    
    .timeline-item .company {
      font-weight: 600;
      color: var(--primary);
    }
    
    .timeline-item .date {
      font-size: 0.9rem;
      color: #6b7280;
      margin-bottom: 8px;
    }
    
    .timeline-item p {
      color: #4b5563;
      font-size: 0.95rem;
    }
    
    /* Skills */
    .skills-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      justify-content: center;
      max-width: 800px;
      margin: 0 auto;
    }
    
    .skill-tag {
      background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
      color: white;
      padding: 8px 20px;
      border-radius: 25px;
      font-size: 0.95rem;
      font-weight: 500;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .skill-tag:hover {
      transform: translateY(-3px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    
    /* Certifications */
    .cert-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px;
      max-width: 900px;
      margin: 0 auto;
    }
    
    .cert-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
      border: 1px solid #e5e7eb;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .cert-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.1);
    }
    
    .cert-card h4 {
      color: #111827;
      margin-bottom: 8px;
    }
    
    .cert-card .issuer {
      color: var(--primary);
      font-weight: 500;
      margin-bottom: 4px;
    }
    
    .cert-card .date {
      color: #6b7280;
      font-size: 0.9rem;
    }
    
    .cert-logo {
      width: 60px;
      height: 60px;
      margin-bottom: 16px;
      border-radius: 8px;
      overflow: hidden;
      background: #f3f4f6;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .cert-logo img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    
    .cert-icon {
      width: 60px;
      height: 60px;
      margin-bottom: 16px;
      border-radius: 8px;
      background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }
    
    .cert-link {
      display: inline-block;
      margin-top: 12px;
      color: var(--primary);
      text-decoration: none;
      font-weight: 500;
      font-size: 0.9rem;
      transition: color 0.2s ease;
    }
    
    .cert-link:hover {
      color: var(--secondary);
      text-decoration: underline;
    }
    
    /* Recommendations */
    .recommendations-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 24px;
      max-width: 1000px;
      margin: 0 auto;
    }
    
    .rec-card {
      background: white;
      border-radius: 16px;
      padding: 28px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.08);
      border: 1px solid #e5e7eb;
      position: relative;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .rec-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 32px rgba(0,0,0,0.12);
    }
    
    .rec-card::before {
      content: '"';
      position: absolute;
      top: 16px;
      ${isRtl ? 'left' : 'right'}: 24px;
      font-size: 4rem;
      color: var(--accent);
      opacity: 0.3;
      font-family: Georgia, serif;
      line-height: 1;
    }
    
    body.rtl .rec-card::before {
      right: auto;
      left: 24px;
    }
    
    .rec-header {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 18px;
    }
    
    .rec-avatar {
      width: 52px;
      height: 52px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 600;
      font-size: 1.1rem;
      flex-shrink: 0;
    }
    
    .rec-avatar img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
    }
    
    .rec-info {
      flex: 1;
    }
    
    .rec-name {
      font-weight: 600;
      color: #111827;
      text-decoration: none;
      transition: color 0.2s;
    }
    
    .rec-name:hover {
      color: var(--primary);
    }
    
    .rec-title {
      font-size: 0.85rem;
      color: #6b7280;
      margin-top: 2px;
    }
    
    .rec-text {
      color: #4b5563;
      font-style: italic;
      line-height: 1.7;
      font-size: 0.95rem;
    }
    
    .rec-linkedin-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      margin-top: 16px;
      padding: 6px 12px;
      background: #0077b5;
      color: white;
      border-radius: 20px;
      font-size: 0.8rem;
      text-decoration: none;
      transition: background 0.2s;
    }
    
    .rec-linkedin-badge:hover {
      background: #005e93;
    }
    
    /* Portfolio Section */
    .portfolio-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 24px;
      max-width: 1100px;
      margin: 0 auto;
    }
    
    .portfolio-card {
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 16px rgba(0,0,0,0.08);
      border: 1px solid #e5e7eb;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .portfolio-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 12px 32px rgba(0,0,0,0.12);
    }
    
    .portfolio-card-image {
      width: 100%;
      height: 200px;
      object-fit: cover;
      background: linear-gradient(135deg, var(--accent) 0%, var(--primary) 100%);
    }
    
    .portfolio-card-content {
      padding: 24px;
    }
    
    .portfolio-card h4 {
      font-size: 1.2rem;
      color: #111827;
      margin-bottom: 8px;
    }
    
    .portfolio-card p {
      color: #4b5563;
      font-size: 0.95rem;
      line-height: 1.6;
      margin-bottom: 16px;
    }
    
    .portfolio-tech {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 16px;
    }
    
    .portfolio-tech span {
      background: var(--accent);
      color: var(--primary);
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 500;
    }
    
    .portfolio-links {
      display: flex;
      gap: 12px;
    }
    
    .portfolio-link {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      background: var(--primary);
      color: white;
      border-radius: 8px;
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 500;
      transition: background 0.2s;
    }
    
    .portfolio-link:hover {
      background: var(--secondary);
    }
    
    .portfolio-link.secondary {
      background: transparent;
      color: var(--primary);
      border: 1px solid var(--primary);
    }
    
    .portfolio-link.secondary:hover {
      background: var(--primary);
      color: white;
    }
    
    /* Cookie Consent Banner */
    .cookie-banner {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: #111827;
      color: white;
      padding: 16px 20px;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
      gap: 16px;
      z-index: 9999;
      box-shadow: 0 -4px 20px rgba(0,0,0,0.15);
    }
    
    .cookie-banner.hidden {
      display: none;
    }
    
    .cookie-banner p {
      margin: 0;
      font-size: 0.95rem;
    }
    
    .cookie-banner-buttons {
      display: flex;
      gap: 12px;
    }
    
    .cookie-btn {
      padding: 8px 20px;
      border-radius: 6px;
      font-size: 0.9rem;
      font-weight: 500;
      cursor: pointer;
      border: none;
      transition: all 0.2s;
    }
    
    .cookie-btn.accept {
      background: var(--primary);
      color: white;
    }
    
    .cookie-btn.accept:hover {
      background: var(--secondary);
    }
    
    .cookie-btn.decline {
      background: transparent;
      color: white;
      border: 1px solid rgba(255,255,255,0.3);
    }
    
    .cookie-btn.decline:hover {
      border-color: white;
    }
    
    /* Featured Posts Carousel */
    .posts-section {
      padding: 60px 0;
      background: linear-gradient(180deg, #f9fafb 0%, #ffffff 100%);
    }
    
    .swiper {
      padding: 20px 10px 40px;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .swiper-slide {
      height: auto;
    }
    
    .post-card {
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 16px rgba(0,0,0,0.08);
      border: 1px solid #e5e7eb;
      height: 100%;
      display: flex;
      flex-direction: column;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .post-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 32px rgba(0,0,0,0.12);
    }
    
    .post-card-content {
      padding: 24px;
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    
    .post-preview {
      color: #4b5563;
      font-size: 0.95rem;
      line-height: 1.6;
      flex: 1;
      margin-bottom: 16px;
    }
    
    .post-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 16px;
      border-top: 1px solid #e5e7eb;
    }
    
    .post-date {
      font-size: 0.85rem;
      color: #6b7280;
    }
    
    .post-engagement {
      display: flex;
      gap: 12px;
      font-size: 0.85rem;
      color: #6b7280;
    }
    
    .post-engagement span {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    
    .post-link {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 10px 20px;
      background: var(--primary);
      color: white;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 500;
      font-size: 0.9rem;
      transition: background 0.2s;
      margin-top: auto;
    }
    
    .post-link:hover {
      background: var(--secondary);
    }
    
    .swiper-pagination-bullet-active {
      background: var(--primary) !important;
    }
    
    .swiper-button-next, .swiper-button-prev {
      color: var(--primary) !important;
    }
    
    /* Floating Contacts */
    .floating-contacts {
      position: fixed;
      bottom: 30px;
      ${isRtl ? 'left' : 'right'}: 30px;
      display: flex;
      flex-direction: column;
      gap: 15px;
      z-index: 1000;
    }
    
    body.rtl .floating-contacts {
      right: auto;
      left: 30px;
    }
    
    .contact-btn {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      text-decoration: none;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      transition: all 0.3s ease;
    }
    
    .contact-btn:hover {
      transform: translateY(-5px) scale(1.05);
      box-shadow: 0 8px 24px rgba(0,0,0,0.25);
    }
    
    .whatsapp-btn { background: #25D366; }
    .call-btn { background: var(--primary); }
    
    .contact-btn svg {
      width: 28px;
      height: 28px;
    }
    
    /* Footer */
    footer {
      background: #111827;
      color: white;
      padding: 40px 20px;
      text-align: center;
    }
    
    footer a {
      color: var(--accent);
      text-decoration: none;
    }
    
    footer a:hover {
      text-decoration: underline;
    }
    
    /* Responsive */
    @media (max-width: 768px) {
      .hero { padding: 60px 20px 50px; }
      .hero h1 { font-size: 2rem; }
      .profile-image { width: 120px; height: 120px; font-size: 2rem; }
      section { padding: 40px 0; }
      .section-title { font-size: 1.5rem; margin-bottom: 24px; }
      .floating-contacts { bottom: 20px; ${isRtl ? 'left' : 'right'}: 20px; }
      .contact-btn { width: 50px; height: 50px; }
      .contact-btn svg { width: 24px; height: 24px; }
      ${isBilingual ? '.lang-switcher { top: 10px; right: 10px; }' : ''}
      .recommendations-grid { grid-template-columns: 1fr; }
      .cert-grid { grid-template-columns: 1fr; }
    }
  </style>
  
  <!-- Schema.org JSON-LD -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "${profile.fullName}",
    "jobTitle": "${experience[0]?.title || ''}",
    "url": "${profile.linkedinUrl}",
    "image": "${profile.profilePicture || ''}",
    "sameAs": ["${profile.linkedinUrl}"],
    ${experience[0] ? `"worksFor": {"@type": "Organization", "name": "${experience[0].company}"},` : ''}
    "alumniOf": [${education.map(e => `{"@type": "EducationalOrganization", "name": "${e.school}"}`).join(', ')}]
  }
  </script>
</head>
<body${isRtl ? ' class="rtl"' : ''}>
  ${isBilingual ? `
  <div class="lang-switcher">
    <button class="lang-btn active" data-lang="en" onclick="switchLang('en')">EN</button>
    <button class="lang-btn" data-lang="ar" onclick="switchLang('ar')">AR</button>
  </div>
  ` : ''}

  <header class="hero">
    <div class="hero-content">
      ${profile.profilePicture 
        ? `<img src="${profile.profilePicture}" alt="${profile.fullName}" class="profile-image" loading="eager"${aosEnabled ? ' data-aos="zoom-in"' : ''}>`
        : `<div class="profile-image"${aosEnabled ? ' data-aos="zoom-in"' : ''}>${profile.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}</div>`
      }
      <h1${aosEnabled ? ' data-aos="fade-up" data-aos-delay="100"' : ''}>${profile.fullName}</h1>
      ${profile.headline ? `<p class="headline"${aosEnabled ? ' data-aos="fade-up" data-aos-delay="200"' : ''}>${profile.headline}</p>` : ''}
      ${profile.location ? `<p class="location"${aosEnabled ? ' data-aos="fade-up" data-aos-delay="300"' : ''}>${profile.location}</p>` : ''}
    </div>
  </header>
  
  ${profile.summary ? `
  <section id="about">
    <div class="container">
      <h2 class="section-title"${aosEnabled ? ' data-aos="fade-up"' : ''}>${getText('about')}</h2>
      <p class="about-text"${aosEnabled ? ' data-aos="fade-up" data-aos-delay="100"' : ''}>${profile.summary}</p>
    </div>
  </section>
  ` : ''}
  
  ${experience.length > 0 ? `
  <section id="experience">
    <div class="container">
      <h2 class="section-title"${aosEnabled ? ' data-aos="fade-up"' : ''}>${getText('experience')}</h2>
      <div class="timeline">
        ${experience.map((exp, idx) => `
          <div class="timeline-item"${aosEnabled ? ` data-aos="fade-up" data-aos-delay="${idx * 100}"` : ''}>
            <h3>${exp.title}</h3>
            <p class="company">${exp.company}</p>
            <p class="date">${exp.startDate} - ${exp.isCurrent ? (isRtl ? t.present.ar : `<span class="lang-en">${t.present.en}</span><span class="lang-ar" style="display:none;">${t.present.ar}</span>`) : exp.endDate}</p>
            ${exp.description ? `<p>${exp.description}</p>` : ''}
          </div>
        `).join('')}
      </div>
    </div>
  </section>
  ` : ''}
  
  ${education.length > 0 ? `
  <section id="education">
    <div class="container">
      <h2 class="section-title"${aosEnabled ? ' data-aos="fade-up"' : ''}>${getText('education')}</h2>
      <div class="timeline">
        ${education.map((edu, idx) => `
          <div class="timeline-item"${aosEnabled ? ` data-aos="fade-up" data-aos-delay="${idx * 100}"` : ''}>
            <h3>${edu.degree || ''} ${edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}</h3>
            <p class="company">${edu.school}</p>
            ${edu.startDate ? `<p class="date">${edu.startDate}${edu.endDate ? ` - ${edu.endDate}` : ''}</p>` : ''}
          </div>
        `).join('')}
      </div>
    </div>
  </section>
  ` : ''}
  
  ${skills.length > 0 ? `
  <section id="skills">
    <div class="container">
      <h2 class="section-title"${aosEnabled ? ' data-aos="fade-up"' : ''}>${getText('skills')}</h2>
      <div class="skills-grid">
        ${skills.map((skill, idx) => `<span class="skill-tag"${aosEnabled ? ` data-aos="zoom-in" data-aos-delay="${Math.min(idx * 50, 400)}"` : ''}>${skill.name}</span>`).join('')}
      </div>
    </div>
  </section>
  ` : ''}
  
  ${certifications.length > 0 ? `
  <section id="certifications">
    <div class="container">
      <h2 class="section-title"${aosEnabled ? ' data-aos="fade-up"' : ''}>${getText('certifications')}</h2>
      <div class="cert-grid">
        ${certifications.map((cert, idx) => `
          <div class="cert-card"${aosEnabled ? ` data-aos="fade-up" data-aos-delay="${Math.min(idx * 50, 300)}"` : ''}>
            ${cert.issuerLogo ? `
            <div class="cert-logo">
              <img src="${cert.issuerLogo}" alt="${cert.issuer}" loading="lazy">
            </div>
            ` : `
            <div class="cert-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 15l-2 5l-1-6l-6-1l5-2l1-6l2 5l6 1l-5 2z"/><circle cx="12" cy="12" r="3"/></svg>
            </div>
            `}
            <h4>${cert.name}</h4>
            <p class="issuer">${getText('issuedBy')}: ${cert.issuer}</p>
            ${cert.issueDate ? `<p class="date">${cert.issueDate}</p>` : ''}
            ${cert.credentialUrl ? `<a href="${cert.credentialUrl}" target="_blank" rel="noopener" class="cert-link">${getText('viewCredential')}</a>` : ''}
          </div>
        `).join('')}
      </div>
    </div>
  </section>
  ` : ''}
  
  ${featuredPosts.length > 0 ? `
  <section id="posts" class="posts-section">
    <div class="container">
      <h2 class="section-title"${aosEnabled ? ' data-aos="fade-up"' : ''}>${getText('featuredPosts')}</h2>
      <div class="swiper postsSwiper">
        <div class="swiper-wrapper">
          ${featuredPosts.map(post => `
            <div class="swiper-slide">
              <div class="post-card">
                <div class="post-card-content">
                  ${post.contentPreview ? `<p class="post-preview">${post.contentPreview}</p>` : ''}
                  <div class="post-meta">
                    ${post.date ? `<span class="post-date">${post.date}</span>` : ''}
                    ${post.engagement ? `
                    <div class="post-engagement">
                      ${post.engagement.likes ? `<span><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg> ${post.engagement.likes}</span>` : ''}
                      ${post.engagement.comments ? `<span><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M21 6h-2V4c0-1.1-.9-2-2-2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h2v2c0 1.1.9 2 2 2h12l4 4V8c0-1.1-.9-2-2-2zm-4 14l-4-4H7V6h10v14z"/></svg> ${post.engagement.comments}</span>` : ''}
                    </div>
                    ` : ''}
                  </div>
                  <a href="${post.postUrl}" target="_blank" rel="noopener" class="post-link">
                    ${getText('viewPost')}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
                  </a>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="swiper-pagination"></div>
        <div class="swiper-button-prev"></div>
        <div class="swiper-button-next"></div>
      </div>
    </div>
  </section>
  ` : ''}
  
  ${recommendations.length > 0 ? `
  <section id="recommendations">
    <div class="container">
      <h2 class="section-title"${aosEnabled ? ' data-aos="fade-up"' : ''}>${getText('recommendations')}</h2>
      <div class="recommendations-grid">
        ${recommendations.map((rec, idx) => `
          <div class="rec-card"${aosEnabled ? ` data-aos="fade-up" data-aos-delay="${idx * 100}"` : ''}>
            <div class="rec-header">
              <div class="rec-avatar">
                ${rec.recommenderProfilePicture 
                  ? `<img src="${rec.recommenderProfilePicture}" alt="${rec.recommenderName}">`
                  : rec.recommenderName.split(' ').map(n => n[0]).join('').toUpperCase()
                }
              </div>
              <div class="rec-info">
                ${rec.recommenderLinkedInUrl 
                  ? `<a href="${rec.recommenderLinkedInUrl}" target="_blank" rel="noopener" class="rec-name">${rec.recommenderName}</a>`
                  : `<span class="rec-name">${rec.recommenderName}</span>`
                }
                ${rec.recommenderHeadline ? `<p class="rec-title">${rec.recommenderHeadline}</p>` : ''}
              </div>
            </div>
            <p class="rec-text">"${rec.text}"</p>
            ${rec.recommenderLinkedInUrl ? `
            <a href="${rec.recommenderLinkedInUrl}" target="_blank" rel="noopener" class="rec-linkedin-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              ${getText('viewOnLinkedIn')}
            </a>
            ` : ''}
          </div>
        `).join('')}
      </div>
    </div>
  </section>
  ` : ''}
  
  ${portfolioProjects.length > 0 ? `
  <section id="portfolio">
    <div class="container">
      <h2 class="section-title"${aosEnabled ? ' data-aos="fade-up"' : ''}>${getText('portfolio')}</h2>
      <div class="portfolio-grid">
        ${portfolioProjects.map((project, idx) => `
          <div class="portfolio-card"${aosEnabled ? ` data-aos="fade-up" data-aos-delay="${idx * 100}"` : ''}>
            ${project.image 
              ? `<img src="${project.image}" alt="${project.title}" class="portfolio-card-image">`
              : `<div class="portfolio-card-image"></div>`
            }
            <div class="portfolio-card-content">
              <h4>${project.title}</h4>
              <p>${project.description}</p>
              ${project.technologies.length > 0 ? `
              <div class="portfolio-tech">
                ${project.technologies.map(tech => `<span>${tech}</span>`).join('')}
              </div>
              ` : ''}
              <div class="portfolio-links">
                ${project.liveUrl ? `
                <a href="${project.liveUrl}" target="_blank" rel="noopener" class="portfolio-link">
                  ${getText('viewProject')}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
                </a>
                ` : ''}
                ${project.sourceUrl ? `
                <a href="${project.sourceUrl}" target="_blank" rel="noopener" class="portfolio-link secondary">
                  ${getText('viewCode')}
                </a>
                ` : ''}
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </section>
  ` : ''}
  
  <footer>
    <p>&copy; ${new Date().getFullYear()} ${profile.fullName}. ${getText('allRightsReserved')}</p>
    <p style="margin-top: 8px;">
      <a href="${profile.linkedinUrl}" target="_blank" rel="noopener">${getText('viewOnLinkedIn')}</a>
    </p>
  </footer>
  
  ${config.whatsappNumber || config.phoneNumber ? `
  <div class="floating-contacts" aria-label="Contact options">
    ${config.whatsappNumber ? `
    <a href="https://wa.me/${config.whatsappNumber.replace(/[^0-9]/g, '')}" class="contact-btn whatsapp-btn" aria-label="Contact via WhatsApp" target="_blank" rel="noopener noreferrer">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
    </a>
    ` : ''}
    ${config.phoneNumber ? `
    <a href="tel:${config.phoneNumber}" class="contact-btn call-btn" aria-label="Make a phone call">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"></path></svg>
    </a>
    ` : ''}
  </div>
  ` : ''}
  
  ${showConsentBanner ? `
  <div id="cookie-banner" class="cookie-banner">
    <p>${getText('cookieConsent')}</p>
    <div class="cookie-banner-buttons">
      <button class="cookie-btn accept" onclick="acceptCookies()">${getText('accept')}</button>
      <button class="cookie-btn decline" onclick="declineCookies()">${getText('decline')}</button>
    </div>
  </div>
  ` : ''}
  
  ${aosEnabled ? '<script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>' : ''}
  ${featuredPosts.length > 0 ? '<script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>' : ''}
  ${gsapEnabled ? '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>' : ''}
  
  <script>
    ${aosEnabled ? `
    // Initialize AOS
    AOS.init({
      duration: 800,
      once: true,
      offset: 100,
    });
    ` : ''}
    
    ${featuredPosts.length > 0 ? `
    // Initialize Swiper
    new Swiper('.postsSwiper', {
      slidesPerView: 1,
      spaceBetween: 24,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        640: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 3,
        },
      },
    });
    ` : ''}
    
    ${isBilingual ? `
    // Language Switcher
    function switchLang(lang) {
      const body = document.body;
      const html = document.documentElement;
      const langBtns = document.querySelectorAll('.lang-btn');
      
      if (lang === 'ar') {
        body.classList.add('rtl');
        html.setAttribute('lang', 'ar');
        html.setAttribute('dir', 'rtl');
      } else {
        body.classList.remove('rtl');
        html.setAttribute('lang', 'en');
        html.setAttribute('dir', 'ltr');
      }
      
      // Update active button
      langBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
      });
      
      // Toggle text visibility
      document.querySelectorAll('.lang-en').forEach(el => {
        el.style.display = lang === 'en' ? 'inline' : 'none';
      });
      document.querySelectorAll('.lang-ar').forEach(el => {
        el.style.display = lang === 'ar' ? 'inline' : 'none';
      });
      
      // Reinitialize AOS for RTL
      ${aosEnabled ? "if (typeof AOS !== 'undefined') { AOS.refresh(); }" : ''}
    }
    ` : ''}
    
    ${showConsentBanner ? `
    // Cookie Consent Management
    function acceptCookies() {
      localStorage.setItem('analytics-consent', 'accepted');
      document.getElementById('cookie-banner').classList.add('hidden');
      // Initialize analytics after consent
      if (typeof gtag !== 'undefined') {
        gtag('js', new Date());
        gtag('config', '${gaId}', { anonymize_ip: true });
      }
    }
    
    function declineCookies() {
      localStorage.setItem('analytics-consent', 'declined');
      document.getElementById('cookie-banner').classList.add('hidden');
    }
    
    // Check if consent was already given
    (function() {
      const consent = localStorage.getItem('analytics-consent');
      if (consent) {
        document.getElementById('cookie-banner').classList.add('hidden');
      }
    })();
    ` : ''}
    
    ${gsapEnabled ? `
    // GSAP Animations
    if (typeof gsap !== 'undefined') {
      gsap.from('.hero h1', { duration: 1, y: 30, opacity: 0, ease: 'power3.out', delay: 0.3 });
      gsap.from('.hero .headline', { duration: 1, y: 20, opacity: 0, ease: 'power3.out', delay: 0.5 });
      gsap.from('.hero .location', { duration: 1, y: 20, opacity: 0, ease: 'power3.out', delay: 0.7 });
      
      // Parallax effect on scroll
      window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
          hero.style.backgroundPositionY = scrolled * 0.3 + 'px';
        }
      });
    }
    ` : ''}
  </script>
</body>
</html>
  `.trim();
}

function generateCss(config: WebsiteConfig): string {
  return `/* 
 * Generated CSS for ${config.colorScheme.name} theme
 * Typography: ${config.typography.name}
 * Aesthetic Level: ${config.aestheticLevel}
 */

:root {
  --primary: ${config.colorScheme.primary};
  --secondary: ${config.colorScheme.secondary};
  --accent: ${config.colorScheme.accent};
}

/* Additional custom styles can be added here */
`;
}

function generateJs(config: WebsiteConfig): string {
  return `// Generated JavaScript for ${config.aestheticLevel} aesthetic level

document.addEventListener('DOMContentLoaded', function() {
  console.log('Website loaded successfully');
});
`;
}

function generateSitemap(data: ExtractedData): string {
  const baseUrl = "https://example.com";
  const pages = ["", "about", "experience", "education", "certifications", "recommendations", "posts", "contact"];
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>${baseUrl}/${page}</loc>
    <changefreq>monthly</changefreq>
    <priority>${page === "" ? "1.0" : "0.8"}</priority>
  </url>`).join('\n')}
</urlset>`;
}

function generateRobotsTxt(): string {
  return `User-agent: *
Allow: /
Sitemap: https://example.com/sitemap.xml`;
}
