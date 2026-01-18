# 🔐 HƯỚNG DẪN SETUP FIREBASE AUTHENTICATION

## TỔNG QUAN

Hướng dẫn này sẽ giúp bạn tích hợp Firebase Authentication vào PromptVault với tính năng quản trị người dùng và approval workflow.

---

## ⚡ QUICK START (5 Bước)

Nếu bạn muốn bắt đầu nhanh, làm theo 5 bước sau:

### Bước 1: Tạo Firebase Project (10 phút)
1. Vào https://console.firebase.google.com/
2. Click "Add project" → Nhập tên: `promptvault`
3. Click icon Web (`</>`) → Nhập app name: `PromptVault Web`
4. **Copy Firebase config** (sẽ dùng ở bước 3)

### Bước 2: Enable Services (10 phút)
- **Authentication**: Enable "Email/Password"
- **Firestore**: Create database → "Start in test mode"

### Bước 3: Install & Config (5 phút)
```bash
npm install firebase
```
Tạo `.env.local` với Firebase config (xem chi tiết ở phần dưới)

### Bước 4: Create Firebase Service (10 phút)
Tạo `services/firebase.ts` (xem code mẫu ở phần dưới)

### Bước 5: Test Connection (5 phút)
Test Firebase connection (xem chi tiết ở phần dưới)

**Sau khi hoàn thành 5 bước này, tiếp tục đọc phần chi tiết bên dưới để hoàn tất setup!**

---

---

## 1. TẠO FIREBASE PROJECT

### Bước 1.1: Tạo Project trên Firebase Console

1. **Truy cập Firebase Console**
   - Vào: https://console.firebase.google.com/
   - Đăng nhập bằng Google account

2. **Tạo Project Mới**
   - Click "Add project" hoặc "Create a project"
   - Nhập tên project: `promptvault` (hoặc tên bạn muốn)
   - Click "Continue"

3. **Cấu hình Google Analytics** (Optional)
   - Có thể bật hoặc tắt Google Analytics
   - Click "Continue"

4. **Hoàn tất**
   - Click "Create project"
   - Đợi Firebase setup (30-60 giây)
   - Click "Continue"

### Bước 1.2: Thêm Web App

1. **Thêm Web App vào Project**
   - Trong Firebase Console, click icon "Web" (`</>`)
   - Nhập App nickname: `PromptVault Web`
   - **KHÔNG** check "Also set up Firebase Hosting" (nếu không cần)
   - Click "Register app"

2. **Copy Firebase Config**
   - Firebase sẽ hiển thị config object
   - **Lưu lại** config này (sẽ dùng sau):
   ```javascript
   const firebaseConfig = {
     apiKey: "AIza...",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abcdef"
   };
   ```

3. **Click "Continue to console"**

---

## 2. ENABLE AUTHENTICATION

### Bước 2.1: Enable Authentication Service

1. **Vào Authentication**
   - Trong Firebase Console, click "Authentication" ở sidebar
   - Click "Get started"

2. **Enable Sign-in Methods**
   - Click tab "Sign-in method"
   - Enable các methods bạn muốn:

   **Email/Password** (Recommended):
   - Click "Email/Password"
   - Enable "Email/Password"
   - Click "Save"

   **Google** (Optional):
   - Click "Google"
   - Enable Google sign-in
   - Nhập Project support email
   - Click "Save"

### Bước 2.2: Cấu hình Authorized Domains

1. **Vào Settings → General**
   - Scroll xuống "Authorized domains"
   - Firebase tự động thêm:
     - `your-project.firebaseapp.com`
     - `your-project.web.app`
   - Thêm domain của bạn (nếu deploy):
     - Click "Add domain"
     - Nhập domain (ví dụ: `yourdomain.com`)
     - Click "Add"

---

## 3. SETUP FIRESTORE (Cho User Approval)

### Bước 3.1: Create Firestore Database

1. **Vào Firestore Database**
   - Click "Firestore Database" ở sidebar
   - Click "Create database"

2. **Chọn Mode**
   - Chọn **"Start in test mode"** (cho development)
   - Click "Next"

3. **Chọn Location**
   - Chọn location gần bạn nhất (ví dụ: `asia-southeast1`)
   - Click "Enable"

