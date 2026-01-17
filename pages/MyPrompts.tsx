import React, { useState } from 'react';
import { Plus, Save, X, BookMarked } from 'lucide-react';
import { usePromptStore, useCategoryStore, useUserStore, useUIStore } from '../store';
import PromptCard from '../components/PromptCard';
import PromptModal from '../components/PromptModal';
import { Prompt } from '../types';

const MyPrompts = () => {
  const { prompts, addPrompt, updatePrompt, deletePrompt } = usePromptStore();
  const { categories } = useCategoryStore();
  const { user } = useUserStore();
  const { showToast } = useUIStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    description: '',
    categoryId: '',
    tags: '',
  });
  
  const myPrompts = prompts; 

  const getCategory = (id: string) => categories.find(c => c.id === id);

  const closeForm = () => {
    setFormData({ title: '', content: '', description: '', categoryId: categories[0]?.id || '', tags: '' });
    setEditId(null);
    setIsEditing(false);
  };

  const openNewForm = () => {
    setFormData({ 
      title: '', 
      content: '', 
      description: '', 
      categoryId: categories[0]?.id || '', 
      tags: '' 
    });
    setEditId(null);
    setIsEditing(true);
  };

  const handleEdit = (prompt: Prompt) => {
    setFormData({
      title: prompt.title,
      content: prompt.content,
      description: prompt.description || '',
      categoryId: prompt.categoryId,
      tags: prompt.tags.join(', '),
    });
    setEditId(prompt.id);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this prompt?')) {
      deletePrompt(id);
      // If we are currently editing the prompt that is being deleted, close the form
      if (editId === id) {
        closeForm();
      }
      showToast('Prompt deleted.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;

    const tagsArray = formData.tags.split(',').map(t => t.trim()).filter(t => t);
    const finalCategoryId = formData.categoryId || categories[0]?.id || 'uncategorized';

    if (editId) {
      updatePrompt(editId, {
        title: formData.title,
        content: formData.content,
        description: formData.description,
        categoryId: finalCategoryId,
        tags: tagsArray,
      });
      showToast('Prompt updated successfully.');
    } else {
      addPrompt({
        title: formData.title,
        content: formData.content,
        description: formData.description,
        categoryId: finalCategoryId,
        tags: tagsArray,
        author: user.name,
        isFavorite: false,
      });
      showToast('Prompt created successfully.');
    }
    closeForm();
  };

  return (
    <div className="space-y-8 pb-10 px-4 sm:px-0">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <BookMarked className="w-6 h-6 text-primary-500" />
          My Prompts
        </h2>
        {!isEditing && (
          <button
            onClick={openNewForm}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none"
          >
            <Plus className="w-5 h-5 mr-1" />
            New Prompt
          </button>
        )}
      </div>

      {/* Editor Form */}
      {isEditing && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 animate-[fadeIn_0.3s_ease-out]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {editId ? 'Edit Prompt' : 'Create New Prompt'}
            </h3>
            <button onClick={closeForm} className="text-gray-400 hover:text-gray-500">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-900 dark:text-white px-3 py-2 border"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-900 dark:text-white px-3 py-2 border"
                  value={formData.categoryId}
                  onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                >
                  <option value="" disabled>Select a category</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description (Optional)</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-900 dark:text-white px-3 py-2 border"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Content</label>
              <textarea
                required
                rows={6}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-900 dark:text-white px-3 py-2 border font-mono text-sm"
                value={formData.content}
                onChange={e => setFormData({ ...formData, content: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tags (comma separated)</label>
              <input
                type="text"
                placeholder="react, coding, productivity"
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-900 dark:text-white px-3 py-2 border"
                value={formData.tags}
                onChange={e => setFormData({ ...formData, tags: e.target.value })}
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100 dark:border-gray-700">
              <button
                type="button"
                onClick={closeForm}
                className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Prompt
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      <div className="grid grid-cols-1 gap-4">
        {myPrompts.length > 0 ? (
          myPrompts.map(prompt => (
            <PromptCard
              key={prompt.id}
              prompt={prompt}
              category={getCategory(prompt.categoryId)}
              onClick={() => setSelectedPrompt(prompt)}
              onEdit={() => handleEdit(prompt)}
              onDelete={() => handleDelete(prompt.id)}
            />
          ))
        ) : (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
            <p className="text-gray-500">You haven't added any prompts yet.</p>
          </div>
        )}
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

export default MyPrompts;