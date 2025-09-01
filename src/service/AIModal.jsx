import { GoogleGenAI } from '@google/genai';


// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GOOGLE_GEMINI_AI_API_KEY });

export async function generateTravelPlan(location, days, group, budget) {
  try {
    const prompt = `Generate Travel Plan for Location: ${location}, for ${days} Days for ${group} with a ${budget} budget. 
    
    Return ONLY a valid JSON object with this exact structure:
    {
      "location": "${location}",
      "duration_days": ${days},
      "traveler_count": "${group}",
      "budget": "${budget}",
      "hotels": [
        {
          "hotel_name": "Hotel Name",
          "hotel_address": "Complete address",
          "price_per_night": 1000,
          "hotel_image_url": "https://example.com/image.jpg",
          "geo_coordinates": {
            "latitude": 26.8467,
            "longitude": 80.9462
          },
          "rating": 4.2,
          "description": "Hotel description"
        }
      ],
      "itinerary": [
        {
          "day": 1,
          "theme": "Day theme/title",
          "activities": [
            {
              "place_name": "Place Name",
              "place_link": "https://example.com/place",
              "place_details": "Detailed description of the place",
              "place_image_url": "https://example.com/place.jpg",
              "geo_coordinates": {
                "latitude": 26.8467,
                "longitude": 80.9462
              },
              "ticket_pricing": 50,
              "rating": 4.5,
              "time_to_visit_hours": 2.0,
              "best_time_to_visit": "9:00 AM - 11:00 AM"
            }
          ]
        }
      ]
    }
    
    Provide 3-4 hotels and ${days} days of detailed itinerary with multiple activities per day. Return ONLY the JSON, no other text.`;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    const text = typeof response.text === 'function' ? response.text() : response.text;
    console.log(text);
    return text;
  } catch (err) {
    console.error('Error fetching response:', err);
    return null;
  }
}


