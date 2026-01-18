# 🔐 TÀI LIỆU PHÂN QUYỀN ADMIN PANEL VỚI FIREBASE

## TỔNG QUAN

Tài liệu này mô tả chi tiết hệ thống phân quyền và quản trị người dùng (Admin Panel) sử dụng Firebase Authentication và Firestore Database.

---

## 📋 MỤC LỤC

1. [Kiến trúc hệ thống](#kiến-trúc-hệ-thống)
2. [Cấu trúc dữ liệu Firestore](#cấu-trúc-dữ-liệu-firestore)
3. [Firestore Security Rules](#firestore-security-rules)
4. [Admin Panel Features](#admin-panel-features)
5. [User Approval Workflow](#user-approval-workflow)
6. [Real-time Updates](#real-time-updates)
7. [Code Implementation](#code-implementation)
8. [Testing Guide](#testing-guide)
9. [Troubleshooting](#troubleshooting)

---

## 🏗️ KIẾN TRÚC HỆ THỐNG

### Components

```
┌─────────────────────────────────────────────────┐
│           Firebase Authentication                │
│  (User accounts: email/password)                │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│         Firestore Database                      │
│  Collection: users/                            │
│  - Document ID: User UID                       │
│  - Fields: role, status, email, name, ...       │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│           React Application                     │
│  - Admin Panel (pages/Admin.tsx)               │
│  - Auth Store (store.ts)                        │
│  - Auth Service (services/authService.ts)      │
└─────────────────────────────────────────────────┘
```

### Flow

1. **User Registration**: User đăng ký → Tạo trong Firebase Auth → Tạo document trong Firestore với `role: 'user'`, `status: 'pending'`
2. **Admin Approval**: Admin approve/reject user → Update `status` trong Firestore
3. **Access Control**: App kiểm tra `role` và `status` để quyết định access
4. **Real-time Updates**: Firestore listeners tự động update UI khi có thay đổi

---

## 📊 CẤU TRÚC DỮ LIỆU FIRESTORE

### Collection: `users`

**Path**: `/users/{userId}`

**Document ID**: Firebase User UID (từ Firebase Authentication)

**Fields**:

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `id` | string | ✅ | User UID (giống Document ID) | `"vq9A2AgfurWeZji1mZKI4PAVG4e2"` |
| `email` | string | ✅ | User email | `"user@example.com"` |
| `name` | string | ✅ | User display name | `"John Doe"` |
| `role` | string | ✅ | User role: `'admin'` hoặc `'user'` | `"user"` |
| `status` | string | ✅ | Approval status: `'pending'`, `'approved'`, `'rejected'` | `"pending"` |
| `createdAt` | number | ✅ | Timestamp khi user được tạo | `1735689600000` |
| `avatarInitials` | string | ✅ | 2 chữ cái đầu của name | `"JD"` |
| `approvedAt` | number | ❌ | Timestamp khi user được approve | `1735776000000` |
| `approvedBy` | string | ❌ | UID của admin đã approve | `"admin-uid"` |

### Example Document

```json
{
  "id": "vq9A2AgfurWeZji1mZKI4PAVG4e2",
  "email": "admin@example.com",
  "name": "Admin User",
  "role": "admin",
  "status": "approved",
  "createdAt": 1735689600000,
  "avatarInitials": "AD"
}
```

```json
{
  "id": "Q403dzvJzAROD6qTtcAdQJe",
  "email": "user@example.com",
  "name": "Test User",
  "role": "user",
  "status": "pending",
  "createdAt": 1735689600000,
  "avatarInitials": "TU"
}
```

---

## 🔒 FIRESTORE SECURITY RULES

### Rules Configuration

**Location**: Firebase Console → Firestore Database → Rules

**Rules Code**:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function: Check if user is admin
    function isAdmin() {
      return request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Helper function: Check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Users collection
    match /users/{userId} {
      // 1. User can read their own data
      allow read: if isAuthenticated() && request.auth.uid == userId;
      
      // 2. Admin can read ALL users (for admin panel) - QUAN TRỌNG!
      allow read: if isAdmin();
      
      // 3. User can create their own profile (during registration)
      allow create: if isAuthenticated() && request.auth.uid == userId;
      
      // 4. User can update their own profile (limited fields)
      allow update: if isAuthenticated() && request.auth.uid == userId &&
        // Only allow updating name and avatarInitials
        request.resource.data.diff(resource.data).affectedKeys().hasOnly(['name', 'avatarInitials']);
      
      // 5. Admin can write (approve/reject users)
      allow write: if isAdmin();
    }
    
    // Admin settings - only admins can read/write
    match /adminSettings/{document=**} {
      allow read, write: if isAdmin();
    }
    
    // Prompts collection
    match /prompts/{promptId} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated();
    }
  }
}
```

### Rules Explanation

#### Helper Functions

**`isAdmin()`**:
- Kiểm tra user đã authenticated
- Kiểm tra user có document trong Firestore
- Kiểm tra `role == 'admin'`

**`isAuthenticated()`**:
- Kiểm tra user đã authenticated (có `request.auth.uid`)

#### Users Collection Rules

1. **Read Own Data**: User có thể đọc document của chính họ
2. **Admin Read All**: Admin có thể đọc **toàn bộ collection** (quan trọng cho Admin Panel)
3. **Create Own Profile**: User có thể tạo profile của chính họ (khi đăng ký)
4. **Update Own Profile**: User chỉ có thể update `name` và `avatarInitials`
5. **Admin Write**: Admin có thể approve/reject users

### Security Notes

- ✅ Users chỉ đọc được document của chính họ
- ✅ Admin mới đọc được tất cả users
- ✅ Users chỉ update được một số fields của chính họ
- ✅ Chỉ admin mới approve/reject users
- ✅ Rules được evaluate từ trên xuống dưới (first match wins)

---

## 🎛️ ADMIN PANEL FEATURES

### File: `pages/Admin.tsx`

### Features

1. **User Statistics**
   - Total Users
   - Pending Users
   - Approved Users
   - Rejected Users

2. **User Management**
   - View all users in table
   - Search by name or email
   - Filter by status (All, Pending, Approved, Rejected)
   - Sort by Name, Status, Created Date
   - Pagination (10 users per page)

3. **User Actions**
   - Approve user
   - Reject user
   - Custom confirmation modal
   - Rejection reason field (optional)

4. **Real-time Updates**
   - Automatic updates when users change
   - No manual refresh needed

5. **Loading States**
   - Loading spinner during actions
   - Disabled buttons during processing
   - Optimistic updates

6. **Error Handling**
   - Detailed error messages
   - Retry mechanism
   - Rollback on error

### Access Control

**Code**:

```typescript
// Check if user is admin
if (userProfile?.role !== 'admin') {
  return (
    <div className="text-center py-12">
      <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Access Denied
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        You need admin privileges to access this page.
      </p>
    </div>
  );
}
```

**Logic**:
- Kiểm tra `userProfile?.role === 'admin'`
- Nếu không phải admin → hiển thị "Access Denied"
- Nếu là admin → hiển thị Admin Panel

---

## 🔄 USER APPROVAL WORKFLOW

### Flow Diagram

```
┌─────────────┐
│ User đăng ký │
└──────┬──────┘
       │
       ▼
┌─────────────────────────┐
│ Firebase Authentication  │
│ (Tạo user account)      │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│ Firestore: users/       │
│ - role: "user"          │
│ - status: "pending"      │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│ App.tsx:                │
│ if (status === 'pending')│
│   → Show Pending Screen │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│ Admin Panel:            │
│ - Hiển thị user         │
│ - Status: Pending        │
│ - Buttons: Approve/Reject│
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│ Admin click Approve:    │
│ - Update status: "approved"│
│ - Set approvedAt        │
│ - Set approvedBy        │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│ Real-time Update:       │
│ - User tự động thấy     │
│   status mới            │
│ - App.tsx redirect      │
│   → Show App Content    │
└─────────────────────────┘
```

### Step-by-Step

#### 1. User Registration

**File**: `services/authService.ts`

```typescript
export const registerUser = async (
  email: string,
  password: string,
  name: string
): Promise<{ success: boolean; error?: string }> => {
  // Create Firebase auth user
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  const firebaseUser = userCredential.user;

  // Create user profile in Firestore
  const userProfile: UserProfile = {
    id: firebaseUser.uid,
    email: email,
    name: name,
    role: 'user',        // ✅ Tự động set role="user"
    status: 'pending',   // ✅ Tự động set status="pending"
    createdAt: Date.now(),
    avatarInitials: name.substring(0, 2).toUpperCase(),
  };

  await setDoc(doc(db, 'users', firebaseUser.uid), userProfile);
  return { success: true };
};
```

#### 2. User Sees Pending Screen

**File**: `App.tsx`

```typescript
// User not approved yet
if (userProfile?.status === 'pending') {
  return <Pending userProfile={userProfile} />;
}
```

#### 3. Admin Approves User

**File**: `pages/Admin.tsx`

```typescript
const handleApprove = async (userId: string) => {
  // Show confirmation modal
  // ... modal logic ...
  
  // Optimistic update
  setAllUsers(prev => prev.map(u => 
    u.id === userId 
      ? { ...u, status: 'approved' as UserStatus, approvedAt: Date.now() }
      : u
  ));

  // Update in Firestore
  await approveUser(userId);
};
```

**File**: `services/authService.ts`

```typescript
export const approveUser = async (
  userId: string,
  adminId: string
): Promise<{ success: boolean; error?: string }> => {
  await updateDoc(doc(db, 'users', userId), {
    status: 'approved',
    approvedAt: Date.now(),
    approvedBy: adminId,
  });
  return { success: true };
};
```

#### 4. Real-time Update

**File**: `App.tsx`

```typescript
// Real-time user profile listener
useEffect(() => {
  if (!firebaseUser) return;

  const unsubscribe = onSnapshot(
    doc(db, 'users', firebaseUser.uid),
    (docSnapshot) => {
      const updatedProfile = docSnapshot.data() as UserProfile;
      useAuthStore.getState().setUserProfile(updatedProfile);
      useAuthStore.setState({ isApproved: updatedProfile.status === 'approved' });
    }
  );

  return () => unsubscribe();
}, [firebaseUser]);
```

**Result**: User tự động thấy status mới, không cần logout/login!

---

## 🔄 REAL-TIME UPDATES

### Admin Panel Listener

**File**: `pages/Admin.tsx`

```typescript
// Real-time users listener
useEffect(() => {
  if (userProfile?.role === 'admin') {
    setLoading(true);
    
    const unsubscribe = onSnapshot(
      collection(db, 'users'),
      (snapshot) => {
        const users = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })) as UserProfile[];
        
        setAllUsers(users);
        setLoading(false);
      },
      (error) => {
        console.error('Error listening to users:', error);
        setToastMessage('Error loading users');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }
}, [userProfile, setToastMessage]);
```

### Benefits

- ✅ Tự động update khi có user mới
- ✅ Tự động update khi status thay đổi
- ✅ Không cần manual refresh
- ✅ Stats cards tự động update

---

## 💻 CODE IMPLEMENTATION

### Key Files

#### 1. `services/authService.ts`

**Functions**:

- `registerUser()`: Tạo user với `role: 'user'`, `status: 'pending'`
- `approveUser()`: Update status thành `'approved'`
- `rejectUser()`: Update status thành `'rejected'`
- `getAllUsers()`: Lấy tất cả users (admin only)
- `getPendingUsers()`: Lấy pending users (admin only)

#### 2. `store.ts`

**Auth Store**:

```typescript
interface AuthState {
  firebaseUser: FirebaseUser | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isApproved: boolean;
  
  // Actions
  setFirebaseUser: (user: FirebaseUser | null) => void;
  setUserProfile: (profile: UserProfile | null) => void;
  approveUser: (userId: string) => Promise<void>;
  rejectUser: (userId: string) => Promise<void>;
}
```

#### 3. `pages/Admin.tsx`

**Main Component**:
- Real-time listener
- User management UI
- Approve/Reject actions
- Search, filter, sort, pagination

#### 4. `App.tsx`

**Routing Logic**:
- Check authentication
- Check user status
- Route to appropriate screen:
  - Not authenticated → Login
  - Pending → Pending screen
  - Rejected → Access Denied
  - Approved → App content

---

## 🧪 TESTING GUIDE

### Test Cases

#### 1. User Registration

**Steps**:
1. Mở app → Click "Register"
2. Điền form (name, email, password)
3. Click "Register"

**Expected**:
- ✅ User được tạo trong Firebase Auth
- ✅ Document được tạo trong Firestore với `role: 'user'`, `status: 'pending'`
- ✅ Màn hình Pending hiển thị
- ✅ User thấy thông tin của mình

#### 2. Admin Panel Access

**Steps**:
1. Login với admin account
2. Vào Admin Panel

**Expected**:
- ✅ Admin Panel hiển thị
- ✅ Thấy tất cả users
- ✅ Stats cards hiển thị đúng

**Steps** (Non-admin):
1. Login với user account (approved)
2. Try access Admin Panel

**Expected**:
- ✅ "Access Denied" message hiển thị

#### 3. Approve User

**Steps**:
1. Login với admin account
2. Vào Admin Panel
3. Tìm pending user
4. Click "Approve"
5. Confirm trong modal

**Expected**:
- ✅ Modal hiển thị
- ✅ Loading state trong button
- ✅ User status update thành "approved"
- ✅ Stats cards update
- ✅ Pending user tự động chuyển sang Approved filter

#### 4. Real-time Updates

**Steps**:
1. Mở 2 browser windows
2. Window 1: Login as admin
3. Window 2: Login as pending user
4. Window 1: Approve user
5. Window 2: Watch screen

**Expected**:
- ✅ Window 2 tự động chuyển từ Pending → App content
- ✅ Không cần refresh

#### 5. Firestore Rules

**Steps**:
1. Login với user account (non-admin)
2. Try access Admin Panel
3. Check console logs

**Expected**:
- ✅ "Access Denied" message
- ✅ Không có lỗi permissions trong console

---

## 🔧 TROUBLESHOOTING

### Issue 1: "Missing or insufficient permissions"

**Nguyên nhân**: Firestore Security Rules không cho phép admin đọc collection `users`

**Giải pháp**:
1. Vào Firebase Console → Firestore → Rules
2. Đảm bảo có rule: `allow read: if isAdmin();`
3. Publish rules
4. Refresh Admin Panel

**Xem**: `docs/FIX_FIRESTORE_RULES.md`

### Issue 2: Admin Panel không hiển thị users

**Nguyên nhân**:
- Users chưa có document trong Firestore
- Firestore Rules chưa đúng
- Real-time listener có lỗi

**Giải pháp**:
1. Kiểm tra Console logs
2. Kiểm tra Firestore có documents không
3. Kiểm tra Firestore Rules
4. Xem `docs/SYNC_USERS_FROM_AUTH.md`

### Issue 3: User không thấy Pending screen sau khi đăng ký

**Nguyên nhân**: User profile chưa được load

**Giải pháp**:
1. Kiểm tra `onAuthStateChanged` listener
2. Kiểm tra user profile có trong Firestore không
3. Refresh page

### Issue 4: Real-time updates không hoạt động

**Nguyên nhân**: Listener chưa được setup hoặc có lỗi

**Giải pháp**:
1. Kiểm tra Console logs
2. Kiểm tra Firestore Rules
3. Kiểm tra network tab

---

## 📝 SUMMARY

### Key Points

1. **Firestore Collection**: `users/{userId}` với fields `role`, `status`
2. **Security Rules**: Admin có thể đọc tất cả users, users chỉ đọc được document của chính họ
3. **Admin Panel**: Real-time listener, approve/reject actions, search/filter/sort
4. **User Approval**: Status `pending` → `approved` hoặc `rejected`
5. **Real-time Updates**: Tự động update UI khi có thay đổi

### Files

- `services/authService.ts`: Auth functions
- `store.ts`: Zustand store với auth state
- `pages/Admin.tsx`: Admin Panel component
- `App.tsx`: Routing logic
- `pages/Pending.tsx`: Pending screen
- `pages/AccessDenied.tsx`: Access Denied screen

### Related Documentation

- `docs/FIX_FIRESTORE_RULES.md`: Fix Firestore Security Rules
- `docs/SYNC_USERS_FROM_AUTH.md`: Sync users từ Firebase Auth
- `docs/SETUP_ADMIN_USER.md`: Setup admin user
- `docs/ADMIN_PANEL_ANALYSIS.md`: Phân tích Admin Panel

---

**Ngày tạo**: 2025  
**Phiên bản**: 1.0  
**Tác giả**: Development Team
