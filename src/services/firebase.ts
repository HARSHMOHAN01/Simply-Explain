import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithRedirect, 
  signOut 
} from "firebase/auth";

// On Vercel, when vercel.json proxies /__/auth, using window.location.hostname avoids cross-origin storage partitioning issues
const isVercel = typeof window !== 'undefined' && window.location.hostname.endsWith('.vercel.app');
const resolvedAuthDomain = isVercel ? window.location.hostname : (import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "simply-explain.firebaseapp.com");

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: resolvedAuthDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and Auth
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export const signInWithGoogle = async () => {
  console.log("signInWithGoogle invoked!");
  try {
    // Primary flow: popup (reliable on modern browsers, no cross-origin storage issues)
    const result = await signInWithPopup(auth, googleProvider);
    console.log("signInWithPopup success:", result.user?.email);
    return result.user;
  } catch (error: any) {
    console.error("Google Sign-In Error:", error);

    // If popup was blocked by browser, attempt redirect fallback
    if (error?.code === 'auth/popup-blocked') {
      try {
        await signInWithRedirect(auth, googleProvider);
        return null;
      } catch (redirectError) {
        console.error("Redirect sign-in error after popup blocked:", redirectError);
        throw redirectError;
      }
    }

    // User closed popup without signing in
    if (error?.code === 'auth/popup-closed-by-user' || error?.code === 'auth/cancelled-popup-request') {
      return null;
    }

    // Domain unauthorized in Firebase Console
    if (error?.code === 'auth/unauthorized-domain') {
      const currentDomain = window.location.hostname;
      alert(`Firebase Auth Error: Domain "${currentDomain}" is not authorized.\n\nPlease add "${currentDomain}" to Authorized Domains in your Firebase Console (Authentication -> Settings -> Authorized Domains).`);
      return null;
    }

    alert(`Sign-in could not be completed: ${error.message || 'Unknown error'}`);
    throw error;
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out", error);
  }
};

if (typeof window !== 'undefined') {
  (window as any).signInWithGoogle = signInWithGoogle;
  (window as any).firebaseAuth = auth;
}


