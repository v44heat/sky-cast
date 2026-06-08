import { useState, useRef, useEffect, useCallback } from 'react';
import { Search, X, Clock, MapPin, Loader2 } from 'lucide-react';
import { useGeocoding } from '@/hooks/useWeather';
import { useDebounce, useRecentSearches } from '@/hooks/useLocalStorage';
import { useWeatherContext } from '@/context/WeatherContext';
import { cn } from '@/utils/helpers';
import type { GeocodingResult } from '@/types/weather';

interface SearchBarProps {
  onClose?: () => void;
  className?: string;
}

export function SearchBar({ onClose, className }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebounce(query, 350);
  const { setCity, setCoords } = useWeatherContext();
  const { recents, addRecent, clearRecents } = useRecentSearches();

  const { data: suggestions, isLoading: suggestionsLoading } = useGeocoding(
    debouncedQuery,
    debouncedQuery.length >= 2
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = useCallback(
    (result: GeocodingResult) => {
      const label = result.state
        ? `${result.name}, ${result.state}, ${result.country}`
        : `${result.name}, ${result.country}`;
      setCity(result.name);
      setCoords({ lat: result.lat, lon: result.lon });
      addRecent(result.name);
      setQuery('');
      setIsOpen(false);
      onClose?.();
    },
    [setCity, setCoords, addRecent, onClose]
  );

  const handleRecentSelect = useCallback(
    (cityName: string) => {
      setCity(cityName);
      setCoords(null as any); // will re-geocode from city name
      addRecent(cityName);
      setQuery('');
      setIsOpen(false);
      onClose?.();
    },
    [setCity, setCoords, addRecent, onClose]
  );

  const showRecents = query.length < 2 && recents.length > 0;
  const showSuggestions = query.length >= 2;

  return (
    <div ref={containerRef} className={cn('relative w-full', className)}>
      {/* Input */}
      <div className="relative flex items-center">
        <Search className="absolute left-3 h-4 w-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search city..."
          aria-label="Search for a city"
          className={cn(
            'w-full rounded-xl border py-2.5 pl-9 pr-9 text-sm outline-none transition',
            'bg-white/70 dark:bg-navy-700/70 border-white/80 dark:border-white/10',
            'text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500',
            'focus:border-sky-400 dark:focus:border-sky-500 focus:ring-2 focus:ring-sky-400/20',
            'backdrop-blur-sm'
          )}
        />
        {suggestionsLoading && (
          <Loader2 className="absolute right-3 h-4 w-4 animate-spin text-sky-500" />
        )}
        {query && !suggestionsLoading && (
          <button
            onClick={() => { setQuery(''); setIsOpen(false); }}
            className="absolute right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (showRecents || (showSuggestions && suggestions && suggestions.length > 0)) && (
        <div className={cn(
          'absolute top-full left-0 right-0 z-50 mt-2 overflow-hidden rounded-2xl shadow-xl',
          'bg-white/95 dark:bg-navy-800/95 backdrop-blur-xl',
          'border border-white/80 dark:border-white/10',
          'animate-fade-in'
        )}>
          {/* Recent searches */}
          {showRecents && (
            <div>
              <div className="flex items-center justify-between px-4 pt-3 pb-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                  Recent
                </span>
                <button
                  onClick={clearRecents}
                  className="text-xs text-sky-500 hover:text-sky-600 transition"
                >
                  Clear
                </button>
              </div>
              {recents.map((r) => (
                <button
                  key={r.timestamp}
                  onClick={() => handleRecentSelect(r.query)}
                  className={cn(
                    'flex w-full items-center gap-3 px-4 py-2.5 text-sm text-left',
                    'hover:bg-sky-50 dark:hover:bg-navy-700 transition'
                  )}
                >
                  <Clock className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                  <span className="text-gray-700 dark:text-gray-200">{r.query}</span>
                </button>
              ))}
            </div>
          )}

          {/* Autocomplete suggestions */}
          {showSuggestions && suggestions && suggestions.length > 0 && (
            <div className={showRecents ? 'border-t border-gray-100 dark:border-white/5 pt-1' : ''}>
              {suggestions.map((result, i) => (
                <button
                  key={`${result.lat}-${result.lon}-${i}`}
                  onClick={() => handleSelect(result)}
                  className={cn(
                    'flex w-full items-center gap-3 px-4 py-2.5 text-sm text-left',
                    'hover:bg-sky-50 dark:hover:bg-navy-700 transition',
                    i === suggestions.length - 1 ? 'rounded-b-2xl' : ''
                  )}
                >
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-sky-500" />
                  <div>
                    <span className="font-medium text-gray-800 dark:text-white">{result.name}</span>
                    <span className="ml-1.5 text-gray-400 dark:text-gray-500">
                      {result.state ? `${result.state}, ` : ''}{result.country}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {showSuggestions && suggestions && suggestions.length === 0 && !suggestionsLoading && (
            <div className="px-4 py-5 text-center text-sm text-gray-400 dark:text-gray-500">
              No cities found for "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}
