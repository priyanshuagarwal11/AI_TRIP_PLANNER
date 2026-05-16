import { useState, useEffect } from 'react';
import { Plane, MapPin, Hotel, Utensils } from 'lucide-react';

const STEPS = [
  { icon: MapPin, text: 'Analyzing destinations...' },
  { icon: Hotel, text: 'Finding best accommodations...' },
  { icon: Utensils, text: 'Curating local experiences...' },
  { icon: Plane, text: 'Optimizing your itinerary...' },
];

export const LoadingAnimation = () => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep(s => (s + 1) % STEPS.length);
    }, 700);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="py-24 flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-300">
      {/* Spinner */}
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-2 border-gray-200 dark:border-gray-800" />
        <div className="absolute inset-0 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Plane className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
      </div>

      {/* Text */}
      <div className="text-center space-y-3">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Building your trip
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium h-5">
          {STEPS[activeStep].text}
        </p>
      </div>

      {/* Progress steps */}
      <div className="flex items-center gap-3">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          return (
            <div
              key={i}
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300 ${
                i <= activeStep
                  ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 scale-110'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-400 scale-100'
              }`}
            >
              <Icon className="w-4 h-4" />
            </div>
          );
        })}
      </div>

      {/* Skeleton preview */}
      <div className="w-full max-w-sm space-y-3 mt-4">
        <div className="skeleton h-4 w-3/4 mx-auto" />
        <div className="skeleton h-3 w-1/2 mx-auto" />
        <div className="skeleton h-24 w-full rounded-xl" />
        <div className="flex gap-2">
          <div className="skeleton h-16 flex-1 rounded-xl" />
          <div className="skeleton h-16 flex-1 rounded-xl" />
        </div>
      </div>
    </div>
  );
};
