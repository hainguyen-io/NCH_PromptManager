# 📄 PAGES DOCUMENTATION

## 1. TỔNG QUAN

PromptVault có **6 pages** trong thư mục `pages/`:
- Home.tsx
- Library.tsx
- MyPrompts.tsx
- Categories.tsx
- Settings.tsx
- User.tsx

Tất cả pages được render thông qua view router trong `App.tsx`.

## 2. ROUTING MECHANISM

### 2.1. View Router

**File: `App.tsx`**

```typescript
const renderView = () => {
  switch (currentView) {
    case 'HOME': return <Home />;
    case 'LIBRARY': return <Library />;
    case 'MY_PROMPTS': return <MyPrompts />;
    case 'CATEGORIES': return <Categories />;
    case 'SETTINGS': return <Settings />;
    case 'USER': return <User />;
    default: return <Home />;
  }
};
```

### 2.2. Navigation

Navigation được thực hiện qua `setView()` từ UIStore:

```typescript
const { setView } = useUIStore();
setView('LIBRARY');
```

## 3. HOME PAGE

### 3.1. File Location
`pages/Home.tsx`

### 3.2. View Name
`'HOME'`

### 3.3. Mục Đích
Landing page với hero section và trending prompts.

### 3.4. Features

#### 3.4.1. Hero Section
- Gradient background (primary colors)
- Large heading với tagline
- Description text
- 2 CTA buttons:
  - "Browse Library" → Navigate to Library
  - "Manage My Prompts" → Navigate to My Prompts
- Decorative circle element

#### 3.4.2. Trending Prompts Section
- Section header với Sparkles icon
- Category filter dropdown
- "View all" link (desktop only)
- Grid layout (1/2/3 columns responsive)
- Top 6 prompts theo view count
- Filter by category

### 3.5. Implementation

```typescript
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
  
  // ...
};
```

### 3.6. State Management

- **Local State**: 
  - `selectedCategory`: Filter category
  - `selectedPrompt`: Prompt để mở modal
  
- **Store State**:
  - `prompts` từ PromptStore
  - `categories` từ CategoryStore
  - `setView` từ UIStore

### 3.7. User Interactions

- **Category Filter**: Filter trending prompts
- **Prompt Card Click**: Mở PromptModal
- **CTA Buttons**: Navigate to other pages
- **View All Link**: Navigate to Library

## 4. LIBRARY PAGE

### 4.1. File Location
`pages/Library.tsx`

### 4.2. View Name
`'LIBRARY'`

### 4.3. Mục Đích
Browse tất cả prompts với search và filter functionality.

### 4.4. Features

#### 4.4.1. Header
- Page title với FolderOpen icon
- Total prompts count

#### 4.4.2. Search & Filter Bar
- **Search Input**: 
  - Search icon
  - Placeholder: "Search by keyword, tag, or content..."
  - Real-time filtering
  
- **Category Filter**: 
  - Filter icon
  - Dropdown với "All Categories" option

#### 4.4.3. Prompts Grid
- Responsive grid (1/2/3 columns)
- PromptCard components
- Empty state khi không có kết quả

### 4.5. Implementation

```typescript
const Library = () => {
  const { prompts } = usePromptStore();
  const { categories } = useCategoryStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  
  // Memoized filtered prompts
  const filteredPrompts = useMemo(() => {
    return prompts.filter(prompt => {
      const matchesSearch = 
        prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        prompt.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prompt.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = filterCategory === 'ALL' || prompt.categoryId === filterCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [prompts, searchTerm, filterCategory]);
  
  // ...
};
```

### 4.6. Search Logic

Search tìm trong:
- **Title**: Case-insensitive
- **Content**: Case-insensitive
- **Tags**: Case-insensitive, any tag match

### 4.7. Performance Optimization

- **useMemo**: Memoize filtered prompts để tránh re-compute
- **Dependencies**: Chỉ re-compute khi prompts, searchTerm, hoặc filterCategory thay đổi

### 4.8. Empty State

```typescript
{filteredPrompts.length === 0 && (
  <div className="text-center py-20">
    <Search className="w-8 h-8 text-gray-400" />
    <h3>No prompts found</h3>
    <p>Try adjusting your search or filter.</p>
  </div>
)}
```

## 5. MY PROMPTS PAGE

