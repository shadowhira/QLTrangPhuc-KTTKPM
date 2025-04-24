// Script để tạo dữ liệu khách hàng mẫu
import fetch from 'node-fetch';

const API_URL = "http://localhost:8080/api";

// Hàm để tạm dừng thực thi trong một khoảng thời gian
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Hàm tạo khách hàng mới
async function createCustomer(customerData) {
  try {
    const response = await fetch(`${API_URL}/khach-hang`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(customerData)
    });

    if (!response.ok) {
      console.error(`❌ Lỗi khi tạo khách hàng: ${response.status}`);
      return null;
    }

    const data = await response.json();
    console.log(`✅ Đã tạo khách hàng: ${data.ho} ${data.ten} (ID: ${data.id})`);
    return data;
  } catch (error) {
    console.error(`❌ Lỗi khi tạo khách hàng: ${error.message}`);
    return null;
  }
}

// Hàm tạo dữ liệu khách hàng mẫu
async function generateSampleCustomers(count) {
  console.log(`Bắt đầu tạo ${count} khách hàng mẫu...`);

  const ho = ["Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Huỳnh", "Phan", "Vũ", "Võ", "Đặng", "Bùi", "Đỗ", "Hồ", "Ngô", "Dương", "Lý"];
  const tenDemNam = ["Văn", "Hữu", "Đức", "Thành", "Công", "Minh", "Quang", "Anh", "Tuấn", "Hùng", "Mạnh", "Đạt", "Tùng", "Quân", "Bảo", "Hải"];
  const tenDemNu = ["Thị", "Hồng", "Ngọc", "Yến", "Linh", "Hà", "Mai", "Lan", "Phương", "Thảo", "Hương", "Trang", "Quỳnh", "Nhung", "Vân", "Thanh"];
  const tenNam = ["An", "Bình", "Cường", "Dũng", "Em", "Phúc", "Giang", "Huy", "Khánh", "Lâm", "Minh", "Nam", "Phong", "Quang", "Sơn", "Thắng"];
  const tenNu = ["Anh", "Bích", "Chi", "Diệp", "Hà", "Hoa", "Hương", "Lan", "Linh", "Mai", "Ngọc", "Phương", "Quỳnh", "Thảo", "Trang", "Uyên"];
  
  const tinhThanhPho = ["Hà Nội", "TP. Hồ Chí Minh", "Đà Nẵng", "Hải Phòng", "Cần Thơ", "Huế", "Nha Trang", "Vũng Tàu", "Đà Lạt", "Hạ Long"];
  const quanHuyen = ["Quận 1", "Quận 2", "Quận 3", "Quận 4", "Quận 5", "Quận 6", "Quận 7", "Quận 8", "Quận 9", "Quận 10", "Huyện A", "Huyện B"];

  const customers = [];

  for (let i = 0; i < count; i++) {
    const isNam = Math.random() > 0.5;
    const hoValue = ho[Math.floor(Math.random() * ho.length)];
    const tenDemValue = isNam 
      ? tenDemNam[Math.floor(Math.random() * tenDemNam.length)]
      : tenDemNu[Math.floor(Math.random() * tenDemNu.length)];
    const tenValue = isNam
      ? tenNam[Math.floor(Math.random() * tenNam.length)]
      : tenNu[Math.floor(Math.random() * tenNu.length)];

    const customerData = {
      ho: hoValue,
      ten: `${tenDemValue} ${tenValue}`,
      sdt: `09${Math.floor(10000000 + Math.random() * 90000000)}`,
      email: `${hoValue.toLowerCase()}${tenDemValue.toLowerCase()}${tenValue.toLowerCase()}${Math.floor(Math.random() * 1000)}@example.com`,
      diaChi: {
        thonXom: `Số ${Math.floor(1 + Math.random() * 200)}, Đường ${Math.floor(1 + Math.random() * 50)}`,
        quanHuyen: quanHuyen[Math.floor(Math.random() * quanHuyen.length)],
        tinhThanhPho: tinhThanhPho[Math.floor(Math.random() * tinhThanhPho.length)]
      }
    };

    const customer = await createCustomer(customerData);
    if (customer) {
      customers.push(customer);
      // Đợi một chút để tránh quá tải server
      await sleep(300);
    }
  }

  console.log(`✅ Đã tạo ${customers.length} khách hàng mẫu`);
  return customers;
}

// Hàm chính để tạo dữ liệu mẫu
async function generateData() {
  console.log("=== BẮT ĐẦU TẠO DỮ LIỆU KHÁCH HÀNG MẪU ===");

  // Tạo khách hàng mẫu (thêm 20 khách hàng mới)
  const customers = await generateSampleCustomers(20);

  console.log("=== HOÀN THÀNH TẠO DỮ LIỆU KHÁCH HÀNG MẪU ===");
  return customers;
}

// Chạy hàm tạo dữ liệu mẫu
generateData();
