import React, { useState, useRef, useEffect, Suspense, lazy } from 'react';
import Header from './components/Header';
import SafetyNotice from './components/SafetyNotice';
import { generateId, getConversation, saveConversation } from './services/history';
import type { Conversation, Message } from './services/history';
import { startConversation, sendMessage } from './services/gemini';
import type { ChatSession } from './services/gemini';

// Lazy loaded components for code splitting
const Home = lazy(() => import('./components/Home'));
const ChatInput = lazy(() => import('./components/ChatInput'));
const ConversationView = lazy(() => import('./components/Conversation'));
const History = lazy(() => import('./components/History'));

type AppState = "home" | "chat" | "history" | "help";

function App() {
  const [appState, setAppState] = useState<AppState>("home");
  const [language, setLanguage] = useState<string>("English");
  
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const chatSessionRef = useRef<ChatSession | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingSourceType, setPendingSourceType] = useState<'upload' | 'camera' | null>(null);

  // Load active conversation when ID changes
  useEffect(() => {
    if (activeConversationId) {
      getConversation(activeConversationId).then(conv => {
        if (conv) {
          setCurrentConversation(conv);
          // Initialize Gemini chat session with history
          chatSessionRef.current = startConversation(language, conv.messages);
        }
      });
    } else {
      setCurrentConversation(null);
      chatSessionRef.current = null;
    }
  }, [activeConversationId, language]);

  const handleNavClick = (view: AppState) => {
    if (view === 'home') {
      setActiveConversationId(null);
    }
    setAppState(view);
  };

  const createNewConversation = async (sourceType: 'write' | 'upload' | 'camera' | 'check', initialAttachment?: File) => {
    const newConv: Conversation = {
      id: generateId(),
      title: "New Conversation", // Could generate dynamically based on first message later
      sourceType,
      language,
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    await saveConversation(newConv);
    
    // Set synchronous context for immediate use
    const newSession = startConversation(language, newConv.messages);
    chatSessionRef.current = newSession;
    setCurrentConversation(newConv);
    setActiveConversationId(newConv.id);
    setAppState('chat');

    // If there's an initial attachment (from Upload/Camera), send it immediately
    if (initialAttachment) {
      handleSendMessage("Can you explain this document for me?", initialAttachment, newConv, newSession);
    } else if (sourceType === 'check') {
      // Add an initial greeting message for 'check'
      const checkConv = { ...newConv };
      checkConv.messages.push({
        id: generateId(),
        role: 'model',
        text: "Sure. Send me the message, text, photo or information you want me to check.",
        createdAt: Date.now()
      });
      await saveConversation(checkConv);
      setCurrentConversation(checkConv);
    }
  };

  const handleHomeAction = (sourceType: 'write' | 'upload' | 'camera' | 'check') => {
    if (sourceType === 'upload' || sourceType === 'camera') {
      setPendingSourceType(sourceType);
      if (fileInputRef.current) {
        fileInputRef.current.removeAttribute('capture');
        if (sourceType === 'camera') {
          fileInputRef.current.setAttribute('capture', 'environment');
          fileInputRef.current.setAttribute('accept', 'image/*');
        } else {
          fileInputRef.current.setAttribute('accept', 'image/*,.pdf,.doc,.docx,.txt');
        }
        fileInputRef.current.click();
      }
    } else {
      createNewConversation(sourceType);
    }
  };

  const handleGlobalFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && pendingSourceType) {
      const file = e.target.files[0];
      createNewConversation(pendingSourceType, file);
    }
    setPendingSourceType(null);
    if (fileInputRef.current) fileInputRef.current.value = ""; // Reset
  };

  const handleSendMessage = async (text: string, file?: File, convToUse?: Conversation, sessionToUse?: ChatSession) => {
    const conv = convToUse || currentConversation;
    const session = sessionToUse || chatSessionRef.current;
    
    if (!conv || !session) return;

    // 1. Add User Message
    const userMsg: Message = {
      id: generateId(),
      role: 'user',
      text: text,
      attachmentUrl: file ? URL.createObjectURL(file) : undefined, // Quick preview
      createdAt: Date.now()
    };

    let updatedConv = { ...conv };
    updatedConv.messages = [...updatedConv.messages, userMsg];
    
    // Auto-generate title if first user message
    if (updatedConv.messages.length <= 2 && updatedConv.title === "New Conversation") {
      updatedConv.title = file ? file.name : (text.substring(0, 30) + (text.length > 30 ? "..." : ""));
    }

    setCurrentConversation(updatedConv);
    await saveConversation(updatedConv);

    // 2. Call AI
    setIsLoading(true);
    try {
      const responseText = await sendMessage(session, text, file);
      
      const modelMsg: Message = {
        id: generateId(),
        role: 'model',
        text: responseText,
        createdAt: Date.now()
      };

      updatedConv = { ...updatedConv, messages: [...updatedConv.messages, modelMsg] };
      setCurrentConversation(updatedConv);
      await saveConversation(updatedConv);
    } catch (error: any) {
      const errorMsg: Message = {
        id: generateId(),
        role: 'model',
        text: `I couldn't process that right now. (${error.message || "Unknown error"})`,
        createdAt: Date.now()
      };
      updatedConv = { ...updatedConv, messages: [...updatedConv.messages, errorMsg] };
      setCurrentConversation(updatedConv);
      await saveConversation(updatedConv);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (actionText: string) => {
    handleSendMessage(actionText);
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] text-[#1a1a1a] flex flex-col font-sans">
      
      {/* Hidden global file input for Home actions */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleGlobalFileChange} 
        className="hidden" 
        accept="image/*,.pdf,.doc,.docx,.txt"
      />

      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 flex-shrink-0">
        <Header 
          onNavClick={handleNavClick} 
          language={language} 
          onLanguageChange={setLanguage} 
        />
      </div>
      
      <main className="flex-grow flex flex-col relative w-full h-full overflow-y-auto">
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center h-full w-full">
            <div className="w-8 h-8 border-4 border-[#5AA9E6] border-t-transparent rounded-full animate-spin"></div>
          </div>
        }>
          {appState === "home" && (
            <Home onSelectAction={handleHomeAction} />
          )}

          {appState === "history" && (
            <History 
              onSelectConversation={(id) => {
                setActiveConversationId(id);
                setAppState('chat');
              }}
              onHome={() => handleNavClick('home')}
            />
          )}

          {appState === "help" && (
            <div className="flex flex-col items-center justify-center flex-grow py-12 px-4 max-w-2xl mx-auto text-center animate-in fade-in">
               <h2 className="text-3xl font-bold mb-6">Need Help?</h2>
               <p className="text-lg text-gray-600 mb-4">
                 Simply Explain is designed to be as easy to use as possible.
               </p>
               <ul className="text-left bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4 mb-8">
                 <li><strong>1.</strong> Go to the Home screen and select how you want to share information (Type, Upload, or Photo).</li>
                 <li><strong>2.</strong> The AI will explain the information simply in your selected language.</li>
                 <li><strong>3.</strong> You can ask follow-up questions using the text box or by tapping the microphone icon to speak.</li>
               </ul>
               <button onClick={() => handleNavClick('home')} className="btn btn-primary px-8 py-3">Got it</button>
            </div>
          )}

          {appState === "chat" && currentConversation && (
            <div className="flex flex-col flex-grow w-full h-full justify-between">
              {/* Scrollable Conversation Area */}
              <div className="flex-grow overflow-y-auto">
                <ConversationView 
                  messages={currentConversation.messages} 
                  language={language}
                  onQuickActionClick={handleQuickAction}
                  isLoading={isLoading}
                />
              </div>
              
              {/* Sticky Input Area */}
              <ChatInput 
                onSend={handleSendMessage}
                isLoading={isLoading}
              />
            </div>
          )}
        </Suspense>
      </main>
      
      {appState !== 'chat' && (
        <footer className="mt-auto py-8">
          <SafetyNotice />
        </footer>
      )}
    </div>
  );
}

export default App;
