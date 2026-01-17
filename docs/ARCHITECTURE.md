# 🏗️ KIẾN TRÚC ỨNG DỤNG PROMPTVAULT

## 1. TỔNG QUAN

PromptVault là một **Single Page Application (SPA)** được xây dựng với React 19, TypeScript, và Zustand. Ứng dụng hoạt động hoàn toàn **offline-first**, lưu trữ dữ liệu trong browser localStorage.

### 1.1. Kiến Trúc Tổng Thể

```
┌─────────────────────────────────────────────────┐
│              Browser (Client Only)               │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌──────────────┐      ┌──────────────┐      │
│  │   React App   │◄────►│ Zustand Store│      │
│  │  (Components) │      │  (State Mgmt)│      │
│  └──────┬───────┘      └──────┬───────┘      │
│         │                      │               │
│         │                      ▼               │
│         │              ┌──────────────┐        │
│         │              │ LocalStorage │        │
│         │              │ (Persistence)│        │
│         │              └──────────────┘        │
│         │                                      │
│         └──────────┐                          │
│                    ▼                          │
│         ┌──────────────────┐                 │
│         │  View Router     │                 │
│         │  (App.tsx)       │                 │
│         └──────────────────┘                 │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Đặc điểm chính:**
- ✅ **No Backend**: Không có server, không có API calls
- ✅ **Client-Side Only**: Tất cả logic chạy trong browser
- ✅ **LocalStorage Persistence**: Dữ liệu tự động lưu vào localStorage
- ✅ **View-Based Routing**: Routing bằng state, không dùng URL

## 2. CẤU TRÚC THƯ MỤC

```
PromptVault/
├── App.tsx                 # Root component, view router
├── index.tsx               # React entry point
├── store.ts                # Zustand stores (4 stores)
├── types.ts                # TypeScript type definitions
├── vite.config.ts          # Vite configuration
├── package.json            # Dependencies
├── metadata.json           # App metadata
│
├── components/            # Reusable UI components
│   ├── Header.tsx         # Navigation header
│   ├── PromptCard.tsx     # Prompt card component
│   └── PromptModal.tsx    # Prompt detail modal
│
├── pages/                 # Page components (views)
│   ├── Home.tsx           # Landing page
│   ├── Library.tsx        # Browse all prompts
│   ├── MyPrompts.tsx      # User's prompts (CRUD)
│   ├── Categories.tsx     # Category management
│   ├── Settings.tsx       # App settings
│   └── User.tsx           # User profile
│
└── docs/                  # Documentation (this folder)
```

## 3. CÔNG NGHỆ STACK

### 3.1. Core Technologies

| Technology | Version | Mục Đích |
|------------|---------|----------|
| **React** | 19.2.3 | UI Framework |
| **TypeScript** | 5.8.2 | Type Safety |
| **Vite** | 6.2.0 | Build Tool & Dev Server |
| **Zustand** | 5.0.10 | State Management |
| **Tailwind CSS** | (inline) | Styling |
| **Lucide React** | 0.562.0 | Icons |

### 3.2. Build & Development Tools

- **@vitejs/plugin-react**: Vite plugin cho React
- **@types/node**: TypeScript definitions cho Node.js

## 4. KIẾN TRÚC STATE MANAGEMENT

Ứng dụng sử dụng **4 Zustand stores** độc lập, mỗi store quản lý một domain cụ thể:

```
┌─────────────────────────────────────────────────┐
│              Zustand Stores                      │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌──────────────┐  ┌──────────────┐           │
│  │  UIStore     │  │  UserStore   │           │
│  │  - darkMode  │  │  - user      │           │
│  │  - view      │  │  - setUser()  │           │
│  │  - toast     │  └──────────────┘           │
│  └──────────────┘                              │
│                                                 │
│  ┌──────────────┐  ┌──────────────┐           │
│  │CategoryStore │  │ PromptStore  │           │
│  │  - categories│  │  - prompts   │           │
│  │  - CRUD ops  │  │  - CRUD ops   │           │
│  └──────────────┘  └──────────────┘           │
│                                                 │
└─────────────────────────────────────────────────┘
         │                    │
         ▼                    ▼
┌─────────────────────────────────────────────────┐
│           LocalStorage                          │
│  - promptvault-ui                              │
│  - promptvault-user                            │
│  - promptvault-categories                      │
│  - promptvault-prompts                         │
└─────────────────────────────────────────────────┘
```

**Chi tiết từng store:**
- Xem [STATE_MANAGEMENT.md](./STATE_MANAGEMENT.md)

## 5. ROUTING ARCHITECTURE

### 5.1. View-Based Routing

Ứng dụng **KHÔNG sử dụng URL routing** (như React Router). Thay vào đó, routing được quản lý bằng state trong `UIStore`:

```typescript
// View types
type ViewName = 
  | 'HOME' 
  | 'LIBRARY' 
  | 'MY_PROMPTS' 
  | 'CATEGORIES' 
  | 'SETTINGS' 
  | 'USER';
