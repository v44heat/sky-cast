import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LocateFixed, Loader2, Menu, X, Cloud, BarChart3, Settings, Star } from 'lucide-react';
import { SearchBar } from './SearchBar';
import { ThemeToggle } from './ThemeToggle';
import { useGeolocation } from '@/hooks/useLocalStorage';
import { useWeatherContext } from '@/context/WeatherContext';
import { reverseGeocode } from '@/services/weatherApi';
import { cn } from '@/utils/helpers';

const navLinks = [
  { to: '/', label: 'Weather', icon: Cloud },
  { to: '/charts', label: 'Charts', icon: BarChart3 },
  { to: '/favorites', label: 'Favorites', icon: Star },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export function Navbar() {
  const location = useLocation();
  const { setCity, setCoords } = useWeatherContext();
  const { getLocation, loading: geoLoading } = useGeolocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLocate = () => {
    getLocation(async (lat, lon) => {
      setCoords({ lat, lon });
      try {
        const results = await reverseGeocode(lat, lon);
        if (results.length > 0) setCity(results[0].name);
      } catch {
        // coords-only mode
      }
    });
  };

  return (
    <header className={cn(
      'sticky top-0 z-40 w-full',
      'bg-white/80 dark:bg-navy-900/80 backdrop-blur-xl',
      'border-b border-white/60 dark:border-white/5',
    )}>
      <nav className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 md:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 mr-2 shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-sky-600 shadow-lg shadow-sky-500/30">
            <Cloud className="h-4.5 w-4.5 text-white" fill="white" />
          </div>
          <span className="font-display text-xl font-normal text-gray-900 dark:text-white hidden sm:block">
            SkyCast
          </span>
        </Link>

        {/* Search — center */}
        <div className="flex-1 max-w-sm">
          <SearchBar />
        </div>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-1 ml-2">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={cn(
                'flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition-all',
                location.pathname === to
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-sky-50 dark:hover:bg-navy-700'
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 ml-1">
          <button
            onClick={handleLocate}
            disabled={geoLoading}
            aria-label="Use my location"
            className={cn(
              'flex h-9 items-center gap-1.5 rounded-xl px-3 text-sm font-medium transition-all',
              'bg-white/60 dark:bg-navy-700/60 border border-white/80 dark:border-white/10',
              'hover:bg-sky-50 dark:hover:bg-navy-600 text-gray-600 dark:text-gray-300',
              'hover:scale-105 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed'
            )}
          >
            {geoLoading
              ? <Loader2 className="h-4 w-4 animate-spin" />
              : <LocateFixed className="h-4 w-4 text-sky-500" />}
            <span className="hidden sm:block">Locate</span>
          </button>

          <ThemeToggle />

          {/* Mobile menu toggle */}
          <button
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/60 dark:bg-navy-700/60 border border-white/80 dark:border-white/10 md:hidden"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-4 w-4 text-gray-600 dark:text-gray-300" /> : <Menu className="h-4 w-4 text-gray-600 dark:text-gray-300" />}
          </button>
        </div>
      </nav>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/60 dark:border-white/5 px-4 py-3 flex gap-2 flex-wrap animate-fade-in">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium transition-all',
                location.pathname === to
                  ? 'bg-sky-500 text-white'
                  : 'text-gray-600 dark:text-gray-300 bg-white/60 dark:bg-navy-700/60 border border-white/80 dark:border-white/10'
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
