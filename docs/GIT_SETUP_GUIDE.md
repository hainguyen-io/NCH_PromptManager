# 📦 HƯỚNG DẪN ĐỒNG BỘ LÊN GITHUB

## TÌNH TRẠNG HIỆN TẠI

- ❌ Chưa có git repository
- ✅ Đã có `.gitignore` file

---

## CÁC BƯỚC THỰC HIỆN

### BƯỚC 1: Khởi tạo Git Repository

```bash
git init
```

### BƯỚC 2: Thêm tất cả files vào staging

```bash
git add .
```

### BƯỚC 3: Commit lần đầu

```bash
git commit -m "Initial commit: PromptVault v1.0.1 with improved Import/Export"
```

Hoặc commit message chi tiết hơn:

```bash
git commit -m "feat: PromptVault v1.0.1

- Improved Import/Export JSON functionality
- Added Import Modal with preview
- Added category import support
- Enhanced validation
- Added version display in header
- Complete test suite"
```

### BƯỚC 4: Tạo GitHub Repository (nếu chưa có)

**Option A: Tạo trên GitHub.com**
1. Vào https://github.com
2. Click "New repository"
3. Đặt tên: `NCH_PromptManager` (hoặc tên bạn muốn)
4. **KHÔNG** check "Initialize with README" (vì đã có code local)
5. Click "Create repository"

**Option B: Dùng GitHub CLI (nếu đã cài)**
```bash
gh repo create NCH_PromptManager --public --source=. --remote=origin --push
```

### BƯỚC 5: Thêm Remote Repository

Thay `YOUR_USERNAME` và `REPO_NAME` bằng thông tin của bạn:

```bash
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
```

Ví dụ:
```bash
git remote add origin https://github.com/yourusername/NCH_PromptManager.git
```

### BƯỚC 6: Đổi tên branch chính (nếu cần)

```bash
git branch -M main
```

### BƯỚC 7: Push lên GitHub

```bash
git push -u origin main
```

---

## LỆNH ĐẦY ĐỦ (Copy & Paste)

Nếu đã có GitHub repository, chạy các lệnh sau:

```bash
# 1. Init git
git init

# 2. Add all files
git add .

# 3. Commit
git commit -m "feat: PromptVault v1.0.1 with improved Import/Export"

# 4. Add remote (thay YOUR_USERNAME và REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# 5. Rename branch to main
git branch -M main

# 6. Push
git push -u origin main
```

---

## CẬP NHẬT SAU NÀY

Khi có thay đổi mới, chỉ cần:

```bash
# 1. Xem thay đổi
git status

# 2. Add files đã thay đổi
git add .

# 3. Commit
git commit -m "feat: Mô tả thay đổi"

# 4. Push
git push
```

---

## LƯU Ý

### Files sẽ được commit:
- ✅ Source code (`.tsx`, `.ts`, `.json`, etc.)
- ✅ Documentation (`docs/`)
- ✅ Configuration files
- ✅ Test data (`test-data/`)

### Files sẽ KHÔNG được commit (theo `.gitignore`):
- ❌ `node_modules/`
- ❌ `dist/`
- ❌ `.env.local`
- ❌ Log files

---

## TROUBLESHOOTING

### Lỗi: "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
```

### Lỗi: "failed to push some refs"
```bash
git pull origin main --allow-unrelated-histories
git push -u origin main
```

### Xem remote đã add chưa
```bash
git remote -v
```

---

**Ngày tạo**: 2024  
**Phiên bản**: 1.0
