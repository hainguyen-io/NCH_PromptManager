# 📊 MÔ HÌNH DỮ LIỆU

## 1. TỔNG QUAN

PromptVault sử dụng TypeScript interfaces để định nghĩa data models. Tất cả types được định nghĩa trong `types.ts`.

## 2. TYPE DEFINITIONS

### 2.1. File Structure

**File: `types.ts`**

```typescript
export interface Category { ... }
export interface Prompt { ... }
export interface User { ... }
export type ViewName = ...;
```

## 3. PROMPT INTERFACE

### 3.1. Definition

```typescript
export interface Prompt {
  id: string;                    // Unique identifier
  title: string;                 // Prompt title
  content: string;               // Full prompt content
  description?: string;          // Optional description
  categoryId: string;            // Reference to category
  tags: string[];               // Array of tags
  viewCount: number;             // View counter
  author: string;                // Creator name
  createdAt: number;             // Timestamp (milliseconds)
  isFavorite: boolean;           // Favorite flag
}
```

### 3.2. Field Details

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | ✅ | Unique identifier, auto-generated |
| `title` | `string` | ✅ | Display title, max length recommended: 100 chars |
| `content` | `string` | ✅ | Full prompt text, can be multi-line |
| `description` | `string?` | ❌ | Short description, displayed in cards |
| `categoryId` | `string` | ✅ | Foreign key to Category.id |
| `tags` | `string[]` | ✅ | Array of tag strings, lowercase recommended |
| `viewCount` | `number` | ✅ | Auto-incremented on view |
| `author` | `string` | ✅ | Creator name, default: user.name |
| `createdAt` | `number` | ✅ | Unix timestamp (Date.now()) |
| `isFavorite` | `boolean` | ✅ | User favorite flag, default: false |

### 3.3. Example Data

```typescript
const examplePrompt: Prompt = {
  id: 'p_1',
  title: 'React Component Generator',
  description: 'Generate a functional React component with Tailwind CSS.',
  content: 'Act as an expert React developer. Create a [Component Name] component using React, TypeScript, and Tailwind CSS. Ensure it is responsive and accessible.',
  categoryId: 'cat_1',
  tags: ['react', 'typescript', 'frontend'],
  viewCount: 120,
  author: 'System',
  createdAt: 1704067200000,  // 2024-01-01
  isFavorite: true,
};
```

### 3.4. Validation Rules

- **id**: Must be unique, format: `p_[random]` hoặc custom
- **title**: Required, should be descriptive
- **content**: Required, can be empty string (not recommended)
- **categoryId**: Must reference existing Category.id
- **tags**: Array, can be empty, recommended lowercase
- **viewCount**: Non-negative integer, auto-managed
- **createdAt**: Valid timestamp, auto-set on creation

### 3.5. Business Rules

1. **ID Generation**: 
   ```typescript
   const generateId = () => Math.random().toString(36).substr(2, 9);
   ```

2. **Default Values on Create**:
   ```typescript
   {
     id: generateId(),
     viewCount: 0,
     createdAt: Date.now(),
     isFavorite: false,
   }
   ```

3. **View Count**: Auto-increment khi mở PromptModal

4. **Author**: Default = current user.name

## 4. CATEGORY INTERFACE

### 4.1. Definition

```typescript
export interface Category {
  id: string;                    // Unique identifier
  name: string;                  // Category name
  color: string;                 // Hex color code
}
```

### 4.2. Field Details

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | ✅ | Unique identifier, auto-generated |
| `name` | `string` | ✅ | Category display name |
| `color` | `string` | ✅ | Hex color code (e.g., '#3b82f6') |

### 4.3. Example Data

```typescript
const exampleCategory: Category = {
  id: 'cat_1',
  name: 'Coding',
  color: '#3b82f6',  // Blue
};
```

### 4.4. Seed Categories

```typescript
const seedCategories: Category[] = [
  { id: 'cat_1', name: 'Coding', color: '#3b82f6' },
  { id: 'cat_2', name: 'Writing', color: '#10b981' },
  { id: 'cat_3', name: 'Marketing', color: '#f59e0b' },
  { id: 'cat_4', name: 'Productivity', color: '#8b5cf6' },
];
```

### 4.5. Validation Rules

- **id**: Must be unique, format: `cat_[number]` hoặc custom
- **name**: Required, should be unique (recommended)
- **color**: Valid hex color code (e.g., '#3b82f6')

