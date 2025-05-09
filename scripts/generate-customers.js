/**
 * Script để tạo 20 khách hàng mới
 * 
 * Cách sử dụng:
 * 1. Đảm bảo PostgreSQL đã được khởi động
 * 2. Chạy script này để tạo dữ liệu mẫu
 */

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

// Danh sách tên đường phổ biến
const duong = [
  'Lê Lợi', 'Nguyễn Huệ', 'Trần Hưng Đạo', 'Lê Duẩn', 'Nguyễn Trãi', 'Lê Thánh Tôn',
  'Phan Đình Phùng', 'Điện Biên Phủ', 'Cách Mạng Tháng Tám', 'Nguyễn Thị Minh Khai',
  'Võ Văn Tần', 'Hai Bà Trưng', 'Lý Thường Kiệt', 'Phan Chu Trinh', 'Nguyễn Công Trứ'
];

// Danh sách quận/huyện
const quan = [
  'Quận 1', 'Quận 2', 'Quận 3', 'Quận 4', 'Quận 5', 'Quận 6', 'Quận 7', 'Quận 8',
  'Quận 9', 'Quận 10', 'Quận 11', 'Quận 12', 'Quận Bình Thạnh', 'Quận Tân Bình', 'Quận Gò Vấp'
];

// Danh sách thành phố
const thanhPho = [
  'TP. Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ', 'Biên Hòa',
  'Nha Trang', 'Huế', 'Quy Nhơn', 'Vũng Tàu', 'Đà Lạt', 'Buôn Ma Thuột', 'Vinh',
  'Hạ Long', 'Phan Thiết'
];

// Hàm tạo số điện thoại ngẫu nhiên
function generatePhoneNumber() {
  const prefixes = ['090', '091', '092', '093', '094', '095', '096', '097', '098', '099'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  let number = '';
  for (let i = 0; i < 7; i++) {
    number += Math.floor(Math.random() * 10);
  }
  return prefix + number;
}

// Hàm tạo email ngẫu nhiên
function generateEmail(firstName, lastName) {
  const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com'];
  const domain = domains[Math.floor(Math.random() * domains.length)];
  const normalizedFirstName = firstName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const normalizedLastName = lastName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return `${normalizedFirstName}.${normalizedLastName}${Math.floor(Math.random() * 1000)}@${domain}`;
}

// Tạo 20 khách hàng mới
const customers = [];
for (let i = 0; i < 20; i++) {
  const firstName = ten[Math.floor(Math.random() * ten.length)];
  const lastName = ho[Math.floor(Math.random() * ho.length)];
  const street = duong[Math.floor(Math.random() * duong.length)];
  const district = quan[Math.floor(Math.random() * quan.length)];
  const city = thanhPho[Math.floor(Math.random() * thanhPho.length)];
  const streetNumber = Math.floor(Math.random() * 200) + 1;
  
  customers.push({
    ho: lastName,
    ten: firstName,
    sdt: generatePhoneNumber(),
    email: generateEmail(firstName, lastName),
    tongChiTieu: Math.floor(Math.random() * 50000000) + 5000000,
    diaChi: {
      soNha: streetNumber.toString(),
      duong: street,
      quan: district,
      thanhPho: city
    }
  });
}

// In ra dữ liệu khách hàng dưới dạng JSON
console.log(JSON.stringify(customers, null, 2));

// Tạo câu lệnh SQL để chèn dữ liệu
let sql = '';
customers.forEach((customer, index) => {
  // Chèn địa chỉ
  sql += `INSERT INTO dia_chi (so_nha, duong, quan, thanh_pho) VALUES ('${customer.diaChi.soNha}', '${customer.diaChi.duong}', '${customer.diaChi.quan}', '${customer.diaChi.thanhPho}') RETURNING id;\n`;
  
  // Chèn khách hàng
  sql += `INSERT INTO khach_hang (ho, ten, sdt, email, tong_chi_tieu, dia_chi_id) VALUES ('${customer.ho}', '${customer.ten}', '${customer.sdt}', '${customer.email}', ${customer.tongChiTieu}, currval('dia_chi_id_seq'));\n\n`;
});

console.log("-- SQL để chèn dữ liệu khách hàng");
console.log(sql);
