import { useEffect } from 'react';
import { useWeatherContext } from '@/context/WeatherContext';
import { useCurrentWeather, useCurrentWeatherByCoords, useForecast, useAirQuality } from '@/hooks/useWeather';
import { groupForecastByDay, getNext24Hours } from '@/utils/helpers';

import { CurrentWeatherCard } from '@/components/CurrentWeatherCard';
import { WeatherDetailsCard } from '@/components/WeatherDetailsCard';
import { HourlyForecast } from '@/components/HourlyForecast';
import { ForecastCard } from '@/components/ForecastCard';
import { AirQualityCard } from '@/components/AirQualityCard';
import { SunInfo } from '@/components/SunInfo';
import { FavoriteCities } from '@/components/FavoriteCities';
import { ErrorState } from '@/components/ErrorState';
import {
  CurrentWeatherSkeleton,
  WeatherDetailsSkeleton,
  ForecastSkeleton,
  HourlySkeleton,
} from '@/components/LoadingSkeleton';

export function HomePage() {
  const { city, coords } = useWeatherContext();

  // If we have coords (from geolocation or geocoding), use those
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
  const airQuality = useAirQuality(lat, lon);

  const isLoading = currentWeather.isLoading;
  const isError = currentWeather.isError;
  const error = currentWeather.error as any;

  const daily = forecast.data ? groupForecastByDay(forecast.data.list) : [];
  const hourly = forecast.data ? getNext24Hours(forecast.data.list) : [];

  return (
    <main className="mx-auto max-w-4xl px-4 py-6 md:px-6 space-y-5">
      {/* Favorites quick access */}
      <FavoriteCities />

      {/* Current weather */}
      {isLoading && <CurrentWeatherSkeleton />}
      {isError && (
        <ErrorState
          message={error?.response?.data?.message || error?.message}
          onRetry={() => currentWeather.refetch()}
        />
      )}
      {currentWeather.data && (
        <>
          <CurrentWeatherCard weather={currentWeather.data} />

          {/* Sun info */}
          <SunInfo weather={currentWeather.data} />
        </>
      )}

      {/* Hourly forecast */}
      {forecast.isLoading && <HourlySkeleton />}
      {hourly.length > 0 && <HourlyForecast items={hourly} />}

      {/* Weather details */}
      {isLoading && <WeatherDetailsSkeleton />}
      {currentWeather.data && <WeatherDetailsCard weather={currentWeather.data} />}

      {/* 5-day forecast */}
      {forecast.isLoading && <ForecastSkeleton />}
      {daily.length > 0 && <ForecastCard forecasts={daily} />}

      {/* Air Quality */}
      {airQuality.data?.list[0] && (
        <AirQualityCard data={airQuality.data.list[0]} />
      )}
    </main>
  );
}
