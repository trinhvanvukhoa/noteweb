# NoteWeb

Dự án web mẫu kết hợp Frontend và Backend để quản lý profile cá nhân, giao diện, và dữ liệu thiết lập người dùng theo mô hình tách riêng.

## Giới thiệu

NoteWeb là một ứng dụng demo cho phép người dùng:
- xem và cập nhật tên hiển thị
- đổi giao diện sáng / tối
- lưu mật khẩu vùng kín trên backend
- tương tác với API để đọc và cập nhật profile

Dự án hiện đang được xây dựng theo cấu trúc riêng biệt:
- Frontend: React + Vite
- Backend: Node.js + Express

## Công nghệ sử dụng

### Frontend
- React
- Vite
- React Router DOM

### Backend
- Node.js
- Express
- CORS

## Cấu trúc thư mục

```bash
noteweb/
├── BE/
│   ├── data/
│   │   └── profile.json
│   ├── server.js
│   └── package.json
├── FE/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   │   └── AppContext.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Private.jsx
│   │   │   └── Settings.jsx
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── README.md
├── README.md
└── .gitignore
```

## Yêu cầu hệ thống

- Node.js >= 18
- npm
- Git

## Cài đặt và chạy dự án

### 1. Clone repository

```bash
git clone <link-repository>
cd noteweb
```

### 2. Khởi động backend

```bash
cd BE
npm install
node server.js
```

Backend sẽ chạy tại:

```bash
http://localhost:3000
```

### 3. Khởi động frontend

Mở terminal mới và chạy:

```bash
cd FE
npm install
npm run dev
```

Frontend sẽ chạy tại:

```bash
http://localhost:5173
```

> Lưu ý: backend đang chạy trên cổng 3000 để tránh xung đột với dịch vụ hệ thống macOS trên cổng 5000.

## API hiện có

### GET /api/profile
Trả về dữ liệu profile hiện tại từ file JSON.

### PUT /api/profile
Cập nhật dữ liệu profile, bao gồm:
- displayName
- theme
- password

Dữ liệu được lưu ở:

```bash
BE/data/profile.json
```

Ví dụ dữ liệu:

```json
{
  "displayName": "Sinh viên",
  "theme": "light",
  "password": ""
}
```

## Luồng hoạt động

1. Frontend gọi `GET /api/profile`
2. Backend đọc file JSON và trả về dữ liệu
3. Người dùng chỉnh sửa tên hiển thị, theme hoặc mật khẩu
4. Frontend gửi dữ liệu qua `PUT /api/profile`
5. Backend ghi lại dữ liệu mới vào `profile.json`

## Ghi chú

- Dự án này là mô hình demo, không phải sản phẩm hoàn chỉnh về note management.
- Frontend và Backend chạy độc lập, nên cần mở hai terminal riêng nếu chạy đồng thời.
- Không chạy `npm install` ở thư mục gốc vì root project không có `package.json`.

## Cách chạy nhanh

```bash
# Backend
cd BE
npm install
node server.js

# Frontend
cd FE
npm install
npm run dev
```

## Tác giả

- Vũ Khoa

## Mục đích dự án

Dự án này nhằm mục đích học tập về:
- React Router
- Context API
- Fetch API / REST
- Node.js + Express
- Tách riêng frontend/backend trong một ứng dụng web đơn giản