# 📋 KẾ HOẠCH TRIỂN KHAI FIREBASE AUTHENTICATION

## TỔNG QUAN

Kế hoạch chi tiết để tích hợp Firebase Authentication vào PromptVault với approval workflow.

---

## 🎯 MỤC TIÊU

1. ✅ Setup Firebase project và services
2. ✅ Implement authentication (register/login/logout)
3. ✅ Implement user approval workflow
4. ✅ Implement access control
5. ✅ Create admin panel
6. ✅ Create login/pending/access denied pages

---

## 📋 TRÌNH TỰ THỰC HIỆN

### PHASE 1: FIREBASE SETUP (30-45 phút)

#### Bước 1.1: Tạo Firebase Project
- [ ] Tạo project trên Firebase Console
- [ ] Copy Firebase config
- [ ] Lưu config để dùng sau

**Thời gian**: 10 phút

#### Bước 1.2: Enable Authentication
- [ ] Enable Email/Password authentication
- [ ] (Optional) Enable Google sign-in
- [ ] Cấu hình Authorized domains

**Thời gian**: 5 phút

#### Bước 1.3: Setup Firestore
- [ ] Create Firestore database
- [ ] Chọn location
- [ ] Tạo collections structure
- [ ] Setup Security Rules

**Thời gian**: 15-20 phút

#### Bước 1.4: Install Dependencies
- [ ] Run `npm install firebase`
- [ ] Verify installation

**Thời gian**: 2 phút

---

### PHASE 2: PROJECT CONFIGURATION (30-45 phút)

#### Bước 2.1: Environment Variables
- [ ] Tạo/update `.env.local`
- [ ] Add Firebase config variables
- [ ] Verify `.env.local` trong `.gitignore`

**Thời gian**: 5 phút

#### Bước 2.2: Create Firebase Service
- [ ] Tạo folder `services/`
- [ ] Tạo `services/firebase.ts`
- [ ] Initialize Firebase app
- [ ] Export auth và db instances

**Thời gian**: 10 phút

#### Bước 2.3: Update Vite Config (nếu cần)
- [ ] Verify env variables được load đúng
- [ ] Test với `console.log(import.meta.env.VITE_FIREBASE_API_KEY)`

**Thời gian**: 5 phút

---

### PHASE 3: DATA MODEL & TYPES (1 giờ)

#### Bước 3.1: Update Types
- [ ] File: `types.ts`
- [ ] Add `UserStatus` type
- [ ] Add `UserRole` type
- [ ] Add `UserProfile` interface
- [ ] Update existing `User` interface (nếu cần)

**Thời gian**: 20 phút

#### Bước 3.2: Create Auth Service
- [ ] Tạo `services/authService.ts`
- [ ] Implement `registerUser()`
- [ ] Implement `loginUser()`
- [ ] Implement `logoutUser()`
- [ ] Implement `getCurrentUserProfile()`
- [ ] Implement `isUserApproved()`
- [ ] Implement `getAllUsers()`
- [ ] Implement `getPendingUsers()`
- [ ] Implement `approveUser()`
- [ ] Implement `rejectUser()`
- [ ] Implement `onAuthStateChange()`

**Thời gian**: 40 phút

---

### PHASE 4: AUTH STORE (1-1.5 giờ)

#### Bước 4.1: Create Auth Store
- [ ] File: `store.ts`
- [ ] Add `AuthState` interface
- [ ] Create `useAuthStore`
- [ ] Implement state management
- [ ] Implement actions
- [ ] Setup auth state listener

**Thời gian**: 1-1.5 giờ

---

### PHASE 5: ACCESS CONTROL (1-1.5 giờ)

#### Bước 5.1: Create Loading Screen
- [ ] Tạo `components/LoadingScreen.tsx`
- [ ] Design loading UI
- [ ] Add spinner/loading indicator

**Thời gian**: 20 phút

#### Bước 5.2: Create Pending Screen
- [ ] Tạo `pages/Pending.tsx`
- [ ] Design pending UI
- [ ] Show user info
- [ ] Add logout button

**Thời gian**: 30 phút

#### Bước 5.3: Create Access Denied Screen
- [ ] Tạo `pages/AccessDenied.tsx`
- [ ] Design access denied UI
- [ ] Show message
- [ ] Add logout button

