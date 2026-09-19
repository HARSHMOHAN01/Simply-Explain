

interface ErrorStateProps {
  onRetry: () => void;
  onHome: () => void;
  message?: string;
}

export default function ErrorState({ onRetry, onHome, message }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center flex-grow text-center gap-8 py-12">
      <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <span className="text-5xl" aria-hidden="true">⚠️</span>
      </div>
      
      <div>
        <h2 className="text-3xl font-bold mb-4">Something went wrong</h2>
        <p className="text-xl text-gray-600 max-w-md mx-auto leading-relaxed">
          We couldn't explain this right now. The photo may be blurry, or we might be having trouble connecting.
        </p>
        
        {message && (
          <div className="mt-6 p-4 bg-gray-100 border-2 border-gray-200 rounded-lg text-left">
            <p className="text-sm font-bold text-gray-700 uppercase mb-1">Developer Details:</p>
            <p className="text-red-700 font-mono text-sm break-words">{message}</p>
          </div>
        )}
      </div>
      
      <div className="flex flex-col w-full md:w-2/3 gap-4 mt-8">
        <button 
          className="btn btn-primary py-6 text-xl font-bold w-full"
          onClick={onRetry}
        >
          ↻ Try Again
        </button>
        <button 
          className="btn btn-secondary py-4 text-xl w-full"
          onClick={onHome}
        >
          ← Go to Home
        </button>
      </div>
    </div>
  );
}
