const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;

type ExtractedData = {
  profile: {
    username: string;
    firstName: string;
    lastName: string;
    fullName: string;
    headline?: string;
    summary?: string;
    location?: string;
    profilePicture?: string;
    headerImage?: string;
    linkedinUrl: string;
    connections?: number;
  };
  experience: any[];
  education: any[];
  certifications: any[];
  skills: any[];
  languages: any[];
  featuredPosts: any[];
  recommendations: any[];
  extractedAt: string;
};

async function readJsonBody(req: any): Promise<Record<string, unknown>> {
  try {
    if (typeof req?.json === "function") return (await req.json()) as Record<string, unknown>;
  } catch {
    // fall through
  }
  const raw = typeof req?.body === "string" ? req.body : "";
  try {
    return JSON.parse(raw || "{}") as Record<string, unknown>;
  } catch {
    return {};
  }
}

function usernameFromLinkedInUrl(url: string): string | null {
  const match = url.match(/linkedin\.com\/in\/([a-zA-Z0-9\-_]+)/i);
  return match?.[1] ?? null;
}

function pickLastUrl(arr: any): string | undefined {
  if (!Array.isArray(arr) || arr.length === 0) return undefined;
  const last = arr[arr.length - 1];
  return typeof last?.url === "string" ? last.url : undefined;
}

function normalizeLocation(value: unknown): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    const v = value as any;
    const city = typeof v.city === "string" ? v.city : "";
    const country = typeof v.country === "string" ? v.country : "";
    const parts = [city, country].filter(Boolean);
    return parts.join(", ");
  }
  return String(value);
}

export default async (req: any) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  if (!RAPIDAPI_KEY) {
    return new Response(JSON.stringify({ error: "RAPIDAPI_KEY is not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = await readJsonBody(req);
    const linkedinUrl = typeof body.linkedinUrl === "string" ? body.linkedinUrl : "";
    const usernameRaw = typeof body.username === "string" ? body.username : "";

    const username =
      usernameRaw.trim() ||
      (linkedinUrl ? usernameFromLinkedInUrl(linkedinUrl) : null) ||
      "";

    if (!username) {
      return new Response(JSON.stringify({ error: "LinkedIn username (or URL) is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const baseUrl = "https://fresh-linkedin-scraper-api.p.rapidapi.com/api/v1/user";
    const headers = {
      "x-rapidapi-key": RAPIDAPI_KEY,
      "x-rapidapi-host": "fresh-linkedin-scraper-api.p.rapidapi.com",
    };

    const profileRes = await fetch(`${baseUrl}/profile?username=${encodeURIComponent(username)}`, {
      method: "GET",
      headers,
    });

    if (!profileRes.ok) {
      const text = await profileRes.text();
      throw new Error(`RapidAPI profile failed: ${profileRes.status} ${text}`);
    }

    const profileJson = (await profileRes.json()) as any;
    const profileData = profileJson?.data ?? profileJson;

    const fullName =
      profileData?.full_name ||
      `${profileData?.first_name || ""} ${profileData?.last_name || ""}`.trim();

    const data: ExtractedData = {
      profile: {
        username,
        firstName: profileData?.first_name || "",
        lastName: profileData?.last_name || "",
        fullName: fullName || username,
        headline: profileData?.headline || "",
        summary: profileData?.about || profileData?.summary || "",
        location: normalizeLocation(profileData?.location || profileData?.geoLocation),
        profilePicture:
          pickLastUrl(profileData?.avatar) ||
          (typeof profileData?.avatar === "string" ? profileData.avatar : undefined),
        headerImage:
          pickLastUrl(profileData?.background_cover_image_url) ||
          (typeof profileData?.background_cover_image_url === "string"
            ? profileData.background_cover_image_url
            : undefined),
        linkedinUrl: `https://www.linkedin.com/in/${encodeURIComponent(username)}`,
        connections:
          typeof profileData?.follower_count === "number"
            ? profileData.follower_count
            : typeof profileData?.connections === "number"
              ? profileData.connections
              : undefined,
      },
      // Keep the rest empty for now; generator handles missing sections.
      experience: [],
      education: [],
      certifications: [],
      skills: [],
      languages: [],
      featuredPosts: [],
      recommendations: [],
      extractedAt: new Date().toISOString(),
    };

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error extracting LinkedIn data:", error);
    return new Response(JSON.stringify({ error: "Failed to extract profile data" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
