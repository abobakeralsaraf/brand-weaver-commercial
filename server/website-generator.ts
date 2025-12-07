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
  
  // Generate sitemap.xml
  const sitemap = generateSitemap(data);
  files.set("sitemap.xml", sitemap);
  
  // Generate robots.txt
  const robots = generateRobotsTxt();
  files.set("robots.txt", robots);

  return files;
}

export function createPreviewHtml(): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Website Preview</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', system-ui, sans-serif;
      background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    .hero {
      padding: 80px 20px;
      text-align: center;
      color: white;
    }
    .hero h1 {
      font-size: 3rem;
      margin-bottom: 1rem;
      font-weight: 700;
    }
    .hero p {
      font-size: 1.25rem;
      opacity: 0.9;
      max-width: 600px;
      margin: 0 auto;
    }
    .profile-img {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      border: 4px solid white;
      margin: 0 auto 2rem;
      background: rgba(255,255,255,0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 3rem;
    }
    .sections {
      background: white;
      flex: 1;
      padding: 60px 20px;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
    }
    .section {
      margin-bottom: 40px;
    }
    .section h2 {
      font-size: 1.5rem;
      color: #1e40af;
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid #e5e7eb;
    }
    .card {
      background: #f9fafb;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 16px;
    }
    .card h3 {
      font-size: 1.1rem;
      color: #111827;
      margin-bottom: 0.5rem;
    }
    .card p {
      color: #6b7280;
      font-size: 0.9rem;
    }
    .skills {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .skill {
      background: #dbeafe;
      color: #1e40af;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 0.85rem;
    }
    .floating-buttons {
      position: fixed;
      bottom: 30px;
      right: 30px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .floating-btn {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 1.5rem;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      cursor: pointer;
      transition: transform 0.2s;
    }
    .floating-btn:hover {
      transform: translateY(-3px) scale(1.05);
    }
    .whatsapp { background: #25D366; }
    .phone { background: #1e40af; }
  </style>
</head>
<body>
  <div class="hero">
    <div class="profile-img">JD</div>
    <h1>John Doe</h1>
    <p>Senior Software Engineer | Cloud Architecture | Full-Stack Development</p>
  </div>
  <div class="sections">
    <div class="container">
      <div class="section">
        <h2>About</h2>
        <p style="color: #4b5563; line-height: 1.7;">
          Passionate software engineer with 8+ years of experience building scalable 
          web applications and cloud-native solutions. I specialize in React, Node.js, 
          and AWS, with a focus on clean code and developer experience.
        </p>
      </div>
      <div class="section">
        <h2>Experience</h2>
        <div class="card">
          <h3>Senior Software Engineer</h3>
          <p>Tech Innovations Inc. | 2021 - Present</p>
        </div>
        <div class="card">
          <h3>Software Engineer</h3>
          <p>Digital Solutions Corp | 2018 - 2021</p>
        </div>
      </div>
      <div class="section">
        <h2>Skills</h2>
        <div class="skills">
          <span class="skill">JavaScript</span>
          <span class="skill">TypeScript</span>
          <span class="skill">React</span>
          <span class="skill">Node.js</span>
          <span class="skill">AWS</span>
          <span class="skill">Docker</span>
          <span class="skill">PostgreSQL</span>
        </div>
      </div>
    </div>
  </div>
  <div class="floating-buttons">
    <div class="floating-btn whatsapp">W</div>
    <div class="floating-btn phone">P</div>
  </div>
</body>
</html>
  `.trim();
}

function generateIndexHtml(data: ExtractedData, config: WebsiteConfig): string {
  const { profile, experience, education, certifications, skills, recommendations } = data;
  const isRtl = config.language === "arabic";
  const isBilingual = config.language === "both";
  
  const primaryColor = config.colorScheme.primary;
  const headingFont = config.typography.headingFont;
  const bodyFont = config.typography.bodyFont;

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
  <link href="https://fonts.googleapis.com/css2?family=${headingFont.replace(/ /g, '+')}:wght@400;600;700&family=${bodyFont.replace(/ /g, '+')}:wght@400;500&family=Cairo:wght@400;600;700&display=swap" rel="stylesheet">
  
  <style>
    :root {
      --primary: ${primaryColor};
      --secondary: ${config.colorScheme.secondary};
      --accent: ${config.colorScheme.accent};
      --heading-font: '${headingFont}', ${isRtl ? "'Cairo', " : ''}sans-serif;
      --body-font: '${bodyFont}', ${isRtl ? "'Cairo', " : ''}sans-serif;
    }
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      font-family: var(--body-font);
      line-height: 1.7;
      color: #1f2937;
      background: #ffffff;
    }
    
    h1, h2, h3, h4, h5, h6 {
      font-family: var(--heading-font);
      font-weight: 700;
    }
    
    .hero {
      background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
      color: white;
      padding: 100px 20px 80px;
      text-align: center;
      position: relative;
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
    }
    
    .hero h1 {
      font-size: 2.75rem;
      margin-bottom: 12px;
    }
    
    .hero .headline {
      font-size: 1.25rem;
      opacity: 0.95;
    }
    
    .hero .location {
      margin-top: 16px;
      opacity: 0.85;
      font-size: 0.95rem;
    }
    
    .container {
      max-width: 1100px;
      margin: 0 auto;
      padding: 0 20px;
    }
    
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
    
    .about-text {
      max-width: 700px;
      margin: 0 auto;
      text-align: center;
      color: #4b5563;
      font-size: 1.1rem;
      white-space: pre-line;
    }
    
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
    
    .timeline-item {
      position: relative;
      padding-${isRtl ? 'right' : 'left'}: 40px;
      margin-bottom: 32px;
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
    }
    
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
    
    .recommendations-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 24px;
      max-width: 1000px;
      margin: 0 auto;
    }
    
    .rec-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
      border: 1px solid #e5e7eb;
    }
    
    .rec-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
    }
    
    .rec-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: var(--accent);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--primary);
      font-weight: 600;
    }
    
    .rec-name {
      font-weight: 600;
      color: #111827;
    }
    
    .rec-title {
      font-size: 0.85rem;
      color: #6b7280;
    }
    
    .rec-text {
      color: #4b5563;
      font-style: italic;
      line-height: 1.6;
    }
    
    .floating-contacts {
      position: fixed;
      bottom: 30px;
      ${isRtl ? 'left' : 'right'}: 30px;
      display: flex;
      flex-direction: column;
      gap: 15px;
      z-index: 1000;
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
      box-shadow: 0 6px 20px rgba(0,0,0,0.25);
    }
    
    .whatsapp-btn { background: #25D366; }
    .call-btn { background: var(--primary); }
    
    .contact-btn svg {
      width: 28px;
      height: 28px;
    }
    
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
    
    @media (max-width: 768px) {
      .hero { padding: 60px 20px 50px; }
      .hero h1 { font-size: 2rem; }
      .profile-image { width: 120px; height: 120px; }
      section { padding: 40px 0; }
      .section-title { font-size: 1.5rem; }
      .floating-contacts { bottom: 20px; ${isRtl ? 'left' : 'right'}: 20px; }
      .contact-btn { width: 50px; height: 50px; }
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
<body>
  <header class="hero">
    <div class="hero-content">
      ${profile.profilePicture 
        ? `<img src="${profile.profilePicture}" alt="${profile.fullName}" class="profile-image" loading="eager">`
        : `<div class="profile-image">${profile.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}</div>`
      }
      <h1>${profile.fullName}</h1>
      ${profile.headline ? `<p class="headline">${profile.headline}</p>` : ''}
      ${profile.location ? `<p class="location">${profile.location}</p>` : ''}
    </div>
  </header>
  
  ${profile.summary ? `
  <section id="about">
    <div class="container">
      <h2 class="section-title">${isRtl ? 'نبذة عني' : 'About Me'}</h2>
      <p class="about-text">${profile.summary}</p>
    </div>
  </section>
  ` : ''}
  
  ${experience.length > 0 ? `
  <section id="experience">
    <div class="container">
      <h2 class="section-title">${isRtl ? 'الخبرة العملية' : 'Experience'}</h2>
      <div class="timeline">
        ${experience.map(exp => `
          <div class="timeline-item">
            <h3>${exp.title}</h3>
            <p class="company">${exp.company}</p>
            <p class="date">${exp.startDate} - ${exp.isCurrent ? (isRtl ? 'حتى الآن' : 'Present') : exp.endDate}</p>
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
      <h2 class="section-title">${isRtl ? 'التعليم' : 'Education'}</h2>
      <div class="timeline">
        ${education.map(edu => `
          <div class="timeline-item">
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
      <h2 class="section-title">${isRtl ? 'المهارات' : 'Skills'}</h2>
      <div class="skills-grid">
        ${skills.map(skill => `<span class="skill-tag">${skill.name}</span>`).join('')}
      </div>
    </div>
  </section>
  ` : ''}
  
  ${certifications.length > 0 ? `
  <section id="certifications">
    <div class="container">
      <h2 class="section-title">${isRtl ? 'الشهادات' : 'Certifications'}</h2>
      <div class="cert-grid">
        ${certifications.map(cert => `
          <div class="cert-card">
            <h4>${cert.name}</h4>
            <p class="issuer">${cert.issuer}</p>
            ${cert.issueDate ? `<p class="date">${cert.issueDate}</p>` : ''}
          </div>
        `).join('')}
      </div>
    </div>
  </section>
  ` : ''}
  
  ${recommendations.length > 0 ? `
  <section id="recommendations">
    <div class="container">
      <h2 class="section-title">${isRtl ? 'التوصيات' : 'Recommendations'}</h2>
      <div class="recommendations-grid">
        ${recommendations.map(rec => `
          <div class="rec-card">
            <div class="rec-header">
              <div class="rec-avatar">${rec.recommenderName.split(' ').map(n => n[0]).join('').toUpperCase()}</div>
              <div>
                ${rec.recommenderLinkedInUrl 
                  ? `<a href="${rec.recommenderLinkedInUrl}" target="_blank" class="rec-name">${rec.recommenderName}</a>`
                  : `<span class="rec-name">${rec.recommenderName}</span>`
                }
                ${rec.recommenderHeadline ? `<p class="rec-title">${rec.recommenderHeadline}</p>` : ''}
              </div>
            </div>
            <p class="rec-text">"${rec.text}"</p>
          </div>
        `).join('')}
      </div>
    </div>
  </section>
  ` : ''}
  
  <footer>
    <p>&copy; ${new Date().getFullYear()} ${profile.fullName}. All rights reserved.</p>
    <p style="margin-top: 8px;">
      <a href="${profile.linkedinUrl}" target="_blank">LinkedIn</a>
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
</body>
</html>
  `.trim();
}

function generateCss(config: WebsiteConfig): string {
  return `/* Generated CSS for ${config.colorScheme.name} theme */`;
}

function generateSitemap(data: ExtractedData): string {
  const baseUrl = "https://example.com";
  const pages = ["", "about", "experience", "education", "certifications", "recommendations", "contact"];
  
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
