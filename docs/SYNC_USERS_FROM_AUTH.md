# 🔄 HƯỚNG DẪN SYNC USERS TỪ FIREBASE AUTH SANG FIRESTORE

## VẤN ĐỀ

Khi bạn tạo users trực tiếp trong **Firebase Console** (Add user), họ chỉ được tạo trong **Firebase Authentication**, nhưng **KHÔNG tự động** có document trong **Firestore collection 'users'**.

**Admin Panel chỉ đọc từ Firestore**, nên các users này sẽ không hiển thị.

---

## GIẢI PHÁP

Có 2 cách để fix:

### Cách 1: Tạo Users qua App (Khuyến nghị)

**Tốt nhất**: Yêu cầu users đăng ký qua app của bạn. Khi đăng ký qua app, function `registerUser` sẽ tự động tạo document trong Firestore.

---

### Cách 2: Sync Users từ Firebase Auth sang Firestore (Manual)

Nếu bạn đã tạo users trong Firebase Console, cần sync thủ công:

#### Bước 1: Mở Browser Console

1. Mở Admin Panel trong browser
2. Mở **Developer Tools** (F12)
3. Vào tab **Console**

#### Bước 2: Import Utility Functions

Paste code sau vào console:

```javascript
// Import Firebase functions
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './services/firebase';

// Function để sync user
const syncUserToFirestore = async (userId, email, name, createdAt) => {
  try {
    // Check if user already exists
    const userDoc = await getDoc(doc(db, 'users', userId));
    
    if (userDoc.exists()) {
      console.log(`✅ User ${userId} already exists in Firestore`);
      return;
    }

    // Create user profile
    const userProfile = {
      id: userId,
      email: email,
      name: name || email.split('@')[0],
      role: 'user',
      status: 'pending',
      createdAt: createdAt || Date.now(),
      avatarInitials: (name || email.split('@')[0]).substring(0, 2).toUpperCase(),
    };

    // Save to Firestore
    await setDoc(doc(db, 'users', userId), userProfile);
    console.log(`✅ Synced user ${userId} to Firestore:`, userProfile);
  } catch (error) {
    console.error(`❌ Error syncing user ${userId}:`, error);
    throw error;
  }
};
```

**Lưu ý**: Code trên có thể không chạy trực tiếp trong console vì cần import modules. Xem **Cách 3** bên dưới.

---

### Cách 3: Tạo Document Thủ Công trong Firestore (Dễ nhất)

#### Bước 1: Lấy User UID từ Firebase Console

1. Vào **Firebase Console** → **Authentication** → **Users**
2. Click vào user bạn muốn sync
3. Copy **User UID** (ví dụ: `Q403dzvJzAROD6qTtcAdQJe...`)

#### Bước 2: Tạo Document trong Firestore

1. Vào **Firestore Database**
2. Click collection **`users`** (nếu chưa có, tạo mới)
3. Click **"Add document"**
4. **Document ID**: Paste **User UID** từ bước 1 (chính xác!)
5. Click **"Next"**

#### Bước 3: Thêm Fields

Thêm các fields sau:

| Field | Type | Value |
|-------|------|-------|
| `id` | string | User UID (giống Document ID) |
| `email` | string | Email của user |
| `name` | string | Tên user (hoặc email prefix nếu không có) |
| `role` | string | `user` |
| `status` | string | `pending` (hoặc `approved` nếu muốn approve ngay) |
| `createdAt` | number | Timestamp (ví dụ: `1735689600000`) |
| `avatarInitials` | string | 2 chữ cái đầu của name (ví dụ: `AB`) |

#### Bước 4: Click "Save"

Sau khi save, refresh Admin Panel - user sẽ xuất hiện!

---

## KIỂM TRA

### 1. Kiểm tra Console Logs

Mở **Browser Console** (F12) khi vào Admin Panel, bạn sẽ thấy:

```
📊 Users snapshot received: { totalDocs: X, docs: [...] }
✅ Processed users: X [...]
```

Nếu `totalDocs: 0` hoặc `totalDocs: 1` (chỉ có admin), nghĩa là các users khác chưa có trong Firestore.

### 2. Kiểm tra Firestore

1. Vào **Firestore Database**
2. Click collection **`users`**
3. Xem có bao nhiêu documents
4. So sánh với số users trong **Firebase Authentication**

---

## TỰ ĐỘNG HÓA (Tùy chọn)

Nếu bạn muốn tự động sync, có thể tạo **Cloud Function** hoặc **Firebase Extension** để tự động tạo Firestore document khi có user mới trong Firebase Auth.

---

## LƯU Ý

- **Users tạo qua app**: Tự động có document trong Firestore ✅
- **Users tạo trong Console**: Cần sync thủ công ❌
- **Admin Panel**: Chỉ đọc từ Firestore collection `users`

---

## DEBUG

Nếu vẫn không thấy users sau khi sync:

1. **Kiểm tra Firestore Rules**: Đảm bảo admin có quyền read collection `users`
2. **Kiểm tra Console Logs**: Xem có error không
3. **Refresh Page**: Đôi khi cần refresh để listener update
4. **Kiểm tra Filter**: Đảm bảo filter không đang ẩn users

---

**Ngày tạo**: 2025  
**Phiên bản**: 1.0
