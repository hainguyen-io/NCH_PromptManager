# 🔄 TRÌNH TỰ THỰC HIỆN CẢI TIẾN IMPORT/EXPORT JSON

## TỔNG QUAN

Tài liệu này mô tả trình tự thực hiện an toàn để cải tiến tính năng Import/Export JSON, đảm bảo ứng dụng hoạt động mượt mà và đồng bộ trong suốt quá trình phát triển.

---

## 🎯 NGUYÊN TẮC THỰC HIỆN

### 1. Incremental Development
- ✅ Mỗi bước là một feature hoàn chỉnh, có thể test độc lập
- ✅ Không break existing features
- ✅ Có thể rollback dễ dàng nếu cần

### 2. Testing After Each Step
- ✅ Test manual sau mỗi bước
- ✅ Verify không có regression
- ✅ Check UI/UX vẫn hoạt động bình thường

### 3. Safe Dependencies
- ✅ Thực hiện theo thứ tự dependencies
- ✅ Đảm bảo data integrity
- ✅ Maintain backward compatibility

---

## 📋 PHÂN TÍCH DEPENDENCIES

### Dependencies Giữa Các Bước

```
Bước 1 (Fix Toast)
    │
    └─> Independent (chỉ sửa UI message)

Bước 2 (Import Categories)
    │
    ├─> Depends on: Bước 1 (optional, nhưng nên có)
    └─> Independent với Bước 3

Bước 3 (Basic Validation)
    │
    ├─> Depends on: Bước 2 (cần validate category references)
    └─> Foundation cho Bước 4

Bước 4 (Import Preview Modal)
    │
    ├─> Depends on: Bước 3 (cần validation results)
    └─> Depends on: Bước 2 (cần category info)

Bước 5 (Enhanced Validation)
    │
    └─> Depends on: Bước 3 (extend existing validation)

Bước 6 (Loading States)
    │
    └─> Depends on: Bước 4 (cần modal để show loading)
```

### Critical Path

**Path 1 (Must Have)**:
```
Bước 1 → Bước 2 → Bước 3
```

**Path 2 (Should Have)**:
```
Bước 3 → Bước 4 → Bước 6
Bước 3 → Bước 5
```

---

## 🔄 TRÌNH TỰ THỰC HIỆN ĐỀ XUẤT

### PHASE 1: FOUNDATION (Critical - Phải làm trước)

#### BƯỚC 1.1: Backup & Preparation

**Mục đích**: Chuẩn bị môi trường an toàn

**Thực hiện**:
1. ✅ **Backup code hiện tại**
   - Commit tất cả changes hiện tại
   - Tạo branch mới: `feature/improve-import-export`
   - Hoặc tạo backup branch: `backup/before-import-export-improvements`

2. ✅ **Backup data**
   - Export toàn bộ data hiện tại (dùng Export JSON)
   - Lưu file backup ở nơi an toàn
   - Ghi chú: "Backup trước khi cải tiến Import/Export"

3. ✅ **Verify current state**
   - Test Export JSON: Đảm bảo hoạt động
   - Test Import JSON: Đảm bảo hoạt động (với limitations hiện tại)
   - Document current behavior
   - Take screenshots nếu cần

**Lý do**:
- Có thể rollback nếu có vấn đề
- Có data để test sau khi cải tiến
- Biết rõ behavior hiện tại để so sánh

**Thời gian**: 10-15 phút

---

#### BƯỚC 1.2: Fix Toast Message Accuracy

**Mục đích**: Sửa toast message để chính xác

**Dependencies**: Không có (independent)

**Thực hiện**:

**1. Update `store.ts`**
- **File**: `store.ts`
- **Location**: Function `importPrompts` (lines 168-173)
- **Thay đổi**: 
  - Tính toán stats trước khi update state
  - Return stats qua callback hoặc tính toán trong component

