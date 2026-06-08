import { Settings, Thermometer, Wind, Moon, Sun } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/utils/helpers';

interface OptionButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function OptionButton({ active, onClick, children }: OptionButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex-1 rounded-xl px-4 py-2.5 text-sm font-medium transition-all',
        active
          ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30'
          : 'bg-white/60 dark:bg-navy-700/60 text-gray-600 dark:text-gray-300 hover:bg-sky-50 dark:hover:bg-navy-600'
      )}
    >
      {children}
    </button>
  );
}

interface SettingRowProps {
  icon: React.ElementType;
  label: string;
  description: string;
  children: React.ReactNode;
}

function SettingRow({ icon: Icon, label, description, children }: SettingRowProps) {
  return (
    <div className="glass-light dark:glass-dark rounded-2xl p-5">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 dark:bg-navy-700">
            <Icon className="h-5 w-5 text-sky-500" />
          </div>
          <div>
            <p className="font-semibold text-gray-800 dark:text-white">{label}</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">{description}</p>
          </div>
        </div>
        <div className="flex gap-2 min-w-[180px]">{children}</div>
      </div>
    </div>
  );
}

export function SettingsPage() {
  const { settings, setTemperatureUnit, setWindUnit } = useSettings();
  const { theme, toggleTheme } = useTheme();

  return (
    <main className="mx-auto max-w-2xl px-4 py-6 md:px-6 space-y-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-400 to-violet-600 shadow-lg shadow-violet-500/30">
          <Settings className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white">Settings</h1>
          <p className="text-sm text-gray-400 dark:text-gray-500">Customize your experience</p>
        </div>
      </div>

      <div className="space-y-3">
        <SettingRow
          icon={Thermometer}
          label="Temperature Unit"
          description="Choose how temperatures are displayed"
        >
          <OptionButton
            active={settings.temperatureUnit === 'metric'}
            onClick={() => setTemperatureUnit('metric')}
          >
            °C — Celsius
          </OptionButton>
          <OptionButton
            active={settings.temperatureUnit === 'imperial'}
            onClick={() => setTemperatureUnit('imperial')}
          >
            °F — Fahrenheit
          </OptionButton>
        </SettingRow>

        <SettingRow
          icon={Wind}
          label="Wind Speed Unit"
          description="How wind speeds appear across the app"
        >
          <OptionButton
            active={settings.windUnit === 'kmh'}
            onClick={() => setWindUnit('kmh')}
          >
            km/h
          </OptionButton>
          <OptionButton
            active={settings.windUnit === 'mph'}
            onClick={() => setWindUnit('mph')}
          >
            mph
          </OptionButton>
        </SettingRow>

        <SettingRow
          icon={theme === 'dark' ? Moon : Sun}
          label="Appearance"
          description="Switch between light and dark mode"
        >
          <OptionButton active={theme === 'light'} onClick={() => theme === 'dark' && toggleTheme()}>
            <span className="flex items-center gap-1.5 justify-center"><Sun className="h-4 w-4" /> Light</span>
          </OptionButton>
          <OptionButton active={theme === 'dark'} onClick={() => theme === 'light' && toggleTheme()}>
            <span className="flex items-center gap-1.5 justify-center"><Moon className="h-4 w-4" /> Dark</span>
          </OptionButton>
        </SettingRow>
      </div>

      {/* About section */}
      <div className="glass-light dark:glass-dark rounded-2xl p-5 mt-6">
        <h3 className="font-semibold text-gray-800 dark:text-white mb-1">About SkyCast</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Weather Anywhere, Instantly. — Powered by OpenWeatherMap API.
          Real-time weather, hourly forecasts, and 5-day outlooks for any city worldwide.
        </p>
        <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
          Built with React · TypeScript · Tailwind CSS · React Query
        </p>
      </div>
    </main>
  );
}