### Bước 3.2: Tạo Collections Structure

**Collection: `users`**
```
users/
  {userId}/
    - email: string
    - name: string
    - role: 'admin' | 'user'
    - status: 'pending' | 'approved' | 'rejected'
    - createdAt: timestamp
    - approvedAt: timestamp (optional)
    - approvedBy: string (optional)
```

**Collection: `adminSettings`** (Optional)
```
adminSettings/
  credentials/
    - adminEmails: string[]  // List of admin emails
```

### Bước 3.3: Security Rules (Quan trọng!)

1. **Vào Firestore Rules**
   - Click tab "Rules"
   - Update rules như sau:

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
      // User can read their own data
      allow read: if isAuthenticated() && request.auth.uid == userId;
      
      // Admin can read ALL users (for admin panel) - QUAN TRỌNG!
      allow read: if isAdmin();
      
      // User can create their own profile (during registration)
      allow create: if isAuthenticated() && request.auth.uid == userId;
      
      // User can update their own profile (limited fields)
      allow update: if isAuthenticated() && request.auth.uid == userId &&
        // Only allow updating name and avatarInitials
        request.resource.data.diff(resource.data).affectedKeys().hasOnly(['name', 'avatarInitials']);
      
      // Admin can write (approve/reject users)
      allow write: if isAdmin();
    }
    
    // Admin settings - only admins can read/write
    match /adminSettings/{document=**} {
      allow read, write: if isAdmin();
    }
    
    // Prompts collection (nếu muốn sync prompts lên cloud)
    match /prompts/{promptId} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated();
    }
  }
}
```

**Lưu ý**: 
- Rules trên cho phép admin đọc **toàn bộ collection `users`** (quan trọng cho Admin Panel)
- Nếu gặp lỗi "Missing or insufficient permissions", xem file `docs/FIX_FIRESTORE_RULES.md`

---

## 4. INSTALL DEPENDENCIES

### Bước 4.1: Install Firebase SDK

```bash
npm install firebase
```

### Bước 4.2: Verify Installation

```bash
npm list firebase
```

---

## 5. CẤU HÌNH FIREBASE TRONG PROJECT

### Bước 5.1: Tạo Firebase Config File

**Tạo file**: `.env.local` (nếu chưa có)

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

**Lưu ý**: 
- Thay các giá trị bằng config từ Firebase Console
- File `.env.local` đã có trong `.gitignore` (không commit)

### Bước 5.2: Tạo Firebase Service File

**Tạo file**: `services/firebase.ts`

```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
```

---

## 6. IMPLEMENT AUTHENTICATION

### Bước 6.1: Update Types

**File**: `types.ts`

```typescript
// Add to existing types
export type UserStatus = 'pending' | 'approved' | 'rejected';
export type UserRole = 'admin' | 'user';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  createdAt: number;
  approvedAt?: number;
  approvedBy?: string;
  avatarInitials: string;
}
```

### Bước 6.2: Create Auth Service

**Tạo file**: `services/authService.ts`

```typescript
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { auth, db } from './firebase';
import { UserProfile, UserStatus, UserRole } from '../types';

