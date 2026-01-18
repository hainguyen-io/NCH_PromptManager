# 🧪 HƯỚNG DẪN TEST FIREBASE AUTHENTICATION

## TỔNG QUAN

Hướng dẫn chi tiết cách test các tính năng Firebase Authentication đã được implement.

---

## ⚡ QUICK TESTING CHECKLIST

Nếu bạn muốn test nhanh, sử dụng checklist này:

### ✅ Essential Tests
- [ ] **User Registration**: Register user mới → Thấy Pending screen
- [ ] **Admin Login**: Login với admin → Access Admin Panel
- [ ] **Approve User**: Admin approve user → User có thể access app
- [ ] **Reject User**: Admin reject user → User thấy Access Denied
- [ ] **Approved User Login**: Login với approved user → Access app
- [ ] **Logout**: Logout → Redirect về Login page

**Chi tiết từng test case xem ở phần dưới.**

---

---

## 📋 PREPARATION

### Bước 1: Đảm Bảo Firebase Đã Setup

- [ ] Firebase project đã được tạo
- [ ] Authentication đã enable (Email/Password)
- [ ] Firestore database đã được tạo
- [ ] Environment variables đã được config trong `.env.local`
- [ ] Firebase service đã được initialize

### Bước 2: Chạy Development Server

```bash
npm run dev
```

Ứng dụng sẽ chạy tại: `http://localhost:3000`

### Bước 3: Mở Browser DevTools

- Mở Console (F12)
- Mở Application tab → LocalStorage (để xem data)
- Mở Network tab (để xem Firebase API calls)

---

## 🧪 TEST CASES

### TEST 1: User Registration

#### Mục đích
Test user có thể đăng ký tài khoản mới.

#### Các bước:
1. Mở ứng dụng → Sẽ thấy Login page
2. Click "Register" hoặc toggle sang register mode
3. Điền form:
   - Email: `test@example.com`
   - Password: `password123`
   - Name: `Test User`
4. Click "Register"

#### Expected Results:
- ✅ User được tạo trong Firebase Authentication
- ✅ User profile được tạo trong Firestore với:
  - `status: 'pending'`
  - `role: 'user'`
  - `email`, `name`, `avatarInitials` đúng
- ✅ UI chuyển sang Pending screen
- ✅ Console không có errors

#### Verify:
1. **Firebase Console**:
   - Vào Authentication → Users
   - Thấy user với email `test@example.com`

2. **Firestore Console**:
   - Vào Firestore Database → Collection `users`
   - Thấy document với:
     - Document ID = User UID
     - Fields: email, name, role='user', status='pending'

3. **Browser**:
   - Thấy Pending screen
   - Hiển thị user info đúng

---

### TEST 2: User Login

#### Mục đích
Test user có thể đăng nhập với credentials đã đăng ký.

#### Các bước:
1. Logout (nếu đang login)
2. Ở Login page, điền:
   - Email: `test@example.com`
   - Password: `password123`
3. Click "Login"

#### Expected Results:
- ✅ Login thành công
- ✅ Auth state được update
- ✅ User profile được load từ Firestore
- ✅ UI chuyển dựa trên status:
  - Pending → Pending screen
  - Approved → App content
  - Rejected → Access Denied screen

#### Verify:
1. **Console**:
   - Không có errors
   - Auth state change được log

2. **LocalStorage**:
   - Check Firebase auth persistence

3. **UI**:
   - Hiển thị đúng screen theo status

---

### TEST 3: Admin Login & Approval

#### Mục đích
Test admin có thể login và approve users.

#### Prerequisites:
- [ ] Admin user đã được tạo trong Firebase
- [ ] Admin document trong Firestore với `role: 'admin'`, `status: 'approved'`

#### Các bước:
1. Login với admin credentials
2. Verify admin có thể vào app (không bị block)
3. Navigate đến Admin panel
4. Xem danh sách pending users
5. Click "Approve" trên một user
6. Verify user được approve

#### Expected Results:
- ✅ Admin login thành công
- ✅ Admin có thể access app
- ✅ Admin panel hiển thị pending users
- ✅ Approve action thành công
- ✅ User status trong Firestore → `'approved'`
- ✅ Approved user có thể login và access app

#### Verify:
1. **Firestore**:
   - User document có:
     - `status: 'approved'`
     - `approvedAt: timestamp`
     - `approvedBy: adminUserId`

2. **User Login**:
   - Logout admin
   - Login với approved user
   - User có thể access app

---

### TEST 4: Admin Reject User

#### Mục đích
Test admin có thể reject user.

#### Các bước:
1. Login as admin
2. Vào Admin panel
3. Tìm user với status 'pending'
4. Click "Reject"
5. Confirm action

