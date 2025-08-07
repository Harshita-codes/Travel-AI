const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

async function main() {
  const ai = new GoogleGenAI({
    apiKey: process.env.VITE_GOOGLE_GEMINI_AI_API_KEY,
  });

  const tools = [
    {
      googleSearch: {},
    },
  ];

  const config = {
    thinkingConfig: {
      thinkingBudget: -1,
    },
    tools,
  };

  const model = 'gemini-1.5-flash';

  const contents = [
    {
      role: 'user',
      parts: [
        {
          text: `Generate Travel Plan for Location: Las Vegas, for 3 Days for Couple with a Cheap budget, Give me a Hotels options list with HotelName, Hotel address, Price, hotel image url, geo coordinates, rating, descriptions and suggest itinerary with placeName, Place Details, Place Image Url, Geo Coordinates, ticket Pricing, rating, Time travel each of the location for 3 days with each day plan with best time to visit in JSON format`,
        },
      ],
    },
  ];

  try {
    const result = await ai.models.generateContent({
      model,
      config,
      contents,
    });

    const responseText = result.response.parts[0].text;

    // Extract JSON from markdown-style triple backticks if needed
    const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/);
    const jsonContent = jsonMatch ? jsonMatch[1] : responseText;

    const parsedJson = JSON.parse(jsonContent);
    console.log(JSON.stringify(parsedJson, null, 2));

  } catch (err) {
    console.error("Error fetching response:", err);
  }
}

main();
