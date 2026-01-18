# 📋 KẾ HOẠCH QUY HOẠCH LẠI THƯ MỤC DOCS

## PHÂN TÍCH HIỆN TRẠNG

### Tổng số files: 34 files

### Phân loại:

#### 1. OUTDATED (Cần xóa hoặc cập nhật)
- ❌ `ARCHITECTURE.md` - Mô tả offline-first, localStorage (app đã dùng Firebase)
- ❌ `BAN_MO_TA_TONG_QUAN_UNG_DUNG.md` - Mô tả offline-first (outdated)
- ❌ `ANALYSIS_USER_ADMIN_SYSTEM.md` - Phân tích client-side only (outdated, đã implement Firebase)
- ❌ `DEBUG_WHITE_SCREEN.md` - Đã fix rồi, không cần nữa
- ⚠️ `STATE_MANAGEMENT.md` - Cần update (đã có useAuthStore)

#### 2. TRÙNG LẶP (Cần merge hoặc xóa)
- 🔄 `FIREBASE_AUTH_QUICK_START.md` + `FIREBASE_AUTH_SETUP_GUIDE.md` → Merge thành 1 file
- 🔄 `QUICK_TESTING_CHECKLIST.md` + `FIREBASE_AUTH_TESTING_GUIDE.md` + `TEST_CHECKLIST.md` → Merge thành 1 file
- 🔄 `IMPLEMENTATION_SUMMARY.md` + `SUMMARY_COMPLETED_WORK.md` → Merge thành 1 file
- 🔄 `ADMIN_PANEL_ANALYSIS.md` + `ADMIN_PANEL_AUTHORIZATION.md` → Giữ cả 2 (khác mục đích)

#### 3. IMPORT/EXPORT (Cần kiểm tra)
- ❓ `ANALYSIS_IMPORT_EXPORT.md`
- ❓ `IMPLEMENTATION_PLAN_IMPORT_EXPORT.md`
- ❓ `EXECUTION_SEQUENCE_IMPORT_EXPORT.md`
- ❓ `TESTING_GUIDE_IMPORT_EXPORT.md`
→ Nếu tính năng đã hoàn thành: merge thành 1 file
→ Nếu chưa: giữ lại

#### 4. GIỮ LẠI (Cần cập nhật README.md)
- ✅ `README.md` - Mục lục chính
- ✅ `ADMIN_PANEL_AUTHORIZATION.md` - Tài liệu phân quyền (mới tạo)
- ✅ `FIREBASE_AUTH_SETUP_GUIDE.md` - Hướng dẫn setup (sau khi merge)
- ✅ `FIREBASE_AUTH_TESTING_GUIDE.md` - Hướng dẫn test (sau khi merge)
- ✅ `FIREBASE_AUTH_IMPLEMENTATION_PLAN.md` - Kế hoạch triển khai
- ✅ `SETUP_ADMIN_USER.md` - Setup admin user
- ✅ `FIX_FIRESTORE_RULES.md` - Fix Firestore rules
- ✅ `SYNC_USERS_FROM_AUTH.md` - Sync users
- ✅ `COMPONENTS.md` - Tài liệu components
- ✅ `PAGES.md` - Tài liệu pages
- ✅ `DATA_MODEL.md` - Mô hình dữ liệu
- ✅ `DESIGN_SYSTEM.md` - Design system
- ✅ `DEVELOPMENT.md` - Hướng dẫn development
- ✅ `DEPLOYMENT.md` - Hướng dẫn deployment
- ✅ `USER_GUIDE.md` - Hướng dẫn user
- ✅ `ROADMAP.md` - Roadmap
- ✅ `WORKFLOWS.md` - Workflows
- ✅ `API_REFERENCE.md` - API reference
- ✅ `GIT_SETUP_GUIDE.md` - Git setup

---

## KẾ HOẠCH HÀNH ĐỘNG

### Phase 1: XÓA FILES OUTDATED

1. ❌ Xóa `ARCHITECTURE.md` (outdated - mô tả offline-first)
2. ❌ Xóa `BAN_MO_TA_TONG_QUAN_UNG_DUNG.md` (outdated)
3. ❌ Xóa `ANALYSIS_USER_ADMIN_SYSTEM.md` (outdated - đã implement Firebase)
4. ❌ Xóa `DEBUG_WHITE_SCREEN.md` (đã fix)
5. ⚠️ Update `STATE_MANAGEMENT.md` (thêm useAuthStore)

