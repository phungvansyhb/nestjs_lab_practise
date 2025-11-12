# NestJS Docker Cheat Sheet

## 🚀 Quick Start - Development

```bash
# 1. Tạo file .env (nếu chưa có)
cp .env.example .env

# 2. Start tất cả services (NestJS + MySQL)
docker-compose up -d

# 3. Xem logs
docker-compose logs -f app

# 4. Dừng tất cả
docker-compose down
```

## 📋 Các lệnh thường dùng

### Start/Stop

```bash
# Start ở chế độ development với hot reload
docker-compose up

# Start ở background
docker-compose up -d

# Rebuild khi có thay đổi dependencies
docker-compose up --build

# Stop nhưng giữ containers
docker-compose stop

# Stop và xóa containers (giữ data)
docker-compose down

# Stop, xóa containers VÀ xóa database
docker-compose down -v
```

### Logs & Debug

```bash
# Xem tất cả logs
docker-compose logs -f

# Xem logs của app
docker-compose logs -f app

# Xem logs của MySQL
docker-compose logs -f mysql

# Xem 100 dòng cuối
docker-compose logs --tail=100 app
```

### Truy cập Containers

```bash
# SSH vào app container
docker-compose exec app sh

# SSH vào MySQL container
docker-compose exec mysql bash

# Chạy MySQL client
docker-compose exec mysql mysql -u sypv -proot test

# Chạy lệnh npm trong container
docker-compose exec app npm run test
```

### Database Management

```bash
# Backup database
docker-compose exec mysql mysqldump -u sypv -proot test > backup.sql

# Restore database
docker-compose exec -T mysql mysql -u sypv -proot test < backup.sql

# Xem tables
docker-compose exec mysql mysql -u sypv -proot test -e "SHOW TABLES;"
```

### Container Status

```bash
# Xem trạng thái containers
docker-compose ps

# Xem resource usage
docker stats

# Xem networks
docker network ls

# Xem volumes
docker volume ls
```

## 🔧 Troubleshooting

### Port conflicts

```bash
# Nếu port 3000 bị chiếm, sửa trong docker-compose.yml:
ports:
  - "3001:3000"  # Change 3001 to any free port
```

### MySQL không start

```bash
# Xóa và tạo lại volumes
docker-compose down -v
docker-compose up
```

### App không connect được MySQL

```bash
# Kiểm tra DB_HOST trong .env phải là "mysql"
DB_HOST=mysql

# Kiểm tra MySQL đã ready chưa
docker-compose logs mysql
```

### Xóa tất cả và bắt đầu lại

```bash
docker-compose down -v
docker-compose up --build
```

## 🌐 Truy cập Services

- **NestJS API**: http://localhost:3000
- **MySQL**: localhost:3306
  - Username: sypv
  - Password: root
  - Database: test

## 📁 File Structure

```
project/
├── Dockerfile              # Production build
├── Dockerfile.dev          # Development build
├── docker-compose.yml      # Dev environment
├── docker-compose.prod.yml # Production environment
├── .dockerignore          # Files to ignore in Docker
├── .env                   # Environment variables
├── .env.example          # Template for .env
└── init.sql              # Initial SQL scripts
```

## 🔄 Development Workflow

1. **Start**: `docker-compose up -d`
2. **Code**: Edit files in your editor
3. **Auto-reload**: Changes automatically restart the server
4. **Logs**: `docker-compose logs -f app`
5. **Stop**: `docker-compose down`

## 🚢 Production Deployment

```bash
# Build production image
docker-compose -f docker-compose.prod.yml build

# Start production
docker-compose -f docker-compose.prod.yml up -d

# Check status
docker-compose -f docker-compose.prod.yml ps
```

## 📊 Monitoring

```bash
# View resource usage
docker stats

# Check health
docker-compose ps

# Inspect container
docker inspect nestjs-app-dev
```
