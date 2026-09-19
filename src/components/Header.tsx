import type { User } from 'firebase/auth';

interface HeaderProps {
  onNavClick: (view: 'home' | 'history' | 'help') => void;
  language: string;
  onLanguageChange: (lang: string) => void;
  user: User | null;
  onLogin: () => void;
  onLogout: () => void;
}

const LANGUAGES = ["English", "हिन्दी", "বাংলা", "मराठी", "தமிழ்", "తెలుగు"];

export default function Header({ onNavClick, language, onLanguageChange, user, onLogin, onLogout }: HeaderProps) {
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
        {user && (
          <button 
            onClick={() => onNavClick('history')}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-full font-medium transition-colors"
          >
            History
          </button>
        )}
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

        {/* Auth Section */}
        <div className="ml-2 pl-2 border-l border-gray-200 flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <img src={user.photoURL || 'https://via.placeholder.com/32'} alt="Profile" className="w-8 h-8 rounded-full border border-gray-200" />
              <button 
                onClick={onLogout}
                className="text-sm font-medium text-red-500 hover:text-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <button 
              onClick={onLogin}
              className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-full hover:bg-gray-50 font-medium transition-colors text-gray-700 shadow-sm"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Sign in
            </button>
          )}
        </div>

      </nav>
    </header>
  );
}
