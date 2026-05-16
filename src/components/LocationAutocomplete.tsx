import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapPin, Loader2, Clock, Globe, Building2, Mountain, Search, Navigation, X } from 'lucide-react';

// ─── Types ───
interface LocationSuggestion {
  id: string;
  name: string;
  displayName: string;
  type: 'country' | 'state' | 'city' | 'place';
  country?: string;
  state?: string;
}

interface LocationAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

// ─── Constants ───
const RECENT_KEY = 'tripgenie_recent_searches';
const MAX_RECENT = 5;
const DEBOUNCE_MS = 300;

// ─── Popular quick picks shown on focus ───
const POPULAR: LocationSuggestion[] = [
  { id: 'pop-1', name: 'Tokyo', displayName: 'Tokyo, Japan', type: 'city', country: 'Japan' },
  { id: 'pop-2', name: 'Paris', displayName: 'Paris, France', type: 'city', country: 'France' },
  { id: 'pop-3', name: 'Bali', displayName: 'Bali, Indonesia', type: 'place', country: 'Indonesia' },
  { id: 'pop-4', name: 'Dubai', displayName: 'Dubai, UAE', type: 'city', country: 'UAE' },
  { id: 'pop-5', name: 'New York', displayName: 'New York, United States', type: 'city', country: 'United States' },
];

// ─── Type icon helper ───
const TypeIcon = ({ type }: { type: LocationSuggestion['type'] }) => {
  switch (type) {
    case 'country': return <Globe className="w-4 h-4 text-blue-500" />;
    case 'state': return <Building2 className="w-4 h-4 text-emerald-500" />;
    case 'city': return <MapPin className="w-4 h-4 text-orange-500" />;
    case 'place': return <Mountain className="w-4 h-4 text-purple-500" />;
  }
};

// ─── Classify Nominatim result ───
function classifyType(result: any): LocationSuggestion['type'] {
  const t = result.type || '';
  const cls = result.class || '';
  if (t === 'country' || cls === 'boundary' && t === 'administrative' && !result.address?.state) return 'country';
  if (t === 'state' || t === 'province' || t === 'region') return 'state';
  if (t === 'city' || t === 'town' || t === 'village' || t === 'municipality' || t === 'hamlet') return 'city';
  return 'place';
}

// ─── Parse Nominatim results ───
function parseResults(data: any[]): LocationSuggestion[] {
  const seen = new Set<string>();
  return data
    .map((r, i) => {
      const addr = r.address || {};
      const name = addr.city || addr.town || addr.village || addr.state || addr.country || r.name || '';
      const parts: string[] = [];
      if (addr.city || addr.town || addr.village) parts.push(addr.city || addr.town || addr.village);
      if (addr.state && parts[0] !== addr.state) parts.push(addr.state);
      if (addr.country) parts.push(addr.country);
      const displayName = parts.length > 0 ? parts.join(', ') : r.display_name.split(',').slice(0, 3).join(',').trim();
      const key = displayName.toLowerCase();
      if (seen.has(key)) return null;
      seen.add(key);
      return {
        id: `nom-${r.place_id || i}`,
        name: name || displayName.split(',')[0].trim(),
        displayName,
        type: classifyType(r),
        country: addr.country,
        state: addr.state,
      };
    })
    .filter(Boolean) as LocationSuggestion[];
}

// ─── Recent searches ───
function getRecent(): LocationSuggestion[] {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
  } catch { return []; }
}

function saveRecent(item: LocationSuggestion) {
  const recent = getRecent().filter(r => r.displayName !== item.displayName);
  recent.unshift(item);
  localStorage.setItem(RECENT_KEY, JSON.stringify(recent.slice(0, MAX_RECENT)));
}

