import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Store,
  UserPlus,
  CreditCard,
  BarChart3,
  Settings,
  Users,
  Package,
  FileText,
} from 'lucide-react';
import Button from '../ui/Button';

interface QuickAction {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  color: string;
}

const quickActions: QuickAction[] = [
  {
    title: 'Add Restaurant',
    description: 'Onboard a new restaurant to the platform',
    icon: <Store className="w-6 h-6" />,
    path: '/restaurants/new',
    color: 'from-blue-600 to-blue-700',
  },
  {
    title: 'Create Admin',
    description: 'Add a new restaurant administrator',
    icon: <UserPlus className="w-6 h-6" />,
    path: '/admins/new',
    color: 'from-green-600 to-green-700',
  },
  {
    title: 'Manage Subscriptions',
    description: 'View and manage all subscriptions',
    icon: <CreditCard className="w-6 h-6" />,
    path: '/subscriptions',
    color: 'from-purple-600 to-purple-700',
  },
  {
    title: 'View Analytics',
    description: 'Platform performance and insights',
    icon: <BarChart3 className="w-6 h-6" />,
    path: '/analytics',
    color: 'from-orange-600 to-orange-700',
  },
  {
    title: 'Manage Plans',
    description: 'Create and edit subscription plans',
    icon: <Package className="w-6 h-6" />,
    path: '/plans',
    color: 'from-violet-600 to-violet-700',
  },
  {
    title: 'View Restaurants',
    description: 'Browse all registered restaurants',
    icon: <Users className="w-6 h-6" />,
    path: '/restaurants',
    color: 'from-teal-600 to-teal-700',
  },
  {
    title: 'Support Tickets',
    description: 'Handle customer support requests',
    icon: <FileText className="w-6 h-6" />,
    path: '/support',
    color: 'from-red-600 to-red-700',
  },
  {
    title: 'Platform Settings',
    description: 'Configure platform-wide settings',
    icon: <Settings className="w-6 h-6" />,
    path: '/settings',
    color: 'from-gray-600 to-gray-700',
  },
];

export const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  const handleActionClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
        <p className="text-sm text-gray-600 mt-1">Frequently used administrative tasks</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action, index) => (
          <button
            key={index}
            onClick={() => handleActionClick(action.path)}
            className="group relative p-4 rounded-xl border-2 border-gray-200 hover:border-violet-400 transition-all duration-300 hover:shadow-lg text-left bg-gradient-to-br from-white to-gray-50 hover:from-violet-50 hover:to-purple-50"
          >
            <div
              className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r ${action.color} text-white mb-3 group-hover:scale-110 transition-transform duration-300`}
            >
              {action.icon}
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-violet-700 transition-colors">
              {action.title}
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">{action.description}</p>

            {/* Hover Arrow */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <svg
                className="w-5 h-5 text-violet-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
