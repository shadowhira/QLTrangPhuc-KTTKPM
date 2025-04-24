#!/bin/bash

# Script để tạo đầy đủ dữ liệu mẫu cho hệ thống

echo "=== BẮT ĐẦU TẠO DỮ LIỆU MẪU ĐẦY ĐỦ ==="

# Kiểm tra xem node-fetch đã được cài đặt chưa
if ! npm list -g node-fetch > /dev/null 2>&1; then
  echo "Cài đặt node-fetch..."
  npm install -g node-fetch
fi

# 1. Tạo khách hàng mẫu
echo "1. Tạo khách hàng mẫu..."
node scripts/generate-customers.mjs
echo "Đã hoàn thành tạo khách hàng mẫu."

# 2. Tạo đơn hàng mẫu
echo "2. Tạo đơn hàng mẫu..."
node scripts/generate-orders.mjs
echo "Đã hoàn thành tạo đơn hàng mẫu."

# 3. Tạo dữ liệu thống kê
echo "3. Tạo dữ liệu thống kê..."
node scripts/generate-statistics.mjs
echo "Đã hoàn thành tạo dữ liệu thống kê."

echo "=== HOÀN THÀNH TẠO DỮ LIỆU MẪU ĐẦY ĐỦ ==="
