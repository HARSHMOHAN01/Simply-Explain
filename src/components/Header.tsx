
interface HeaderProps {
  onNavClick: (view: 'home' | 'history' | 'help') => void;
  language: string;
  onLanguageChange: (lang: string) => void;
}

const LANGUAGES = ["English", "हिन्दी", "বাংলা", "मराठी", "தமிழ்", "తెలుగు"];

export default function Header({ onNavClick, language, onLanguageChange }: HeaderProps) {
  return (
    <header className="py-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white z-20">
      <button 
        onClick={() => onNavClick('home')}
        className="flex items-center gap-2 group focus:outline-none"
      >
        <div className="w-8 h-8 bg-[#5AA9E6] rounded-md flex items-center justify-center text-white font-bold group-hover:scale-105 transition-transform">
          SE
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#1a1a1a] group-hover:text-[#5AA9E6] transition-colors leading-none">
            Simply Explain
          </h1>
          <p className="text-xs text-gray-500 font-medium mt-1">Your Clear Companion</p>
        </div>
      </button>

      <nav className="flex items-center gap-2 sm:gap-4 flex-wrap justify-center">
        <button 
          onClick={() => onNavClick('home')}
          className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-full font-medium transition-colors"
        >
          Home
        </button>
        <button 
          onClick={() => onNavClick('history')}
          className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-full font-medium transition-colors"
        >
          History
        </button>
        <button 
          onClick={() => onNavClick('help')}
          className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-full font-medium transition-colors"
        >
          Help
        </button>
        
        <div className="relative">
          <select 
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="appearance-none pl-4 pr-10 py-2 bg-[#F9F9F9] border border-gray-200 rounded-full text-gray-700 font-medium focus:outline-none focus:border-[#5AA9E6] cursor-pointer"
          >
            {LANGUAGES.map(lang => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>
      </nav>
    </header>
  );
}
