import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../types";

const SYSTEM_INSTRUCTION = `
You are a knowledgeable and polite Islamic assistant specialized in Fasting (Sawm) according to the Sunnah of Prophet Muhammad (peace be upon him).
Your name is "Rayyan AI".
Provide concise, accurate, and gentle answers.
Always reference authentic sources (Quran/Hadith) when possible.
If a question is controversial or requires a fatwa, advise the user to consult a local scholar.
Support both English and Arabic languages based on the user's input.
`;

export const getGeminiResponse = async (
  history: ChatMessage[],
  currentMessage: string,
  apiKey: string
): Promise<string> => {
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const contents = history
      .filter(msg => msg.role !== 'model') // Simple history management for this demo context
      .map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));

    // Add current message
    contents.push({ role: 'user', parts: [{ text: currentMessage }] });

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        role: 'user',
        parts: [{ text: currentMessage }]
      }, // For simplicity in this stateless service, we just send the current prompt plus system instruction context implicitly via system instruction config
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });

    return response.text || "I apologize, I could not generate a response.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
