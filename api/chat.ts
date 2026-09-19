import { GoogleGenerativeAI } from '@google/generative-ai';

// Vercel Serverless Function signature
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Use the securely stored environment variable on the server
  // Vercel secrets do not have the VITE_ prefix.
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY; 

  if (!apiKey) {
    return res.status(500).json({ error: 'Gemini API key is not configured on the server.' });
  }

  try {
    const { history, text, base64Image, mimeType, language } = req.body;

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

These QuickActions will be converted into buttons for the user to tap. Do not include normal markdown links for these. Just the literal string [QuickAction: question here].

IMPORTANT: You must respond entirely in this language: ${language || 'English'}`;

    const model = genAI.getGenerativeModel({ 
      model: GEMINI_MODEL_NAME,
      systemInstruction: SYSTEM_INSTRUCTION
    });

    const chatSession = model.startChat({
      history: history || [],
    });

    const parts: any[] = [];
    if (base64Image && mimeType) {
      parts.push({
        inlineData: {
          data: base64Image,
          mimeType: mimeType
        }
      });
    }
    
    if (text) {
      parts.push({ text });
    }

    const result = await chatSession.sendMessage(parts);
    
    if (result.response.promptFeedback?.blockReason) {
      return res.status(403).json({ error: `Blocked by safety settings: ${result.response.promptFeedback.blockReason}` });
    }

    return res.status(200).json({ text: result.response.text() });

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    const is503 = error.message?.includes("503") || error.status === 503;
    if (is503) {
      return res.status(503).json({ error: "The AI is currently experiencing very high demand. Please try again in a few moments." });
    }
    return res.status(500).json({ error: error.message || "Failed to communicate with AI" });
  }
}
