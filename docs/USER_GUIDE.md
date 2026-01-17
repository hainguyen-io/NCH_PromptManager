# 📖 USER GUIDE - PROMPTVAULT

## 1. GIỚI THIỆU

PromptVault là ứng dụng quản lý AI prompts cá nhân. Ứng dụng hoạt động hoàn toàn offline, dữ liệu được lưu trữ trong trình duyệt của bạn.

## 2. BẮT ĐẦU

### 2.1. Truy Cập Ứng Dụng

Mở ứng dụng trong trình duyệt. Ứng dụng sẽ tự động load dữ liệu đã lưu (nếu có).

### 2.2. Lần Đầu Sử Dụng

Khi mở lần đầu, bạn sẽ thấy:
- 4 categories mặc định (Coding, Writing, Marketing, Productivity)
- 3 prompts mẫu

## 3. NAVIGATION

### 3.1. Header Navigation

Header có các mục:
- **Home**: Trang chủ với trending prompts
- **Library**: Duyệt tất cả prompts
- **My Prompts**: Quản lý prompts của bạn
- **Categories**: Quản lý categories
- **Settings** (icon): Cài đặt ứng dụng
- **User Profile** (avatar): Quản lý profile

### 3.2. Mobile Navigation

Trên mobile, click icon menu (☰) để mở menu.

## 4. QUẢN LÝ PROMPTS

### 4.1. Xem Prompts

#### 4.1.1. Trang Chủ (Home)

- Hiển thị top 6 prompts theo lượt xem
- Có thể filter theo category
- Click "Browse Library" để xem tất cả

#### 4.1.2. Thư Viện (Library)

- Hiển thị tất cả prompts
- Search bar để tìm kiếm
- Filter theo category
- Click vào card để xem chi tiết

### 4.2. Tạo Prompt Mới

1. Navigate đến **"My Prompts"**
2. Click nút **"New Prompt"**
3. Điền form:
   - **Title** (bắt buộc): Tiêu đề prompt
   - **Content** (bắt buộc): Nội dung prompt
   - **Description** (tùy chọn): Mô tả ngắn
   - **Category**: Chọn category
   - **Tags** (tùy chọn): Tags cách nhau bởi dấu phẩy
4. Click **"Save Prompt"**

### 4.3. Chỉnh Sửa Prompt

1. Vào **"My Prompts"**
2. Click icon **Edit** (✏️) trên prompt card
3. Chỉnh sửa thông tin
4. Click **"Save Prompt"**

### 4.4. Xóa Prompt

1. Vào **"My Prompts"**
2. Click icon **Delete** (🗑️) trên prompt card
3. Confirm trong dialog
4. Prompt sẽ bị xóa

### 4.5. Xem Chi Tiết Prompt

1. Click vào prompt card (bất kỳ đâu)
2. Modal hiển thị:
   - Full content
   - Category badge
   - Tags
   - Author, ngày tạo
   - Lượt xem
3. Actions:
   - **Copy**: Copy nội dung
   - **Save to My Prompts**: Lưu vào collection của bạn

### 4.6. Đánh Dấu Yêu Thích

1. Click icon **Heart** (❤️) trên prompt card
2. Icon sẽ chuyển sang màu đỏ (filled)
3. Click lại để bỏ yêu thích

### 4.7. Copy Prompt

Có 2 cách:
1. **Từ Card**: Click nút **"Copy"** trên card
2. **Từ Modal**: Click nút **"Copy Prompt"** trong modal

Nội dung sẽ được copy vào clipboard, bạn sẽ thấy thông báo "Prompt copied!"

## 5. TÌM KIẾM & LỌC

### 5.1. Tìm Kiếm

1. Vào **"Library"**
2. Nhập từ khóa vào search bar
3. Kết quả hiển thị real-time

**Tìm kiếm trong**:
- Title
- Content
- Tags

### 5.2. Lọc Theo Category

1. Vào **"Library"** hoặc **"Home"**
2. Chọn category từ dropdown
3. Chọn **"All Categories"** để xem tất cả

### 5.3. Kết Hợp Search & Filter

Search và Filter kết hợp với nhau (AND logic):
- Kết quả phải match search term
- VÀ phải thuộc category đã chọn

## 6. QUẢN LÝ CATEGORIES

### 6.1. Xem Categories

Vào **"Categories"** để xem tất cả categories và số lượng prompts trong mỗi category.

### 6.2. Tạo Category Mới

1. Vào **"Categories"**
2. Click **"Add Category"**
3. Điền:
   - **Name**: Tên category
   - **Color**: Chọn màu (color picker)
4. Click **"Save"**

### 6.3. Xóa Category

1. Vào **"Categories"**
2. Click icon **Delete** (🗑️) trên category card
3. **Lưu ý**: Không thể xóa category đang được sử dụng bởi prompts
4. Nếu có thể xóa, confirm trong dialog

## 7. CÀI ĐẶT

### 7.1. Dark Mode

1. Vào **"Settings"**
2. Toggle **"Dark Mode"** switch
3. Theme sẽ thay đổi ngay lập tức
4. Preference được lưu tự động

### 7.2. Export Dữ Liệu

