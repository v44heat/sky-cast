import { Wind } from 'lucide-react';
import { processAQI, cn } from '@/utils/helpers';
import type { AirQualityItem } from '@/types/weather';

interface AirQualityCardProps {
  data: AirQualityItem;
}

const pollutants = [
  { key: 'pm2_5', label: 'PM2.5', unit: 'μg/m³' },
  { key: 'pm10', label: 'PM10', unit: 'μg/m³' },
  { key: 'o3', label: 'O₃', unit: 'μg/m³' },
  { key: 'no2', label: 'NO₂', unit: 'μg/m³' },
  { key: 'so2', label: 'SO₂', unit: 'μg/m³' },
  { key: 'co', label: 'CO', unit: 'μg/m³' },
] as const;

export function AirQualityCard({ data }: AirQualityCardProps) {
  const processed = processAQI(data.main.aqi);

  // Circle progress percentage (aqi 1-5 → 20%-100%)
  const pct = (data.main.aqi / 5) * 100;
  const circumference = 2 * Math.PI * 30;
  const strokeDashoffset = circumference - (pct / 100) * circumference;

  return (
    <section>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
        Air Quality
      </h2>
      <div className="glass-light dark:glass-dark rounded-3xl p-5 animate-fade-in-up">
        <div className="flex items-center gap-6">
          {/* AQI circle */}
          <div className="relative shrink-0">
            <svg width="80" height="80" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="30" fill="none" stroke="currentColor" strokeWidth="8"
                className="text-gray-200 dark:text-navy-600" />
              <circle
                cx="40" cy="40" r="30" fill="none"
                stroke={processed.color}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                transform="rotate(-90 40 40)"
                style={{ transition: 'stroke-dashoffset 0.6s ease' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-bold text-gray-800 dark:text-white">{data.main.aqi}</span>
            </div>
          </div>

          {/* Level info */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Wind className="h-4 w-4" style={{ color: processed.color }} />
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Air Quality Index</span>
            </div>
            <p className="text-2xl font-semibold text-gray-800 dark:text-white">{processed.level}</p>
            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500 max-w-xs">
              {processed.level === 'Good' && 'Air quality is satisfactory and poses little or no health risk.'}
              {processed.level === 'Fair' && 'Acceptable air quality; sensitive people may experience minor issues.'}
              {processed.level === 'Moderate' && 'Sensitive groups may experience health effects.'}
              {processed.level === 'Poor' && 'Health effects may be experienced by everyone; sensitive groups, more serious effects.'}
              {processed.level === 'Very Poor' && 'Health alert: everyone may experience serious health effects.'}
            </p>
          </div>
        </div>

        {/* Pollutant breakdown */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          {pollutants.map(({ key, label, unit }) => (
            <div
              key={key}
              className="rounded-xl bg-gray-50/80 dark:bg-navy-700/50 px-3 py-2 text-center"
            >
              <p className="text-xs font-medium text-gray-400 dark:text-gray-500">{label}</p>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                {(data.components as any)[key]?.toFixed(1)}
              </p>
              <p className="text-[10px] text-gray-400">{unit}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
