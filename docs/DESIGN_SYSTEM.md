# 🎨 DESIGN SYSTEM

## 1. TỔNG QUAN

PromptVault sử dụng **Tailwind CSS** với utility-first approach. Không có file CSS riêng, tất cả styling được thực hiện qua Tailwind classes.

## 2. COLOR SYSTEM

### 2.1. Primary Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Primary 600 | `#3b82f6` | Main brand color, buttons, links |
| Primary 700 | `#2563eb` | Hover states |
| Primary 800 | `#1e40af` | Darker variants |
| Primary 50 | `#eff6ff` | Light backgrounds |
| Primary 100 | `#dbeafe` | Avatar backgrounds |

### 2.2. Semantic Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Success | `#10b981` | Success states, Writing category |
| Warning | `#f59e0b` | Warning states, Marketing category |
| Danger | `#ef4444` | Delete actions, errors |
| Info | `#3b82f6` | Information (same as primary) |

### 2.3. Category Colors

| Category | Hex | Tailwind Class |
|----------|-----|----------------|
| Coding | `#3b82f6` | `blue-500` |
| Writing | `#10b981` | `green-500` |
| Marketing | `#f59e0b` | `orange-500` |
| Productivity | `#8b5cf6` | `purple-500` |

### 2.4. Gray Scale

**Light Mode**:
- `gray-50`: Lightest backgrounds
- `gray-100`: Borders, dividers
- `gray-200`: Subtle borders
- `gray-300`: Input borders
- `gray-400`: Icons, disabled text
- `gray-500`: Secondary text
- `gray-600`: Body text
- `gray-700`: Headings
- `gray-800`: Dark backgrounds
- `gray-900`: Darkest backgrounds

**Dark Mode**:
- Invert gray scale
- `dark:bg-gray-900`: Main background
- `dark:bg-gray-800`: Card backgrounds
- `dark:text-gray-100`: Primary text
- `dark:text-gray-300`: Secondary text

## 3. TYPOGRAPHY

### 3.1. Font Family

```css
font-sans  /* System font stack */
```

Default: System sans-serif fonts (Arial, Helvetica, etc.)

### 3.2. Font Sizes

| Size | Class | Usage |
|------|-------|-------|
| 3xl | `text-3xl` | Hero headings |
| 2xl | `text-2xl` | Page titles |
| xl | `text-xl` | Section headings |
| lg | `text-lg` | Large body text |
| base | `text-base` | Default body text |
| sm | `text-sm` | Small text, descriptions |
| xs | `text-xs` | Tiny text, labels |

### 3.3. Font Weights

| Weight | Class | Usage |
|--------|-------|-------|
| Extrabold | `font-extrabold` | Hero headings |
| Bold | `font-bold` | Page titles, card titles |
| Semibold | `font-semibold` | Section headings |
| Medium | `font-medium` | Buttons, labels |
| Regular | (default) | Body text |

### 3.4. Line Heights

- `leading-tight`: Headings
- `leading-relaxed`: Body text
- `leading-normal`: Default

### 3.5. Text Utilities

```typescript
// Truncate
className="truncate"  // Single line with ellipsis
className="line-clamp-1"  // Max 1 line
className="line-clamp-3"  // Max 3 lines

// Text alignment
className="text-center"
className="text-left"
className="text-right"
```

## 4. SPACING SYSTEM

### 4.1. Spacing Scale

Tailwind default scale (4px base):

| Size | Value | Class | Usage |
|------|-------|-------|-------|
| 1 | 4px | `p-1`, `m-1` | Tight spacing |
| 2 | 8px | `p-2`, `m-2` | Small spacing |
| 3 | 12px | `p-3`, `m-3` | Medium spacing |
| 4 | 16px | `p-4`, `m-4` | Default spacing |
| 5 | 20px | `p-5`, `m-5` | Large spacing |
| 6 | 24px | `p-6`, `m-6` | Extra large |
| 8 | 32px | `p-8`, `m-8` | Section spacing |

### 4.2. Common Patterns

