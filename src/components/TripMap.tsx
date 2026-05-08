import { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { TripData } from '../types';

// Fix default marker icon issue with bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Day color palette
const DAY_COLORS = [
  '#3b82f6', // blue
  '#f59e0b', // amber
  '#10b981', // emerald
  '#ef4444', // red
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#f97316', // orange
  '#6366f1', // indigo
  '#14b8a6', // teal
];

// Custom colored marker
const createDayIcon = (dayNum: number, color: string) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      background: ${color};
      width: 28px; height: 28px;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      color: white; font-weight: 800; font-size: 12px;
      border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.4);
    ">${dayNum}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
};

// Auto-fit map bounds when active day changes
const FitBounds = ({ bounds }: { bounds: L.LatLngBoundsExpression }) => {
  const map = useMap();
  useMemo(() => {
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
  }, [bounds, map]);
  return null;
};

interface TripMapProps {
  tripData: TripData;
}

export const TripMap = ({ tripData }: TripMapProps) => {
  const [activeDay, setActiveDay] = useState<number | null>(null);

  // Get all coordinates for bounds calculation
  const allCoords = tripData.itinerary.flatMap(d => d.places.map(p => [p.lat, p.lng] as [number, number]));
  const center: [number, number] = allCoords.length > 0
    ? [allCoords.reduce((s, c) => s + c[0], 0) / allCoords.length, allCoords.reduce((s, c) => s + c[1], 0) / allCoords.length]
    : [28.6139, 77.2090];

  // Determine which days to show
  const visibleDays = activeDay !== null 
    ? tripData.itinerary.filter(d => d.day === activeDay) 
    : tripData.itinerary;

  // Bounds for visible markers
  const visibleCoords = visibleDays.flatMap(d => d.places.map(p => [p.lat, p.lng] as [number, number]));
  const bounds: L.LatLngBoundsExpression = visibleCoords.length > 1 
    ? visibleCoords as [number, number][] 
    : [[center[0] - 0.02, center[1] - 0.02], [center[0] + 0.02, center[1] + 0.02]];

  return (
    <div className="mt-12 space-y-4">
      <h3 className="text-2xl font-black flex items-center gap-3 text-gray-900 dark:text-white">
        🗺️ Route Map
      </h3>

      {/* Day selector tabs */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setActiveDay(null)}
          className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
            activeDay === null
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-lg scale-105'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          All Days
        </button>
        {tripData.itinerary.map((dayPlan) => {
          const color = DAY_COLORS[(dayPlan.day - 1) % DAY_COLORS.length];
          return (
            <button
              key={dayPlan.day}
              onClick={() => setActiveDay(dayPlan.day)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${
                activeDay === dayPlan.day
                  ? 'text-white shadow-lg scale-105'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
              style={activeDay === dayPlan.day ? { background: color } : {}}
            >
              <span
                className="w-3 h-3 rounded-full inline-block"
                style={{ background: color }}
              />
              Day {dayPlan.day}
            </button>
          );
        })}
      </div>

      {/* Map container */}
      <div className="rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-xl" style={{ height: '450px' }}>
        <MapContainer
          center={center}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />

          <FitBounds bounds={bounds} />

          {/* Render markers and routes for visible days */}
          {visibleDays.map((dayPlan) => {
            const color = DAY_COLORS[(dayPlan.day - 1) % DAY_COLORS.length];
            const positions = dayPlan.places.map(p => [p.lat, p.lng] as [number, number]);
            return (
              <div key={dayPlan.day}>
                {/* Dotted polyline connecting areas */}
                <Polyline
                  positions={positions}
                  pathOptions={{
                    color: color,
                    weight: 3,
                    dashArray: '10, 10',
                    opacity: 0.9,
                  }}
                />

                {/* Markers for each place */}
                {dayPlan.places.map((place, idx) => (
                  <Marker
                    key={`${dayPlan.day}-${idx}`}
                    position={[place.lat, place.lng]}
                    icon={createDayIcon(dayPlan.day, color)}
                  >
                    <Popup>
                      <div style={{ minWidth: 160 }}>
                        <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 4, color: color }}>
                          Day {dayPlan.day} • Stop {idx + 1}
                        </div>
                        <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 2 }}>{place.name}</div>
                        <div style={{ fontSize: 12, color: '#666' }}>{place.description}</div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </div>
            );
          })}
        </MapContainer>
      </div>

      {/* Legend */}
      {activeDay === null && (
        <div className="flex flex-wrap gap-4 text-sm font-medium text-gray-500 dark:text-gray-400 pt-2">
          {tripData.itinerary.map(dayPlan => {
            const color = DAY_COLORS[(dayPlan.day - 1) % DAY_COLORS.length];
            return (
              <div key={dayPlan.day} className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ background: color }} />
                <span>Day {dayPlan.day} route</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
