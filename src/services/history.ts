export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  attachmentUrl?: string; // base64 or blob URL
  attachmentType?: string; // mime type
  createdAt: number;
}

export interface Conversation {
  id: string;
  title: string;
  sourceType: 'write' | 'upload' | 'camera' | 'check';
  language: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

const STORAGE_KEY = 'simply_explain_history';

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function getConversations(): Conversation[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    const parsed = JSON.parse(data) as Conversation[];
    // Sort descending by updated at
    return parsed.sort((a, b) => b.updatedAt - a.updatedAt);
  } catch (error) {
    console.error("Failed to load history", error);
    return [];
  }
}

export function getConversation(id: string): Conversation | null {
  const all = getConversations();
  return all.find(c => c.id === id) || null;
}

export function saveConversation(conversation: Conversation): void {
  try {
    const all = getConversations();
    const existingIndex = all.findIndex(c => c.id === conversation.id);
    
    conversation.updatedAt = Date.now();
    
    if (existingIndex >= 0) {
      all[existingIndex] = conversation;
    } else {
      all.push(conversation);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch (error) {
    console.error("Failed to save conversation", error);
  }
}

export function deleteConversation(id: string): void {
  try {
    const all = getConversations();
    const filtered = all.filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error("Failed to delete conversation", error);
  }
}
