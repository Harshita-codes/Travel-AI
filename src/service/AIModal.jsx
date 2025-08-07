import { GoogleGenAI } from '@google/genai';


// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GOOGLE_GEMINI_AI_API_KEY });

export async function generateTravelPlan(location, days = 3, group = 'Couple', budget = 'Cheap') {
  try {
    const prompt = `Generate Travel Plan for Location: ${location}, for ${days} Days for ${group} with a ${budget} budget. Give me a Hotels options list with HotelName, Hotel address, Price, hotel image url, geo coordinates, rating, descriptions and suggest itinerary with placeName, Place Details, Place Image Url, Geo Coordinates, ticket Pricing, rating, Time travel each of the location for ${days} days with each day plan with best time to visit 
    give the response in JSON format only`;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    console.log(response.text);
    return response.text;
  } catch (err) {
    console.error('Error fetching response:', err);
    return null;
  }
}


