#!/bin/bash

echo "=== Khởi động hệ thống quản lý khách hàng ==="
echo "Cấu trúc thư mục mới: frontend, api-gateway, customer-service, statistics-service"

# Kiểm tra Docker
if ! command -v docker &> /dev/null || ! command -v docker-compose &> /dev/null; then
    echo "Lỗi: Docker và Docker Compose cần được cài đặt."
    exit 1
fi

# Khởi động tất cả các service bằng Docker Compose
echo "Khởi động tất cả các service..."
docker-compose up -d

# Kiểm tra trạng thái
echo "=== Trạng thái các service ==="
docker-compose ps

echo ""
echo "=== Khởi động hoàn tất ==="
echo "- Frontend: http://localhost:3000"
echo "- API Gateway: http://localhost:8080"
echo "- Customer Service: http://localhost:8081"
echo "- Statistics Service: http://localhost:8082"
echo ""
echo "Bạn có thể xem logs bằng lệnh: docker-compose logs -f"
echo "Để dừng tất cả các service, chạy lệnh: docker-compose down"
