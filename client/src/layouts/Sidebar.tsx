import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';
import { LayoutDashboard, Users, Settings, CalendarDays, AlertTriangle, Building } from 'lucide-react';

export const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const isAdmin = user.roles.includes('ADMIN');
  const isStaff = user.roles.includes('STAFF');
  const canManageUsers = isAdmin || isStaff;

  const links = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Bookings', path: '/bookings', icon: CalendarDays },
    { name: 'Report Incident', path: '/incidents/new', icon: AlertTriangle },
    ...(isAdmin ? [{ name: 'Facilities', path: '/dashboard/admin/facilities', icon: Building }] : []),
    ...(canManageUsers ? [{ name: 'Users', path: '/users', icon: Users }] : []),
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 border-r border-slate-200 bg-white px-4 py-6 hidden md:block shrink-0 h-[calc(100vh-64px)] overflow-y-auto">
      <nav className="space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname.startsWith(link.path) && (link.path !== '/dashboard' || location.pathname === '/dashboard');
          
          return (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive 
                  ? 'bg-cyan-50 text-cyan-700' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              )}
            >
              <Icon className={cn('h-5 w-5', isActive ? 'text-cyan-700' : 'text-slate-400')} />
              {link.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
