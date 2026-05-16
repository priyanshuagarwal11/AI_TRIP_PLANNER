import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  MapPin, Calendar, TrendingUp, Star, Clock, Download, Share2, Trash2, Eye,
  User, Settings, LogOut, Bookmark, Search, Globe, ChevronRight, Sparkles, History
} from 'lucide-react';
import type { TripData } from '../../types';

interface UserDashboardProps {
  savedTrips: TripData[];
  tripHistory?: TripData[];
  onViewTrip: (trip: TripData) => void;
  onDeleteTrip: (id: string) => void;
  onPlanTrip: () => void;
  onLogout: () => void;
}

// ─── Stat Card ───
const StatCard = ({ icon: Icon, label, value, color }: { icon: any; label: string; value: string; color: string }) => (
  <div className="card p-5 hover:-translate-y-0.5 transition-all">
    <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3`}>
      <Icon className="w-5 h-5" />
    </div>
    <div className="text-2xl font-extrabold text-gray-900 dark:text-white">{value}</div>
    <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-0.5">{label}</div>
  </div>
);

// ─── Recommendation Card ───
const recommendations = [
  { name: 'Santorini', country: 'Greece', image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=400&h=250&fit=crop', tag: 'Romantic' },
  { name: 'Kyoto', country: 'Japan', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=250&fit=crop', tag: 'Cultural' },
  { name: 'Maldives', country: 'Maldives', image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400&h=250&fit=crop', tag: 'Beach' },
  { name: 'Swiss Alps', country: 'Switzerland', image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=400&h=250&fit=crop', tag: 'Adventure' },
];

export const UserDashboard: React.FC<UserDashboardProps> = ({
  savedTrips, tripHistory = [], onViewTrip, onDeleteTrip, onPlanTrip, onLogout
}) => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'trips' | 'history' | 'settings'>('overview');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    try {
      const recent = JSON.parse(localStorage.getItem('tripgenie_recent_searches') || '[]');
      setRecentSearches(recent.map((r: any) => r.name || r).slice(0, 5));
    } catch { setRecentSearches([]); }
  }, []);

  const totalBudget = savedTrips.reduce((sum, t) => sum + (t.cost?.total || 0), 0);
  const totalDays = savedTrips.reduce((sum, t) => sum + (t.days || 0), 0);
  const userName = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Traveler';

  return (
    <div className="section py-8 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Welcome back, {userName} 👋
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Here's your travel overview and upcoming plans.
          </p>
        </div>
        <button onClick={onPlanTrip} className="btn-primary text-sm">
          <Sparkles className="w-4 h-4" /> Plan New Trip
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800/50 rounded-xl mb-8 w-fit overflow-x-auto">
        {(['overview', 'history', 'trips', 'settings'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all capitalize whitespace-nowrap ${
              activeTab === tab
                ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {tab === 'history' ? `History (${tripHistory.length})` : tab === 'trips' ? `Saved (${savedTrips.length})` : tab}
          </button>
        ))}
      </div>

      {/* ━━━ OVERVIEW TAB ━━━ */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Stats grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={History} label="Trips Planned" value={String(tripHistory.length)} color="text-blue-500 bg-blue-50 dark:bg-blue-950/30" />
            <StatCard icon={Bookmark} label="Trips Saved" value={String(savedTrips.length)} color="text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30" />
            <StatCard icon={TrendingUp} label="Total Spent" value={`₹${totalBudget.toLocaleString()}`} color="text-amber-500 bg-amber-50 dark:bg-amber-950/30" />
            <StatCard icon={Star} label="Destinations" value={String(new Set([...savedTrips, ...tripHistory].map(t => t.destination)).size)} color="text-purple-500 bg-purple-50 dark:bg-purple-950/30" />
          </div>

          {/* Recent Trips + Recent Searches row */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Recent trips */}
            <div className="lg:col-span-2">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Trips</h3>
              {savedTrips.length === 0 ? (
                <div className="card p-8 text-center">
                  <Bookmark className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">No trips yet. Plan your first adventure!</p>
                  <button onClick={onPlanTrip} className="btn-primary text-sm mt-4">Start Planning</button>
                </div>
              ) : (
                <div className="space-y-3">
                  {savedTrips.slice(0, 4).map(trip => (
                    <div key={trip.id} className="card p-4 flex items-center gap-4 group cursor-pointer" onClick={() => onViewTrip(trip)}>
                      <div className="w-14 h-14 rounded-xl bg-gray-100 dark:bg-gray-800 overflow-hidden shrink-0">
                        {trip.itinerary?.[0]?.places?.[0]?.image ? (
                          <img src={trip.itinerary[0].places[0].image} className="w-full h-full object-cover" alt="" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-400 to-indigo-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-gray-900 dark:text-white truncate">{trip.destination}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-3 mt-0.5">
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {trip.days}d</span>
                          <span>₹{trip.cost?.total?.toLocaleString()}</span>
                          {trip.dateSaved && <span>{trip.dateSaved}</span>}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Recent searches */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Searches</h3>
                <div className="card p-4">
                  {recentSearches.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-4">No recent searches</p>
                  ) : (
                    <div className="space-y-2">
                      {recentSearches.map((s, i) => (
                        <div key={i} className="flex items-center gap-3 py-1.5">
                          <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span className="text-sm text-gray-700 dark:text-gray-300 truncate">{s}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Budget summary */}
              {savedTrips.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Budget Split</h3>
                  <div className="card p-4 space-y-3">
                    {[
                      { label: 'Hotels', value: savedTrips.reduce((s, t) => s + (t.cost?.hotel || 0), 0), color: 'bg-amber-500' },
                      { label: 'Transport', value: savedTrips.reduce((s, t) => s + (t.cost?.travel || 0), 0), color: 'bg-blue-500' },
                      { label: 'Food', value: savedTrips.reduce((s, t) => s + (t.cost?.food || 0), 0), color: 'bg-emerald-500' },
                    ].map((item, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600 dark:text-gray-400 font-medium">{item.label}</span>
                          <span className="text-gray-900 dark:text-white font-bold">₹{item.value.toLocaleString()}</span>
                        </div>
                        <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                          <div className={`h-full ${item.color} rounded-full transition-all`} style={{ width: `${totalBudget ? (item.value / totalBudget) * 100 : 0}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Recommendations */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recommended for You</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {recommendations.map((r, i) => (
                <div key={i} className="group cursor-pointer rounded-xl overflow-hidden relative" onClick={onPlanTrip}>
                  <div className="aspect-[3/2] overflow-hidden">
                    <img src={r.image} alt={r.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <span className="badge bg-white/20 text-white backdrop-blur-sm text-[10px] mb-1">{r.tag}</span>
                    <h4 className="font-bold text-white">{r.name}</h4>
                    <p className="text-white/60 text-xs">{r.country}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ━━━ TRIPS TAB ━━━ */}
      {activeTab === 'trips' && (
        <div className="animate-in fade-in duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">All Trips ({savedTrips.length})</h3>
          </div>
          {savedTrips.length === 0 ? (
            <div className="card p-12 text-center">
              <MapPin className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No trips yet</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Start planning your first trip!</p>
              <button onClick={onPlanTrip} className="btn-primary text-sm">Plan a Trip</button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {savedTrips.map(trip => (
                <div key={trip.id} className="card overflow-hidden group flex flex-col">
                  <div className="h-36 bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
                    {trip.itinerary?.[0]?.places?.[0]?.image ? (
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
                        ₹{trip.cost?.total?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex border-t border-gray-100 dark:border-gray-800">
                    <button onClick={() => onViewTrip(trip)} className="flex-1 py-2.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors flex items-center justify-center gap-1">
                      <Eye className="w-3.5 h-3.5" /> View
                    </button>
                    <button className="flex-1 py-2.5 text-xs font-semibold text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-x border-gray-100 dark:border-gray-800 flex items-center justify-center gap-1">
                      <Share2 className="w-3.5 h-3.5" /> Share
                    </button>
                    <button onClick={() => onDeleteTrip(trip.id)} className="flex-1 py-2.5 text-xs font-semibold text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors flex items-center justify-center gap-1">
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ━━━ HISTORY TAB ━━━ */}
      {activeTab === 'history' && (
        <div className="animate-in fade-in duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Trip History</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">All trips you've ever planned — automatically tracked</p>
            </div>
          </div>
          {tripHistory.length === 0 ? (
            <div className="card p-12 text-center">
              <History className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No history yet</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Plan your first trip and it will appear here automatically!</p>
              <button onClick={onPlanTrip} className="btn-primary text-sm">Plan a Trip</button>
            </div>
          ) : (
            <div className="space-y-3">
              {tripHistory.map((trip, index) => (
                <div key={trip.id || index} className="card p-4 flex items-center gap-4 group hover:-translate-y-0.5 transition-all cursor-pointer" onClick={() => onViewTrip(trip)}>
                  <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 overflow-hidden shrink-0">
                    {trip.itinerary?.[0]?.places?.[0]?.image ? (
                      <img src={trip.itinerary[0].places[0].image} className="w-full h-full object-cover" alt="" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-gray-900 dark:text-white truncate">{trip.destination}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-3 mt-0.5">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {trip.days} days</span>
                      <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" /> ₹{trip.cost?.total?.toLocaleString()}</span>
                      {trip.dateSaved && <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {trip.dateSaved}</span>}
                    </div>
                  </div>
                  {savedTrips.find(s => s.id === trip.id) ? (
                    <span className="badge bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-0 text-[10px]">Saved ✓</span>
                  ) : (
                    <span className="badge bg-gray-100 dark:bg-gray-800 text-gray-500 border-0 text-[10px]">Not saved</span>
                  )}
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors shrink-0" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ━━━ SETTINGS TAB ━━━ */}
      {activeTab === 'settings' && (
        <div className="max-w-2xl animate-in fade-in duration-300 space-y-6">
          <div className="card p-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Profile</h3>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                {currentUser?.photoURL ? (
                  <img src={currentUser.photoURL} className="w-full h-full object-cover rounded-2xl" alt="" />
                ) : (
                  <User className="w-7 h-7" />
                )}
              </div>
              <div>
                <div className="font-bold text-gray-900 dark:text-white text-lg">{userName}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{currentUser?.email}</div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-3 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Display Name</span>
                </div>
                <span className="text-sm text-gray-500">{currentUser?.displayName || 'Not set'}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Account Type</span>
                </div>
                <span className="badge bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border-0">Free Plan</span>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Account Actions</h3>
            <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors font-medium text-sm">
              <LogOut className="w-4 h-4" /> Sign out of your account
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
