# 📚 API REFERENCE

## 1. TỔNG QUAN

Tài liệu này mô tả đầy đủ các APIs (stores, functions, hooks) có sẵn trong PromptVault.

## 2. UI STORE API

### 2.1. Hook

```typescript
const store = useUIStore();
```

### 2.2. State

```typescript
interface UIState {
  darkMode: boolean;
  currentView: ViewName;
  toastMessage: string | null;
}
```

### 2.3. Actions

#### 2.3.1. toggleDarkMode

```typescript
toggleDarkMode: () => void
```

**Mô tả**: Toggle dark mode on/off.

**Ví dụ**:
```typescript
const { toggleDarkMode } = useUIStore();
toggleDarkMode();
```

#### 2.3.2. setView

```typescript
setView: (view: ViewName) => void
```

**Mô tả**: Navigate đến view khác.

**Parameters**:
- `view`: ViewName - View để navigate đến

**Ví dụ**:
```typescript
const { setView } = useUIStore();
setView('LIBRARY');
```

#### 2.3.3. showToast

```typescript
showToast: (message: string) => void
```

**Mô tả**: Hiển thị toast notification. Tự động ẩn sau 3 giây.

**Parameters**:
- `message`: string - Message để hiển thị

**Ví dụ**:
```typescript
const { showToast } = useUIStore();
showToast('Prompt saved successfully!');
```

### 2.4. Selective Subscription

```typescript
// Subscribe to specific state
const darkMode = useUIStore(state => state.darkMode);
const setView = useUIStore(state => state.setView);

// Subscribe to multiple
const { darkMode, currentView } = useUIStore(state => ({
  darkMode: state.darkMode,
  currentView: state.currentView,
}));
```

## 3. USER STORE API

### 3.1. Hook

```typescript
const store = useUserStore();
```

### 3.2. State

```typescript
interface UserState {
  user: User;
}

interface User {
  name: string;
  avatarInitials: string;
}
```

### 3.3. Actions

#### 3.3.1. setUser

```typescript
setUser: (name: string) => void
```

**Mô tả**: Cập nhật user name. Tự động generate avatar initials.

**Parameters**:
- `name`: string - User name mới

**Ví dụ**:
```typescript
const { setUser } = useUserStore();
setUser('John Doe');
// user.name = "John Doe"
// user.avatarInitials = "JO"
```

### 3.4. Default Value

```typescript
{
  name: 'Guest',
  avatarInitials: 'GU'
}
```

## 4. CATEGORY STORE API

### 4.1. Hook

```typescript
const store = useCategoryStore();
```

### 4.2. State

```typescript
interface CategoryState {
  categories: Category[];
}

interface Category {
  id: string;
  name: string;
  color: string;
}
```

### 4.3. Actions

#### 4.3.1. addCategory

```typescript
addCategory: (category: Omit<Category, 'id'>) => void
```

**Mô tả**: Thêm category mới. Tự động generate ID.

**Parameters**:
- `category`: Object với `name` và `color`

**Ví dụ**:
```typescript
const { addCategory } = useCategoryStore();
addCategory({ 
  name: 'Design', 
  color: '#ef4444' 
});
```

#### 4.3.2. deleteCategory

```typescript
deleteCategory: (id: string) => void
```

**Mô tả**: Xóa category. **Lưu ý**: Không validate xem category có đang được sử dụng không (validation ở UI level).

**Parameters**:
- `id`: string - Category ID để xóa

**Ví dụ**:
```typescript
const { deleteCategory } = useCategoryStore();
deleteCategory('cat_1');
```

#### 4.3.3. resetCategories

```typescript
resetCategories: () => void
```

**Mô tả**: Reset categories về seed data (4 default categories).

**Ví dụ**:
```typescript
const { resetCategories } = useCategoryStore();
resetCategories();
```

### 4.4. Seed Categories

```typescript
[
  { id: 'cat_1', name: 'Coding', color: '#3b82f6' },
  { id: 'cat_2', name: 'Writing', color: '#10b981' },
  { id: 'cat_3', name: 'Marketing', color: '#f59e0b' },
  { id: 'cat_4', name: 'Productivity', color: '#8b5cf6' },
]
```

## 5. PROMPT STORE API

### 5.1. Hook