**Approach được đề xuất**:
```typescript
// Option 1: Tính toán trong component (đơn giản hơn)
// Không cần thay đổi store, chỉ tính trong handleImport

// Option 2: Thêm helper function
const getImportStats = (data: Prompt[], existing: Prompt[]) => {
  const existingIds = new Set(existing.map(p => p.id));
  const imported = data.filter(p => !existingIds.has(p.id));
  const skipped = data.filter(p => existingIds.has(p.id));
  return { imported: imported.length, skipped: skipped.length };
};
```

**2. Update `pages/Settings.tsx`**
- **File**: `pages/Settings.tsx`
- **Location**: Function `handleImport` (lines 32-54)
- **Thay đổi**:
  - Tính stats trước khi gọi `importPrompts`
  - Update toast message với stats chính xác

**Testing Checklist**:
- [ ] Export file với prompts
- [ ] Import file đó lại (có duplicates)
- [ ] Verify toast hiển thị: "Imported X prompts, skipped Y duplicates"
- [ ] Import file mới (không có duplicates)
- [ ] Verify toast hiển thị: "Imported X prompts"
- [ ] Test với empty file
- [ ] Test với invalid file

**Rollback Plan**:
- Revert commit nếu có vấn đề
- Hoặc manually revert changes

**Thời gian**: 15-20 phút + 10 phút testing

---

#### BƯỚC 1.3: Add importCategories to CategoryStore

**Mục đích**: Thêm function import categories

**Dependencies**: Bước 1.2 (nên có, nhưng không bắt buộc)

**Thực hiện**:

**1. Update `store.ts` (CategoryStore)**
- **File**: `store.ts`
- **Location**: Sau `resetCategories` (khoảng line 120)
- **Thay đổi**:
  - Thêm `importCategories` vào interface
  - Implement function với merge strategy

**Testing Checklist**:
- [ ] Test import categories với IDs mới
- [ ] Test import categories với IDs đã tồn tại (should skip)
- [ ] Verify categories được lưu vào localStorage
- [ ] Verify UI hiển thị categories mới
- [ ] Test với empty array
- [ ] Test với invalid data

**Rollback Plan**:
- Remove function từ interface và implementation
- Revert commit

**Thời gian**: 20-30 phút + 10 phút testing

---

#### BƯỚC 1.4: Import Categories in Settings

**Mục đích**: Sử dụng `importCategories` trong import flow

**Dependencies**: Bước 1.3 (phải có)

**Thực hiện**:

**1. Update `pages/Settings.tsx`**
- **File**: `pages/Settings.tsx`
- **Location**: Function `handleImport` (lines 32-54)
- **Thay đổi**:
  - Import `useCategoryStore` và `importCategories`
  - Import categories trước prompts
  - Validate category references
  - Update toast message

**Testing Checklist**:
- [ ] Export file với prompts và categories
- [ ] Import file đó vào app mới (không có categories)
- [ ] Verify categories được import
- [ ] Verify prompts có valid category references
- [ ] Test import với categories đã tồn tại
- [ ] Test import prompts với categoryId không tồn tại
- [ ] Verify UI hiển thị đúng categories

**Critical Test Cases**:
1. **Import với missing categories**:
   - Export từ App A (có custom categories)
   - Import vào App B (chỉ có seed categories)
   - Expected: Categories được import, prompts có valid references

2. **Import với duplicate categories**:
   - App có category "Coding" (ID: cat_1)
   - Import file có category "Coding" (ID: cat_1)
   - Expected: Category không duplicate, prompts vẫn reference đúng

3. **Import prompts với invalid categoryId**:
   - Import prompts với categoryId không có trong file và không có trong app
   - Expected: Prompts bị skip hoặc assigned to default category

**Rollback Plan**:
- Revert changes trong `handleImport`
- Keep `importCategories` function (không hại gì)

**Thời gian**: 30-45 phút + 15 phút testing

---

### PHASE 2: VALIDATION (Important - Nên làm sau Phase 1)

#### BƯỚC 2.1: Create Validation Utility

**Mục đích**: Tạo validation logic tách biệt

