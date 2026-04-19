import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.GEMINI_API_KEY;

export const geminiService = {
  async getFanAssistantResponse(query: string, userLocation: string, context: any) {
    if (!API_KEY) return "I'm sorry, my AI brain is currently offline. Please check back later.";

    const ai = new GoogleGenAI({ apiKey: API_KEY });
    
    const systemInstruction = `
      You are the StadiumFlow AI Concierge, a helpful assistant for fans at a major sports stadium.
      Context: ${JSON.stringify(context)}
      User Location: ${userLocation}
      
      Goal: Provide quick, helpful, and natural language tips for fans to avoid lines, find amenities, and navigate the stadium.
      Tone: Professional, helpful, energetic, and concise.
      
      Always prioritize safety and speed. If a line is too long, suggest a nearby alternative.
    `;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: query,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });
      return response.text;
    } catch (error) {
      console.error("Gemini Error:", error);
      return "I'm having trouble connecting to the stadium network. Please try again in secondary mode.";
    }
  },

  async getOperatorInsights(query: string, dashboardState: any) {
    if (!API_KEY) return "AI Analytics currently unavailable.";

    const ai = new GoogleGenAI({ apiKey: API_KEY });
    
    const systemInstruction = `
      You are the StadiumFlow Operations Intelligence. You analyze real-time stadium data and provide strategic recommendations to venue managers.
      Current Dashboard State: ${JSON.stringify(dashboardState)}
      
      Goal: Detect subtle patterns, predict bottlenecks, and suggest staffing reassignments or promotional pushes to optimize flow and revenue.
      Tone: Highly professional, data-driven, and decisive.
    `;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: query,
        config: {
          systemInstruction,
          temperature: 0.4,
        },
      });
      return response.text;
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Error generating insights.";
    }
  }
};
