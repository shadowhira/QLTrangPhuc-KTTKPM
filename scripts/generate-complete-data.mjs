// Script toàn diện để tạo dữ liệu mẫu cho hệ thống
import fetch from 'node-fetch';

const API_URL = "http://localhost:8080/api";

// Hàm để tạm dừng thực thi trong một khoảng thời gian
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Hàm tạo khách hàng mới
async function createCustomer(customerData) {
  try {
    console.log(`Đang tạo khách hàng: ${customerData.ho} ${customerData.ten}...`);

    const response = await fetch(`${API_URL}/khach-hang`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customerData),
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

// Hàm tạo đơn hàng mới
async function createOrder(orderData) {
  try {
    console.log(`Đang tạo đơn hàng cho khách hàng ID=${orderData.khachHangId}...`);

    const response = await fetch(`${API_URL}/don-dat-trang-phuc`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      console.error(`❌ Lỗi khi tạo đơn hàng: ${response.status}`);
      return null;
    }

    const data = await response.json();
    console.log(`✅ Đã tạo đơn hàng ID=${data.id} cho khách hàng ID=${data.khachHangId}`);
    return data;
  } catch (error) {
    console.error(`❌ Lỗi khi tạo đơn hàng: ${error.message}`);
    return null;
  }
}

// Hàm cập nhật trạng thái đơn hàng
async function updateOrderStatus(orderId, status) {
  try {
    console.log(`Đang cập nhật trạng thái đơn hàng ID=${orderId} thành "${status}"...`);

    const response = await fetch(`${API_URL}/don-dat-trang-phuc/${orderId}/trang-thai?trangThai=${encodeURIComponent(status)}`, {
      method: 'PATCH',
    });

    if (!response.ok) {
      console.error(`❌ Lỗi khi cập nhật trạng thái đơn hàng: ${response.status}`);
      return null;
    }

    const data = await response.json();
    console.log(`✅ Đã cập nhật trạng thái đơn hàng ID=${orderId} thành "${status}"`);
    return data;
  } catch (error) {
    console.error(`❌ Lỗi khi cập nhật trạng thái đơn hàng: ${error.message}`);
    return null;
  }
}

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

// Hàm lấy danh sách sản phẩm
async function getProducts() {
  try {
    console.log("Đang lấy danh sách sản phẩm...");

    const response = await fetch(`${API_URL}/trang-phuc`);

    if (!response.ok) {
      console.error(`❌ Lỗi khi lấy danh sách sản phẩm: ${response.status}`);
      return [];
    }

    const data = await response.json();
    console.log(`✅ Đã lấy ${data.length} sản phẩm`);
    return data;
  } catch (error) {
    console.error(`❌ Lỗi khi lấy danh sách sản phẩm: ${error.message}`);
    return [];
  }
}

// Hàm tạo dữ liệu khách hàng mẫu
async function generateSampleCustomers(count) {
  console.log(`Bắt đầu tạo ${count} khách hàng mẫu...`);

  const ho = ["Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Huỳnh", "Phan", "Vũ", "Võ", "Đặng", "Bùi", "Đỗ", "Hồ", "Ngô", "Dương", "Lý"];
  const tenNam = ["Văn", "Hữu", "Đức", "Thành", "Công", "Minh", "Quang", "Anh", "Tuấn", "Hùng", "Mạnh", "Đạt", "Tùng", "Quân", "Bảo", "Hải"];
  const tenNu = ["Thị", "Hồng", "Ngọc", "Yến", "Linh", "Hà", "Mai", "Lan", "Phương", "Thảo", "Hương", "Trang", "Quỳnh", "Nhung", "Vân", "Thanh"];
  const ten = ["An", "Bình", "Cường", "Dũng", "Em", "Phúc", "Giang", "Huy", "Khánh", "Lâm", "Minh", "Nam", "Phong", "Quang", "Sơn", "Thắng", "Uy", "Vinh", "Xuân", "Yên"];

  const quanHuyen = ["Quận 1", "Quận 2", "Quận 3", "Quận 4", "Quận 5", "Quận 6", "Quận 7", "Quận 8", "Quận 9", "Quận 10", "Quận 11", "Quận 12", "Quận Bình Thạnh", "Quận Tân Bình", "Quận Gò Vấp"];
  const tinhThanhPho = ["TP. Hồ Chí Minh", "Hà Nội", "Đà Nẵng", "Cần Thơ", "Hải Phòng", "Nha Trang", "Huế", "Vũng Tàu", "Đà Lạt", "Phan Thiết"];

  const customers = [];

  for (let i = 0; i < count; i++) {
    const isNam = Math.random() > 0.5;
    const hoValue = ho[Math.floor(Math.random() * ho.length)];
    const tenDemValue = isNam ? tenNam[Math.floor(Math.random() * tenNam.length)] : tenNu[Math.floor(Math.random() * tenNu.length)];
    const tenValue = ten[Math.floor(Math.random() * ten.length)];

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

// Hàm tạo đơn hàng mẫu cho các khách hàng
async function generateSampleOrders(customers, products, ordersPerCustomer) {
  console.log(`Bắt đầu tạo đơn hàng mẫu cho ${customers.length} khách hàng...`);

  const orders = [];
  const trangThai = ["Chờ xác nhận", "Đã xác nhận", "Đang giao hàng", "Đã giao hàng", "Đã thanh toán", "Đã hủy"];

  for (const customer of customers) {
    const orderCount = Math.floor(1 + Math.random() * ordersPerCustomer);

    for (let i = 0; i < orderCount; i++) {
      // Tạo chi tiết đơn hàng
      const chiTietCount = Math.floor(1 + Math.random() * 3); // 1-3 sản phẩm mỗi đơn
      const chiTietDonDats = [];

      for (let j = 0; j < chiTietCount; j++) {
        const product = products[Math.floor(Math.random() * products.length)];
        const soLuong = Math.floor(1 + Math.random() * 3); // 1-3 sản phẩm mỗi loại

        chiTietDonDats.push({
          trangPhucId: product.id,
          soLuongDat: soLuong,
          donGia: product.giaBan
        });
      }

      // Tạo ngày đặt ngẫu nhiên trong 3 năm gần đây
      const currentYear = new Date().getFullYear();
      const year = currentYear - Math.floor(Math.random() * 3); // 0-2 năm trước
      const month = Math.floor(1 + Math.random() * 12); // 1-12 tháng
      const day = Math.floor(1 + Math.random() * 28); // 1-28 ngày
      const ngayDat = new Date(year, month - 1, day).toISOString();

      const orderData = {
        khachHangId: customer.id,
        ngayDat: ngayDat,
        chiTietDonDats: chiTietDonDats
      };

      const order = await createOrder(orderData);
      if (order) {
        // Cập nhật trạng thái đơn hàng
        const status = trangThai[Math.floor(Math.random() * trangThai.length)];
        await updateOrderStatus(order.id, status);

        orders.push(order);
        // Đợi một chút để tránh quá tải server
        await sleep(300);
      }
    }
  }

  console.log(`✅ Đã tạo ${orders.length} đơn hàng mẫu`);
  return orders;
}

// Hàm tạo dữ liệu thống kê doanh thu
async function generateRevenueStatistics() {
  console.log("Bắt đầu tạo dữ liệu thống kê doanh thu...");

  // Tạo thống kê theo tháng cho 3 năm gần đây
  const currentYear = new Date().getFullYear();

  // Tạo thống kê theo tháng
  for (let year = currentYear - 2; year <= currentYear; year++) {
    for (let month = 1; month <= 12; month++) {
      await generateMonthlyStatistics(year, month);
      await sleep(300); // Đợi một chút để tránh quá tải server
    }
  }

  // Tạo thống kê theo quý
  for (let year = currentYear - 2; year <= currentYear; year++) {
    for (let quarter = 1; quarter <= 4; quarter++) {
      await generateQuarterlyStatistics(year, quarter);
      await sleep(300); // Đợi một chút để tránh quá tải server
    }
  }

  // Tạo thống kê theo năm
  for (let year = currentYear - 10; year <= currentYear; year++) {
    await generateYearlyStatistics(year);
    await sleep(300); // Đợi một chút để tránh quá tải server
  }

  console.log("✅ Hoàn thành tạo dữ liệu thống kê doanh thu!");
}

// Hàm tạo dữ liệu thống kê khách hàng
async function generateAllCustomerRevenueStatistics(customers) {
  console.log("Bắt đầu tạo dữ liệu thống kê khách hàng...");

  // Tạo thống kê cho tất cả khách hàng
  await generateAllCustomerStatistics();
  await sleep(500); // Đợi một chút để tránh quá tải server

  // Tạo thống kê cho từng khách hàng
  for (const customer of customers) {
    await generateCustomerStatistics(customer.id);
    await sleep(300); // Đợi một chút để tránh quá tải server
  }

  console.log("✅ Hoàn thành tạo dữ liệu thống kê khách hàng!");
}

// Hàm chính để tạo tất cả dữ liệu mẫu
async function generateAllSampleData() {
  console.log("=== BẮT ĐẦU TẠO DỮ LIỆU MẪU ===");

  // 1. Tạo khách hàng mẫu
  const customers = await generateSampleCustomers(20); // Tạo 20 khách hàng mẫu

  // 2. Lấy danh sách sản phẩm
  const products = await getProducts();

  // 3. Tạo đơn hàng mẫu
  if (products.length > 0) {
    await generateSampleOrders(customers, products, 5); // Tạo tối đa 5 đơn hàng cho mỗi khách hàng
  } else {
    console.error("❌ Không có sản phẩm để tạo đơn hàng!");
  }

  // 4. Tạo dữ liệu thống kê doanh thu
  await generateRevenueStatistics();

  // 5. Tạo dữ liệu thống kê khách hàng
  await generateAllCustomerRevenueStatistics(customers);

  console.log("=== HOÀN THÀNH TẠO DỮ LIỆU MẪU ===");
}

// Chạy hàm tạo dữ liệu mẫu
generateAllSampleData();
