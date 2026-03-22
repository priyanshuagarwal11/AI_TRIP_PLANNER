import React from 'react';
import type { TripData } from '../types';
import { Calendar, Trash2, Eye } from 'lucide-react';

interface SavedTripsProps {
  trips: TripData[];
  onView: (trip: TripData) => void;
  onDelete: (id: string) => void;
}

export const SavedTrips: React.FC<SavedTripsProps> = ({ trips, onView, onDelete }) => {
  if (trips.length === 0) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-3xl font-extrabold">No Saved Trips Yet</h2>
        <p className="text-gray-500 dark:text-gray-400">Your curated AI journeys will appear here when you save them.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500 max-w-5xl mx-auto py-12">
      <h2 className="text-4xl font-extrabold border-b border-gray-200 dark:border-gray-800 pb-4 mb-8">
        Your Travel Collection ({trips.length})
      </h2>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trips.map(trip => (
          <div key={trip.id} className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all group flex flex-col">
            <div className="h-40 bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
              {trip.itinerary[0]?.places[0]?.image ? (
                <img src={trip.itinerary[0].places[0].image} alt={trip.destination} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 mix-blend-multiply opacity-50"></div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-5">
                <h3 className="text-2xl font-black text-white">{trip.destination}</h3>
              </div>
            </div>
            
            <div className="p-6 flex-grow space-y-4">
              <div className="flex justify-between text-sm font-semibold text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {trip.days} Days</span>
                <span className="text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-md">
                  ${trip.cost.total.toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">Saved on {trip.dateSaved}</p>
            </div>
            
            <div className="flex border-t border-gray-100 dark:border-gray-700">
              <button 
                onClick={() => onView(trip)}
                className="flex-1 py-4 font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors flex items-center justify-center gap-2"
              >
                <Eye className="w-5 h-5" /> View
              </button>
              <button 
                onClick={() => onDelete(trip.id)}
                className="flex-1 py-4 font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors border-l border-gray-100 dark:border-gray-700 flex items-center justify-center gap-2"
              >
                <Trash2 className="w-5 h-5" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
