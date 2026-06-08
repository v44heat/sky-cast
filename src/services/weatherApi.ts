import axios from 'axios';
import type {
  CurrentWeather,
  ForecastResponse,
  AirQualityResponse,
  GeocodingResult,
  TemperatureUnit,
} from '@/types/weather';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org';

const api = axios.create({
  baseURL: BASE_URL,
  params: { appid: API_KEY },
});

// ─── Current Weather ─────────────────────────────────────────────────────────

export async function fetchCurrentWeather(
  city: string,
  unit: TemperatureUnit = 'metric'
): Promise<CurrentWeather> {
  const { data } = await api.get<CurrentWeather>('/data/2.5/weather', {
    params: { q: city, units: unit },
  });
  return data;
}

export async function fetchCurrentWeatherByCoords(
  lat: number,
  lon: number,
  unit: TemperatureUnit = 'metric'
): Promise<CurrentWeather> {
  const { data } = await api.get<CurrentWeather>('/data/2.5/weather', {
    params: { lat, lon, units: unit },
  });
  return data;
}

// ─── 5-Day / 3-Hour Forecast ─────────────────────────────────────────────────

export async function fetchForecast(
  lat: number,
  lon: number,
  unit: TemperatureUnit = 'metric'
): Promise<ForecastResponse> {
  const { data } = await api.get<ForecastResponse>('/data/2.5/forecast', {
    params: { lat, lon, units: unit, cnt: 40 },
  });
  return data;
}

// ─── Air Quality ─────────────────────────────────────────────────────────────

export async function fetchAirQuality(lat: number, lon: number): Promise<AirQualityResponse> {
  const { data } = await api.get<AirQualityResponse>('/data/2.5/air_pollution', {
    params: { lat, lon },
  });
  return data;
}

// ─── Geocoding / Autocomplete ────────────────────────────────────────────────

export async function geocodeCity(query: string, limit = 5): Promise<GeocodingResult[]> {
  const { data } = await api.get<GeocodingResult[]>('/geo/1.0/direct', {
    params: { q: query, limit },
  });
  return data;
}

export async function reverseGeocode(lat: number, lon: number): Promise<GeocodingResult[]> {
  const { data } = await api.get<GeocodingResult[]>('/geo/1.0/reverse', {
    params: { lat, lon, limit: 1 },
  });
  return data;
}

// ─── Weather Icon URL ────────────────────────────────────────────────────────

export function getWeatherIconUrl(iconCode: string, size: '1x' | '2x' | '4x' = '2x'): string {
  return `https://openweathermap.org/img/wn/${iconCode}@${size}.png`;
}
