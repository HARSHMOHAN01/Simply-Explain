import React, { useEffect, useState } from 'react';
import { getConversations, deleteConversation } from '../services/history';
import type { Conversation } from '../services/history';
import type { User } from 'firebase/auth';

interface HistoryProps {
  onSelectConversation: (id: string) => void;
  onHome: () => void;
  user: User | null;
}

export default function History({ onSelectConversation, onHome, user }: HistoryProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    if (user) {
      getConversations(user.uid).then(data => setConversations(data));
    } else {
      setConversations([]);
    }
  }, [user]);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this conversation?")) {
      await deleteConversation(id);
      if (user) {
        getConversations(user.uid).then(data => setConversations(data));
      }
    }
  };

  const formatDate = (ms: number) => {
    const date = new Date(ms);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center flex-grow py-12 px-4 w-full animate-in fade-in text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <span className="text-4xl" aria-hidden="true">💬</span>
        </div>
        <h2 className="text-3xl font-bold mb-4">Your conversations will appear here.</h2>
        <p className="text-xl text-gray-600 mb-8 max-w-md">
          Start by giving Simply Explain something to understand.
        </p>
        <button 
          onClick={onHome}
          className="btn btn-primary py-4 px-8 text-xl font-bold"
        >
          Start a conversation
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto py-8 px-4 animate-in fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1a1a1a]">Your conversations</h1>
        <p className="text-gray-600 text-lg mt-2">Continue where you left off.</p>
      </div>

      <div className="flex flex-col gap-4">
        {conversations.map(conv => {
          const lastMessage = conv.messages[conv.messages.length - 1];
          let snippet = lastMessage?.text || "Started a conversation...";
          // Clean quick actions from snippet
          snippet = snippet.replace(/\\[QuickAction:.*?\\]/g, '').trim();
          if (snippet.length > 80) snippet = snippet.substring(0, 80) + "...";

          return (
            <div 
              key={conv.id}
              onClick={() => onSelectConversation(conv.id)}
              className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:border-[#5AA9E6] hover:shadow-md transition-all cursor-pointer group flex justify-between items-start"
            >
              <div className="flex flex-col max-w-[85%]">
                <h3 className="text-xl font-bold text-[#1a1a1a] mb-1 group-hover:text-[#5AA9E6] transition-colors">{conv.title}</h3>
                <p className="text-gray-600 truncate">{snippet}</p>
                <span className="text-sm text-gray-400 mt-3 font-medium">{formatDate(conv.updatedAt)}</span>
              </div>
              
              <button 
                onClick={(e) => handleDelete(e, conv.id)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                title="Delete conversation"
              >
                🗑️
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
