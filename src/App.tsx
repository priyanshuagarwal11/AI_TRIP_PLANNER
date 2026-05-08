import { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { AuthModal } from './components/AuthModal';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { TripResults } from './components/TripResults';
import { SavedTrips } from './components/SavedTrips';
import { Footer } from './components/Footer';
import { LoadingAnimation } from './components/LoadingAnimation';
import { TripMap } from './components/TripMap';
import { GroupTrips } from './components/group/GroupTrips';
import { AITripPlanner } from './components/ai-chat/AITripPlanner';
import type { TripData } from './types';
import { getDestinationData } from './data/destinations';

type ViewState = 'home' | 'plan' | 'loading' | 'results' | 'saved' | 'groups' | 'ai-planner';

function App() {
  const [activeView, setActiveView] = useState<ViewState>('home');
  const [currentTrip, setCurrentTrip] = useState<TripData | null>(null);
  const [savedTrips, setSavedTrips] = useState<TripData[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    // Check saved trips
    const loadedTrips = localStorage.getItem('savedTripsArray');
    if (loadedTrips) {
      try {
        setSavedTrips(JSON.parse(loadedTrips));
      } catch (e) {
        console.error('Failed to parse saved trips');
      }
    }
    // Check theme
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

  const handleSaveTrip = (trip: TripData) => {
    const isAlreadySaved = savedTrips.find(t => t.id === trip.id);
    if (!isAlreadySaved) {
      const updated = [trip, ...savedTrips];
      setSavedTrips(updated);
      localStorage.setItem('savedTripsArray', JSON.stringify(updated));
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
      dateSaved: new Date().toLocaleDateString(),
      itinerary: destData.days.map((dayData, i) => ({
        day: i + 1,
        title: dayData.title,
        subtitle: dayData.subtitle,
        places: dayData.places.map(p => ({
          name: p.name,
          description: p.description,
          image: p.image,
          time: p.time,
          period: p.period,
          lat: p.lat,
          lng: p.lng,
        })),
      })),
      cost: { total, hotel, travel, food },
      hotels: destData.hotels.map(h => ({
        name: h.name,
        price: Math.round(h.pricePerNight * formData.days),
        rating: h.rating,
        image: h.image,
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
            type: 'Sightseeing',
            name: p.name,
            description: p.description,
          }))),
    };
  };

  const handleGenerateTrip = (formData: any) => {
    setActiveView('loading');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    setTimeout(() => {
      const generated = generateMockTrip(formData);
      setCurrentTrip(generated);
      setActiveView('results');
    }, 2800); // Simulated delay
  };

  const viewSavedTrip = (trip: TripData) => {
    setCurrentTrip(trip);
    setActiveView('results');
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300 flex flex-col selection:bg-blue-500/30">
        
        {/* Render auth modal globally when opened */}
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

        {activeView !== 'ai-planner' && (
          <Navbar 
            darkMode={darkMode} 
            toggleDarkMode={toggleDarkMode} 
            activeView={activeView === 'loading' ? 'plan' : activeView} 
            setView={setActiveView} 
            onOpenAuth={() => setShowAuthModal(true)}
          />
        )}
      
      <main className="flex-grow flex flex-col">
        {(activeView === 'home' || activeView === 'plan') && (
          <LandingPage onSubmit={handleGenerateTrip} onOpenAuth={() => setShowAuthModal(true)} onAIChat={() => setActiveView('ai-planner')} />
        )}

        {activeView === 'loading' && (
          <div className="flex-grow flex items-center justify-center">
            <LoadingAnimation />
          </div>
        )}

        {activeView === 'results' && currentTrip && (
          <div className="container mx-auto px-4 py-8 lg:py-12 flex-grow">
            <div className="max-w-7xl mx-auto">
              <TripResults tripData={currentTrip} onSave={handleSaveTrip} />
              <TripMap tripData={currentTrip} />
              <div className="mt-16 text-center">
                <button 
                  onClick={() => { setActiveView('plan'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="px-8 py-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-full font-bold transition-colors shadow-sm inline-flex items-center gap-2"
                >
                  Plan Another Trip
                </button>
              </div>
            </div>
          </div>
        )}

        {activeView === 'saved' && (
          <div className="container mx-auto px-4 flex-grow">
            <SavedTrips trips={savedTrips} onView={viewSavedTrip} onDelete={handleDeleteTrip} />
          </div>
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
    </AuthProvider>
  );
}

export default App;
