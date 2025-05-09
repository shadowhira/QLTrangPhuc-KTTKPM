/**
 * Script để tạo dữ liệu mẫu cho thống kê doanh thu năm 2024 và 2025
 * 
 * Cách sử dụng:
 * 1. Đảm bảo MongoDB đã được khởi động
 * 2. Chạy script này để tạo dữ liệu mẫu
 */

// Kết nối đến MongoDB
db = db.getSiblingDB('statisticsdb');

// Hàm tạo dữ liệu thống kê doanh thu cho một năm
function generateYearlyStats(year) {
  // Tạo dữ liệu thống kê theo năm
  const yearlyRevenue = Math.floor(Math.random() * 50000000) + 100000000; // 100M - 150M
  const yearlyOrders = Math.floor(Math.random() * 100) + 200; // 200 - 300 đơn hàng
  
  const yearStats = {
    kyThongKe: "NAM",
    giaTriKy: year.toString(),
    ngayBatDau: new Date(`${year}-01-01T00:00:00`),
    ngayKetThuc: new Date(`${year}-12-31T23:59:59`),
    tongDoanhThu: yearlyRevenue,
    tongDonHang: yearlyOrders,
    ngayTao: new Date()
  };
  
  db.thong_ke_doanh_thu.insertOne(yearStats);
  print(`Đã tạo thống kê doanh thu năm ${year}`);
  
  // Tạo dữ liệu thống kê theo quý
  const quarterlyStats = [];
  for (let quarter = 1; quarter <= 4; quarter++) {
    const startMonth = (quarter - 1) * 3 + 1;
    const endMonth = quarter * 3;
    const endDay = (endMonth === 2) ? (year % 4 === 0 ? 29 : 28) : 
                  (endMonth === 4 || endMonth === 6 || endMonth === 9 || endMonth === 11) ? 30 : 31;
    
    const quarterlyRevenue = Math.floor(yearlyRevenue / 4 * (0.8 + Math.random() * 0.4)); // Biến động 80-120% so với trung bình
    const quarterlyOrders = Math.floor(yearlyOrders / 4 * (0.8 + Math.random() * 0.4)); // Biến động 80-120% so với trung bình
    
    quarterlyStats.push({
      kyThongKe: "QUY",
      giaTriKy: `${year}-Q${quarter}`,
      ngayBatDau: new Date(`${year}-${startMonth.toString().padStart(2, '0')}-01T00:00:00`),
      ngayKetThuc: new Date(`${year}-${endMonth.toString().padStart(2, '0')}-${endDay}T23:59:59`),
      tongDoanhThu: quarterlyRevenue,
      tongDonHang: quarterlyOrders,
      ngayTao: new Date()
    });
  }
  
  db.thong_ke_doanh_thu.insertMany(quarterlyStats);
  print(`Đã tạo thống kê doanh thu theo quý cho năm ${year}`);
  
  // Tạo dữ liệu thống kê theo tháng
  const monthlyStats = [];
  for (let month = 1; month <= 12; month++) {
    const daysInMonth = (month === 2) ? (year % 4 === 0 ? 29 : 28) : 
                        (month === 4 || month === 6 || month === 9 || month === 11) ? 30 : 31;
    
    const monthlyRevenue = Math.floor(yearlyRevenue / 12 * (0.7 + Math.random() * 0.6)); // Biến động 70-130% so với trung bình
    const monthlyOrders = Math.floor(yearlyOrders / 12 * (0.7 + Math.random() * 0.6)); // Biến động 70-130% so với trung bình
    
    monthlyStats.push({
      kyThongKe: "THANG",
      giaTriKy: `${year}-${month.toString().padStart(2, '0')}`,
      ngayBatDau: new Date(`${year}-${month.toString().padStart(2, '0')}-01T00:00:00`),
      ngayKetThuc: new Date(`${year}-${month.toString().padStart(2, '0')}-${daysInMonth}T23:59:59`),
      tongDoanhThu: monthlyRevenue,
      tongDonHang: monthlyOrders,
      ngayTao: new Date()
    });
  }
  
  db.thong_ke_doanh_thu.insertMany(monthlyStats);
  print(`Đã tạo thống kê doanh thu theo tháng cho năm ${year}`);
}

// Tạo dữ liệu thống kê doanh thu cho năm 2024
generateYearlyStats(2024);

// Tạo dữ liệu thống kê doanh thu cho năm 2025
generateYearlyStats(2025);

print("Đã tạo dữ liệu mẫu cho thống kê doanh thu năm 2024 và 2025 thành công!");
