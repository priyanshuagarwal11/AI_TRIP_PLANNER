import React, { useState } from 'react';
import { 
  MapPin, Download, Share2, Bookmark, Calendar, 
  BedDouble, Activity, CheckCircle2, Star,
  Car, Coffee, CreditCard, LayoutDashboard
} from 'lucide-react';
import type { TripData } from '../types';

export const TripResults = ({ tripData, onSave }: { tripData: TripData, onSave: (trip: TripData) => void }) => {
  const [activeTab, setActiveTab] = useState<'itinerary' | 'hotels' | 'activities' | 'cost'>('itinerary');

  return (
    <div className="space-y-12">
      {/* 1. Summary Header Section */}
      <div className="flex flex-col md:flex-row justify-between gap-6 bg-white dark:bg-gray-800 p-8 rounded-[2rem] shadow-xl border border-gray-100 dark:border-gray-700 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000 -z-0"></div>
        <div className="relative z-10 flex-col flex justify-center">
          <div className="flex items-center gap-3 bg-blue-50 dark:bg-blue-900/40 w-fit px-4 py-2 rounded-full mb-4">
            <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse"></span>
            <span className="text-sm font-bold text-blue-700 dark:text-blue-300">AI Plan Ready</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
            <MapPin className="text-purple-500 w-10 h-10" /> {tripData.destination}
          </h2>
          <div className="flex flex-wrap items-center gap-4 mt-6">
            <span className="px-5 py-2.5 bg-gray-100 dark:bg-gray-900 shadow-inner rounded-xl font-bold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-400" /> {tripData.days} Days
            </span>
            <span className="px-5 py-2.5 bg-gray-100 dark:bg-gray-900 shadow-inner rounded-xl font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
              <CreditCard className="w-5 h-5" /> Est. ${tripData.cost.total.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="relative z-10 flex flex-col md:items-end justify-center gap-4 border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-700 pt-6 md:pt-0 md:pl-8">
          <div className="grid grid-cols-2 lg:flex lg:flex-row gap-3 w-full">
            <button className="flex items-center justify-center gap-2 px-5 py-4 lg:py-3 bg-gray-50 hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-800 rounded-xl font-bold transition-colors shadow-sm text-gray-700 dark:text-gray-300">
              <Share2 className="w-5 h-5" /> Share
            </button>
            <button className="flex items-center justify-center gap-2 px-5 py-4 lg:py-3 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 rounded-xl font-bold transition-colors shadow-sm text-red-600 dark:text-red-400">
              <Download className="w-5 h-5" /> PDF
            </button>
            <button 
              onClick={() => onSave(tripData)}
              className="flex items-center col-span-2 justify-center gap-2 px-6 py-4 lg:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-extrabold transition-transform hover:-translate-y-1 shadow-xl shadow-blue-500/20 w-full"
            >
              <Bookmark className="w-5 h-5" /> Save Trip
            </button>
          </div>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="flex overflow-x-auto no-scrollbar gap-2 md:gap-4 p-2 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 sticky top-24 z-40">
        {[ 
          { id: 'itinerary', icon: LayoutDashboard, label: 'Itinerary' },
          { id: 'hotels', icon: BedDouble, label: 'Hotels' },
          { id: 'activities', icon: Activity, label: 'Activities' },
          { id: 'cost', icon: CreditCard, label: 'Cost Breakdown' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center min-w-[140px] gap-2 px-6 py-4 rounded-xl font-bold transition-all duration-300 ${
              activeTab === tab.id 
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <tab.icon className="w-5 h-5" /> {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
        
        {/* ITINERARY TAB */}
        {activeTab === 'itinerary' && (
          <div className="space-y-8">
            <h3 className="text-3xl font-black mb-6 flex items-center gap-3">
              <Calendar className="text-purple-500 w-8 h-8" /> Day-by-Day Plan
            </h3>
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {tripData.itinerary.map((dayPlan) => (
                <div key={dayPlan.day} className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700 flex flex-col group relative hover:-translate-y-1 transition-transform">
                  <div className="absolute top-4 right-4 w-12 h-12 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-2xl shadow-lg flex items-center justify-center font-black text-2xl text-blue-600 z-10">
                    {dayPlan.day}
                  </div>
                  <div className="h-48 bg-gray-200 dark:bg-gray-700 overflow-hidden relative">
                    {dayPlan.places[0]?.image ? (
                      <img src={dayPlan.places[0].image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Day highlight" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-purple-500"></div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-gray-900 to-transparent pt-12 p-6">
                      <h4 className="text-xl font-bold text-white shadow-sm">
                        Day {dayPlan.day} Overview
                      </h4>
                    </div>
                  </div>
                  
                  <div className="p-6 flex-grow flex flex-col justify-center space-y-6">
                    {dayPlan.places.map((place, i) => (
                      <div key={i} className="flex gap-4 group/item">
                        <div className="flex flex-col items-center">
                          <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0 bg-white dark:bg-gray-800 rounded-full" />
                          {i !== dayPlan.places.length - 1 && <div className="w-0.5 h-full bg-gray-200 dark:bg-gray-700 mt-2 rounded-full"></div>}
                        </div>
                        <div className="pb-4">
                          <h5 className="font-bold text-gray-900 dark:text-white mb-1 group-hover/item:text-blue-500 transition-colors text-lg">{place.name}</h5>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 leading-relaxed">{place.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* HOTELS */}
        {activeTab === 'hotels' && (
          <div className="space-y-6">
            <h3 className="text-3xl font-black mb-6 flex items-center gap-3">
              <BedDouble className="text-orange-500 w-8 h-8" /> Recommended Stays
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tripData.hotels.map((hotel, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all group">
                  <div className="h-48 bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
                    {hotel.image ? (
                      <img src={hotel.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-orange-400 to-red-500"></div>
                    )}
                    <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1 font-bold text-gray-900 dark:text-white">
                      <Star className="w-4 h-4 text-orange-500 fill-current" /> {hotel.rating}
                    </div>
                  </div>
                  <div className="p-6">
                    <h4 className="font-bold text-2xl text-gray-900 dark:text-white mb-2 line-clamp-1">{hotel.name}</h4>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2 mb-6">
                      <MapPin className="w-4 h-4" /> Near city center
                    </p>
                    <div className="flex items-end justify-between border-t border-gray-100 dark:border-gray-700 pt-6">
                      <div>
                        <span className="text-3xl font-black text-green-600 dark:text-green-400">${Math.round(hotel.price / tripData.days)}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400"> / night</span>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900 dark:text-white">${hotel.price}</p>
                        <p className="text-xs font-bold text-gray-400">TOTAL</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ACTIVITIES */}
        {activeTab === 'activities' && (
          <div className="space-y-6">
            <h3 className="text-3xl font-black mb-6 flex items-center gap-3">
              <Activity className="text-pink-500 w-8 h-8" /> Top Activities Matches
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {tripData.activities.map((activity, i) => (
                <div key={i} className="flex gap-6 bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 hover:-translate-y-1 transition-transform group">
                  <div className="hidden sm:flex items-center justify-center w-20 h-20 bg-pink-50 dark:bg-pink-900/20 text-pink-500 rounded-2xl shrink-0 group-hover:scale-110 transition-transform">
                    <Activity className="w-10 h-10" />
                  </div>
                  <div>
                    <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-900 text-xs font-bold text-gray-500 dark:text-gray-400 mb-3 inline-block uppercase tracking-wider">
                      {activity.type}
                    </span>
                    <h4 className="font-extrabold text-2xl text-gray-900 dark:text-white mb-2">{activity.name}</h4>
                    <p className="text-lg text-gray-600 dark:text-gray-400 font-medium leading-relaxed">{activity.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* COST */}
        {activeTab === 'cost' && (
          <div className="space-y-8">
            <h3 className="text-3xl font-black mb-6 flex items-center gap-3">
              <CreditCard className="text-green-500 w-8 h-8" /> Budget Breakdown
            </h3>
            
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-8 text-white shadow-xl shadow-green-500/20 flex flex-col justify-center items-center text-center">
                <p className="text-green-100 text-lg font-bold mb-2 uppercase tracking-wide">Total Estimated Cost</p>
                <div className="text-6xl font-black tracking-tighter mb-4">${tripData.cost.total.toLocaleString()}</div>
                <p className="bg-white/20 px-4 py-2 rounded-xl font-medium backdrop-blur-sm">
                  Budget limit was ${tripData.budget.toLocaleString()}
                </p>
              </div>

              <div className="lg:col-span-2 grid sm:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center justify-center gap-4 hover:-translate-y-1 transition-transform">
                  <div className="w-16 h-16 bg-orange-50 dark:bg-orange-900/30 text-orange-500 rounded-2xl flex items-center justify-center mb-2">
                    <BedDouble className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest text-xs mb-1">Accommodation</h4>
                    <div className="text-3xl font-black text-gray-900 dark:text-white">${tripData.cost.hotel.toLocaleString()}</div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center justify-center gap-4 hover:-translate-y-1 transition-transform">
                  <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 text-blue-500 rounded-2xl flex items-center justify-center mb-2">
                    <Car className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest text-xs mb-1">Travel & Trans.</h4>
                    <div className="text-3xl font-black text-gray-900 dark:text-white">${tripData.cost.travel.toLocaleString()}</div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center justify-center gap-4 hover:-translate-y-1 transition-transform">
                  <div className="w-16 h-16 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-500 rounded-2xl flex items-center justify-center mb-2">
                    <Coffee className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest text-xs mb-1">Food & Leisure</h4>
                    <div className="text-3xl font-black text-gray-900 dark:text-white">${tripData.cost.food.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl mt-8 border border-blue-100 dark:border-blue-900 font-medium text-blue-800 dark:text-blue-200">
              💡 <strong>Pro Tip:</strong> This breakdown is dynamically curated based on your selected interests. Allocations adjust heavier on food, adventure, or standard depending on what you picked!
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