### Phase 2: MERGE FILES TRÙNG LẶP

1. 🔄 Merge `FIREBASE_AUTH_QUICK_START.md` → `FIREBASE_AUTH_SETUP_GUIDE.md`
2. 🔄 Merge `QUICK_TESTING_CHECKLIST.md` + `TEST_CHECKLIST.md` → `FIREBASE_AUTH_TESTING_GUIDE.md`
3. 🔄 Merge `IMPLEMENTATION_SUMMARY.md` → `SUMMARY_COMPLETED_WORK.md` (giữ SUMMARY_COMPLETED_WORK.md)
4. 🔄 Giữ cả 2:
   - `ADMIN_PANEL_ANALYSIS.md` - Phân tích (analysis)
   - `ADMIN_PANEL_AUTHORIZATION.md` - Tài liệu phân quyền (authorization)

### Phase 3: XỬ LÝ IMPORT/EXPORT FILES

Kiểm tra xem tính năng Import/Export đã hoàn thành chưa:
- Nếu đã hoàn thành: Merge 4 files thành 1 file `IMPORT_EXPORT.md`
- Nếu chưa: Giữ lại nhưng tổ chức lại

### Phase 4: UPDATE README.md

Cập nhật `README.md` với cấu trúc mới.

---

## CẤU TRÚC MỚI ĐỀ XUẤT

```
docs/
├── README.md                          # Mục lục chính
│
├── 01-ARCHITECTURE/                   # Kiến trúc & Thiết kế
│   ├── ARCHITECTURE.md               # (Cần tạo mới - update với Firebase)
│   ├── DATA_MODEL.md                 # ✅ Giữ
│   ├── STATE_MANAGEMENT.md           # ⚠️ Update
│   └── DESIGN_SYSTEM.md              # ✅ Giữ
│
├── 02-COMPONENTS/                     # Components & Pages
│   ├── COMPONENTS.md                 # ✅ Giữ
│   └── PAGES.md                      # ✅ Giữ
│
├── 03-FIREBASE/                       # Firebase Authentication
│   ├── FIREBASE_AUTH_SETUP_GUIDE.md  # ✅ Giữ (sau merge)
│   ├── FIREBASE_AUTH_IMPLEMENTATION_PLAN.md  # ✅ Giữ
│   ├── FIREBASE_AUTH_TESTING_GUIDE.md  # ✅ Giữ (sau merge)
│   ├── SETUP_ADMIN_USER.md           # ✅ Giữ
│   ├── FIX_FIRESTORE_RULES.md        # ✅ Giữ
│   └── SYNC_USERS_FROM_AUTH.md       # ✅ Giữ
│
├── 04-ADMIN/                          # Admin Panel
│   ├── ADMIN_PANEL_ANALYSIS.md       # ✅ Giữ (analysis)
│   └── ADMIN_PANEL_AUTHORIZATION.md  # ✅ Giữ (authorization)
│
├── 05-DEVELOPMENT/                    # Development
│   ├── DEVELOPMENT.md                # ✅ Giữ
│   ├── API_REFERENCE.md              # ✅ Giữ
│   ├── WORKFLOWS.md                  # ✅ Giữ
│   └── GIT_SETUP_GUIDE.md            # ✅ Giữ
│
├── 06-DEPLOYMENT/                     # Deployment & Usage
│   ├── DEPLOYMENT.md                 # ✅ Giữ
│   └── USER_GUIDE.md                 # ✅ Giữ
│
├── 07-PLANNING/                       # Planning & Progress
│   ├── ROADMAP.md                    # ✅ Giữ
│   └── SUMMARY_COMPLETED_WORK.md     # ✅ Giữ (sau merge)
│
└── 08-FEATURES/                       # Feature Documentation
    ├── IMPORT_EXPORT.md              # (Merge 4 files nếu đã hoàn thành)
    └── ...
```

---

## THỐNG KÊ

### Trước quy hoạch: 34 files
### Sau quy hoạch: ~20-25 files (tùy vào Import/Export)

### Files sẽ xóa: ~9-14 files
### Files sẽ merge: ~8 files thành 4 files

---

## LƯU Ý

1. **Backup**: Nên backup toàn bộ docs trước khi xóa
2. **Review**: Kiểm tra từng file trước khi xóa/merge
3. **Update links**: Cập nhật tất cả links trong README.md và các file khác
4. **Version control**: Commit từng phase riêng biệt

---

**Ngày tạo**: 2025  
**Phiên bản**: 1.0
