import { Droplets } from 'lucide-react';
import { getWeatherIconUrl } from '@/services/weatherApi';
import { formatTemp, cn } from '@/utils/helpers';
import { useSettings } from '@/context/SettingsContext';
import type { DailyForecast } from '@/types/weather';

interface ForecastCardProps {
  forecasts: DailyForecast[];
}

export function ForecastCard({ forecasts }: ForecastCardProps) {
  const { settings } = useSettings();

  // find temp range for bar scaling
  const allTemps = forecasts.flatMap((f) => [f.tempMin, f.tempMax]);
  const globalMin = Math.min(...allTemps);
  const globalMax = Math.max(...allTemps);
  const range = globalMax - globalMin || 1;

  return (
    <section>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
        5-Day Forecast
      </h2>
      <div className="glass-light dark:glass-dark rounded-3xl overflow-hidden divide-y divide-gray-100/60 dark:divide-white/5">
        {forecasts.map((day, i) => {
          const leftPct = ((day.tempMin - globalMin) / range) * 100;
          const widthPct = ((day.tempMax - day.tempMin) / range) * 100;

          return (
            <div
              key={day.dayLabel}
              className={cn(
                'flex items-center gap-3 px-5 py-3.5 animate-fade-in-up',
                'hover:bg-sky-50/50 dark:hover:bg-white/[0.02] transition'
              )}
              style={{ animationDelay: `${i * 70}ms` }}
            >
              {/* Day label */}
              <span className="w-14 text-sm font-semibold text-gray-700 dark:text-gray-200">
                {day.dayLabel}
              </span>

              {/* Icon */}
              <img
                src={getWeatherIconUrl(day.weather.icon)}
                alt={day.weather.description}
                className="h-9 w-9 shrink-0"
              />

              {/* Pop */}
              {day.pop > 0.1 && (
                <div className="flex items-center gap-0.5 text-xs text-blue-500 dark:text-blue-400 w-10 shrink-0">
                  <Droplets className="h-3 w-3" />
                  {Math.round(day.pop * 100)}%
                </div>
              )}
              {day.pop <= 0.1 && <div className="w-10 shrink-0" />}

              {/* Temp range bar */}
              <div className="flex flex-1 items-center gap-2">
                <span className="w-10 text-right text-sm text-gray-400 dark:text-gray-500 tabular-nums">
                  {formatTemp(day.tempMin, settings.temperatureUnit)}
                </span>
                <div className="relative flex-1 h-1.5 rounded-full bg-gray-200 dark:bg-navy-600">
                  <div
                    className="absolute h-full rounded-full bg-gradient-to-r from-sky-400 to-orange-400"
                    style={{ left: `${leftPct}%`, width: `${Math.max(widthPct, 8)}%` }}
                  />
                </div>
                <span className="w-10 text-sm font-semibold text-gray-800 dark:text-white tabular-nums">
                  {formatTemp(day.tempMax, settings.temperatureUnit)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
