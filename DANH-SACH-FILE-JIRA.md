# Danh sách file upload lên Jira (16 task)

Mỗi dòng = **1 task** = **1 file chính** cần đính kèm ticket.

| Mã Jira | Tên task | File upload lên Jira |
|---------|----------|----------------------|
| **COD1-37** | Xem hồ sơ bệnh nhân | `web/src/COD1-37-view-patient-profile.jsx` |
| **COD1-38** | Cập nhật hồ sơ bệnh nhân | `web/src/COD1-38-update-patient-profile.jsx` |
| **COD1-39** | Thêm lịch sử thuốc | `web/src/COD1-39-add-medication-history.jsx` |
| **COD1-40** | Xem lịch sử thuốc | `web/src/COD1-40-view-medication-history.jsx` |
| **COD1-41** | Đặt lịch khám | `web/src/COD1-41-book-appointment.jsx` + `backend/COD1-41-book-appointment-api.js` |
| **COD1-42** | Xem lịch khám | `web/src/COD1-42-view-appointments.jsx` + `backend/COD1-42-view-appointments-api.js` |
| **COD1-46** | Quản lý người dùng admin | `web/src/COD1-46-admin-users.jsx` + `backend/COD1-46-admin-users.js` |
| **COD1-48** | Tạo API bệnh nhân | `backend/COD1-48-api-patient.js` |
| **COD1-49** | Tạo API lịch sử thuốc | `backend/COD1-49-api-medication.js` |
| **COD1-50** | Tạo API đăng nhập | `backend/COD1-50-auth-login.js` + `web/src/COD1-50-login-screen.jsx` |
| **COD1-52** | Thiết kế giao diện | `web/src/COD1-52-web-interface.jsx` (web) hoặc `mobile/COD1-52-mobile-interface.js` (mobile) |
| **COD1-53** | Màn hình lịch sử thuốc | `web/src/COD1-53-medication-history-screen.jsx` |
| **COD1-54** | Màn hình lịch sử khám | `web/src/COD1-54-examination-history-screen.jsx` + `backend/COD1-54-api-examinations.js` |
| **COD1-57** | Nhận thông báo thuốc | `web/src/COD1-57-medication-notifications.jsx` |
| **COD1-58** | Viết test case | `tests/COD1-58-test-cases.test.js` |
| **COD1-59** | Deploy ứng dụng | `deploy/COD1-59-deploy.js` |

## Ghi chú khi nộp Jira

- Task **giao diện (web)**: upload file trong `web/src/COD1-*.jsx`.
- Task **API backend**: upload file trong `backend/COD1-*.js`.
- Task **COD1-41, 42, 46, 50, 54**: có cả web + API — đính **2 file** hoặc zip 2 file.
- **COD1-52**: ảnh ghi "giao diện mobile" — nếu giáo viên yêu cầu mobile, dùng `mobile/COD1-52-mobile-interface.js`; nếu nộp bản web thì dùng `COD1-52-web-interface.jsx`.

## File hỗ trợ (không bắt buộc đính từng task)

| File | Vai trò |
|------|---------|
| `backend/server.js` | Kết nối tất cả API |
| `backend/db.js` | Dữ liệu mẫu |
| `web/src/App.jsx` | Điều hướng trang web |
| `HUONG-DAN-CHAY.md` | Hướng dẫn chạy |
