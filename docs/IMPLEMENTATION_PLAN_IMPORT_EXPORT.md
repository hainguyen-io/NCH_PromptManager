# 📋 KẾ HOẠCH TRIỂN KHAI CẢI TIẾN IMPORT/EXPORT JSON

## TỔNG QUAN

Tài liệu này mô tả chi tiết từng bước để cải tiến tính năng Import/Export JSON, bao gồm: mục tiêu, file cần thay đổi, nội dung cụ thể, và lý do thực hiện.

---

## 🎯 MỤC TIÊU TỔNG THỂ

Cải tiến tính năng Import/Export JSON để:
1. ✅ Import được cả categories (hiện tại chỉ import prompts)
2. ✅ Validation đầy đủ và chính xác
3. ✅ UX tốt hơn với preview và feedback
4. ✅ Xử lý conflicts và errors tốt hơn
5. ✅ Hệ thống ổn định và reliable

---

## 📊 PHÂN LOẠI THEO ĐỘ ƯU TIÊN

### Priority 0 (Critical - Phải làm ngay)
- Bước 1: Fix toast message accuracy
- Bước 2: Import categories
- Bước 3: Basic validation

### Priority 1 (Important - Nên làm sớm)
- Bước 4: Import preview modal
- Bước 5: Enhanced validation
- Bước 6: Loading states

### Priority 2 (Nice to have - Có thể làm sau)
- Bước 7: Conflict resolution
- Bước 8: Export options
- Bước 9: Progress indicator

---

## 🔧 CHI TIẾT TỪNG BƯỚC

---

## BƯỚC 1: FIX TOAST MESSAGE ACCURACY

### 🎯 Mục Tiêu
Sửa toast message để hiển thị số prompts thực sự được import (không phải tổng số trong file).

### 📁 Files Cần Thay Đổi

#### 1.1. `store.ts` (PromptStore)
**Vị trí**: Function `importPrompts` (lines 168-173)

**Thay đổi**:
- Thay đổi return type từ `void` → `ImportResult`
- Return object với stats: `{ imported, skipped, errors }`

**Lý do**:
- Hiện tại function không return gì, UI không biết kết quả thực tế
- Cần return stats để UI hiển thị chính xác

**Nội dung cụ thể**:
```typescript
// BEFORE
importPrompts: (data: Prompt[]) => void

// AFTER
interface ImportResult {
  imported: number;    // Số prompts thực sự được import
  skipped: number;     // Số prompts bị skip (duplicates)
  errors: string[];    // Danh sách lỗi (nếu có)
}

importPrompts: (data: Prompt[]) => ImportResult
```

**Implementation**:
```typescript
importPrompts: (data) => {
  const result: ImportResult = {
    imported: 0,
    skipped: 0,
    errors: [],
  };
  
  return set((state) => {
    const existingIds = new Set(state.prompts.map(p => p.id));
    const newPrompts: Prompt[] = [];
    
    data.forEach(prompt => {
      if (existingIds.has(prompt.id)) {
        result.skipped++;
        return; // Skip duplicate
      }
      newPrompts.push(prompt);
      result.imported++;
    });
    
    return {
      prompts: [...state.prompts, ...newPrompts],
      // Note: Zustand không thể return result từ set()
      // Cần cách khác để get result
    };
  });
}
```

**Vấn đề**: Zustand `set()` không return value. Cần approach khác.

**Giải pháp**: Tính toán result trước khi gọi `set()`, hoặc dùng callback.

**Approach được đề xuất**:
```typescript
importPrompts: (data) => {
  return set((state) => {
    const existingIds = new Set(state.prompts.map(p => p.id));
    const newPrompts = data.filter(p => {
      if (existingIds.has(p.id)) {
        return false; // Skip
      }
      return true; // Import
    });
    
    // Store result trong state tạm thời (optional)
    // Hoặc return result qua callback
    
    return { prompts: [...state.prompts, ...newPrompts] };
  });
}

// Alternative: Separate function để tính stats
const getImportStats = (data: Prompt[], existing: Prompt[]) => {
  const existingIds = new Set(existing.map(p => p.id));
  const imported = data.filter(p => !existingIds.has(p.id));
  const skipped = data.filter(p => existingIds.has(p.id));
  
  return {
    imported: imported.length,
    skipped: skipped.length,
  };
};
```

