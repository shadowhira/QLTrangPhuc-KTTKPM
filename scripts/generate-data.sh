#!/bin/bash

# Script để tạo dữ liệu mẫu cho thống kê

# Kiểm tra xem node-fetch đã được cài đặt chưa
if ! npm list -g node-fetch > /dev/null 2>&1; then
  echo "Cài đặt node-fetch..."
  npm install -g node-fetch
fi

# Kiểm tra tham số dòng lệnh
if [ "$1" == "revenue" ]; then
  echo "=== Tạo dữ liệu mẫu thống kê doanh thu ==="
  node scripts/generate-revenue-statistics.mjs
elif [ "$1" == "customer" ]; then
  echo "=== Tạo dữ liệu mẫu thống kê khách hàng ==="
  node scripts/generate-customer-statistics.mjs
else
  echo "=== Tạo tất cả dữ liệu mẫu ==="
  node scripts/generate-statistics.mjs
fi

echo "Hoàn thành!"
