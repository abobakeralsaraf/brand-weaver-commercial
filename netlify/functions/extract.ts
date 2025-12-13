const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;

export default async (req, context) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    if (!RAPIDAPI_KEY) {
      return new Response(
        JSON.stringify({
          error:
            "RAPIDAPI_KEY is not configured. Add it in Netlify environment variables to enable extraction.",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }

    const body = JSON.parse(req.body || "{}");
    const linkedinUrl =
      body.linkedinUrl ||
      (body.username ? `https://linkedin.com/in/${body.username}` : undefined);

    if (!linkedinUrl) {
      return new Response(
        JSON.stringify({ error: 'LinkedIn URL is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const response = await fetch(
      `https://linkedin-api8.p.rapidapi.com/get-profile-data?url=${encodeURIComponent(linkedinUrl)}`,
      {
        method: 'GET',
        headers: {
          'x-rapidapi-key': RAPIDAPI_KEY,
          'x-rapidapi-host': 'linkedin-api8.p.rapidapi.com'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    
    return new Response(
      JSON.stringify(data),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error extracting LinkedIn data:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to extract profile data' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
