import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, fromUnixTime, addSeconds, startOfDay, isSameDay } from 'date-fns';
import type {
  ForecastItem,
  DailyForecast,
  HourlyForecast,
  TemperatureUnit,
  WindUnit,
  ProcessedAQI,
  AQILevel,
} from '@/types/weather';

// ─── Tailwind class merger ────────────────────────────────────────────────────

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── Temperature conversion / display ────────────────────────────────────────

export function formatTemp(temp: number, unit: TemperatureUnit = 'metric'): string {
  const rounded = Math.round(temp);
  return `${rounded}°${unit === 'metric' ? 'C' : 'F'}`;
}

export function convertTemp(tempC: number, unit: TemperatureUnit): number {
  if (unit === 'imperial') return Math.round((tempC * 9) / 5 + 32);
  return Math.round(tempC);
}

// ─── Wind speed ───────────────────────────────────────────────────────────────

export function formatWindSpeed(speedMs: number, unit: WindUnit = 'kmh'): string {
  if (unit === 'mph') {
    return `${Math.round(speedMs * 2.237)} mph`;
  }
  return `${Math.round(speedMs * 3.6)} km/h`;
}

// ─── Visibility ───────────────────────────────────────────────────────────────

export function formatVisibility(meters: number): string {
  if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`;
  return `${meters} m`;
}

// ─── Time utilities ───────────────────────────────────────────────────────────

export function formatTime(unixTs: number, timezone: number = 0): string {
  // OpenWeather timestamps are UTC; timezone is offset in seconds
  const localDate = addSeconds(fromUnixTime(unixTs), timezone);
  // Use UTC methods since we manually adjusted
  return format(localDate, 'h:mm a');
}

export function formatHour(unixTs: number): string {
  return format(fromUnixTime(unixTs), 'h a');
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'Good Morning ☀️';
  if (hour >= 12 && hour < 17) return 'Good Afternoon 🌤️';
  if (hour >= 17 && hour < 21) return 'Good Evening 🌅';
  return 'Good Night 🌙';
}

export function getDayLength(sunrise: number, sunset: number): string {
  const diff = sunset - sunrise;
  const hours = Math.floor(diff / 3600);
  const minutes = Math.floor((diff % 3600) / 60);
  return `${hours}h ${minutes}m`;
}

// ─── Forecast processing ──────────────────────────────────────────────────────

export function groupForecastByDay(items: ForecastItem[]): DailyForecast[] {
  const groups: Map<string, ForecastItem[]> = new Map();

  for (const item of items) {
    const day = format(fromUnixTime(item.dt), 'yyyy-MM-dd');
    if (!groups.has(day)) groups.set(day, []);
    groups.get(day)!.push(item);
  }

  const result: DailyForecast[] = [];
  let count = 0;

  for (const [dayStr, dayItems] of groups) {
    if (count >= 5) break;
    const temps = dayItems.map((i) => i.main.temp);
    const date = startOfDay(new Date(dayStr));
    const isToday = isSameDay(date, new Date());

    result.push({
      date,
      dayLabel: isToday ? 'Today' : format(date, 'EEE'),
      tempMin: Math.min(...dayItems.map((i) => i.main.temp_min)),
      tempMax: Math.max(...dayItems.map((i) => i.main.temp_max)),
      weather: dayItems[Math.floor(dayItems.length / 2)].weather[0],
      pop: Math.max(...dayItems.map((i) => i.pop)),
    });
    count++;
  }

  return result;
}

export function getNext24Hours(items: ForecastItem[]): HourlyForecast[] {
  // Take up to 8 intervals (8 × 3h = 24h)
  return items.slice(0, 8).map((item) => ({
    time: fromUnixTime(item.dt),
    temp: item.main.temp,
    weather: item.weather[0],
    pop: item.pop,
  }));
}

// ─── AQI processing ───────────────────────────────────────────────────────────

export function processAQI(aqi: number): ProcessedAQI {
  const levels: Record<number, { level: AQILevel; color: string; bgColor: string }> = {
    1: { level: 'Good', color: '#10b981', bgColor: '#d1fae5' },
    2: { level: 'Fair', color: '#f59e0b', bgColor: '#fef3c7' },
    3: { level: 'Moderate', color: '#f97316', bgColor: '#ffedd5' },
    4: { level: 'Poor', color: '#ef4444', bgColor: '#fee2e2' },
    5: { level: 'Very Poor', color: '#8b5cf6', bgColor: '#ede9fe' },
  };
  return { aqi, ...(levels[aqi] ?? levels[3]) };
}

// ─── Wind direction ───────────────────────────────────────────────────────────

export function windDirectionLabel(deg: number): string {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return dirs[Math.round(deg / 45) % 8];
}

// ─── LocalStorage helpers ────────────────────────────────────────────────────

export function getFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function setToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Silently fail (quota exceeded, etc.)
  }
}
