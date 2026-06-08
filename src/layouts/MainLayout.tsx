import { Outlet } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { cn } from '@/utils/helpers';

export function MainLayout() {
  return (
    <div className={cn(
      'min-h-screen transition-colors duration-300',
      'bg-gradient-to-br from-sky-50 via-white to-blue-50',
      'dark:from-navy-900 dark:via-navy-800 dark:to-navy-900'
    )}>
      {/* Decorative background blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10" aria-hidden>
        <div className="absolute top-0 -right-32 h-[600px] w-[600px] rounded-full bg-sky-200/30 dark:bg-sky-900/10 blur-3xl" />
        <div className="absolute bottom-0 -left-32 h-[500px] w-[500px] rounded-full bg-blue-200/30 dark:bg-blue-900/10 blur-3xl" />
      </div>

      <Navbar />
      <Outlet />
    </div>
  );
}
