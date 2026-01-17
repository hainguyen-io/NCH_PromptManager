# 🔄 QUẢN LÝ STATE - ZUSTAND STORES

## 1. TỔNG QUAN

PromptVault sử dụng **Zustand 5.0.10** để quản lý state. Ứng dụng có **4 stores độc lập**, mỗi store quản lý một domain cụ thể và có persistence middleware.

## 2. STORE ARCHITECTURE

### 2.1. Store Overview

```
┌─────────────────────────────────────────────┐
│         Zustand Stores (4 stores)            │
├─────────────────────────────────────────────┤
│                                             │
│  1. UIStore      - UI state & navigation    │
│  2. UserStore    - User profile             │
│  3. CategoryStore - Categories CRUD         │
│  4. PromptStore  - Prompts CRUD             │
│                                             │
└─────────────────────────────────────────────┘
```

### 2.2. Persistence Strategy

Tất cả stores sử dụng **Zustand persist middleware** với localStorage:

```typescript
import { persist, createJSONStorage } from 'zustand/middleware';

export const useStore = create<State>()(
  persist(
    (set) => ({ /* store logic */ }),
    { 
      name: 'storage-key',
      storage: createJSONStorage(() => localStorage)
    }
  )
);
```

## 3. UI STORE

### 3.1. Mục Đích

Quản lý UI state: dark mode, current view, toast notifications.

### 3.2. Interface

```typescript
interface UIState {
  // State
  darkMode: boolean;
  currentView: ViewName;
  toastMessage: string | null;
  
  // Actions
  toggleDarkMode: () => void;
  setView: (view: ViewName) => void;
  showToast: (message: string) => void;
}
```

### 3.3. Implementation

**File: `store.ts`**

```typescript
export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      // Initial State
      darkMode: false,
      currentView: 'HOME',
      toastMessage: null,
      
      // Actions
      toggleDarkMode: () => set((state) => ({ 
        darkMode: !state.darkMode 
      })),
      
      setView: (view) => set({ currentView: view }),
      
      showToast: (message) => {
        set({ toastMessage: message });
        setTimeout(() => set({ toastMessage: null }), 3000);
      },
    }),
    {
      name: 'promptvault-ui',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ darkMode: state.darkMode }), // Chỉ persist darkMode
    }
  )
);
```

### 3.4. Usage Examples

```typescript
// Trong component
const { darkMode, toggleDarkMode } = useUIStore();
const { currentView, setView } = useUIStore();
const { showToast } = useUIStore();

// Toggle dark mode
<button onClick={toggleDarkMode}>Toggle</button>

// Navigate
setView('LIBRARY');

// Show notification
showToast('Prompt saved!');
```

### 3.5. Persistence Details

- **Storage Key**: `promptvault-ui`
- **Persisted Data**: Chỉ `darkMode` (partialize)
- **Not Persisted**: `currentView`, `toastMessage` (temporary state)

### 3.6. View Types

```typescript
type ViewName = 
  | 'HOME' 
  | 'LIBRARY' 
  | 'MY_PROMPTS' 
  | 'CATEGORIES' 
  | 'SETTINGS' 
  | 'USER';
```

## 4. USER STORE

### 4.1. Mục Đích

Quản lý thông tin user profile (local only).

### 4.2. Interface

```typescript
interface UserState {
  user: User;
  setUser: (name: string) => void;
}

interface User {
  name: string;
  avatarInitials: string;  // 2-letter initials
}
```

### 4.3. Implementation

```typescript
// Helper function
const getInitials = (name: string) => 
  name.substring(0, 2).toUpperCase();

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      // Initial State
      user: { 
        name: 'Guest', 
        avatarInitials: 'GU' 
      },
      
      // Actions
      setUser: (name) => set({ 
        user: { 
          name, 
          avatarInitials: getInitials(name) 
        } 
      }),
    }),
    { 
      name: 'promptvault-user',
      storage: createJSONStorage(() => localStorage)
    }
  )
);
```

