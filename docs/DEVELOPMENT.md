# 💻 DEVELOPMENT GUIDE

## 1. TỔNG QUAN

Hướng dẫn setup, development workflow, và best practices cho PromptVault.

## 2. PREREQUISITES

### 2.1. Required Software

- **Node.js**: v18+ (recommended: v20+)
- **npm**: v9+ (hoặc yarn/pnpm)
- **Git**: For version control

### 2.2. Recommended Tools

- **VS Code**: Code editor
- **VS Code Extensions**:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - TypeScript and JavaScript Language Features

## 3. PROJECT SETUP

### 3.1. Clone Repository

```bash
git clone <repository-url>
cd NCH_PromptManager
```

### 3.2. Install Dependencies

```bash
npm install
```

### 3.3. Environment Setup

Tạo file `.env.local` (nếu cần):

```env
GEMINI_API_KEY=your_api_key_here
```

**Lưu ý**: Hiện tại API key chưa được sử dụng trong code.

### 3.4. Start Development Server

```bash
npm run dev
```

Server sẽ chạy tại: `http://localhost:3000`

## 4. PROJECT STRUCTURE

```
PromptVault/
├── App.tsx                 # Root component
├── index.tsx               # Entry point
├── store.ts                # Zustand stores
├── types.ts                # TypeScript types
├── vite.config.ts          # Vite config
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript config
├── metadata.json           # App metadata
│
├── components/             # Reusable components
│   ├── Header.tsx
│   ├── PromptCard.tsx
│   └── PromptModal.tsx
│
├── pages/                  # Page components
│   ├── Home.tsx
│   ├── Library.tsx
│   ├── MyPrompts.tsx
│   ├── Categories.tsx
│   ├── Settings.tsx
│   └── User.tsx
│
└── docs/                   # Documentation
    ├── README.md
    ├── ARCHITECTURE.md
    └── ...
```

## 5. DEVELOPMENT WORKFLOW

### 5.1. Making Changes

1. **Create Feature Branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**:
   - Edit files
   - Test locally
   - Check for TypeScript errors

3. **Commit Changes**:
   ```bash
   git add .
   git commit -m "feat: description of changes"
   ```

4. **Push and Create PR**:
   ```bash
   git push origin feature/your-feature-name
   ```

### 5.2. Code Style

#### 5.2.1. TypeScript

- ✅ Use TypeScript for all files
- ✅ Define interfaces/types in `types.ts`
- ✅ Use type annotations for function parameters
- ✅ Avoid `any` type

#### 5.2.2. React

- ✅ Use functional components
- ✅ Use hooks (useState, useEffect, useMemo)
- ✅ Extract reusable logic into custom hooks (nếu cần)

#### 5.2.3. Naming Conventions

- **Components**: PascalCase (`PromptCard.tsx`)
- **Functions**: camelCase (`handleSubmit`)
- **Constants**: UPPER_SNAKE_CASE hoặc camelCase
- **Types/Interfaces**: PascalCase (`Prompt`, `Category`)

### 5.3. File Organization

- **Components**: Một component per file
- **Pages**: Một page per file
- **Stores**: Tất cả stores trong `store.ts`
- **Types**: Tất cả types trong `types.ts`

## 6. STATE MANAGEMENT

### 6.1. Using Stores

```typescript
// Get state
const { prompts } = usePromptStore();

// Get actions
const { addPrompt } = usePromptStore();

// Selective subscription
const prompts = usePromptStore(state => state.prompts);
```

### 6.2. Adding New Store

1. Define interface trong `store.ts`
2. Create store với `create()`
3. Add persist middleware
4. Export hook

Xem [STATE_MANAGEMENT.md](./STATE_MANAGEMENT.md) để biết chi tiết.

## 7. ADDING NEW FEATURES

### 7.1. Adding New Page

1. **Create Page Component**:
   ```typescript
   // pages/NewPage.tsx
   import React from 'react';
   
   const NewPage = () => {
     return <div>New Page</div>;
   };
   
   export default NewPage;
   ```

