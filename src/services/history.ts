import { collection, doc, setDoc, getDocs, getDoc, deleteDoc, query, orderBy, where } from "firebase/firestore";
import { db } from "./firebase";

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
  userId: string;
  title: string;
  sourceType: 'write' | 'upload' | 'camera' | 'check';
  language: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export async function getConversations(userId: string): Promise<Conversation[]> {
  if (!userId) return [];
  try {
    const q = query(
      collection(db, "conversations"), 
      where("userId", "==", userId),
      orderBy("updatedAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    const conversations: Conversation[] = [];
    querySnapshot.forEach((doc) => {
      conversations.push(doc.data() as Conversation);
    });
    return conversations;
  } catch (error) {
    console.error("Failed to load history from Firebase", error);
    return [];
  }
}

export async function getConversation(id: string): Promise<Conversation | null> {
  try {
    const docRef = doc(db, "conversations", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as Conversation;
    }
    return null;
  } catch (error) {
    console.error("Failed to fetch conversation", error);
    return null;
  }
}

export async function saveConversation(conversation: Conversation): Promise<void> {
  if (!conversation.userId) return; // Prevent saving orphaned data
  try {
    conversation.updatedAt = Date.now();
    await setDoc(doc(db, "conversations", conversation.id), conversation);
  } catch (error) {
    console.error("Failed to save conversation to Firebase", error);
  }
}

export async function deleteConversation(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, "conversations", id));
  } catch (error) {
    console.error("Failed to delete conversation from Firebase", error);
  }
}