```typescript
// Card padding
className="p-5"  // PromptCard
className="p-6"  // Forms, modals

// Section spacing
className="space-y-6"  // Vertical spacing between children
className="space-x-4"  // Horizontal spacing

// Container padding
className="px-4 sm:px-6 lg:px-8"  // Responsive horizontal padding
className="py-8"  // Vertical padding
```

## 5. LAYOUT SYSTEM

### 5.1. Container

```typescript
// Main container
className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"

// Page container
className="space-y-8 pb-10 px-4 sm:px-0"
```

### 5.2. Grid System

```typescript
// Responsive grid
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"

// Single column
className="grid grid-cols-1 gap-4"

// Flex layouts
className="flex flex-col sm:flex-row gap-4"
```

### 5.3. Flexbox Patterns

```typescript
// Center content
className="flex items-center justify-center"

// Space between
className="flex justify-between items-center"

// Vertical stack
className="flex flex-col space-y-4"
```

## 6. COMPONENT STYLES

### 6.1. Cards

```typescript
// Card base
className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-700 transition-all duration-200"

// Card variants
// - Rounded: rounded-2xl (16px)
// - Shadow: shadow-sm (subtle), shadow-md (hover)
// - Border: border-gray-100 (light), border-gray-700 (dark)
```

### 6.2. Buttons

#### 6.2.1. Primary Button

```typescript
className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
```

#### 6.2.2. Secondary Button

```typescript
className="px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-lg text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
```

#### 6.2.3. Danger Button

```typescript
className="px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-red-700 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
```

#### 6.2.4. Icon Button

```typescript
className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
```

### 6.3. Inputs

```typescript
// Text input
className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-900 dark:text-white px-3 py-2 border"

// Textarea
className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-900 dark:text-white px-3 py-2 border font-mono text-sm"

// Select
className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-lg dark:bg-gray-800 dark:text-white"
```

### 6.4. Modals

```typescript
// Modal overlay
className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"

// Backdrop
className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"

// Modal container
className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
```

### 6.5. Badges

```typescript
// Category badge
className="text-xs font-semibold px-2 py-1 rounded-full text-white"
style={{ backgroundColor: category?.color || '#94a3b8' }}

// Tag badge
className="flex items-center px-2.5 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium"
```

## 7. DARK MODE

### 7.1. Implementation

Dark mode được quản lý bằng class trên `<html>`:

```typescript
useEffect(() => {
  if (darkMode) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}, [darkMode]);
```

### 7.2. Dark Mode Classes

```typescript
// Backgrounds
className="bg-white dark:bg-gray-800"
className="bg-gray-50 dark:bg-gray-900"

// Text
className="text-gray-900 dark:text-white"
className="text-gray-600 dark:text-gray-300"

// Borders
className="border-gray-200 dark:border-gray-700"
className="border-gray-300 dark:border-gray-600"
```

### 7.3. Dark Mode Patterns

Luôn cung cấp cả light và dark variants:

```typescript
// ✅ Good
className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white"

// ❌ Bad
className="bg-white text-gray-900"  // Missing dark variants
```

## 8. RESPONSIVE DESIGN

### 8.1. Breakpoints

| Breakpoint | Min Width | Class Prefix |
|------------|-----------|--------------|
| sm | 640px | `sm:` |
| md | 768px | `md:` |
| lg | 1024px | `lg:` |
| xl | 1280px | `xl:` |

### 8.2. Mobile-First Approach

```typescript
// Mobile first, then add larger breakpoints
className="flex flex-col sm:flex-row"
className="text-sm sm:text-base"
className="px-4 sm:px-6 lg:px-8"
```

### 8.3. Common Responsive Patterns

```typescript
// Grid
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"

// Flex direction
className="flex flex-col sm:flex-row"

// Spacing
className="space-y-4 sm:space-y-0 sm:space-x-4"

// Visibility
className="hidden sm:flex"  // Hide on mobile, show on desktop
className="flex sm:hidden"  // Show on mobile, hide on desktop
```

## 9. ANIMATIONS & TRANSITIONS

### 9.1. Transitions

```typescript
// Basic transition
className="transition-colors duration-200"

// Multiple properties
className="transition-all duration-200"

// Hover effects
className="hover:shadow-md transition-shadow duration-200"
```

### 9.2. Custom Animations

**File**: `App.tsx`

