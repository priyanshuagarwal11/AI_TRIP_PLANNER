import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { TripFormWizard } from './components/TripFormWizard';
import { TripResults } from './components/TripResults';
import { SavedTrips } from './components/SavedTrips';
import { Footer } from './components/Footer';
import { LoadingAnimation } from './components/LoadingAnimation';
import { MapPlaceholder } from './components/MapPlaceholder';
import type { TripData } from './types';

type ViewState = 'home' | 'plan' | 'loading' | 'results' | 'saved';

function App() {
  const [activeView, setActiveView] = useState<ViewState>('home');
  const [currentTrip, setCurrentTrip] = useState<TripData | null>(null);
  const [savedTrips, setSavedTrips] = useState<TripData[]>([]);
  const [darkMode, setDarkMode] = useState(false);

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
    const total = Math.round(formData.budget * (0.8 + Math.random() * 0.15));
    const hotel = Math.round(total * 0.4);
    const travel = Math.round(total * 0.3);
    const food = total - hotel - travel;

    const imgMap = [
      'https://images.unsplash.com/photo-1522814382583-0aa718acdf3b?w=600',
      'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=600',
      'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=600',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600'
    ];

    const hotelImgs = [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600',
      'https://images.unsplash.com/photo-1551882547-ff40c0d13c11?w=600',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600'
    ];

    return {
      id: Date.now().toString(),
      destination: formData.destination,
      days: formData.days,
      budget: formData.budget,
      dateSaved: new Date().toLocaleDateString(),
      itinerary: Array.from({ length: formData.days }).map((_, i) => ({
        day: i + 1,
        places: [
          { name: `Morning Cafe & City Walk`, description: `Perfect start around the iconic streets of ${formData.destination}.`, image: imgMap[(i + 0) % imgMap.length] },
          { name: `Historic Monument Tour`, description: `Dive into the deep culture and snap amazing photos.`},
          { name: `Sunset Viewpoint`, description: `Enjoy breathtaking sunset vistas as evening approaches.`},
          { name: `Night Market & Dinner`, description: `Explore vibrant local life and traditional cuisine.`}
        ]
      })),
      cost: { total, hotel, travel, food }, 
      hotels: [
        { name: 'Grand Skyline Hotel', price: Math.round(hotel * 0.7), rating: 4.9, image: hotelImgs[0] },
        { name: 'Cozy Boutique Resort', price: Math.round(hotel * 0.5), rating: 4.6, image: hotelImgs[1] },
        { name: 'City Center Inn', price: Math.round(hotel * 0.3), rating: 4.2, image: hotelImgs[2] }
      ],
      activities: formData.interests.length > 0 ? formData.interests.map((interest: string) => ({
        type: interest,
        name: `${interest} Masterclass & Experience`,
        description: `Premium ${interest.toLowerCase()}-focused activity specially curated for travelers in ${formData.destination}.`
      })) : [
        { type: 'Tour', name: 'City Highlight Guided Tour', description: 'Cover all major landmarks with an expert local guide.' },
        { type: 'Food', name: 'Local Cuisine Tasting', description: 'Sample the most popular street food and local delicacies.' }
      ]
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
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300 flex flex-col selection:bg-blue-500/30">
      
      {activeView !== 'home' && (
        <Navbar 
          darkMode={darkMode} 
          toggleDarkMode={toggleDarkMode} 
          activeView={activeView === 'loading' ? 'plan' : activeView} 
          setView={setActiveView} 
        />
      )}
      
      <main className="flex-grow flex flex-col">
        {(activeView === 'home' || activeView === 'plan') && (
          <LandingPage onSubmit={handleGenerateTrip} />
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
              <MapPlaceholder />
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
      </main>

      <Footer />
    </div>
  );
}

export default App;
