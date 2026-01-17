# 📊 PHÂN TÍCH TÍNH NĂNG IMPORT/EXPORT JSON

## 1. TỔNG QUAN

Tài liệu này phân tích chi tiết tính năng Import/Export JSON cho prompts, logic hiện tại, các vấn đề và phương án cải tiến.

---

## 2. FILES CHỊU TRÁCH NHIỆM

### 2.1. Files Liên Quan

#### 2.1.1. `pages/Settings.tsx`
**Vai trò**: UI layer, xử lý user interactions

**Chức năng**:
- `handleExport()`: Export prompts và categories ra JSON file
- `handleImport()`: Import prompts từ JSON file
- UI components: Export button, Import button, file input

**Dependencies**:
- `usePromptStore`: prompts, importPrompts, resetPrompts
- `useCategoryStore`: categories
- `useUIStore`: showToast

#### 2.1.2. `store.ts` (PromptStore)
**Vai trò**: Business logic layer, xử lý data operations

**Chức năng**:
- `importPrompts(data: Prompt[])`: Merge prompts vào store
- Logic merge: tránh duplicates dựa trên ID

**Location**: Lines 168-173

---

## 3. LOGIC HIỆN TẠI

### 3.1. EXPORT LOGIC

#### 3.1.1. Flow Chi Tiết

```
User clicks "Export JSON"
    │
    ▼
handleExport() được gọi
    │
    ▼
Collect data:
  - prompts (từ PromptStore)
  - categories (từ CategoryStore)
  - exportedAt (ISO timestamp)
  - app ("PromptVault")
    │
    ▼
JSON.stringify(data, null, 2)
    │
    ▼
Create Blob với type "application/json"
    │
    ▼
Create ObjectURL từ Blob
    │
    ▼
Create <a> element với download attribute
    │
    ▼
Filename: "promptvault-backup-YYYY-MM-DD.json"
    │
    ▼
Trigger click() để download
    │
    ▼
Cleanup: Remove <a>, revoke URL
    │
    ▼
showToast("Data exported successfully.")
```

#### 3.1.2. Code Implementation

**File**: `pages/Settings.tsx` (lines 12-30)

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

#### 3.1.3. Export Format

```json
{
  "app": "PromptVault",
  "exportedAt": "2024-01-01T00:00:00.000Z",
  "prompts": [
    {
      "id": "p_1",
      "title": "React Component",
      "content": "...",
      "description": "...",
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

#### 3.1.4. Điểm Mạnh
- ✅ Export đầy đủ prompts và categories
- ✅ Có metadata (app, exportedAt)
- ✅ JSON formatted (readable)
- ✅ Filename có timestamp
- ✅ Cleanup đúng cách (revoke URL)

#### 3.1.5. Hạn Chế
- ⚠️ Không có version trong export format
- ⚠️ Không có thông tin về số lượng items
- ⚠️ Không có compression (file có thể lớn)
- ⚠️ Không có progress indicator cho large exports

### 3.2. IMPORT LOGIC

#### 3.2.1. Flow Chi Tiết

```
User clicks "Import JSON"
    │
    ▼
fileInputRef.current.click() trigger
    │
    ▼
File input dialog opens
    │
    ▼
User selects JSON file
    │
    ▼
handleImport() được gọi với file event
    │
    ▼
Check: file exists?
    │
    ├─ No: return (silent)
    │
    └─ Yes: Continue
       │
       ▼
FileReader.readAsText(file)
       │
       ▼
reader.onload event fires
       │
       ▼
Try: JSON.parse(result)
       │
       ├─ Parse Error
       │  └─> showToast("Error parsing JSON file.")
       │
       └─ Parse Success
          │
          ▼
Validate format:
          - json.app === 'PromptVault'
          - json.prompts is array
          │
          ├─ Invalid
          │  └─> showToast("Invalid file format.")
          │
          └─ Valid
             │
             ▼
importPrompts(json.prompts) called
             │
             ▼
Store: importPrompts(data)
             │
             ▼
