# 🧩 COMPONENTS DOCUMENTATION

## 1. TỔNG QUAN

PromptVault có **3 reusable components** trong thư mục `components/`:
- Header.tsx
- PromptCard.tsx
- PromptModal.tsx

## 2. HEADER COMPONENT

### 2.1. File Location
`components/Header.tsx`

### 2.2. Mục Đích
Navigation header với logo, menu items, settings button, và user avatar. Hỗ trợ responsive mobile menu.

### 2.3. Props
Không có props (sử dụng stores trực tiếp).

### 2.4. Implementation

```typescript
import React, { useState } from 'react';
import { Menu, X, Layout, Library, BookMarked, Layers, Settings, UserCircle } from 'lucide-react';
import { useUIStore, useUserStore } from '../store';
import { ViewName } from '../types';

const Header = () => {
  const { currentView, setView } = useUIStore();
  const { user } = useUserStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Navigation items
  const navItems: { view: ViewName; label: string; icon: React.ElementType }[] = [
    { view: 'HOME', label: 'Home', icon: Layout },
    { view: 'LIBRARY', label: 'Library', icon: Library },
    { view: 'MY_PROMPTS', label: 'My Prompts', icon: BookMarked },
    { view: 'CATEGORIES', label: 'Categories', icon: Layers },
  ];
  
  // ...
};
```

### 2.5. Features

#### 2.5.1. Desktop Navigation
- Logo với click để về Home
- 4 navigation items với icons
- Settings icon button
- User avatar button

#### 2.5.2. Mobile Navigation
- Hamburger menu button
- Mobile menu overlay
- Same navigation items
- Settings và User trong mobile menu

#### 2.5.3. Active State
- Highlight active view với primary color
- Background color change
- Icon color change

### 2.6. Styling

```typescript
// Sticky header với backdrop blur
className="sticky top-0 z-50 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md"

// Active nav item
className={currentView === item.view
  ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/20'
  : 'text-gray-600 hover:text-gray-900'
}
```

### 2.7. User Interactions

- **Logo Click**: Navigate to Home
- **Nav Item Click**: Navigate to view, close mobile menu
- **Settings Click**: Navigate to Settings
- **User Avatar Click**: Navigate to User profile
- **Mobile Menu Toggle**: Open/close mobile menu

### 2.8. Dependencies

- `useUIStore`: currentView, setView
- `useUserStore`: user (name, avatarInitials)
- `lucide-react`: Icons

## 3. PROMPT CARD COMPONENT

### 3.1. File Location
`components/PromptCard.tsx`

### 3.2. Mục Đích
Reusable card component để hiển thị prompt trong grid/list. Hỗ trợ các actions: copy, favorite, edit, delete.

### 3.3. Props Interface

```typescript
interface PromptCardProps {
  prompt: Prompt;
  category?: Category;
  onClick: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}
```

### 3.4. Props Details

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `prompt` | `Prompt` | ✅ | Prompt data to display |
| `category` | `Category?` | ❌ | Category object (for badge) |
| `onClick` | `() => void` | ✅ | Handler khi click card |
| `onEdit` | `() => void` | ❌ | Handler cho edit button |
| `onDelete` | `() => void` | ❌ | Handler cho delete button |

### 3.5. Implementation

```typescript
import React from 'react';
import { Eye, Copy, Heart, Edit2, Trash2 } from 'lucide-react';
import { Prompt, Category } from '../types';
import { usePromptStore, useUIStore } from '../store';

const PromptCard: React.FC<PromptCardProps> = ({ 
  prompt, 
  category, 
  onClick, 
  onEdit, 
  onDelete 
}) => {
  const { toggleFavorite } = usePromptStore();
  const { showToast } = useUIStore();
  
  // Handlers
  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(prompt.content);
    showToast('Prompt copied to clipboard!');
  };
  
  // ...
};
```

### 3.6. Features

#### 3.6.1. Display
- Category badge với màu
- Favorite heart icon (filled/unfilled)
- Title (truncated với line-clamp-1)
- Description/content preview (line-clamp-3)
- View count với Eye icon
- Author name

