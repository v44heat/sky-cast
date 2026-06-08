import { CloudOff, RefreshCw, WifiOff, MapPinOff, SearchX } from 'lucide-react';
import { cn } from '@/utils/helpers';

type ErrorType = 'notFound' | 'network' | 'location' | 'api' | 'generic';

interface ErrorStateProps {
  type?: ErrorType;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

const errorConfig: Record<ErrorType, { icon: React.ElementType; title: string; desc: string }> = {
  notFound: {
    icon: SearchX,
    title: 'City Not Found',
    desc: 'We couldn\'t find that city. Please check the spelling and try again.',
  },
  network: {
    icon: WifiOff,
    title: 'No Internet Connection',
    desc: 'Please check your internet connection and try again.',
  },
  location: {
    icon: MapPinOff,
    title: 'Location Unavailable',
    desc: 'Location access was denied or unavailable. Search for your city instead.',
  },
  api: {
    icon: CloudOff,
    title: 'Service Unavailable',
    desc: 'Weather data is temporarily unavailable. Please try again in a moment.',
  },
  generic: {
    icon: CloudOff,
    title: 'Something Went Wrong',
    desc: 'An unexpected error occurred. Please try again.',
  },
};

function getErrorType(message?: string): ErrorType {
  if (!message) return 'generic';
  if (message.includes('404') || message.includes('city not found')) return 'notFound';
  if (message.includes('network') || message.includes('Network')) return 'network';
  if (message.includes('location') || message.includes('geolocation')) return 'location';
  return 'api';
}

export function ErrorState({ type, message, onRetry, className }: ErrorStateProps) {
  const resolvedType = type ?? getErrorType(message);
  const config = errorConfig[resolvedType];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-16 px-6 text-center',
        className
      )}
    >
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-sky-100 dark:bg-navy-700">
        <Icon className="h-8 w-8 text-sky-500" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white">
        {config.title}
      </h3>
      <p className="mb-6 max-w-sm text-sm text-gray-500 dark:text-gray-400">
        {message && resolvedType !== 'generic' ? message : config.desc}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-sky-600 active:scale-95"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </button>
      )}
    </div>
  );
}
