import { Star, MapPin, Trash2 } from 'lucide-react';
import { useFavorites } from '@/hooks/useLocalStorage';
import { useWeatherContext } from '@/context/WeatherContext';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/utils/helpers';
import type { FavoriteCity } from '@/types/weather';

export function FavoritesPage() {
  const { favorites, removeFavorite } = useFavorites();
  const { setCity, setCoords } = useWeatherContext();
  const navigate = useNavigate();

  const handleSelect = (city: FavoriteCity) => {
    setCity(city.name);
    setCoords({ lat: city.lat, lon: city.lon });
    navigate('/');
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-6 md:px-6 space-y-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/30">
          <Star className="h-5 w-5 text-white fill-white" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white">Favorite Cities</h1>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            {favorites.length} {favorites.length === 1 ? 'city' : 'cities'} saved
          </p>
        </div>
      </div>

      {favorites.length === 0 ? (
        <div className="glass-light dark:glass-dark rounded-3xl p-12 text-center">
          <Star className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
            No favorites yet
          </h3>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Search for a city and tap the heart icon to save it here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {favorites.map((city, i) => (
            <div
              key={city.id}
              className={cn(
                'group flex items-center justify-between rounded-2xl px-5 py-4 cursor-pointer',
                'glass-light dark:glass-dark hover:border-sky-300 dark:hover:border-sky-700 transition-all',
                'animate-fade-in-up'
              )}
              style={{ animationDelay: `${i * 60}ms` }}
              onClick={() => handleSelect(city)}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 dark:bg-navy-700">
                  <MapPin className="h-5 w-5 text-sky-500" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 dark:text-white">{city.name}</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500">{city.country}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 dark:text-gray-500 hidden sm:block">
                  {city.lat.toFixed(2)}°, {city.lon.toFixed(2)}°
                </span>
                <button
                  onClick={(e) => { e.stopPropagation(); removeFavorite(city.id); }}
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-xl',
                    'opacity-0 group-hover:opacity-100 transition',
                    'text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                  )}
                  aria-label={`Remove ${city.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
