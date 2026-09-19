# Simply Explain

**Simply Explain** is an AI-powered companion designed to help users understand complex topics, check information, and analyze documents simply and clearly. Designed with accessibility and seniors in mind, it provides large touch targets, voice interaction, and multi-language support (English, Hindi, Bengali, Marathi, Tamil, Telugu).

## 🚀 Tech Stack
- **Frontend**: React, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Backend (Serverless)**: Vercel Serverless Functions (`/api`)
- **AI Integration**: Google Gemini AI (gemini-1.5-flash)
- **Database & Auth**: Firebase (Firestore & Google Authentication)
- **Testing**: Vitest, React Testing Library

---

## 🛠️ Local Environment Setup

To run this project locally, follow these steps closely.

### 1. Prerequisites
- **Node.js**: Make sure you have [Node.js](https://nodejs.org/) installed (v18+ recommended).
- **Git**: Ensure you have Git installed to clone the repository.
- *(Optional but recommended)*: Install Vercel CLI globally (`npm i -g vercel`) to easily run the serverless API functions locally.

### 2. Installation
Clone the repository and install the dependencies:

```bash
git clone https://github.com/HARSHMOHAN01/Simply-Explain.git
cd Simply-Explain
npm install
```

### 3. Environment Variables
You need to set up API keys for both Google Gemini and Firebase.

Create a file named `.env` in the root of the project (next to `package.json`). Do NOT commit this file to GitHub.

Paste the following into your `.env` file and fill in your actual keys:

```env
# Google Gemini API Key (Do NOT use the VITE_ prefix for this one for security!)
GEMINI_API_KEY="your_actual_gemini_api_key_starting_with_AIzaSy..."

# Firebase Configuration
VITE_FIREBASE_API_KEY="your_firebase_api_key"
VITE_FIREBASE_AUTH_DOMAIN="your_firebase_auth_domain"
VITE_FIREBASE_PROJECT_ID="your_firebase_project_id"
VITE_FIREBASE_STORAGE_BUCKET="your_firebase_storage_bucket"
VITE_FIREBASE_MESSAGING_SENDER_ID="your_firebase_messaging_sender_id"
VITE_FIREBASE_APP_ID="your_firebase_app_id"
```

> **Note on Firebase**: You must enable **Google Sign-in** in your Firebase Authentication settings and set up **Firestore** with the proper rules to allow user-specific read/writes.

### 4. Firebase Console Setup

To ensure authentication and data saving work correctly, you must configure your Firebase project:

1. **Create a Firebase Project**: Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2. **Add a Web App**: Register a web app in your project settings to get the Firebase config keys (put these in your `.env`).
3. **Enable Authentication**:
   - Go to **Authentication** -> **Sign-in method**.
   - Enable the **Google** provider.
   - Go to **Settings** -> **Authorized domains** and add your production domain (e.g., `your-app.vercel.app`) if you are deploying.
4. **Set Up Firestore**:
   - Go to **Firestore Database** and click **Create database**.
   - Go to the **Rules** tab and replace the default rules with the following to secure user data:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /conversations/{document=**} {
         // Users can only read, update, or delete their own conversations
         allow read, update, delete: if request.auth != null && request.auth.uid == resource.data.userId;
         // Users can only create conversations attached to their own ID
         allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
       }
     }
   }
   ```
   - Click **Publish**.

### 5. Running the Development Server

Because this project uses a Vercel Serverless Function (`api/chat.ts`) to securely hide the Gemini API key, you have two options for running it locally:

**Option A (Vercel CLI - Recommended):**
This will automatically spin up both the Vite frontend and the Serverless API locally.
```bash
npx vercel dev
```

**Option B (Standard Vite Dev Server):**
If you don't need to test the API responses (or if the API is mocked), you can run the standard Vite server:
```bash
npm run dev
```

### 5. Running Tests

We use Vitest and React Testing Library for unit testing. To run the test suite:

```bash
npm run test
```

---

## 📁 Project Structure

- `/api` - Contains Vercel Serverless Functions (Backend)
- `/src/components` - React UI components
- `/src/services` - Logic for Firebase Auth/Firestore and Gemini API requests
- `/src/components/__tests__` - Unit tests for components
