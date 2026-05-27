
# Ứng dụng Web Quản Lý Hồ Sơ Bệnh Nhân & Lịch Sử Dùng Thuốc

Đồ án môn **Công nghệ phần mềm** — hệ thống web hoàn chỉnh (frontend + backend API).

## Công nghệ

| Phần | Công nghệ |
|------|-----------|
| **Trang web** | React + Vite + React Router |
| **Backend API** | Node.js + Express |
| **Test** | Node.js built-in test |

> **Upload Jira:** xem file [`DANH-SACH-FILE-JIRA.md`](DANH-SACH-FILE-JIRA.md) — 16 task, mỗi task 1 file.  
> **Hướng dẫn chạy chi tiết:** [`HUONG-DAN-CHAY.md`](HUONG-DAN-CHAY.md)

## Chạy nhanh (1 lệnh)

```bash
npm run install:all
npm start
```

Mở trình duyệt: **http://localhost:3000**

## Chạy khi đang code (2 terminal)

**Terminal 1 — API:**
```bash
cd backend && npm install && npm start
```

**Terminal 2 — Web (hot reload):**
```bash
cd web && npm install && npm run dev
```

Mở: **http://localhost:5173** (Vite tự proxy `/api` sang port 3000)

## Tài khoản demo

| Username | Password | Vai trò |
|----------|----------|---------|
| `bacsi` | `user123` | Bác sĩ |
| `admin` | `admin123` | Admin |

## Chức năng trên web

| Mã task | Trang web |
|---------|-----------|
| COD1-37 | Xem hồ sơ bệnh nhân |
| COD1-38 | Cập nhật hồ sơ |
| COD1-39 | Thêm lịch sử thuốc |
| COD1-40 | Xem lịch sử thuốc |
| COD1-41 | Đặt lịch khám |
| COD1-42 | Xem lịch khám |
| COD1-46 | Quản lý user (admin) |
| COD1-48–50 | API backend |
| COD1-52 | Trang chủ |
| COD1-53 | Màn hình thuốc chi tiết |
| COD1-54 | Lịch sử khám |
| COD1-57 | Nhắc uống thuốc (thông báo trình duyệt) |
| COD1-58 | Test API |
| COD1-59 | Script deploy |

## Cấu trúc thư mục

```
├── web/              # Giao diện web React (trang chính)
│   └── src/pages/    # Từng chức năng theo task
├── backend/          # API + phục vụ web đã build
├── mobile/           # (tuỳ chọn) phiên bản Expo cũ
├── tests/
└── deploy/
```

## Test API

```bash
npm test
```

