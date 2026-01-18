# 📚 TÀI LIỆU ỨNG DỤNG PROMPTVAULT

Thư mục này chứa toàn bộ tài liệu kỹ thuật và hướng dẫn cho ứng dụng PromptVault.

---

## 📖 MỤC LỤC TÀI LIỆU

### 🏗️ Kiến Trúc & Thiết Kế
- **[DATA_MODEL.md](./DATA_MODEL.md)** - Mô hình dữ liệu, interfaces, types
- **[STATE_MANAGEMENT.md](./STATE_MANAGEMENT.md)** - Chi tiết về quản lý state với Zustand
- **[DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)** - Hệ thống thiết kế, UI/UX guidelines

### 🧩 Components & Pages
- **[COMPONENTS.md](./COMPONENTS.md)** - Tài liệu chi tiết về các reusable components
- **[PAGES.md](./PAGES.md)** - Tài liệu về các pages và routing logic

### 🔐 Firebase Authentication & Admin
- **[FIREBASE_AUTH_SETUP_GUIDE.md](./FIREBASE_AUTH_SETUP_GUIDE.md)** - Hướng dẫn setup Firebase Authentication chi tiết (bao gồm Quick Start)
- **[FIREBASE_AUTH_IMPLEMENTATION_PLAN.md](./FIREBASE_AUTH_IMPLEMENTATION_PLAN.md)** - Kế hoạch triển khai Firebase Authentication từng bước
- **[FIREBASE_AUTH_TESTING_GUIDE.md](./FIREBASE_AUTH_TESTING_GUIDE.md)** - Hướng dẫn test Firebase Authentication (bao gồm Quick Checklist)
- **[SETUP_ADMIN_USER.md](./SETUP_ADMIN_USER.md)** - Hướng dẫn setup admin user
- **[FIX_FIRESTORE_RULES.md](./FIX_FIRESTORE_RULES.md)** - Fix Firestore Security Rules cho Admin Panel
- **[SYNC_USERS_FROM_AUTH.md](./SYNC_USERS_FROM_AUTH.md)** - Sync users từ Firebase Authentication sang Firestore
- **[ADMIN_PANEL_ANALYSIS.md](./ADMIN_PANEL_ANALYSIS.md)** - Phân tích Admin Panel, issues và improvements
- **[ADMIN_PANEL_AUTHORIZATION.md](./ADMIN_PANEL_AUTHORIZATION.md)** - Tài liệu phân quyền Admin Panel với Firebase

### 💻 Phát Triển
- **[DEVELOPMENT.md](./DEVELOPMENT.md)** - Hướng dẫn setup, development workflow, best practices
- **[API_REFERENCE.md](./API_REFERENCE.md)** - Tham chiếu đầy đủ về stores, functions, hooks
- **[WORKFLOWS.md](./WORKFLOWS.md)** - Các user workflows và business logic flows
- **[GIT_SETUP_GUIDE.md](./GIT_SETUP_GUIDE.md)** - Hướng dẫn setup Git

### 🚀 Triển Khai & Sử Dụng
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Hướng dẫn build, deploy, configuration
- **[USER_GUIDE.md](./USER_GUIDE.md)** - Hướng dẫn sử dụng cho end users

### 📋 Kế Hoạch & Tiến Độ
- **[ROADMAP.md](./ROADMAP.md)** - Roadmap phát triển, tính năng đã hoàn thành và kế hoạch tương lai
- **[SUMMARY_COMPLETED_WORK.md](./SUMMARY_COMPLETED_WORK.md)** - Tóm tắt công việc đã hoàn thành (bao gồm Firebase Auth)

### 📥📤 Features
- **[IMPORT_EXPORT.md](./IMPORT_EXPORT.md)** - Tài liệu Import/Export JSON (tổng hợp)

### 📋 Planning
- **[DOCS_REORGANIZATION_PLAN.md](./DOCS_REORGANIZATION_PLAN.md)** - Kế hoạch quy hoạch lại thư mục docs

---

## 🎯 MỤC ĐÍCH

Tài liệu này được tạo ra để:
- **Hiểu rõ kiến trúc**: Nắm được cách ứng dụng được xây dựng và tổ chức
- **Phát triển dễ dàng**: Có đầy đủ thông tin để tiếp tục phát triển tính năng mới
- **Bảo trì hiệu quả**: Biết được nguyên lý hoạt động để debug và fix bugs
- **Onboarding nhanh**: Developer mới có thể nắm bắt dự án nhanh chóng

---

## 📝 QUY ƯỚC

- Tất cả code examples sử dụng TypeScript
- File paths là relative từ root của project
- Tài liệu được cập nhật thường xuyên để phản ánh code hiện tại

---

## 🔄 CẬP NHẬT GẦN ĐÂY

### 2025 - Quy hoạch lại Docs
- ✅ Xóa các file outdated (ARCHITECTURE.md, BAN_MO_TA_TONG_QUAN_UNG_DUNG.md, etc.)
- ✅ Merge các file trùng lặp
- ✅ Tổng hợp Import/Export docs thành 1 file
- ✅ Cập nhật README.md với cấu trúc mới

### 2025 - Firebase Authentication
- ✅ Implement Firebase Authentication
- ✅ Implement Admin Panel với phân quyền
- ✅ Tạo tài liệu phân quyền chi tiết

---

## 📚 TÀI LIỆU QUAN TRỌNG NHẤT

### Cho Developers Mới
1. **[FIREBASE_AUTH_SETUP_GUIDE.md](./FIREBASE_AUTH_SETUP_GUIDE.md)** - Bắt đầu với Firebase
2. **[DATA_MODEL.md](./DATA_MODEL.md)** - Hiểu data structure
3. **[STATE_MANAGEMENT.md](./STATE_MANAGEMENT.md)** - Hiểu state management
4. **[COMPONENTS.md](./COMPONENTS.md)** - Hiểu components
5. **[PAGES.md](./PAGES.md)** - Hiểu pages và routing

### Cho Admin
1. **[SETUP_ADMIN_USER.md](./SETUP_ADMIN_USER.md)** - Setup admin user
2. **[ADMIN_PANEL_AUTHORIZATION.md](./ADMIN_PANEL_AUTHORIZATION.md)** - Hiểu phân quyền
3. **[FIX_FIRESTORE_RULES.md](./FIX_FIRESTORE_RULES.md)** - Fix Security Rules

### Cho Testing
1. **[FIREBASE_AUTH_TESTING_GUIDE.md](./FIREBASE_AUTH_TESTING_GUIDE.md)** - Test Firebase Auth
2. **[IMPORT_EXPORT.md](./IMPORT_EXPORT.md)** - Test Import/Export

---

**Ngày cập nhật**: 2025  
**Phiên bản**: 2.0
