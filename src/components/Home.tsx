
interface HomeProps {
  onSelectAction: (sourceType: 'write' | 'upload' | 'camera' | 'check') => void;
}

export default function Home({ onSelectAction }: HomeProps) {
  return (
    <div className="flex flex-col items-center justify-center flex-grow py-8 px-4 w-full animate-in fade-in">
      
      <div className="text-center mb-12 max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#1a1a1a]">
          Understand anything.<br />
          Know what to do next.
        </h1>
        <p className="text-xl text-gray-600">
          Give Simply Explain something you want help with.
        </p>
      </div>

      <div className="w-full max-w-5xl bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold mb-8 text-center">What would you like help with?</h2>
        
        <div className="flex flex-col md:flex-row gap-6 w-full">
          
          <button 
            onClick={() => onSelectAction('write')}
            className="flex-1 flex flex-col items-center text-center p-6 bg-[#F9F9F9] hover:bg-[#7FC8F8] hover:bg-opacity-20 rounded-xl transition-colors border-2 border-transparent hover:border-[#5AA9E6] group"
          >
            <div className="w-16 h-16 bg-[#5AA9E6] text-white rounded-full flex items-center justify-center text-2xl mb-4 shadow-sm group-hover:scale-110 transition-transform">
              ✍️
            </div>
            <h3 className="text-xl font-bold mb-2">Write it</h3>
            <p className="text-gray-600">Type or paste something</p>
          </button>

          <button 
            onClick={() => onSelectAction('upload')}
            className="flex-1 flex flex-col items-center text-center p-6 bg-[#F9F9F9] hover:bg-[#7FC8F8] hover:bg-opacity-20 rounded-xl transition-colors border-2 border-transparent hover:border-[#5AA9E6] group"
          >
            <div className="w-16 h-16 bg-[#5AA9E6] text-white rounded-full flex items-center justify-center text-2xl mb-4 shadow-sm group-hover:scale-110 transition-transform">
              📄
            </div>
            <h3 className="text-xl font-bold mb-2">Upload it</h3>
            <p className="text-gray-600">Add a document or photo</p>
          </button>

          <button 
            onClick={() => onSelectAction('camera')}
            className="flex-1 flex flex-col items-center text-center p-6 bg-[#F9F9F9] hover:bg-[#FFE45E] hover:bg-opacity-20 rounded-xl transition-colors border-2 border-transparent hover:border-[#FFE45E] group"
          >
            <div className="w-16 h-16 bg-[#FFE45E] text-black rounded-full flex items-center justify-center text-2xl mb-4 shadow-sm group-hover:scale-110 transition-transform">
              📸
            </div>
            <h3 className="text-xl font-bold mb-2">Take a photo</h3>
            <p className="text-gray-600">Use your camera</p>
          </button>

          <button 
            onClick={() => onSelectAction('check')}
            className="flex-1 flex flex-col items-center text-center p-6 bg-[#F9F9F9] hover:bg-[#FF6392] hover:bg-opacity-10 rounded-xl transition-colors border-2 border-transparent hover:border-[#FF6392] group"
          >
            <div className="w-16 h-16 bg-[#FF6392] text-white rounded-full flex items-center justify-center text-2xl mb-4 shadow-sm group-hover:scale-110 transition-transform">
              🔍
            </div>
            <h3 className="text-xl font-bold mb-2">Check something</h3>
            <p className="text-gray-600">See if it needs attention</p>
          </button>

        </div>
      </div>

      <div className="mt-8 text-center text-gray-500 font-medium flex items-center gap-2">
        <span className="text-xl">🎤</span> You can also talk to Simply Explain using your voice.
      </div>
    </div>
  );
}
