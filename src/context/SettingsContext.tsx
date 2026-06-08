import React, { createContext, useContext, useState } from 'react';
import type { UserSettings, TemperatureUnit, WindUnit } from '@/types/weather';
import { getFromStorage, setToStorage } from '@/utils/helpers';

interface SettingsContextValue {
  settings: UserSettings;
  setTemperatureUnit: (unit: TemperatureUnit) => void;
  setWindUnit: (unit: WindUnit) => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

const DEFAULT_SETTINGS: UserSettings = {
  temperatureUnit: 'metric',
  windUnit: 'kmh',
};

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<UserSettings>(() =>
    getFromStorage('skycast-settings', DEFAULT_SETTINGS)
  );

  const update = (partial: Partial<UserSettings>) => {
    const next = { ...settings, ...partial };
    setSettings(next);
    setToStorage('skycast-settings', next);
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        setTemperatureUnit: (unit) => update({ temperatureUnit: unit }),
        setWindUnit: (unit) => update({ windUnit: unit }),
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used inside SettingsProvider');
  return ctx;
}
