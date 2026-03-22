import React, { useState } from 'react';
import { PlaneTakeoff, Wallet, Calendar, Compass, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

const interestsOptions = [
  'Adventure', 'Food', 'Nature', 'Nightlife', 'Culture', 'Shopping', 'Relaxation', 'Wildlife', 'History', 'Beach'
];

interface WizardProps {
  onSubmit: (data: { destination: string; budget: number; days: number; interests: string[] }) => void;
}

export const TripFormWizard: React.FC<WizardProps> = ({ onSubmit }) => {
  const [step, setStep] = useState(1);
  const [destination, setDestination] = useState('');
  const [budget, setBudget] = useState('');
  const [days, setDays] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [error, setError] = useState('');

  const nextStep = () => {
    if (step === 1 && (!destination.trim() || !days)) {
      setError('Please provide destination and number of days.');
      return;
    }
    if (step === 2 && !budget) {
      setError('Please provide a budget amount.');
      return;
    }
    setError('');
    setStep((s) => s + 1);
  };

  const toggleInterest = (interest: string) => {
    setInterests(prev => 
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  const handleFinalSubmit = () => {
    if (interests.length === 0) {
      setError('Please select at least one interest.');
      return;
    }
    setError('');
    onSubmit({ destination, budget: Number(budget), days: Number(days), interests });
  };

  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden mt-8 transition-colors">
      <div className="bg-gray-50 dark:bg-gray-900 p-6 flex items-center justify-between border-b border-gray-100 dark:border-gray-700">
        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Plan Your Trip</h2>
        <div className="flex items-center gap-2">
          <div className={`w-8 h-2 rounded-full ${step >= 1 ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
          <div className={`w-8 h-2 rounded-full ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
          <div className={`w-8 h-2 rounded-full ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
        </div>
      </div>

      <div className="p-8 md:p-12 min-h-[350px] relative">
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-bold rounded-xl animate-in fade-in transition-all border border-red-200 dark:border-red-800">
            {error}
          </div>
        )}

        {/* STEP 1: Core Details */}
        {step === 1 && (
          <div className="space-y-8 animate-in slide-in-from-right-8 fade-in duration-500">
            <h3 className="text-3xl font-extrabold flex items-center gap-3">
              <PlaneTakeoff className="text-blue-500 w-8 h-8" /> Where to next?
            </h3>
            
            <div className="space-y-4">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-200">Destination</label>
              <input 
                type="text" 
                placeholder="e.g. Kyoto, Japan or Bali, Indonesia"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                autoFocus
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-lg font-medium"
              />
            </div>

            <div className="space-y-4">
              <label className="text-sm font-bold flex items-center gap-2 text-gray-700 dark:text-gray-200">
                <Calendar className="w-5 h-5 text-purple-500" /> Duration (Days)
              </label>
              <input 
                type="number" 
                min="1" max="60"
                placeholder="Number of days..."
                value={days}
                onChange={(e) => setDays(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all text-lg font-medium"
              />
            </div>
          </div>
        )}

        {/* STEP 2: Budget */}
        {step === 2 && (
          <div className="space-y-8 animate-in slide-in-from-right-8 fade-in duration-500">
            <h3 className="text-3xl font-extrabold flex items-center gap-3">
              <Wallet className="text-green-500 w-8 h-8" /> What's your budget?
            </h3>
            <p className="text-gray-500 dark:text-gray-400 font-medium">This helps us find the right hotels, dining, and activities for you.</p>

            <div className="space-y-4 pt-4">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-200">Total Budget ($)</label>
              <div className="relative">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-lg">$</span>
                <input 
                  type="number" 
                  min="1"
                  placeholder="5000"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  autoFocus
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl pl-12 pr-6 py-4 focus:ring-4 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all text-xl font-black text-green-700 dark:text-green-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Interests */}
        {step === 3 && (
          <div className="space-y-8 animate-in slide-in-from-right-8 fade-in duration-500">
            <h3 className="text-3xl font-extrabold flex items-center gap-3">
              <Compass className="text-orange-500 w-8 h-8" /> Select your vibe
            </h3>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Pick multiple tags so our AI can curate the perfect experience.</p>

            <div className="flex flex-wrap gap-3 pt-2">
              {interestsOptions.map(interest => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  className={`px-5 py-3 rounded-xl text-md font-bold transition-all duration-300 border-2 ${
                    interests.includes(interest)
                      ? 'bg-orange-50 dark:bg-orange-900/30 border-orange-500 text-orange-600 dark:text-orange-400 scale-[1.02] shadow-sm'
                      : 'bg-transparent border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-orange-300'
                  }`}
                >
                  {interests.includes(interest) && <CheckCircle2 className="inline w-4 h-4 mr-2 mb-0.5" />}
                  {interest}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="bg-gray-50 dark:bg-gray-900 p-6 flex items-center justify-between border-t border-gray-100 dark:border-gray-700">
        {step > 1 ? (
          <button 
            type="button" 
            onClick={() => { setStep(s => s - 1); setError(''); }}
            className="px-6 py-3 rounded-xl font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" /> Back
          </button>
        ) : <div />}
        
        {step < 3 ? (
          <button 
            type="button" 
            onClick={nextStep}
            className="px-8 py-3 rounded-xl font-extrabold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20 flex items-center gap-2 active:scale-95"
          >
            Next Step <ArrowRight className="w-5 h-5" />
          </button>
        ) : (
          <button 
            type="button" 
            onClick={handleFinalSubmit}
            className="px-8 py-3 rounded-xl font-extrabold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all shadow-xl shadow-purple-500/30 flex items-center gap-2 active:scale-95 animate-pulse-once"
          >
            Generate My Plan <Sparkles className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

// Requires Sparkles import below
import { Sparkles } from 'lucide-react';
