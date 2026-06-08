import { Droplets, Wind, Gauge, Eye, Cloud, Thermometer, Navigation } from 'lucide-react';
import { formatWindSpeed, formatVisibility, formatTemp } from '@/utils/helpers';
import { useSettings } from '@/context/SettingsContext';
import { windDirectionLabel, cn } from '@/utils/helpers';
import type { CurrentWeather } from '@/types/weather';

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  color?: string;
  delay?: number;
}

function StatCard({ icon: Icon, label, value, sub, color = 'text-sky-500', delay = 0 }: StatCardProps) {
  return (
    <div
      className={cn(
        'glass-light dark:glass-dark rounded-2xl p-4 animate-fade-in-up',
        'flex flex-col gap-2'
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-2">
        <div className={cn('flex h-7 w-7 items-center justify-center rounded-xl bg-current/10', color)}>
          <Icon className={cn('h-3.5 w-3.5', color)} />
        </div>
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</span>
      </div>
      <p className="text-xl font-semibold text-gray-800 dark:text-white">{value}</p>
      {sub && <p className="text-xs text-gray-400 dark:text-gray-500">{sub}</p>}
    </div>
  );
}

interface WeatherDetailsCardProps {
  weather: CurrentWeather;
}

export function WeatherDetailsCard({ weather }: WeatherDetailsCardProps) {
  const { settings } = useSettings();

  const stats: StatCardProps[] = [
    {
      icon: Droplets,
      label: 'Humidity',
      value: `${weather.main.humidity}%`,
      sub: weather.main.humidity > 70 ? 'High — feels muggy' : weather.main.humidity < 30 ? 'Low — feels dry' : 'Comfortable',
      color: 'text-blue-500',
    },
    {
      icon: Wind,
      label: 'Wind Speed',
      value: formatWindSpeed(weather.wind.speed, settings.windUnit),
      sub: `${windDirectionLabel(weather.wind.deg)} · ${weather.wind.deg}°`,
      color: 'text-sky-500',
    },
    {
      icon: Gauge,
      label: 'Pressure',
      value: `${weather.main.pressure} hPa`,
      sub: weather.main.pressure > 1013 ? 'High pressure' : 'Low pressure',
      color: 'text-violet-500',
    },
    {
      icon: Eye,
      label: 'Visibility',
      value: formatVisibility(weather.visibility),
      sub: weather.visibility >= 10000 ? 'Clear conditions' : weather.visibility >= 5000 ? 'Good' : 'Reduced',
      color: 'text-amber-500',
    },
    {
      icon: Cloud,
      label: 'Cloud Cover',
      value: `${weather.clouds.all}%`,
      sub: weather.clouds.all < 20 ? 'Clear sky' : weather.clouds.all < 50 ? 'Partly cloudy' : 'Overcast',
      color: 'text-gray-500',
    },
    {
      icon: Thermometer,
      label: 'Feels Like',
      value: formatTemp(weather.main.feels_like, settings.temperatureUnit),
      sub: `Min ${formatTemp(weather.main.temp_min, settings.temperatureUnit)} / Max ${formatTemp(weather.main.temp_max, settings.temperatureUnit)}`,
      color: 'text-rose-500',
    },
  ];

  if (weather.wind.gust) {
    stats.push({
      icon: Navigation,
      label: 'Wind Gust',
      value: formatWindSpeed(weather.wind.gust, settings.windUnit),
      sub: 'Peak gust speed',
      color: 'text-cyan-500',
    });
  }

  return (
    <section>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
        Weather Details
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 stagger-children">
        {stats.map((s, i) => (
          <StatCard key={s.label} {...s} delay={i * 60} />
        ))}
      </div>
    </section>
  );
}
