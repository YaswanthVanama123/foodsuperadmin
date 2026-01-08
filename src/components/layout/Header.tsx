import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Menu, ChevronDown, Shield } from 'lucide-react';
import { useAuth } from '../../hooks';
import Button from '../ui/Button';

interface HeaderProps {
  onMenuToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const { superAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 h-16 sticky top-0 z-30 shadow-sm">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Left section - Mobile menu button + Title */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-lg hover:bg-violet-50 transition-colors group"
            aria-label="Toggle menu"
          >
            <Menu className="w-6 h-6 text-gray-700 group-hover:text-violet-600" />
          </button>

          <div className="hidden sm:flex items-center gap-2">
            <Shield className="w-5 h-5 text-violet-600" />
            <h2 className="text-lg font-semibold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              Super Admin Portal
            </h2>
          </div>
        </div>

        {/* Right section - Admin info + Logout */}
        <div className="flex items-center gap-4">
          {superAdmin && (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="hidden md:flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-violet-50 transition-all duration-200 group"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-purple-600 text-white font-semibold text-sm shadow-md">
                  {superAdmin.username?.charAt(0).toUpperCase() || 'SA'}
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-semibold text-gray-800 group-hover:text-violet-600 transition-colors">
                    {superAdmin.username}
                  </span>
                  <span className="text-xs text-violet-600 font-medium">
                    Super Admin
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-violet-600 transition-transform duration-200" />
              </button>

              {/* Dropdown menu */}
              {showDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowDropdown(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-20">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">
                        {superAdmin.username}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {superAdmin.email}
                      </p>
                    </div>
                    <div className="px-2 py-2">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Mobile logout button */}
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="md:hidden flex items-center gap-2 border-violet-600 text-violet-600 hover:bg-violet-50"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