#### Expected Results:
- ✅ User status → `'rejected'` trong Firestore
- ✅ Rejected user không thể access app
- ✅ Rejected user thấy Access Denied screen khi login

#### Verify:
1. **Firestore**:
   - User document có `status: 'rejected'`

2. **User Login**:
   - Logout admin
   - Login với rejected user
   - User thấy Access Denied screen

---

### TEST 5: Access Control - Pending User

#### Mục đích
Test pending user chỉ thấy Pending screen.

#### Các bước:
1. Register new user (hoặc dùng user với status 'pending')
2. Login với user đó
3. Verify UI

#### Expected Results:
- ✅ User thấy Pending screen
- ✅ User không thể access app content
- ✅ User có thể logout

#### Verify:
- [ ] Pending screen hiển thị
- [ ] Không thấy Header
- [ ] Không thấy navigation
- [ ] Logout button hoạt động

---

### TEST 6: Access Control - Approved User

#### Mục đích
Test approved user có full access.

#### Các bước:
1. Login với approved user
2. Verify có thể:
   - Xem tất cả pages
   - Create/edit/delete prompts
   - Manage categories
   - Access settings

#### Expected Results:
- ✅ User thấy app content (Header + Main content)
- ✅ User có thể navigate tất cả pages
- ✅ User có thể perform CRUD operations
- ✅ User data được sync với Firestore (nếu có)

#### Verify:
- [ ] Header hiển thị
- [ ] Navigation hoạt động
- [ ] Tất cả pages accessible
- [ ] CRUD operations work

---

### TEST 7: Access Control - Rejected User

#### Mục đích
Test rejected user bị block.

#### Các bước:
1. Login với rejected user
2. Verify UI

#### Expected Results:
- ✅ User thấy Access Denied screen
- ✅ User không thể access app
- ✅ User có thể logout

#### Verify:
- [ ] Access Denied screen hiển thị
- [ ] Không thấy app content
- [ ] Logout button hoạt động

---

### TEST 8: Logout

#### Mục đích
Test logout functionality.

#### Các bước:
1. Login với bất kỳ user nào
2. Click logout (nếu có button)
3. Hoặc clear auth state

#### Expected Results:
- ✅ Auth state cleared
- ✅ UI chuyển về Login page
- ✅ LocalStorage cleared (Firebase auth)

#### Verify:
- [ ] Login page hiển thị
- [ ] Không còn user data trong state
- [ ] Có thể login lại

---

### TEST 9: Error Handling

#### Mục đích
Test error handling trong authentication.

#### Test Cases:

**9.1. Invalid Credentials**:
- Login với email/password sai
- **Expected**: Error message hiển thị
- **Expected**: Không login được

**9.2. Duplicate Email Registration**:
- Register với email đã tồn tại
- **Expected**: Error message hiển thị
- **Expected**: Không tạo duplicate user

**9.3. Weak Password**:
- Register với password quá ngắn
- **Expected**: Firebase validation error
- **Expected**: Error message hiển thị

**9.4. Invalid Email Format**:
- Register với email không hợp lệ
- **Expected**: Validation error
- **Expected**: Error message hiển thị

---

### TEST 10: Admin Panel Features

#### Mục đích
Test admin panel functionality.

#### Test Cases:

**10.1. View All Users**:
- [ ] Admin panel hiển thị tất cả users
- [ ] Users được group theo status
- [ ] Search/filter hoạt động

**10.2. Approve User**:
- [ ] Click approve → User được approve
- [ ] Status update trong Firestore
- [ ] Toast notification hiển thị

**10.3. Reject User**:
- [ ] Click reject → User bị reject
- [ ] Status update trong Firestore
- [ ] Toast notification hiển thị

**10.4. View User Details**:
- [ ] Click user → Hiển thị details
- [ ] Info đúng (email, name, status, dates)

**10.5. Non-Admin Access**:
- [ ] Regular user không thể access admin panel
- [ ] Admin link không hiển thị cho non-admin

---

## 🔍 DEBUGGING TIPS

### Check Firebase Console

1. **Authentication Tab**:
   - Xem danh sách users
   - Check user UID
   - Verify email verified status

2. **Firestore Tab**:
   - Xem collection `users`
   - Check document structure
   - Verify field values

3. **Rules Tab**:
   - Test rules với Rules Playground
   - Verify permissions

### Check Browser Console

1. **Errors**:
   - Firebase errors
   - Network errors
   - JavaScript errors

2. **Logs**:
   - Auth state changes
   - Firestore operations
   - Custom logs

### Check Network Tab

1. **Firebase API Calls**:
   - Authentication requests
   - Firestore read/write requests
   - Check response status

