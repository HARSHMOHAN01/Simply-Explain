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

### 4. Running the Development Server

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