2. **Add View Type**:
   ```typescript
   // types.ts
   export type ViewName = 
     | 'HOME' 
     | 'LIBRARY' 
     | 'NEW_PAGE';  // Add new
   ```

3. **Add to Router**:
   ```typescript
   // App.tsx
   import NewPage from './pages/NewPage';
   
   const renderView = () => {
     switch (currentView) {
       case 'NEW_PAGE': return <NewPage />;
       // ...
     }
   };
   ```

4. **Add Navigation**:
   ```typescript
   // components/Header.tsx
   const navItems = [
     // ...
     { view: 'NEW_PAGE', label: 'New Page', icon: Icon },
   ];
   ```

### 7.2. Adding New Component

1. **Create Component File**:
   ```typescript
   // components/NewComponent.tsx
   import React from 'react';
   
   interface NewComponentProps {
     // props
   }
   
   const NewComponent: React.FC<NewComponentProps> = ({ ... }) => {
     return <div>Component</div>;
   };
   
   export default NewComponent;
   ```

2. **Use in Pages/Components**:
   ```typescript
   import NewComponent from '../components/NewComponent';
   ```

### 7.3. Adding New Store Action

1. **Update Interface**:
   ```typescript
   interface PromptState {
     // ...
     newAction: (param: string) => void;
   }
   ```

2. **Implement Action**:
   ```typescript
   export const usePromptStore = create<PromptState>()(
     persist(
       (set) => ({
         // ...
         newAction: (param) => set((state) => {
           // Update logic
           return { ...state, /* updates */ };
         }),
       }),
       // ...
     )
   );
   ```

## 8. DEBUGGING

### 8.1. TypeScript Errors

```bash
# Check TypeScript errors
npx tsc --noEmit
```

### 8.2. React DevTools

- Install React DevTools browser extension
- Inspect components, props, state

### 8.3. Zustand DevTools

Có thể thêm Zustand DevTools:

```typescript
import { devtools } from 'zustand/middleware';

export const usePromptStore = create<PromptState>()(
  devtools(
    persist(
      // ...
    ),
    { name: 'PromptStore' }
  )
);
```

### 8.4. Console Logging

```typescript
// Debug store state
console.log(usePromptStore.getState());

// Debug component props
console.log('Props:', props);
```

### 8.5. LocalStorage Inspection

```javascript
// In browser console
localStorage.getItem('promptvault-prompts');
JSON.parse(localStorage.getItem('promptvault-prompts'));
```

## 9. TESTING (Future)

### 9.1. Unit Tests

```typescript
// tests/stores/promptStore.test.ts
import { renderHook, act } from '@testing-library/react';
import { usePromptStore } from '../../store';

test('addPrompt adds new prompt', () => {
  const { result } = renderHook(() => usePromptStore());
  
  act(() => {
    result.current.addPrompt({ /* ... */ });
  });
  
  expect(result.current.prompts).toHaveLength(1);
});
```

### 9.2. Component Tests

```typescript
// tests/components/PromptCard.test.tsx
import { render, screen } from '@testing-library/react';
import PromptCard from '../../components/PromptCard';

test('renders prompt title', () => {
  render(<PromptCard prompt={mockPrompt} onClick={() => {}} />);
  expect(screen.getByText('Test Title')).toBeInTheDocument();
});
```

### 9.3. E2E Tests

```typescript
// tests/e2e/create-prompt.spec.ts
import { test, expect } from '@playwright/test';

test('create new prompt', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.click('text=My Prompts');
  await page.click('text=New Prompt');
  await page.fill('input[name="title"]', 'Test Prompt');
  await page.fill('textarea[name="content"]', 'Test Content');
  await page.click('text=Save Prompt');
  await expect(page.locator('text=Test Prompt')).toBeVisible();
});
```

## 10. BUILD & DEPLOYMENT

### 10.1. Build for Production

```bash
npm run build
```

Output: `dist/` folder

### 10.2. Preview Production Build

```bash
npm run preview
```

### 10.3. Deploy

Deploy `dist/` folder lên static hosting:
- Vercel
- Netlify
- GitHub Pages
- Any static hosting

