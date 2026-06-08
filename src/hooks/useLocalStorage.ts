import { useState, useCallback } from 'react';
import { getFromStorage, setToStorage } from '@/utils/helpers';
import type { FavoriteCity, RecentSearch } from '@/types/weather';

// ─── Favorites ────────────────────────────────────────────────────────────────

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteCity[]>(() =>
    getFromStorage<FavoriteCity[]>('skycast-favorites', [])
  );

  const addFavorite = useCallback((city: FavoriteCity) => {
    setFavorites((prev) => {
      if (prev.find((f) => f.id === city.id)) return prev;
      const next = [...prev, city];
      setToStorage('skycast-favorites', next);
      return next;
    });
  }, []);

  const removeFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = prev.filter((f) => f.id !== id);
      setToStorage('skycast-favorites', next);
      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (id: string) => favorites.some((f) => f.id === id),
    [favorites]
  );

  return { favorites, addFavorite, removeFavorite, isFavorite };
}

// ─── Recent Searches ──────────────────────────────────────────────────────────

export function useRecentSearches() {
  const [recents, setRecents] = useState<RecentSearch[]>(() =>
    getFromStorage<RecentSearch[]>('skycast-recents', [])
  );

  const addRecent = useCallback((query: string) => {
    setRecents((prev) => {
      const filtered = prev.filter((r) => r.query.toLowerCase() !== query.toLowerCase());
      const next = [{ query, timestamp: Date.now() }, ...filtered].slice(0, 8);
      setToStorage('skycast-recents', next);
      return next;
    });
  }, []);

  const clearRecents = useCallback(() => {
    setRecents([]);
    setToStorage('skycast-recents', []);
  }, []);

  return { recents, addRecent, clearRecents };
}

// ─── Geolocation ─────────────────────────────────────────────────────────────

export function useGeolocation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getLocation = useCallback(
    (onSuccess: (lat: number, lon: number) => void) => {
      if (!navigator.geolocation) {
        setError('Geolocation is not supported by your browser.');
        return;
      }
      setLoading(true);
      setError(null);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLoading(false);
          onSuccess(pos.coords.latitude, pos.coords.longitude);
        },
        (err) => {
          setLoading(false);
          setError(
            err.code === err.PERMISSION_DENIED
              ? 'Location permission denied. Please allow access in your browser settings.'
              : 'Unable to retrieve your location.'
          );
        },
        { timeout: 10000 }
      );
    },
    []
  );

  return { getLocation, loading, error };
}

// ─── Debounce ─────────────────────────────────────────────────────────────────

import { useEffect, useRef } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
