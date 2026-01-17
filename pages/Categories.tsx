import React, { useState } from 'react';
import { Layers, Plus, Trash2, AlertCircle } from 'lucide-react';
import { useCategoryStore, usePromptStore, useUIStore } from '../store';
import { Category } from '../types';

const Categories = () => {
  const { categories, addCategory, deleteCategory } = useCategoryStore();
  const { prompts } = usePromptStore();
  const { showToast } = useUIStore();
  
  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState('#3b82f6');
  const [isAdding, setIsAdding] = useState(false);

  // Calculate usage count for each category
  const getUsageCount = (catId: string) => prompts.filter(p => p.categoryId === catId).length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName) return;
    addCategory({ name: newCatName, color: newCatColor });
    setNewCatName('');
    setIsAdding(false);
    showToast('Category added successfully.');
  };

  const handleDelete = (id: string) => {
    const count = getUsageCount(id);
    if (count > 0) {
      alert(`Cannot delete category. It is used by ${count} prompts.`);
      return;
    }
    if (confirm('Delete this category?')) {
      deleteCategory(id);
      showToast('Category deleted.');
    }
  };

  return (
    <div className="space-y-6 pb-10 px-4 sm:px-0">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Layers className="w-6 h-6 text-primary-500" />
          Categories
        </h2>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none"
        >
          <Plus className="w-5 h-5 mr-1" />
          Add Category
        </button>
      </div>

      {isAdding && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 animate-[fadeIn_0.2s_ease-out]">
           <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 items-end">
             <div className="flex-grow w-full">
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category Name</label>
               <input
                 type="text"
                 required
                 className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-900 dark:text-white px-3 py-2 border"
                 value={newCatName}
                 onChange={e => setNewCatName(e.target.value)}
                 placeholder="e.g., Marketing"
               />
             </div>
             <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Color</label>
               <input
                type="color"
                className="h-10 w-20 rounded border border-gray-300 dark:border-gray-600 p-1 bg-white dark:bg-gray-900 cursor-pointer"
                value={newCatColor}
                onChange={e => setNewCatColor(e.target.value)}
               />
             </div>
             <button
               type="submit"
               className="w-full sm:w-auto px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 font-medium"
             >
               Save
             </button>
           </form>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(cat => {
          const count = getUsageCount(cat.id);
          return (
            <div key={cat.id} className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: cat.color }}
                ></div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{cat.name}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{count} prompts</p>
                </div>
              </div>
              <button
                onClick={() => handleDelete(cat.id)}
                className={`p-2 rounded-full transition-colors ${
                  count > 0 
                    ? 'text-gray-300 cursor-not-allowed' 
                    : 'text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                }`}
                title={count > 0 ? "Cannot delete category in use" : "Delete category"}
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-blue-800 dark:text-blue-200">
          Tip: Categories with assigned prompts cannot be deleted. You must remove or reassign the prompts first.
        </p>
      </div>
    </div>
  );
};

export default Categories;
