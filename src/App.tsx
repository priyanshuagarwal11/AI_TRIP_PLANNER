import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthModal } from './components/AuthModal';
import { LoginPromptModal } from './components/LoginPromptModal';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { TripResults } from './components/TripResults';
import { SavedTrips } from './components/SavedTrips';
import { Footer } from './components/Footer';
import { LoadingAnimation } from './components/LoadingAnimation';
import { TripMap } from './components/TripMap';
import { GroupTrips } from './components/group/GroupTrips';
import { AITripPlanner } from './components/ai-chat/AITripPlanner';
import { UserDashboard } from './components/dashboard/UserDashboard';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import type { TripData } from './types';
import { getDestinationData } from './data/destinations';
import { logActivity, storeGlobalTrip } from './lib/firestore';

type ViewState = 'home' | 'plan' | 'loading' | 'results' | 'saved' | 'groups' | 'ai-planner' | 'dashboard' | 'admin';

function AppContent() {
  const [activeView, setActiveView] = useState<ViewState>('home');
  const [currentTrip, setCurrentTrip] = useState<TripData | null>(null);
  const [savedTrips, setSavedTrips] = useState<TripData[]>([]);
  const [tripHistory, setTripHistory] = useState<TripData[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [loginPromptMessage, setLoginPromptMessage] = useState('');
  const [pendingAction, setPendingAction] = useState<ViewState | null>(null);
  const [pendingFormData, setPendingFormData] = useState<any>(null);

  const { currentUser, isAdmin, logout } = useAuth();

  // After successful login, redirect based on role
  useEffect(() => {
    if (currentUser && pendingAction) {
      if (pendingAction === 'loading' && pendingFormData) {
        handleGenerateTrip(pendingFormData);
        setPendingFormData(null);
      } else {
        setActiveView(pendingAction);
      }
      setPendingAction(null);
    }
  }, [currentUser]);

  useEffect(() => {
    const loadedTrips = localStorage.getItem('savedTripsArray');
    if (loadedTrips) {
      try { setSavedTrips(JSON.parse(loadedTrips)); } catch (e) {}
    }
    const loadedHistory = localStorage.getItem('tripHistory');
    if (loadedHistory) {
      try { setTripHistory(JSON.parse(loadedHistory)); } catch (e) {}
    }
    const isDark = localStorage.getItem('theme') === 'dark' || 
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
    setDarkMode(!darkMode);
  };

  const requireAuth = (action: ViewState, message?: string, formData?: any): boolean => {
    if (currentUser) return true;
    setLoginPromptMessage(message || 'Please login first to plan your trip.');
    setShowLoginPrompt(true);
    setPendingAction(action);
    if (formData) setPendingFormData(formData);
    return false;
  };

  const handleSetView = (view: ViewState) => {
    const protectedViews: ViewState[] = ['saved', 'groups', 'ai-planner', 'dashboard', 'admin'];
    if (protectedViews.includes(view)) {
      // Admin route guard
      if (view === 'admin' && !isAdmin) {
        setActiveView('home');
        return;
      }
      const messages: Record<string, string> = {
        'saved': 'Please login to view your saved trips.',
        'groups': 'Please login to access group trips.',
        'ai-planner': 'Please login first to use the AI Trip Planner.',
        'dashboard': 'Please login to view your dashboard.',
        'admin': 'Admin access required.',
      };
      if (!requireAuth(view, messages[view])) return;
    }
    setActiveView(view);
  };

  const handleOpenAuth = () => {
    setShowLoginPrompt(false);
    setShowAuthModal(true);
  };

  const handleLogout = async () => {
    await logout();
    setActiveView('home');
  };

  const handleSaveTrip = (trip: TripData) => {
    if (!requireAuth('results', 'Please login to save your trip.')) return;
    const isAlreadySaved = savedTrips.find(t => t.id === trip.id);
    if (!isAlreadySaved) {
      const updated = [trip, ...savedTrips];
      setSavedTrips(updated);
      localStorage.setItem('savedTripsArray', JSON.stringify(updated));
      if (currentUser) logActivity(currentUser.uid, 'trip_saved', { destination: trip.destination });
      alert('✨ Trip saved to your collection!');
    } else {
      alert('Trip is already saved.');
    }
  };

  const handleDeleteTrip = (id: string) => {
    const updated = savedTrips.filter(t => t.id !== id);
    setSavedTrips(updated);
    localStorage.setItem('savedTripsArray', JSON.stringify(updated));
  };

  const generateMockTrip = (formData: any): TripData => {
    const destData = getDestinationData(formData.destination, formData.days);
    const total = Math.round(formData.budget * (0.8 + Math.random() * 0.15));
    const hotel = Math.round(total * 0.4);
    const travel = Math.round(total * 0.3);
    const food = total - hotel - travel;
    return {
      id: Date.now().toString(),
      destination: formData.destination,
      days: formData.days,
      budget: formData.budget,
      startDate: formData.startDate,
      dateSaved: new Date().toLocaleDateString(),
      itinerary: destData.days.map((dayData, i) => ({
        day: i + 1,
        title: dayData.title,
        subtitle: dayData.subtitle,
        places: dayData.places.map(p => ({
          name: p.name, description: p.description, image: p.image,
          time: p.time, period: p.period, lat: p.lat, lng: p.lng,
        })),
      })),
      cost: { total, hotel, travel, food },
      hotels: destData.hotels.map(h => ({
        name: h.name, price: Math.round(h.pricePerNight * formData.days),
        rating: h.rating, image: h.image,
      })),
      activities: formData.interests.length > 0
        ? formData.interests.map((interest: string, idx: number) => {
            const dayPlaces = destData.days[idx % destData.days.length]?.places || [];
            const relatedPlace = dayPlaces[0];
            return {
              type: interest,
              name: relatedPlace ? `${interest}: ${relatedPlace.name}` : `${interest} Masterclass`,
              description: relatedPlace
                ? `${interest}-focused experience at ${relatedPlace.name}. ${relatedPlace.description}`
                : `Premium ${interest.toLowerCase()} activity curated for ${formData.destination}.`,
            };
          })
        : destData.days.slice(0, 4).flatMap(d => d.places.slice(0, 1).map(p => ({
            type: 'Sightseeing', name: p.name, description: p.description,
          }))),
    };
  };

  const handleGenerateTrip = (formData: any) => {
    if (!requireAuth('loading', 'Please login first to plan your trip.', formData)) return;
    setActiveView('loading');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (currentUser) logActivity(currentUser.uid, 'trip_generated', { destination: formData.destination });
    setTimeout(async () => {
      const generated = generateMockTrip(formData);
      setCurrentTrip(generated);
      
      // Store globally for Admin Dashboard
      if (currentUser) {
        await storeGlobalTrip(currentUser, generated);
      }

      // Auto-save to trip history
      setTripHistory(prev => {
        const updated = [generated, ...prev].slice(0, 50); // keep last 50
        localStorage.setItem('tripHistory', JSON.stringify(updated));
        return updated;
      });
      setActiveView('results');
    }, 2800);
  };

  const handleAIChat = () => {
    if (!requireAuth('ai-planner', 'Please login first to use the AI Trip Planner.')) return;
    setActiveView('ai-planner');
  };

  const viewSavedTrip = (trip: TripData) => {
    setCurrentTrip(trip);
    setActiveView('results');
  };

  // Full-page views (no navbar/footer)
  if (activeView === 'admin') {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 text-gray-900 dark:text-gray-100 font-sans">
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
        <AdminDashboard onBack={() => setActiveView('home')} onLogout={handleLogout} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300 flex flex-col selection:bg-blue-500/20">
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      <LoginPromptModal 
        isOpen={showLoginPrompt} 
        onClose={() => setShowLoginPrompt(false)} 
        onLogin={handleOpenAuth}
        message={loginPromptMessage}
      />

      {activeView !== 'ai-planner' && (
        <Navbar 
          darkMode={darkMode} 
          toggleDarkMode={toggleDarkMode} 
          activeView={activeView === 'loading' ? 'plan' : activeView} 
          setView={handleSetView} 
          onOpenAuth={() => setShowAuthModal(true)}
        />
      )}
    
    <main className="flex-grow flex flex-col">
      {(activeView === 'home' || activeView === 'plan') && (
        <LandingPage 
          onSubmit={handleGenerateTrip} 
          onOpenAuth={() => setShowAuthModal(true)} 
          onAIChat={handleAIChat} 
        />
      )}

      {activeView === 'loading' && (
        <div className="flex-grow flex items-center justify-center">
          <LoadingAnimation />
        </div>
      )}

      {activeView === 'results' && currentTrip && (
        <div className="section py-8 lg:py-12 flex-grow">
          <TripResults tripData={currentTrip} onSave={handleSaveTrip} />
          <TripMap tripData={currentTrip} />
          <div className="mt-12 text-center">
            <button 
              onClick={() => { setActiveView('plan'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="btn-secondary px-8 py-3 rounded-xl"
            >
              ← Plan Another Trip
            </button>
          </div>
        </div>
      )}

      {activeView === 'saved' && (
        <div className="section flex-grow">
          <SavedTrips trips={savedTrips} onView={viewSavedTrip} onDelete={handleDeleteTrip} />
        </div>
      )}

      {activeView === 'dashboard' && (
        <UserDashboard 
          savedTrips={savedTrips}
          tripHistory={tripHistory}
          onViewTrip={viewSavedTrip}
          onDeleteTrip={handleDeleteTrip}
          onPlanTrip={() => setActiveView('plan')}
          onLogout={handleLogout}
        />
      )}

      {activeView === 'groups' && (
        <div className="flex-grow">
          <GroupTrips onOpenAuth={() => setShowAuthModal(true)} />
        </div>
      )}

      {activeView === 'ai-planner' && (
        <AITripPlanner onBack={() => setActiveView('home')} />
      )}
    </main>

    {activeView !== 'ai-planner' && <Footer />}
  </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
