import { GoogleGenAI, Type } from "@google/genai";
import { MenuItem } from "../types";

// Helper to get the API client
const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing from environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const getFoodRecommendations = async (
  userQuery: string, 
  menuItems: MenuItem[],
  history: {role: string, parts: {text: string}[]}[] = []
) => {
  const ai = getAiClient();
  if (!ai) {
    return {
      text: "I'm sorry, I can't connect to the chef right now (API Key missing).",
      itemIds: []
    };
  }

  const menuContext = JSON.stringify(menuItems.map(item => ({
    id: item.id,
    name: item.name,
    category: item.category,
    description: item.description,
    price: item.price,
    isVeg: item.isVeg,
    calories: item.calories
  })));

  const systemInstruction = `
    You are 'Chef Gemini', a helpful and witty canteen assistant for a college campus.
    Your goal is to help students choose food from the provided Menu.
    
    Menu Data: ${menuContext}

    Rules:
    1. Be concise, friendly, and student-oriented (aware of budget/studying).
    2. If a student asks for a recommendation, suggest items from the Menu ONLY.
    3. You MUST return your response in a structured JSON format to allow the app to highlight items.
    
    The response schema should be an object with:
    - 'response': A string containing your conversational reply.
    - 'recommendedItemIds': An array of strings containing the IDs of the items you recommended.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        ...history.map(h => ({ role: h.role, parts: h.parts })),
        { role: 'user', parts: [{ text: userQuery }] }
      ],
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            response: { type: Type.STRING },
            recommendedItemIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
       throw new Error("Empty response from AI");
    }

    const parsed = JSON.parse(resultText);
    return {
      text: parsed.response,
      itemIds: parsed.recommendedItemIds || []
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      text: "Sorry, I got a bit confused in the kitchen. Could you ask that again?",
      itemIds: []
    };
  }
};