```typescript
<style>{`
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes slideInUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
`}</style>
```

**Usage**:
```typescript
className="animate-[fadeIn_0.3s_ease-out]"
className="animate-[slideInUp_0.3s_ease-out]"
```

### 9.3. Hover Effects

```typescript
// Card hover
className="hover:shadow-md"

// Button hover
className="hover:bg-primary-700"

// Scale on hover
className="hover:scale-105 transition-transform"
```

## 10. ICONS

### 10.1. Icon Library

**Lucide React** - Icon library

### 10.2. Icon Sizes

| Size | Class | Usage |
|------|-------|-------|
| Small | `w-3 h-3` | Inline with text |
| Default | `w-4 h-4` | Buttons, cards |
| Medium | `w-5 h-5` | Headers, larger buttons |
| Large | `w-6 h-6` | Page titles |

### 10.3. Icon Patterns

```typescript
// Icon with text
<>
  <Icon className="w-4 h-4 mr-2" />
  <span>Text</span>
</>

// Icon button
<button>
  <Icon className="w-5 h-5" />
</button>
```

## 11. Z-INDEX SCALE

| Layer | z-index | Usage |
|-------|---------|-------|
| Base | 0 | Default |
| Header | 50 | `z-50` |
| Modal | 100 | `z-[100]` |
| Toast | 200 | `z-[200]` |

## 12. SHADOWS

| Shadow | Class | Usage |
|--------|-------|-------|
| None | `shadow-none` | Default |
| Small | `shadow-sm` | Cards |
| Medium | `shadow-md` | Hover states, modals |
| Large | `shadow-lg` | Elevated elements |
| XL | `shadow-xl` | Modals |

## 13. BORDERS

### 13.1. Border Radius

| Radius | Class | Usage |
|--------|-------|-------|
| Small | `rounded-md` | Inputs, buttons |
| Medium | `rounded-lg` | Buttons, badges |
| Large | `rounded-xl` | Cards, sections |
| Extra Large | `rounded-2xl` | Main cards, modals |
| Full | `rounded-full` | Avatars, icon buttons |

### 13.2. Border Width

```typescript
className="border"  // 1px
className="border-2"  // 2px
```

### 13.3. Border Colors

```typescript
className="border-gray-200 dark:border-gray-700"  // Subtle
className="border-gray-300 dark:border-gray-600"  // Default
className="border-primary-500"  // Focus states
```

## 14. ACCESSIBILITY

### 14.1. Focus States

```typescript
className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
```

### 14.2. Semantic HTML

- Use proper heading hierarchy (`h1`, `h2`, `h3`)
- Use semantic elements (`button`, `nav`, `main`, `section`)
- Use `label` for form inputs

### 14.3. ARIA (Future)

Có thể thêm:
- `aria-label` cho icon buttons
- `aria-describedby` cho form inputs
- `role` attributes khi cần

## 15. DESIGN TOKENS

### 15.1. Spacing Tokens

```typescript
const spacing = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
};
```

### 15.2. Color Tokens

```typescript
const colors = {
  primary: '#3b82f6',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
};
```

## 16. BEST PRACTICES

### 16.1. Consistency

- ✅ Luôn cung cấp dark mode variants
- ✅ Sử dụng consistent spacing scale
- ✅ Sử dụng consistent border radius
- ✅ Sử dụng consistent shadows

### 16.2. Responsive

- ✅ Mobile-first approach
- ✅ Test trên các breakpoints
- ✅ Hide/show elements appropriately

### 16.3. Performance

- ✅ Sử dụng transitions thay vì animations khi có thể
- ✅ Tránh quá nhiều shadows phức tạp
- ✅ Optimize images (nếu có)

---

## TÓM TẮT

PromptVault design system:

- ✅ **Tailwind CSS**: Utility-first
- ✅ **Dark Mode**: Full support
- ✅ **Responsive**: Mobile-first
- ✅ **Consistent**: Spacing, colors, typography
- ✅ **Accessible**: Focus states, semantic HTML

---

**Xem thêm:**
- [COMPONENTS.md](./COMPONENTS.md) - Component implementations
- [PAGES.md](./PAGES.md) - Page layouts
