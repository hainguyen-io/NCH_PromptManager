# BẢN MÔ TẢ TỔNG QUAN ỨNG DỤNG - PROMPTVAULT

## 1. THÔNG TIN TỔNG QUAN

### 1.1. Tên Ứng Dụng
**PromptVault** - Hệ thống quản lý và khám phá AI Prompts cá nhân

### 1.2. Loại Ứng Dụng
**Mini-SaaS (Software as a Service)** - Ứng dụng web quản lý prompts AI với khả năng hoạt động offline, lưu trữ dữ liệu cục bộ và hỗ trợ xuất/nhập dữ liệu.

### 1.3. Mục Đích
PromptVault là một thư viện cá nhân để lưu trữ, tổ chức và khám phá các AI prompts nhằm tăng năng suất làm việc. Ứng dụng hoạt động hoàn toàn offline, dữ liệu được lưu trữ trong trình duyệt và có thể xuất/nhập để sao lưu hoặc chia sẻ.

### 1.4. Phiên Bản
**v0.0.0** (Development)

---

## 2. KIẾN TRÚC KỸ THUẬT

### 2.1. Công Nghệ Sử Dụng

#### Frontend Framework
- **React 19.2.3** - UI framework
- **TypeScript 5.8.2** - Type safety
- **Vite 6.2.0** - Build tool và dev server

#### State Management
- **Zustand 5.0.10** - Lightweight state management với persistence middleware

#### UI/UX Libraries
- **Tailwind CSS** - Utility-first CSS framework (inline classes)
- **Lucide React 0.562.0** - Icon library

#### Build & Development
- **@vitejs/plugin-react** - Vite plugin cho React
- **@types/node** - TypeScript definitions

### 2.2. Kiến Trúc Ứng Dụng

```
PromptVault/
├── App.tsx                 # Root component, routing logic
├── index.tsx               # Entry point
├── store.ts                # Zustand stores (UI, User, Categories, Prompts)
├── types.ts                # TypeScript type definitions
├── components/             # Reusable UI components
│   ├── Header.tsx          # Navigation header với mobile menu
│   ├── PromptCard.tsx      # Card component hiển thị prompt
│   └── PromptModal.tsx     # Modal chi tiết prompt
├── pages/                  # Page components
│   ├── Home.tsx            # Trang chủ với hero và trending prompts
│   ├── Library.tsx         # Thư viện prompts với search/filter
│   ├── MyPrompts.tsx       # Quản lý prompts của user (CRUD)
│   ├── Categories.tsx      # Quản lý categories
│   ├── Settings.tsx        # Cài đặt (theme, export/import, reset)
│   └── User.tsx            # Quản lý profile user
└── metadata.json           # App metadata
```

### 2.3. State Management Architecture

Ứng dụng sử dụng **4 Zustand stores** với persistence:

1. **UIStore** (`useUIStore`)
   - Dark mode toggle
   - Current view navigation
   - Toast notifications
   - Persist: Dark mode preference

2. **UserStore** (`useUserStore`)
   - User profile (name, avatar initials)
   - Persist: User data

3. **CategoryStore** (`useCategoryStore`)
   - Categories management (CRUD)
   - Seed data: 4 default categories (Coding, Writing, Marketing, Productivity)
   - Persist: Categories data

4. **PromptStore** (`usePromptStore`)
   - Prompts CRUD operations
   - View count tracking
   - Favorite toggle
   - Import/Export functionality
   - Seed data: 3 sample prompts
   - Persist: Prompts data

**Storage Mechanism**: Tất cả stores sử dụng `localStorage` thông qua Zustand persist middleware.

---

## 3. CHỨC NĂNG CHÍNH

### 3.1. Quản Lý Prompts

#### 3.1.1. Tạo Prompt Mới
- Form nhập liệu với các trường:
  - Title (bắt buộc)
  - Content (bắt buộc)
  - Description (tùy chọn)
  - Category (dropdown)
  - Tags (comma-separated)
- Tự động gán: ID, viewCount (0), createdAt (timestamp), author (user name)

#### 3.1.2. Chỉnh Sửa Prompt
- Form tương tự như tạo mới
- Pre-fill dữ liệu hiện tại
- Cập nhật real-time vào store

#### 3.1.3. Xóa Prompt
- Confirmation dialog
- Xóa khỏi store và localStorage

#### 3.1.4. Xem Chi Tiết Prompt
- Modal hiển thị đầy đủ thông tin:
  - Title, description, content
  - Category badge với màu
  - Tags
  - Author, created date
  - View count (tự động tăng khi mở)