Get existing prompt IDs (Set)
             │
             ▼
Filter: prompts with ID not in existing
             │
             ▼
Merge: [...existing, ...new]
             │
             ▼
Store updates
             │
             ▼
localStorage auto-saves
             │
             ▼
Reset file input value
             │
             ▼
showToast("Imported X prompts")
```

#### 3.2.2. Code Implementation

**File**: `pages/Settings.tsx` (lines 32-54)

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

**File**: `store.ts` (lines 168-173)

```typescript
importPrompts: (data) => set((state) => {
  // Simple merge strategy: append new ones, avoid exact ID duplicates
  const existingIds = new Set(state.prompts.map(p => p.id));
  const newPrompts = data.filter(p => !existingIds.has(p.id));
  return { prompts: [...state.prompts, ...newPrompts] };
}),
```

#### 3.2.3. Validation Logic

**Current Validation**:
1. ✅ File exists check
2. ✅ JSON parse (try-catch)
3. ✅ `json.app === 'PromptVault'`
4. ✅ `json.prompts is array`

**Missing Validations**:
- ❌ Không validate structure của từng prompt
- ❌ Không validate required fields (id, title, content, categoryId)
- ❌ Không validate categoryId references
- ❌ Không validate data types
- ❌ Không validate file size
- ❌ Không validate version compatibility

#### 3.2.4. Merge Strategy

**Current Strategy**: ID-based deduplication

```typescript
// Logic
const existingIds = new Set(state.prompts.map(p => p.id));
const newPrompts = data.filter(p => !existingIds.has(p.id));
return { prompts: [...state.prompts, ...newPrompts] };
```

**Behavior**:
- ✅ Prompts có ID đã tồn tại → Bỏ qua (không import)
- ✅ Prompts có ID mới → Thêm vào cuối array
- ✅ Không có conflict resolution
- ✅ Không có user choice (skip/overwrite/rename)

#### 3.2.5. Điểm Mạnh
- ✅ Có basic validation
- ✅ Tránh duplicates
- ✅ Error handling cơ bản
- ✅ Toast notifications

#### 3.2.6. Hạn Chế Nghiêm Trọng

**1. Không Import Categories**
- ⚠️ Export có categories nhưng import không xử lý
- ⚠️ Comment trong code: "Logic for merging categories could be added here"
- ⚠️ Prompts có thể reference categories không tồn tại

**2. Validation Yếu**
- ⚠️ Không validate prompt structure
- ⚠️ Không validate categoryId references
- ⚠️ Không validate data types
- ⚠️ Có thể import invalid data

**3. Không Có Preview**
- ⚠️ User không biết sẽ import bao nhiêu prompts
- ⚠️ User không biết có bao nhiêu duplicates
- ⚠️ User không thể chọn prompts cụ thể để import

**4. Không Có Conflict Resolution**
- ⚠️ Duplicates bị bỏ qua tự động (user không biết)
- ⚠️ Không có option để overwrite
- ⚠️ Không có option để rename

**5. UX Issues**
- ⚠️ Không có loading state
- ⚠️ Không có progress indicator
- ⚠️ Toast message không chính xác (hiển thị tổng số, không phải số đã import)
- ⚠️ Không có undo functionality

**6. Error Handling Yếu**
- ⚠️ Generic error messages
- ⚠️ Không có detailed error info
- ⚠️ Không log errors để debug

---

## 4. VẤN ĐỀ VÀ RỦI RO

### 4.1. Vấn Đề Kỹ Thuật

#### 4.1.1. Category Reference Issues
**Vấn đề**: Import prompts với categoryId không tồn tại

**Scenario**:
1. User A export prompts với custom categories
2. User B import vào app có categories khác
3. Prompts được import nhưng categoryId không match
4. UI sẽ hiển thị "Uncategorized" hoặc lỗi

**Impact**: 
- ⚠️ Data integrity issues
- ⚠️ User confusion
- ⚠️ Broken UI

#### 4.1.2. Data Validation Issues
**Vấn đề**: Không validate structure và types

**Rủi ro**:
- ⚠️ Import invalid prompts → app có thể crash
- ⚠️ Missing required fields → runtime errors
- ⚠️ Wrong data types → unexpected behavior

#### 4.1.3. Performance Issues
**Vấn đề**: Không có optimization cho large imports

**Rủi ro**:
- ⚠️ Import 1000+ prompts → UI freeze
- ⚠️ Blocking operation → poor UX
- ⚠️ Memory issues với very large files

### 4.2. Vấn Đề UX

#### 4.2.1. Lack of Feedback
- ⚠️ User không biết import đang xử lý
- ⚠️ User không biết kết quả chi tiết
- ⚠️ Toast message không chính xác

#### 4.2.2. No Control
- ⚠️ User không thể chọn prompts để import
- ⚠️ User không thể resolve conflicts
- ⚠️ User không thể preview trước khi import

#### 4.2.3. Poor Error Messages
- ⚠️ Generic messages không giúp user hiểu vấn đề
- ⚠️ Không có hướng dẫn fix errors

---

## 5. PHƯƠNG ÁN CẢI TIẾN

### 5.1. CẢI TIẾN EXPORT

#### 5.1.1. Thêm Version & Metadata

**Đề xuất**:
```typescript
const handleExport = () => {
  const data = {
    app: 'PromptVault',
    version: '1.0.0',  // NEW: Version
    exportedAt: new Date().toISOString(),
    exportedBy: user.name,  // NEW: User info
    stats: {  // NEW: Statistics
      promptsCount: prompts.length,
      categoriesCount: categories.length,
    },
    prompts,
    categories,
  };
  // ... rest of code
};
```

**Lợi ích**:
- ✅ Version tracking cho compatibility
- ✅ User info để audit
- ✅ Stats để preview

#### 5.1.2. Thêm Export Options

**Đề xuất**: Modal với options
- ✅ Export prompts only
- ✅ Export categories only
- ✅ Export all (default)
- ✅ Include/exclude specific fields

**UI Flow**:
```
Click "Export JSON"
    │
    ▼
