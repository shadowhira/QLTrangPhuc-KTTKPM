// Script Node.js để tạo dữ liệu mẫu cho thống kê
import fetch from 'node-fetch';

const API_URL = "http://localhost:8080/api";

// Hàm tạo thống kê doanh thu theo tháng
async function generateMonthlyStatistics(year, month) {
  try {
    console.log(`Đang tạo thống kê tháng ${month}/${year}...`);

    const response = await fetch(`${API_URL}/statistics/doanh-thu/monthly?year=${year}&month=${month}`, {
      method: 'POST'
    });

    if (!response.ok) {
      console.error(`❌ Lỗi khi tạo thống kê tháng ${month}/${year}: ${response.status}`);
      return null;
    }

    const data = await response.json();
    console.log(`✅ Đã tạo thống kê tháng ${month}/${year}`);
    return data;
  } catch (error) {
    console.error(`❌ Lỗi khi tạo thống kê tháng ${month}/${year}: ${error.message}`);
    return null;
  }
}

// Hàm tạo thống kê doanh thu theo quý
async function generateQuarterlyStatistics(year, quarter) {
  try {
    console.log(`Đang tạo thống kê quý ${quarter}/${year}...`);

    const response = await fetch(`${API_URL}/statistics/doanh-thu/quarterly?year=${year}&quarter=${quarter}`, {
      method: 'POST'
    });

    if (!response.ok) {
      console.error(`❌ Lỗi khi tạo thống kê quý ${quarter}/${year}: ${response.status}`);
      return null;
    }

    const data = await response.json();
    console.log(`✅ Đã tạo thống kê quý ${quarter}/${year}`);
    return data;
  } catch (error) {
    console.error(`❌ Lỗi khi tạo thống kê quý ${quarter}/${year}: ${error.message}`);
    return null;
  }
}

// Hàm tạo thống kê doanh thu theo năm
async function generateYearlyStatistics(year) {
  try {
    console.log(`Đang tạo thống kê năm ${year}...`);

    const response = await fetch(`${API_URL}/statistics/doanh-thu/yearly?year=${year}`, {
      method: 'POST'
    });

    if (!response.ok) {
      console.error(`❌ Lỗi khi tạo thống kê năm ${year}: ${response.status}`);
      return null;
    }

    const data = await response.json();
    console.log(`✅ Đã tạo thống kê năm ${year}`);
    return data;
  } catch (error) {
    console.error(`❌ Lỗi khi tạo thống kê năm ${year}: ${error.message}`);
    return null;
  }
}

// Hàm tạo thống kê doanh thu cho tất cả khách hàng
async function generateAllCustomerStatistics() {
  try {
    console.log("Đang tạo thống kê doanh thu cho tất cả khách hàng...");

    const response = await fetch(`${API_URL}/statistics/khach-hang-doanh-thu/generate-all`, {
      method: 'POST'
    });

    if (!response.ok) {
      console.error(`❌ Lỗi khi tạo thống kê khách hàng: ${response.status}`);
      return null;
    }

    const data = await response.json();
    console.log(`✅ Đã tạo thống kê doanh thu cho tất cả khách hàng: ${data.length} bản ghi`);
    return data;
  } catch (error) {
    console.error(`❌ Lỗi khi tạo thống kê khách hàng: ${error.message}`);
    return null;
  }
}

// Hàm tạo thống kê doanh thu cho một khách hàng cụ thể
async function generateCustomerStatistics(customerId) {
  try {
    console.log(`Đang tạo thống kê cho khách hàng ID=${customerId}...`);

    const response = await fetch(`${API_URL}/statistics/khach-hang-doanh-thu/generate/${customerId}`, {
      method: 'POST'
    });

    if (!response.ok) {
      console.error(`❌ Lỗi khi tạo thống kê cho khách hàng ID=${customerId}: ${response.status}`);
      return null;
    }

    const data = await response.json();
    console.log(`✅ Đã tạo thống kê cho khách hàng ID=${customerId}`);
    return data;
  } catch (error) {
    console.error(`❌ Lỗi khi tạo thống kê cho khách hàng ID=${customerId}: ${error.message}`);
    return null;
  }
}

// Hàm tạo dữ liệu mẫu cho thống kê doanh thu
async function generateRevenueStats() {
  console.log("Bắt đầu tạo dữ liệu mẫu cho thống kê doanh thu...");

  // Tạo thống kê theo tháng cho 3 năm gần đây
  const currentYear = new Date().getFullYear();

  // Tạo thống kê theo tháng
  for (let year = currentYear - 2; year <= currentYear; year++) {
    for (let month = 1; month <= 12; month++) {
      await generateMonthlyStatistics(year, month);
    }
  }

  // Tạo thống kê theo quý
  for (let year = currentYear - 2; year <= currentYear; year++) {
    for (let quarter = 1; quarter <= 4; quarter++) {
      await generateQuarterlyStatistics(year, quarter);
    }
  }

  // Tạo thống kê theo năm
  for (let year = currentYear - 10; year <= currentYear; year++) {
    await generateYearlyStatistics(year);
  }

  console.log("✅ Hoàn thành tạo dữ liệu mẫu cho thống kê doanh thu!");
}

// Hàm tạo dữ liệu mẫu cho thống kê khách hàng
async function generateCustomerStats() {
  console.log("Bắt đầu tạo dữ liệu mẫu cho thống kê khách hàng...");

  // Tạo thống kê cho tất cả khách hàng
  await generateAllCustomerStatistics();

  // Tạo thống kê cho từng khách hàng (giả sử có 50 khách hàng)
  for (let customerId = 1; customerId <= 50; customerId++) {
    await generateCustomerStatistics(customerId);
  }

  console.log("✅ Hoàn thành tạo dữ liệu mẫu cho thống kê khách hàng!");
}

// Hàm chính để tạo dữ liệu mẫu
async function generateSampleData() {
  console.log("Bắt đầu tạo tất cả dữ liệu mẫu cho thống kê...");

  await generateRevenueStats();
  await generateCustomerStats();

  console.log("✅ Hoàn thành tạo tất cả dữ liệu mẫu cho thống kê!");
}

// Xử lý tham số dòng lệnh
const args = process.argv.slice(2);
if (args.length === 0 || args[0] === 'all') {
  generateSampleData();
} else if (args[0] === 'revenue') {
  generateRevenueStats();
} else if (args[0] === 'customer') {
  generateCustomerStats();
} else {
  console.log(`
Cách sử dụng:
  node generate-statistics.js [all|revenue|customer]

  all       - Tạo tất cả dữ liệu mẫu (mặc định)
  revenue   - Chỉ tạo dữ liệu mẫu thống kê doanh thu
  customer  - Chỉ tạo dữ liệu mẫu thống kê khách hàng
  `);
}
