import React, { useState } from 'react';
import { PlaneTakeoff, Wallet, Calendar, Compass, AlertCircle } from 'lucide-react';

const interestsOptions = [
  'Adventure', 'Food', 'Nature', 'Nightlife', 'Culture', 'Shopping', 'Relaxation'
];

interface TripFormProps {
  onSubmit: (data: { destination: string; budget: number; days: number; interests: string[] }) => void;
}

export const TripForm: React.FC<TripFormProps> = ({ onSubmit }) => {
  const [destination, setDestination] = useState('');
  const [budget, setBudget] = useState('');
  const [days, setDays] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [error, setError] = useState('');

  const toggleInterest = (interest: string) => {
    setInterests(prev => 
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim() || !budget || !days) {
      setError('Please fill in destination, budget, and number of days.');
      return;
    }
    setError('');
    onSubmit({ destination, budget: Number(budget), days: Number(days), interests });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 md:p-10 border border-gray-100 dark:border-gray-700 transition-all hover:shadow-2xl">
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {error && (
          <div className="flex items-center gap-3 text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 p-4 rounded-xl animate-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span className="text-sm font-semibold">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-sm font-bold flex items-center gap-2 text-gray-700 dark:text-gray-200">
              <PlaneTakeoff className="w-5 h-5 text-blue-500" /> Destination
            </label>
            <input 
              type="text" 
              placeholder="e.g. Goa, Manali, Paris"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-5 py-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold flex items-center gap-2 text-gray-700 dark:text-gray-200">
              <Wallet className="w-5 h-5 text-green-500" /> Budget
            </label>
            <input 
              type="number" 
              placeholder="e.g. 50000"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              min="1"
              className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-5 py-4 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-bold flex items-center gap-2 text-gray-700 dark:text-gray-200">
            <Calendar className="w-5 h-5 text-purple-500" /> Number of Days
          </label>
          <input 
            type="number" 
            placeholder="e.g. 5"
            value={days}
            onChange={(e) => setDays(e.target.value)}
            min="1"
            max="30"
            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-5 py-4 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
          />
        </div>

        <div className="space-y-4">
          <label className="text-sm font-bold flex items-center gap-2 text-gray-700 dark:text-gray-200">
            <Compass className="w-5 h-5 text-orange-500" /> Your Interests
          </label>
          <div className="flex flex-wrap gap-3">
            {interestsOptions.map(interest => (
              <button
                key={interest}
                type="button"
                onClick={() => toggleInterest(interest)}
                className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                  interests.includes(interest)
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-purple-500/25 scale-105'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>

        <button 
          type="submit" 
          className="w-full py-5 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-extrabold text-xl shadow-xl shadow-blue-500/30 transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2 mt-4"
        >
          <PlaneTakeoff className="w-6 h-6" /> Generate Smart Itinerary
        </button>
      </form>
    </div>
  );
};
