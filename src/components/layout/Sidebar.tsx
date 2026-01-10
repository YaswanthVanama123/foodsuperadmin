import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Users,
  CreditCard,
  Package,
  BarChart3,
  Bell,
  Settings,
  FileText,
  HeadphonesIcon,
  Crown,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Restaurants', path: '/restaurants', icon: Building2 },
  { name: 'Admins', path: '/admins', icon: Users },
  { name: 'Subscriptions', path: '/subscriptions', icon: CreditCard },
  { name: 'Plans', path: '/plans', icon: Package },
  { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  { name: 'Notifications', path: '/notifications', icon: Bell },
  { name: 'Settings', path: '/settings', icon: Settings },
  { name: 'Audit Logs', path: '/audit-logs', icon: FileText },
  { name: 'Support', path: '/support', icon: HeadphonesIcon },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 z-40 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-gradient-to-b from-violet-950 via-violet-900 to-purple-950 border-r border-violet-800/30
          transform transition-transform duration-300 ease-in-out
          lg:relative lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Brand */}
          <div className="flex items-center justify-center h-16 border-b border-violet-800/30 px-6 bg-violet-950/50">
            <div className="flex items-center gap-2">
              <Crown className="w-6 h-6 text-yellow-400" />
              <h1 className="text-xl font-bold bg-gradient-to-r from-violet-200 via-purple-200 to-pink-200 bg-clip-text text-transparent">
                PATLINKS ADMIN
              </h1>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-violet-700 scrollbar-track-transparent">
            <ul className="space-y-1 px-3">
              {navItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    end={item.path === '/'}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                        isActive
                          ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white font-medium shadow-lg shadow-violet-500/30'
                          : 'text-violet-200 hover:bg-violet-800/40 hover:text-white'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <item.icon
                          className={`w-5 h-5 transition-transform duration-200 ${
                            isActive ? 'scale-110' : 'group-hover:scale-105'
                          }`}
                        />
                        <span>{item.name}</span>
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer */}
          <div className="border-t border-violet-800/30 p-4 bg-violet-950/50">
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <p className="text-xs text-violet-300">
                Super Admin Portal
              </p>
            </div>
            <p className="text-xs text-violet-400/60 text-center mt-1">
              Patlinks v1.0.0
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
