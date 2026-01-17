# ✅ TEST CHECKLIST - IMPORT/EXPORT IMPROVEMENTS

## Hướng Dẫn Sử Dụng

1. Chạy ứng dụng: `npm run dev`
2. Mở browser và vào ứng dụng
3. Vào Settings page
4. Test từng case theo checklist dưới đây
5. Đánh dấu ✅ khi pass, ❌ khi fail, ⚠️ khi có issue nhỏ

---

## 📋 PHASE 1: FOUNDATION TESTS

### Test 1.1: Toast Message Accuracy

#### Test Case 1.1.1: Import với Duplicates
- [ ] Export data hiện tại (nếu có)
- [ ] Import lại file vừa export
- [ ] **Expected**: Toast hiển thị "Imported X prompts, skipped Y duplicates"
- [ ] **Actual**: _______________________
- [ ] **Result**: ✅ / ❌ / ⚠️

#### Test Case 1.1.2: Import Prompts Mới
- [ ] Import file `test-data/test-valid.json`
- [ ] **Expected**: Toast hiển thị "Imported 2 prompts. 2 categories imported."
- [ ] **Actual**: _______________________
- [ ] **Result**: ✅ / ❌ / ⚠️

#### Test Case 1.1.3: Import File Rỗng
- [ ] Import file `test-data/test-empty.json`
- [ ] **Expected**: Toast hiển thị "No valid prompts to import."
- [ ] **Actual**: _______________________
- [ ] **Result**: ✅ / ❌ / ⚠️

---

### Test 1.2: Import Categories

#### Test Case 1.2.1: Import Categories Mới
- [ ] Import file `test-data/test-valid.json`
- [ ] Vào Categories page
- [ ] **Expected**: Thấy 2 categories mới (Test Category 1, Test Category 2)
- [ ] **Actual**: _______________________
- [ ] **Result**: ✅ / ❌ / ⚠️

#### Test Case 1.2.2: Import Categories Duplicate
- [ ] Import file `test-data/test-valid.json` lần 2
- [ ] Vào Categories page
- [ ] **Expected**: Categories không duplicate (vẫn chỉ có 2)
- [ ] **Actual**: _______________________
- [ ] **Result**: ✅ / ❌ / ⚠️

#### Test Case 1.2.3: Verify Categories trong localStorage
- [ ] Mở DevTools → Application → LocalStorage
- [ ] Check key `promptvault-categories`
- [ ] **Expected**: Categories được lưu trong localStorage
- [ ] **Actual**: _______________________
- [ ] **Result**: ✅ / ❌ / ⚠️

---

### Test 1.3: Category References Validation

#### Test Case 1.3.1: Import với Missing Categories
- [ ] Import file `test-data/test-missing-categories.json`
- [ ] **Expected**: 
  - Category "New Category 1" được import
  - 2 prompts được import (valid category references)
  - 1 prompt bị skip (invalid categoryId)
  - Toast hiển thị thông tin chi tiết
- [ ] **Actual**: _______________________
- [ ] **Result**: ✅ / ❌ / ⚠️

#### Test Case 1.3.2: Import Prompts với CategoryId Không Tồn Tại
- [ ] Tạo file với prompt có categoryId = "non_existent"
- [ ] Import file đó
- [ ] **Expected**: Prompt bị skip, có warning trong console
- [ ] **Actual**: _______________________
- [ ] **Result**: ✅ / ❌ / ⚠️

---

## 📋 PHASE 2: VALIDATION TESTS

### Test 2.1: Structure Validation

#### Test Case 2.1.1: Import với Invalid Structure
- [ ] Import file `test-data/test-invalid-structure.json`
- [ ] **Expected**: 
  - 1 prompt được import (valid)
  - 4 prompts bị skip (invalid structure)
  - Toast: "Imported 1 prompts. 4 invalid prompts ignored."
- [ ] **Actual**: _______________________
- [ ] **Result**: ✅ / ❌ / ⚠️

#### Test Case 2.1.2: Missing Required Fields
- [ ] Test prompt thiếu `id` → Bị skip
- [ ] Test prompt thiếu `title` → Bị skip
- [ ] Test prompt thiếu `content` → Bị skip
- [ ] Test prompt thiếu `categoryId` → Bị skip
- [ ] **Result**: ✅ / ❌ / ⚠️

#### Test Case 2.1.3: Wrong Data Types
- [ ] Test prompt với `tags` không phải array → Bị skip
- [ ] Test prompt với `viewCount` không phải number → Bị skip
- [ ] Test prompt với `isFavorite` không phải boolean → Bị skip
- [ ] **Result**: ✅ / ❌ / ⚠️

---

### Test 2.2: Data Integrity Validation

