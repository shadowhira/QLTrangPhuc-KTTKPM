#!/bin/bash

echo "=== Rebuild và restart frontend container ==="

# Kiểm tra Docker
if ! command -v docker &> /dev/null || ! command -v docker-compose &> /dev/null; then
    echo "Lỗi: Docker và Docker Compose cần được cài đặt."
    exit 1
fi

# Dừng và xóa container frontend hiện tại
echo "Dừng và xóa container frontend hiện tại..."
docker-compose stop frontend
docker-compose rm -f frontend

# Rebuild container frontend
echo "Rebuild container frontend..."
docker-compose build frontend

# Khởi động lại container frontend
echo "Khởi động lại container frontend..."
docker-compose up -d frontend

# Kiểm tra trạng thái
echo "=== Trạng thái container frontend ==="
docker-compose ps frontend

echo ""
echo "=== Rebuild và restart hoàn tất ==="
echo "Frontend: http://localhost:3005"
echo ""
echo "Bạn có thể xem logs bằng lệnh: docker-compose logs -f frontend"
