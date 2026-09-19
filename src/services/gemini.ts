import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Part, ChatSession } from '@google/generative-ai';
import type { Message } from './history';

// Replace these with your actual config or pass via .env
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "demo";

const genAI = new GoogleGenerativeAI(apiKey);
const GEMINI_MODEL_NAME = 'gemini-3.6-flash';

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
8. Keep the explanation concise.
9. Do not overwhelm the user with unnecessary details.
10. If the content involves medical, financial, legal, government or other important decisions, explain the content but remind the user to verify important decisions with an appropriate official source or qualified professional.
11. Do not claim certainty when the source material is unclear.
12. Be conversational, patient, and polite. Always act as a supportive companion.
13. DO NOT use ANY markdown formatting. Do not use asterisks (*), hashes (#), or any other special symbols for bold, italics, or headers. Use plain, smooth text only. You can use standard newlines for spacing.

At the end of your explanation, offer 1 to 3 quick follow-up questions the user might want to ask.
Format these suggested questions wrapped in brackets like this:
[QuickAction: What proof do I need?]
[QuickAction: How do I update it?]
[QuickAction: Is there a deadline?]

These QuickActions will be converted into buttons for the user to tap. Do not include normal markdown links for these. Just the literal string [QuickAction: question here].`;

export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

// Convert our local Message format to Gemini's history format
function convertToGeminiHistory(messages: Message[]) {
  return messages.map(msg => {
    const parts: Part[] = [];
    if (msg.text) {
      parts.push({ text: msg.text });
    }
    // Note: In a real advanced implementation we would also re-hydrate base64 images into history,
    // but typically we pass the main context in the first message.
    return {
      role: msg.role === 'model' ? 'model' : 'user',
      parts
    };
  });
}

export function startConversation(language: string, history: Message[] = []): ChatSession {
  const model = genAI.getGenerativeModel({ 
    model: GEMINI_MODEL_NAME,
    systemInstruction: SYSTEM_INSTRUCTION + `\n\nIMPORTANT: You must respond entirely in this language: ${language}`
  });

  return model.startChat({
    history: convertToGeminiHistory(history),
  });
}

export async function sendMessage(chat: ChatSession, text: string, attachment?: File): Promise<string> {
  if (apiKey === "demo") {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`This is a demo response from the AI. I received your message: "${text}".\n\n[QuickAction: Tell me more]\n[QuickAction: What's next?]`);
      }, 1500);
    });
  }

  const parts: Part[] = [];
  if (attachment) {
    const base64Image = await fileToBase64(attachment);
    parts.push({
      inlineData: {
        data: base64Image.split(',')[1],
        mimeType: attachment.type
      }
    });
  }
  
  if (text) {
    parts.push({ text });
  }

  let retries = 3;
  let delay = 1500;

  while (retries > 0) {
    try {
      const result = await chat.sendMessage(parts);
      
      if (result.response.promptFeedback?.blockReason) {
        throw new Error(`Blocked by safety settings: ${result.response.promptFeedback.blockReason}`);
      }

      return result.response.text();
    } catch (error: any) {
      console.error(`Gemini Error (Retries left: ${retries - 1}):`, error);
      
      const is503 = error.message?.includes("503") || error.status === 503;
      if (is503 && retries > 1) {
        retries--;
        await new Promise(res => setTimeout(res, delay));
        delay *= 2; // Exponential backoff
        continue;
      }
      
      // If it's a 503 but we are out of retries, throw a friendly error
      if (is503) {
        throw new Error("The AI is currently experiencing very high demand. Please try again in a few moments.");
      }
      
      throw new Error(error.message || "Failed to communicate with AI");
    }
  }
  
  throw new Error("Service unavailable. Please try again later.");
}
