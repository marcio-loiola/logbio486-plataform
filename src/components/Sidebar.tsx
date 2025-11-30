import { Link, useLocation } from 'react-router-dom';
import { Globe, Brain, Ship, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Sidebar = () => {
  const location = useLocation();
  const pathname = location.pathname;

  const isActive = (path: string) => {
    if (path === '/ship' && pathname.startsWith('/ship')) return true;
    return pathname === path;
  };

  const navItems = [
    {
      name: 'Visão da Frota',
      path: '/dashboard', // Using /dashboard as requested for Fleet View
      icon: Globe,
    },
    {
      name: 'Predição',
      path: '/prediction',
      icon: Brain,
    },
    {
      name: 'Visão de Navio',
      path: '/ship', // This will likely redirect to a specific ship or list, but for sidebar it's a section
      icon: Ship,
    },
  ];

  return (
    <div className="h-screen w-64 bg-[#003950] flex flex-col fixed left-0 top-0 z-50 text-white">
      {/* Logo */}
      <div className="p-6 border-b border-[#004d6b]">
        <h1 className="text-2xl font-bold tracking-wider">LOGBIO</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center gap-3 px-6 py-4 transition-all duration-200 group relative",
              isActive(item.path)
                ? "bg-[#1E3A8A] text-white font-bold"
                : "text-[#CCCCCC] hover:bg-[#004d6b] hover:text-white"
            )}
          >
            {/* Active Border Indicator */}
            {isActive(item.path) && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#006159]" />
            )}

            <item.icon className={cn("h-5 w-5", isActive(item.path) ? "text-white" : "text-[#CCCCCC] group-hover:text-white")} />
            <span>{item.name}</span>
            
            {isActive(item.path) && (
              <ChevronRight className="ml-auto h-4 w-4 text-[#006159]" />
            )}
          </Link>
        ))}
      </nav>

      {/* Footer/User Info could go here */}
      <div className="p-4 text-xs text-[#CCCCCC] opacity-50 text-center">
        v1.0.0 Transpetro
      </div>
    </div>
  );
};
