

const LANGUAGES = [
  "English",
  "हिन्दी", // Hindi
  "বাংলা", // Bengali
  "मराठी", // Marathi
  "தமிழ்", // Tamil
  "తెలుగు"  // Telugu
];

interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageChange: (lang: string) => void;
}

export default function LanguageSelector({ selectedLanguage, onLanguageChange }: LanguageSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {LANGUAGES.map((lang) => {
        const isSelected = selectedLanguage === lang;
        return (
          <button
            key={lang}
            onClick={() => onLanguageChange(lang)}
            className={`
              p-6 text-2xl font-bold rounded-xl border-4 text-left flex justify-between items-center transition-colors
              ${isSelected 
                ? 'border-black bg-gray-50 text-black' 
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }
            `}
            aria-pressed={isSelected}
          >
            {lang}
            {isSelected && <span aria-hidden="true" className="text-3xl">✓</span>}
          </button>
        );
      })}
    </div>
  );
}