#### 3.6.2. Actions
- **Copy Button**: Copy prompt content to clipboard
- **Favorite Toggle**: Toggle favorite state
- **Edit Button**: Chỉ hiện khi có `onEdit` prop
- **Delete Button**: Chỉ hiện khi có `onDelete` prop

#### 3.6.3. Interactions
- **Card Click**: Mở modal/view details (onClick)
- **Copy Click**: Copy content, show toast
- **Favorite Click**: Toggle favorite, update store
- **Edit/Delete Click**: Call respective handlers

### 3.7. Styling

```typescript
// Card container
className="group bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-700 transition-all duration-200 cursor-pointer flex flex-col h-full"

// Category badge
style={{ backgroundColor: category?.color || '#94a3b8' }}

// Favorite button
className={prompt.isFavorite 
  ? 'text-red-500 bg-red-50 dark:bg-red-900/20' 
  : 'text-gray-400 hover:text-red-400'
}
```

### 3.8. Conditional Rendering

- **Edit/Delete Buttons**: Chỉ hiện khi có props
- **Author**: Ẩn trên mobile nếu có edit/delete buttons
- **Category Badge**: Fallback "Uncategorized" nếu không có category

### 3.9. Usage Examples

```typescript
// Basic usage (Library page)
<PromptCard
  prompt={prompt}
  category={getCategory(prompt.categoryId)}
  onClick={() => setSelectedPrompt(prompt)}
/>

// With edit/delete (MyPrompts page)
<PromptCard
  prompt={prompt}
  category={getCategory(prompt.categoryId)}
  onClick={() => setSelectedPrompt(prompt)}
  onEdit={() => handleEdit(prompt)}
  onDelete={() => handleDelete(prompt.id)}
/>
```

### 3.10. Dependencies

- `usePromptStore`: toggleFavorite
- `useUIStore`: showToast
- `lucide-react`: Icons

## 4. PROMPT MODAL COMPONENT

### 4.1. File Location
`components/PromptModal.tsx`

### 4.2. Mục Đích
Full-screen modal hiển thị chi tiết prompt với đầy đủ thông tin và actions.

### 4.3. Props Interface

```typescript
interface PromptModalProps {
  prompt: Prompt;
  category?: Category;
  onClose: () => void;
}
```

### 4.4. Props Details

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `prompt` | `Prompt` | ✅ | Prompt data to display |
| `category` | `Category?` | ❌ | Category object |
| `onClose` | `() => void` | ✅ | Handler để đóng modal |

### 4.5. Implementation

```typescript
import React, { useEffect } from 'react';
import { X, Copy, Tag, Calendar, User, Bookmark } from 'lucide-react';
import { Prompt, Category } from '../types';
import { usePromptStore, useUIStore, useUserStore } from '../store';

const PromptModal: React.FC<PromptModalProps> = ({ 
  prompt, 
  category, 
  onClose 
}) => {
  const { incrementViewCount, addPrompt, prompts } = usePromptStore();
  const { showToast, setView } = useUIStore();
  const { user } = useUserStore();
  
  // Auto-increment view count on mount
  useEffect(() => {
    incrementViewCount(prompt.id);
  }, [prompt.id, incrementViewCount]);
  
  // ...
};
```

### 4.6. Features

#### 4.6.1. Header Section
- Category badge với màu
- Created date với Calendar icon
- Title (large, bold)
- Close button (X icon)

#### 4.6.2. Content Section
- **Prompt Content**: 
  - Full text trong code-like container
  - Copy button (hover to show)
  - Pre-formatted text (whitespace-pre-wrap)
  
- **Description**: 
  - Optional, chỉ hiện nếu có
  
- **Tags**: 
  - Tag badges với Tag icon
  
- **Author Info**: 
  - "Created by [author]" với User icon

#### 4.6.3. Footer Actions
- **Save to My Prompts**: 
  - Copy prompt vào collection cá nhân
  - Check duplicate (nếu author = user.name)
  - Navigate to My Prompts sau khi save
  
- **Copy Prompt**: 
  - Copy content to clipboard
  - Show toast notification