**Thời gian**: 20 phút

#### Bước 5.4: Update App.tsx
- [ ] Add access control logic
- [ ] Check authentication state
- [ ] Check user approval status
- [ ] Render appropriate screen
- [ ] Handle loading states

**Thời gian**: 20 phút

---

### PHASE 6: LOGIN/REGISTER PAGE (2-3 giờ)

#### Bước 6.1: Create Login Page
- [ ] Tạo `pages/Login.tsx`
- [ ] Design login form
- [ ] Add email/password fields
- [ ] Add register/login toggle
- [ ] Implement form validation
- [ ] Connect to auth service
- [ ] Add error handling
- [ ] Add loading states
- [ ] Style với Tailwind

**Thời gian**: 2-3 giờ

---

### PHASE 7: ADMIN PANEL (3-4 giờ)

#### Bước 7.1: Create Admin Page
- [ ] Tạo `pages/Admin.tsx`
- [ ] Design admin panel layout
- [ ] Add user list
- [ ] Add filters (pending/approved/rejected)
- [ ] Add search functionality
- [ ] Add approve/reject buttons
- [ ] Add user details view
- [ ] Connect to auth service
- [ ] Add error handling
- [ ] Style với Tailwind

**Thời gian**: 3-4 giờ

#### Bước 7.2: Add Admin Route
- [ ] Update `types.ts` - Add 'ADMIN' to ViewName
- [ ] Update `App.tsx` - Add admin route
- [ ] Update `Header.tsx` - Add admin link (chỉ hiện cho admin)

**Thời gian**: 30 phút

---

### PHASE 8: UPDATE EXISTING COMPONENTS (1-2 giờ)

#### Bước 8.1: Update Header
- [ ] Add logout button
- [ ] Show user email/name
- [ ] Add admin link (nếu là admin)
- [ ] Update user avatar với Firebase user

**Thời gian**: 30 phút

#### Bước 8.2: Update User Page
- [ ] Update với Firebase user data
- [ ] Show user profile từ Firestore
- [ ] Remove local user management (nếu có)

**Thời gian**: 30 phút

#### Bước 8.3: Update Other Pages
- [ ] Update pages để sử dụng Firebase user
- [ ] Remove dependencies từ old UserStore (nếu cần)
- [ ] Test tất cả pages

**Thời gian**: 1 giờ

---

### PHASE 9: SETUP ADMIN USER (15 phút)

#### Bước 9.1: Create Admin in Firebase
- [ ] Tạo admin user trong Authentication
- [ ] Copy User UID
- [ ] Tạo admin document trong Firestore
- [ ] Set role = 'admin', status = 'approved'

**Thời gian**: 15 phút

---

### PHASE 10: TESTING (2-3 giờ)

#### Bước 10.1: Test Authentication
- [ ] Test user registration
- [ ] Test user login
- [ ] Test logout
- [ ] Test error handling

**Thời gian**: 30 phút

#### Bước 10.2: Test Approval Workflow
- [ ] Register new user
- [ ] Login as admin
- [ ] Approve user
- [ ] Verify user can access app
- [ ] Test reject user
- [ ] Verify rejected user cannot access

**Thời gian**: 30 phút

#### Bước 10.3: Test Access Control
- [ ] Test pending user sees pending screen
- [ ] Test approved user sees app
- [ ] Test rejected user sees access denied
- [ ] Test admin can access admin panel

**Thời gian**: 30 phút

#### Bước 10.4: Integration Testing
- [ ] Test all pages với Firebase auth
- [ ] Test prompts CRUD với Firebase user
- [ ] Test categories với Firebase user
- [ ] Test export/import với Firebase user

**Thời gian**: 1-1.5 giờ

---

## 📊 TỔNG KẾT THỜI GIAN

| Phase | Thời Gian |
|-------|-----------|
| Phase 1: Firebase Setup | 30-45 phút |
| Phase 2: Project Configuration | 30-45 phút |
| Phase 3: Data Model & Types | 1 giờ |
| Phase 4: Auth Store | 1-1.5 giờ |
| Phase 5: Access Control | 1-1.5 giờ |
| Phase 6: Login/Register | 2-3 giờ |
| Phase 7: Admin Panel | 3-4 giờ |
| Phase 8: Update Components | 1-2 giờ |
| Phase 9: Setup Admin | 15 phút |
| Phase 10: Testing | 2-3 giờ |
| **TỔNG CỘNG** | **12-18 giờ** |

