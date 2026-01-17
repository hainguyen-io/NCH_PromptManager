# 🔄 USER WORKFLOWS & BUSINESS LOGIC

## 1. TỔNG QUAN

Tài liệu này mô tả các user workflows và business logic flows trong PromptVault.

## 2. PROMPT WORKFLOWS

### 2.1. Tạo Prompt Mới

#### 2.1.1. Flow Diagram

```
User clicks "New Prompt"
    │
    ▼
Form appears (isEditing = true)
    │
    ▼
User fills form:
  - Title (required)
  - Content (required)
  - Description (optional)
  - Category (dropdown)
  - Tags (comma-separated)
    │
    ▼
User clicks "Save Prompt"
    │
    ▼
Validation: title && content
    │
    ▼
Transform data:
  - Tags: string → array
  - Category: default if empty
    │
    ▼
addPrompt() called
    │
    ▼
Store updates:
  - Generate ID
  - Set viewCount = 0
  - Set createdAt = now
  - Set author = user.name
  - Add to prompts array
    │
    ▼
localStorage auto-saves
    │
    ▼
Form closes
    │
    ▼
Toast: "Prompt created successfully"
    │
    ▼
New prompt appears in list
```

#### 2.1.2. Code Flow

**File**: `pages/MyPrompts.tsx`

```typescript
// 1. Open form
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

// 2. Submit form
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (!formData.title || !formData.content) return;
  
  const tagsArray = formData.tags.split(',').map(t => t.trim()).filter(t => t);
  const finalCategoryId = formData.categoryId || categories[0]?.id || 'uncategorized';
  
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
  closeForm();
};
```

#### 2.1.3. Business Rules

- **Required Fields**: Title và Content
- **Default Category**: Nếu không chọn, dùng category đầu tiên
- **Tags Processing**: Split by comma, trim, filter empty
- **Author**: Tự động set = current user.name
- **ID Generation**: Random string
- **Timestamp**: Date.now()

### 2.2. Chỉnh Sửa Prompt

#### 2.2.1. Flow Diagram

```
User clicks "Edit" button on card
    │
    ▼
Form appears with pre-filled data
    │
    ▼
User modifies fields
    │
    ▼
User clicks "Save Prompt"
    │
    ▼
Validation: title && content
    │
    ▼
Transform data (same as create)
    │
    ▼
updatePrompt(id, updates) called
    │
    ▼
Store updates:
  - Find prompt by ID
  - Merge updates (partial)
  - Update in array
    │
    ▼
localStorage auto-saves
    │
    ▼
Form closes
    │
    ▼
Toast: "Prompt updated successfully"
    │
    ▼
Updated prompt in list
```

#### 2.2.2. Code Flow

```typescript
// 1. Open edit form
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

// 2. Submit update
if (editId) {
  updatePrompt(editId, {
    title: formData.title,
    content: formData.content,
    description: formData.description,
    categoryId: finalCategoryId,
    tags: tagsArray,
  });
  showToast('Prompt updated successfully.');
}
```

#### 2.2.3. Business Rules

- **Partial Update**: Chỉ update fields được truyền vào
- **Immutable**: Tạo new object, không mutate
- **ID Unchanged**: ID không thể thay đổi
- **Metadata Preserved**: viewCount, createdAt, author không thay đổi

### 2.3. Xóa Prompt

#### 2.3.1. Flow Diagram

```
User clicks "Delete" button
    │
    ▼
Confirmation dialog appears
    │
    ├─ User clicks "Cancel"
    │  └─> Flow stops
    │
    └─ User clicks "OK"
       │
       ▼
deletePrompt(id) called
       │
       ▼
Store updates:
  - Filter out prompt by ID
  - Remove from array
       │
       ▼
localStorage auto-saves
       │
       ▼
If editing this prompt:
  - Close form
       │
       ▼
Toast: "Prompt deleted"
       │
       ▼
Prompt removed from list
```

#### 2.3.2. Code Flow

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