### 4.6. Business Rules

1. **Cannot Delete**: Category đang được sử dụng bởi prompts không thể xóa
2. **Color Usage**: Color được dùng cho category badge trong UI
3. **Default Categories**: 4 categories mặc định không thể xóa (có thể reset)

## 5. USER INTERFACE

### 5.1. Definition

```typescript
export interface User {
  name: string;                  // Display name
  avatarInitials: string;        // 2-letter initials
}
```

### 5.2. Field Details

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | `string` | ✅ | User display name |
| `avatarInitials` | `string` | ✅ | 2 uppercase letters, auto-generated |

### 5.3. Example Data

```typescript
const exampleUser: User = {
  name: 'John Doe',
  avatarInitials: 'JO',
};
```

### 5.4. Avatar Initials Generation

```typescript
const getInitials = (name: string) => 
  name.substring(0, 2).toUpperCase();

// Examples:
getInitials('John Doe')    // 'JO'
getInitials('Alice')       // 'AL'
getInitials('Bob Smith')   // 'BO'
```

### 5.5. Default Value

```typescript
const defaultUser: User = {
  name: 'Guest',
  avatarInitials: 'GU',
};
```

## 6. VIEW NAME TYPE

### 6.1. Definition

```typescript
export type ViewName = 
  | 'HOME' 
  | 'LIBRARY' 
  | 'MY_PROMPTS' 
  | 'CATEGORIES' 
  | 'SETTINGS' 
  | 'USER';
```

### 6.2. Usage

ViewName được dùng để:
- Route navigation trong App.tsx
- Track current view trong UIStore
- Highlight active nav item trong Header

### 6.3. View Mapping

| ViewName | Component | Description |
|----------|-----------|-------------|
| `'HOME'` | `<Home />` | Landing page với trending prompts |
| `'LIBRARY'` | `<Library />` | Browse all prompts |
| `'MY_PROMPTS'` | `<MyPrompts />` | User's prompts CRUD |
| `'CATEGORIES'` | `<Categories />` | Category management |
| `'SETTINGS'` | `<Settings />` | App settings |
| `'USER'` | `<User />` | User profile |

## 7. DATA RELATIONSHIPS

### 7.1. Entity Relationship Diagram

```
┌─────────────┐         ┌─────────────┐
│   Prompt    │────────►│  Category   │
│             │ categoryId│            │
│ - id        │         │ - id        │
│ - title     │         │ - name      │
│ - content   │         │ - color     │
│ - categoryId│         └─────────────┘
│ - author    │
│ - tags[]    │
│ - ...       │
└─────────────┘

┌─────────────┐
│    User    │
│            │
│ - name    │
│ - initials│
└─────────────┘
     │
     │ (author field)
     ▼
┌─────────────┐
│   Prompt    │
└─────────────┘
```

### 7.2. Relationships

1. **Prompt → Category**: Many-to-One
   - Một prompt thuộc một category
   - Một category có nhiều prompts
   - Foreign key: `prompt.categoryId → category.id`

2. **Prompt → User**: Many-to-One (by author name)
   - Một prompt có một author (string)
   - Một user có thể tạo nhiều prompts
   - Relationship: Loose (by name, not foreign key)

## 8. DATA VALIDATION

### 8.1. Client-Side Validation

Hiện tại validation cơ bản:

```typescript
// In MyPrompts form
if (!formData.title || !formData.content) return;
```

### 8.2. Recommended Validation

```typescript
// Title validation
if (title.length === 0) {
  return 'Title is required';
}
if (title.length > 100) {
  return 'Title must be less than 100 characters';
}

// Content validation
if (content.length === 0) {
  return 'Content is required';
}

// Category validation
if (!categories.find(c => c.id === categoryId)) {
  return 'Invalid category';
}

// Tags validation
const tagsArray = tags.split(',').map(t => t.trim()).filter(t => t);
if (tagsArray.length > 10) {
  return 'Maximum 10 tags allowed';
}
```

## 9. DATA TRANSFORMATIONS

### 9.1. Tags String ↔ Array

```typescript
// String to Array
const tagsArray = tagsString
  .split(',')
  .map(t => t.trim())
  .filter(t => t);

// Array to String
const tagsString = tagsArray.join(', ');
```

### 9.2. Timestamp Formatting

```typescript
// Timestamp to Date String
const dateString = new Date(createdAt).toLocaleDateString();
// "1/1/2024"

// Timestamp to ISO String
const isoString = new Date(createdAt).toISOString();
// "2024-01-01T00:00:00.000Z"
```

