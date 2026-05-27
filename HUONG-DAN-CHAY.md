# Hướng dẫn chạy hoàn chỉnh — Đồ án quản lý bệnh nhân & thuốc

## 1. Yêu cầu máy

- **Node.js** 18+ ([nodejs.org](https://nodejs.org))
- Trình duyệt **Chrome** hoặc **Edge**

---

## 2. Cài đặt lần đầu

Mở **PowerShell** tại thư mục dự án:

```powershell
cd "c:\Users\Hi\OneDrive\Máy tính\ĐACNPM"
npm run install:all
```

(Lệnh này cài package cho `backend` và `web`.)

---

## 3. Chạy ứng dụng (khuyên dùng khi demo / nộp bài)

```powershell
npm start
```

- Build giao diện web + khởi động server API  
- Mở trình duyệt: **http://localhost:3000**

### Tài khoản

| Vai trò | Username | Password |
|---------|----------|----------|
| Bác sĩ | `bacsi` | `user123` |
| Admin | `admin` | `admin123` |

---

## 4. Chạy khi đang sửa code (2 cửa sổ)

**Cửa sổ 1 — Backend:**

```powershell
cd backend
npm start
```

**Cửa sổ 2 — Web (tự reload):**

```powershell
cd web
npm run dev
```

Mở: **http://localhost:5173**

---

## 5. Chức năng chính (16 task COD1)

Sau khi đăng nhập, dùng menu bên trái:

| Menu | Task |
|------|------|
| Trang chủ | COD1-52 |
| Xem / Cập nhật hồ sơ | COD1-37, 38 |
| Thuốc | COD1-39, 40, 53 |
| Lịch khám / Lịch sử khám | COD1-41, 42, 54 |
| Nhắc uống thuốc | COD1-57 |
| Quản lý user (admin) | COD1-46 |

---

## 6. Chức năng bổ sung (Bác sĩ & Admin)

| Menu | Chức năng |
|------|-----------|
| **Quản lý tất cả BN** | Xem **toàn bộ** bệnh nhân, chọn BN đang quản lý, xem chi tiết thuốc/lịch khám |
| **Thêm bệnh nhân** | Tạo hồ sơ bệnh nhân mới |
| **Xóa bệnh nhân** | Trong màn *Quản lý tất cả BN* — chỉ xóa được khi **đã hết quá trình dùng thuốc** |

### Quy tắc xóa bệnh nhân

- **Được xóa** nếu: chưa có đơn thuốc, **hoặc** tất cả thuốc đã có `ngày kết thúc` và ngày đó **đã qua**.
- **Không xóa** nếu: còn thuốc chưa có ngày kết thúc, hoặc ngày kết thúc chưa tới.

---

## 7. Chạy test

```powershell
npm test
```

Test task COD1 gốc (9 test).

Test bổ sung quản lý/xóa BN:

```powershell
node --test tests/COD1-bonus-manage-patients.test.js
```

---

## 8. Deploy

```powershell
node deploy/COD1-59-deploy.js
```

---

## 9. Lỗi thường gặp

| Triệu chứng | Cách xử lý |
|-------------|------------|
| Trang trắng | Chạy `npm start` hoặc bật backend port 3000 |
| Không đăng nhập được | Kiểm tra backend đang chạy |
| Port 3000 bận | Đóng app khác hoặc `set PORT=3001` rồi chạy lại |
| Nút Xóa bị mờ | BN còn thuốc đang điều trị — đợi hết `endDate` hoặc cập nhật ngày kết thúc thuốc |

---

## 10. File bổ sung (upload Jira nếu cần)

| File | Mô tả |
|------|--------|
| `backend/COD1-bonus-manage-all-patients.js` | API quản lý & xóa BN |
| `backend/COD1-bonus-patient-utils.js` | Logic kiểm tra liệu trình thuốc |
| `web/src/COD1-bonus-manage-all-patients.jsx` | Giao diện quản lý tất cả BN |

Chi tiết thêm: `BO-SUNG-THEM-BENH-NHAN.md`