#### 1.2. `pages/Settings.tsx`
**Vị trí**: Function `handleImport` (lines 32-54)

**Thay đổi**:
- Tính stats trước khi import
- Update toast message với stats chính xác

**Lý do**:
- Hiện tại toast hiển thị `json.prompts.length` (tổng số trong file)
- Cần hiển thị số thực sự được import sau khi filter duplicates

**Nội dung cụ thể**:
```typescript
// BEFORE
if (json.app === 'PromptVault' && Array.isArray(json.prompts)) {
  importPrompts(json.prompts);
  showToast(`Imported ${json.prompts.length} prompts.`);
}

// AFTER
if (json.app === 'PromptVault' && Array.isArray(json.prompts)) {
  // Calculate stats before import
  const existingIds = new Set(prompts.map(p => p.id));
  const toImport = json.prompts.filter(p => !existingIds.has(p.id));
  const duplicates = json.prompts.length - toImport.length;
  
  // Import
  importPrompts(json.prompts);
  
  // Show accurate message
  if (duplicates > 0) {
    showToast(`Imported ${toImport.length} prompts, skipped ${duplicates} duplicates.`);
  } else {
    showToast(`Imported ${toImport.length} prompts.`);
  }
}
```

**Tác động**:
- ✅ Toast message chính xác
- ✅ User biết có bao nhiêu duplicates
- ✅ Better UX

**Thời gian ước tính**: 15-20 phút

---

## BƯỚC 2: IMPORT CATEGORIES

### 🎯 Mục Tiêu
Thêm logic import categories khi import prompts, đảm bảo category references hợp lệ.

### 📁 Files Cần Thay Đổi

#### 2.1. `store.ts` (CategoryStore)
**Vị trí**: Sau `resetCategories` function (khoảng line 120)

**Thay đổi**:
- Thêm function `importCategories` vào CategoryStore interface và implementation

**Lý do**:
- Hiện tại chỉ có `addCategory`, `deleteCategory`, `resetCategories`
- Cần function để import nhiều categories cùng lúc
- Cần merge strategy tương tự như prompts

**Nội dung cụ thể**:

**1. Update Interface**:
```typescript
// BEFORE
interface CategoryState {
  categories: Category[];
  addCategory: (category: Omit<Category, 'id'>) => void;
  deleteCategory: (id: string) => void;
  resetCategories: () => void;
}

// AFTER
interface CategoryState {
  categories: Category[];
  addCategory: (category: Omit<Category, 'id'>) => void;
  deleteCategory: (id: string) => void;
  resetCategories: () => void;
  importCategories: (data: Category[]) => void;  // NEW
}
```

**2. Implement Function**:
```typescript
// In CategoryStore implementation
importCategories: (data) => set((state) => {
  // Merge strategy: chỉ add categories có ID chưa tồn tại
  const existingIds = new Set(state.categories.map(c => c.id));
  const newCategories = data.filter(c => !existingIds.has(c.id));
  return { categories: [...state.categories, ...newCategories] };
}),
```

**Lý do merge strategy**:
- Tránh duplicates (giống prompts)
- Giữ nguyên categories hiện tại
- Append categories mới vào cuối

#### 2.2. `pages/Settings.tsx`
**Vị trí**: Function `handleImport` (lines 32-54)

**Thay đổi**:
- Import categories trước khi import prompts
- Validate category references

**Lý do**:
- Prompts reference categories qua `categoryId`
- Cần đảm bảo categories tồn tại trước khi import prompts
- Tránh broken references

**Nội dung cụ thể**:
```typescript
// BEFORE
if (json.app === 'PromptVault' && Array.isArray(json.prompts)) {
  importPrompts(json.prompts);
  showToast(`Imported ${json.prompts.length} prompts.`);
}

// AFTER
if (json.app === 'PromptVault' && Array.isArray(json.prompts)) {
  // Step 1: Import categories first (if present)
  if (json.categories && Array.isArray(json.categories)) {
    importCategories(json.categories);
  }
  
  // Step 2: Validate category references
  const existingCategoryIds = new Set(categories.map(c => c.id));
  const promptsWithValidCategories = json.prompts.filter(p => 
    existingCategoryIds.has(p.categoryId)
  );
  
  const invalidCategoryRefs = json.prompts.length - promptsWithValidCategories.length;
  
  // Step 3: Import prompts
  if (promptsWithValidCategories.length > 0) {
    importPrompts(promptsWithValidCategories);
  }
  
  // Step 4: Show detailed message
  let message = '';
  if (promptsWithValidCategories.length > 0) {
    message += `Imported ${promptsWithValidCategories.length} prompts.`;
  }
  if (invalidCategoryRefs > 0) {
    message += ` ${invalidCategoryRefs} prompts skipped (invalid category references).`;
  }
  if (json.categories && Array.isArray(json.categories)) {
    const newCategories = json.categories.filter(c => 
      !categories.find(existing => existing.id === c.id)
    );
    if (newCategories.length > 0) {
      message += ` ${newCategories.length} categories imported.`;
    }
  }
  
  showToast(message || 'Import completed.');
}
```

