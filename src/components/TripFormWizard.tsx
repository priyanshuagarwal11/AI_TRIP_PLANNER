import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Sparkles, MapPin, CalendarDays, Users, Wallet, CheckCircle2 } from 'lucide-react';

const interestsOptions = [
  'Adventure', 'Food & Culinary', 'Nature & Outdoors', 'Nightlife', 
  'Culture & Heritage', 'Shopping', 'Relaxation & Spa', 'Wildlife', 
  'History', 'Beach & Sun'
];

interface WizardProps {
  onSubmit: (data: { destination: string; budget: number; days: number; travelers: number; interests: string[] }) => void;
}

export const TripFormWizard: React.FC<WizardProps> = ({ onSubmit }) => {
  const [step, setStep] = useState(1);
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState('');
  const [travelers, setTravelers] = useState('2');
  const [budget, setBudget] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [error, setError] = useState('');

  const nextStep = () => {
    if (step === 1 && (!destination.trim() || !days || !travelers)) {
      setError('Please fill in all details to continue.');
      return;
    }
    if (step === 2 && !budget) {
      setError('Please provide an estimated budget.');
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
      setError('Please select at least one vibe for your trip.');
      return;
    }
    setError('');
    onSubmit({ destination, budget: Number(budget), days: Number(days), travelers: Number(travelers), interests });
  };

  return (
    <div className="max-w-2xl mx-auto w-full font-sans relative z-10">
      {/* Premium Glassmorphism Card */}
      <div className="bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-2xl rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-gray-100 dark:border-slate-800/60 overflow-hidden transition-all duration-500">
        
        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-gray-100 dark:bg-slate-800/50">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500 ease-out"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        <div className="p-8 md:p-12 min-h-[400px] flex flex-col justify-center relative">
          
          {error && (
            <div className="absolute top-6 left-8 right-8 p-3 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-sm font-medium rounded-2xl animate-in fade-in slide-in-from-top-2 border border-red-100 dark:border-red-500/20 text-center">
              {error}
            </div>
          )}

          {/* STEP 1: Core Details */}
          {step === 1 && (
            <div className="space-y-8 animate-in slide-in-from-right-4 fade-in duration-500">
              <div className="space-y-6">
                {/* Destination */}
                <div className="space-y-3">
                  <label className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    Where do you want to go? 🌍
                  </label>
                  <div className="relative group">
                    <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    <input 
                      type="text" 
                      placeholder="e.g. Goa, Japan, Bali..."
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      autoFocus
                      className="w-full bg-gray-50/50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700/50 rounded-2xl pl-14 pr-6 py-4 md:py-5 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-lg font-medium text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Days */}
                  <div className="space-y-3">
                    <label className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      How many days? 📅
                    </label>
                    <div className="relative group">
                      <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                      <input 
                        type="number" 
                        min="1" max="60"
                        placeholder="e.g. 3"
                        value={days}
                        onChange={(e) => setDays(e.target.value)}
                        className="w-full bg-gray-50/50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700/50 rounded-2xl pl-12 pr-4 py-4 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-lg font-medium text-gray-900 dark:text-white placeholder:text-gray-400"
                      />
                    </div>
                  </div>

                  {/* Travelers */}
                  <div className="space-y-3">
                    <label className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      Who’s traveling? 👨‍👩‍👧‍👦
                    </label>
                    <div className="relative group">
                      <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                      <input 
                        type="number" 
                        min="1" max="20"
                        placeholder="e.g. 2"
                        value={travelers}
                        onChange={(e) => setTravelers(e.target.value)}
                        className="w-full bg-gray-50/50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700/50 rounded-2xl pl-12 pr-4 py-4 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-lg font-medium text-gray-900 dark:text-white placeholder:text-gray-400"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Budget */}
          {step === 2 && (
            <div className="space-y-8 animate-in slide-in-from-right-4 fade-in duration-500">
              <div className="text-center space-y-2">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  What's your budget? 💰
                </h3>
                <p className="text-gray-500 dark:text-slate-400 text-sm md:text-base">
                  Help us tailor the perfect accommodations and experiences.
                </p>
              </div>

              <div className="max-w-md mx-auto pt-4">
                <div className="relative group">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 font-medium text-2xl group-focus-within:text-emerald-500 transition-colors">
                    ₹
                  </span>
                  <input 
                    type="number" 
                    min="1000"
                    placeholder="20000"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    autoFocus
                    className="w-full bg-gray-50/50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700/50 rounded-3xl pl-14 pr-6 py-6 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all text-3xl md:text-4xl font-bold text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-slate-700 text-center"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Interests */}
          {step === 3 && (
            <div className="space-y-8 animate-in slide-in-from-right-4 fade-in duration-500">
              <div className="text-center space-y-2">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  What's your vibe? ✨
                </h3>
                <p className="text-gray-500 dark:text-slate-400 text-sm md:text-base">
                  Select a few interests to personalize your itinerary.
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-3 pt-4">
                {interestsOptions.map(interest => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`px-5 py-3 rounded-2xl text-sm md:text-base font-medium transition-all duration-300 border ${
                      interests.includes(interest)
                        ? 'bg-indigo-500/10 dark:bg-indigo-500/20 border-indigo-500 text-indigo-700 dark:text-indigo-300 shadow-sm'
                        : 'bg-white dark:bg-slate-800/50 border-gray-200 dark:border-slate-700/50 text-gray-600 dark:text-slate-300 hover:border-gray-300 dark:hover:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {interests.includes(interest) && <CheckCircle2 className="inline w-4 h-4 mr-1.5 mb-0.5" />}
                    {interest}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Navigation Footer */}
        <div className="px-8 py-6 bg-gray-50/50 dark:bg-slate-900/30 border-t border-gray-100 dark:border-slate-800/60 flex items-center justify-between">
          <button 
            type="button" 
            onClick={() => { setStep(s => Math.max(1, s - 1)); setError(''); }}
            className={`px-6 py-3 rounded-2xl font-semibold text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 transition-all flex items-center gap-2 ${step === 1 ? 'invisible' : ''}`}
          >
            <ArrowLeft className="w-5 h-5" /> Back
          </button>
          
          {step < 3 ? (
            <button 
              type="button" 
              onClick={nextStep}
              className="px-8 py-3.5 rounded-2xl font-bold text-white bg-gray-900 dark:bg-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 transition-all shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] flex items-center gap-2 active:scale-95"
            >
              Continue <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <button 
              type="button" 
              onClick={handleFinalSubmit}
              className="px-8 py-3.5 rounded-2xl font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-all shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.23)] flex items-center gap-2 active:scale-95 group"
            >
              Plan My Trip ✈️
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