- Actions: Copy, Save to My Prompts

#### 3.1.5. Tính Năng Bổ Sung
- **Copy to Clipboard**: Copy prompt content
- **Favorite Toggle**: Đánh dấu yêu thích
- **View Count**: Theo dõi số lần xem
- **Save to My Prompts**: Lưu prompt từ Library vào collection cá nhân

### 3.2. Quản Lý Categories

#### 3.2.1. Tạo Category
- Form nhập: Name, Color (color picker)
- Tự động generate ID
- Validation: Không trùng tên

#### 3.2.2. Xóa Category
- Validation: Không cho phép xóa nếu có prompts đang sử dụng
- Hiển thị số lượng prompts đang dùng category đó

#### 3.2.3. Categories Mặc Định
- Coding (#3b82f6 - blue)
- Writing (#10b981 - green)
- Marketing (#f59e0b - orange)
- Productivity (#8b5cf6 - purple)

### 3.3. Tìm Kiếm & Lọc

#### 3.3.1. Search Functionality
- Tìm kiếm theo:
  - Title
  - Content
  - Tags
- Real-time filtering
- Case-insensitive

#### 3.3.2. Filter by Category
- Dropdown filter
- Option "All Categories"
- Kết hợp với search

### 3.4. Trang Chủ (Home)

#### 3.4.1. Hero Section
- Gradient background
- Call-to-action buttons:
  - Browse Library
  - Manage My Prompts

#### 3.4.2. Trending Prompts
- Hiển thị top 6 prompts theo view count
- Filter by category
- Link đến Library để xem tất cả

### 3.5. Thư Viện (Library)

- Hiển thị tất cả prompts
- Search bar với icon
- Category filter
- Grid layout responsive (1/2/3 columns)
- Empty state khi không có kết quả

### 3.6. My Prompts

- Hiển thị tất cả prompts của user
- Form create/edit inline
- Actions: Edit, Delete trên mỗi card
- List view với full details

### 3.7. Cài Đặt (Settings)

#### 3.7.1. Appearance
- Dark Mode toggle
- Switch component với animation
- Persist preference

#### 3.7.2. Data Management
- **Export JSON**: Xuất tất cả prompts và categories ra file JSON
- **Import JSON**: Nhập prompts từ file JSON (merge strategy)
- **Reset Application**: Xóa toàn bộ dữ liệu và reset về seed data

### 3.8. User Profile

- Hiển thị avatar với initials
- Form chỉnh sửa tên
- Lưu trữ local
- Avatar tự động generate từ tên

---

## 4. UI/UX FEATURES

### 4.1. Responsive Design
- Mobile-first approach
- Breakpoints: sm, md, lg
- Mobile menu với hamburger icon
- Grid layouts tự động điều chỉnh

### 4.2. Dark Mode
- Toggle switch trong Settings
- Persist preference
- Smooth transitions
- Full theme support cho tất cả components

### 4.3. Animations
- Fade-in cho pages
- Slide-up cho toast notifications
- Hover effects trên cards
- Smooth transitions

### 4.4. Toast Notifications
- Bottom-right position
- Auto-dismiss sau 3 giây
- Dark/light mode support
- Slide-in animation

### 4.5. Navigation
- Sticky header với backdrop blur
- Active state highlighting
- Mobile menu overlay
- Breadcrumb-style navigation

---

## 5. DATA MODEL

### 5.1. Prompt Interface

```typescript
interface Prompt {
  id: string;                    // Unique identifier
  title: string;                 // Prompt title
  content: string;               // Full prompt content
  description?: string;          // Optional description
  categoryId: string;            // Reference to category
  tags: string[];               // Array of tags
  viewCount: number;             // View counter
  author: string;                // Creator name
  createdAt: number;             // Timestamp
  isFavorite: boolean;           // Favorite flag
}
```

### 5.2. Category Interface

```typescript
interface Category {
  id: string;                    // Unique identifier
  name: string;                  // Category name
  color: string;                 // Hex color code
}
```

### 5.3. User Interface

```typescript
interface User {
  name: string;                  // Display name
  avatarInitials: string;        // 2-letter initials
}
```

### 5.4. View Types

```typescript
type ViewName = 
  | 'HOME' 
  | 'LIBRARY' 
  | 'MY_PROMPTS' 
  | 'CATEGORIES' 
  | 'SETTINGS' 
  | 'USER';
```

---

## 6. DATA PERSISTENCE

### 6.1. Storage Strategy
- **LocalStorage** thông qua Zustand persist middleware
- 4 separate storage keys:
  - `promptvault-ui`: UI preferences
  - `promptvault-user`: User data
  - `promptvault-categories`: Categories
  - `promptvault-prompts`: Prompts

### 6.2. Export/Import Format

```json
{
  "app": "PromptVault",
  "exportedAt": "2024-01-01T00:00:00.000Z",
  "prompts": [...],
  "categories": [...]
}
```

### 6.3. Seed Data
- **Categories**: 4 mặc định
- **Prompts**: 3 mẫu (React Component Generator, SEO Blog Post Outliner, Email Professionalizer)

---

## 7. ROUTING & NAVIGATION

### 7.1. View-Based Routing
- Single Page Application (SPA)
- View state quản lý bởi Zustand
- No URL routing (client-side state only)

### 7.2. Navigation Flow

```
Home
  ├── Browse Library → Library
  └── Manage My Prompts → My Prompts

Header Navigation
  ├── Home
  ├── Library
  ├── My Prompts
  ├── Categories
  ├── Settings (icon)
  └── User Profile (avatar)
```

---

## 8. PERFORMANCE & OPTIMIZATION

### 8.1. Code Splitting
- Component-based architecture
- Lazy loading potential (chưa implement)

### 8.2. State Management
- Zustand lightweight store
- Selective persistence (chỉ persist cần thiết)
- Memoized filters (useMemo trong Library)

### 8.3. Rendering
- React 19 với StrictMode
- Efficient re-renders với Zustand selectors

---

## 9. SECURITY & PRIVACY

### 9.1. Data Storage
- **100% Local**: Tất cả dữ liệu lưu trong browser
- **No Backend**: Không có server, không có API calls
- **Privacy-First**: Dữ liệu không bao giờ rời khỏi máy người dùng

### 9.2. Data Export/Import
- User-initiated only
- JSON format validation
- No automatic sync

---

## 10. DEPLOYMENT & CONFIGURATION

### 10.1. Build Configuration
- **Vite** build system
- **Port**: 3000 (development)
- **Host**: 0.0.0.0 (accessible from network)

### 10.2. Environment Variables
- `GEMINI_API_KEY` (được define nhưng chưa sử dụng trong code hiện tại)

### 10.3. Build Commands
```bash
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview production build
```

---

## 11. LIMITATIONS & FUTURE ENHANCEMENTS

### 11.1. Current Limitations
- **No Backend**: Không có sync đa thiết bị
- **No Authentication**: Local-only user management
- **No Search Indexing**: Search cơ bản, chưa có full-text search nâng cao
- **No Versioning**: Không có lịch sử chỉnh sửa prompts
- **No Sharing**: Không có tính năng chia sẻ prompts công khai
- **No Analytics**: Không có thống kê sử dụng

### 11.2. Potential Enhancements
- **Cloud Sync**: Đồng bộ đa thiết bị
- **User Authentication**: Multi-user support
- **Advanced Search**: Full-text search, fuzzy matching
- **Prompt Templates**: Template system
- **Collections**: Group prompts into collections
- **Sharing**: Public/private sharing links
- **Version History**: Track prompt changes
- **Analytics Dashboard**: Usage statistics
- **AI Integration**: Test prompts directly trong app
- **Markdown Support**: Rich text formatting
- **Attachments**: Attach files/images to prompts

---

## 12. DEPENDENCIES SUMMARY

### Production Dependencies
- `react`: ^19.2.3
- `react-dom`: ^19.2.3
- `zustand`: ^5.0.10
- `lucide-react`: ^0.562.0

### Development Dependencies
- `@types/node`: ^22.14.0
- `@vitejs/plugin-react`: ^5.0.0
- `typescript`: ~5.8.2
- `vite`: ^6.2.0

---

## 13. FILE STRUCTURE DETAILS

### 13.1. Core Files
- **App.tsx**: Main application component, view router, toast system
- **index.tsx**: React DOM root, entry point
- **store.ts**: All Zustand stores và business logic
- **types.ts**: TypeScript type definitions

### 13.2. Components
- **Header.tsx**: Navigation với mobile menu, user profile button
- **PromptCard.tsx**: Reusable card component với actions (copy, favorite, edit, delete)
- **PromptModal.tsx**: Full-screen modal với prompt details và actions

### 13.3. Pages
- **Home.tsx**: Landing page với hero và trending prompts
- **Library.tsx**: Browse all prompts với search và filter
- **MyPrompts.tsx**: CRUD interface cho user prompts
- **Categories.tsx**: Category management UI
- **Settings.tsx**: App settings (theme, data management)
- **User.tsx**: User profile management

---

## 14. USER WORKFLOWS

### 14.1. Tạo Prompt Mới
1. Navigate to "My Prompts"
2. Click "New Prompt"
3. Fill form (title, content, category, tags)
4. Click "Save Prompt"
5. Prompt xuất hiện trong list

### 14.2. Tìm Kiếm Prompt
1. Navigate to "Library"
2. Nhập keyword vào search bar
3. (Optional) Chọn category filter
4. Browse kết quả

### 14.3. Export Data
1. Navigate to "Settings"
2. Click "Export JSON"
3. File JSON được download
4. Lưu file để backup

### 14.4. Import Data
1. Navigate to "Settings"
2. Click "Import JSON"
3. Chọn file JSON đã export trước đó
4. Prompts được merge vào collection hiện tại

---

## 15. DESIGN SYSTEM

### 15.1. Color Palette
- **Primary**: Blue tones (#3b82f6, #2563eb)
- **Success**: Green (#10b981)
- **Warning**: Orange (#f59e0b)
- **Danger**: Red (for delete actions)
- **Gray Scale**: Full range cho dark/light mode

### 15.2. Typography
- **Font**: System font stack (sans-serif)
- **Headings**: Bold, various sizes (text-2xl, text-3xl, etc.)
- **Body**: Regular weight, readable sizes

### 15.3. Spacing
- Consistent spacing scale (Tailwind defaults)
- Padding: p-4, p-6, p-8
- Gaps: gap-4, gap-6

### 15.4. Components Style
- **Cards**: Rounded-2xl, shadow-sm, border
- **Buttons**: Rounded-lg, primary/secondary variants
- **Inputs**: Rounded-md, border, focus states
- **Modals**: Backdrop blur, rounded-2xl, shadow-xl

---

## 16. ACCESSIBILITY

### 16.1. Current Implementation
- Semantic HTML elements
- Button labels và titles
- Keyboard navigation support (basic)
- Focus states trên interactive elements

### 16.2. Areas for Improvement
- ARIA labels
- Screen reader support
- Keyboard shortcuts
- Focus management trong modals

---

## 17. TESTING (Not Implemented)

### 17.1. Recommended Testing Strategy
- **Unit Tests**: Store logic, utility functions
- **Component Tests**: React Testing Library
- **Integration Tests**: User workflows
- **E2E Tests**: Critical paths (create, search, export)

---

## 18. DOCUMENTATION

### 18.1. Code Documentation
- TypeScript types provide inline documentation
- Component props có type definitions
- Store interfaces rõ ràng

### 18.2. User Documentation
- README.md cơ bản (hiện tại)
- Cần bổ sung: User guide, FAQ

---

## 19. LICENSE & METADATA

### 19.1. App Metadata
- **Name**: PromptVault
- **Description**: Personal mini-SaaS for storing, managing, and discovering prompts
- **Version**: 0.0.0
- **Type**: Private project

### 19.2. Requested Permissions
- None (local-only app)

---

## 20. KẾT LUẬN

PromptVault là một **mini-SaaS application** hoàn chỉnh với:

✅ **Core Features**: CRUD prompts, categories, search, filter  
✅ **User Experience**: Dark mode, responsive, animations  
✅ **Data Management**: Local storage, export/import  
✅ **Modern Stack**: React 19, TypeScript, Zustand, Vite  
✅ **Offline-First**: Hoạt động hoàn toàn offline  
✅ **Privacy-Focused**: Dữ liệu 100% local  

Ứng dụng phù hợp cho:
- Developers muốn quản lý AI prompts cá nhân
- Teams nhỏ cần tool quản lý prompts nội bộ
- Users muốn privacy-first solution
- Offline-first use cases

**Next Steps** để nâng cấp thành full SaaS:
1. Backend API (Node.js/Python)
2. Database (PostgreSQL/MongoDB)
3. Authentication (OAuth, JWT)
4. Cloud sync
5. Multi-user collaboration
6. Public sharing features

---

**Tài liệu được tạo tự động từ phân tích mã nguồn**  
**Ngày tạo**: 2024  
**Phiên bản ứng dụng**: 0.0.0
