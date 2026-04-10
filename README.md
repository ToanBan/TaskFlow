# 🎬 Video Streaming Platform

Một dự án cá nhân mô phỏng hệ thống streaming video

Hệ thống cho phép upload video, xử lý encode nền (background worker), chuyển đổi sang định dạng HLS để phát adaptive streaming, phân quyền người dùng và quản lý qua admin dashboard.

---

## 🚀 Giới thiệu

Dự án được xây dựng nhằm mục tiêu:

- Thực hành kiến trúc backend thực tế
- Xây dựng media processing pipeline
- Triển khai HLS streaming
- Áp dụng phân quyền RBAC (Admin / User)
- Mô phỏng hệ thống video streaming có khả năng mở rộng

---

## 🏗 Kiến trúc hệ thống

Luồng xử lý video:
User Upload ---> Backend API --> MinIO (Lưu File Gốc) --> Queue (Background Job) --> Worker (FFmpeg) --> HLS Output (.m3u8 + .ts) --> MinIO (Lưu File đã xử lý) --> Frontend React (hls)

---

## ✨ Tính năng chính

### 🔐 1. Xác thực & Phân quyền

- Đăng ký / Đăng nhập bằng JWT
- Quên Mật Khẩu
- Đổi Mật Khẩu
- Phân quyền Role (Admin / User)
- Bảo vệ API theo role
- Bảo vệ route frontend theo role

---

### 🎥 2. Video Processing Pipeline

- Upload video gốc
- Normalize định dạng video
- Transcode sang HLS bằng FFmpeg
- Tạo:
  - `index.m3u8`
  - Các segment `.ts`
- Upload thư mục HLS lên MinIO
- Cập nhật trạng thái video:

---

### 📡 3. HLS Adaptive Streaming

- Video được chia thành nhiều segment nhỏ
- Giúp phát mượt, giảm buffering
- Hỗ trợ:
  - hls.js (Chrome, Edge…)
  - Native HLS (Safari)
- Có thể mở rộng multi-bitrate streaming

---

### 🛠 4. Admin Dashboard

Admin có thể:

- Xem toàn bộ video
- Thống kê số lượng theo trạng thái
- Xóa video
- Thay đổi trạng thái video
- Quản lý vòng đời video

---

### 🗂 5. Lưu trữ

Sử dụng MinIO làm object storage:

- Video gốc
- Video đã encode (HLS)
- Thumbnail
- Avatar người dùng

---

## 🧰 Công nghệ sử dụng

### Backend

- Node.js
- NestJS
- Prisma ORM
- MYSQL
- Bull Queue
- FFmpeg
- MinIO
- Docker

### Frontend

- React
- Vite
- TailwindCSS
- hls.js
- Axios
- Dayjs

# 🐳 Docker (Infrastructure Services)

Dự án sử dụng Docker để chạy các dịch vụ hạ tầng bao gồm:

- MySQL (Database)
- MinIO (Object Storage)
- Redis (Queue / Bull)

## 📄 docker-compose.yml

```yaml
services:
  minio:
    image: minio/minio
    ports:
      - "9000:9000"
      - "9001:9001"
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin
    command: server /data --console-address ":9001"
    volumes:
      - minio_data:/data
    restart: always

  mysql:
    image: mysql:8.0.43
    ports:
      - "3306:3306"
    environment:
      MYSQL_ROOT_PASSWORD: root123
      MYSQL_DATABASE: vstream_db
      MYSQL_USER: admin
      MYSQL_PASSWORD: admin123
    command: --default-authentication-plugin=mysql_native_password
    volumes:
      - mysql_data:/var/lib/mysql
    restart: always

  redis:
    image: redis:alpine
    ports:
      - "6379:6379"
    restart: always

volumes:
  minio_data:
  mysql_data:
```