**Cần import thêm**:
```typescript
// Top of file
import { useCategoryStore } from '../store';

// In component
const { categories, importCategories } = useCategoryStore();
```

**Tác động**:
- ✅ Categories được import
- ✅ Category references được validate
- ✅ Prompts với invalid categories bị skip
- ✅ User được thông báo chi tiết

**Thời gian ước tính**: 30-45 phút

---

## BƯỚC 3: BASIC VALIDATION

### 🎯 Mục Tiêu
Thêm validation cơ bản cho prompts trước khi import: required fields, data types, structure.

### 📁 Files Cần Tạo

#### 3.1. `utils/importValidation.ts` (NEW FILE)
**Vị trí**: Tạo file mới trong thư mục `utils/`

**Lý do tạo file mới**:
- Tách validation logic ra khỏi component
- Dễ test và maintain
- Có thể reuse ở nhiều nơi

**Nội dung file**:
```typescript
import { Prompt, Category } from '../types';

/**
 * Validate một prompt object
 */
export const isValidPrompt = (p: any): p is Prompt => {
  // Required fields
  if (!p.id || typeof p.id !== 'string') return false;
  if (!p.title || typeof p.title !== 'string') return false;
  if (!p.content || typeof p.content !== 'string') return false;
  if (!p.categoryId || typeof p.categoryId !== 'string') return false;
  
  // Optional but must be correct type if present
  if (p.description !== undefined && typeof p.description !== 'string') return false;
  
  // Arrays
  if (!Array.isArray(p.tags)) return false;
  if (!p.tags.every((tag: any) => typeof tag === 'string')) return false;
  
  // Numbers
  if (typeof p.viewCount !== 'number' || p.viewCount < 0) return false;
  if (typeof p.createdAt !== 'number') return false;
  
  // Boolean
  if (typeof p.isFavorite !== 'boolean') return false;
  
  // String fields
  if (typeof p.author !== 'string') return false;
  
  return true;
};

/**
 * Validate toàn bộ import data
 */
export interface ValidationResult {
  isValid: boolean;
  validPrompts: Prompt[];
  invalidPrompts: Array<{ prompt: any; errors: string[] }>;
  errors: string[];
  warnings: string[];
}

export const validateImportData = (
  json: any,
  existingPrompts: Prompt[],
  existingCategories: Category[]
): ValidationResult => {
  const result: ValidationResult = {
    isValid: false,
    validPrompts: [],
    invalidPrompts: [],
    errors: [],
    warnings: [],
  };
  
  // Validate top-level structure
  if (!json || typeof json !== 'object') {
    result.errors.push('Invalid JSON structure');
    return result;
  }
  
  if (json.app !== 'PromptVault') {
    result.errors.push('Invalid app identifier. Expected "PromptVault"');
  }
  
  if (!Array.isArray(json.prompts)) {
    result.errors.push('Prompts must be an array');
    return result;
  }
  
  // Validate each prompt
  const existingIds = new Set(existingPrompts.map(p => p.id));
  const existingCategoryIds = new Set(existingCategories.map(c => c.id));
  
  json.prompts.forEach((prompt: any, index: number) => {
    const errors: string[] = [];
    
    // Structure validation
    if (!isValidPrompt(prompt)) {
      errors.push('Invalid prompt structure');
      result.invalidPrompts.push({ prompt, errors });
      return;
    }
    
    // Business logic validation
    if (existingIds.has(prompt.id)) {
      result.warnings.push(`Prompt "${prompt.title}" (ID: ${prompt.id}) already exists - will be skipped`);
    }
    
    if (!existingCategoryIds.has(prompt.categoryId)) {
      result.warnings.push(`Prompt "${prompt.title}" references unknown category: ${prompt.categoryId}`);
    }
    
    // Add to valid prompts
    result.validPrompts.push(prompt);
  });
  
  result.isValid = result.errors.length === 0 && result.validPrompts.length > 0;
  
  return result;
};
```

