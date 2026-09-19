import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Part } from '@google/generative-ai';

// Replace these with your actual config or pass via .env
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "demo";

const genAI = new GoogleGenerativeAI(apiKey);
const GEMINI_MODEL_NAME = 'gemini-3.6-flash';

export interface ExplanationResult {
  summary: string;
  actions: string[];
  important: string;
}

const SYSTEM_INSTRUCTION = `You are Simply Explain, an AI assistant designed to help senior citizens
understand complicated information.

Your job is to analyze the text or image provided by the user and explain
it in simple, clear language.

The user may provide:
- A bill
- A government notice
- A bank message
- A form
- A letter
- A website screenshot
- A WhatsApp message
- A document
- Any other piece of information

Rules:
1. Explain the content in language that is easy for an older adult to understand.
2. Avoid unnecessary technical terminology.
3. Preserve important facts, dates, names, amounts and instructions.
4. Never invent information that is not visible or present in the input.
5. If information is unclear, explicitly say that it is unclear.
6. Break complicated information into short sections.
7. Clearly explain what the user needs to do next when applicable.
8. Respond in the language selected by the user.
9. Keep the explanation concise.
10. Do not overwhelm the user with unnecessary details.
11. If the content involves medical, financial, legal, government or other important decisions, explain the content but remind the user to verify important decisions with an appropriate official source or qualified professional.
12. Do not claim certainty when the source material is unclear.

Format your response strictly as a JSON object matching this structure:
{
  "summary": "Simple Explanation",
  "actions": ["Action 1", "Action 2"],
  "important": "Important Things To Know (optional warning/verification message, or empty string)"
}`;

export async function explainContent(content: string | File, language: string): Promise<ExplanationResult> {
  // Demo mode fallback if no real API key is provided
  if (apiKey === "demo") {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          summary: `(Demo) This is a simplified explanation in ${language}. It looks like an electricity bill for ₹1,250.`,
          actions: ["Check the amount.", "Pay before 25 September."],
          important: "Please verify the due date with your bank."
        });
      }, 2000);
    });
  }

  const model = genAI.getGenerativeModel({ 
    model: GEMINI_MODEL_NAME,
    systemInstruction: SYSTEM_INSTRUCTION,
    generationConfig: {
      responseMimeType: "application/json"
    }
  });

  const prompt = `Selected language: ${language}\n\nPlease explain the provided content according to the system instructions.`;
  
  const requestParts: Part[] = [];

  if (typeof content === 'string') {
    requestParts.push({ text: prompt });
    requestParts.push({ text: `Content to explain: ${content}` });
  } else {
    // Handle File (Image)
    const base64Image = await fileToBase64(content);
    requestParts.push({ text: prompt });
    requestParts.push({
      inlineData: {
        data: base64Image.split(',')[1],
        mimeType: content.type
      }
    });
  }

  try {
    const result = await model.generateContent(requestParts);
    
    // Check if the response was blocked by safety settings
    if (result.response.promptFeedback?.blockReason) {
      throw new Error(`Blocked by safety settings: ${result.response.promptFeedback.blockReason}`);
    }

    const responseText = result.response.text();
    // Sometimes the model still outputs markdown blocks even with responseMimeType
    const cleanText = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
    
    const parsedResponse = JSON.parse(cleanText);
    
    return {
      summary: parsedResponse.summary || "Explanation could not be generated.",
      actions: parsedResponse.actions || [],
      important: parsedResponse.important || ""
    };
  } catch (error: any) {
    console.error("Gemini Error:", error);
    throw new Error(error.message || "Failed to generate explanation");
  }
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}