**Dependencies**: Bước 1.4 (nên có để test với categories)

**Thực hiện**:

**1. Tạo `utils/importValidation.ts`**
- **File**: `utils/importValidation.ts` (NEW)
- **Location**: Tạo thư mục `utils/` nếu chưa có
- **Nội dung**: 
  - `isValidPrompt()` function
  - `validateImportData()` function
  - `ValidationResult` interface

**Testing Checklist**:
- [ ] Test `isValidPrompt` với valid prompt
- [ ] Test `isValidPrompt` với missing fields
- [ ] Test `isValidPrompt` với wrong types
- [ ] Test `validateImportData` với valid data
- [ ] Test `validateImportData` với invalid data
- [ ] Test `validateImportData` với duplicates
- [ ] Test `validateImportData` với missing categories

**Unit Test Cases** (nếu có test framework):
```typescript
// Example test cases
describe('isValidPrompt', () => {
  it('should return true for valid prompt', () => {
    const prompt = { id: '1', title: 'Test', content: 'Content', ... };
    expect(isValidPrompt(prompt)).toBe(true);
  });
  
  it('should return false for missing id', () => {
    const prompt = { title: 'Test', content: 'Content', ... };
    expect(isValidPrompt(prompt)).toBe(false);
  });
});
```

**Rollback Plan**:
- Delete file `utils/importValidation.ts`
- Revert commit

**Thời gian**: 1-1.5 giờ + 20 phút testing

---

#### BƯỚC 2.2: Integrate Validation in Settings

**Mục đích**: Sử dụng validation trong import flow

**Dependencies**: Bước 2.1 (phải có)

**Thực hiện**:

**1. Update `pages/Settings.tsx`**
- **File**: `pages/Settings.tsx`
- **Location**: Function `handleImport`
- **Thay đổi**:
  - Import validation functions
  - Validate trước khi import
  - Show errors/warnings
  - Chỉ import valid prompts

**Testing Checklist**:
- [ ] Test import với valid file → Should import
- [ ] Test import với invalid JSON → Should show error
- [ ] Test import với missing app field → Should show error
- [ ] Test import với invalid prompt structure → Should skip invalid, import valid
- [ ] Test import với prompts có missing categoryId → Should show warning
- [ ] Verify toast messages chính xác

**Critical Test Cases**:
1. **Mixed valid/invalid prompts**:
   - File có 10 prompts: 5 valid, 5 invalid
   - Expected: Import 5 valid, skip 5 invalid, show message

2. **All invalid prompts**:
   - File có prompts nhưng tất cả invalid
   - Expected: Show error, không import gì

3. **Valid prompts với invalid categories**:
   - Prompts valid nhưng categoryId không tồn tại
   - Expected: Show warning, có thể skip hoặc assign default

**Rollback Plan**:
- Revert changes trong `handleImport`
- Keep validation file (có thể dùng sau)

**Thời gian**: 30-45 phút + 15 phút testing

---

### PHASE 3: UX IMPROVEMENTS (Nice to have - Có thể làm sau)

#### BƯỚC 3.1: Create Import Modal Component

**Mục đích**: Tạo modal preview trước khi import

**Dependencies**: Bước 2.2 (cần validation results)

**Thực hiện**:

**1. Tạo `components/ImportModal.tsx`**
- **File**: `components/ImportModal.tsx` (NEW)
- **Nội dung**: 
  - Modal UI với stats
  - Preview list
  - Warnings/Errors display
  - Confirm/Cancel buttons

**Testing Checklist**:
- [ ] Modal hiển thị đúng stats
- [ ] Preview list hiển thị prompts
- [ ] Warnings/Errors hiển thị đúng
- [ ] Confirm button import data
- [ ] Cancel button đóng modal
- [ ] Modal responsive trên mobile
- [ ] Dark mode hoạt động

**Rollback Plan**:
- Delete file `components/ImportModal.tsx`
- Revert changes trong Settings

**Thời gian**: 4-5 giờ + 30 phút testing

---

