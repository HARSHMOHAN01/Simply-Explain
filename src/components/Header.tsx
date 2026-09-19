

interface HeaderProps {
  onHomeClick: () => void;
}

export default function Header({ onHomeClick }: HeaderProps) {
  return (
    <header className="pb-8 border-b-2 border-gray-100 flex flex-col gap-2">
      <button 
        onClick={onHomeClick}
        className="text-left group w-fit focus:outline-none"
      >
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight group-hover:text-gray-700 transition-colors mb-0">
          Simply Explain
        </h1>
      </button>
      <p className="text-xl md:text-2xl text-gray-700 font-medium">
        Understand anything. In the language you're comfortable with.
      </p>
    </header>
  );
}