### 4.7. Business Logic

#### 4.7.1. View Count
```typescript
useEffect(() => {
  incrementViewCount(prompt.id);
}, [prompt.id, incrementViewCount]);
```
- Tự động tăng view count khi modal mở
- Chỉ tăng 1 lần per mount

#### 4.7.2. Save to My Prompts
```typescript
const handleSaveToMyPrompts = () => {
  // Check duplicate
  if (prompt.author === user.name) {
    showToast("You already own this prompt!");
    return;
  }
  
  // Create new prompt with current user as author
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
```

### 4.8. Styling

```typescript
// Modal overlay
className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"

// Backdrop
className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"

// Modal container
className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"

// Content container
className="relative bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700 group"
```

### 4.9. User Interactions

- **Backdrop Click**: Đóng modal (onClose)
- **Close Button**: Đóng modal
- **Copy Button (in content)**: Copy content, show toast
- **Save to My Prompts**: Save và navigate
- **Copy Prompt Button**: Copy content, show toast

### 4.10. Accessibility

- **Modal Overlay**: Click outside to close
- **Keyboard**: ESC key (có thể thêm)
- **Focus Management**: Focus vào modal khi mở (có thể cải thiện)

### 4.11. Usage Examples

```typescript
// In Library or Home page
{selectedPrompt && (
  <PromptModal
    prompt={selectedPrompt}
    category={getCategory(selectedPrompt.categoryId)}
    onClose={() => setSelectedPrompt(null)}
  />
)}
```

### 4.12. Dependencies

- `usePromptStore`: incrementViewCount, addPrompt, prompts
- `useUIStore`: showToast, setView
- `useUserStore`: user

## 5. COMPONENT PATTERNS

### 5.1. Store Integration

Tất cả components sử dụng Zustand stores trực tiếp:

```typescript
// ✅ Direct store access
const { prompts } = usePromptStore();
const { showToast } = useUIStore();
```

### 5.2. Event Handling

- **stopPropagation**: Dùng cho buttons trong cards để tránh trigger card click
- **Toast Notifications**: Tất cả actions quan trọng đều có toast feedback

### 5.3. Conditional Rendering

- **Optional Props**: onEdit, onDelete trong PromptCard
- **Optional Data**: category, description

### 5.4. Styling Approach

- **Tailwind Classes**: Utility-first, inline classes
- **Dark Mode**: Sử dụng `dark:` prefix
- **Responsive**: `sm:`, `md:`, `lg:` breakpoints
- **Hover States**: Transition effects

## 6. COMPONENT REUSABILITY

### 6.1. PromptCard Reusability

PromptCard được dùng ở:
- Home page (trending prompts)
- Library page (all prompts)
- MyPrompts page (user's prompts với edit/delete)

### 6.2. PromptModal Reusability

PromptModal được dùng ở:
- Home page (khi click prompt card)
- Library page (khi click prompt card)
- MyPrompts page (khi click prompt card)

## 7. FUTURE IMPROVEMENTS

### 7.1. Component Splitting

- **Header**: Có thể tách thành Header, NavItem, MobileMenu
- **PromptCard**: Có thể tách thành CardHeader, CardContent, CardActions

### 7.2. Accessibility

- **ARIA Labels**: Thêm labels cho screen readers
- **Keyboard Navigation**: Improve keyboard support
- **Focus Management**: Better focus handling trong modals

### 7.3. Performance

- **Memoization**: React.memo cho components
- **Lazy Loading**: Lazy load modal content
- **Virtual Scrolling**: Cho large lists

---

## TÓM TẮT

PromptVault có **3 main components**:

1. **Header**: Navigation với mobile menu
2. **PromptCard**: Reusable card với actions
3. **PromptModal**: Full-screen modal với details

Tất cả components:
- ✅ Type-safe với TypeScript
- ✅ Store-integrated
- ✅ Responsive design
- ✅ Dark mode support
- ✅ Accessible (có thể cải thiện)

---

**Xem thêm:**
- [PAGES.md](./PAGES.md) - Pages sử dụng components
- [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) - Styling guidelines
