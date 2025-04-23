# Dự án Spotifo

Dự án Music là một ứng dụng cho phép người dùng tìm kiếm, phát nhạc, và quản lý playlist cá nhân. Dự án sử dụng **React** cho frontend và **Node.js** cho backend.

## Mục tiêu

- Cung cấp nền tảng phát nhạc trực tuyến cho người dùng.
- Cho phép người dùng tìm kiếm bài hát, thêm vào playlist cá nhân.
- Backend xử lý API để lấy dữ liệu bài hát và playlist.
- Quản lý playlist và các bài hát yêu thích.
  
## Công nghệ sử dụng

### Frontend (React)

- **React**: Thư viện JavaScript để xây dựng giao diện người dùng.
- **TypeScript**: Superset của JavaScript giúp phát triển mã nguồn dễ dàng và bảo mật hơn.
- **Vite**: Công cụ build mới và nhanh chóng cho ứng dụng web.
- **Axios**: Thư viện JavaScript để gửi yêu cầu HTTP đến backend.
- **CSS/SCSS**: Để tạo kiểu dáng đẹp cho giao diện người dùng.

### Backend (Node.js)

- **Node.js**: Chạy ứng dụng backend trên nền tảng JavaScript.
- **Express**: Web framework cho Node.js để dễ dàng xây dựng API.
- **MongoDB**: Cơ sở dữ liệu NoSQL để lưu trữ thông tin người dùng, bài hát, và playlist.
- **Mongoose**: Thư viện để kết nối Node.js với MongoDB và thực hiện các thao tác CRUD.
- **JWT (JSON Web Token)**: Để xác thực người dùng và bảo vệ các API.
-** Bạn phải cấu hình thêm file .env (bao gồm node_env,host,post,mongo_url,jwt.. để chạy
## Cài đặt và chạy dự án

### Cài đặt

1. **Clone repository** về máy tính của bạn:
   ```bash
   git clone https://github.com/dnhat106/music.git
2. Mở Terminal 
RUN :npm install
npm run dev
Vậy là dự án đã chạy được rồi
