import {
  LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine
} from 'recharts';
import { format } from 'date-fns';
import { fromUnixTime } from 'date-fns';
import { useSettings } from '@/context/SettingsContext';
import { formatTemp } from '@/utils/helpers';
import { cn } from '@/utils/helpers';
import type { ForecastItem } from '@/types/weather';

interface WeatherChartProps {
  items: ForecastItem[];
}

interface ChartData {
  time: string;
  temp: number;
  humidity: number;
  windSpeed: number;
  pop: number;
}

function buildChartData(items: ForecastItem[]): ChartData[] {
  return items.slice(0, 8).map((item) => ({
    time: format(fromUnixTime(item.dt), 'h a'),
    temp: Math.round(item.main.temp),
    humidity: item.main.humidity,
    windSpeed: Math.round(item.wind.speed * 3.6), // m/s → km/h
    pop: Math.round(item.pop * 100),
  }));
}

interface TooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  unit?: string;
}

function CustomTooltip({ active, payload, label, unit }: TooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-light dark:glass-dark rounded-xl px-3 py-2 text-sm shadow-xl">
      <p className="font-semibold text-gray-700 dark:text-gray-200 mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.value}{unit}
        </p>
      ))}
    </div>
  );
}

interface SingleChartProps {
  data: ChartData[];
  title: string;
  dataKey: keyof ChartData;
  color: string;
  unit: string;
  type: 'line' | 'area';
  gradientId?: string;
}

function ChartPanel({ data, title, dataKey, color, unit, type, gradientId }: SingleChartProps) {
  return (
    <div className="glass-light dark:glass-dark rounded-3xl p-5 animate-fade-in-up">
      <h3 className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-200">{title}</h3>
      <ResponsiveContainer width="100%" height={180}>
        {type === 'area' ? (
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-gray-200 dark:text-navy-600" strokeOpacity={0.5} />
            <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip unit={unit} />} />
            <Area type="monotone" dataKey={dataKey} stroke={color} fill={`url(#${gradientId})`} strokeWidth={2.5} dot={false} activeDot={{ r: 5, strokeWidth: 0 }} />
          </AreaChart>
        ) : (
          <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-gray-200 dark:text-navy-600" strokeOpacity={0.5} />
            <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip unit={unit} />} />
            <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2.5} dot={false} activeDot={{ r: 5, strokeWidth: 0 }} />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}

export function WeatherChart({ items }: WeatherChartProps) {
  const { settings } = useSettings();
  const data = buildChartData(items);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <ChartPanel
        data={data}
        title="🌡️ Temperature Trend (24h)"
        dataKey="temp"
        color="#0ea5e9"
        unit={settings.temperatureUnit === 'metric' ? '°C' : '°F'}
        type="line"
      />
      <ChartPanel
        data={data}
        title="💧 Humidity Trend (24h)"
        dataKey="humidity"
        color="#3b82f6"
        unit="%"
        type="area"
        gradientId="humidityGradient"
      />
      <ChartPanel
        data={data}
        title="💨 Wind Speed Trend (24h)"
        dataKey="windSpeed"
        color="#8b5cf6"
        unit=" km/h"
        type="line"
      />
      <ChartPanel
        data={data}
        title="🌧️ Precipitation Probability (24h)"
        dataKey="pop"
        color="#06b6d4"
        unit="%"
        type="area"
        gradientId="popGradient"
      />
    </div>
  );
}