Modal opens với options
    │
    ▼
User selects options
    │
    ▼
Click "Export"
    │
    ▼
Generate và download
```

#### 5.1.3. Compression (Optional)

**Đề xuất**: Compress JSON cho large exports
- ✅ Gzip compression
- ✅ Smaller file size
- ✅ Faster download

### 5.2. CẢI TIẾN IMPORT (QUAN TRỌNG)

#### 5.2.1. Validation Layer

**Đề xuất**: Tạo validation function

```typescript
// utils/importValidation.ts
interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  stats: {
    total: number;
    valid: number;
    invalid: number;
    duplicates: number;
    missingCategories: number;
  };
}

const validateImportData = (
  json: any,
  existingPrompts: Prompt[],
  existingCategories: Category[]
): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Validate format
  if (json.app !== 'PromptVault') {
    errors.push('Invalid app identifier');
  }
  
  if (!Array.isArray(json.prompts)) {
    errors.push('Prompts must be an array');
  }
  
  // Validate each prompt
  const existingIds = new Set(existingPrompts.map(p => p.id));
  const existingCategoryIds = new Set(existingCategories.map(c => c.id));
  
  let validCount = 0;
  let invalidCount = 0;
  let duplicateCount = 0;
  let missingCategoryCount = 0;
  
  json.prompts?.forEach((prompt: any, index: number) => {
    // Required fields
    if (!prompt.id) errors.push(`Prompt ${index}: Missing id`);
    if (!prompt.title) errors.push(`Prompt ${index}: Missing title`);
    if (!prompt.content) errors.push(`Prompt ${index}: Missing content`);
    if (!prompt.categoryId) errors.push(`Prompt ${index}: Missing categoryId`);
    
    // Type validation
    if (typeof prompt.title !== 'string') errors.push(`Prompt ${index}: title must be string`);
    if (typeof prompt.content !== 'string') errors.push(`Prompt ${index}: content must be string`);
    if (!Array.isArray(prompt.tags)) errors.push(`Prompt ${index}: tags must be array`);
    
    // Business logic validation
    if (existingIds.has(prompt.id)) {
      duplicateCount++;
      warnings.push(`Prompt "${prompt.title}" (ID: ${prompt.id}) already exists`);
    }
    
    if (!existingCategoryIds.has(prompt.categoryId)) {
      missingCategoryCount++;
      warnings.push(`Prompt "${prompt.title}" references unknown category: ${prompt.categoryId}`);
    }
    
    if (errors.length === 0) validCount++;
    else invalidCount++;
  });
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    stats: {
      total: json.prompts?.length || 0,
      valid: validCount,
      invalid: invalidCount,
      duplicates: duplicateCount,
      missingCategories: missingCategoryCount,
    }
  };
};
```

#### 5.2.2. Import Preview Modal

**Đề xuất**: Modal hiển thị preview trước khi import

**UI Components**:
```typescript
interface ImportPreviewModalProps {
  validationResult: ValidationResult;
  onConfirm: () => void;
  onCancel: () => void;
}

