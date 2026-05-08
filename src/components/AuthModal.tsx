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
    
    // Basic validations
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
      onClose(); // close on success
    } catch (err: any) {
      // Basic firebase error parsing
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

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-md bg-white/10 dark:bg-gray-900/40 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"></div>

        <div className="relative p-8">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-white mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-gray-300">
              {isLogin ? 'Enter your details to access your trips' : 'Join WanderMind to explore the world'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/50 rounded-xl text-red-200 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 focus:border-blue-500/50 rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-400 outline-none transition-all"
                />
              </div>
            )}
            
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="email" 
                placeholder="Email Address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 focus:border-blue-500/50 rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-400 outline-none transition-all"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 focus:border-blue-500/50 rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-400 outline-none transition-all"
              />
            </div>

            {!isLogin && (
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="password" 
                  placeholder="Confirm Password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 focus:border-blue-500/50 rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-400 outline-none transition-all"
                />
              </div>
            )}

            <button 
              disabled={loading}
              type="submit"
              className="w-full py-3 mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/25 flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isLogin ? <LogIn className="w-5 h-5" /> : null)}
              {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="h-px bg-white/10 flex-1"></div>
            <span className="text-gray-400 text-sm font-medium">OR</span>
            <div className="h-px bg-white/10 flex-1"></div>
          </div>

          <button 
            onClick={handleGoogle}
            disabled={loading}
            className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-bold transition-all flex justify-center items-center gap-3 disabled:opacity-70"
          >
            <Chrome className="w-5 h-5 text-blue-400" />
            Continue with Google
          </button>

          <div className="mt-8 text-center text-sm text-gray-400">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="text-blue-400 hover:text-blue-300 font-bold transition-colors"
            >
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
