import React, { useState, useEffect } from 'react';
import { UserCircle, Save, Mail, Shield, Calendar, CheckCircle, Clock, XCircle, LogOut } from 'lucide-react';
import { useAuthStore, useUIStore } from '../store';
import { logoutUser } from '../services/authService';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

const User = () => {
  const { userProfile, firebaseUser, setUserProfile } = useAuthStore();
  const { setToastMessage } = useUIStore();
  const [nameInput, setNameInput] = useState(userProfile?.name || '');
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Update name input when userProfile changes
  useEffect(() => {
    if (userProfile?.name) {
      setNameInput(userProfile.name);
    }
  }, [userProfile]);

  // Handle save name
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim() || !firebaseUser || !userProfile) return;

    setSaving(true);
    try {
      // Update in Firestore
      await updateDoc(doc(db, 'users', firebaseUser.uid), {
        name: nameInput.trim(),
        avatarInitials: nameInput.trim().substring(0, 2).toUpperCase(),
      });

      // Update local state
      setUserProfile({
        ...userProfile,
        name: nameInput.trim(),
        avatarInitials: nameInput.trim().substring(0, 2).toUpperCase(),
      });

      setToastMessage('Profile updated successfully!');
      setIsEditing(false);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setToastMessage('Error updating profile');
    } finally {
      setSaving(false);
    }
  };

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

  // Format date
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get status badge
  const getStatusBadge = () => {
    if (!userProfile) return null;

    const status = userProfile.status;
    if (status === 'pending') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
          <Clock className="w-4 h-4 mr-1" />
          Pending Approval
        </span>
      );
    }
    if (status === 'approved') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
          <CheckCircle className="w-4 h-4 mr-1" />
          Approved
        </span>
      );
    }
    if (status === 'rejected') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
          <XCircle className="w-4 h-4 mr-1" />
          Rejected
        </span>
      );
    }
    return null;
  };

  if (!userProfile || !firebaseUser) {
    return (
      <div className="max-w-xl mx-auto text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-8 pb-10 px-4 sm:px-0">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Profile Settings</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Manage your account information</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300 flex items-center justify-center text-3xl font-bold mb-4">
            {userProfile.avatarInitials}
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {userProfile.name}
          </h3>
          {getStatusBadge()}
        </div>

        {/* User Info */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <Mail className="w-5 h-5 text-gray-400 mr-3" />
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Email</div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {userProfile.email}
              </div>
            </div>
          </div>

          <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <Shield className="w-5 h-5 text-gray-400 mr-3" />
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Role</div>
              <div className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                {userProfile.role}
              </div>
            </div>
          </div>

          <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <Calendar className="w-5 h-5 text-gray-400 mr-3" />
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Account Created</div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {formatDate(userProfile.createdAt)}
              </div>
            </div>
          </div>

          {userProfile.approvedAt && (
            <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Approved On</div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatDate(userProfile.approvedAt)}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Edit Name Form */}
        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Display Name
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <UserCircle className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full rounded-md border-gray-300 dark:border-gray-600 pl-10 focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-900 dark:text-white px-3 py-2 border"
                placeholder="Enter your name"
                value={nameInput}
                onChange={(e) => {
                  setNameInput(e.target.value);
                  setIsEditing(true);
                }}
                disabled={saving}
              />
            </div>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              This name will be displayed on your prompts and profile.
            </p>
          </div>

          {isEditing && (
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving || !nameInput.trim()}
                className="flex-1 flex justify-center items-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setNameInput(userProfile.name);
                  setIsEditing(false);
                }}
                disabled={saving}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          )}
        </form>

        {/* Logout Button */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full flex justify-center items-center py-2 px-4 border border-red-300 dark:border-red-700 rounded-lg shadow-sm text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default User;
