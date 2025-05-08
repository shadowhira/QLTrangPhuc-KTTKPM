#!/bin/bash

echo "=== Dừng hệ thống quản lý khách hàng ==="

# Kiểm tra Docker
if ! command -v docker &> /dev/null || ! command -v docker-compose &> /dev/null; then
    echo "Lỗi: Docker và Docker Compose cần được cài đặt."
    exit 1
fi

# Dừng tất cả các service
echo "Dừng tất cả các service..."
docker-compose down

echo ""
echo "=== Đã dừng tất cả các service ==="