**Lý do từng phần**:
- `isValidPrompt`: Type guard để check structure và types
- `validateImportData`: Validate toàn bộ import với context (existing data)
- Return detailed result để UI hiển thị

### 📁 Files Cần Thay Đổi

#### 3.2. `pages/Settings.tsx`
**Vị trí**: Function `handleImport` (lines 32-54)

**Thay đổi**:
- Import validation functions
- Validate trước khi import
- Show errors/warnings

**Nội dung cụ thể**:
```typescript
// Top of file - Add import
import { validateImportData } from '../utils/importValidation';

// In handleImport function
const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const json = JSON.parse(event.target?.result as string);
      
      // Validate data
      const validation = validateImportData(json, prompts, categories);
      
      if (!validation.isValid) {
        // Show errors
        const errorMsg = validation.errors.join(', ');
        showToast(`Import failed: ${errorMsg}`);
        return;
      }
      
      if (validation.validPrompts.length === 0) {
        showToast('No valid prompts to import.');
        return;
      }
      
      // Show warnings if any
      if (validation.warnings.length > 0) {
        console.warn('Import warnings:', validation.warnings);
        // Could show in toast or modal
      }
      
      // Import categories first (if present)
      if (json.categories && Array.isArray(json.categories)) {
        importCategories(json.categories);
      }
      
      // Import valid prompts only
      importPrompts(validation.validPrompts);
      
      // Calculate stats
      const existingIds = new Set(prompts.map(p => p.id));
      const imported = validation.validPrompts.filter(p => !existingIds.has(p.id));
      const skipped = validation.validPrompts.length - imported.length;
      
      // Show message
      let message = `Imported ${imported.length} prompts`;
      if (skipped > 0) {
        message += `, skipped ${skipped} duplicates`;
      }
      if (validation.invalidPrompts.length > 0) {
        message += `, ${validation.invalidPrompts.length} invalid prompts ignored`;
      }
      showToast(message);
      
    } catch (err) {
      showToast(`Error parsing JSON file: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };
  reader.readAsText(file);
  if (fileInputRef.current) fileInputRef.current.value = '';
};
```

**Tác động**:
- ✅ Validation đầy đủ trước khi import
- ✅ Chỉ import valid prompts
- ✅ User được thông báo về invalid data
- ✅ Tránh import data corrupt

**Thời gian ước tính**: 1-1.5 giờ

---

## BƯỚC 4: IMPORT PREVIEW MODAL

### 🎯 Mục Tiêu
Tạo modal preview trước khi import, cho phép user xem và confirm trước khi commit.

### 📁 Files Cần Tạo

#### 4.1. `components/ImportModal.tsx` (NEW FILE)
**Vị trí**: Tạo file mới trong thư mục `components/`

**Lý do tạo component mới**:
- Tách logic preview ra khỏi Settings page
- Reusable component
- Cleaner code structure

**Nội dung file**:
```typescript
import React from 'react';
import { X, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { ValidationResult } from '../utils/importValidation';
import { Prompt, Category } from '../types';

interface ImportModalProps {
  validationResult: ValidationResult;
  importedCategories?: Category[];
  onConfirm: () => void;
  onCancel: () => void;
}

const ImportModal: React.FC<ImportModalProps> = ({
  validationResult,
  importedCategories = [],
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" 
        onClick={onCancel}
      />
      
      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Import Preview
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {validationResult.validPrompts.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Valid Prompts
              </div>
            </div>
            
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {validationResult.warnings.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Warnings
              </div>
            </div>
            
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {validationResult.invalidPrompts.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Invalid
              </div>
            </div>
            
            {importedCategories.length > 0 && (
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {importedCategories.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Categories
                </div>
              </div>
            )}
          </div>
          
          {/* Warnings */}
          {validationResult.warnings.length > 0 && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                    Warnings
                  </h3>
                  <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                    {validationResult.warnings.slice(0, 5).map((warning, i) => (
                      <li key={i}>• {warning}</li>
                    ))}
                    {validationResult.warnings.length > 5 && (
                      <li className="text-yellow-600 dark:text-yellow-400">
                        ... and {validationResult.warnings.length - 5} more
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}
          
          {/* Errors */}
          {validationResult.errors.length > 0 && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-medium text-red-800 dark:text-red-200 mb-2">
                    Errors
                  </h3>
                  <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                    {validationResult.errors.map((error, i) => (
                      <li key={i}>• {error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
          
          {/* Preview List */}
          {validationResult.validPrompts.length > 0 && (
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                Prompts to Import ({validationResult.validPrompts.length})
              </h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {validationResult.validPrompts.slice(0, 10).map((prompt) => (
                  <div 
                    key={prompt.id}
                    className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 flex items-center gap-3"
                  >
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 dark:text-white truncate">
                        {prompt.title}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {prompt.tags.join(', ')}
                      </div>
                    </div>
                  </div>
                ))}
                {validationResult.validPrompts.length > 10 && (
                  <div className="text-center text-sm text-gray-500 dark:text-gray-400 py-2">
                    ... and {validationResult.validPrompts.length - 10} more prompts
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="p-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={validationResult.validPrompts.length === 0}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Import {validationResult.validPrompts.length} Prompts
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportModal;
```

**Lý do thiết kế**:
- Stats cards: Visual overview nhanh
- Warnings/Errors: Hiển thị issues
- Preview list: User thấy prompts sẽ import
- Confirm button: User có control

### 📁 Files Cần Thay Đổi

#### 4.2. `pages/Settings.tsx`
**Vị trí**: Component Settings

**Thay đổi**:
- Import ImportModal
- Add state để control modal
- Show modal sau khi validate
- Import sau khi user confirm

**Nội dung cụ thể**:
```typescript
// Top of file - Add imports
import ImportModal from '../components/ImportModal';
import { validateImportData, ValidationResult } from '../utils/importValidation';

// In component - Add state
const [importPreview, setImportPreview] = useState<{
  validation: ValidationResult;
  categories: Category[];
} | null>(null);

// Update handleImport
const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const json = JSON.parse(event.target?.result as string);
      
      // Validate
      const validation = validateImportData(json, prompts, categories);
      
      // Check for categories to import
      const categoriesToImport = json.categories && Array.isArray(json.categories)
        ? json.categories.filter((c: Category) => 
            !categories.find(existing => existing.id === c.id)
          )
        : [];
      
      // Show preview modal
      setImportPreview({
        validation,
        categories: categoriesToImport,
      });
      
    } catch (err) {
      showToast(`Error parsing JSON file: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };
  reader.readAsText(file);
  if (fileInputRef.current) fileInputRef.current.value = '';
};

// Add confirm handler
const handleConfirmImport = () => {
  if (!importPreview) return;
  
  const { validation, categories: categoriesToImport } = importPreview;
  
  // Import categories first
  if (categoriesToImport.length > 0) {
    importCategories(categoriesToImport);
  }
  
  // Import prompts
  if (validation.validPrompts.length > 0) {
    importPrompts(validation.validPrompts);
    
    // Calculate stats
    const existingIds = new Set(prompts.map(p => p.id));
    const imported = validation.validPrompts.filter(p => !existingIds.has(p.id));
    const skipped = validation.validPrompts.length - imported.length;
    
    let message = `Imported ${imported.length} prompts`;
    if (skipped > 0) message += `, skipped ${skipped} duplicates`;
    if (categoriesToImport.length > 0) {
      message += `, ${categoriesToImport.length} categories`;
    }
    showToast(message);
  }
  
  // Close modal
  setImportPreview(null);
};

// In JSX - Add modal
{importPreview && (
  <ImportModal
    validationResult={importPreview.validation}
    importedCategories={importPreview.categories}
    onConfirm={handleConfirmImport}
    onCancel={() => setImportPreview(null)}
  />
)}
```

**Tác động**:
- ✅ User preview trước khi import
- ✅ User có thể cancel
- ✅ Better UX với visual feedback
- ✅ User hiểu rõ sẽ import gì

**Thời gian ước tính**: 4-5 giờ

---

## BƯỚC 5: ENHANCED VALIDATION

### 🎯 Mục Tiêu
Mở rộng validation với category reference checking, data integrity checks, và detailed error messages.

### 📁 Files Cần Thay Đổi

#### 5.1. `utils/importValidation.ts`
**Vị trí**: Function `validateImportData`

**Thay đổi**:
- Thêm category reference validation
- Thêm data integrity checks
- Improve error messages với context

**Nội dung cụ thể**:
```typescript
// Enhance validateImportData function

export const validateImportData = (
  json: any,
  existingPrompts: Prompt[],
  existingCategories: Category[],
  importedCategories: Category[] = []  // NEW: Categories sẽ được import
): ValidationResult => {
  // ... existing code ...
  
  // Combine existing and imported categories
  const allCategories = [...existingCategories, ...importedCategories];
  const allCategoryIds = new Set(allCategories.map(c => c.id));
  
  // Enhanced validation for each prompt
  json.prompts.forEach((prompt: any, index: number) => {
    const errors: string[] = [];
    
    // ... existing structure validation ...
    
    // Enhanced category reference check
    if (!allCategoryIds.has(prompt.categoryId)) {
      // Check if category exists in import data
      const categoryInImport = importedCategories.find(c => c.id === prompt.categoryId);
      if (!categoryInImport) {
        errors.push(`Category "${prompt.categoryId}" does not exist`);
        result.warnings.push(
          `Prompt "${prompt.title}" references unknown category. Will be assigned to default category.`
        );
      }
    }
    
    // Data integrity checks
    if (prompt.title.trim().length === 0) {
      errors.push('Title cannot be empty');
    }
    
    if (prompt.content.trim().length === 0) {
      errors.push('Content cannot be empty');
    }
    
    if (prompt.title.length > 200) {
      errors.push('Title too long (max 200 characters)');
    }
    
    // ... rest of validation ...
  });
  
  return result;
};
```

**Lý do**:
- Category reference check: Đảm bảo prompts có valid category
- Data integrity: Validate business rules
- Better error messages: User hiểu vấn đề

**Thời gian ước tính**: 1-2 giờ

---

## BƯỚC 6: LOADING STATES

### 🎯 Mục Tiêu
Thêm loading indicators khi import để user biết process đang chạy.

### 📁 Files Cần Thay Đổi

#### 6.1. `pages/Settings.tsx`
**Vị trí**: Component Settings

**Thay đổi**:
- Add loading state
- Show loading indicator
- Disable buttons khi loading

**Nội dung cụ thể**:
```typescript
// Add state
const [isImporting, setIsImporting] = useState(false);

// Update handleConfirmImport
const handleConfirmImport = async () => {
  if (!importPreview) return;
  
  setIsImporting(true);
  
  try {
    // Simulate async (nếu cần)
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const { validation, categories: categoriesToImport } = importPreview;
    
    // Import categories
    if (categoriesToImport.length > 0) {
      importCategories(categoriesToImport);
    }
    
    // Import prompts
    if (validation.validPrompts.length > 0) {
      importPrompts(validation.validPrompts);
      // ... show toast ...
    }
    
    setImportPreview(null);
  } finally {
    setIsImporting(false);
  }
};

// In ImportModal - Add loading prop
<ImportModal
  isLoading={isImporting}
  // ... other props
/>

// In ImportModal component - Show loading state
{isLoading && (
  <div className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 flex items-center justify-center rounded-2xl">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4" />
      <p className="text-gray-600 dark:text-gray-400">Importing...</p>
    </div>
  </div>
)}
```

**Tác động**:
- ✅ User biết process đang chạy
- ✅ Prevent double-click
- ✅ Better UX

**Thời gian ước tính**: 30-45 phút

---

## BƯỚC 7: CONFLICT RESOLUTION (Optional)

### 🎯 Mục Tiêu
Cho phép user chọn cách xử lý duplicates: skip, overwrite, hoặc rename.

### 📁 Files Cần Thay Đổi

#### 7.1. `store.ts` (PromptStore)
**Vị trí**: Function `importPrompts`

**Thay đổi**:
- Thêm options parameter
- Implement different strategies

**Nội dung**:
```typescript
interface ImportOptions {
  strategy?: 'skip' | 'overwrite' | 'rename';
}

importPrompts: (data: Prompt[], options?: ImportOptions) => {
  const strategy = options?.strategy || 'skip';
  
  return set((state) => {
    const existingIds = new Set(state.prompts.map(p => p.id));
    
    if (strategy === 'skip') {
      // Current logic
      const newPrompts = data.filter(p => !existingIds.has(p.id));
      return { prompts: [...state.prompts, ...newPrompts] };
    }
    
    if (strategy === 'overwrite') {
      // Remove old, add new
      const filtered = state.prompts.filter(p => !existingIds.has(p.id));
      return { prompts: [...filtered, ...data] };
    }
    
    if (strategy === 'rename') {
      // Generate new IDs for duplicates
      const processed = data.map(p => {
        if (existingIds.has(p.id)) {
          return { ...p, id: generateId() };
        }
        return p;
      });
      return { prompts: [...state.prompts, ...processed] };
    }
    
    return state;
  });
}
```

#### 7.2. `components/ImportModal.tsx`
**Thay đổi**:
- Add strategy selector
- Pass strategy to onConfirm

**Thời gian ước tính**: 2-3 giờ

---

## BƯỚC 8: EXPORT OPTIONS (Optional)

### 🎯 Mục Tiêu
Cho phép user chọn fields để export.

### 📁 Files Cần Tạo

#### 8.1. `components/ExportModal.tsx` (NEW FILE)
**Tương tự ImportModal nhưng cho export options**

**Thời gian ước tính**: 2-3 giờ

---

## BƯỚC 9: PROGRESS INDICATOR (Optional)

### 🎯 Mục Tiêu
Hiển thị progress khi import large files.

### 📁 Files Cần Thay Đổi

#### 9.1. `pages/Settings.tsx`
**Thay đổi**:
- Add progress state
- Update progress during import

**Thời gian ước tính**: 1-2 giờ

---

## 📋 TỔNG KẾT IMPLEMENTATION PLAN

### Thứ Tự Thực Hiện Đề Xuất

#### Phase 1: Critical Fixes (Ưu tiên cao)
1. **Bước 1**: Fix toast message (15-20 phút)
2. **Bước 2**: Import categories (30-45 phút)
3. **Bước 3**: Basic validation (1-1.5 giờ)

**Tổng thời gian Phase 1**: ~2.5-3 giờ

#### Phase 2: UX Improvements (Ưu tiên trung bình)
4. **Bước 4**: Import preview modal (4-5 giờ)
5. **Bước 5**: Enhanced validation (1-2 giờ)
6. **Bước 6**: Loading states (30-45 phút)

**Tổng thời gian Phase 2**: ~6-8 giờ

#### Phase 3: Advanced Features (Ưu tiên thấp)
7. **Bước 7**: Conflict resolution (2-3 giờ)
8. **Bước 8**: Export options (2-3 giờ)
9. **Bước 9**: Progress indicator (1-2 giờ)

**Tổng thời gian Phase 3**: ~5-8 giờ

### Tổng Thời Gian Ước Tính

- **Phase 1 (Must Have)**: 2.5-3 giờ
- **Phase 2 (Should Have)**: 6-8 giờ
- **Phase 3 (Nice to Have)**: 5-8 giờ
- **Tổng cộng**: 13.5-19 giờ

### Files Sẽ Được Tạo Mới

1. `utils/importValidation.ts` - Validation logic
2. `components/ImportModal.tsx` - Import preview modal
3. `components/ExportModal.tsx` - Export options (optional)

### Files Sẽ Được Cập Nhật

1. `store.ts` - PromptStore và CategoryStore
2. `pages/Settings.tsx` - Import/Export logic
3. `types.ts` - Có thể thêm types mới (optional)

---

## 🎯 KHUYẾN NGHỊ

### Bắt Đầu Với Phase 1

**Lý do**:
- ✅ Fix các vấn đề critical ngay
- ✅ Thời gian ngắn, impact lớn
- ✅ Tạo foundation cho các bước sau

### Sau Khi Hoàn Thành Phase 1

**Đánh giá lại**:
- Test kỹ các thay đổi
- Gather feedback
- Quyết định có tiếp tục Phase 2 không

### Best Practices

1. **Test sau mỗi bước**: Đảm bảo không break existing features
2. **Commit thường xuyên**: Mỗi bước một commit
3. **Review code**: Check logic và edge cases
4. **Update docs**: Cập nhật tài liệu khi có thay đổi

---

**Tài liệu này cung cấp roadmap chi tiết để cải tiến tính năng Import/Export JSON.**

**Ngày tạo**: 2024  
**Phiên bản**: 1.0