### 4.4. Usage Examples

```typescript
// Get user
const { user } = useUserStore();
console.log(user.name); // "Guest"
console.log(user.avatarInitials); // "GU"

// Update user
const { setUser } = useUserStore();
setUser('John Doe');
// user.name = "John Doe"
// user.avatarInitials = "JO"
```

### 4.5. Persistence Details

- **Storage Key**: `promptvault-user`
- **Persisted Data**: Toàn bộ `user` object
- **Default Value**: `{ name: 'Guest', avatarInitials: 'GU' }`

## 5. CATEGORY STORE

### 5.1. Mục Đích

Quản lý categories (CRUD operations).

### 5.2. Interface

```typescript
interface CategoryState {
  categories: Category[];
  addCategory: (category: Omit<Category, 'id'>) => void;
  deleteCategory: (id: string) => void;
  resetCategories: () => void;
}

interface Category {
  id: string;
  name: string;
  color: string;  // Hex color code
}
```

### 5.3. Seed Data

```typescript
const seedCategories: Category[] = [
  { id: 'cat_1', name: 'Coding', color: '#3b82f6' },
  { id: 'cat_2', name: 'Writing', color: '#10b981' },
  { id: 'cat_3', name: 'Marketing', color: '#f59e0b' },
  { id: 'cat_4', name: 'Productivity', color: '#8b5cf6' },
];
```

### 5.4. Implementation

```typescript
// Helper
const generateId = () => Math.random().toString(36).substr(2, 9);

export const useCategoryStore = create<CategoryState>()(
  persist(
    (set) => ({
      // Initial State
      categories: seedCategories,
      
      // Actions
      addCategory: (cat) => set((state) => ({ 
        categories: [...state.categories, { 
          ...cat, 
          id: generateId() 
        }] 
      })),
      
      deleteCategory: (id) => set((state) => ({
        categories: state.categories.filter((c) => c.id !== id),
      })),
      
      resetCategories: () => set({ categories: seedCategories }),
    }),
    { 
      name: 'promptvault-categories',
      storage: createJSONStorage(() => localStorage)
    }
  )
);
```

### 5.5. Usage Examples

```typescript
// Get categories
const { categories } = useCategoryStore();

// Add category
const { addCategory } = useCategoryStore();
addCategory({ 
  name: 'Design', 
  color: '#ef4444' 
});

// Delete category
const { deleteCategory } = useCategoryStore();
deleteCategory('cat_1');

// Reset to defaults
const { resetCategories } = useCategoryStore();
resetCategories();
```

### 5.6. Persistence Details

- **Storage Key**: `promptvault-categories`
- **Persisted Data**: Toàn bộ `categories` array
- **Default Value**: `seedCategories` (4 categories)

## 6. PROMPT STORE

### 6.1. Mục Đích

Quản lý prompts với đầy đủ CRUD operations và business logic.

### 6.2. Interface

```typescript
interface PromptState {
  // State
  prompts: Prompt[];
  
  // CRUD Actions
  addPrompt: (prompt: Omit<Prompt, 'id' | 'viewCount' | 'createdAt'>) => void;
  updatePrompt: (id: string, updates: Partial<Prompt>) => void;
  deletePrompt: (id: string) => void;
  
  // Business Logic
  incrementViewCount: (id: string) => void;
  toggleFavorite: (id: string) => void;
  importPrompts: (data: Prompt[]) => void;
  resetPrompts: () => void;
}

interface Prompt {
  id: string;
  title: string;
  content: string;
  description?: string;
  categoryId: string;
  tags: string[];
  viewCount: number;
  author: string;
  createdAt: number;
  isFavorite: boolean;
}
```

### 6.3. Seed Data

