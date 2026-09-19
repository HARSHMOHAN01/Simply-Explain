import { useEffect, useState } from 'react';

const STEPS = [
  "Reading...",
  "Understanding...",
  "Simplifying..."
];

export default function ProcessingState() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center flex-grow text-center gap-8 py-12">
      <div>
        <h2 className="text-3xl font-bold mb-4">We're understanding this for you...</h2>
        <p className="text-xl text-gray-600">This may take a few seconds.</p>
      </div>

      <div className="flex flex-col items-start gap-4 text-2xl font-medium w-fit mx-auto mt-8">
        {STEPS.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;

          return (
            <div 
              key={step} 
              className={`flex items-center gap-4 transition-all duration-500
                ${isCompleted ? 'text-black' : isActive ? 'text-blue-600' : 'text-gray-300'}
              `}
            >
              <span className="w-8 flex justify-center text-3xl">
                {isCompleted ? '✓' : isActive ? '●' : '○'}
              </span>
              <span>{step}</span>
            </div>
          );
        })}
      </div>
      
      {/* Simple accessible loading spinner indicator */}
      <div className="mt-8" role="status" aria-label="Loading">
        <div className="w-12 h-12 border-8 border-gray-200 border-t-black rounded-full animate-spin mx-auto"></div>
      </div>
    </div>
  );
}
