// ─── Core Weather Types ─────────────────────────────────────────────────────

export interface Coordinates {
  lat: number;
  lon: number;
}

export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface MainWeatherData {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  sea_level?: number;
  grnd_level?: number;
}

export interface WindData {
  speed: number;
  deg: number;
  gust?: number;
}

export interface CloudsData {
  all: number;
}

export interface SysData {
  type?: number;
  id?: number;
  country: string;
  sunrise: number;
  sunset: number;
}

export interface RainData {
  '1h'?: number;
  '3h'?: number;
}

export interface SnowData {
  '1h'?: number;
  '3h'?: number;
}

// ─── Current Weather Response ────────────────────────────────────────────────

export interface CurrentWeather {
  coord: Coordinates;
  weather: WeatherCondition[];
  base: string;
  main: MainWeatherData;
  visibility: number;
  wind: WindData;
  clouds: CloudsData;
  rain?: RainData;
  snow?: SnowData;
  dt: number;
  sys: SysData;
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

// ─── Forecast Types ──────────────────────────────────────────────────────────

export interface ForecastItem {
  dt: number;
  main: MainWeatherData;
  weather: WeatherCondition[];
  clouds: CloudsData;
  wind: WindData;
  visibility: number;
  pop: number; // Probability of precipitation
  rain?: RainData;
  snow?: SnowData;
  sys: { pod: string };
  dt_txt: string;
}

export interface ForecastCity {
  id: number;
  name: string;
  coord: Coordinates;
  country: string;
  population: number;
  timezone: number;
  sunrise: number;
  sunset: number;
}

export interface ForecastResponse {
  cod: string;
  message: number;
  cnt: number;
  list: ForecastItem[];
  city: ForecastCity;
}

// ─── Air Quality Types ───────────────────────────────────────────────────────

export interface AirQualityComponents {
  co: number;
  no: number;
  no2: number;
  o3: number;
  so2: number;
  pm2_5: number;
  pm10: number;
  nh3: number;
}

export interface AirQualityItem {
  main: { aqi: number }; // 1=Good, 2=Fair, 3=Moderate, 4=Poor, 5=Very Poor
  components: AirQualityComponents;
  dt: number;
}

export interface AirQualityResponse {
  coord: Coordinates;
  list: AirQualityItem[];
}

// ─── Geocoding Types ─────────────────────────────────────────────────────────

export interface GeocodingResult {
  name: string;
  local_names?: Record<string, string>;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

// ─── App State Types ─────────────────────────────────────────────────────────

export type TemperatureUnit = 'metric' | 'imperial';
export type WindUnit = 'kmh' | 'mph';
export type Theme = 'light' | 'dark';

export interface UserSettings {
  temperatureUnit: TemperatureUnit;
  windUnit: WindUnit;
}

export interface FavoriteCity {
  id: string;
  name: string;
  country: string;
  lat: number;
  lon: number;
}

export interface RecentSearch {
  query: string;
  timestamp: number;
}

// ─── Processed / Display Types ───────────────────────────────────────────────

export interface DailyForecast {
  date: Date;
  dayLabel: string;
  tempMin: number;
  tempMax: number;
  weather: WeatherCondition;
  pop: number;
}

export interface HourlyForecast {
  time: Date;
  temp: number;
  weather: WeatherCondition;
  pop: number;
}

export type AQILevel = 'Good' | 'Fair' | 'Moderate' | 'Poor' | 'Very Poor';

export interface ProcessedAQI {
  level: AQILevel;
  aqi: number;
  color: string;
  bgColor: string;
}
