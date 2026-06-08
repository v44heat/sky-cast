import { format } from 'date-fns';
import { Droplets } from 'lucide-react';
import { getWeatherIconUrl } from '@/services/weatherApi';
import { formatTemp, cn } from '@/utils/helpers';
import { useSettings } from '@/context/SettingsContext';
import type { HourlyForecast as HourlyForecastType } from '@/types/weather';

interface HourlyForecastProps {
  items: HourlyForecastType[];
}

export function HourlyForecast({ items }: HourlyForecastProps) {
  const { settings } = useSettings();

  return (
    <section>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
        Hourly Forecast
      </h2>
      <div className="overflow-x-auto pb-2 -mx-1 px-1">
        <div className="flex gap-3 w-max">
          {items.map((item, i) => {
            const isNow = i === 0;
            return (
              <div
                key={item.time.toISOString()}
                className={cn(
                  'flex flex-col items-center gap-2 rounded-2xl px-4 py-3 min-w-[72px] transition-all',
                  'animate-fade-in-up',
                  isNow
                    ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/30'
                    : 'glass-light dark:glass-dark text-gray-700 dark:text-gray-200'
                )}
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <span className={cn('text-xs font-medium', isNow ? 'text-sky-100' : 'text-gray-400 dark:text-gray-500')}>
                  {isNow ? 'Now' : format(item.time, 'h a')}
                </span>
                <img
                  src={getWeatherIconUrl(item.weather.icon)}
                  alt={item.weather.description}
                  className="h-10 w-10"
                />
                <span className="text-sm font-semibold">
                  {formatTemp(item.temp, settings.temperatureUnit)}
                </span>
                {item.pop > 0.1 && (
                  <div className={cn('flex items-center gap-0.5 text-xs', isNow ? 'text-sky-100' : 'text-blue-500 dark:text-blue-400')}>
                    <Droplets className="h-3 w-3" />
                    {Math.round(item.pop * 100)}%
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
