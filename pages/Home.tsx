import React, { useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { usePromptStore, useCategoryStore, useUIStore } from '../store';
import PromptCard from '../components/PromptCard';
import PromptModal from '../components/PromptModal';
import { Prompt } from '../types';

const Home = () => {
  const { prompts } = usePromptStore();
  const { categories } = useCategoryStore();
  const { setView } = useUIStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);

  // Get top prompts by view count
  const topPrompts = [...prompts]
    .filter(p => selectedCategory === 'ALL' || p.categoryId === selectedCategory)
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, 6);

  const getCategory = (id: string) => categories.find(c => c.id === id);

  return (
    <div className="space-y-12 pb-10">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-900 dark:to-gray-900 rounded-3xl overflow-hidden shadow-xl mx-4 sm:mx-0">
        <div className="relative px-6 py-16 sm:px-12 sm:py-20 lg:py-24 text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
            Master Your Workflow with <br className="hidden sm:block" />
            <span className="text-primary-200">The Perfect Prompt.</span>
          </h1>
          <p className="mt-4 text-lg text-primary-100 max-w-2xl mx-auto sm:mx-0">
            PromptVault is your personal offline library for storing, organizing, and discovering AI prompts to boost your productivity.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center sm:justify-start">
            <button 
              onClick={() => setView('LIBRARY')}
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-primary-700 bg-white hover:bg-gray-50 md:text-lg transition-transform hover:scale-105"
            >
              Browse Library
            </button>
            <button 
              onClick={() => setView('MY_PROMPTS')}
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-primary-500/30 hover:bg-primary-500/40 backdrop-blur-sm md:text-lg transition-colors"
            >
              Manage My Prompts
            </button>
          </div>
        </div>
        {/* Decorative circle */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none"></div>
      </div>

      {/* Popular Prompts Section */}
      <div className="px-4 sm:px-0">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="text-yellow-500 w-6 h-6" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Trending Prompts</h2>
          </div>
          
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="block w-full sm:w-48 pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-lg dark:bg-gray-800 dark:text-white"
            >
              <option value="ALL">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            
            <button 
              onClick={() => setView('LIBRARY')}
              className="hidden sm:flex items-center text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
            >
              View all <ArrowRight className="ml-1 w-4 h-4" />
            </button>
          </div>
        </div>

        {topPrompts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topPrompts.map(prompt => (
              <PromptCard 
                key={prompt.id} 
                prompt={prompt} 
                category={getCategory(prompt.categoryId)}
                onClick={() => setSelectedPrompt(prompt)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400">No prompts found in this category.</p>
          </div>
        )}
        
        <button 
          onClick={() => setView('LIBRARY')}
          className="mt-6 w-full sm:hidden flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          View all prompts <ArrowRight className="ml-2 w-4 h-4" />
        </button>
      </div>

      {selectedPrompt && (
        <PromptModal 
          prompt={selectedPrompt} 
          category={getCategory(selectedPrompt.categoryId)}
          onClose={() => setSelectedPrompt(null)} 
        />
      )}
    </div>
  );
};

export default Home;