#### 2.3.3. Business Rules

- **Confirmation Required**: Phải confirm trước khi xóa
- **No Undo**: Không có undo functionality
- **Form Cleanup**: Nếu đang edit prompt bị xóa, đóng form

### 2.4. Xem Chi Tiết Prompt

#### 2.4.1. Flow Diagram

```
User clicks prompt card
    │
    ▼
PromptModal opens
    │
    ▼
useEffect triggers:
  incrementViewCount(id)
    │
    ▼
Store updates:
  - Find prompt by ID
  - Increment viewCount
    │
    ▼
localStorage auto-saves
    │
    ▼
Modal displays:
  - Full content
  - Category badge
  - Tags
  - Author info
  - View count (updated)
    │
    ├─ User clicks "Copy"
    │  └─> Copy to clipboard + Toast
    │
    ├─ User clicks "Save to My Prompts"
    │  └─> Save flow (see below)
    │
    └─ User clicks backdrop/close
       └─> Modal closes
```

#### 2.4.2. Code Flow

**File**: `components/PromptModal.tsx`

```typescript
// Auto-increment view count
useEffect(() => {
  incrementViewCount(prompt.id);
}, [prompt.id, incrementViewCount]);

// Copy handler
const handleCopy = () => {
  navigator.clipboard.writeText(prompt.content);
  showToast('Prompt copied successfully!');
};
```

#### 2.4.3. Business Rules

- **View Count**: Tự động tăng khi mở modal
- **One Increment**: Chỉ tăng 1 lần per mount (useEffect dependency)
- **Copy Action**: Copy full content, không copy description

### 2.5. Lưu Prompt vào My Prompts

#### 2.5.1. Flow Diagram

```
User clicks "Save to My Prompts" in modal
    │
    ▼
Check: prompt.author === user.name?
    │
    ├─ Yes: Toast "You already own this prompt"
    │  └─> Flow stops
    │
    └─ No: Continue
       │
       ▼
addPrompt() called with:
  - Same data
  - New author = user.name
  - isFavorite = false
       │
       ▼
Store updates (same as create)
       │
       ▼
localStorage auto-saves
       │
       ▼
Modal closes
       │
       ▼
Navigate to MY_PROMPTS view
       │
       ▼
Toast: "Saved to My Prompts!"
```

#### 2.5.2. Code Flow

```typescript
const handleSaveToMyPrompts = () => {
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
```

#### 2.5.3. Business Rules

- **Duplicate Check**: Kiểm tra author để tránh duplicate
- **New Instance**: Tạo prompt mới với ID mới
- **Author Change**: Set author = current user
- **Auto Navigate**: Navigate đến My Prompts sau khi save

## 3. CATEGORY WORKFLOWS

### 3.1. Tạo Category Mới

#### 3.1.1. Flow Diagram

```
User clicks "Add Category"
    │
    ▼
Form appears
    │
    ▼
User enters:
  - Name
  - Color (color picker)
    │
    ▼
User clicks "Save"
    │
    ▼
Validation: name required
    │
    ▼
addCategory({ name, color }) called
    │
    ▼
Store updates:
  - Generate ID
  - Add to categories array
    │
    ▼
localStorage auto-saves
    │
    ▼
Form closes
    │
    ▼
Toast: "Category added successfully"
    │
    ▼
New category appears in grid
```

#### 3.1.2. Business Rules

- **Name Required**: Category name bắt buộc
- **ID Generation**: Random string
- **Color Format**: Hex color code
- **No Duplicate Check**: Có thể tạo category trùng tên (có thể cải thiện)

### 3.2. Xóa Category

#### 3.2.1. Flow Diagram

