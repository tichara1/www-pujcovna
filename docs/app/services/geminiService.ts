
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const optimizeListing = async (title: string, category: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Pomoz mi vytvořit profesionální inzerát pro P2P půjčovnu pro předmět "${title}" v kategorii "${category}". 
    Navrhni profesionální popis v češtině, ideální kauci (security deposit) a odhadovanou hodinovou/denní/měsíční sazbu v CZK.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          suggestedDescription: { type: Type.STRING },
          suggestedDeposit: { type: Type.NUMBER },
          suggestedPricing: {
            type: Type.OBJECT,
            properties: {
              hourly: { type: Type.NUMBER },
              daily: { type: Type.NUMBER },
              monthly: { type: Type.NUMBER }
            }
          }
        },
        required: ["suggestedDescription", "suggestedDeposit", "suggestedPricing"]
      }
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    console.error("Selhalo parsování AI odpovědi", e);
    return null;
  }
};

export const generateListingImage = async (title: string, category: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          text: `A high-quality, professional commercial product photograph of a "${title}" for a rental website. The item should be clean, centered, and set against a neutral, minimal professional background. Category: ${category}. Style: modern, sharp focus, bright studio lighting.`,
        },
      ],
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return null;
};
