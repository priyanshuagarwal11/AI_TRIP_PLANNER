import { Sparkles, ArrowRight } from 'lucide-react';

export const Hero = ({ onStartPlanning }: { onStartPlanning: () => void }) => {
  return (
    <div className="relative overflow-hidden bg-white dark:bg-gray-950 rounded-b-[3rem] shadow-sm transition-colors">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1" 
          alt="Travel landscape" 
          className="w-full h-full object-cover opacity-[0.15] dark:opacity-[0.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-gray-950 via-white/50 dark:via-gray-950/50 to-transparent p-12"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-20 lg:py-32 flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-100/80 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-bold shadow-sm border border-blue-200 dark:border-blue-800/50 mb-8 backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-purple-500 animate-pulse" /> AI-Powered Travel Assistant
        </div>
        
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-tight text-gray-900 dark:text-white max-w-5xl">
          Plan your perfect trip <br className="hidden md:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400">
            in seconds using AI.
          </span>
        </h1>
        
        <p className="mt-8 text-xl lg:text-2xl text-gray-600 dark:text-gray-400 max-w-2xl font-medium leading-relaxed">
          Skip the endless research and stress. Our smart engine crafts personalized itineraries, finds top hotels, and splits your budget automatically.
        </p>

        <div className="mt-12 group">
          <button 
            onClick={onStartPlanning}
            className="flex items-center gap-3 px-8 py-5 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-extrabold text-xl shadow-2xl shadow-blue-500/30 transition-all hover:scale-105 active:scale-95"
          >
            Start Planning Now
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        
        <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800 w-full max-w-4xl flex justify-center gap-8 text-gray-500 dark:text-gray-500 flex-wrap font-semibold">
          <div className="flex flex-col items-center">
            <span className="text-2xl text-gray-900 dark:text-white font-black">10M+</span> Destinations Addressed
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl text-gray-900 dark:text-white font-black">200K+</span> Trips Optimized
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl text-gray-900 dark:text-white font-black">99%</span> Happy Travelers
          </div>
        </div>
      </div>
    </div>
  );
};