```

### 5.2. Routing Flow

```
User Action (Click Navigation)
    │
    ▼
setView('LIBRARY')  // Update UIStore
    │
    ▼
App.tsx renderView()
    │
    ▼
Switch statement
    │
    ▼
Render <Library /> component
```

**File: `App.tsx`**
```typescript
const renderView = () => {
  switch (currentView) {
    case 'HOME': return <Home />;
    case 'LIBRARY': return <Library />;
    // ... other cases
  }
};
```

### 5.3. Navigation Structure

```
Header Navigation
├── Home (Layout icon)
├── Library (Library icon)
├── My Prompts (BookMarked icon)
├── Categories (Layers icon)
├── Settings (Settings icon) - Icon button
└── User Profile (Avatar) - Button
```

## 6. DATA FLOW

### 6.1. Component → Store Flow

```
User Input (Component)
    │
    ▼
Event Handler
    │
    ▼
Store Action (e.g., addPrompt())
    │
    ▼
Zustand Store Update
    │
    ▼
Persistence Middleware
    │
    ▼
LocalStorage Save
    │
    ▼
Component Re-render (auto)
```

### 6.2. Store → Component Flow

```
Component Mount
    │
    ▼
usePromptStore() hook
    │
    ▼
Subscribe to Store
    │
    ▼
Read State (e.g., prompts)
    │
    ▼
Render UI
    │
    ▼
Store Change Detected
    │
    ▼
Component Re-render
```

## 7. PERSISTENCE ARCHITECTURE

### 7.1. Persistence Strategy

Tất cả stores sử dụng **Zustand persist middleware** với localStorage:

```typescript
export const usePromptStore = create<PromptState>()(
  persist(
    (set) => ({ /* store logic */ }),
    { 
      name: 'promptvault-prompts',
      storage: createJSONStorage(() => localStorage)
    }
  )
);
```

### 7.2. Storage Keys

| Key | Store | Data |
|-----|-------|------|
| `promptvault-ui` | UIStore | darkMode only |
| `promptvault-user` | UserStore | user object |
| `promptvault-categories` | CategoryStore | categories array |
| `promptvault-prompts` | PromptStore | prompts array |

### 7.3. Data Lifecycle

```
App Load
    │
    ▼
Zustand Persist Middleware
    │
    ▼
Read from LocalStorage
    │
    ▼
Hydrate Store State
    │
    ▼
Component Render with Data
    │
    ▼
User Action → Store Update
    │
    ▼
Persistence Middleware
    │
    ▼
Save to LocalStorage (auto)
```

## 8. COMPONENT ARCHITECTURE

### 8.1. Component Hierarchy

```
App
├── Header
│   ├── Logo
│   ├── Navigation Items
│   ├── Settings Button
│   └── User Avatar
│
└── Main Content (renderView)
    ├── Home
    │   ├── Hero Section
    │   └── Trending Prompts Grid
    │       └── PromptCard[]
    │
    ├── Library
    │   ├── Search Bar
    │   ├── Category Filter
    │   └── Prompts Grid
    │       └── PromptCard[]
    │
    ├── MyPrompts
    │   ├── Create/Edit Form
    │   └── Prompts List
    │       └── PromptCard[] (with Edit/Delete)
    │
    ├── Categories
    │   ├── Add Category Form
    │   └── Categories Grid
    │
    ├── Settings
    │   ├── Dark Mode Toggle
    │   └── Data Management
    │
    └── User
        └── Profile Form

└── PromptModal (Conditional)
    └── Prompt Details
```

### 8.2. Component Types

1. **Layout Components**: Header, App (routing)
2. **Page Components**: Home, Library, MyPrompts, etc.
3. **UI Components**: PromptCard, PromptModal
4. **Form Components**: Inline trong pages

## 9. STYLING ARCHITECTURE

### 9.1. Tailwind CSS Approach

- **Utility-First**: Sử dụng Tailwind classes trực tiếp
- **No CSS Files**: Không có file CSS riêng
- **Dark Mode**: Sử dụng `dark:` prefix
- **Responsive**: Sử dụng `sm:`, `md:`, `lg:` breakpoints

### 9.2. Theme System

```typescript
// Dark mode được quản lý bằng class trên <html>
useEffect(() => {
  if (darkMode) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}, [darkMode]);
