import { useQuery } from '@tanstack/react-query';
import {
  fetchCurrentWeather,
  fetchCurrentWeatherByCoords,
  fetchForecast,
  fetchAirQuality,
  geocodeCity,
} from '@/services/weatherApi';
import { useSettings } from '@/context/SettingsContext';
import type { TemperatureUnit } from '@/types/weather';

// ─── Current Weather ─────────────────────────────────────────────────────────

export function useCurrentWeather(city: string, enabled = true) {
  const { settings } = useSettings();
  return useQuery({
    queryKey: ['currentWeather', city, settings.temperatureUnit],
    queryFn: () => fetchCurrentWeather(city, settings.temperatureUnit),
    enabled: enabled && !!city,
    staleTime: 5 * 60 * 1000, // 5 min
    retry: 2,
  });
}

export function useCurrentWeatherByCoords(
  lat: number | null,
  lon: number | null,
  enabled = true
) {
  const { settings } = useSettings();
  return useQuery({
    queryKey: ['currentWeatherCoords', lat, lon, settings.temperatureUnit],
    queryFn: () => fetchCurrentWeatherByCoords(lat!, lon!, settings.temperatureUnit),
    enabled: enabled && lat !== null && lon !== null,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}

// ─── Forecast ────────────────────────────────────────────────────────────────

export function useForecast(lat: number | null, lon: number | null) {
  const { settings } = useSettings();
  return useQuery({
    queryKey: ['forecast', lat, lon, settings.temperatureUnit],
    queryFn: () => fetchForecast(lat!, lon!, settings.temperatureUnit),
    enabled: lat !== null && lon !== null,
    staleTime: 10 * 60 * 1000, // 10 min
    retry: 2,
  });
}

// ─── Air Quality ─────────────────────────────────────────────────────────────

export function useAirQuality(lat: number | null, lon: number | null) {
  return useQuery({
    queryKey: ['airQuality', lat, lon],
    queryFn: () => fetchAirQuality(lat!, lon!),
    enabled: lat !== null && lon !== null,
    staleTime: 15 * 60 * 1000, // 15 min
    retry: 1,
  });
}

// ─── Geocoding ────────────────────────────────────────────────────────────────

export function useGeocoding(query: string, enabled = true) {
  return useQuery({
    queryKey: ['geocoding', query],
    queryFn: () => geocodeCity(query),
    enabled: enabled && query.trim().length >= 2,
    staleTime: 60 * 60 * 1000, // 1 hour
    retry: 1,
  });
}
