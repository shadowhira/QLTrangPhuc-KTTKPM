/**
 * Script để tạo dữ liệu mẫu cho thống kê doanh thu khách hàng
 * 
 * Cách sử dụng:
 * 1. Đảm bảo MongoDB đã được khởi động
 * 2. Chạy script này để tạo dữ liệu mẫu
 */

// Kết nối đến MongoDB
db = db.getSiblingDB('statisticsdb');

// Xóa dữ liệu cũ
db.thong_ke_doanh_thu_khach_hang.drop();

// Tạo dữ liệu mẫu cho 20 khách hàng
const customers = [];
for (let i = 1; i <= 20; i++) {
  // Tạo dữ liệu doanh thu theo tháng
  const doanhThuTheoKy = {};
  for (let month = 1; month <= 12; month++) {
    // Tạo doanh thu ngẫu nhiên từ 0 đến 5 triệu
    const doanhThu = Math.floor(Math.random() * 5000000);
    doanhThuTheoKy[`2023-${month.toString().padStart(2, '0')}`] = doanhThu;
  }

  // Tính tổng doanh thu
  let tongDoanhThu = 0;
  for (const key in doanhThuTheoKy) {
    tongDoanhThu += doanhThuTheoKy[key];
  }

  // Tạo số đơn hàng ngẫu nhiên từ 1 đến 10
  const tongDonHang = Math.floor(Math.random() * 10) + 1;

  // Tạo thống kê doanh thu khách hàng
  customers.push({
    khachHangId: i,
    tenKhachHang: `Khách hàng ${i}`,
    emailKhachHang: `khachhang${i}@example.com`,
    tongDoanhThu: tongDoanhThu,
    tongDonHang: tongDonHang,
    doanhThuTheoKy: doanhThuTheoKy,
    capNhatLanCuoi: new Date()
  });
}

// Thêm dữ liệu vào MongoDB
db.thong_ke_doanh_thu_khach_hang.insertMany(customers);

print("Đã tạo dữ liệu mẫu cho thống kê doanh thu khách hàng thành công!");