```typescript
const seedPrompts: Prompt[] = [
  {
    id: 'p_1',
    title: 'React Component Generator',
    description: 'Generate a functional React component...',
    content: 'Act as an expert React developer...',
    categoryId: 'cat_1',
    tags: ['react', 'typescript', 'frontend'],
    viewCount: 120,
    author: 'System',
    createdAt: Date.now(),
    isFavorite: true,
  },
  // ... 2 more seed prompts
];
```

### 6.4. Implementation

```typescript
export const usePromptStore = create<PromptState>()(
  persist(
    (set) => ({
      // Initial State
      prompts: seedPrompts,
      
      // Add Prompt
      addPrompt: (promptData) => set((state) => ({
        prompts: [
          {
            ...promptData,
            id: generateId(),
            viewCount: 0,
            createdAt: Date.now(),
          },
          ...state.prompts,  // Add to beginning
        ],
      })),
      
      // Update Prompt
      updatePrompt: (id, updates) => set((state) => ({
        prompts: state.prompts.map((p) => 
          p.id === id ? { ...p, ...updates } : p
        ),
      })),
      
      // Delete Prompt
      deletePrompt: (id) => set((state) => ({
        prompts: state.prompts.filter((p) => p.id !== id),
      })),
      
      // Increment View Count
      incrementViewCount: (id) => set((state) => ({
        prompts: state.prompts.map((p) => 
          p.id === id ? { ...p, viewCount: p.viewCount + 1 } : p
        ),
      })),
      
      // Toggle Favorite
      toggleFavorite: (id) => set((state) => ({
        prompts: state.prompts.map((p) =>
          p.id === id ? { ...p, isFavorite: !p.isFavorite } : p
        )
      })),
      
      // Import Prompts (Merge Strategy)
      importPrompts: (data) => set((state) => {
        const existingIds = new Set(state.prompts.map(p => p.id));
        const newPrompts = data.filter(p => !existingIds.has(p.id));
        return { prompts: [...state.prompts, ...newPrompts] };
      }),
      
      // Reset to Seed Data
      resetPrompts: () => set({ prompts: seedPrompts }),
    }),
    { 
      name: 'promptvault-prompts',
      storage: createJSONStorage(() => localStorage)
    }
  )
);
```

### 6.5. Usage Examples

```typescript
// Get prompts
const { prompts } = usePromptStore();

// Add prompt
const { addPrompt } = usePromptStore();
addPrompt({
  title: 'New Prompt',
  content: 'Prompt content...',
  description: 'Description',
  categoryId: 'cat_1',
  tags: ['tag1', 'tag2'],
  author: 'John',
  isFavorite: false,
});

// Update prompt
const { updatePrompt } = usePromptStore();
updatePrompt('p_1', { title: 'Updated Title' });

// Delete prompt
const { deletePrompt } = usePromptStore();
deletePrompt('p_1');

// Increment view count
const { incrementViewCount } = usePromptStore();
incrementViewCount('p_1');

// Toggle favorite
const { toggleFavorite } = usePromptStore();
toggleFavorite('p_1');

// Import prompts
const { importPrompts } = usePromptStore();
importPrompts([...promptsArray]);

// Reset
const { resetPrompts } = usePromptStore();
resetPrompts();
```

### 6.6. Business Logic Details

#### 6.6.1. Add Prompt
- Tự động generate `id`
- Set `viewCount = 0`
- Set `createdAt = Date.now()`
- Add vào **đầu array** (newest first)

#### 6.6.2. Import Prompts
- **Merge Strategy**: Chỉ add prompts có ID chưa tồn tại
- Tránh duplicates dựa trên ID
- Append vào cuối array

#### 6.6.3. Update Prompt
- Partial update (chỉ update fields được truyền vào)
- Immutable update (tạo new object)

### 6.7. Persistence Details

- **Storage Key**: `promptvault-prompts`
- **Persisted Data**: Toàn bộ `prompts` array
- **Default Value**: `seedPrompts` (3 sample prompts)

## 7. STORE INTERACTIONS

