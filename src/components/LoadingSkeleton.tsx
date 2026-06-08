import { cn } from '@/utils/helpers';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-xl bg-sky-100/60 dark:bg-navy-700/60',
        className
      )}
    />
  );
}

export function CurrentWeatherSkeleton() {
  return (
    <div className="glass-light dark:glass-dark rounded-3xl p-6 md:p-8 space-y-4">
      <Skeleton className="h-5 w-32" />
      <Skeleton className="h-20 w-48" />
      <Skeleton className="h-5 w-40" />
      <Skeleton className="h-4 w-28" />
    </div>
  );
}

export function WeatherDetailsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {[...Array(6)].map((_, i) => (
        <Skeleton key={i} className="h-24 rounded-2xl" />
      ))}
    </div>
  );
}

export function ForecastSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className="h-16 rounded-2xl" />
      ))}
    </div>
  );
}

export function HourlySkeleton() {
  return (
    <div className="flex gap-3 overflow-hidden">
      {[...Array(8)].map((_, i) => (
        <Skeleton key={i} className="h-28 w-20 shrink-0 rounded-2xl" />
      ))}
    </div>
  );
}
