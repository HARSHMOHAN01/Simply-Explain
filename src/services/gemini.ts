import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Message } from './history';

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

function convertToGeminiHistory(messages: Message[]) {
  const result: any[] = [];
  let expecting = 'user';

  for (const m of messages) {
    const role = m.role === 'model' ? 'model' : 'user';
    if (role === expecting) {
      result.push({
        role,
        parts: [{ text: m.text || " " }]
      });
      expecting = expecting === 'user' ? 'model' : 'user';
    }
  }

  // Gemini API requires the history before a user message to end with a model turn
  if (result.length > 0 && result[result.length - 1].role === 'user') {
    result.pop();
  }

  return result;
}

export function startConversation(language: string, history: Message[] = []): ChatSession {
  return {
    language,
    history
  };
}

const SYSTEM_INSTRUCTION = (language: string) => `You are Simply Explain, an AI assistant designed to help senior citizens
understand complicated information.

Your job is to analyze the text or image provided by the user and explain
it in simple, clear language.

Rules:
1. Explain the content in language that is easy for an older adult to understand.
2. Avoid unnecessary technical terminology.
3. Preserve important facts, dates, names, amounts and instructions.
4. Never invent information that is not visible or present in the input.
5. If information is unclear, explicitly say that it is unclear.
6. Break complicated information into short sections.
7. Clearly explain what the user needs to do next when applicable.
8. Keep the explanation concise and comforting.
9. If the content involves medical, financial, legal, or government decisions, remind the user to verify with an official source or qualified professional.
10. DO NOT use ANY markdown formatting. Do not use asterisks (*), hashes (#), or backticks. Use plain smooth text with clean line breaks.

At the end of your explanation, offer 1 to 3 quick follow-up questions wrapped like this:
[QuickAction: What proof do I need?]
[QuickAction: How do I update it?]
[QuickAction: Is there a deadline?]

IMPORTANT: You must respond entirely in this language: ${language || 'English'}`;

async function callDirectGemini(apiKey: string, chat: ChatSession, text: string, base64Image?: string, mimeType?: string): Promise<string> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: 'gemini-3.6-flash',
    systemInstruction: SYSTEM_INSTRUCTION(chat.language)
  });

  const history = convertToGeminiHistory(chat.history);
  const chatSession = model.startChat({ history });

  const parts: any[] = [];
  if (base64Image && mimeType) {
    parts.push({
      inlineData: {
        data: base64Image,
        mimeType
      }
    });
  }
  if (text) {
    parts.push({ text });
  }

  const result = await chatSession.sendMessage(parts);
  return result.response.text();
}

export async function sendMessage(chat: ChatSession, text: string, attachment?: File): Promise<string> {
  let base64Image = undefined;
  let mimeType = undefined;

  if (attachment) {
    const fullBase64 = await fileToBase64(attachment);
    base64Image = fullBase64.split(',')[1];
    mimeType = attachment.type;
  }

  // 1. First attempt: call secure backend serverless function (/api/chat)
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        language: chat.language,
        history: convertToGeminiHistory(chat.history),
        text,
        base64Image,
        mimeType
      })
    });

    if (response.ok) {
      const data = await response.json();
      if (data?.text) {
        chat.history.push({ id: "temp-user", role: "user", text, createdAt: Date.now() });
        chat.history.push({ id: "temp-model", role: "model", text: data.text, createdAt: Date.now() });
        return data.text;
      }
    }

    if (response.status !== 404) {
      const errData = await response.json().catch(() => ({}));
      if (errData?.error) {
        throw new Error(errData.error);
      }
    }
  } catch (backendError: any) {
    console.warn("Backend /api/chat error, attempting direct client fallback if configured:", backendError);
    if (backendError.message && !backendError.message.includes('Failed to communicate') && !backendError.message.includes('fetch') && !backendError.message.includes('404')) {
      // If backend gave a real API error message (e.g. safety block), rethrow
      if (!backendError.message.includes('not configured')) {
        throw backendError;
      }
    }
  }

  // 2. Client-side fallback (used for local Vite dev server or if direct key is provided)
  const clientApiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY;
  if (clientApiKey && clientApiKey !== "demo") {
    try {
      const directText = await callDirectGemini(clientApiKey, chat, text, base64Image, mimeType);
      chat.history.push({ id: "temp-user", role: "user", text, createdAt: Date.now() });
      chat.history.push({ id: "temp-model", role: "model", text: directText, createdAt: Date.now() });
      return directText;
    } catch (directError: any) {
      console.error("Direct Gemini API error:", directError);
      throw new Error(directError.message || "Failed to communicate with AI");
    }
  }

  throw new Error("Unable to connect to the AI service. Please make sure GEMINI_API_KEY is configured.");
}