```typescript
const store = usePromptStore();
```

### 5.2. State

```typescript
interface PromptState {
  prompts: Prompt[];
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

### 5.3. Actions

#### 5.3.1. addPrompt

```typescript
addPrompt: (prompt: Omit<Prompt, 'id' | 'viewCount' | 'createdAt'>) => void
```

**Mô tả**: Thêm prompt mới. Tự động set `id`, `viewCount = 0`, `createdAt = Date.now()`. Add vào đầu array.

**Parameters**:
- `prompt`: Object với:
  - `title`: string (required)
  - `content`: string (required)
  - `description?`: string (optional)
  - `categoryId`: string (required)
  - `tags`: string[] (required)
  - `author`: string (required)
  - `isFavorite`: boolean (required)

**Ví dụ**:
```typescript
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
```

#### 5.3.2. updatePrompt

```typescript
updatePrompt: (id: string, updates: Partial<Prompt>) => void
```

**Mô tả**: Cập nhật prompt. Partial update (chỉ update fields được truyền vào).

**Parameters**:
- `id`: string - Prompt ID
- `updates`: Partial<Prompt> - Fields để update

**Ví dụ**:
```typescript
const { updatePrompt } = usePromptStore();
updatePrompt('p_1', { 
  title: 'Updated Title',
  isFavorite: true 
});
```

#### 5.3.3. deletePrompt

```typescript
deletePrompt: (id: string) => void
```

**Mô tả**: Xóa prompt.

**Parameters**:
- `id`: string - Prompt ID

**Ví dụ**:
```typescript
const { deletePrompt } = usePromptStore();
deletePrompt('p_1');
```

#### 5.3.4. incrementViewCount

```typescript
incrementViewCount: (id: string) => void
```

**Mô tả**: Tăng view count của prompt lên 1.

**Parameters**:
- `id`: string - Prompt ID

**Ví dụ**:
```typescript
const { incrementViewCount } = usePromptStore();
incrementViewCount('p_1');
```

**Usage**: Thường được gọi trong `useEffect` khi mở PromptModal:
```typescript
useEffect(() => {
  incrementViewCount(prompt.id);
}, [prompt.id, incrementViewCount]);
```

#### 5.3.5. toggleFavorite

```typescript
toggleFavorite: (id: string) => void
```

**Mô tả**: Toggle favorite state của prompt.

**Parameters**:
- `id`: string - Prompt ID

**Ví dụ**:
```typescript
const { toggleFavorite } = usePromptStore();
toggleFavorite('p_1');
```

#### 5.3.6. importPrompts

```typescript
importPrompts: (data: Prompt[]) => void
```

**Mô tả**: Import prompts từ array. Merge strategy: chỉ add prompts có ID chưa tồn tại.

**Parameters**:
- `data`: Prompt[] - Array prompts để import

**Ví dụ**:
```typescript
const { importPrompts } = usePromptStore();
importPrompts([
  { id: 'p_new', title: 'New', ... },
  // ...
]);
```

**Merge Logic**:
```typescript
const existingIds = new Set(state.prompts.map(p => p.id));
const newPrompts = data.filter(p => !existingIds.has(p.id));
return { prompts: [...state.prompts, ...newPrompts] };
```

#### 5.3.7. resetPrompts

```typescript
resetPrompts: () => void
```

**Mô tả**: Reset prompts về seed data (3 sample prompts).

**Ví dụ**:
```typescript
const { resetPrompts } = usePromptStore();
resetPrompts();
```

### 5.4. Seed Prompts

3 sample prompts với IDs: `p_1`, `p_2`, `p_3`.

## 6. HELPER FUNCTIONS

### 6.1. generateId

**File**: `store.ts`

```typescript
const generateId = () => Math.random().toString(36).substr(2, 9);
```

**Mô tả**: Generate random ID string.

**Return**: string - Random ID (9 characters)

**Ví dụ**:
```typescript
const id = generateId(); // "k3j9x2m1p"
```

### 6.2. getInitials

**File**: `store.ts`

```typescript
const getInitials = (name: string) => name.substring(0, 2).toUpperCase();
```

**Mô tả**: Generate avatar initials từ name.

**Parameters**:
- `name`: string - User name

**Return**: string - 2 uppercase letters

**Ví dụ**:
```typescript
getInitials('John Doe');  // "JO"
getInitials('Alice');      // "AL"
```

## 7. TYPE DEFINITIONS

### 7.1. ViewName

```typescript
type ViewName = 
  | 'HOME' 
  | 'LIBRARY' 
  | 'MY_PROMPTS' 
  | 'CATEGORIES' 
  | 'SETTINGS' 
  | 'USER';
