import React from 'react';
import type { TripData } from '../types';
import { Calendar, Trash2, Eye, MapPin, Bookmark } from 'lucide-react';

interface SavedTripsProps {
  trips: TripData[];
  onView: (trip: TripData) => void;
  onDelete: (id: string) => void;
}

export const SavedTrips: React.FC<SavedTripsProps> = ({ trips, onView, onDelete }) => {
  if (trips.length === 0) {
    return (
      <div className="py-24 text-center">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-5">
          <Bookmark className="w-7 h-7 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No saved trips yet</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm mx-auto">
          Your curated AI journeys will appear here when you save them.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-10 animate-in fade-in duration-300">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Your Trips
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{trips.length} saved trip{trips.length > 1 ? 's' : ''}</p>
      </div>
      
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {trips.map(trip => (
          <div key={trip.id} className="card overflow-hidden group flex flex-col">
            <div className="h-36 bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
              {trip.itinerary[0]?.places[0]?.image ? (
                <img src={trip.itinerary[0].places[0].image} alt={trip.destination} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-indigo-500" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-3 left-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" /> {trip.destination}
                </h3>
              </div>
            </div>
            
            <div className="p-4 flex-grow">
              <div className="flex justify-between text-sm">
                <span className="badge bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-0 text-xs">
                  <Calendar className="w-3 h-3" /> {trip.days} Days
                </span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-sm">
                  ₹{trip.cost.total.toLocaleString()}
                </span>
              </div>
              {trip.dateSaved && (
                <p className="text-xs text-gray-400 mt-2">Saved {trip.dateSaved}</p>
              )}
            </div>
            
            <div className="flex border-t border-gray-100 dark:border-gray-800">
              <button 
                onClick={() => onView(trip)}
                className="flex-1 py-3 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors flex items-center justify-center gap-1.5"
              >
                <Eye className="w-4 h-4" /> View
              </button>
              <button 
                onClick={() => onDelete(trip.id)}
                className="flex-1 py-3 text-sm font-semibold text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors border-l border-gray-100 dark:border-gray-800 flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
