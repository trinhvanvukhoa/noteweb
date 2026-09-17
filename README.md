# SimpleNote

Một ứng dụng web ghi chú đơn giản, cho phép người dùng tạo, chỉnh sửa, xóa và quản lý các ghi chú cá nhân một cách nhanh chóng, gọn nhẹ.

## Giới thiệu

SimpleNote được xây dựng nhằm giúp người dùng ghi lại ý tưởng, công việc cần làm hoặc thông tin quan trọng mọi lúc mọi nơi, với giao diện tối giản, dễ sử dụng.

## Tính năng

- ✏️ Tạo ghi chú mới
- 📖 Xem danh sách tất cả ghi chú
- 🖊️ Chỉnh sửa nội dung ghi chú
- 🗑️ Xóa ghi chú
- 🔍 Tìm kiếm ghi chú theo từ khóa
- 💾 Lưu trữ dữ liệu bền vững (database)

## Công nghệ sử dụng

**Backend (BE):**
- Node.js
- Express.js
- (Database bạn dùng — ví dụ: MongoDB / MySQL / PostgreSQL)

**Frontend (FE):**
- React
- (Thư viện UI nếu có — ví dụ: TailwindCSS / Material UI)

## Cấu trúc thư mục

```
my-project/
├── BE/                 # Mã nguồn Backend (Node.js + Express)
│   ├── src/
│   ├── package.json
│   └── ...
├── FE/                 # Mã nguồn Frontend (React)
│   ├── src/
│   ├── package.json
│   └── ...
└── README.md
```

## Cài đặt

### 1. Clone dự án

```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
```

### 2. Cài đặt Backend

```bash
cd BE
npm install
```

Tạo file `.env` trong thư mục `BE/` với nội dung tương tự:

```
PORT=5000
DATABASE_URL=your_database_connection_string
```

Chạy server:

```bash
npm start
```

Backend sẽ chạy tại: `http://localhost:5000`

### 3. Cài đặt Frontend

```bash
cd FE
npm install
```

Chạy ứng dụng:

```bash
npm start
```

Frontend sẽ chạy tại: `http://localhost:3000`

## API Endpoints (ví dụ)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET    | `/api/notes` | Lấy danh sách tất cả ghi chú |
| GET    | `/api/notes/:id` | Lấy chi tiết một ghi chú |
| POST   | `/api/notes` | Tạo ghi chú mới |
| PUT    | `/api/notes/:id` | Cập nhật ghi chú |
| DELETE | `/api/notes/:id` | Xóa ghi chú |

## Hình ảnh minh họa

*(Thêm ảnh chụp màn hình giao diện ứng dụng ở đây nếu có)*

## Hướng phát triển trong tương lai

- [ ] Đăng nhập / phân quyền người dùng
- [ ] Gắn thẻ (tag) cho ghi chú
- [ ] Chế độ tối (dark mode)
- [ ] Đồng bộ đa thiết bị

## Tác giả

- **Tên của bạn** — [GitHub](https://github.com/<your-username>)

## Giấy phép

Dự án này được phát hành theo giấy phép MIT.