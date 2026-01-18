# 👤 HƯỚNG DẪN SETUP ADMIN USER

## TỔNG QUAN

Hướng dẫn chi tiết để tạo admin user trong Firebase Console và Firestore.

---

## 📋 CÁC BƯỚC SETUP

### Bước 1: Tạo Admin User trong Firebase Authentication

1. **Mở Firebase Console**
   - Vào: https://console.firebase.google.com/
   - Chọn project của bạn

2. **Vào Authentication**
   - Click "Authentication" trong menu bên trái
   - Click tab "Users"

3. **Thêm User Mới**
   - Click button "Add user" (hoặc "+ Add user")
   - Nhập thông tin:
     - **Email**: `admin@promptvault.com` (hoặc email bạn muốn)
     - **Password**: Tạo password mạnh (ví dụ: `Admin123!@#`)
   - Click "Add user"

4. **Copy User UID**
   - Sau khi tạo xong, click vào user vừa tạo
   - Copy **User UID** (ví dụ: `abc123xyz456...`)
   - **Lưu lại UID này** - sẽ cần dùng ở bước tiếp theo

---

### Bước 2: Tạo Admin Document trong Firestore

1. **Vào Firestore Database**
   - Click "Firestore Database" trong menu bên trái
   - Click "Start collection" (nếu chưa có collection `users`)

2. **Tạo Document trong Collection `users`**
   - **Collection ID**: `users`
   - **Document ID**: Paste **User UID** từ bước 1 (chính xác!)
   - Click "Next"

3. **Thêm Fields**
   - Click "Add field" và thêm các fields sau:

   | Field | Type | Value |
   |-------|------|-------|
   | `id` | string | User UID (giống Document ID) |
   | `email` | string | `admin@promptvault.com` (hoặc email bạn đã dùng) |
   | `name` | string | `Admin` (hoặc tên bạn muốn) |
   | `role` | string | `admin` |
   | `status` | string | `approved` |
   | `createdAt` | number | `1735689600000` (hoặc timestamp hiện tại) |
   | `avatarInitials` | string | `AD` (hoặc 2 chữ cái đầu của name) |

4. **Click "Save"**

---

### Bước 3: Verify Admin User

1. **Kiểm tra trong Firestore**
   - Vào Firestore Database
   - Collection `users`
   - Tìm document với UID của admin
   - Verify các fields đúng:
     - ✅ `role` = `admin`
     - ✅ `status` = `approved`

2. **Test Login**
   - Mở app
   - Login với email và password admin
   - Verify:
     - ✅ Login thành công
     - ✅ Thấy app content (không bị block)
     - ✅ Có "Admin" link trong Header
     - ✅ Có thể vào Admin panel

---

## 🔧 CÁCH TẠO TIMESTAMP

### Option 1: Dùng JavaScript Console
```javascript
// Mở browser console (F12)
Date.now()
// Copy số được return (ví dụ: 1735689600000)
```

### Option 2: Dùng Online Tool
- Vào: https://www.epochconverter.com/
- Click "Timestamp to date"
- Copy milliseconds

### Option 3: Dùng Firebase Console
- Firestore tự động tạo timestamp khi bạn chọn type "timestamp"
- Hoặc dùng số milliseconds hiện tại

---

## 📝 TEMPLATE ADMIN USER DOCUMENT

```json
{
  "id": "YOUR_USER_UID_HERE",
  "email": "admin@promptvault.com",
  "name": "Admin",
  "role": "admin",
  "status": "approved",
  "createdAt": 1735689600000,
  "avatarInitials": "AD"
}
```

**Lưu ý**: Thay `YOUR_USER_UID_HERE` bằng User UID thực tế từ Firebase Authentication.

---

## 🎯 QUICK SETUP SCRIPT

Nếu bạn muốn setup nhanh, có thể dùng script này trong browser console (sau khi đã login với admin account):

```javascript
// Chạy trong browser console khi đã login với admin account
// Script này sẽ tự động tạo admin document trong Firestore

(async () => {
  const { auth, db } = await import('./services/firebase');
  const { doc, setDoc } = await import('firebase/firestore');
  
  const user = auth.currentUser;
  if (!user) {
    console.error('No user logged in');
    return;
  }
  
  const adminProfile = {
    id: user.uid,
    email: user.email,
    name: 'Admin',
    role: 'admin',
    status: 'approved',
    createdAt: Date.now(),
    avatarInitials: 'AD'
  };
  
  try {
    await setDoc(doc(db, 'users', user.uid), adminProfile);
    console.log('Admin profile created successfully!');
    console.log('Please refresh the page.');
  } catch (error) {
    console.error('Error creating admin profile:', error);
  }
})();
```

**Cách dùng**:
1. Login với admin email/password trong Firebase Authentication
2. Mở browser console (F12)
3. Paste script trên
4. Press Enter
5. Refresh page

---

## ✅ CHECKLIST

- [ ] Admin user đã được tạo trong Firebase Authentication
- [ ] User UID đã được copy
- [ ] Admin document đã được tạo trong Firestore collection `users`
- [ ] Document ID = User UID
- [ ] Field `role` = `admin`
- [ ] Field `status` = `approved`
- [ ] Tất cả fields đã được điền đúng
- [ ] Có thể login với admin account
- [ ] Admin có thể access app
- [ ] Admin link hiển thị trong Header
- [ ] Admin panel accessible

---

## 🐛 TROUBLESHOOTING

### Issue 1: "Cannot access admin panel"
**Nguyên nhân**: 
- User role không phải `admin`
- User status không phải `approved`

**Giải pháp**:
- Check Firestore document
- Verify `role` = `admin` và `status` = `approved`
- Refresh page sau khi update

### Issue 2: "Admin link không hiển thị"
**Nguyên nhân**:
- User profile chưa được load
- Role không đúng

**Giải pháp**:
- Check console logs
- Verify userProfile trong store
- Check Firestore document

### Issue 3: "Login nhưng vẫn thấy Pending screen"
**Nguyên nhân**:
- Status trong Firestore không phải `approved`

**Giải pháp**:
- Update `status` = `approved` trong Firestore
- Refresh page

---

## 📸 SCREENSHOTS GUIDE

### Firebase Authentication
1. Authentication → Users → Add user
2. Enter email và password
3. Copy User UID

### Firestore Database
1. Firestore Database → Start collection (nếu chưa có)
2. Collection ID: `users`
3. Document ID: Paste User UID
4. Add fields như template ở trên
5. Save

---

## 🔐 SECURITY NOTES

1. **Password**: Dùng password mạnh cho admin account
2. **Email**: Dùng email thật để có thể reset password
3. **UID**: Không share User UID công khai
4. **Firestore Rules**: Đảm bảo Firestore rules bảo vệ admin data

---

**Tài liệu này cung cấp hướng dẫn chi tiết để setup admin user.**

**Ngày tạo**: 2024  
**Phiên bản**: 1.0