#### BƯỚC 3.2: Integrate Import Modal

**Mục đích**: Sử dụng modal trong import flow

**Dependencies**: Bước 3.1 (phải có)

**Thực hiện**:

**1. Update `pages/Settings.tsx`**
- **File**: `pages/Settings.tsx`
- **Thay đổi**:
  - Import ImportModal
  - Add state để control modal
  - Show modal sau khi validate
  - Import sau khi user confirm

**Testing Checklist**:
- [ ] Modal mở sau khi chọn file
- [ ] Modal hiển thị đúng data
- [ ] Confirm import data
- [ ] Cancel đóng modal, không import
- [ ] Toast message sau khi import

**Rollback Plan**:
- Revert changes trong Settings
- Keep modal component (có thể dùng sau)

**Thời gian**: 30-45 phút + 15 phút testing

---

#### BƯỚC 3.3: Add Loading States

**Mục đích**: Hiển thị loading khi import

**Dependencies**: Bước 3.2 (cần modal)

**Thực hiện**:

**1. Update `pages/Settings.tsx`**
- Add loading state
- Set loading khi import

**2. Update `components/ImportModal.tsx`**
- Add loading prop
- Show loading indicator

**Testing Checklist**:
- [ ] Loading hiển thị khi import
- [ ] Buttons disabled khi loading
- [ ] Loading ẩn sau khi import xong
- [ ] UX mượt mà

**Thời gian**: 30-45 phút + 10 phút testing

---

## 📊 TỔNG KẾT TRÌNH TỰ

### Recommended Sequence

```
Phase 1: Foundation
├── Bước 1.1: Backup & Preparation (10-15 phút)
├── Bước 1.2: Fix Toast Message (15-20 phút + test)
├── Bước 1.3: Add importCategories (20-30 phút + test)
└── Bước 1.4: Import Categories in Settings (30-45 phút + test)

Phase 2: Validation
├── Bước 2.1: Create Validation Utility (1-1.5 giờ + test)
└── Bước 2.2: Integrate Validation (30-45 phút + test)

Phase 3: UX Improvements
├── Bước 3.1: Create Import Modal (4-5 giờ + test)
├── Bước 3.2: Integrate Modal (30-45 phút + test)
└── Bước 3.3: Add Loading States (30-45 phút + test)
```

### Total Time Estimate

- **Phase 1**: ~2.5-3 giờ
- **Phase 2**: ~2-2.5 giờ
- **Phase 3**: ~6-7 giờ
- **Tổng cộng**: ~10.5-12.5 giờ

---

## ✅ CHECKLIST SAU MỖI BƯỚC

### Functional Testing
- [ ] Feature mới hoạt động đúng
- [ ] Existing features vẫn hoạt động
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] UI responsive

### Data Integrity
- [ ] Data được lưu đúng
- [ ] localStorage hoạt động
- [ ] No data corruption
- [ ] Categories và prompts sync

### User Experience
- [ ] Toast messages chính xác
- [ ] Loading states hoạt động
- [ ] Error messages rõ ràng
- [ ] UI mượt mà

### Edge Cases
- [ ] Empty data
- [ ] Invalid data
- [ ] Large files
- [ ] Duplicates
- [ ] Missing references

---

## 🔍 TESTING STRATEGY

### After Each Step

**1. Manual Testing**:
- Test happy path
- Test error cases
- Test edge cases
- Verify UI/UX

**2. Regression Testing**:
- Test existing features
- Verify không break gì
- Check performance

**3. Data Testing**:
- Export/Import cycle
- Verify data integrity
- Check localStorage

### Test Data Preparation

**Tạo test files**:
1. `test-valid.json`: Valid file với prompts và categories
2. `test-invalid.json`: Invalid JSON
3. `test-missing-categories.json`: Prompts với categoryId không tồn tại
4. `test-duplicates.json`: File có prompts với IDs đã tồn tại
5. `test-empty.json`: Empty file
6. `test-large.json`: File với nhiều prompts (100+)

