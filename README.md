# SimpleNote

Một ứng dụng web đơn giản để quản lý thông tin cá nhân, cài đặt giao diện và dữ liệu profile theo mô hình frontend + backend tách riêng.

## Giới thiệu

SimpleNote là dự án mẫu với hai phần chính:
- Frontend: React + Vite
- Backend: Node.js + Express

Project này cho phép người dùng:
- xem và cập nhật tên hiển thị
- đổi theme giao diện (Sáng / Tối)
- lưu mật khẩu vùng kín ở backend
- gọi API từ frontend để đọc và cập nhật dữ liệu profile

## Công nghệ sử dụng

### Frontend
- React
- Vite
- React Router DOM
- TailwindCSS

### Backend
- Node.js
- Express

## Cấu trúc thư mục

```bash
note_web/
├── BE/
│   ├── data/
│   │   └── profile.json
│   ├── index.js
│   ├── package.json
│   └── package-lock.json
├── FE/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   │   └── AppContext.jsx
│   │   ├── pages/
│   │   │   └── Settings.jsx
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── README.md
│   └── vite.config.js
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
git clone <link-github-repository>
cd note_web
```

### 2. Cài đặt frontend

```bash
cd FE
npm install
npm run dev
```

Sau khi chạy, frontend sẽ mở ở:

```bash
http://localhost:5173
```

### 3. Cài đặt backend

Mở terminal mới và chạy:

```bash
cd BE
npm install
node index.js
```

Backend sẽ chạy ở:

```bash
http://localhost:3000
```

## API hiện có

### GET /api/profile
Lấy dữ liệu profile public để frontend hiển thị.

### PUT /api/profile
Cập nhật thông tin profile, bao gồm:
- displayName
- preferences.theme
- password (nếu có)

Dữ liệu lưu trong file:

```bash
BE/data/profile.json
```

## Ví dụ luồng hoạt động

1. Frontend gọi `GET /api/profile`
2. Backend đọc file JSON và trả về dữ liệu public
3. Người dùng đổi tên / theme trên giao diện
4. Frontend gửi `PUT /api/profile`
5. Backend ghi dữ liệu mới vào `profile.json`

## Lưu ý quan trọng

- Không chạy `npm install` ở thư mục gốc vì project không có `package.json` ở root.
- Frontend và backend là hai project riêng biệt nên phải cài đặt dependency riêng cho từng thư mục.
- Nếu muốn chạy đồng thời cả hai, hãy mở hai terminal riêng.

## Tài liệu tham khảo nhanh

```bash
# Frontend
cd FE
npm install
npm run dev

# Backend
cd BE
npm install
node index.js
```

## Tác giả

- Vũ Khoa

## Giấy phép

Dự án này được cung cấp với mục đích học tập và phát triển cá nhân.