### 5.1. File Location
`pages/MyPrompts.tsx`

### 5.2. View Name
`'MY_PROMPTS'`

### 5.3. Mục Đích
CRUD interface cho user's prompts với inline form.

### 5.4. Features

#### 5.4.1. Header
- Page title với BookMarked icon
- "New Prompt" button (chỉ hiện khi không editing)

#### 5.4.2. Create/Edit Form
- **Inline Form**: Hiện/ẩn dựa trên `isEditing` state
- **Form Fields**:
  - Title (required)
  - Category (dropdown, required)
  - Description (optional)
  - Content (textarea, required)
  - Tags (comma-separated, optional)
- **Form Actions**:
  - Cancel button
  - Save button

#### 5.4.3. Prompts List
- List view (không phải grid)
- PromptCard với Edit và Delete buttons
- Empty state khi không có prompts

### 5.5. Implementation

```typescript
const MyPrompts = () => {
  const { prompts, addPrompt, updatePrompt, deletePrompt } = usePromptStore();
  const { categories } = useCategoryStore();
  const { user } = useUserStore();
  const { showToast } = useUIStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    description: '',
    categoryId: '',
    tags: '',
  });
  
  // ...
};
```

### 5.6. Form Logic

#### 5.6.1. Create New
```typescript
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
```

#### 5.6.2. Edit Existing
```typescript
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
```

#### 5.6.3. Submit Form
```typescript
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
```

### 5.7. Delete Logic

```typescript
const handleDelete = (id: string) => {
  if (window.confirm('Are you sure you want to delete this prompt?')) {
    deletePrompt(id);
    if (editId === id) {
      closeForm();
    }
    showToast('Prompt deleted.');
  }
};
```

### 5.8. State Management

- **Local State**: 
  - `isEditing`: Form visibility
  - `editId`: ID của prompt đang edit (null = new)
  - `formData`: Form input values
  - `selectedPrompt`: Prompt để mở modal
  
- **Store State**:
  - `prompts`, `addPrompt`, `updatePrompt`, `deletePrompt` từ PromptStore
  - `categories` từ CategoryStore
  - `user` từ UserStore
  - `showToast` từ UIStore

## 6. CATEGORIES PAGE

### 6.1. File Location
`pages/Categories.tsx`

### 6.2. View Name
`'CATEGORIES'`

### 6.3. Mục Đích
Category management với CRUD operations.

### 6.4. Features

#### 6.4.1. Header
- Page title với Layers icon
- "Add Category" button

#### 6.4.2. Add Category Form
- **Inline Form**: Toggle visibility
- **Form Fields**:
  - Category Name (required)
  - Color (color picker)
- **Form Action**: Save button

#### 6.4.3. Categories Grid
- Grid layout (1/2/3 columns responsive)
- Category card với:
  - Color indicator
  - Category name
  - Usage count (số prompts đang dùng)
  - Delete button (disabled nếu đang dùng)

#### 6.4.4. Info Alert
- Tip về không thể xóa category đang được sử dụng

### 6.5. Implementation

```typescript
const Categories = () => {
  const { categories, addCategory, deleteCategory } = useCategoryStore();
  const { prompts } = usePromptStore();
  const { showToast } = useUIStore();
  
  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState('#3b82f6');
  const [isAdding, setIsAdding] = useState(false);
  
  // Calculate usage count
  const getUsageCount = (catId: string) => 
    prompts.filter(p => p.categoryId === catId).length;
  
  // ...
};
```

### 6.6. Business Logic

#### 6.6.1. Add Category
```typescript
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (!newCatName) return;
  addCategory({ name: newCatName, color: newCatColor });
  setNewCatName('');
  setIsAdding(false);
  showToast('Category added successfully.');
};
```

#### 6.6.2. Delete Category
```typescript
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
```

### 6.7. Usage Count Display

```typescript
const getUsageCount = (catId: string) => 
  prompts.filter(p => p.categoryId === catId).length;

// In render
<p className="text-xs text-gray-500">{count} prompts</p>
```

## 7. SETTINGS PAGE

### 7.1. File Location
`pages/Settings.tsx`

### 7.2. View Name
`'SETTINGS'`

### 7.3. Mục Đích
App settings: appearance, data management.

### 7.4. Features

