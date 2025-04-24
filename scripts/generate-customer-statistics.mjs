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

// Hàm lấy danh sách khách hàng
async function getCustomers() {
  try {
    const response = await fetch(`${API_URL}/khach-hang`);
    if (!response.ok) {
      console.error(`❌ Lỗi khi lấy danh sách khách hàng: ${response.status}`);
      return [];
    }
    const data = await response.json();
    console.log(`✅ Đã lấy ${data.length} khách hàng`);
    return data;
  } catch (error) {
    console.error(`❌ Lỗi khi lấy danh sách khách hàng: ${error.message}`);
    return [];
  }
}

// Hàm chính để tạo dữ liệu mẫu
async function generateSampleData() {
  console.log("Bắt đầu tạo dữ liệu mẫu cho thống kê khách hàng...");

  // Tạo thống kê cho tất cả khách hàng
  await generateAllCustomerStatistics();

  // Lấy danh sách khách hàng thực tế
  const customers = await getCustomers();

  // Tạo thống kê cho từng khách hàng thực tế
  for (const customer of customers) {
    await generateCustomerStatistics(customer.id);
  }

  console.log("Hoàn thành tạo dữ liệu mẫu cho thống kê khách hàng!");
}

// Chạy hàm tạo dữ liệu mẫu
generateSampleData();
