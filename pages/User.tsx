import React, { useState } from 'react';
import { UserCircle, Save } from 'lucide-react';
import { useUserStore, useUIStore } from '../store';

const User = () => {
  const { user, setUser } = useUserStore();
  const { showToast } = useUIStore();
  const [nameInput, setNameInput] = useState(user.name);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim()) {
      setUser(nameInput.trim());
      showToast('Profile updated!');
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-8 pb-10 px-4 sm:px-0">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Profile Settings</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Manage your local identity</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300 flex items-center justify-center text-3xl font-bold mb-4">
            {user.avatarInitials}
          </div>
          <p className="text-sm text-gray-500">Local User</p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Display Name</label>
            <div className="relative rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <UserCircle className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full rounded-md border-gray-300 dark:border-gray-600 pl-10 focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-900 dark:text-white px-3 py-2 border"
                placeholder="Enter your name"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
              />
            </div>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              This name is stored locally and displayed on your prompts.
            </p>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default User;