#### 7.4.1. Appearance Section
- **Dark Mode Toggle**:
  - Toggle switch với animation
  - Icon (Sun/Moon)
  - Description text

#### 7.4.2. Data Management Section
- **Export JSON**:
  - Export tất cả prompts và categories
  - Download file JSON
  - Filename: `promptvault-backup-YYYY-MM-DD.json`
  
- **Import JSON**:
  - File input (hidden)
  - Button trigger
  - Validate format
  - Merge prompts
  
- **Reset Application**:
  - Danger button
  - Confirmation dialog
  - Clear localStorage
  - Reload page

### 7.5. Implementation

```typescript
const Settings = () => {
  const { darkMode, toggleDarkMode, showToast } = useUIStore();
  const { prompts, importPrompts, resetPrompts } = usePromptStore();
  const { categories } = useCategoryStore();
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // ...
};
```

### 7.6. Export Logic

```typescript
const handleExport = () => {
  const data = {
    prompts,
    categories,
    exportedAt: new Date().toISOString(),
    app: 'PromptVault'
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { 
    type: 'application/json' 
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `promptvault-backup-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('Data exported successfully.');
};
```

### 7.7. Import Logic

```typescript
const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const json = JSON.parse(event.target?.result as string);
      if (json.app === 'PromptVault' && Array.isArray(json.prompts)) {
        importPrompts(json.prompts);
        showToast(`Imported ${json.prompts.length} prompts.`);
      } else {
        showToast('Invalid file format.');
      }
    } catch (err) {
      showToast('Error parsing JSON file.');
    }
  };
  reader.readAsText(file);
  if (fileInputRef.current) fileInputRef.current.value = '';
};
```

### 7.8. Reset Logic

```typescript
const handleReset = () => {
  if (confirm('DANGER: This will delete all your local changes and reset to default seed data. This cannot be undone.')) {
    resetPrompts();
    localStorage.clear();
    location.reload();
  }
};
```

## 8. USER PAGE

### 8.1. File Location
`pages/User.tsx`

### 8.2. View Name
`'USER'`

### 8.3. Mục Đích
User profile management.

### 8.4. Features

#### 8.4.1. Profile Display
- Large avatar với initials
- "Local User" label

#### 8.4.2. Edit Form
- **Display Name Input**:
  - UserCircle icon
  - Placeholder: "Enter your name"
  - Current value pre-filled
  
- **Save Button**: 
  - Save changes
  - Show toast notification

### 8.5. Implementation

```typescript
const User = () => {
  const { user, setUser } = useUserStore();
  const { showToast } = useUIStore();
  const [nameInput, setNameInput] = useState(user.name);
  
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim()) {
      setUser(nameInput.trim());
      showToast('Profile updated!');
    }
  };
  
  // ...
};
```

### 8.6. Avatar Display

```typescript
<div className="w-24 h-24 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300 flex items-center justify-center text-3xl font-bold">
  {user.avatarInitials}
</div>
```

## 9. COMMON PATTERNS

### 9.1. Store Usage

Tất cả pages sử dụng stores:
- `usePromptStore`: Prompts data và actions
- `useCategoryStore`: Categories data
- `useUserStore`: User data
- `useUIStore`: UI state và navigation

### 9.2. Local State

Pages sử dụng local state cho:
- Form inputs
- UI state (modals, dropdowns)
- Filter/search state

### 9.3. Navigation

Navigation thông qua `setView()`:
```typescript
const { setView } = useUIStore();
setView('LIBRARY');
```

### 9.4. Toast Notifications

Tất cả actions quan trọng đều có toast:
```typescript
const { showToast } = useUIStore();
showToast('Action completed!');
```

---

## TÓM TẮT

PromptVault có **6 pages**:

1. **Home**: Landing với trending prompts
2. **Library**: Browse với search/filter
3. **MyPrompts**: CRUD interface
4. **Categories**: Category management
5. **Settings**: App settings
6. **User**: Profile management

Tất cả pages:
- ✅ View-based routing
- ✅ Store-integrated
- ✅ Responsive design
- ✅ Toast notifications
- ✅ Form validation

---

**Xem thêm:**
- [COMPONENTS.md](./COMPONENTS.md) - Components được sử dụng
- [WORKFLOWS.md](./WORKFLOWS.md) - User workflows
