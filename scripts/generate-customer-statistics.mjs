// Script để tạo dữ liệu mẫu cho thống kê khách hàng
import fetch from 'node-fetch';

const API_URL = "http://localhost:8080/api";

// Hàm tạo thống kê doanh thu cho tất cả khách hàng
async function generateAllCustomerStatistics() {
  try {
    console.log("Đang tạo thống kê doanh thu cho tất cả khách hàng...");

    const response = await fetch(`${API_URL}/statistics/khach-hang-doanh-thu/generate-all`, {
      method: 'POST'
    });

    if (!response.ok) {
      console.error("Lỗi khi tạo thống kê khách hàng:", response.status);
      return null;
    }

    const data = await response.json();
    console.log("Đã tạo thống kê doanh thu cho tất cả khách hàng:", data.length, "bản ghi");
    return data;
  } catch (error) {
    console.error("Lỗi khi tạo thống kê khách hàng:", error);
    return null;
  }
}

// Hàm tạo thống kê doanh thu cho một khách hàng cụ thể
async function generateCustomerStatistics(customerId) {
  try {
    const response = await fetch(`${API_URL}/statistics/khach-hang-doanh-thu/generate/${customerId}`, {
      method: 'POST'
    });

    if (!response.ok) {
      console.error(`Lỗi khi tạo thống kê cho khách hàng ID=${customerId}:`, response.status);
      return null;
    }

    const data = await response.json();
    console.log(`Đã tạo thống kê cho khách hàng ID=${customerId}:`, data);
    return data;
  } catch (error) {
    console.error(`Lỗi khi tạo thống kê cho khách hàng ID=${customerId}:`, error);
    return null;
  }
}

// Hàm chính để tạo dữ liệu mẫu
async function generateSampleData() {
  console.log("Bắt đầu tạo dữ liệu mẫu cho thống kê khách hàng...");

  // Tạo thống kê cho tất cả khách hàng
  await generateAllCustomerStatistics();

  // Tạo thống kê cho từng khách hàng (giả sử có 50 khách hàng)
  for (let customerId = 1; customerId <= 50; customerId++) {
    await generateCustomerStatistics(customerId);
  }

  console.log("Hoàn thành tạo dữ liệu mẫu cho thống kê khách hàng!");
}

// Chạy hàm tạo dữ liệu mẫu
generateSampleData();
