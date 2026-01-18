import React from 'react';
import { XCircle, LogOut } from 'lucide-react';
import { UserProfile } from '../types';
import { logoutUser } from '../services/authService';

interface AccessDeniedProps {
  userProfile: UserProfile;
}

const AccessDenied: React.FC<AccessDeniedProps> = ({ userProfile }) => {
  const handleLogout = async () => {
    await logoutUser();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="bg-red-50 dark:bg-red-900/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto">
          <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Access Denied
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Your access request has been denied by the administrator.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-3 text-left">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
            <p className="font-medium text-gray-900 dark:text-white">{userProfile.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
            <p className="font-medium text-gray-900 dark:text-white">{userProfile.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
              Rejected
            </span>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            If you believe this is an error, please contact the administrator.
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default AccessDenied;
