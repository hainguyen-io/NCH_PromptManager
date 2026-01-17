# 📁 TEST DATA FILES

Thư mục này chứa các file test JSON để test tính năng Import/Export.

## Files

### test-valid.json
- **Mục đích**: Test import với data hoàn toàn valid
- **Nội dung**: 2 categories, 2 prompts (tất cả valid)
- **Expected**: Tất cả được import thành công

### test-duplicates.json
- **Mục đích**: Test import với prompts có IDs đã tồn tại
- **Nội dung**: 3 prompts (2 có IDs trùng với seed data)
- **Expected**: 1 prompt được import, 2 bị skip (duplicates)

### test-invalid-structure.json
- **Mục đích**: Test validation với invalid prompt structures
- **Nội dung**: 5 prompts (1 valid, 4 invalid - missing fields, wrong types)
- **Expected**: 1 prompt được import, 4 bị skip

### test-missing-categories.json
- **Mục đích**: Test import với prompts có categoryId không tồn tại
- **Nội dung**: 1 category mới, 3 prompts (1 valid category, 1 invalid, 1 existing)
- **Expected**: Category được import, 2 prompts được import, 1 bị skip

### test-mixed.json
- **Mục đích**: Test import với mix valid và invalid prompts
- **Nội dung**: 1 category, 5 prompts (2 valid, 3 invalid)
- **Expected**: 2 prompts được import, 3 bị skip

### test-empty.json
- **Mục đích**: Test import file rỗng
- **Nội dung**: Không có prompts
- **Expected**: Toast "No valid prompts to import"

### test-invalid-json.json
- **Mục đích**: Test import với invalid JSON structure
- **Nội dung**: Prompts không đúng format
- **Expected**: Error message

## Cách Sử Dụng

1. Mở ứng dụng
2. Vào Settings page
3. Click "Import JSON"
4. Chọn một trong các file test
5. Verify kết quả theo Expected results

## Lưu Ý

- Backup data trước khi test
- Có thể clear localStorage để test từ đầu
- Hoặc dùng browser incognito mode
