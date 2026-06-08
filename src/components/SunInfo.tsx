import { Sunrise, Sunset, Clock } from 'lucide-react';
import { formatTime, getDayLength } from '@/utils/helpers';
import type { CurrentWeather } from '@/types/weather';

interface SunInfoProps {
  weather: CurrentWeather;
}

export function SunInfo({ weather }: SunInfoProps) {
  const { sunrise, sunset } = weather.sys;
  const tz = weather.timezone;

  // Progress bar — what % of daylight has passed
  const now = Math.floor(Date.now() / 1000);
  const pct = Math.min(100, Math.max(0, ((now - sunrise) / (sunset - sunrise)) * 100));

  return (
    <section>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
        Sun
      </h2>
      <div className="glass-light dark:glass-dark rounded-3xl p-5 animate-fade-in-up">
        {/* Sun arc */}
        <div className="relative mb-4">
          <div className="relative h-1.5 rounded-full bg-gray-200 dark:bg-navy-600">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-300 to-orange-400 transition-all duration-1000"
              style={{ width: `${pct}%` }}
            />
            {/* Sun dot */}
            <div
              className="absolute -top-2 h-5 w-5 rounded-full bg-amber-400 shadow-md shadow-amber-400/50 border-2 border-white dark:border-navy-800"
              style={{ left: `calc(${pct}% - 10px)` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30">
              <Sunrise className="h-4 w-4 text-amber-500" />
            </div>
            <div>
              <p className="text-xs text-gray-400 dark:text-gray-500">Sunrise</p>
              <p className="text-sm font-semibold text-gray-800 dark:text-white">{formatTime(sunrise, tz)}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-center">
            <div>
              <Clock className="h-3.5 w-3.5 text-gray-400 mx-auto mb-0.5" />
              <p className="text-xs text-gray-400 dark:text-gray-500">Day Length</p>
              <p className="text-sm font-semibold text-gray-800 dark:text-white">{getDayLength(sunrise, sunset)}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-100 dark:bg-orange-900/30">
              <Sunset className="h-4 w-4 text-orange-500" />
            </div>
            <div>
              <p className="text-xs text-gray-400 dark:text-gray-500">Sunset</p>
              <p className="text-sm font-semibold text-gray-800 dark:text-white">{formatTime(sunset, tz)}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