// Modal hiển thị:
// - Tổng số prompts
// - Số prompts sẽ import (valid)
// - Số duplicates (sẽ skip)
// - Số invalid (sẽ skip)
// - Warnings về missing categories
// - List prompts sẽ import
// - Options: Import all / Select specific
```

**Flow**:
```
User selects file
    │
    ▼
Validate file
    │
    ▼
Show preview modal với:
  - Stats
  - Warnings
  - List prompts
    │
    ▼
User reviews
    │
    ├─ Cancel: Close modal
    │
    └─ Confirm: Import
       │
       ▼
Execute import
```

#### 5.2.3. Category Import Logic

**Đề xuất**: Import và merge categories

**Strategy Options**:

**Option 1: Merge by ID (Recommended)**
```typescript
// Import categories với merge strategy
const importCategories = (data: Category[]) => {
  const existingIds = new Set(categories.map(c => c.id));
  const newCategories = data.filter(c => !existingIds.has(c.id));
  
  // Merge: existing + new
  return [...categories, ...newCategories];
};
```

**Option 2: Merge by Name**
```typescript
// Merge categories với cùng tên
const existingNames = new Set(categories.map(c => c.name.toLowerCase()));
const newCategories = data.filter(c => 
  !existingNames.has(c.name.toLowerCase())
);
```

**Option 3: User Choice**
```typescript
// Show conflicts và cho user chọn:
// - Keep existing
// - Replace with imported
// - Rename imported
```

**Recommended**: Option 1 (by ID) - đơn giản và an toàn

#### 5.2.4. Conflict Resolution

**Đề xuất**: Options cho duplicates

**Strategy Options**:
1. **Skip (Current)**: Bỏ qua duplicates
2. **Overwrite**: Ghi đè prompts cũ
3. **Rename**: Tạo ID mới cho imported prompts
4. **User Choice**: Modal cho user chọn từng prompt

**Recommended**: Default "Skip" + Option để user chọn strategy

#### 5.2.5. Category Reference Resolution

**Đề xuất**: Auto-resolve missing categories

**Strategy**:
```typescript
// Khi import prompts với categoryId không tồn tại:
// Option 1: Auto-create category (nếu có trong import data)
// Option 2: Map to "Uncategorized" hoặc default category
// Option 3: Show warning và skip prompts

// Recommended: Option 1
const resolveCategoryReferences = (
  prompts: Prompt[],
  importedCategories: Category[],
  existingCategories: Category[]
) => {
  // Import categories trước
  const allCategories = mergeCategories(importedCategories, existingCategories);
  
  // Map prompts với categories
  prompts.forEach(prompt => {
    if (!allCategories.find(c => c.id === prompt.categoryId)) {
      // Fallback: assign to first category hoặc "Uncategorized"
      prompt.categoryId = existingCategories[0]?.id || 'uncategorized';
    }
  });
};
```

#### 5.2.6. Loading & Progress

**Đề xuất**: Loading states và progress indicator

```typescript
const [isImporting, setIsImporting] = useState(false);
const [importProgress, setImportProgress] = useState(0);

