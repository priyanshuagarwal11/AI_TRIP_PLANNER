import React, { useState } from 'react';
import { X, Mail, Lock, User as UserIcon, LogIn, Chrome, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { login, register, googleSignIn } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) return setError('Email and password are required');
    if (password.length < 6) return setError('Password must be at least 6 characters');
    
    if (!isLogin) {
      if (!name) return setError('Name is required');
      if (password !== confirmPassword) return setError('Passwords do not match');
    }

    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      onClose();
    } catch (err: any) {
      let msg = err.message;
      if (err.code === 'auth/wrong-password') msg = 'Incorrect password';
      else if (err.code === 'auth/user-not-found') msg = 'No user found with this email';
      else if (err.code === 'auth/email-already-in-use') msg = 'Email is already taken';
      else if (err.code === 'auth/weak-password') msg = 'Password is too weak';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      setError('');
      setLoading(true);
      await googleSignIn();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm text-gray-900 dark:text-white placeholder:text-gray-400";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-elevated overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        <div className="p-8">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-1">
              {isLogin ? 'Welcome back' : 'Create account'}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isLogin ? 'Enter your details to access your trips' : 'Join TripGenie to explore the world'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-sm text-center font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            {!isLogin && (
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
              </div>
            )}
            
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} />
            </div>

            {!isLogin && (
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={inputClass} />
              </div>
            )}

            <button disabled={loading} type="submit" className="btn-primary w-full py-3 text-sm mt-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (isLogin ? <LogIn className="w-4 h-4" /> : null)}
              {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="h-px bg-gray-200 dark:bg-gray-700 flex-1" />
            <span className="text-gray-400 text-xs font-medium">OR</span>
            <div className="h-px bg-gray-200 dark:bg-gray-700 flex-1" />
          </div>

          <button onClick={handleGoogle} disabled={loading} className="btn-secondary w-full py-3 text-sm">
            <Chrome className="w-4 h-4 text-blue-500" /> Continue with Google
          </button>

          <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
            >
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
