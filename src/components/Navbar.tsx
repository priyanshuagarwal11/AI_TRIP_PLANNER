import React from 'react';
import { Map as MapIcon, Moon, Sun, LogIn, LogOut, User, Users, Bot } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  activeView: 'home' | 'plan' | 'results' | 'saved' | 'groups' | 'ai-planner';
  setView: (view: 'home' | 'plan' | 'results' | 'saved' | 'groups' | 'ai-planner') => void;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ darkMode, toggleDarkMode, activeView, setView, onOpenAuth }) => {
  const { currentUser, logout } = useAuth();

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
            onClick={() => setView('groups')}
            className={`px-3 py-1 rounded-full transition-colors flex items-center gap-1.5 ${activeView === 'groups' ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-600 dark:text-gray-300 hover:text-blue-500'}`}
          >
            <Users className="w-4 h-4" />
            Groups
          </button>
          <button 
            onClick={() => setView('ai-planner')}
            className={`px-3 py-1 rounded-full transition-colors flex items-center gap-1.5 ${activeView === 'ai-planner' ? 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' : 'text-gray-600 dark:text-gray-300 hover:text-yellow-500'}`}
          >
            <Bot className="w-4 h-4" />
            AI Planner
          </button>
          
          <button 
            onClick={toggleDarkMode} 
            className="p-2 md:ml-4 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all text-gray-600 dark:text-gray-300 flex-shrink-0"
            title="Toggle Dark Mode"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {currentUser ? (
            <div className="ml-auto flex items-center gap-3 bg-gray-100 dark:bg-gray-800 px-2 py-1.5 rounded-full border border-gray-200 dark:border-gray-700">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <User className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-gray-700 dark:text-gray-300 max-w-[100px] truncate">
                {currentUser.displayName || currentUser.email?.split('@')[0]}
              </span>
              <button
                onClick={() => logout()}
                className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 rounded-full transition-colors group"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="ml-auto md:ml-2 flex items-center gap-2 px-5 py-2.5 rounded-full font-bold transition-all bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90 shadow-lg shadow-blue-500/20"
            >
              <LogIn className="w-4 h-4" /> Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};