const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;
  
  setIsImporting(true);
  setImportProgress(0);
  
  try {
    // Read file
    const text = await readFileAsync(file);
    setImportProgress(25);
    
    // Parse JSON
    const json = JSON.parse(text);
    setImportProgress(50);
    
    // Validate
    const validation = validateImportData(json, prompts, categories);
    setImportProgress(75);
    
    // Import
    if (validation.isValid) {
      await importData(json, validation);
      setImportProgress(100);
    }
  } finally {
    setIsImporting(false);
    setImportProgress(0);
  }
};
```

#### 5.2.7. Better Error Messages

**Đề xuất**: Detailed error messages

```typescript
interface ImportError {
  type: 'parse' | 'validation' | 'import';
  message: string;
  details?: string;
  line?: number;
}

const getErrorMessage = (error: ImportError): string => {
  switch (error.type) {
    case 'parse':
      return `Failed to parse JSON file: ${error.message}`;
    case 'validation':
      return `Validation failed: ${error.message}. ${error.details}`;
    case 'import':
      return `Import failed: ${error.message}`;
    default:
      return 'Unknown error occurred';
  }
};
```

### 5.3. CẢI TIẾN STORE LOGIC

#### 5.3.1. Enhanced importPrompts

**Đề xuất**: Thêm options và return value

```typescript
interface ImportOptions {
  strategy?: 'skip' | 'overwrite' | 'rename';
  validateCategories?: boolean;
  autoCreateCategories?: boolean;
}

interface ImportResult {
  imported: number;
  skipped: number;
  overwritten: number;
  errors: string[];
}

importPrompts: (
  data: Prompt[],
  options?: ImportOptions
) => ImportResult
```

**Implementation**:
```typescript
importPrompts: (data, options = {}) => {
  const {
    strategy = 'skip',
    validateCategories = true,
    autoCreateCategories = false,
  } = options;
  
  return set((state) => {
    const existingIds = new Set(state.prompts.map(p => p.id));
    const result: ImportResult = {
      imported: 0,
      skipped: 0,
      overwritten: 0,
      errors: [],
    };
    
    const newPrompts: Prompt[] = [];
    
    data.forEach(prompt => {
      const exists = existingIds.has(prompt.id);
      
      if (exists) {
        if (strategy === 'skip') {
          result.skipped++;
          return;
        } else if (strategy === 'overwrite') {
          // Remove old, add new
          const filtered = state.prompts.filter(p => p.id !== prompt.id);
          newPrompts.push(prompt);
          result.overwritten++;
          return;
        } else if (strategy === 'rename') {
          // Generate new ID
          prompt.id = generateId();
          newPrompts.push(prompt);
          result.imported++;
          return;
        }
      }
      
      // New prompt
      newPrompts.push(prompt);
      result.imported++;
    });
    
    return {
      prompts: strategy === 'overwrite' 
        ? [...state.prompts.filter(p => !existingIds.has(p.id)), ...newPrompts]
        : [...state.prompts, ...newPrompts]
    };
  });
}
```

#### 5.3.2. Add importCategories

**Đề xuất**: Thêm function import categories

```typescript
// In CategoryStore
importCategories: (data: Category[]) => {
  const existingIds = new Set(categories.map(c => c.id));
  const newCategories = data.filter(c => !existingIds.has(c.id));
  return { categories: [...categories, ...newCategories] };
}
```

### 5.4. UI/UX IMPROVEMENTS

#### 5.4.1. Import Modal Component

**Đề xuất**: Tạo `ImportModal.tsx`

**Features**:
- File selection
- Validation preview
- Conflict resolution options
- Progress indicator
- Error display
- Success summary

**Structure**:
```typescript
<ImportModal>
  <Step1: FileSelection />
  <Step2: ValidationPreview />
  <Step3: ConflictResolution />
  <Step4: ImportProgress />
  <Step5: ImportSummary />
