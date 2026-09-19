import { useState } from 'react';
import Header from './components/Header';
import PhotoInput from './components/PhotoInput';
import TextInput from './components/TextInput';
import LanguageSelector from './components/LanguageSelector';
import ProcessingState from './components/ProcessingState';
import ExplanationResult from './components/ExplanationResult';
import ErrorState from './components/ErrorState';
import SafetyNotice from './components/SafetyNotice';
import type { ExplanationResult as ExtractedResult } from './services/gemini';
import { explainContent } from './services/gemini';

type AppState = "home" | "photo" | "text" | "review" | "processing" | "result" | "error";

function App() {
  const [appState, setAppState] = useState<AppState>("home");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("English");
  const [textContent, setTextContent] = useState<string>("");
  const [photoContent, setPhotoContent] = useState<File | null>(null);
  const [result, setResult] = useState<ExtractedResult | null>(null);

  const resetApp = () => {
    setAppState("home");
    setTextContent("");
    setPhotoContent(null);
    setResult(null);
  };

  const handleExplain = async () => {
    if (!textContent && !photoContent) return;
    
    setAppState("processing");
    try {
      const contentToExplain = photoContent ? photoContent : textContent;
      const explanation = await explainContent(contentToExplain, selectedLanguage);
      setResult(explanation);
      setAppState("result");
    } catch (error) {
      console.error(error);
      setAppState("error");
    }
  };

  return (
    <div className="min-h-screen bg-white text-black p-6 md:p-12 max-w-3xl mx-auto flex flex-col">
      <Header onHomeClick={resetApp} />
      
      <main className="flex-grow flex flex-col pt-8">
        {appState === "home" && (
          <div className="flex flex-col gap-6 animate-in fade-in">
            <div>
              <h1 className="text-4xl font-bold mb-2">What would you like to understand today?</h1>
              <p className="text-xl text-gray-600">Take a photo or type something you want us to explain.</p>
            </div>
            
            <button 
              className="card flex flex-col items-start gap-4"
              onClick={() => setAppState("photo")}
            >
              <span className="text-5xl" aria-hidden="true">📷</span>
              <div>
                <h2 className="text-2xl font-bold">Take or Upload a Photo</h2>
                <p className="text-gray-600 text-lg">Upload a document, bill, letter, form, message or notice.</p>
              </div>
              <div className="mt-4 font-bold text-lg text-black bg-gray-100 px-4 py-2 rounded-lg">Choose Photo</div>
            </button>

            <button 
              className="card flex flex-col items-start gap-4"
              onClick={() => setAppState("text")}
            >
              <span className="text-5xl" aria-hidden="true">✍️</span>
              <div>
                <h2 className="text-2xl font-bold">Type or Paste Text</h2>
                <p className="text-gray-600 text-lg">Enter anything you want explained.</p>
              </div>
              <div className="mt-4 font-bold text-lg text-black bg-gray-100 px-4 py-2 rounded-lg">Enter Text</div>
            </button>
          </div>
        )}

        {appState === "photo" && (
          <div className="animate-in fade-in flex flex-col flex-grow">
            <PhotoInput 
              onPhotoSelected={(file) => {
                setPhotoContent(file);
                setAppState("review");
              }}
              onCancel={resetApp}
            />
          </div>
        )}

        {appState === "text" && (
          <div className="animate-in fade-in flex flex-col flex-grow">
            <TextInput 
              initialText={textContent}
              onTextSubmitted={(text) => {
                setTextContent(text);
                setAppState("review");
              }}
              onCancel={resetApp}
            />
          </div>
        )}

        {appState === "review" && (
          <div className="animate-in fade-in flex flex-col gap-8 flex-grow">
            <div>
              <h2 className="text-3xl font-bold mb-6">Explain it in</h2>
              <LanguageSelector 
                selectedLanguage={selectedLanguage}
                onLanguageChange={setSelectedLanguage}
              />
            </div>
            
            <div className="mt-auto pt-8 flex flex-col gap-4">
              <button 
                className="btn btn-primary w-full py-6 text-2xl font-bold"
                onClick={handleExplain}
              >
                ✨ Explain Simply
              </button>
              <button 
                className="btn btn-secondary w-full"
                onClick={() => setAppState(photoContent ? "photo" : "text")}
              >
                ← Go Back
              </button>
            </div>
          </div>
        )}

        {appState === "processing" && (
          <ProcessingState />
        )}

        {appState === "result" && result && (
          <div className="animate-in fade-in flex flex-col flex-grow">
            <ExplanationResult 
              result={result} 
              language={selectedLanguage}
            />
            <div className="mt-12 flex flex-col gap-4 border-t-2 border-gray-100 pt-8">
              <button 
                className="btn btn-primary w-full py-5 text-xl font-bold"
                onClick={handleExplain}
              >
                ↻ Explain Again
              </button>
              <button 
                className="btn btn-secondary w-full py-4 text-xl font-bold"
                onClick={resetApp}
              >
                ← Start Over
              </button>
            </div>
          </div>
        )}

        {appState === "error" && (
          <ErrorState onRetry={handleExplain} onHome={resetApp} />
        )}
      </main>
      
      <footer className="mt-12 pt-8">
        <SafetyNotice />
      </footer>
    </div>
  );
}

export default App;
