import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/utils/helpers';

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className={cn(
        'flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200',
        'bg-white/60 dark:bg-navy-700/60 border border-white/80 dark:border-white/10',
        'hover:bg-sky-50 dark:hover:bg-navy-600 hover:scale-105 active:scale-95',
        'text-gray-600 dark:text-gray-300',
        className
      )}
    >
      {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