---

## 📁 FILES CẦN TẠO

### New Files
1. `services/firebase.ts` - Firebase initialization
2. `services/authService.ts` - Authentication service
3. `pages/Login.tsx` - Login/Register page
4. `pages/Admin.tsx` - Admin panel
5. `pages/Pending.tsx` - Pending approval screen
6. `pages/AccessDenied.tsx` - Access denied screen
7. `components/LoadingScreen.tsx` - Loading screen
8. `.env.local` - Environment variables (nếu chưa có)

### Files Cần Update
1. `types.ts` - Add new types
2. `store.ts` - Add AuthStore
3. `App.tsx` - Add access control
4. `components/Header.tsx` - Add logout, admin link
5. `pages/User.tsx` - Update với Firebase user
6. `vite.config.ts` - Verify env config (nếu cần)

---

## 🔐 SECURITY CHECKLIST

### Firebase Configuration
- [ ] Firebase config trong `.env.local` (không commit)
- [ ] `.env.local` trong `.gitignore`
- [ ] Authorized domains configured
- [ ] Firestore Security Rules setup

### Authentication
- [ ] Password validation (min length, complexity)
- [ ] Error messages không expose sensitive info
- [ ] Auth state persistence
- [ ] Logout clears all data

### Access Control
- [ ] Check user status on every route
- [ ] Admin routes protected
- [ ] Firestore rules enforce permissions

---

## 🧪 TESTING CHECKLIST

### Authentication
- [ ] Register new user → Status pending
- [ ] Login với valid credentials → Success
- [ ] Login với invalid credentials → Error
- [ ] Logout → Clears auth state

### Approval Workflow
- [ ] Admin approve user → User can access
- [ ] Admin reject user → User cannot access
- [ ] Pending user → Sees pending screen
- [ ] Approved user → Sees app
- [ ] Rejected user → Sees access denied

### Access Control
- [ ] Unauthenticated → Redirect to login
- [ ] Pending user → Pending screen
- [ ] Approved user → Full access
- [ ] Rejected user → Access denied
- [ ] Admin → Can access admin panel

### Integration
- [ ] All pages work với Firebase auth
- [ ] User data sync với Firestore
- [ ] Prompts CRUD works
- [ ] Categories CRUD works

---

## 🚨 COMMON ISSUES & SOLUTIONS

### Issue 1: "Firebase: Error (auth/unauthorized-domain)"
**Solution**: Add domain to Authorized domains trong Firebase Console

### Issue 2: "Firestore permission denied"
**Solution**: Check Security Rules, verify user role

### Issue 3: "Environment variables not loading"
**Solution**: 
- Check `.env.local` exists
- Verify variable names start with `VITE_`
- Restart dev server

### Issue 4: "Auth state not persisting"
**Solution**: 
- Check `onAuthStateChange` listener
- Verify Firebase persistence enabled

---

## 📝 NOTES

### Important Considerations

1. **Environment Variables**:
   - Phải prefix với `VITE_` để Vite load
   - Không commit `.env.local`
   - Use different configs cho dev/prod

2. **Firestore Rules**:
   - Test rules với Rules Playground
   - Update rules cho production
   - Consider rate limiting

3. **User Migration**:
   - Existing users cần migrate
   - Create migration script
   - Preserve existing data

4. **Error Handling**:
   - Handle network errors
   - Handle auth errors gracefully
   - Show user-friendly messages

---

## 🎯 NEXT STEPS

Sau khi hoàn thành:

1. ✅ Test thoroughly
2. ✅ Update documentation
3. ✅ Deploy và test production
4. ✅ Monitor Firebase usage
5. ✅ Setup email notifications (optional)
6. ✅ Add audit logging (optional)

---

**Tài liệu này cung cấp kế hoạch chi tiết để triển khai Firebase Authentication.**

**Ngày tạo**: 2024  
**Phiên bản**: 1.0
