import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import Home from './pages/Home';
import Library from './pages/Library';
import MyPrompts from './pages/MyPrompts';
import Categories from './pages/Categories';
import Settings from './pages/Settings';
import User from './pages/User';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Pending from './pages/Pending';
import AccessDenied from './pages/AccessDenied';
import LoadingScreen from './components/LoadingScreen';
import { useUIStore, useAuthStore } from './store';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from './services/firebase';
import { UserProfile } from './types';

// Toast Component
const Toast = ({ message }: { message: string }) => (
  <div className="fixed bottom-6 right-6 z-[200] animate-[slideInUp_0.3s_ease-out]">
    <div className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-3 rounded-lg shadow-lg text-sm font-medium flex items-center">
      {message}
    </div>
  </div>
);

function App() {
  const { currentView, darkMode, toastMessage } = useUIStore();
  const { firebaseUser, userProfile, isLoading, isApproved } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Handle Dark Mode Effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Check authentication state
  useEffect(() => {
    if (!isLoading) {
      setIsChecking(false);
    }
  }, [isLoading]);

  // Real-time user profile listener - tự động update khi status thay đổi
  useEffect(() => {
    if (!firebaseUser) return;

    // Listen for real-time changes to user profile
    const unsubscribe = onSnapshot(
      doc(db, 'users', firebaseUser.uid),
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const updatedProfile = { ...docSnapshot.data(), id: docSnapshot.id } as UserProfile;
          
          // Update user profile in store
          useAuthStore.getState().setUserProfile(updatedProfile);
          
          // Update isApproved status
          const isApproved = updatedProfile.status === 'approved';
          useAuthStore.setState({ isApproved });
          
          console.log('User profile updated in real-time:', {
            status: updatedProfile.status,
            isApproved,
          });
        }
      },
      (error) => {
        console.error('Error listening to user profile:', error);
      }
    );

    return () => unsubscribe();
  }, [firebaseUser]);

  // Timeout fallback - nếu loading quá lâu, force show login
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isChecking || isLoading) {
        console.warn('Loading timeout - forcing login screen');
        setIsChecking(false);
        // Force set loading to false nếu Firebase chưa respond
        if (isLoading) {
          useAuthStore.setState({ isLoading: false });
        }
      }
    }, 5000); // 5 seconds timeout

    return () => clearTimeout(timeout);
  }, [isChecking, isLoading]);

  // Debug logging
  useEffect(() => {
    console.log('App State:', {
      isChecking,
      isLoading,
      hasFirebaseUser: !!firebaseUser,
      userProfileStatus: userProfile?.status,
      isApproved,
    });
  }, [isChecking, isLoading, firebaseUser, userProfile, isApproved]);

  // Error boundary effect
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Global error:', event.error);
      setError(event.error?.message || 'An error occurred');
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  // Show error if any
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center space-y-4 p-8">
          <h1 className="text-2xl font-bold text-red-600">Error</h1>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  // Show loading while checking auth
  if (isChecking || isLoading) {
    return <LoadingScreen />;
  }

  // Not authenticated - show login
  if (!firebaseUser) {
    return <Login />;
  }

  // User not approved yet
  if (userProfile?.status === 'pending') {
    return <Pending userProfile={userProfile} />;
  }

  // User rejected
  if (userProfile?.status === 'rejected') {
    return <AccessDenied userProfile={userProfile} />;
  }

  // Approved user - show app
  if (isApproved && userProfile?.status === 'approved') {
    // View Router
    const renderView = () => {
      switch (currentView) {
        case 'HOME':
          return <Home />;
        case 'LIBRARY':
          return <Library />;
        case 'MY_PROMPTS':
          return <MyPrompts />;
        case 'CATEGORIES':
          return <Categories />;
        case 'SETTINGS':
          return <Settings />;
        case 'USER':
          return <User />;
        case 'ADMIN':
          return <Admin />;
        default:
          return <Home />;
      }
    };

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-200">
        <Header />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-[fadeIn_0.3s_ease-out]">
            {renderView()}
          </div>
        </main>

        {toastMessage && <Toast message={toastMessage} />}

        {/* Global styles for simple animations */}
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideInUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
        `}</style>
      </div>
    );
  }

  // Fallback
  return <LoadingScreen />;
}

export default App;
