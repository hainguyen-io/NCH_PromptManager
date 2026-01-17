import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Category, Prompt, User, ViewName } from './types';

// --- Helpers ---
const generateId = () => Math.random().toString(36).substr(2, 9);
const getInitials = (name: string) => name.substring(0, 2).toUpperCase();

// --- Seed Data ---
const seedCategories: Category[] = [
  { id: 'cat_1', name: 'Coding', color: '#3b82f6' },
  { id: 'cat_2', name: 'Writing', color: '#10b981' },
  { id: 'cat_3', name: 'Marketing', color: '#f59e0b' },
  { id: 'cat_4', name: 'Productivity', color: '#8b5cf6' },
];

const seedPrompts: Prompt[] = [
  {
    id: 'p_1',
    title: 'React Component Generator',
    description: 'Generate a functional React component with Tailwind CSS.',
    content: 'Act as an expert React developer. Create a [Component Name] component using React, TypeScript, and Tailwind CSS. Ensure it is responsive and accessible.',
    categoryId: 'cat_1',
    tags: ['react', 'typescript', 'frontend'],
    viewCount: 120,
    author: 'System',
    createdAt: Date.now(),
    isFavorite: true,
  },
  {
    id: 'p_2',
    title: 'SEO Blog Post Outliner',
    description: 'Create a structured outline for an SEO-optimized blog post.',
    content: 'Create a comprehensive outline for a blog post about [Topic]. Include H2 and H3 headings, key points for each section, and suggested keywords to target.',
    categoryId: 'cat_3',
    tags: ['seo', 'content', 'marketing'],
    viewCount: 85,
    author: 'System',
    createdAt: Date.now(),
    isFavorite: false,
  },
  {
    id: 'p_3',
    title: 'Email Professionalizer',
    description: 'Rewrite casual emails to be professional and polite.',
    content: 'Rewrite the following email to be professional, concise, and polite, while maintaining a firm tone: \n\n[Insert Draft]',
    categoryId: 'cat_2',
    tags: ['email', 'business', 'writing'],
    viewCount: 200,
    author: 'System',
    createdAt: Date.now(),
    isFavorite: false,
  }
];

// --- Stores ---

interface UIState {
  darkMode: boolean;
  currentView: ViewName;
  toastMessage: string | null;
  toggleDarkMode: () => void;
  setView: (view: ViewName) => void;
  showToast: (message: string) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      darkMode: false,
      currentView: 'HOME',
      toastMessage: null,
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      setView: (view) => set({ currentView: view }),
      showToast: (message) => {
        set({ toastMessage: message });
        setTimeout(() => set({ toastMessage: null }), 3000);
      },
    }),
    {
      name: 'promptvault-ui',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ darkMode: state.darkMode }), // Only persist theme
    }
  )
);

interface UserState {
  user: User;
  setUser: (name: string) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: { name: 'Guest', avatarInitials: 'GU' },
      setUser: (name) => set({ user: { name, avatarInitials: getInitials(name) } }),
    }),
    { name: 'promptvault-user' }
  )
);

interface CategoryState {
  categories: Category[];
  addCategory: (category: Omit<Category, 'id'>) => void;
  deleteCategory: (id: string) => void;
  resetCategories: () => void;
  importCategories: (data: Category[]) => void;
}

export const useCategoryStore = create<CategoryState>()(
  persist(
    (set) => ({
      categories: seedCategories,
      addCategory: (cat) => set((state) => ({ 
        categories: [...state.categories, { ...cat, id: generateId() }] 
      })),
      deleteCategory: (id) => set((state) => ({
        categories: state.categories.filter((c) => c.id !== id),
      })),
      resetCategories: () => set({ categories: seedCategories }),
      importCategories: (data) => set((state) => {
        // Merge strategy: chỉ add categories có ID chưa tồn tại
        const existingIds = new Set(state.categories.map(c => c.id));
        const newCategories = data.filter(c => !existingIds.has(c.id));
        return { categories: [...state.categories, ...newCategories] };
      }),
    }),
    { name: 'promptvault-categories' }
  )
);

interface PromptState {
  prompts: Prompt[];
  addPrompt: (prompt: Omit<Prompt, 'id' | 'viewCount' | 'createdAt'>) => void;
  updatePrompt: (id: string, updates: Partial<Prompt>) => void;
  deletePrompt: (id: string) => void;
  incrementViewCount: (id: string) => void;
  toggleFavorite: (id: string) => void;
  importPrompts: (data: Prompt[]) => void;
  resetPrompts: () => void;
}

export const usePromptStore = create<PromptState>()(
  persist(
    (set) => ({
      prompts: seedPrompts,
      addPrompt: (promptData) => set((state) => ({
        prompts: [
          {
            ...promptData,
            id: generateId(),
            viewCount: 0,
            createdAt: Date.now(),
          },
          ...state.prompts,
        ],
      })),
      updatePrompt: (id, updates) => set((state) => ({
        prompts: state.prompts.map((p) => (p.id === id ? { ...p, ...updates } : p)),
      })),
      deletePrompt: (id) => set((state) => ({
        prompts: state.prompts.filter((p) => p.id !== id),
      })),
      incrementViewCount: (id) => set((state) => ({
        prompts: state.prompts.map((p) => 
          p.id === id ? { ...p, viewCount: p.viewCount + 1 } : p
        ),
      })),
      toggleFavorite: (id) => set((state) => ({
        prompts: state.prompts.map((p) =>
          p.id === id ? { ...p, isFavorite: !p.isFavorite } : p
        )
      })),
      importPrompts: (data) => set((state) => {
        // Simple merge strategy: append new ones, avoid exact ID duplicates
        const existingIds = new Set(state.prompts.map(p => p.id));
        const newPrompts = data.filter(p => !existingIds.has(p.id));
        return { prompts: [...state.prompts, ...newPrompts] };
      }),
      resetPrompts: () => set({ prompts: seedPrompts }),
    }),
    { name: 'promptvault-prompts' }
  )
);
