# 🧪 HƯỚNG DẪN TEST TÍNH NĂNG IMPORT/EXPORT JSON

## TỔNG QUAN

Tài liệu này hướng dẫn cách test các tính năng Import/Export JSON đã được cải tiến.

---

## 📋 TEST CHECKLIST

### Phase 1: Foundation Tests

#### ✅ Test 1.1: Fix Toast Message Accuracy

**Mục đích**: Verify toast message hiển thị số prompts thực sự được import

**Các bước**:
1. Export data hiện tại (nếu có)
2. Import lại file vừa export (có duplicates)
3. **Expected**: Toast hiển thị "Imported X prompts, skipped Y duplicates"
4. Tạo file mới với prompts mới (không có trong app)
5. Import file mới
6. **Expected**: Toast hiển thị "Imported X prompts" (không có "skipped")

**Test Cases**:
- [ ] Import file với 5 prompts, 3 đã tồn tại → Toast: "Imported 2 prompts, skipped 3 duplicates"
- [ ] Import file với 5 prompts mới → Toast: "Imported 5 prompts"
- [ ] Import file rỗng → Toast: "No valid prompts to import"

---

#### ✅ Test 1.2: Import Categories

**Mục đích**: Verify categories được import đúng cách

**Các bước**:
1. Export file với custom categories
2. Clear localStorage hoặc dùng app mới
3. Import file đó
4. **Expected**: Categories được import và hiển thị trong UI

**Test Cases**:
- [ ] Import file với 2 categories mới → Categories xuất hiện trong Categories page
- [ ] Import file với category đã tồn tại (cùng ID) → Category không duplicate
- [ ] Import file với category đã tồn tại (khác ID, cùng name) → Category được import (merge by ID)
- [ ] Verify categories được lưu vào localStorage

---

#### ✅ Test 1.3: Category References Validation

**Mục đích**: Verify prompts với invalid categoryId được xử lý đúng

**Các bước**:
1. Tạo file JSON với prompts có categoryId không tồn tại
2. Import file đó
3. **Expected**: Prompts với invalid categoryId bị skip, có warning

**Test Cases**:
- [ ] Import prompts với categoryId không có trong file và không có trong app → Prompts bị skip
- [ ] Import file có categories và prompts → Categories import trước, prompts có valid references
- [ ] Import prompts với categoryId có trong file nhưng chưa import → Prompts được import sau khi categories import

---

### Phase 2: Validation Tests

#### ✅ Test 2.1: Structure Validation

**Mục đích**: Verify validation reject invalid prompt structures

**Test Cases**:
- [ ] Import prompt thiếu `id` → Bị skip, có error
- [ ] Import prompt thiếu `title` → Bị skip, có error
- [ ] Import prompt thiếu `content` → Bị skip, có error
- [ ] Import prompt thiếu `categoryId` → Bị skip, có error
- [ ] Import prompt với `tags` không phải array → Bị skip, có error
- [ ] Import prompt với `viewCount` không phải number → Bị skip, có error

---

#### ✅ Test 2.2: Data Integrity Validation

**Mục đích**: Verify validation check data integrity rules

**Test Cases**:
- [ ] Import prompt với `title` rỗng (empty string) → Bị skip
- [ ] Import prompt với `content` rỗng → Bị skip
- [ ] Import prompt với `title` quá dài (>200 chars) → Bị skip
- [ ] Import prompt với `viewCount` < 0 → Bị skip

---

#### ✅ Test 2.3: Mixed Valid/Invalid Prompts

**Mục đích**: Verify system chỉ import valid prompts

**Các bước**:
1. Tạo file với 10 prompts: 5 valid, 5 invalid
2. Import file đó
3. **Expected**: Chỉ 5 valid prompts được import, 5 invalid bị skip

**Test Cases**:
- [ ] File có 10 prompts: 5 valid, 5 invalid → Import 5, skip 5
- [ ] Toast message hiển thị: "Imported 5 prompts. 5 invalid prompts ignored"

---

#### ✅ Test 2.4: Error Messages

**Mục đích**: Verify error messages rõ ràng và helpful

**Test Cases**:
- [ ] Import file không phải JSON → "Error parsing JSON file: [error details]"
- [ ] Import file thiếu `app` field → "Import failed: Invalid app identifier..."
- [ ] Import file không có `prompts` array → "Import failed: Prompts must be an array"
- [ ] Import file với invalid structure → Error message chi tiết

---

## 📁 TEST FILES

Tạo các test files để test dễ dàng:

### test-valid.json
File với data hoàn toàn valid

### test-duplicates.json
File với prompts có IDs đã tồn tại

### test-invalid-structure.json
File với prompts có invalid structure

### test-missing-categories.json
File với prompts có categoryId không tồn tại

### test-mixed.json
File với mix valid và invalid prompts

### test-empty.json
File rỗng hoặc không có prompts

---

## 🔍 TESTING WORKFLOW

### 1. Preparation
- Backup data hiện tại
- Clear localStorage (nếu cần test từ đầu)
- Hoặc dùng browser incognito mode

### 2. Test Each Feature
- Test từng feature một
- Document kết quả
- Take screenshots nếu cần

### 3. Regression Testing
- Test existing features vẫn hoạt động
- Test không có breaking changes

### 4. Edge Cases
- Test với large files
- Test với special characters
- Test với unicode

---

## 📊 EXPECTED RESULTS SUMMARY

| Test Case | Expected Result |
|-----------|----------------|
| Import new prompts | Toast: "Imported X prompts" |
| Import with duplicates | Toast: "Imported X prompts, skipped Y duplicates" |
| Import with categories | Categories imported, toast shows count |
| Import invalid prompts | Prompts skipped, toast shows count |
| Import with invalid categoryId | Prompts skipped, warning in console |
| Import invalid JSON | Error toast with details |
| Import empty file | Toast: "No valid prompts to import" |

---

## 🐛 KNOWN ISSUES / LIMITATIONS

- [ ] List any known issues here
- [ ] Document limitations
- [ ] Note workarounds if any

---

**Ngày tạo**: 2024  
**Phiên bản**: 1.0