### 7.1. Cross-Store Usage

Components thường sử dụng nhiều stores cùng lúc:

```typescript
// Example: MyPrompts page
const MyPrompts = () => {
  const { prompts, addPrompt } = usePromptStore();
  const { categories } = useCategoryStore();
  const { user } = useUserStore();
  const { showToast } = useUIStore();
  
  // Use all stores together
};
```

### 7.2. Store Dependencies

- **PromptStore** phụ thuộc **CategoryStore**: Prompts reference categories
- **UIStore** độc lập: Không phụ thuộc stores khác
- **UserStore** độc lập: Chỉ quản lý user profile

## 8. PERSISTENCE MECHANISM

### 8.1. How It Works

1. **On Store Creation**: Zustand persist middleware tự động:
   - Read từ localStorage
   - Hydrate store state
   
2. **On State Change**: Middleware tự động:
   - Serialize state to JSON
   - Save to localStorage
   - Debounced (Zustand tự động optimize)

3. **On App Reload**: Middleware tự động:
   - Read từ localStorage
   - Restore state
   - Components render với restored state

### 8.2. Storage Format

```json
// promptvault-prompts
{
  "state": {
    "prompts": [...]
  },
  "version": 0
}
```

### 8.3. Migration Strategy

Hiện tại chưa có migration. Nếu cần thay đổi schema:

```typescript
persist(
  (set) => ({ /* ... */ }),
  {
    name: 'promptvault-prompts',
    version: 1,  // Increment version
    migrate: (persistedState, version) => {
      // Migration logic
      return migratedState;
    }
  }
);
```

## 9. PERFORMANCE CONSIDERATIONS

### 9.1. Selective Subscriptions

Zustand cho phép subscribe chỉ vào phần state cần thiết:

```typescript
// ❌ Bad: Subscribe to entire store
const store = usePromptStore();

// ✅ Good: Subscribe only to prompts
const prompts = usePromptStore(state => state.prompts);

// ✅ Good: Subscribe only to action
const addPrompt = usePromptStore(state => state.addPrompt);
```

### 9.2. Memoization

Stores không cần memoization vì Zustand tự động optimize. Nhưng components có thể memoize derived data:

```typescript
const filteredPrompts = useMemo(() => {
  return prompts.filter(/* ... */);
}, [prompts, filter]);
```

## 10. TESTING STORES

### 10.1. Unit Testing (Recommended)

```typescript
import { renderHook, act } from '@testing-library/react';
import { usePromptStore } from './store';

test('addPrompt adds new prompt', () => {
  const { result } = renderHook(() => usePromptStore());
  
  act(() => {
    result.current.addPrompt({
      title: 'Test',
      content: 'Content',
      categoryId: 'cat_1',
      tags: [],
      author: 'Test',
      isFavorite: false,
    });
  });
  
  expect(result.current.prompts).toHaveLength(1);
});
```

## 11. TROUBLESHOOTING

### 11.1. State Not Persisting

- Check localStorage key name
- Check if persist middleware is configured
- Check browser localStorage quota

### 11.2. State Not Updating

- Check if using correct store hook
- Check if action is called correctly
- Check if component is subscribed to store

### 11.3. Performance Issues

- Use selective subscriptions
- Avoid subscribing to entire store
- Use memoization for derived data

---

## TÓM TẮT

PromptVault sử dụng **4 Zustand stores** với persistence:

1. **UIStore**: UI state, navigation, toast
2. **UserStore**: User profile
3. **CategoryStore**: Categories CRUD
4. **PromptStore**: Prompts CRUD + business logic

Tất cả stores:
- ✅ Persist to localStorage
- ✅ Auto-hydrate on load
- ✅ Type-safe với TypeScript
- ✅ Optimized với Zustand

---

**Xem thêm:**
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Kiến trúc tổng quan
- [API_REFERENCE.md](./API_REFERENCE.md) - API reference đầy đủ