```

### 9.3. Color System

- **Primary**: Blue (#3b82f6)
- **Success**: Green (#10b981)
- **Warning**: Orange (#f59e0b)
- **Danger**: Red
- **Gray Scale**: Full range cho light/dark mode

## 10. BUILD & BUNDLING

### 10.1. Vite Configuration

**File: `vite.config.ts`**
```typescript
export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0',  // Accessible from network
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    }
  }
});
```

### 10.2. Build Process

```
Source Code (TSX/TS)
    │
    ▼
Vite Dev Server (dev mode)
    │
    ▼
TypeScript Compilation
    │
    ▼
React JSX Transform
    │
    ▼
Bundle (ES modules)
    │
    ▼
Browser
```

### 10.3. Production Build

```bash
npm run build
```

Output: `dist/` folder với optimized production bundle.

## 11. PERFORMANCE CONSIDERATIONS

### 11.1. Current Optimizations

- ✅ **Zustand Selectors**: Chỉ subscribe vào state cần thiết
- ✅ **useMemo**: Memoized filters trong Library page
- ✅ **Component Splitting**: Tách components nhỏ, reusable
- ✅ **Selective Persistence**: Chỉ persist data cần thiết

### 11.2. Potential Improvements

- ⚠️ **Code Splitting**: Chưa implement lazy loading
- ⚠️ **Virtual Scrolling**: Chưa có cho large lists
- ⚠️ **Debouncing**: Search chưa có debounce

## 12. SECURITY ARCHITECTURE

### 12.1. Client-Side Security

- ✅ **No API Keys Exposure**: Không có sensitive data trong code
- ✅ **LocalStorage Only**: Dữ liệu không gửi đi đâu
- ✅ **No XSS Vulnerabilities**: React tự động escape

### 12.2. Data Privacy

- ✅ **100% Local**: Dữ liệu không bao giờ rời browser
- ✅ **User Control**: Export/Import do user quyết định
- ✅ **No Tracking**: Không có analytics, tracking

## 13. ERROR HANDLING

### 13.1. Current Implementation

- **Toast Notifications**: Hiển thị lỗi/user feedback
- **Try-Catch**: Trong import/export functions
- **Validation**: Form validation cơ bản

### 13.2. Areas for Improvement

- ⚠️ **Error Boundaries**: Chưa có React Error Boundaries
- ⚠️ **Error Logging**: Chưa có error logging system
- ⚠️ **Graceful Degradation**: Chưa handle localStorage errors

## 14. TESTING ARCHITECTURE (Not Implemented)

### 14.1. Recommended Structure

```
tests/
├── unit/
│   ├── stores/
│   └── utils/
├── components/
├── pages/
└── e2e/
```

### 14.2. Testing Tools

- **Vitest**: Unit tests (Vite-native)
- **React Testing Library**: Component tests
- **Playwright**: E2E tests

## 15. DEPLOYMENT ARCHITECTURE

### 15.1. Static Hosting

Ứng dụng là **static site**, có thể deploy lên:
- Vercel
- Netlify
- GitHub Pages
- Any static hosting

### 15.2. Build Output

```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   └── index-[hash].css
└── ...
```

## 16. FUTURE ARCHITECTURE CONSIDERATIONS

### 16.1. Backend Integration

Nếu nâng cấp lên full SaaS:

```
Current (Client Only)
    │
    ▼
Future (Client + Backend)
    │
    ├── Frontend (React)
    │   └── API Client
    │
    └── Backend
        ├── REST API / GraphQL
        ├── Database (PostgreSQL/MongoDB)
        ├── Authentication (JWT)
        └── File Storage (S3)
```

### 16.2. Microservices Potential

- **Auth Service**: User authentication
- **Prompt Service**: CRUD prompts
- **Category Service**: Category management
- **Sync Service**: Multi-device sync

---

## TÓM TẮT

PromptVault được xây dựng với kiến trúc **simple, clean, và maintainable**:

✅ **Client-Side Only**: Không phụ thuộc backend  
✅ **State-Driven**: Zustand quản lý toàn bộ state  
✅ **Component-Based**: React components tái sử dụng  
✅ **Type-Safe**: TypeScript đảm bảo type safety  
✅ **Offline-First**: Hoạt động hoàn toàn offline  

Kiến trúc này phù hợp cho mini-SaaS và có thể mở rộng thành full SaaS khi cần.

---

**Xem thêm:**
- [STATE_MANAGEMENT.md](./STATE_MANAGEMENT.md) - Chi tiết về stores
- [COMPONENTS.md](./COMPONENTS.md) - Chi tiết về components
- [PAGES.md](./PAGES.md) - Chi tiết về pages
- [ROADMAP.md](./ROADMAP.md) - Roadmap phát triển và kế hoạch tương lai