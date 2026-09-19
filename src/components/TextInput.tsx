import { useState } from 'react';

interface TextInputProps {
  initialText: string;
  onTextSubmitted: (text: string) => void;
  onCancel: () => void;
}

export default function TextInput({ initialText, onTextSubmitted, onCancel }: TextInputProps) {
  const [text, setText] = useState(initialText);

  const handleSubmit = () => {
    if (text.trim().length > 0) {
      onTextSubmitted(text.trim());
    }
  };

  return (
    <div className="flex flex-col gap-6 flex-grow h-full">
      <div>
        <h2 className="text-3xl font-bold mb-2">Type or paste something you want explained</h2>
        <p className="text-xl text-gray-600">Don't worry if it looks complicated. We'll explain it simply.</p>
      </div>
      
      <div className="flex-grow flex flex-col gap-4 min-h-[300px]">
        <textarea 
          className="w-full flex-grow p-6 text-xl border-4 border-gray-200 rounded-xl focus:border-black focus:ring-0 resize-none"
          placeholder="Paste or type your message, letter, bill, or question here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          aria-label="Text to explain"
        />
        
        <div className="flex justify-between items-center px-2">
          {text.length > 0 ? (
            <button 
              className="text-lg font-bold text-gray-500 hover:text-black py-2 px-4 -ml-4"
              onClick={() => setText('')}
            >
              Clear text
            </button>
          ) : <div />}
        </div>
      </div>
      
      <div className="flex flex-col gap-4 mt-auto pt-4">
        <button 
          className="btn btn-primary py-6 text-2xl font-bold w-full"
          onClick={handleSubmit}
          disabled={text.trim().length === 0}
        >
          ✨ Explain Simply
        </button>
        <button 
          className="btn btn-secondary py-4 text-xl w-full"
          onClick={onCancel}
        >
          ← Cancel
        </button>
      </div>
    </div>
  );
}