// Register new user
export const registerUser = async (
  email: string,
  password: string,
  name: string
): Promise<{ success: boolean; error?: string }> => {
  try {
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
      role: 'user',
      status: 'pending',
      createdAt: Date.now(),
      avatarInitials: name.substring(0, 2).toUpperCase(),
    };

    await setDoc(doc(db, 'users', firebaseUser.uid), userProfile);

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Login user
export const loginUser = async (
  email: string,
  password: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Logout user
export const logoutUser = async (): Promise<void> => {
  await signOut(auth);
};

// Get current user profile
export const getCurrentUserProfile = async (
  userId: string
): Promise<UserProfile | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

// Check if user is approved
export const isUserApproved = async (userId: string): Promise<boolean> => {
  const profile = await getCurrentUserProfile(userId);
  return profile?.status === 'approved';
};

// Auth state observer
export const onAuthStateChange = (
  callback: (user: FirebaseUser | null) => void
) => {
  return onAuthStateChanged(auth, callback);
};

// Get all users (admin only)
export const getAllUsers = async (): Promise<UserProfile[]> => {
  const usersRef = collection(db, 'users');
  const snapshot = await getDocs(usersRef);
  return snapshot.docs.map((doc) => doc.data() as UserProfile);
};

// Get pending users
export const getPendingUsers = async (): Promise<UserProfile[]> => {
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('status', '==', 'pending'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data() as UserProfile);
};

// Approve user (admin only)
export const approveUser = async (
  userId: string,
  adminId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    await updateDoc(doc(db, 'users', userId), {
      status: 'approved',
      approvedAt: Date.now(),
      approvedBy: adminId,
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Reject user (admin only)
export const rejectUser = async (
  userId: string,
  adminId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    await updateDoc(doc(db, 'users', userId), {
      status: 'rejected',
      approvedBy: adminId,
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};
```

### Bước 6.3: Create Auth Store

**Update file**: `store.ts`

```typescript
// Add new store
import { UserProfile } from './types';
import {
  onAuthStateChange,
  getCurrentUserProfile,
  isUserApproved,
  getAllUsers,
  getPendingUsers,
  approveUser as approveUserService,
  rejectUser as rejectUserService,
} from './services/authService';
import { User as FirebaseUser } from 'firebase/auth';

interface AuthState {
  firebaseUser: FirebaseUser | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isApproved: boolean;
  
  // Actions
  setFirebaseUser: (user: FirebaseUser | null) => void;
  setUserProfile: (profile: UserProfile | null) => void;
  checkUserApproval: () => Promise<void>;
  loadAllUsers: () => Promise<UserProfile[]>;
  loadPendingUsers: () => Promise<UserProfile[]>;
  approveUser: (userId: string) => Promise<void>;
  rejectUser: (userId: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  firebaseUser: null,
  userProfile: null,
  isLoading: true,
  isAuthenticated: false,
  isApproved: false,

  setFirebaseUser: async (user) => {
    set({ firebaseUser: user, isAuthenticated: !!user });
    
    if (user) {
      // Load user profile
      const profile = await getCurrentUserProfile(user.uid);
      const approved = await isUserApproved(user.uid);
      
      set({
        userProfile: profile,
        isApproved: approved,
        isLoading: false,
      });
    } else {
      set({
        userProfile: null,
        isApproved: false,
        isLoading: false,
      });
    }
  },

  setUserProfile: (profile) => set({ userProfile: profile }),

  checkUserApproval: async () => {
    const { firebaseUser } = get();
    if (firebaseUser) {
      const approved = await isUserApproved(firebaseUser.uid);
      set({ isApproved: approved });
    }
  },

  loadAllUsers: async () => {
    return await getAllUsers();
  },

  loadPendingUsers: async () => {
    return await getPendingUsers();
  },

  approveUser: async (userId: string) => {
    const { firebaseUser } = get();
    if (firebaseUser) {
      await approveUserService(userId, firebaseUser.uid);
      await get().checkUserApproval();
    }
  },

  rejectUser: async (userId: string) => {
    const { firebaseUser } = get();
    if (firebaseUser) {
      await rejectUserService(userId, firebaseUser.uid);
    }
  },
}));

// Initialize auth state listener
onAuthStateChange((user) => {
  useAuthStore.getState().setFirebaseUser(user);
});
```

---

## 7. UPDATE APP COMPONENT

### Bước 7.1: Add Access Control

**File**: `App.tsx`

```typescript
import { useEffect, useState } from 'react';
import { useAuthStore } from './store';
import Login from './pages/Login';
import Pending from './pages/Pending';
import AccessDenied from './pages/AccessDenied';
import LoadingScreen from './components/LoadingScreen';

function App() {
  const { firebaseUser, userProfile, isLoading, isApproved } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      setIsChecking(false);
    }
  }, [isLoading]);

  // Show loading while checking auth
  if (isChecking || isLoading) {
    return <LoadingScreen />;
  }

  // Not authenticated - show login
  if (!firebaseUser) {
    return <Login />;
  }

  // User not approved yet
  if (userProfile?.status === 'pending') {
    return <Pending userProfile={userProfile} />;
  }

  // User rejected
  if (userProfile?.status === 'rejected') {
    return <AccessDenied userProfile={userProfile} />;
  }

  // Approved user - show app
  if (isApproved && userProfile?.status === 'approved') {
    return <AppContent />;  // Your existing app content
  }

  // Fallback
  return <LoadingScreen />;
}
```

---

## 8. CREATE NEW PAGES

### Bước 8.1: Login Page

**Tạo file**: `pages/Login.tsx`

```typescript
import React, { useState } from 'react';
import { registerUser, loginUser } from '../services/authService';
import { useAuthStore } from '../store';

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        const result = await registerUser(email, password, name);
        if (!result.success) {
          setError(result.error || 'Registration failed');
        }
      } else {
        const result = await loginUser(email, password);
        if (!result.success) {
          setError(result.error || 'Login failed');
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8 p-8">
        {/* Login/Register form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Form fields */}
        </form>
      </div>
    </div>
  );
};
```

### Bước 8.2: Admin Panel

**Tạo file**: `pages/Admin.tsx`

```typescript
import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store';
import { UserProfile } from '../types';

const Admin = () => {
  const { userProfile, loadPendingUsers, approveUser, rejectUser } = useAuthStore();
  const [pendingUsers, setPendingUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userProfile?.role === 'admin') {
      loadPendingUsers().then(setPendingUsers).finally(() => setLoading(false));
    }
  }, [userProfile]);

  // Admin panel UI
  return (
    <div>
      {/* Admin panel content */}
    </div>
  );
};
```

---

## 9. SETUP ADMIN USER

> 📖 **Xem hướng dẫn chi tiết**: [SETUP_ADMIN_USER.md](./SETUP_ADMIN_USER.md)

### Bước 9.1: Tạo Admin User Manually

**Option 1: Tạo trong Firebase Console**

1. Vào Authentication → Users
2. Click "Add user"
3. Nhập email và password
4. Click "Add user"
5. Copy User UID

**Option 2: Tạo trong Firestore**

1. Vào Firestore Database
2. Tạo document trong collection `users` với:
   - Document ID = User UID (từ Authentication)
   - Fields:
     ```json
     {
       "id": "YOUR_USER_UID",
       "email": "admin@example.com",
       "name": "Admin",
       "role": "admin",
       "status": "approved",
       "createdAt": 1735689600000,
       "avatarInitials": "AD"
     }
     ```

---

## 10. TESTING

> 📖 **Xem hướng dẫn test chi tiết**: [FIREBASE_AUTH_TESTING_GUIDE.md](./FIREBASE_AUTH_TESTING_GUIDE.md)

### Bước 10.1: Test Registration

1. Register new user
2. Check Firestore → `users` collection
3. Verify status = 'pending'

### Bước 10.2: Test Admin Approval

1. Login as admin
2. Go to Admin panel
3. Approve user
4. Verify status = 'approved' in Firestore

### Bước 10.3: Test Access Control

1. Login as pending user → Should see Pending screen
2. Login as approved user → Should see app
3. Login as rejected user → Should see Access Denied

---

## 11. DEPLOYMENT CONSIDERATIONS

### Bước 11.1: Update Authorized Domains

1. Vào Firebase Console → Authentication → Settings
2. Add your production domain
3. Update `.env.local` với production config (nếu khác)

### Bước 11.2: Update Firestore Rules

1. Update rules cho production
2. Test rules với Rules Playground
3. Deploy rules

---

## 12. TROUBLESHOOTING

### Lỗi: "Firebase: Error (auth/unauthorized-domain)"

**Giải pháp**: 
- Thêm domain vào Authorized domains trong Firebase Console

### Lỗi: "Firebase: Error (auth/user-not-found)"

**Giải pháp**:
- User chưa được tạo trong Authentication
- Check email/password

### Lỗi: "Firestore permission denied"

**Giải pháp**:
- Check Firestore Security Rules
- Verify user role trong Firestore

---

## 13. NEXT STEPS

Sau khi setup xong:

1. ✅ Test authentication flow
2. ✅ Test admin approval workflow
3. ✅ Test access control
4. ✅ Update UI/UX
5. ✅ Add error handling
6. ✅ Add loading states
7. ✅ Deploy và test production

---

**Tài liệu này cung cấp hướng dẫn chi tiết để setup Firebase Authentication với approval workflow.**

**Ngày tạo**: 2024  
**Phiên bản**: 1.0
