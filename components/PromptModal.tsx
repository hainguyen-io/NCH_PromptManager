import React, { useEffect } from 'react';
import { X, Copy, Tag, Calendar, User, Bookmark } from 'lucide-react';
import { Prompt, Category } from '../types';
import { usePromptStore, useUIStore, useUserStore } from '../store';
import { copyToClipboard } from '../utils/copyToClipboard';

interface PromptModalProps {
  prompt: Prompt;
  category?: Category;
  onClose: () => void;
}

const PromptModal: React.FC<PromptModalProps> = ({ prompt, category, onClose }) => {
  const { incrementViewCount, addPrompt, prompts } = usePromptStore();
  const { showToast, setView } = useUIStore();
  const { user } = useUserStore();

  useEffect(() => {
    incrementViewCount(prompt.id);
  }, [prompt.id, incrementViewCount]);

  const handleCopy = async () => {
    const success = await copyToClipboard(prompt.content);
    if (success) {
      showToast('Prompt copied successfully!');
    } else {
      showToast('Failed to copy. Please try again or copy manually.');
    }
  };

  const handleSaveToMyPrompts = () => {
    // Check if user is author to prevent duplicates (optional logic, but good UX)
    if (prompt.author === user.name) {
       showToast("You already own this prompt!");
       return;
    }

    addPrompt({
      title: prompt.title,
      content: prompt.content,
      description: prompt.description,
      categoryId: prompt.categoryId,
      tags: prompt.tags,
      author: user.name,
      isFavorite: false,
    });
    showToast('Saved to My Prompts!');
    onClose();
    setView('MY_PROMPTS');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>
      
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col animate-[fadeIn_0.2s_ease-out]">
        
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-100 dark:border-gray-700">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span 
                className="text-xs font-bold px-2.5 py-0.5 rounded-full text-white"
                style={{ backgroundColor: category?.color || '#94a3b8' }}
              >
                {category?.name || 'Uncategorized'}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                <Calendar className="w-3 h-3 mr-1" />
                {new Date(prompt.createdAt).toLocaleDateString()}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{prompt.title}</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div>
            <label className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-2">
              Prompt Content
            </label>
            <div className="relative bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700 group">
              <pre className="whitespace-pre-wrap font-sans text-gray-800 dark:text-gray-200 text-sm leading-relaxed">
                {prompt.content}
              </pre>
              <button 
                onClick={handleCopy}
                className="absolute top-3 right-3 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                title="Copy content"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          {prompt.description && (
             <div>
               <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">Description</h4>
               <p className="text-gray-600 dark:text-gray-300 text-sm">{prompt.description}</p>
             </div>
          )}

          <div className="flex flex-wrap gap-2">
            {prompt.tags.map(tag => (
              <span key={tag} className="flex items-center px-2.5 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium">
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </span>
            ))}
          </div>

           <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 pt-2">
            <User className="w-4 h-4 mr-2" />
            Created by <span className="font-medium text-gray-900 dark:text-white ml-1">{prompt.author}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row gap-3 sm:justify-end">
          <button
            onClick={handleSaveToMyPrompts}
            className="flex-1 sm:flex-none justify-center inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-lg text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Bookmark className="w-4 h-4 mr-2" />
            Save to My Prompts
          </button>
          <button
            onClick={handleCopy}
            className="flex-1 sm:flex-none justify-center inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy Prompt
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromptModal;
