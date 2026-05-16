import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, MapPin, CalendarDays, Users, Wallet, CheckCircle2 } from 'lucide-react';
import { LocationAutocomplete } from './LocationAutocomplete';

const interestsOptions = [
  'Adventure', 'Food & Culinary', 'Nature & Outdoors', 'Nightlife', 
  'Culture & Heritage', 'Shopping', 'Relaxation & Spa', 'Wildlife', 
  'History', 'Beach & Sun'
];

interface WizardProps {
  onSubmit: (data: { destination: string; startDate: string; budget: number; days: number; travelers: number; interests: string[] }) => void;
}

export const TripFormWizard: React.FC<WizardProps> = ({ onSubmit }) => {
  const [step, setStep] = useState(1);
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [days, setDays] = useState('');
  const [travelers, setTravelers] = useState('2');
  const [budget, setBudget] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [error, setError] = useState('');

  const nextStep = () => {
    if (step === 1 && (!destination.trim() || !startDate || !days || !travelers)) {
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
      setError('Please select at least one interest.');
      return;
    }
    setError('');
    onSubmit({ destination, startDate, budget: Number(budget), days: Number(days), travelers: Number(travelers), interests });
  };

  return (
    <div className="max-w-xl mx-auto w-full">
      <div className="card overflow-hidden">
        {/* Progress */}
        <div className="h-1 bg-gray-100 dark:bg-gray-800">
          <div 
            className="h-full bg-blue-600 transition-all duration-500 ease-out"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {/* Steps indicator */}
        <div className="flex items-center justify-center gap-2 pt-6 px-6">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                s <= step
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
              }`}>
                {s < step ? <CheckCircle2 className="w-4 h-4" /> : s}
              </div>
              {s < 3 && <div className={`w-8 h-px ${s < step ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`} />}
            </div>
          ))}
        </div>

        <div className="p-6 sm:p-8 min-h-[340px] flex flex-col justify-center">
          {error && (
            <div className="mb-6 p-3 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-sm font-medium rounded-xl border border-red-100 dark:border-red-500/20 text-center animate-in slide-in-from-top-2">
              {error}
            </div>
          )}

          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in duration-300">
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Where do you want to go?
                </label>
                <LocationAutocomplete
                  value={destination}
                  onChange={setDestination}
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Start Date</label>
                <div className="relative">
                  <CalendarDays className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={startDate} onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm text-gray-900 dark:text-white placeholder:text-gray-400"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Days</label>
                  <div className="relative">
                    <CalendarDays className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="number" min="1" max="60" placeholder="e.g. 5"
                      value={days} onChange={(e) => setDays(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm text-gray-900 dark:text-white placeholder:text-gray-400"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Travelers</label>
                  <div className="relative">
                    <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="number" min="1" max="20" placeholder="e.g. 2"
                      value={travelers} onChange={(e) => setTravelers(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm text-gray-900 dark:text-white placeholder:text-gray-400"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-5 animate-in fade-in duration-300 text-center">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">What's your budget?</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">We'll optimize your itinerary to match.</p>
              </div>
              <div className="max-w-xs mx-auto">
                <div className="relative">
                  <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="number" min="1000" placeholder="₹ 20,000"
                    value={budget} onChange={(e) => setBudget(e.target.value)}
                    autoFocus
                    className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-2xl font-bold text-center text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-600"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-5 animate-in fade-in duration-300 text-center">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">What are you into?</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Select your interests to personalize the itinerary.</p>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {interestsOptions.map(interest => (
                  <button
                    key={interest} type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${
                      interests.includes(interest)
                        ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 text-blue-700 dark:text-blue-300 shadow-sm'
                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    {interests.includes(interest) && <CheckCircle2 className="inline w-3.5 h-3.5 mr-1.5 -mt-0.5" />}
                    {interest}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="px-6 sm:px-8 py-4 bg-gray-50/50 dark:bg-gray-900/30 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <button 
            type="button" 
            onClick={() => { setStep(s => Math.max(1, s - 1)); setError(''); }}
            className={`btn-ghost text-sm ${step === 1 ? 'invisible' : ''}`}
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          
          {step < 3 ? (
            <button type="button" onClick={nextStep} className="btn-primary text-sm">
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button type="button" onClick={handleFinalSubmit} className="btn-primary text-sm shadow-glow">
              Generate Trip ✈️
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
