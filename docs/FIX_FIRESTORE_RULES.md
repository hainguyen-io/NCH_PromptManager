# 🔧 FIX FIRESTORE SECURITY RULES - Cho Admin Panel

## ❌ VẤN ĐỀ

Console logs cho thấy lỗi:
```
FirebaseError: Missing or insufficient permissions
```

**Nguyên nhân**: Firestore Security Rules hiện tại không cho phép admin đọc **toàn bộ collection `users`**, chỉ cho phép đọc document của chính user đó.

---

## ✅ GIẢI PHÁP

### Bước 1: Vào Firebase Console

1. Mở **Firebase Console**: https://console.firebase.google.com/
2. Chọn project của bạn
3. Vào **Firestore Database**
4. Click tab **"Rules"**

### Bước 2: Update Security Rules

**Thay thế** rules hiện tại bằng rules sau:

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
      
      // Admin can read ALL users (for admin panel)
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

### Bước 3: Publish Rules

1. Click **"Publish"** button
2. Đợi vài giây để rules được deploy
3. Refresh Admin Panel trong browser

---

## 🔍 GIẢI THÍCH RULES

### Helper Functions

```javascript
function isAdmin() {
  return request.auth != null && 
    exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
    get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
}
```

- Kiểm tra user đã authenticated
- Kiểm tra user có document trong Firestore
- Kiểm tra user có `role == 'admin'`

### Users Collection Rules

```javascript
match /users/{userId} {
  // 1. User có thể đọc document của chính họ
  allow read: if isAuthenticated() && request.auth.uid == userId;
  
  // 2. Admin có thể đọc TẤT CẢ users (quan trọng!)
  allow read: if isAdmin();
  
  // 3. User có thể tạo profile của chính họ (khi đăng ký)
  allow create: if isAuthenticated() && request.auth.uid == userId;
  
  // 4. User có thể update một số fields của chính họ
  allow update: if isAuthenticated() && request.auth.uid == userId &&
    request.resource.data.diff(resource.data).affectedKeys().hasOnly(['name', 'avatarInitials']);
  
  // 5. Admin có thể write (approve/reject)
  allow write: if isAdmin();
}
```

**Quan trọng**: Rule `allow read: if isAdmin();` cho phép admin đọc **toàn bộ collection**, không chỉ document của chính họ.

---

## ✅ KIỂM TRA

Sau khi update rules:

1. **Refresh Admin Panel** trong browser
2. **Mở Console** (F12) và kiểm tra:
   - Không còn lỗi "Missing or insufficient permissions"
   - Log: `📊 Users snapshot received: { totalDocs: X, ... }` với X > 1
   - Log: `✅ Processed users: X [...]` với danh sách users

3. **Kiểm tra Firestore**:
   - Vào Firestore Database
   - Xem collection `users` có bao nhiêu documents
   - So sánh với số users trong Firebase Authentication

---

## 🚨 LƯU Ý BẢO MẬT

### Development Mode (Test Mode)

Nếu bạn đang dùng **test mode**, rules sẽ cho phép tất cả read/write. Nhưng **KHÔNG nên dùng test mode cho production!**

### Production Rules

Rules trên đã được thiết kế an toàn:
- ✅ Users chỉ đọc được document của chính họ
- ✅ Admin mới đọc được tất cả users
- ✅ Users chỉ update được một số fields của chính họ
- ✅ Chỉ admin mới approve/reject users

---

## 🔄 NẾU VẪN CÓ LỖI

### 1. Kiểm tra Admin Role

Đảm bảo admin user có `role: 'admin'` trong Firestore:

1. Vào Firestore Database
2. Click collection `users`
3. Click document của admin user
4. Kiểm tra field `role` = `"admin"`

### 2. Kiểm tra Rules đã Publish

1. Vào Rules tab
2. Xem rules hiện tại có giống rules mới không
3. Nếu chưa, click "Publish" lại

### 3. Clear Browser Cache

1. Hard refresh: `Ctrl + Shift + R` (Windows) hoặc `Cmd + Shift + R` (Mac)
2. Hoặc clear cache và reload

### 4. Kiểm tra Console Logs

Mở Console và xem:
- Có lỗi gì khác không?
- `isAdmin()` function có hoạt động không?

---

## 📝 TÓM TẮT

**Vấn đề**: Rules không cho phép admin đọc collection `users`

**Giải pháp**: Thêm rule `allow read: if isAdmin();` trong `match /users/{userId}`

**Kết quả**: Admin có thể đọc tất cả users, Admin Panel hiển thị đầy đủ users

---

**Ngày tạo**: 2025  
**Phiên bản**: 1.0
