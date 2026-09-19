import { useEffect, useRef } from 'react';
import type { Message } from '../services/history';
import ListenButton from './ListenButton';

interface ConversationProps {
  messages: Message[];
  language: string;
  onQuickActionClick: (text: string) => void;
  isLoading: boolean;
}

export default function Conversation({ messages, language, onQuickActionClick, isLoading }: ConversationProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const parseMessage = (text: string) => {
    // Extract [QuickAction: text] and clean text
    const quickActions: string[] = [];
    const regex = /\\[QuickAction:\\s*(.+?)\\]/g;
    let match;
    
    while ((match = regex.exec(text)) !== null) {
      quickActions.push(match[1]);
    }
    
    // Remove the QuickAction tags from the display text
    const cleanText = text.replace(/\\[QuickAction:.*?\\]/g, '').trim();
    
    return { cleanText, quickActions };
  };

  return (
    <div className="flex-grow flex flex-col w-full max-w-4xl mx-auto p-4 gap-6 animate-in fade-in pb-8">
      
      {messages.length === 0 && !isLoading && (
        <div className="text-center text-gray-500 my-12">
          No messages yet.
        </div>
      )}

      {messages.map((msg) => {
        const isUser = msg.role === 'user';
        const { cleanText, quickActions } = isUser ? { cleanText: msg.text, quickActions: [] } : parseMessage(msg.text);
        
        return (
          <div key={msg.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[85%] ${isUser ? 'self-end' : 'self-start'}`}>
            
            <div className={`p-4 md:p-6 rounded-2xl text-lg md:text-xl leading-relaxed shadow-sm ${isUser ? 'bg-[#5AA9E6] text-white rounded-br-sm' : 'bg-white border border-gray-100 rounded-bl-sm text-gray-800'}`}>
              
              {/* Attachment Preview (if any) */}
              {msg.attachmentUrl && (
                <div className="mb-4 bg-black/10 rounded-lg p-2 flex items-center gap-3 max-w-[200px] md:max-w-xs overflow-hidden">
                  <span className="text-2xl">📄</span>
                  <span className="truncate text-sm font-medium">Attachment</span>
                </div>
              )}

              {/* Text content with simple line breaks */}
              <div className="whitespace-pre-wrap">{cleanText}</div>
            </div>

            {/* Listen Button (only for AI) */}
            {!isUser && cleanText && (
              <div className="mt-2 w-full max-w-[250px]">
                <ListenButton textToRead={cleanText} language={language} />
              </div>
            )}

            {/* Quick Actions (only for AI) */}
            {!isUser && quickActions.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {quickActions.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={() => onQuickActionClick(action)}
                    className="px-4 py-2 bg-[#F9F9F9] border-2 border-[#5AA9E6] text-[#5AA9E6] rounded-full font-bold hover:bg-[#5AA9E6] hover:text-white transition-colors shadow-sm"
                  >
                    {action}
                  </button>
                ))}
              </div>
            )}

          </div>
        );
      })}

      {isLoading && (
        <div className="flex flex-col items-start max-w-[85%] self-start">
          <div className="p-6 rounded-2xl bg-white border border-gray-100 rounded-bl-sm text-gray-800 shadow-sm flex items-center gap-3">
            <div className="flex gap-1">
              <div className="w-3 h-3 bg-[#5AA9E6] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-3 h-3 bg-[#5AA9E6] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-3 h-3 bg-[#5AA9E6] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
            <span className="text-gray-500 font-medium ml-2">Understanding...</span>
          </div>
        </div>
      )}

      <div ref={bottomRef} className="h-4"></div>
    </div>
  );
}
