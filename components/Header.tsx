import React, { useState } from 'react';
import { Menu, X, Layout, Library, BookMarked, Layers, Settings, UserCircle, Search, Shield, LogOut } from 'lucide-react';
import { useUIStore, useAuthStore } from '../store';
import { ViewName } from '../types';
import { logoutUser } from '../services/authService';

const APP_VERSION = 'v1.0.1';

const Header = () => {
  const { currentView, setView, setToastMessage } = useUIStore();
  const { userProfile, firebaseUser } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems: { view: ViewName; label: string; icon: React.ElementType }[] = [
    { view: 'HOME', label: 'Home', icon: Layout },
    { view: 'LIBRARY', label: 'Library', icon: Library },
    { view: 'MY_PROMPTS', label: 'My Prompts', icon: BookMarked },
    { view: 'CATEGORIES', label: 'Categories', icon: Layers },
  ];

  // Add admin link if user is admin
  if (userProfile?.role === 'admin') {
    navItems.push({ view: 'ADMIN', label: 'Admin', icon: Shield });
  }

  // Handle logout
  const handleLogout = async () => {
    try {
      await logoutUser();
      setToastMessage('Logged out successfully');
    } catch (error: any) {
      console.error('Logout error:', error);
      setToastMessage('Error logging out');
    }
  };

  const handleNavClick = (view: ViewName) => {
    setView(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => handleNavClick('HOME')}>
            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center mr-2">
              <span className="text-white font-bold text-xl">P</span>
            </div>
            <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">PromptVault</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-4">
            {navItems.map((item) => (
              <button
                key={item.view}
                onClick={() => handleNavClick(item.view)}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === item.view
                    ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/20 dark:text-primary-400'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800'
                }`}
              >
                <item.icon className="w-4 h-4 mr-2" />
                {item.label}
              </button>
            ))}
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => setView('SETTINGS')}
              className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
                currentView === 'SETTINGS' ? 'text-primary-600' : 'text-gray-500 dark:text-gray-400'
              }`}
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={handleLogout}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 dark:text-gray-400"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
            <button
              onClick={() => setView('USER')}
              className="flex items-center space-x-2 p-1 pl-2 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                {userProfile?.name || firebaseUser?.email || 'User'}
              </span>
              <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300 flex items-center justify-center font-bold text-xs">
                {userProfile?.avatarInitials || (firebaseUser?.email?.[0]?.toUpperCase() || 'U')}
              </div>
            </button>
            <span className="text-xs text-gray-400 dark:text-gray-500 font-mono">{APP_VERSION}</span>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none dark:hover:bg-gray-800"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <button
                key={item.view}
                onClick={() => handleNavClick(item.view)}
                className={`flex items-center w-full px-3 py-4 rounded-md text-base font-medium ${
                  currentView === item.view
                    ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/20 dark:text-primary-400'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
              </button>
            ))}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 pb-2">
               <button
                onClick={() => handleNavClick('SETTINGS')}
                className="flex items-center w-full px-3 py-3 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                <Settings className="w-5 h-5 mr-3" />
                Settings
              </button>
               <button
                onClick={() => handleNavClick('USER')}
                className="flex items-center w-full px-3 py-3 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                <UserCircle className="w-5 h-5 mr-3" />
                Profile ({userProfile?.name || firebaseUser?.email || 'User'})
              </button>
               <button
                onClick={handleLogout}
                className="flex items-center w-full px-3 py-3 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-gray-800"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Logout
              </button>
              <div className="px-3 py-2">
                <span className="text-xs text-gray-400 dark:text-gray-500 font-mono">{APP_VERSION}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
