import React, { createContext, useContext, useState } from 'react';
import type { Coordinates } from '@/types/weather';

interface WeatherContextValue {
  city: string;
  coords: Coordinates | null;
  setCity: (city: string) => void;
  setCoords: (coords: Coordinates) => void;
}

const WeatherContext = createContext<WeatherContextValue | null>(null);

export function WeatherProvider({ children }: { children: React.ReactNode }) {
  const [city, setCity] = useState('Nairobi');
  const [coords, setCoords] = useState<Coordinates | null>(null);

  return (
    <WeatherContext.Provider value={{ city, coords, setCity, setCoords }}>
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeatherContext() {
  const ctx = useContext(WeatherContext);
  if (!ctx) throw new Error('useWeatherContext must be used inside WeatherProvider');
  return ctx;
}