1. Vào **"Settings"**
2. Click **"Export JSON"**
3. File JSON sẽ được download
4. Lưu file để backup

**File format**: `promptvault-backup-YYYY-MM-DD.json`

### 7.3. Import Dữ Liệu

1. Vào **"Settings"**
2. Click **"Import JSON"**
3. Chọn file JSON đã export trước đó
4. Prompts sẽ được merge vào collection hiện tại
5. **Lưu ý**: Chỉ import prompts, không import categories

### 7.4. Reset Ứng Dụng

1. Vào **"Settings"**
2. Click **"Reset Application Data"**
3. **CẢNH BÁO**: Hành động này sẽ xóa TẤT CẢ dữ liệu
4. Confirm trong dialog
5. Ứng dụng sẽ reset về dữ liệu mặc định

## 8. USER PROFILE

### 8.1. Xem Profile

Click avatar ở header để vào trang profile.

### 8.2. Cập Nhật Tên

1. Vào **"User Profile"** (click avatar)
2. Sửa tên trong input
3. Click **"Save Changes"**
4. Avatar initials sẽ tự động update

**Lưu ý**: Tên này sẽ được dùng làm author cho prompts bạn tạo.

## 9. TIPS & TRICKS

### 9.1. Organize với Tags

- Sử dụng tags để phân loại prompts
- Tags cách nhau bởi dấu phẩy
- Ví dụ: `react, typescript, frontend`

### 9.2. Categories vs Tags

- **Categories**: Phân loại chính (Coding, Writing, etc.)
- **Tags**: Phân loại chi tiết (react, seo, email, etc.)

### 9.3. Backup Thường Xuyên

- Export dữ liệu định kỳ
- Lưu file backup ở nơi an toàn
- Có thể import lại khi cần

### 9.4. Search Tips

- Search không phân biệt hoa thường
- Có thể search trong title, content, hoặc tags
- Kết hợp với category filter để tìm chính xác hơn

### 9.5. Favorite Prompts

- Đánh dấu yêu thích prompts thường dùng
- Dễ dàng tìm lại sau này

## 10. FAQ

### 10.1. Dữ Liệu Được Lưu Ở Đâu?

Dữ liệu được lưu trong **localStorage** của trình duyệt. Mỗi trình duyệt có localStorage riêng.

### 10.2. Có Thể Đồng Bộ Đa Thiết Bị Không?

Hiện tại không. Ứng dụng hoạt động offline và lưu trữ local. Để đồng bộ:
1. Export dữ liệu trên thiết bị này
2. Import trên thiết bị khác

### 10.3. Dữ Liệu Có Bị Mất Không?

Dữ liệu lưu trong localStorage, sẽ bị mất nếu:
- Clear browser data
- Dùng Incognito/Private mode (một số trình duyệt)
- Uninstall browser

**Giải pháp**: Export dữ liệu thường xuyên để backup.

### 10.4. Có Giới Hạn Số Lượng Prompts Không?

Không có giới hạn cứng, nhưng localStorage có giới hạn (thường 5-10MB). Với prompts text, có thể lưu hàng nghìn prompts.

### 10.5. Có Thể Chia Sẻ Prompts Không?

Có thể:
1. Export prompts ra JSON
2. Gửi file cho người khác
3. Họ import vào ứng dụng của họ

### 10.6. Tại Sao Không Thể Xóa Category?

Category đang được sử dụng bởi prompts không thể xóa. Phải:
1. Xóa hoặc chuyển category của prompts đó
2. Sau đó mới xóa được category

### 10.7. Dark Mode Không Hoạt Động?

- Check nếu đã toggle trong Settings
- Refresh trang
- Clear cache và reload

## 11. KEYBOARD SHORTCUTS

Hiện tại chưa có keyboard shortcuts. Có thể thêm trong tương lai.

## 12. TROUBLESHOOTING

### 12.1. Ứng Dụng Không Load

- Refresh trang (F5)
- Clear cache và reload
- Check console errors (F12)

### 12.2. Dữ Liệu Bị Mất

- Check localStorage trong DevTools
- Nếu đã export trước đó, import lại
- Nếu chưa export, dữ liệu có thể đã mất

### 12.3. Import Không Hoạt Động

- Check file format (phải là JSON)
- Check file có đúng format PromptVault không
- Check console errors

### 12.4. Search Không Tìm Thấy

- Check spelling
- Thử search với từ khóa khác
- Clear filter category nếu có

## 13. FEEDBACK & SUPPORT

Nếu gặp vấn đề hoặc có đề xuất:
- Check documentation trong `docs/` folder
- Report issues trên repository (nếu có)

---

## TÓM TẮT

PromptVault giúp bạn:
- ✅ Quản lý AI prompts cá nhân
- ✅ Tìm kiếm và filter dễ dàng
- ✅ Organize với categories và tags
- ✅ Backup và restore dữ liệu
- ✅ Hoạt động hoàn toàn offline

**Lưu ý quan trọng**: Export dữ liệu thường xuyên để backup!

---

**Xem thêm:**
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Kiến trúc kỹ thuật
- [DEVELOPMENT.md](./DEVELOPMENT.md) - Hướng dẫn phát triển
