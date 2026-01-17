import React from 'react';
import { Eye, Copy, Heart, Edit2, Trash2 } from 'lucide-react';
import { Prompt, Category } from '../types';
import { usePromptStore, useUIStore } from '../store';

interface PromptCardProps {
  prompt: Prompt;
  category?: Category;
  onClick: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const PromptCard: React.FC<PromptCardProps> = ({ prompt, category, onClick, onEdit, onDelete }) => {
  const { toggleFavorite } = usePromptStore();
  const { showToast } = useUIStore();

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(prompt.content);
    showToast('Prompt copied to clipboard!');
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(prompt.id);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.();
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.();
  };

  return (
    <div 
      onClick={onClick}
      className="group bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-700 transition-all duration-200 cursor-pointer flex flex-col h-full relative"
    >
      <div className="flex justify-between items-start mb-3">
        <span 
          className="text-xs font-semibold px-2 py-1 rounded-full text-white"
          style={{ backgroundColor: category?.color || '#94a3b8' }}
        >
          {category?.name || 'Uncategorized'}
        </span>
        <button 
          type="button"
          onClick={handleFavorite}
          className={`p-1.5 rounded-full transition-colors z-10 relative ${
            prompt.isFavorite 
              ? 'text-red-500 bg-red-50 dark:bg-red-900/20' 
              : 'text-gray-400 hover:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          <Heart className={`w-4 h-4 ${prompt.isFavorite ? 'fill-current' : ''}`} />
        </button>
      </div>

      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
        {prompt.title}
      </h3>
      
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 flex-grow">
        {prompt.description || prompt.content}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700 mt-auto">
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-3">
          <span className="flex items-center">
            <Eye className="w-3 h-3 mr-1" />
            {prompt.viewCount}
          </span>
          {/* Hide author on small screens if actions are present to prevent crowding */}
          <span className={`truncate max-w-[80px] ${onEdit || onDelete ? 'hidden sm:inline-block' : ''}`}>
            by {prompt.author}
          </span>
        </div>
        
        <div className="flex items-center gap-2 z-10 relative">
          {onEdit && (
            <button
              type="button"
              onClick={handleEditClick}
              className="p-1.5 rounded-md text-gray-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-gray-700 transition-colors"
              title="Edit Prompt"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}
          
          {onDelete && (
            <button
              type="button"
              onClick={handleDeleteClick}
              className="p-1.5 rounded-md text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              title="Delete Prompt"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center text-xs font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 bg-primary-50 hover:bg-primary-100 dark:bg-primary-900/30 dark:hover:bg-primary-900/50 px-2 py-1.5 rounded-md transition-colors"
          >
            <Copy className="w-3 h-3 mr-1.5" />
            Copy
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromptCard;