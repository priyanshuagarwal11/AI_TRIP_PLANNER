import React, { useState, useEffect } from 'react';
import { Map as MapIcon, Moon, Sun, LogIn, LogOut, User, Users, Bot, Menu, X, LayoutDashboard, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  activeView: string;
  setView: (view: any) => void;
  onOpenAuth: () => void;
}

const BASE_NAV = [
  { id: 'home', label: 'Home' },
  { id: 'plan', label: 'Plan Trip' },
  { id: 'saved', label: 'Saved' },
  { id: 'groups', label: 'Groups', icon: Users },
  { id: 'ai-planner', label: 'AI Planner', icon: Bot },
] as const;

export const Navbar: React.FC<NavbarProps> = ({ darkMode, toggleDarkMode, activeView, setView, onOpenAuth }) => {
  const { currentUser, logout, isAdmin } = useAuth();

  // Build nav items dynamically based on auth/role
  const NAV_ITEMS: Array<{ id: string; label: string; icon?: React.ElementType }> = [
    ...BASE_NAV,
    ...(currentUser ? [{ id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }] : []),
    ...(isAdmin ? [{ id: 'admin', label: 'Admin', icon: Shield }] : []),
  ];
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNav = (id: string) => {
    setView(id as any);
    setMobileOpen(false);
  };

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-gray-200/60 dark:border-gray-800/60 shadow-sm'
        : 'bg-transparent'
    }`}>
      <div className="section flex items-center justify-between h-16">
        {/* Logo */}
        <button onClick={() => handleNav('home')} className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <MapIcon className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-extrabold tracking-tight text-gray-900 dark:text-white">
            Trip<span className="text-blue-600 dark:text-blue-400">Genie</span>
          </span>
        </button>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map(item => {
            const isActive = activeView === item.id || (activeView === 'loading' && item.id === 'plan');
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                  isActive
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/50'
                }`}
              >
                {item.icon && <item.icon className="w-3.5 h-3.5" />}
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
            title="Toggle theme"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {currentUser ? (
            <div className="hidden sm:flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-2 py-1.5 rounded-lg">
              <button onClick={() => handleNav('dashboard')} className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 hover:scale-110 transition-transform" title="Dashboard">
                {currentUser.photoURL ? <img src={currentUser.photoURL} className="w-full h-full rounded-full object-cover" alt="" /> : <User className="w-3.5 h-3.5" />}
              </button>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 max-w-[80px] truncate">
                {currentUser.displayName || currentUser.email?.split('@')[0]}
              </span>
              <button
                onClick={() => logout()}
                className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 rounded-md transition-colors"
                title="Log out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="hidden sm:flex btn-primary text-sm px-4 py-2"
            >
              <LogIn className="w-3.5 h-3.5" /> Sign In
            </button>
          )}

          {/* Mobile hamburger */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white dark:bg-slate-950 border-t border-gray-100 dark:border-gray-800 animate-in slide-in-from-top-2 duration-200">
          <div className="section py-4 space-y-1">
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  activeView === item.id
                    ? 'text-blue-600 bg-blue-50 dark:bg-blue-950/50'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                {item.icon && <item.icon className="w-4 h-4" />}
                {item.label}
              </button>
            ))}
            <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
              {currentUser ? (
                <button onClick={() => { logout(); setMobileOpen(false); }} className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20">
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              ) : (
                <button onClick={() => { onOpenAuth(); setMobileOpen(false); }} className="w-full btn-primary py-3 text-sm">
                  <LogIn className="w-4 h-4" /> Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
