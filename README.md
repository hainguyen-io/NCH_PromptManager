# 🗄️ PromptVault

<div align="center">

**A personal mini-SaaS for storing, managing, and discovering AI prompts**

[![Version](https://img.shields.io/badge/version-1.0.1-blue.svg)](https://github.com/hainguyen-io/NCH_PromptManager)
[![React](https://img.shields.io/badge/React-19.2.3-61dafb.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-3178c6.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

</div>

---

## 📖 Giới Thiệu

**PromptVault** là một ứng dụng web quản lý AI prompts cá nhân, giúp bạn lưu trữ, tổ chức và khám phá các prompts hiệu quả. Ứng dụng hoạt động hoàn toàn **offline**, dữ liệu được lưu trữ cục bộ trong trình duyệt và có thể xuất/nhập để sao lưu hoặc chia sẻ.

### ✨ Tính Năng Chính

- 🎯 **Quản lý Prompts**: Tạo, chỉnh sửa, xóa và tìm kiếm prompts
- 📁 **Phân Loại**: Tổ chức prompts theo categories với màu sắc tùy chỉnh
- ⭐ **Favorites**: Đánh dấu prompts yêu thích
- 🔍 **Tìm Kiếm & Lọc**: Tìm kiếm theo từ khóa và lọc theo category
- 📊 **Thống Kê**: Theo dõi số lần xem prompts
- 💾 **Export/Import**: Xuất/nhập dữ liệu dạng JSON với preview và validation
- 🌙 **Dark Mode**: Giao diện tối/sáng với persistence
- 📱 **Responsive**: Hoạt động tốt trên mọi thiết bị
- 🔒 **Offline-First**: Hoạt động hoàn toàn offline, không cần backend

---

## 🚀 Bắt Đầu

### Yêu Cầu

- **Node.js** >= 18.x
- **npm** hoặc **yarn**

### Cài Đặt

1. **Clone repository**
   ```bash
   git clone https://github.com/hainguyen-io/NCH_PromptManager.git
   cd NCH_PromptManager
   ```

2. **Cài đặt dependencies**
   ```bash
   npm install
   ```

3. **Chạy development server**
   ```bash
   npm run dev
   ```

4. **Mở browser**
   ```
   http://localhost:3000
   ```

### Build Production

```bash
npm run build
npm run preview
```

---

## 🛠️ Tech Stack

### Core
- **React 19.2.3** - UI Framework
- **TypeScript 5.8.2** - Type Safety
- **Vite 6.2.0** - Build Tool & Dev Server

### State Management
- **Zustand 5.0.10** - Lightweight state management với persistence

### UI/UX
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React 0.562.0** - Icon library

### Data Persistence
- **localStorage** - Client-side storage (via Zustand persist)

---

## 📁 Cấu Trúc Dự Án

```
NCH_PromptManager/
├── components/          # Reusable UI components
│   ├── Header.tsx      # Navigation header
│   ├── PromptCard.tsx  # Prompt card component
│   ├── PromptModal.tsx # Prompt detail modal
│   └── ImportModal.tsx # Import preview modal
├── pages/              # Page components
│   ├── Home.tsx        # Home page
│   ├── Library.tsx     # Library page
│   ├── MyPrompts.tsx   # My Prompts page
│   ├── Categories.tsx  # Categories page
│   ├── Settings.tsx    # Settings page
│   └── User.tsx        # User profile page
├── utils/              # Utility functions
│   └── importValidation.ts  # Import validation logic
├── test-data/          # Test JSON files
├── docs/               # Documentation
├── store.ts            # Zustand stores
├── types.ts            # TypeScript types
├── App.tsx             # Root component
└── index.tsx           # Entry point
```

---

## 🎯 Tính Năng Chi Tiết

### Quản Lý Prompts
- ✅ CRUD operations (Create, Read, Update, Delete)
- ✅ Tìm kiếm theo title, content, tags
- ✅ Lọc theo category
- ✅ Đánh dấu favorites
- ✅ Theo dõi view count
- ✅ Copy prompt content

### Quản Lý Categories
- ✅ Tạo, xóa categories
- ✅ Tùy chỉnh màu sắc
- ✅ Validation khi xóa (kiểm tra prompts đang sử dụng)

### Import/Export
- ✅ Export toàn bộ data (prompts + categories) ra JSON
- ✅ Import với preview modal
- ✅ Validation đầy đủ
- ✅ Import categories tự động
- ✅ Xử lý duplicates
- ✅ Error handling chi tiết

### User Experience
- ✅ Dark mode với persistence
- ✅ Toast notifications
- ✅ Responsive design
- ✅ Loading states
- ✅ Smooth animations

---

## 📚 Tài Liệu

Tài liệu chi tiết được lưu trong thư mục [`docs/`](./docs/):

- [📋 README](./docs/README.md) - Mục lục tài liệu
- [🏗️ Architecture](./docs/ARCHITECTURE.md) - Kiến trúc ứng dụng
- [💾 State Management](./docs/STATE_MANAGEMENT.md) - Quản lý state
- [📊 Data Model](./docs/DATA_MODEL.md) - Mô hình dữ liệu
- [🧩 Components](./docs/COMPONENTS.md) - Components documentation
- [📄 Pages](./docs/PAGES.md) - Pages documentation
- [🔄 Workflows](./docs/WORKFLOWS.md) - User workflows
- [🔌 API Reference](./docs/API_REFERENCE.md) - API reference
- [🎨 Design System](./docs/DESIGN_SYSTEM.md) - Design guidelines
- [👤 User Guide](./docs/USER_GUIDE.md) - Hướng dẫn sử dụng
- [🚀 Deployment](./docs/DEPLOYMENT.md) - Hướng dẫn deploy
- [💻 Development](./docs/DEVELOPMENT.md) - Development guide

---

## 🧪 Testing

Test files được lưu trong [`test-data/`](./test-data/):

- `test-valid.json` - Valid data
- `test-duplicates.json` - Test duplicates
- `test-invalid-structure.json` - Test validation
- `test-missing-categories.json` - Test category references
- `test-mixed.json` - Mixed valid/invalid data

Xem [Testing Guide](./docs/TESTING_GUIDE_IMPORT_EXPORT.md) để biết thêm chi tiết.

---

## 🔄 Development Workflow

### Thêm Tính Năng Mới

1. Tạo branch mới
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Develop và test
   ```bash
   npm run dev
   ```

3. Commit changes
   ```bash
   git add .
   git commit -m "feat: your feature description"
   ```

4. Push và tạo Pull Request
   ```bash
   git push origin feature/your-feature-name
   ```

### Code Style

- Sử dụng TypeScript cho type safety
- Components theo PascalCase
- Functions theo camelCase
- Follow React best practices
- Sử dụng Tailwind CSS cho styling

---

## 📦 Build & Deploy

### Build

```bash
npm run build
```

Output sẽ được tạo trong thư mục `dist/`.

### Deploy

Ứng dụng có thể deploy lên:
- **Vercel** (recommended)
- **Netlify**
- **GitHub Pages**
- **Any static hosting**

Xem [Deployment Guide](./docs/DEPLOYMENT.md) để biết thêm chi tiết.

---

## 🤝 Đóng Góp

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License.

---

## 👤 Author

**hainguyen-io**

- GitHub: [@hainguyen-io](https://github.com/hainguyen-io)
- Repository: [NCH_PromptManager](https://github.com/hainguyen-io/NCH_PromptManager)

---

## 🙏 Acknowledgments

- [React](https://react.dev/) - UI Framework
- [Zustand](https://zustand-demo.pmnd.rs/) - State Management
- [Vite](https://vitejs.dev/) - Build Tool
- [Tailwind CSS](https://tailwindcss.com/) - CSS Framework
- [Lucide](https://lucide.dev/) - Icon Library

---

<div align="center">

**Made with ❤️ by hainguyen-io**

[⭐ Star this repo](https://github.com/hainguyen-io/NCH_PromptManager) if you find it helpful!

</div>
