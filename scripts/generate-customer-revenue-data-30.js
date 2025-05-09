/**
 * Script để tạo 30 bản ghi dữ liệu thống kê khách hàng theo doanh thu
 * 
 * Cách sử dụng:
 * 1. Đảm bảo MongoDB đã được khởi động
 * 2. Chạy script này để tạo dữ liệu mẫu
 */

// Kết nối đến MongoDB
db = db.getSiblingDB('statisticsdb');

// Danh sách họ phổ biến ở Việt Nam
const ho = [
  'Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Phan', 'Vũ', 'Võ', 'Đặng',
  'Bùi', 'Đỗ', 'Hồ', 'Ngô', 'Dương', 'Lý', 'Đào', 'Đinh', 'Mai', 'Trịnh'
];

// Danh sách tên phổ biến ở Việt Nam
const ten = [
  'An', 'Anh', 'Bảo', 'Bình', 'Cường', 'Dũng', 'Duy', 'Đạt', 'Đức', 'Hà',
  'Hải', 'Hiếu', 'Hoàng', 'Hùng', 'Huy', 'Khoa', 'Khánh', 'Lâm', 'Linh', 'Long',
  'Minh', 'Nam', 'Nghĩa', 'Nhân', 'Phong', 'Phúc', 'Quân', 'Quang', 'Sơn', 'Thành',
  'Thiện', 'Thịnh', 'Thuận', 'Tiến', 'Toàn', 'Trung', 'Tú', 'Tuấn', 'Việt', 'Vũ'
];

// Tạo dữ liệu mẫu cho 30 khách hàng
const customers = [];
for (let i = 21; i <= 50; i++) {
  // Tạo tên khách hàng
  const lastName = ho[Math.floor(Math.random() * ho.length)];
  const firstName = ten[Math.floor(Math.random() * ten.length)];
  const fullName = `${lastName} ${firstName}`;
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`;
  
  // Tạo dữ liệu doanh thu theo tháng cho năm 2023, 2024, 2025
  const doanhThuTheoKy = {};
  
  // Năm 2023
  for (let month = 1; month <= 12; month++) {
    // Tạo doanh thu ngẫu nhiên từ 0 đến 5 triệu
    const doanhThu = Math.floor(Math.random() * 5000000);
    doanhThuTheoKy[`2023-${month.toString().padStart(2, '0')}`] = doanhThu;
  }
  
  // Năm 2024
  for (let month = 1; month <= 12; month++) {
    // Tạo doanh thu ngẫu nhiên từ 0 đến 6 triệu (tăng trưởng so với 2023)
    const doanhThu = Math.floor(Math.random() * 6000000);
    doanhThuTheoKy[`2024-${month.toString().padStart(2, '0')}`] = doanhThu;
  }
  
  // Năm 2025
  for (let month = 1; month <= 12; month++) {
    // Tạo doanh thu ngẫu nhiên từ 0 đến 7 triệu (tăng trưởng so với 2024)
    const doanhThu = Math.floor(Math.random() * 7000000);
    doanhThuTheoKy[`2025-${month.toString().padStart(2, '0')}`] = doanhThu;
  }

  // Tính tổng doanh thu
  let tongDoanhThu = 0;
  for (const key in doanhThuTheoKy) {
    tongDoanhThu += doanhThuTheoKy[key];
  }

  // Tạo số đơn hàng ngẫu nhiên từ 5 đến 30
  const tongDonHang = Math.floor(Math.random() * 25) + 5;

  // Tạo thống kê doanh thu khách hàng
  customers.push({
    khachHangId: i,
    tenKhachHang: fullName,
    emailKhachHang: email,
    tongDoanhThu: tongDoanhThu,
    tongDonHang: tongDonHang,
    doanhThuTheoKy: doanhThuTheoKy,
    capNhatLanCuoi: new Date()
  });
}

// Thêm dữ liệu vào MongoDB
db.thong_ke_doanh_thu_khach_hang.insertMany(customers);

print(`Đã tạo ${customers.length} bản ghi dữ liệu thống kê khách hàng theo doanh thu thành công!`);
