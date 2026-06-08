import { useWeatherContext } from '@/context/WeatherContext';
import { useCurrentWeather, useCurrentWeatherByCoords, useForecast } from '@/hooks/useWeather';
import { WeatherChart } from '@/components/WeatherChart';
import { ErrorState } from '@/components/ErrorState';
import { Skeleton } from '@/components/LoadingSkeleton';
import { BarChart3 } from 'lucide-react';

export function ChartsPage() {
  const { city, coords } = useWeatherContext();
  const useCoords = coords !== null;

  const cityWeather = useCurrentWeather(city, !useCoords);
  const coordWeather = useCurrentWeatherByCoords(
    coords?.lat ?? null,
    coords?.lon ?? null,
    useCoords
  );
  const currentWeather = useCoords ? coordWeather : cityWeather;

  const lat = currentWeather.data?.coord.lat ?? null;
  const lon = currentWeather.data?.coord.lon ?? null;
  const forecast = useForecast(lat, lon);

  return (
    <main className="mx-auto max-w-5xl px-4 py-6 md:px-6 space-y-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-sky-600 shadow-lg shadow-sky-500/30">
          <BarChart3 className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
            Weather Analytics
          </h1>
          {currentWeather.data && (
            <p className="text-sm text-gray-400 dark:text-gray-500">
              {currentWeather.data.name}, {currentWeather.data.sys.country} — 24-hour trends
            </p>
          )}
        </div>
      </div>

      {forecast.isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-60 rounded-3xl" />)}
        </div>
      )}

      {forecast.isError && (
        <ErrorState onRetry={() => forecast.refetch()} />
      )}

      {forecast.data && (
        <WeatherChart items={forecast.data.list} />
      )}

      {!currentWeather.data && !currentWeather.isLoading && (
        <ErrorState type="generic" message="Search for a city to view its analytics." />
      )}
    </main>
  );
}
