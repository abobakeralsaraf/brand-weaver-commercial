import axios from 'axios';

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;

export default async (req, context) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const { linkedinUrl } = JSON.parse(req.body || '{}');

    if (!linkedinUrl) {
      return new Response(
        JSON.stringify({ error: 'LinkedIn URL is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const options = {
      method: 'GET',
      url: 'https://linkedin-api8.p.rapidapi.com/get-profile-data',
      params: { url: linkedinUrl },
      headers: {
        'x-rapidapi-key': RAPIDAPI_KEY,
        'x-rapidapi-host': 'linkedin-api8.p.rapidapi.com'
      }
    };

    const response = await axios.request(options);
    
    return new Response(
      JSON.stringify(response.data),
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