---

## ⚠️ RISK MITIGATION

### Risks và Mitigation

**1. Break Existing Features**
- **Risk**: Changes có thể break existing code
- **Mitigation**: 
  - Test kỹ sau mỗi bước
  - Incremental changes
  - Rollback plan

**2. Data Loss**
- **Risk**: Import có thể mất data
- **Mitigation**:
  - Backup trước khi bắt đầu
  - Test với test data trước
  - Validate trước khi import

**3. Performance Issues**
- **Risk**: Large imports có thể chậm
- **Mitigation**:
  - Test với large files
  - Add loading states
  - Optimize nếu cần

**4. UI/UX Regression**
- **Risk**: Changes có thể làm UI xấu
- **Mitigation**:
  - Test trên nhiều screen sizes
  - Test dark mode
  - Verify responsive

---

## 📝 COMMIT STRATEGY

### Commit After Each Step

**Format**:
```
feat(import-export): [Step name] - [Brief description]

- [Change 1]
- [Change 2]
- [Testing notes]
```

**Examples**:
```
feat(import-export): Fix toast message accuracy

- Calculate import stats before importing
- Update toast to show actual imported count
- Tested with duplicates and new prompts
```

```
feat(import-export): Add importCategories to CategoryStore

- Add importCategories function with merge strategy
- Tested with new and existing categories
```

### Branch Strategy

**Option 1: Single Feature Branch**
```
main
  └── feature/improve-import-export
      ├── step-1-fix-toast
      ├── step-2-import-categories
      └── ...
```

**Option 2: Multiple Small Branches**
```
main
  ├── feature/fix-toast-message
  ├── feature/import-categories
  └── feature/validation
```

**Recommended**: Option 1 (single branch) - dễ quản lý

---

## 🚨 ROLLBACK PLAN

### Nếu Có Vấn Đề

**1. Immediate Rollback**:
- Revert commit cuối cùng
- Hoặc checkout previous commit
- Verify app hoạt động lại

**2. Partial Rollback**:
- Revert specific changes
- Keep working features
- Fix issues

**3. Data Recovery**:
- Restore từ backup
- Re-import data nếu cần

---

## 📋 THÔNG TIN CẦN THIẾT TRƯỚC KHI BẮT ĐẦU

### Questions để Clarify

**1. Testing Environment**:
- ✅ Bạn có test data sẵn không?
- ✅ Bạn muốn test trên browser nào? (Chrome, Firefox, Safari)
- ✅ Bạn có cần test trên mobile không?

**2. Data Migration**:
- ✅ Bạn có data production cần migrate không?
- ✅ Bạn có cần backward compatibility với old export format không?

**3. UI/UX Preferences**:
- ✅ Bạn muốn modal design như thế nào? (Simple hay detailed)
- ✅ Bạn có preference về loading indicator style không?

**4. Error Handling**:
- ✅ Bạn muốn error messages chi tiết đến mức nào?
- ✅ Bạn có muốn log errors để debug không?

**5. Performance**:
- ✅ Bạn expect import bao nhiêu prompts? (10, 100, 1000+)
- ✅ Bạn có cần optimize cho large files không?

**6. Future Plans**:
- ✅ Bạn có plan thêm features sau này không? (Conflict resolution, etc.)
- ✅ Bạn có muốn prepare cho future features không?

---

## 🎯 NEXT STEPS

### Trước Khi Bắt Đầu

1. **Review kế hoạch này**
2. **Answer questions ở trên** (nếu có)
3. **Prepare test data**
4. **Backup code và data**
5. **Ready to start!**

### Khi Bắt Đầu

1. **Start với Bước 1.1** (Backup)
2. **Test sau mỗi bước**
3. **Commit thường xuyên**
4. **Ask questions nếu cần**

---

**Tài liệu này cung cấp roadmap chi tiết để thực hiện cải tiến Import/Export một cách an toàn và có hệ thống.**

**Ngày tạo**: 2024  
**Phiên bản**: 1.0