---

## 📊 TEST CHECKLIST

### Authentication
- [ ] User registration works
- [ ] User login works
- [ ] User logout works
- [ ] Error handling works
- [ ] Auth state persistence works

### Approval Workflow
- [ ] New user has 'pending' status
- [ ] Admin can view pending users
- [ ] Admin can approve user
- [ ] Admin can reject user
- [ ] Status updates in Firestore

### Access Control
- [ ] Pending user sees Pending screen
- [ ] Approved user sees app
- [ ] Rejected user sees Access Denied
- [ ] Unauthenticated user sees Login

### Admin Panel
- [ ] Admin can access admin panel
- [ ] Admin can view all users
- [ ] Admin can filter by status
- [ ] Admin can approve/reject
- [ ] Non-admin cannot access

### Integration
- [ ] All pages work với Firebase auth
- [ ] User data sync correctly
- [ ] Prompts CRUD works
- [ ] Categories CRUD works

---

## 🐛 COMMON ISSUES & SOLUTIONS

### Issue 1: "Firebase: Error (auth/user-not-found)"
**Solution**: User chưa được tạo. Register user trước.

### Issue 2: "Firestore permission denied"
**Solution**: 
- Check Firestore Security Rules
- Verify user role trong Firestore
- Check rules allow read/write

### Issue 3: "User status not updating"
**Solution**:
- Check Firestore write permissions
- Verify admin role
- Check network tab for errors

### Issue 4: "Cannot access admin panel"
**Solution**:
- Verify user role = 'admin' trong Firestore
- Check admin route protection
- Verify ViewName includes 'ADMIN'

### Issue 5: "Auth state not persisting"
**Solution**:
- Check Firebase auth persistence
- Verify localStorage
- Check onAuthStateChange listener

---

## ✅ TESTING WORKFLOW

### Recommended Order:

1. **Setup Admin User** (One-time)
   - Create admin in Firebase Console
   - Create admin document in Firestore

2. **Test Registration**
   - Register 2-3 test users
   - Verify trong Firebase Console

3. **Test Admin Approval**
   - Login as admin
   - Approve test users
   - Verify status updates

4. **Test User Access**
   - Login với approved user
   - Test app functionality
   - Verify full access

5. **Test Rejection**
   - Reject một user
   - Login với rejected user
   - Verify access denied

6. **Test Error Cases**
   - Invalid credentials
   - Duplicate registration
   - Network errors

---

## 📝 TEST DATA

### Test Users to Create:

1. **Admin User**:
   - Email: `admin@promptvault.com`
   - Password: `admin123`
   - Role: `admin`
   - Status: `approved`

2. **Pending User**:
   - Email: `pending@test.com`
   - Password: `test123`
   - Role: `user`
   - Status: `pending`

3. **Approved User**:
   - Email: `approved@test.com`
   - Password: `test123`
   - Role: `user`
   - Status: `approved`

4. **Rejected User**:
   - Email: `rejected@test.com`
   - Password: `test123`
   - Role: `user`
   - Status: `rejected`

---

## 🎯 QUICK TEST SCRIPT

### 5-Minute Quick Test:

1. **Register User** (1 phút)
   - Register với email mới
   - Verify pending screen

2. **Admin Approve** (1 phút)
   - Login as admin
   - Approve user vừa register
   - Verify status update

3. **User Login** (1 phút)
   - Logout admin
   - Login với approved user
   - Verify app access

4. **Test Rejection** (1 phút)
   - Register user mới
   - Admin reject user
   - Login với rejected user
   - Verify access denied

5. **Test Error** (1 phút)
   - Login với wrong password
   - Verify error message

---

## 📋 TEST RESULTS TEMPLATE

```
TEST DATE: ___________
TESTER: ___________

### Authentication Tests
- [ ] Registration: PASS / FAIL
- [ ] Login: PASS / FAIL
- [ ] Logout: PASS / FAIL

### Approval Workflow
- [ ] Admin Approve: PASS / FAIL
- [ ] Admin Reject: PASS / FAIL
- [ ] Status Update: PASS / FAIL

### Access Control
- [ ] Pending User: PASS / FAIL
- [ ] Approved User: PASS / FAIL
- [ ] Rejected User: PASS / FAIL

### Admin Panel
- [ ] View Users: PASS / FAIL
- [ ] Approve Action: PASS / FAIL
- [ ] Reject Action: PASS / FAIL

### Issues Found:
1. _______________________
2. _______________________

### Notes:
_______________________
```

---

**Tài liệu này cung cấp hướng dẫn test đầy đủ cho Firebase Authentication.**

**Ngày tạo**: 2024  
**Phiên bản**: 1.0
