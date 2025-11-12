# Docker Setup Guide - Development Environment

## 📋 Yêu cầu

- Docker Desktop (Windows/Mac) hoặc Docker Engine (Linux)
- Docker Compose

## 🚀 Cách sử dụng

### 1. Tạo file .env từ template

```bash
cp .env.example .env
```

Hoặc tạo file `.env` với nội dung:
```env
NODE_ENV=development
PORT=3000

DB_TYPE=mysql
DB_HOST=mysql
DB_PORT=3306
DB_USERNAME=sypv
DB_PASSWORD=root
DB_DATABASE=test

CSRF_SECRET=dev-secret-key-change-in-production
```

**Lưu ý:** Khi chạy với Docker, `DB_HOST=mysql` (tên service trong docker-compose)

### 2. Build và chạy containers

```bash
# Build và start tất cả services
docker-compose up --build

# Hoặc chạy ở chế độ background
docker-compose up -d --build
```

### 3. Xem logs

```bash
# Xem logs tất cả services
docker-compose logs -f

# Xem logs của một service cụ thể
docker-compose logs -f app
docker-compose logs -f mysql
```

### 4. Dừng containers

```bash
# Dừng containers nhưng giữ lại data
docker-compose stop

# Dừng và xóa containers (giữ lại volumes)
docker-compose down

# Dừng, xóa containers VÀ volumes (xóa database)
docker-compose down -v
```

## 🔧 Các lệnh hữu ích

### Truy cập vào container

```bash
# Truy cập NestJS app container
docker-compose exec app sh

# Truy cập MySQL container
docker-compose exec mysql bash
```

### Kết nối MySQL từ container

```bash
docker-compose exec mysql mysql -u sypv -proot test
```

### Rebuild khi thay đổi dependencies

```bash
docker-compose down
docker-compose up --build
```

### Xem trạng thái containers

```bash
docker-compose ps
```

### Xem resource usage

```bash
docker stats
```

## 📦 Cấu trúc

- **Dockerfile.dev**: Dockerfile cho môi trường development
- **docker-compose.yml**: Cấu hình services (app + MySQL)
- **.dockerignore**: Các file/folder không copy vào Docker image
- **init.sql**: SQL scripts chạy khi khởi tạo database lần đầu

## 🔄 Hot Reload

Code changes sẽ tự động reload nhờ volume mount:
```yaml
volumes:
  - .:/app
  - /app/node_modules
```

Chỉnh sửa code trong folder project và server sẽ tự động restart!

## 🗄️ Database

### Truy cập MySQL từ host machine

- **Host**: localhost
- **Port**: 3306
- **Username**: sypv
- **Password**: root
- **Database**: test

### Connection string

```
mysql://sypv:root@localhost:3306/test
```

### Sử dụng MySQL Workbench hoặc các tool khác

Bạn có thể kết nối đến MySQL container từ host machine bằng các tool như:
- MySQL Workbench
- DBeaver
- TablePlus
- DataGrip

## 🐛 Troubleshooting

### Port đã được sử dụng

Nếu port 3000 hoặc 3306 đã được sử dụng, thay đổi trong `docker-compose.yml`:

```yaml
services:
  app:
    ports:
      - "3001:3000"  # Host:Container
  
  mysql:
    ports:
      - "3307:3306"  # Host:Container
```

### MySQL không start được

```bash
# Xóa volume và recreate
docker-compose down -v
docker-compose up --build
```

### App không kết nối được MySQL

Đảm bảo `DB_HOST=mysql` trong file `.env` hoặc docker-compose environment.

### Xem chi tiết lỗi

```bash
docker-compose logs -f app
docker-compose logs -f mysql
```

## 🌐 Truy cập ứng dụng

- **API**: http://localhost:3000
- **Health check**: http://localhost:3000 (hoặc endpoint của bạn)
- **CSRF token**: http://localhost:3000/csrf/token

## 📝 Development Workflow

1. Start containers: `docker-compose up -d`
2. Xem logs: `docker-compose logs -f app`
3. Edit code trong editor của bạn
4. Changes tự động reload
5. Test API tại http://localhost:3000
6. Stop containers: `docker-compose down`

## 🔒 Production Notes

Để chạy production:
1. Tạo `Dockerfile` riêng (không phải `.dev`)
2. Build production image
3. Disable `synchronize: true` trong TypeORM
4. Sử dụng secrets management
5. Setup proper environment variables
6. Use health checks và monitoring
