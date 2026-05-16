import { useState, useEffect } from 'react';
import { 
  MapPin, Download, Share2, Bookmark, Calendar, 
  BedDouble, Activity, CheckCircle2, Star,
  Car, Coffee, CreditCard, LayoutDashboard, Clock, CloudSun
} from 'lucide-react';
// @ts-ignore
import html2pdf from 'html2pdf.js';
import type { TripData } from '../types';

const TABS = [
  { id: 'itinerary', icon: LayoutDashboard, label: 'Itinerary' },
  { id: 'hotels', icon: BedDouble, label: 'Hotels' },
  { id: 'activities', icon: Activity, label: 'Activities' },
  { id: 'cost', icon: CreditCard, label: 'Budget' }
] as const;

export const TripResults = ({ tripData, onSave }: { tripData: TripData, onSave: (trip: TripData) => void }) => {
  const [activeTab, setActiveTab] = useState<'itinerary' | 'hotels' | 'activities' | 'cost'>('itinerary');
  const [weather, setWeather] = useState<{temp: number, desc: string} | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(tripData.destination)}&count=1`);
        const geoData = await geoRes.json();
        if (geoData.results && geoData.results.length > 0) {
          const { latitude, longitude } = geoData.results[0];
          const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
          const weatherData = await weatherRes.json();
          if (weatherData.current_weather) {
            setWeather({
              temp: weatherData.current_weather.temperature,
              desc: weatherData.current_weather.weathercode <= 3 ? 'Clear' : 'Cloudy/Rain'
            });
          }
        }
      } catch (err) {
        console.error("Failed to fetch weather", err);
      }
    };
    if (tripData.destination) fetchWeather();
  }, [tripData.destination]);

  const downloadPDF = () => {
    const element = document.getElementById('trip-content');
    if (!element) return;
    const opt = {
      margin:       0.3,
      filename:     `${tripData.destination}_Itinerary.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  const shareOnWhatsApp = () => {
    const text = `🗺️ *My Trip to ${tripData.destination}*\n⏳ *Duration:* ${tripData.days} Days\n💰 *Budget:* ₹${tripData.cost.total.toLocaleString()}\n\nPlanned via *TripGenie AI*!`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-8" id="trip-content">
      {/* Header */}
      <div className="card p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="badge bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-400 border border-green-200/60 dark:border-green-800/40 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> AI Plan Ready
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
              <MapPin className="w-7 h-7 text-blue-600" /> {tripData.destination}
            </h2>
            <div className="flex flex-wrap items-center gap-3 mt-4">
              <span className="badge bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-0">
                <Calendar className="w-3.5 h-3.5" /> {tripData.days} Days
              </span>
              {tripData.startDate && (
                <span className="badge bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border-0">
                  <Calendar className="w-3.5 h-3.5" /> {new Date(tripData.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              )}
              <span className="badge bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-0">
                <CreditCard className="w-3.5 h-3.5" /> Est. ₹{tripData.cost.total.toLocaleString()}
              </span>
              {weather && (
                <span className="badge bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-0">
                  <CloudSun className="w-3.5 h-3.5" /> {weather.temp}°C ({weather.desc})
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2" data-html2canvas-ignore="true">
            <button onClick={shareOnWhatsApp} className="btn-ghost text-sm border border-gray-200 dark:border-gray-700 rounded-xl hover:text-green-600 dark:hover:text-green-400 hover:border-green-500 transition-colors">
              <Share2 className="w-4 h-4" /> Share
            </button>
            <button onClick={downloadPDF} className="btn-ghost text-sm border border-gray-200 dark:border-gray-700 rounded-xl hover:text-red-500 dark:hover:text-red-400 hover:border-red-500 transition-colors">
              <Download className="w-4 h-4" /> PDF
            </button>
            <button onClick={() => onSave(tripData)} className="btn-primary text-sm">
              <Bookmark className="w-4 h-4" /> Save Trip
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800/50 rounded-xl sticky top-16 z-40 overflow-x-auto no-scrollbar">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="animate-in fade-in duration-300">
        {/* ITINERARY */}
        {activeTab === 'itinerary' && (
          <div className="space-y-6">
            {tripData.itinerary.map((dayPlan) => (
              <div key={dayPlan.day} className="card overflow-hidden">
                {/* Day header with image */}
                <div className="relative h-44 sm:h-52 overflow-hidden">
                  {dayPlan.places[0]?.image ? (
                    <img src={dayPlan.places[0].image} className="w-full h-full object-cover" alt={dayPlan.title || 'Day highlight'} />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between">
                    <div>
                      <div className="badge bg-white/20 text-white backdrop-blur-sm text-xs mb-2">Day {dayPlan.day}</div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white">{dayPlan.title || `Day ${dayPlan.day}`}</h3>
                      {dayPlan.subtitle && <p className="text-white/70 text-sm mt-1">{dayPlan.subtitle}</p>}
                    </div>
                  </div>
                </div>

                {/* Places timeline */}
                <div className="p-6 space-y-0">
                  {dayPlan.places.map((place, i) => {
                    const periodColors: Record<string, string> = {
                      morning: 'text-amber-600 bg-amber-50 dark:bg-amber-950/30 dark:text-amber-400',
                      afternoon: 'text-blue-600 bg-blue-50 dark:bg-blue-950/30 dark:text-blue-400',
                      evening: 'text-purple-600 bg-purple-50 dark:bg-purple-950/30 dark:text-purple-400',
                    };
                    return (
                      <div key={i} className="flex gap-4 group">
                        {/* Timeline connector */}
                        <div className="flex flex-col items-center pt-1">
                          <div className="w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-blue-100 dark:ring-blue-950 shrink-0" />
                          {i < dayPlan.places.length - 1 && <div className="w-px flex-1 bg-gray-200 dark:bg-gray-700 my-1" />}
                        </div>
                        {/* Image */}
                        <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-xl bg-gray-100 dark:bg-gray-800 shrink-0 overflow-hidden shadow-sm">
                          {place.image ? (
                            <img src={place.image} alt={place.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <MapPin className="w-8 h-8 text-gray-300 dark:text-gray-600" />
                            </div>
                          )}
                        </div>
                        {/* Content */}
                        <div className="pb-6 flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            {place.time && (
                              <span className="text-xs font-semibold text-gray-400 flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {place.time}
                              </span>
                            )}
                            {place.period && (
                              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${periodColors[place.period] || ''}`}>
                                {place.period}
                              </span>
                            )}
                          </div>
                          <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{place.name}</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mt-0.5">{place.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* HOTELS */}
        {activeTab === 'hotels' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {tripData.hotels.map((hotel, i) => (
              <div key={i} className="card overflow-hidden group">
                <div className="h-44 bg-gray-100 dark:bg-gray-800 overflow-hidden relative">
                  {hotel.image ? (
                    <img src={hotel.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={hotel.name} />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-amber-400 to-orange-500" />
                  )}
                  <div className="absolute top-3 right-3 badge bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-gray-900 dark:text-white border-0 shadow-sm">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-current" /> {hotel.rating}
                  </div>
                </div>
                <div className="p-5">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-3 line-clamp-1">{hotel.name}</h4>
                  <div className="flex items-end justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
                    <div>
                      <span className="text-2xl font-extrabold text-gray-900 dark:text-white">₹{Math.round(hotel.price / tripData.days).toLocaleString()}</span>
                      <span className="text-xs text-gray-500 ml-1">/ night</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-400">₹{hotel.price.toLocaleString()} total</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ACTIVITIES */}
        {activeTab === 'activities' && (
          <div className="grid md:grid-cols-2 gap-4">
            {tripData.activities.map((activity, i) => (
              <div key={i} className="card p-5 flex gap-4 hover:-translate-y-0.5 transition-all duration-200">
                <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/30 text-purple-500 flex items-center justify-center shrink-0">
                  <Activity className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="badge bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-0 text-[10px] mb-2">
                    {activity.type}
                  </span>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-1">{activity.name}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">{activity.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* COST */}
        {activeTab === 'cost' && (
          <div className="space-y-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Cost', value: tripData.cost.total, icon: CreditCard, color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/30' },
                { label: 'Accommodation', value: tripData.cost.hotel, icon: BedDouble, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/30' },
                { label: 'Transport', value: tripData.cost.travel, icon: Car, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/30' },
                { label: 'Food & Leisure', value: tripData.cost.food, icon: Coffee, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30' },
              ].map((c, i) => (
                <div key={i} className="card p-5 text-center hover:-translate-y-0.5 transition-all">
                  <div className={`w-11 h-11 rounded-xl ${c.color} flex items-center justify-center mx-auto mb-3`}>
                    <c.icon className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{c.label}</div>
                  <div className="text-2xl font-extrabold text-gray-900 dark:text-white">₹{c.value.toLocaleString()}</div>
                </div>
              ))}
            </div>

            {/* Budget bar */}
            <div className="card p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-gray-900 dark:text-white">Budget Usage</span>
                <span className="text-sm font-semibold text-gray-500">
                  ₹{tripData.cost.total.toLocaleString()} / ₹{tripData.budget.toLocaleString()}
                </span>
              </div>
              <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${
                    tripData.cost.total > tripData.budget
                      ? 'bg-red-500'
                      : tripData.cost.total > tripData.budget * 0.8
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(100, (tripData.cost.total / tripData.budget) * 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-2">
                {tripData.cost.total <= tripData.budget
                  ? `✅ Under budget by ₹${(tripData.budget - tripData.cost.total).toLocaleString()}`
                  : `⚠️ Over budget by ₹${(tripData.cost.total - tripData.budget).toLocaleString()}`
                }
              </p>
            </div>

            <div className="card p-5 border-blue-100 dark:border-blue-900/40 bg-blue-50/50 dark:bg-blue-950/20">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                💡 <strong>Tip:</strong> This breakdown adjusts based on your selected interests. Food-lovers get higher dining allocations, adventure-seekers get more activity budget.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
