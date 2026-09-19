import { useState, useEffect } from 'react';

interface ListenButtonProps {
  textToRead: string;
  language: string;
}

export default function ListenButton({ textToRead, language }: ListenButtonProps) {
  const [isReading, setIsReading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setSupported(false);
    }
    
    // Stop reading when component unmounts
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const getLangCode = (langName: string) => {
    const map: Record<string, string> = {
      "English": "en-IN",
      "हिन्दी": "hi-IN",
      "বাংলা": "bn-IN",
      "मराठी": "mr-IN",
      "தமிழ்": "ta-IN",
      "తెలుగు": "te-IN"
    };
    return map[langName] || "en-US";
  };

  const handleToggle = () => {
    if (!supported) return;

    if (isReading) {
      if (isPaused) {
        window.speechSynthesis.resume();
        setIsPaused(false);
      } else {
        window.speechSynthesis.pause();
        setIsPaused(true);
      }
      return;
    }

    // Start reading
    window.speechSynthesis.cancel(); // Clear any existing speech
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = getLangCode(language);
    utterance.rate = 0.9; // Slightly slower for seniors
    
    utterance.onend = () => {
      setIsReading(false);
      setIsPaused(false);
    };
    
    utterance.onerror = () => {
      setIsReading(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
    setIsReading(true);
    setIsPaused(false);
  };

  const handleStop = () => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setIsReading(false);
    setIsPaused(false);
  };

  if (!supported) return null;

  return (
    <div className="flex gap-4">
      <button 
        className={`btn flex-grow gap-2 ${isReading && !isPaused ? 'bg-blue-100 text-blue-900 border-2 border-blue-300' : 'btn-secondary'}`}
        onClick={handleToggle}
      >
        <span aria-hidden="true">{isReading && !isPaused ? '⏸️' : '🔊'}</span>
        {isReading ? (isPaused ? 'Resume' : 'Pause Reading') : 'Listen'}
      </button>
      
      {isReading && (
        <button 
          className="btn btn-secondary border-2 border-red-200 text-red-700 hover:bg-red-50"
          onClick={handleStop}
          aria-label="Stop reading"
        >
          <span aria-hidden="true">⏹️</span> Stop
        </button>
      )}
    </div>
  );
}
