import React from 'react';
import { Map as MapIcon, Moon, Sun } from 'lucide-react';

interface NavbarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  activeView: 'home' | 'plan' | 'results' | 'saved';
  setView: (view: 'home' | 'plan' | 'results' | 'saved') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ darkMode, toggleDarkMode, activeView, setView }) => {
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800 shadow-sm transition-colors">
      <div className="container mx-auto px-4 py-4 flex flex-wrap justify-between items-center gap-4">
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => setView('home')}
        >
          <div className="bg-gradient-to-tr from-blue-600 to-purple-600 p-2 rounded-xl group-hover:scale-110 transition-transform">
            <MapIcon className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
            TripGenie
          </span>
        </div>
        
        <div className="flex items-center gap-2 md:gap-6 font-semibold overflow-x-auto no-scrollbar">
          <button 
            onClick={() => setView('home')}
            className={`px-3 py-1 rounded-full transition-colors ${activeView === 'home' ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-600 dark:text-gray-300 hover:text-blue-500'}`}
          >
            Home
          </button>
          <button 
            onClick={() => setView('plan')}
            className={`px-3 py-1 rounded-full transition-colors ${activeView === 'plan' ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-600 dark:text-gray-300 hover:text-blue-500'}`}
          >
            Plan Trip
          </button>
          <button 
            onClick={() => setView('saved')}
            className={`px-3 py-1 rounded-full transition-colors ${activeView === 'saved' ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-600 dark:text-gray-300 hover:text-blue-500'}`}
          >
            Saved Trips
          </button>
          
          <button 
            onClick={toggleDarkMode} 
            className="p-2 md:ml-4 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all text-gray-600 dark:text-gray-300 ml-auto flex-shrink-0"
            title="Toggle Dark Mode"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </nav>
  );
};
