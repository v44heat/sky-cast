import { Star, X, MapPin } from 'lucide-react';
import { useFavorites } from '@/hooks/useLocalStorage';
import { useWeatherContext } from '@/context/WeatherContext';
import { cn } from '@/utils/helpers';
import type { FavoriteCity } from '@/types/weather';

export function FavoriteCities() {
  const { favorites, removeFavorite } = useFavorites();
  const { setCity, setCoords } = useWeatherContext();

  if (favorites.length === 0) return null;

  const handleSelect = (city: FavoriteCity) => {
    setCity(city.name);
    setCoords({ lat: city.lat, lon: city.lon });
  };

  return (
    <section>
      <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
        <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
        Favorites
      </h2>
      <div className="flex flex-wrap gap-2">
        {favorites.map((city) => (
          <div
            key={city.id}
            className={cn(
              'group flex items-center gap-2 rounded-xl px-3 py-2',
              'glass-light dark:glass-dark',
              'hover:border-sky-300 dark:hover:border-sky-700 transition cursor-pointer'
            )}
            onClick={() => handleSelect(city)}
          >
            <MapPin className="h-3.5 w-3.5 text-sky-500 shrink-0" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
              {city.name}
            </span>
            <span className="text-xs text-gray-400">{city.country}</span>
            <button
              onClick={(e) => { e.stopPropagation(); removeFavorite(city.id); }}
              className="opacity-0 group-hover:opacity-100 transition text-gray-400 hover:text-red-400 ml-0.5"
              aria-label={`Remove ${city.name} from favorites`}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