// ─── Main Component ───
export const LocationAutocomplete: React.FC<LocationAutocompleteProps> = ({
  value, onChange, placeholder = 'Search country, city, or destination…', autoFocus = false
}) => {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [showRecent, setShowRecent] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const abortRef = useRef<AbortController>();

  // Sync external value
  useEffect(() => { setQuery(value); }, [value]);

  // Click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Fetch suggestions (debounced)
  const fetchSuggestions = useCallback(async (q: string) => {
    if (q.trim().length < 2) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    // Cancel previous request
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    setLoading(true);
    try {
      const resp = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=8&addressdetails=1&accept-language=en`,
        { signal: abortRef.current.signal, headers: { 'User-Agent': 'TripGenie/1.0' } }
      );
      const data = await resp.json();
      const parsed = parseResults(data).slice(0, 6);
      setSuggestions(parsed);
      setActiveIndex(-1);
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setSuggestions([]);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    onChange(val);
    setIsOpen(true);
    setShowRecent(false);

    // Debounce API call
    clearTimeout(debounceRef.current);
    if (val.trim().length >= 2) {
      setLoading(true);
      debounceRef.current = setTimeout(() => fetchSuggestions(val), DEBOUNCE_MS);
    } else {
      setSuggestions([]);
      setLoading(false);
      if (val.trim().length === 0) setShowRecent(true);
    }
  };

  // Select suggestion
  const selectSuggestion = (s: LocationSuggestion) => {
    setQuery(s.name);
    onChange(s.name);
    setIsOpen(false);
    setSuggestions([]);
    saveRecent(s);
  };

  // Handle focus
  const handleFocus = () => {
    setIsOpen(true);
    if (query.trim().length === 0) {
      setShowRecent(true);
    }
  };

  // Clear input
  const clearInput = () => {
    setQuery('');
    onChange('');
    setSuggestions([]);
    setShowRecent(true);
    setIsOpen(true);
    inputRef.current?.focus();
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const items = getCurrentItems();
    if (!isOpen || items.length === 0) {
      if (e.key === 'ArrowDown') { setIsOpen(true); handleFocus(); }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex(prev => (prev + 1) % items.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex(prev => (prev - 1 + items.length) % items.length);
        break;
      case 'Enter':
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < items.length) {
          selectSuggestion(items[activeIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  // Determine what to show in dropdown
  const getCurrentItems = (): LocationSuggestion[] => {
    if (showRecent && query.trim().length === 0) {
      const recent = getRecent();
      return recent.length > 0 ? recent : POPULAR;
    }
    return suggestions;
  };

  const currentItems = getCurrentItems();
  const showDropdown = isOpen && (currentItems.length > 0 || loading || (query.trim().length >= 2 && !loading));

  return (
    <div ref={containerRef} className="relative">
      {/* Input */}
      <div className="relative group">
        <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoFocus={autoFocus}
          autoComplete="off"
          className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl pl-10 pr-10 py-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm text-gray-900 dark:text-white placeholder:text-gray-400"
        />
        {/* Clear / Loading indicator */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {loading ? (
            <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
          ) : query.length > 0 ? (
            <button type="button" onClick={clearInput} className="p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <Search className="w-4 h-4 text-gray-300 dark:text-gray-600" />
          )}
        </div>
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200">
          {/* Section header */}
          {showRecent && query.trim().length === 0 && (
            <div className="px-3.5 pt-3 pb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                {getRecent().length > 0 ? 'Recent Searches' : 'Popular Destinations'}
              </span>
            </div>
          )}

          {/* Loading skeleton */}
          {loading && suggestions.length === 0 && (
            <div className="p-2 space-y-1">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-lg">
                  <div className="skeleton w-4 h-4 rounded-full shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="skeleton h-3.5 w-2/3 rounded" />
                    <div className="skeleton h-2.5 w-1/3 rounded" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Suggestions list */}
          {currentItems.length > 0 && (
            <div className="p-1.5 max-h-[280px] overflow-y-auto custom-scrollbar" role="listbox">
              {currentItems.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  role="option"
                  aria-selected={i === activeIndex}
                  onClick={() => selectSuggestion(s)}
                  onMouseEnter={() => setActiveIndex(i)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                    i === activeIndex
                      ? 'bg-blue-50 dark:bg-blue-950/40'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    i === activeIndex
                      ? 'bg-blue-100 dark:bg-blue-900/40'
                      : 'bg-gray-100 dark:bg-gray-800'
                  }`}>
                    {showRecent && query.trim().length === 0 && getRecent().length > 0 ? (
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                    ) : (
                      <TypeIcon type={s.type} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">{s.name}</div>
                    {s.displayName !== s.name && (
                      <div className="text-xs text-gray-400 dark:text-gray-500 truncate">{s.displayName}</div>
                    )}
                  </div>
                  <span className={`text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-md ${
                    s.type === 'country' ? 'text-blue-500 bg-blue-50 dark:bg-blue-950/30' :
                    s.type === 'state' ? 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30' :
                    s.type === 'city' ? 'text-orange-500 bg-orange-50 dark:bg-orange-950/30' :
                    'text-purple-500 bg-purple-50 dark:bg-purple-950/30'
                  }`}>
                    {s.type}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* No results */}
          {!loading && query.trim().length >= 2 && suggestions.length === 0 && !showRecent && (
            <div className="px-4 py-6 text-center">
              <Search className="w-6 h-6 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No destinations found</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Try a different search term</p>
            </div>
          )}

          {/* Footer hint */}
          {currentItems.length > 0 && (
            <div className="px-3.5 py-2 border-t border-gray-100 dark:border-gray-800 flex items-center gap-4 text-[10px] text-gray-400 dark:text-gray-500">
              <span><kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-[9px] font-mono">↑↓</kbd> navigate</span>
              <span><kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-[9px] font-mono">↵</kbd> select</span>
              <span><kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-[9px] font-mono">esc</kbd> close</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
