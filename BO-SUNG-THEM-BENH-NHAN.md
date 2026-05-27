# Bổ sung: Quản lý bệnh nhân (Bác sĩ & Admin)

## Cập nhật mới

- **Quản lý tất cả bệnh nhân** — xem, chọn, chi tiết thuốc/lịch khám  
- **Xóa bệnh nhân** — chỉ khi đã hết quá trình sử dụng thuốc  

---

# Thêm bệnh nhân mới

Tính năng **mở rộng** — không sửa logic các file `COD1-*` gốc.

## File mới

| File | Mô tả |
|------|--------|
| `backend/COD1-bonus-add-patient.js` | API thêm/xem BN |
| `backend/COD1-bonus-manage-all-patients.js` | API quản lý tất cả BN + xóa |
| `backend/COD1-bonus-patient-utils.js` | Kiểm tra hết liệu trình thuốc |
| `web/src/COD1-bonus-add-patient.jsx` | Thêm BN mới |
| `web/src/COD1-bonus-manage-all-patients.jsx` | Quản lý tất cả BN + xóa |
| `web/src/pages/ManagePatients.jsx` | Re-export |
| `web/src/extras/patientStore.js` | Lưu mã BN đang chọn |
| `web/src/extras/navigation.js` | Menu sidebar |

## Cách dùng

1. Đăng nhập `bacsi` / `user123` hoặc `admin` / `admin123`
2. Sidebar → **Thêm bệnh nhân**
3. Điền form → **Thêm bệnh nhân**
4. Trong danh sách, bấm **Chọn quản lý** để đánh dấu BN đang theo dõi

## API

**Thêm BN**

- `GET /api/bonus/patients`
- `POST /api/bonus/patients`

**Quản lý tất cả & xóa**

- `GET /api/bonus/manage/patients` — danh sách + trạng thái thuốc
- `GET /api/bonus/manage/patients/:id` — chi tiết
- `DELETE /api/bonus/manage/patients/:id` — xóa (nếu hết liệu trình thuốc)

## Chạy lại

```powershell
npm run build --prefix web
npm start --prefix backend
```

Hoặc `npm start` tại thư mục gốc.