```
User clicks "Delete" on category card
    │
    ▼
Check: getUsageCount(id) > 0?
    │
    ├─ Yes: Alert "Cannot delete category..."
    │  └─> Flow stops
    │
    └─ No: Continue
       │
       ▼
Confirmation dialog
       │
       ├─ User clicks "Cancel"
       │  └─> Flow stops
       │
       └─ User clicks "OK"
          │
          ▼
deleteCategory(id) called
          │
          ▼
Store updates:
  - Filter out category by ID
          │
          ▼
localStorage auto-saves
          │
          ▼
Toast: "Category deleted"
          │
          ▼
Category removed from grid
```

#### 3.2.2. Code Flow

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

const getUsageCount = (catId: string) => 
  prompts.filter(p => p.categoryId === catId).length;
```

#### 3.2.3. Business Rules

- **Usage Check**: Không thể xóa category đang được sử dụng
- **Confirmation Required**: Phải confirm trước khi xóa
- **No Cascade**: Không tự động xóa/update prompts khi xóa category

## 4. SEARCH & FILTER WORKFLOWS

### 4.1. Search Prompts

#### 4.1.1. Flow Diagram

```
User types in search input
    │
    ▼
searchTerm state updates
    │
    ▼
useMemo triggers re-compute
    │
    ▼
Filter prompts:
  - Check title (case-insensitive)
  - Check content (case-insensitive)
  - Check tags (case-insensitive, any match)
    │
    ▼
filteredPrompts array updated
    │
    ▼
Component re-renders
    │
    ▼
Grid displays filtered results
```

#### 4.1.2. Code Flow

**File**: `pages/Library.tsx`

```typescript
const [searchTerm, setSearchTerm] = useState('');

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
```

#### 4.1.3. Business Rules

- **Real-time**: Filter ngay khi type (không có debounce)
- **Case-insensitive**: Không phân biệt hoa thường
- **Multi-field**: Search trong title, content, tags
- **Tag Match**: Chỉ cần 1 tag match là được

### 4.2. Filter by Category

#### 4.2.1. Flow Diagram

```
User selects category from dropdown
    │
    ▼
filterCategory state updates
    │
    ▼
useMemo triggers re-compute
    │
    ▼
Filter prompts:
  - If "ALL": Show all
  - Else: categoryId === filterCategory
    │
    ▼
Combine with search filter (AND logic)
    │
    ▼
filteredPrompts array updated
    │
    ▼
Component re-renders
```

#### 4.2.2. Business Rules

- **AND Logic**: Search và Category filter kết hợp với AND
- **"ALL" Option**: Hiển thị tất cả categories
- **Real-time**: Filter ngay khi select

## 5. DATA MANAGEMENT WORKFLOWS

### 5.1. Export Data

#### 5.1.1. Flow Diagram

```
User clicks "Export JSON"
    │
    ▼
Collect data:
  - prompts array
  - categories array
  - metadata (app, exportedAt)
    │
    ▼
Create JSON string (formatted)
    │
    ▼
Create Blob with JSON
    │
    ▼
Create download link
    │
    ▼
Trigger download
    │
    ▼
Cleanup: Remove link, revoke URL
    │
    ▼
Toast: "Data exported successfully"
```

#### 5.1.2. Code Flow

**File**: `pages/Settings.tsx`

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

#### 5.1.3. Export Format

```json
{
  "app": "PromptVault",
  "exportedAt": "2024-01-01T00:00:00.000Z",
  "prompts": [...],
  "categories": [...]
}
```

### 5.2. Import Data

#### 5.2.1. Flow Diagram

```
User clicks "Import JSON"
    │
    ▼
File input dialog opens
    │
    ▼
User selects JSON file
    │
    ▼
FileReader reads file
    │
    ▼
Parse JSON
    │
    ├─ Parse error
    │  └─> Toast "Error parsing JSON file"
    │
    └─ Parse success
       │
       ▼
Validate format:
  - json.app === 'PromptVault'
  - json.prompts is array
       │
       ├─ Invalid
       │  └─> Toast "Invalid file format"
       │
       └─ Valid
          │
          ▼
importPrompts(json.prompts) called
          │
          ▼
Store updates:
  - Get existing IDs
  - Filter new prompts (not in existing)
  - Merge into array
          │
          ▼
