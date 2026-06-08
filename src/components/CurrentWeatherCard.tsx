import { format } from 'date-fns';
import { MapPin, Heart, Droplets, Wind } from 'lucide-react';
import { getWeatherIconUrl } from '@/services/weatherApi';
import { formatTemp, formatWindSpeed } from '@/utils/helpers';
import { useFavorites } from '@/hooks/useLocalStorage';
import { useSettings } from '@/context/SettingsContext';
import { cn, getGreeting } from '@/utils/helpers';
import type { CurrentWeather } from '@/types/weather';

interface CurrentWeatherCardProps {
  weather: CurrentWeather;
}

export function CurrentWeatherCard({ weather }: CurrentWeatherCardProps) {
  const { settings } = useSettings();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const cityId = String(weather.id);
  const favorited = isFavorite(cityId);

  const toggleFavorite = () => {
    if (favorited) {
      removeFavorite(cityId);
    } else {
      addFavorite({
        id: cityId,
        name: weather.name,
        country: weather.sys.country,
        lat: weather.coord.lat,
        lon: weather.coord.lon,
      });
    }
  };

  const condition = weather.weather[0];

  // Compute the city's local time using the UTC offset provided by the API.
  // weather.timezone is the city's offset from UTC in seconds.
  // We reconstruct "what time is it there right now" by:
  //   1. Getting current UTC ms
  //   2. Adding the city's UTC offset
  const nowUtcMs = Date.now() + new Date().getTimezoneOffset() * 60 * 1000;
  const cityLocalDate = new Date(nowUtcMs + weather.timezone * 1000);

  // Greeting is also based on the city's local hour
  const cityHour = cityLocalDate.getHours();
  const greeting =
    cityHour >= 5 && cityHour < 12 ? 'Good Morning ☀️' :
    cityHour >= 12 && cityHour < 17 ? 'Good Afternoon 🌤️' :
    cityHour >= 17 && cityHour < 21 ? 'Good Evening 🌅' :
    'Good Night 🌙';

  return (
    <div className={cn(
      'relative overflow-hidden rounded-3xl p-6 md:p-8',
      'glass-light dark:glass-dark',
      'animate-fade-in-up'
    )}>
      {/* Background gradient orbs */}
      <div className="pointer-events-none absolute -top-12 -right-12 h-48 w-48 rounded-full bg-sky-300/20 dark:bg-sky-600/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-8 -left-8 h-36 w-36 rounded-full bg-blue-300/20 dark:bg-blue-800/10 blur-2xl" />

      <div className="relative flex flex-col gap-4">
        {/* Header: location + favorite */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-sky-600 dark:text-sky-400">
              <MapPin className="h-3.5 w-3.5" />
              <span className="text-sm font-medium">
                {weather.name}, {weather.sys.country}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
              {format(cityLocalDate, 'EEEE, MMMM d • h:mm a')}
            </p>
          </div>
          <button
            onClick={toggleFavorite}
            aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-xl transition-all active:scale-90',
              favorited
                ? 'bg-red-50 dark:bg-red-900/30 text-red-500'
                : 'bg-white/60 dark:bg-navy-700/50 text-gray-400 dark:text-gray-500 hover:text-red-400'
            )}
          >
            <Heart className={cn('h-4 w-4', favorited && 'fill-current')} />
          </button>
        </div>

        {/* Main weather display */}
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <p className="font-display text-7xl md:text-8xl font-normal leading-none text-gray-900 dark:text-white">
              {formatTemp(weather.main.temp, settings.temperatureUnit)}
            </p>
            <p className="mt-2 text-base font-medium capitalize text-gray-600 dark:text-gray-300">
              {condition.description}
            </p>
            <p className="mt-0.5 text-sm text-gray-400 dark:text-gray-500">
              Feels like {formatTemp(weather.main.feels_like, settings.temperatureUnit)}
            </p>
          </div>
          <div className="shrink-0">
            <img
              src={getWeatherIconUrl(condition.icon, '4x')}
              alt={condition.description}
              className="h-24 w-24 md:h-28 md:w-28 drop-shadow-lg"
            />
          </div>
        </div>

        {/* Greeting — based on city local time */}
        <div className="flex items-center gap-3 rounded-2xl bg-sky-50/80 dark:bg-sky-900/20 px-4 py-2.5">
          <span className="text-sm font-medium text-sky-700 dark:text-sky-300">
            {greeting}
          </span>
        </div>

        {/* Quick stats */}
        <div className="flex gap-4 pt-1">
          <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
            <Droplets className="h-4 w-4 text-blue-400" />
            {weather.main.humidity}% humidity
          </div>
          <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
            <Wind className="h-4 w-4 text-sky-400" />
            {formatWindSpeed(weather.wind.speed, settings.windUnit)}
          </div>
        </div>
      </div>
    </div>
  );
}