</ImportModal>
```

#### 5.4.2. Export Options Modal

**Đề xuất**: Tạo `ExportModal.tsx`

**Features**:
- Select what to export (prompts, categories, all)
- Include/exclude fields
- Format options
- Preview stats

#### 5.4.3. Better Toast Messages

**Đề xuất**: Detailed toast với actions

```typescript
// Success toast với details
showToast({
  message: 'Import completed',
  details: 'Imported 50 prompts, skipped 10 duplicates',
  action: 'View imported prompts',
  onAction: () => setView('MY_PROMPTS'),
});

// Error toast với help
showToast({
  message: 'Import failed',
  details: '5 prompts have invalid data',
  type: 'error',
  action: 'View errors',
  onAction: () => showErrorDetails(),
});
```

---

## 6. IMPLEMENTATION PLAN

### 6.1. Phase 1: Validation & Error Handling (Priority: High)

**Tasks**:
1. ✅ Tạo `utils/importValidation.ts`
2. ✅ Implement validation function
3. ✅ Update `handleImport` để sử dụng validation
4. ✅ Improve error messages

**Files to modify**:
- `pages/Settings.tsx`
- `utils/importValidation.ts` (new)

**Estimated effort**: 2-3 hours

### 6.2. Phase 2: Import Preview (Priority: High)

**Tasks**:
1. ✅ Tạo `components/ImportModal.tsx`
2. ✅ Implement preview UI
3. ✅ Show validation results
4. ✅ Allow user to confirm/cancel

**Files to create**:
- `components/ImportModal.tsx`

**Files to modify**:
- `pages/Settings.tsx`

**Estimated effort**: 4-5 hours

### 6.3. Phase 3: Category Import (Priority: Medium)

**Tasks**:
1. ✅ Add `importCategories` to CategoryStore
2. ✅ Update import logic để import categories
3. ✅ Handle category references
4. ✅ Resolve missing categories

**Files to modify**:
- `store.ts` (CategoryStore)
- `pages/Settings.tsx`
- `components/ImportModal.tsx`

**Estimated effort**: 3-4 hours

### 6.4. Phase 4: Conflict Resolution (Priority: Medium)

**Tasks**:
1. ✅ Update `importPrompts` với options
2. ✅ Add conflict resolution UI
3. ✅ Implement strategies (skip/overwrite/rename)

**Files to modify**:
- `store.ts` (PromptStore)
- `components/ImportModal.tsx`

**Estimated effort**: 4-5 hours

### 6.5. Phase 5: UX Enhancements (Priority: Low)

**Tasks**:
1. ✅ Add loading states
2. ✅ Add progress indicator
3. ✅ Improve toast messages
4. ✅ Add export options modal

**Files to create**:
- `components/ExportModal.tsx`

**Files to modify**:
- `pages/Settings.tsx`
- `components/ImportModal.tsx`

**Estimated effort**: 3-4 hours

---

## 7. RECOMMENDED APPROACH

### 7.1. Immediate Improvements (Quick Wins)

**1. Fix Toast Message Accuracy**
```typescript
// Current: Shows total prompts in file
showToast(`Imported ${json.prompts.length} prompts.`);

// Should: Show actually imported count
const result = importPrompts(json.prompts);
showToast(`Imported ${result.imported} prompts, skipped ${result.skipped} duplicates.`);
```

**2. Add Basic Validation**
```typescript
// Validate prompt structure
const isValidPrompt = (p: any): p is Prompt => {
  return p.id && p.title && p.content && p.categoryId;
};