### 9.3. Avatar Initials

```typescript
const getInitials = (name: string) => 
  name.substring(0, 2).toUpperCase();
```

## 10. EXPORT/IMPORT FORMAT

### 10.1. Export Format

```typescript
interface ExportData {
  app: string;              // "PromptVault"
  exportedAt: string;       // ISO timestamp
  prompts: Prompt[];        // All prompts
  categories: Category[];   // All categories
}
```

### 10.2. Example Export

```json
{
  "app": "PromptVault",
  "exportedAt": "2024-01-01T00:00:00.000Z",
  "prompts": [
    {
      "id": "p_1",
      "title": "React Component",
      "content": "...",
      "categoryId": "cat_1",
      "tags": ["react"],
      "viewCount": 10,
      "author": "John",
      "createdAt": 1704067200000,
      "isFavorite": false
    }
  ],
  "categories": [
    {
      "id": "cat_1",
      "name": "Coding",
      "color": "#3b82f6"
    }
  ]
}
```

### 10.3. Import Validation

```typescript
const validateImport = (json: any): boolean => {
  return (
    json.app === 'PromptVault' &&
    Array.isArray(json.prompts) &&
    json.prompts.every(p => 
      p.id && p.title && p.content && p.categoryId
    )
  );
};
```

## 11. DATA PERSISTENCE

### 11.1. Storage Keys

| Key | Data Type | Store |
|-----|-----------|-------|
| `promptvault-ui` | `{ darkMode: boolean }` | UIStore |
| `promptvault-user` | `User` | UserStore |
| `promptvault-categories` | `Category[]` | CategoryStore |
| `promptvault-prompts` | `Prompt[]` | PromptStore |

### 11.2. Storage Format

```json
{
  "state": {
    "prompts": [...],
    // other state
  },
  "version": 0
}
```

## 12. DATA MIGRATION

### 12.1. Current Version

- **Version**: 0 (no versioning yet)
- **Format**: Direct JSON serialization

### 12.2. Future Migration Strategy

```typescript
persist(
  (set) => ({ /* ... */ }),
  {
    name: 'promptvault-prompts',
    version: 1,
    migrate: (persistedState, version) => {
      if (version === 0) {
        // Migrate from v0 to v1
        return {
          ...persistedState,
          prompts: persistedState.prompts.map(p => ({
            ...p,
            // Add new field
            newField: 'default',
          })),
        };
      }
      return persistedState;
    }
  }
);
```

## 13. DATA CONSTRAINTS

### 13.1. Referential Integrity

- **Category Deletion**: Không thể xóa category đang được sử dụng
- **Prompt Category**: Prompt phải reference valid category

### 13.2. Business Constraints

- **View Count**: Chỉ tăng, không giảm
- **Created At**: Không thay đổi sau khi tạo
- **ID**: Unique, không thay đổi

## 14. DATA QUERIES

### 14.1. Common Queries

```typescript
// Get prompts by category
const promptsByCategory = prompts.filter(p => p.categoryId === categoryId);

// Get favorite prompts
const favorites = prompts.filter(p => p.isFavorite);

// Get prompts by author
const myPrompts = prompts.filter(p => p.author === user.name);

// Get top prompts by view count
const topPrompts = [...prompts]
  .sort((a, b) => b.viewCount - a.viewCount)
  .slice(0, 6);

// Search prompts
const searchResults = prompts.filter(p =>
  p.title.toLowerCase().includes(query) ||
  p.content.toLowerCase().includes(query) ||
  p.tags.some(tag => tag.toLowerCase().includes(query))
);
```

### 14.2. Category Lookup

```typescript
const getCategory = (categoryId: string) =>
  categories.find(c => c.id === categoryId);
```

---

## TÓM TẮT

PromptVault sử dụng **3 main interfaces**:

1. **Prompt**: Core entity với đầy đủ metadata
2. **Category**: Simple entity với id, name, color
3. **User**: Simple entity với name và avatar initials

Tất cả types:
- ✅ Type-safe với TypeScript
- ✅ Validated trong business logic
- ✅ Persisted to localStorage
- ✅ Exportable/Importable

---

**Xem thêm:**
- [STATE_MANAGEMENT.md](./STATE_MANAGEMENT.md) - Store implementation
- [API_REFERENCE.md](./API_REFERENCE.md) - API details
