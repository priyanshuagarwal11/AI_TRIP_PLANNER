import React from 'react';
import { ShieldAlert, LogIn, X } from 'lucide-react';

interface LoginPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
  message?: string;
}

export const LoginPromptModal: React.FC<LoginPromptModalProps> = ({ 
  isOpen, onClose, onLogin,
  message = 'Please login first to plan your trip.'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-elevated overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        <div className="relative p-8 text-center">
          <button onClick={onClose} className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
            <X className="w-4 h-4" />
          </button>

          <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center mx-auto mb-5">
            <ShieldAlert className="w-7 h-7 text-amber-500" />
          </div>

          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            Sign in required
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-6 max-w-xs mx-auto">
            {message}
          </p>

          <button 
            onClick={() => { onClose(); onLogin(); }}
            className="btn-primary w-full py-3 text-sm"
          >
            <LogIn className="w-4 h-4" /> Sign In to Continue
          </button>

          <p className="mt-3 text-xs text-gray-400 dark:text-gray-500">
            Sign in with email or Google — it takes 10 seconds
          </p>
        </div>
      </div>
    </div>
  );
};
