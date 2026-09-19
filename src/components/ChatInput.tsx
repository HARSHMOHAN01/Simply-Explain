import React, { useState, useRef, useEffect } from 'react';

interface ChatInputProps {
  onSend: (text: string, file?: File) => void;
  isLoading: boolean;
}

export default function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isListening, setIsListening] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize Web Speech API if available
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setText((prev) => prev + (prev ? ' ' : '') + finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const handleSend = () => {
    if ((text.trim() || file) && !isLoading) {
      onSend(text, file || undefined);
      setText("");
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setText(""); // Optionally clear or append
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full bg-white border-t border-gray-200 p-4 pb-8 md:pb-6 sticky bottom-0 z-10 shadow-lg">
      <div className="max-w-4xl mx-auto">
        
        {isListening && (
          <div className="mb-3 text-center text-[#5AA9E6] font-bold animate-pulse flex items-center justify-center gap-2">
            <span className="text-2xl">🎤</span> Speak naturally. I'm listening...
          </div>
        )}

        {file && (
          <div className="mb-3 p-3 bg-gray-100 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2 truncate">
              <span className="text-xl">📄</span>
              <span className="truncate font-medium">{file.name}</span>
            </div>
            <button 
              onClick={() => setFile(null)}
              className="text-gray-500 hover:text-red-500 p-1"
            >
              ✕
            </button>
          </div>
        )}

        <div className="flex items-end gap-2 bg-gray-50 border-2 border-gray-200 rounded-2xl p-2 focus-within:border-[#5AA9E6] transition-colors">
          
          <button 
            className="p-3 text-gray-500 hover:text-[#5AA9E6] hover:bg-gray-200 rounded-xl transition-colors"
            title="Attach file or photo"
            onClick={() => fileInputRef.current?.click()}
          >
            <span className="text-2xl font-bold">+</span>
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept="image/*,.pdf,.doc,.docx,.txt"
          />

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isListening ? "Listening..." : "Type your question..."}
            className="flex-grow bg-transparent border-none focus:ring-0 p-3 max-h-32 min-h-[56px] resize-none text-lg"
            rows={1}
            disabled={isLoading}
          />

          <button 
            onClick={toggleListen}
            className={`p-3 rounded-xl transition-colors flex-shrink-0 ${isListening ? 'bg-red-100 text-red-600' : 'bg-[#E3F2FD] text-[#5AA9E6] hover:bg-[#7FC8F8] hover:text-white'}`}
            title={isListening ? "Stop listening" : "Speak"}
          >
            <span className="text-2xl">🎤</span>
          </button>

          <button 
            onClick={handleSend}
            disabled={isLoading || (!text.trim() && !file)}
            className="p-3 bg-black text-white rounded-xl hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-bold px-6 flex-shrink-0"
          >
            Send ➤
          </button>
        </div>
      </div>
    </div>
  );
}