if (!json.prompts.every(isValidPrompt)) {
  showToast('Some prompts have invalid data.');
  return;
}
```

**3. Import Categories**
```typescript
// After validating prompts
if (json.categories && Array.isArray(json.categories)) {
  // Import categories first
  json.categories.forEach(cat => {
    if (!categories.find(c => c.id === cat.id)) {
      addCategory({ name: cat.name, color: cat.color });
    }
  });
}
```

### 7.2. Medium-Term Improvements

**1. Import Preview Modal**
- Validate trước khi import
- Show preview và stats
- User confirm trước khi import

**2. Enhanced Validation**
- Validate structure
- Validate types
- Validate references
- Detailed error messages

**3. Conflict Resolution**
- Options cho duplicates
- User choice per prompt
- Better merge strategies

### 7.3. Long-Term Improvements

**1. Advanced Features**
- Selective import (chọn prompts)
- Batch operations
- Import from URL
- Auto-sync với cloud (nếu có backend)

**2. Performance**
- Streaming import cho large files
- Web Workers cho processing
- Progress tracking
- Chunked processing

---

## 8. RISK ASSESSMENT

### 8.1. Current Risks

| Risk | Severity | Likelihood | Impact |
|------|----------|------------|--------|
| Import invalid data | High | Medium | App crashes, data corruption |
| Missing category references | Medium | High | Broken UI, user confusion |
| Large file import freeze | Medium | Low | Poor UX, app unresponsive |
| Data loss from overwrite | High | Low | User data lost |

### 8.2. Mitigation Strategies

1. **Validation**: Comprehensive validation trước khi import
2. **Preview**: User review trước khi commit
3. **Backup**: Auto-backup trước khi import
4. **Undo**: Undo functionality
5. **Progress**: Loading states và progress tracking

---

## 9. TESTING RECOMMENDATIONS

### 9.1. Test Cases

**Export**:
- ✅ Export với prompts và categories
- ✅ Export với empty data
- ✅ Export với large dataset (1000+ prompts)
- ✅ Export filename format

**Import**:
- ✅ Import valid file
- ✅ Import invalid JSON
- ✅ Import với duplicates
- ✅ Import với missing categories
- ✅ Import với invalid prompt structure
- ✅ Import large file (performance)
- ✅ Import empty file
- ✅ Import file với wrong format

**Edge Cases**:
- ✅ Import prompts với categoryId không tồn tại
- ✅ Import với circular references
- ✅ Import với very long content
- ✅ Import với special characters
- ✅ Import với unicode

---

## 10. SUMMARY & RECOMMENDATIONS

### 10.1. Current State

**Strengths**:
- ✅ Basic export/import hoạt động
- ✅ Có error handling cơ bản
- ✅ Tránh duplicates

**Weaknesses**:
- ❌ Không import categories
- ❌ Validation yếu
- ❌ Không có preview
- ❌ Không có conflict resolution
- ❌ UX chưa tốt

### 10.2. Priority Recommendations

**Must Have (P0)**:
1. ✅ Fix toast message accuracy
2. ✅ Add basic validation
3. ✅ Import categories
4. ✅ Validate category references

**Should Have (P1)**:
1. ✅ Import preview modal
2. ✅ Enhanced validation
3. ✅ Better error messages
4. ✅ Loading states

**Nice to Have (P2)**:
1. ✅ Conflict resolution
2. ✅ Export options
3. ✅ Progress indicator
4. ✅ Undo functionality

### 10.3. Implementation Order

1. **Week 1**: Fix critical issues (P0)
2. **Week 2**: Add preview và validation (P1)
3. **Week 3**: UX enhancements (P2)

---

## 11. CODE STRUCTURE PROPOSAL

### 11.1. New Files Structure

```
utils/
  ├── importValidation.ts    # Validation logic
  ├── importHelpers.ts       # Helper functions
  └── exportHelpers.ts      # Export helpers

components/
  ├── ImportModal.tsx        # Import preview modal
  └── ExportModal.tsx        # Export options modal
```

### 11.2. Updated Files

```
store.ts
  ├── PromptStore
  │   └── importPrompts()    # Enhanced với options
  └── CategoryStore
      └── importCategories() # New function

pages/Settings.tsx
  ├── handleExport()         # Enhanced với options
  └── handleImport()         # Enhanced với validation & preview
```

---

**Tài liệu này cung cấp phân tích chi tiết và phương án cải tiến cho tính năng Import/Export JSON.**

**Ngày phân tích**: 2024  
**Phiên bản**: 1.0