localStorage auto-saves
          │
          ▼
Reset file input
          │
          ▼
Toast: "Imported X prompts"
```

#### 5.2.2. Code Flow

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

#### 5.2.3. Business Rules

- **Format Validation**: Phải có `app === 'PromptVault'` và `prompts` là array
- **Merge Strategy**: Chỉ import prompts có ID chưa tồn tại
- **No Category Import**: Hiện tại chỉ import prompts, không import categories
- **Error Handling**: Try-catch với user-friendly messages

### 5.3. Reset Application

#### 5.3.1. Flow Diagram

```
User clicks "Reset Application Data"
    │
    ▼
Confirmation dialog (danger warning)
    │
    ├─ User clicks "Cancel"
    │  └─> Flow stops
    │
    └─ User clicks "OK"
       │
       ▼
resetPrompts() called
       │
       ▼
Store resets to seed data
       │
       ▼
localStorage.clear()
       │
       ▼
location.reload()
       │
       ▼
App restarts with default data
```

#### 5.3.2. Code Flow

```typescript
const handleReset = () => {
  if (confirm('DANGER: This will delete all your local changes and reset to default seed data. This cannot be undone.')) {
    resetPrompts();
    localStorage.clear();
    location.reload();
  }
};
```

#### 5.3.3. Business Rules

- **Danger Action**: Phải có confirmation với warning
- **Complete Reset**: Clear tất cả localStorage
- **Page Reload**: Reload để reset tất cả stores
- **No Undo**: Không thể undo

## 6. USER PROFILE WORKFLOWS

### 6.1. Cập Nhật Profile

#### 6.1.1. Flow Diagram

```
User navigates to User page
    │
    ▼
Form displays current name
    │
    ▼
User edits name
    │
    ▼
User clicks "Save Changes"
    │
    ▼
Validation: name.trim()
    │
    ▼
setUser(name.trim()) called
    │
    ▼
Store updates:
  - Update user.name
  - Generate new avatarInitials
    │
    ▼
localStorage auto-saves
    │
    ▼
Toast: "Profile updated!"
    │
    ▼
Avatar updates with new initials
```

#### 6.1.2. Code Flow

```typescript
const handleSave = (e: React.FormEvent) => {
  e.preventDefault();
  if (nameInput.trim()) {
    setUser(nameInput.trim());
    showToast('Profile updated!');
  }
};
```

#### 6.1.3. Business Rules

- **Trim Whitespace**: Tự động trim name
- **Auto Initials**: Tự động generate initials từ name
- **Validation**: Name không được empty sau trim

## 7. NAVIGATION WORKFLOWS

### 7.1. View Navigation

#### 7.1.1. Flow Diagram

```
User clicks navigation item
    │
    ▼
setView(viewName) called
    │
    ▼
UIStore updates:
  - currentView = viewName
    │
    ▼
App.tsx renderView() re-runs
    │
    ▼
Switch statement matches view
    │
    ▼
Corresponding page component renders
    │
    ▼
Header highlights active nav item
```

#### 7.1.2. Business Rules

- **State-Based**: Navigation bằng state, không dùng URL
- **No History**: Không có browser history (back/forward)
- **Active Highlight**: Header tự động highlight active view

---

## TÓM TẮT

PromptVault có các workflows chính:

1. **Prompt CRUD**: Create, Read, Update, Delete
2. **Category Management**: Add, Delete với validation
3. **Search & Filter**: Real-time filtering
4. **Data Management**: Export, Import, Reset
5. **User Profile**: Update name và avatar
6. **Navigation**: View-based routing

Tất cả workflows:
- ✅ Validation ở UI level
- ✅ Toast notifications
- ✅ Auto-persistence
- ✅ Error handling

---

**Xem thêm:**
- [PAGES.md](./PAGES.md) - Page implementations
- [API_REFERENCE.md](./API_REFERENCE.md) - Store APIs