Xem [DEPLOYMENT.md](./DEPLOYMENT.md) để biết chi tiết.

## 11. COMMON ISSUES & SOLUTIONS

### 11.1. TypeScript Errors

**Issue**: Type errors sau khi thay đổi types

**Solution**:
```bash
# Restart TypeScript server in VS Code
# Or
npm run build  # Check errors
```

### 11.2. Store Not Updating

**Issue**: Component không re-render khi store thay đổi

**Solution**:
- Check nếu đang subscribe đúng store
- Check nếu action được gọi đúng
- Check nếu có selective subscription issues

### 11.3. LocalStorage Not Persisting

**Issue**: Data không lưu vào localStorage

**Solution**:
- Check browser localStorage quota
- Check nếu persist middleware được config đúng
- Check storage key name

### 11.4. Dark Mode Not Working

**Issue**: Dark mode không apply

**Solution**:
- Check nếu `darkMode` state được update
- Check nếu `useEffect` trong App.tsx chạy
- Check nếu Tailwind dark mode config đúng

## 12. PERFORMANCE OPTIMIZATION

### 12.1. Selective Store Subscriptions

```typescript
// ❌ Bad: Subscribe to entire store
const store = usePromptStore();

// ✅ Good: Subscribe only to needed state
const prompts = usePromptStore(state => state.prompts);
```

### 12.2. Memoization

```typescript
// Memoize computed values
const filtered = useMemo(
  () => prompts.filter(/* ... */),
  [prompts, filter]
);
```

### 12.3. Component Memoization

```typescript
// Memoize expensive components
const MemoizedCard = React.memo(PromptCard);
```

## 13. CODE REVIEW CHECKLIST

Khi review code, check:

- ✅ TypeScript types đầy đủ
- ✅ Dark mode variants có đủ
- ✅ Responsive design (mobile/tablet/desktop)
- ✅ Toast notifications cho actions
- ✅ Error handling
- ✅ Code comments cho logic phức tạp
- ✅ Consistent naming conventions
- ✅ No console.logs trong production code

## 14. GIT WORKFLOW

### 14.1. Commit Messages

Sử dụng conventional commits:

```
feat: add new feature
fix: fix bug
docs: update documentation
style: formatting changes
refactor: code refactoring
test: add tests
chore: maintenance tasks
```

### 14.2. Branch Naming

```
feature/feature-name
fix/bug-description
docs/update-readme
refactor/component-name
```

## 15. DEPENDENCIES MANAGEMENT

### 15.1. Adding Dependencies

```bash
npm install package-name
```

### 15.2. Updating Dependencies

```bash
npm update
```

### 15.3. Security Audits

```bash
npm audit
npm audit fix
```

## 16. DOCUMENTATION

### 16.1. Code Comments

```typescript
// Good: Explain why, not what
// Filter out prompts that don't match search term
const filtered = prompts.filter(/* ... */);

// Bad: Obvious comment
// Set title to new title
setTitle(newTitle);
```

### 16.2. Update Documentation

Khi thay đổi code, cập nhật:
- [API_REFERENCE.md](./API_REFERENCE.md) - Nếu thay đổi APIs
- [COMPONENTS.md](./COMPONENTS.md) - Nếu thay đổi components
- [PAGES.md](./PAGES.md) - Nếu thay đổi pages
- [WORKFLOWS.md](./WORKFLOWS.md) - Nếu thay đổi workflows

---

## TÓM TẮT

Development workflow:

1. ✅ **Setup**: Install dependencies, start dev server
2. ✅ **Develop**: Make changes, test locally
3. ✅ **Build**: Build for production
4. ✅ **Deploy**: Deploy to hosting

Best practices:
- ✅ TypeScript types
- ✅ Consistent code style
- ✅ Performance optimization
- ✅ Documentation updates

---

**Xem thêm:**
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Kiến trúc
- [API_REFERENCE.md](./API_REFERENCE.md) - APIs
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment
- [ROADMAP.md](./ROADMAP.md) - Roadmap và kế hoạch phát triển