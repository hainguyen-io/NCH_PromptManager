import React, { useEffect } from 'react';
import Header from './components/Header';
import Home from './pages/Home';
import Library from './pages/Library';
import MyPrompts from './pages/MyPrompts';
import Categories from './pages/Categories';
import Settings from './pages/Settings';
import User from './pages/User';
import { useUIStore } from './store';

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

  // Handle Dark Mode Effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

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

export default App;
