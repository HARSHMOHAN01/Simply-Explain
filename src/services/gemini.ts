import type { Message } from './history';

// Define ChatSession interface to match the existing usage in App.tsx
// Since we moved the actual GenAI logic to the backend, this is just a wrapper
export interface ChatSession {
  language: string;
  history: Message[];
}

export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

// Convert our local Message format to the format expected by our new backend API
function convertToGeminiHistory(messages: Message[]) {
  return messages.map(msg => {
    return {
      role: msg.role === 'model' ? 'model' : 'user',
      parts: [{ text: msg.text || " " }]
    };
  });
}

export function startConversation(language: string, history: Message[] = []): ChatSession {
  // We no longer initialize a real connection here, just store state for the API calls
  return {
    language,
    history
  };
}

export async function sendMessage(chat: ChatSession, text: string, attachment?: File): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "demo";
  
  if (apiKey === "demo") {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`This is a demo response from the AI. I received your message: "${text}".\n\n[QuickAction: Tell me more]\n[QuickAction: What's next?]`);
      }, 1500);
    });
  }

  let base64Image = undefined;
  let mimeType = undefined;

  if (attachment) {
    const fullBase64 = await fileToBase64(attachment);
    base64Image = fullBase64.split(',')[1];
    mimeType = attachment.type;
  }
  
  let retries = 3;
  let delay = 1500;

  while (retries > 0) {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          language: chat.language,
          history: convertToGeminiHistory(chat.history),
          text: text,
          base64Image,
          mimeType
        })
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 503 || response.status === 504) {
          throw new Error("503");
        }
        throw new Error(data.error || "Failed to communicate with secure backend");
      }

      // Automatically update the local history state wrapper so subsequent calls have context
      chat.history.push({
        id: "temp-user",
        role: "user",
        text: text,
        createdAt: Date.now()
      });
      chat.history.push({
        id: "temp-model",
        role: "model",
        text: data.text,
        createdAt: Date.now()
      });

      return data.text;
    } catch (error: any) {
      console.error(`Backend API Error (Retries left: ${retries - 1}):`, error);
      
      const is503 = error.message?.includes("503") || error.status === 503;
      if (is503 && retries > 1) {
        retries--;
        await new Promise(res => setTimeout(res, delay));
        delay *= 2; // Exponential backoff
        continue;
      }
      
      if (is503) {
        throw new Error("The AI is currently experiencing very high demand. Please try again in a few moments.");
      }
      
      throw new Error(error.message || "Failed to communicate with AI");
    }
  }
  
  throw new Error("Service unavailable. Please try again later.");
}