#### Test Case 2.2.1: Empty Fields
- [ ] Test prompt với `title` rỗng → Bị skip
- [ ] Test prompt với `content` rỗng → Bị skip
- [ ] **Result**: ✅ / ❌ / ⚠️

#### Test Case 2.2.2: Length Validation
- [ ] Test prompt với `title` > 200 chars → Bị skip
- [ ] **Result**: ✅ / ❌ / ⚠️

---

### Test 2.3: Mixed Valid/Invalid Prompts

#### Test Case 2.3.1: Import Mixed File
- [ ] Import file `test-data/test-mixed.json`
- [ ] **Expected**: 
  - 2 prompts được import (valid)
  - 3 prompts bị skip (invalid)
  - 1 category được import
  - Toast hiển thị chi tiết
- [ ] **Actual**: _______________________
- [ ] **Result**: ✅ / ❌ / ⚠️

---

### Test 2.4: Error Messages

#### Test Case 2.4.1: Invalid JSON
- [ ] Tạo file JSON không hợp lệ (syntax error)
- [ ] Import file đó
- [ ] **Expected**: Toast "Error parsing JSON file: [error details]"
- [ ] **Actual**: _______________________
- [ ] **Result**: ✅ / ❌ / ⚠️

#### Test Case 2.4.2: Missing App Field
- [ ] Tạo file JSON không có `app` field
- [ ] Import file đó
- [ ] **Expected**: Toast "Import failed: Invalid app identifier..."
- [ ] **Actual**: _______________________
- [ ] **Result**: ✅ / ❌ / ⚠️

#### Test Case 2.4.3: Missing Prompts Array
- [ ] Tạo file JSON không có `prompts` array
- [ ] Import file đó
- [ ] **Expected**: Toast "Import failed: Prompts must be an array"
- [ ] **Actual**: _______________________
- [ ] **Result**: ✅ / ❌ / ⚠️

---

## 📋 REGRESSION TESTS

### Test Existing Features

#### Test Case R.1: Export vẫn hoạt động
- [ ] Click "Export JSON"
- [ ] **Expected**: File được download với format đúng
- [ ] **Result**: ✅ / ❌ / ⚠️

#### Test Case R.2: Existing Prompts vẫn hiển thị
- [ ] Vào Home page
- [ ] **Expected**: Prompts hiển thị bình thường
- [ ] **Result**: ✅ / ❌ / ⚠️

#### Test Case R.3: Create Prompt vẫn hoạt động
- [ ] Vào My Prompts page
- [ ] Tạo prompt mới
- [ ] **Expected**: Prompt được tạo thành công
- [ ] **Result**: ✅ / ❌ / ⚠️

#### Test Case R.4: Categories vẫn hoạt động
- [ ] Vào Categories page
- [ ] Thêm category mới
- [ ] **Expected**: Category được thêm thành công
- [ ] **Result**: ✅ / ❌ / ⚠️

---

## 📋 EDGE CASES

### Test Case E.1: Large File
- [ ] Tạo file với 100+ prompts
- [ ] Import file đó
- [ ] **Expected**: Import thành công, không có performance issues
- [ ] **Result**: ✅ / ❌ / ⚠️

### Test Case E.2: Special Characters
- [ ] Tạo prompt với special characters (emoji, unicode)
- [ ] Import file đó
- [ ] **Expected**: Import thành công, characters hiển thị đúng
- [ ] **Result**: ✅ / ❌ / ⚠️

### Test Case E.3: Very Long Content
- [ ] Tạo prompt với content rất dài (1000+ chars)
- [ ] Import file đó
- [ ] **Expected**: Import thành công
- [ ] **Result**: ✅ / ❌ / ⚠️

---

## 📊 TEST SUMMARY

### Phase 1 Tests
- **Passed**: ___ / 9
- **Failed**: ___ / 9
- **Issues**: ___ / 9

### Phase 2 Tests
- **Passed**: ___ / 8
- **Failed**: ___ / 8
- **Issues**: ___ / 8

### Regression Tests
- **Passed**: ___ / 4
- **Failed**: ___ / 4
- **Issues**: ___ / 4

### Edge Cases
- **Passed**: ___ / 3
- **Failed**: ___ / 3
- **Issues**: ___ / 3

### Overall
- **Total Passed**: ___ / 24
- **Total Failed**: ___ / 24
- **Success Rate**: ___%

---

## 🐛 ISSUES FOUND

### Critical Issues
1. _______________________
2. _______________________

### Minor Issues
1. _______________________
2. _______________________

### Suggestions
1. _______________________
2. _______________________

---

## 📝 NOTES

- Test date: _______________________
- Tester: _______________________
- Browser: _______________________
- Version: _______________________

---

**Lưu ý**: Đánh dấu ✅ khi test pass, ❌ khi fail, ⚠️ khi có issue nhỏ nhưng vẫn chấp nhận được.