```

### 7.2. Prompt

Xem [DATA_MODEL.md](./DATA_MODEL.md) section 3.

### 7.3. Category

Xem [DATA_MODEL.md](./DATA_MODEL.md) section 4.

### 7.4. User

Xem [DATA_MODEL.md](./DATA_MODEL.md) section 5.

## 8. USAGE PATTERNS

### 8.1. Basic Usage

```typescript
// Get state
const { prompts } = usePromptStore();
const { categories } = useCategoryStore();

// Get actions
const { addPrompt } = usePromptStore();
const { setView } = useUIStore();
```

### 8.2. Selective Subscription

```typescript
// Only subscribe to what you need
const prompts = usePromptStore(state => state.prompts);
const addPrompt = usePromptStore(state => state.addPrompt);

// Multiple selective
const { prompts, categories } = usePromptStore(state => ({
  prompts: state.prompts,
  categories: useCategoryStore.getState().categories, // Cross-store
}));
```

### 8.3. Actions Outside Components

```typescript
// Get store without hook (outside React)
import { usePromptStore } from './store';

const addPromptOutside = () => {
  usePromptStore.getState().addPrompt({ ... });
};
```

### 8.4. Computed Values

```typescript
// In component
const { prompts } = usePromptStore();
const favorites = useMemo(
  () => prompts.filter(p => p.isFavorite),
  [prompts]
);
```

## 9. PERSISTENCE

### 9.1. Storage Keys

| Store | Key | Persisted Data |
|-------|-----|----------------|
| UIStore | `promptvault-ui` | `{ darkMode }` |
| UserStore | `promptvault-user` | `{ user }` |
| CategoryStore | `promptvault-categories` | `{ categories }` |
| PromptStore | `promptvault-prompts` | `{ prompts }` |

### 9.2. Auto-Persistence

Tất cả stores tự động persist khi state thay đổi. Không cần gọi function riêng.

### 9.3. Manual Clear

```typescript
// Clear specific store
localStorage.removeItem('promptvault-prompts');

// Clear all
localStorage.clear();
```

## 10. ERROR HANDLING

### 10.1. Store Errors

Stores không throw errors. Validation nên được thực hiện ở UI level.

### 10.2. Import Errors

`importPrompts` không validate format. Nên validate trước khi gọi:

```typescript
const validatePrompt = (p: any): p is Prompt => {
  return p.id && p.title && p.content && p.categoryId;
};

if (data.every(validatePrompt)) {
  importPrompts(data);
}
```

## 11. PERFORMANCE TIPS

### 11.1. Selective Subscriptions

```typescript
// ❌ Bad: Subscribe to entire store
const store = usePromptStore();

// ✅ Good: Subscribe only to needed state
const prompts = usePromptStore(state => state.prompts);
```

### 11.2. Memoization

```typescript
// Memoize computed values
const filtered = useMemo(
  () => prompts.filter(/* ... */),
  [prompts, filter]
);
```

### 11.3. Action References

Actions không thay đổi reference, có thể dùng trong dependencies:

```typescript
useEffect(() => {
  // addPrompt reference is stable
}, [addPrompt]);
```

---

## TÓM TẮT

PromptVault cung cấp **4 stores** với đầy đủ CRUD operations:

1. **UIStore**: Navigation, theme, toast
2. **UserStore**: User profile
3. **CategoryStore**: Categories CRUD
4. **PromptStore**: Prompts CRUD + business logic

Tất cả APIs:
- ✅ Type-safe với TypeScript
- ✅ Auto-persisted
- ✅ Optimized với Zustand
- ✅ Selective subscriptions supported

---

**Xem thêm:**
- [STATE_MANAGEMENT.md](./STATE_MANAGEMENT.md) - Chi tiết implementation
- [DATA_MODEL.md](./DATA_MODEL.md) - Data structures
