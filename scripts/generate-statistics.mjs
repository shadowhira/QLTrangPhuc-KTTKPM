// Script Node.js để tạo dữ liệu mẫu cho thống kê
import fetch from 'node-fetch';

const API_URL = "http://localhost:8080/api";

// Hàm tạo số ngẫu nhiên trong khoảng
function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Hàm tạo doanh thu thực tế theo tháng
function generateRealisticMonthlyRevenue(year, month) {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  // Doanh thu cơ bản cho mỗi tháng (10-50 triệu)
  let baseRevenue = randomBetween(10000000, 50000000);

  // Tăng doanh thu theo thời gian (càng gần hiện tại càng cao)
  const yearFactor = 1 + (year - (currentYear - 3)) * 0.2; // Tăng 20% mỗi năm

  // Các tháng cao điểm: tháng 1 (Tết), tháng 5-6 (mùa cưới), tháng 11-12 (cuối năm)
  let seasonalFactor = 1.0;
  if (month === 1) seasonalFactor = 1.5; // Tết
  if (month === 5 || month === 6) seasonalFactor = 1.3; // Mùa cưới
  if (month === 11 || month === 12) seasonalFactor = 1.4; // Cuối năm

  // Nếu là tương lai, giảm dần về 0
  if (year > currentYear || (year === currentYear && month > currentMonth)) {
    return 0;
  }

  // Tính toán doanh thu cuối cùng
  const finalRevenue = Math.round(baseRevenue * yearFactor * seasonalFactor);

  return finalRevenue;
}

// Hàm tạo thống kê doanh thu theo tháng
async function generateMonthlyStatistics(year, month) {
  try {
    // Tạo doanh thu thực tế
    const revenue = generateRealisticMonthlyRevenue(year, month);

    // Tạo số lượng đơn hàng (dựa trên doanh thu)
    const orderCount = Math.max(1, Math.floor(revenue / 2000000));

    // Tạo dữ liệu thống kê
    const statisticsData = {
      year: year,
      month: month,
      revenue: revenue,
      orderCount: orderCount
    };

    console.log(`Đang tạo thống kê tháng ${month}/${year} với doanh thu ${revenue.toLocaleString('vi-VN')} VNĐ...`);

    const response = await fetch(`${API_URL}/statistics/doanh-thu/thang?nam=${year}&thang=${month}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(statisticsData)
    });

    if (!response.ok) {
      console.error(`❌ Lỗi khi tạo thống kê tháng ${month}/${year}: ${response.status}`);
      return null;
    }

    const data = await response.json();
    console.log(`✅ Đã tạo thống kê tháng ${month}/${year}: ${revenue.toLocaleString('vi-VN')} VNĐ`);
    return data;
  } catch (error) {
    console.error(`❌ Lỗi khi tạo thống kê tháng ${month}/${year}: ${error.message}`);
    return null;
  }
}

// Hàm tạo thống kê doanh thu theo quý
async function generateQuarterlyStatistics(year, quarter) {
  try {
    // Tính tổng doanh thu của 3 tháng trong quý
    let totalRevenue = 0;
    let totalOrders = 0;

    const startMonth = (quarter - 1) * 3 + 1;
    const endMonth = startMonth + 2;

    for (let month = startMonth; month <= endMonth; month++) {
      const monthlyRevenue = generateRealisticMonthlyRevenue(year, month);
      totalRevenue += monthlyRevenue;
      totalOrders += Math.max(1, Math.floor(monthlyRevenue / 2000000));
    }

    // Tạo dữ liệu thống kê
    const statisticsData = {
      year: year,
      quarter: quarter,
      revenue: totalRevenue,
      orderCount: totalOrders
    };

    console.log(`Đang tạo thống kê quý ${quarter}/${year} với doanh thu ${totalRevenue.toLocaleString('vi-VN')} VNĐ...`);

    const response = await fetch(`${API_URL}/statistics/doanh-thu/quy?nam=${year}&quy=${quarter}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(statisticsData)
    });

    if (!response.ok) {
      console.error(`❌ Lỗi khi tạo thống kê quý ${quarter}/${year}: ${response.status}`);
      return null;
    }

    const data = await response.json();
    console.log(`✅ Đã tạo thống kê quý ${quarter}/${year}: ${totalRevenue.toLocaleString('vi-VN')} VNĐ`);
    return data;
  } catch (error) {
    console.error(`❌ Lỗi khi tạo thống kê quý ${quarter}/${year}: ${error.message}`);
    return null;
  }
}

// Hàm tạo thống kê doanh thu theo năm
async function generateYearlyStatistics(year) {
  try {
    // Tính tổng doanh thu của 12 tháng trong năm
    let totalRevenue = 0;
    let totalOrders = 0;

    for (let month = 1; month <= 12; month++) {
      const monthlyRevenue = generateRealisticMonthlyRevenue(year, month);
      totalRevenue += monthlyRevenue;
      totalOrders += Math.max(1, Math.floor(monthlyRevenue / 2000000));
    }

    // Tạo dữ liệu thống kê
    const statisticsData = {
      year: year,
      revenue: totalRevenue,
      orderCount: totalOrders
    };

    console.log(`Đang tạo thống kê năm ${year} với doanh thu ${totalRevenue.toLocaleString('vi-VN')} VNĐ...`);

    const response = await fetch(`${API_URL}/statistics/doanh-thu/nam?nam=${year}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(statisticsData)
    });

    if (!response.ok) {
      console.error(`❌ Lỗi khi tạo thống kê năm ${year}: ${response.status}`);
      return null;
    }

    const data = await response.json();
    console.log(`✅ Đã tạo thống kê năm ${year}: ${totalRevenue.toLocaleString('vi-VN')} VNĐ`);
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

    const response = await fetch(`${API_URL}/statistics/khach-hang-doanh-thu/tao-tat-ca`, {
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

    const response = await fetch(`${API_URL}/statistics/khach-hang-doanh-thu/tao/${customerId}`, {
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

  // Lấy danh sách khách hàng thực tế
  try {
    const response = await fetch(`${API_URL}/khach-hang`);
    if (response.ok) {
      const customers = await response.json();
      console.log(`Đã lấy ${customers.length} khách hàng để tạo thống kê`);

      // Tạo thống kê cho từng khách hàng thực tế
      for (const customer of customers) {
        await generateCustomerStatistics(customer.id);
      }
    } else {
      console.error(`❌ Lỗi khi lấy danh sách khách hàng: ${response.status}`);
      // Fallback: Tạo thống kê cho 43 khách hàng (dựa trên thông báo trước đó)
      for (let customerId = 1; customerId <= 43; customerId++) {
        await generateCustomerStatistics(customerId);
      }
    }
  } catch (error) {
    console.error(`❌ Lỗi khi lấy danh sách khách hàng: ${error.message}`);
    // Fallback: Tạo thống kê cho 43 khách hàng (dựa trên thông báo trước đó)
    for (let customerId = 1; customerId <= 43; customerId++) {
      await generateCustomerStatistics(customerId);
    }
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
