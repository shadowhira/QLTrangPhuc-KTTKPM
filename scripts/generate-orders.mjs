// Script để tạo dữ liệu đơn hàng mẫu
import fetch from 'node-fetch';

const API_URL = "http://localhost:8080/api";

// Hàm để tạm dừng thực thi trong một khoảng thời gian
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
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

// Hàm lấy danh sách sản phẩm
async function getProducts() {
  try {
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

// Hàm tạo đơn hàng mới
async function createOrder(orderData) {
  try {
    const response = await fetch(`${API_URL}/don-dat-trang-phuc`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    });

    if (!response.ok) {
      console.error(`❌ Lỗi khi tạo đơn hàng: ${response.status}`);
      return null;
    }

    const data = await response.json();
    console.log(`✅ Đã tạo đơn hàng cho khách hàng ID=${orderData.khachHangId}, tổng tiền: ${data.tongTien.toLocaleString('vi-VN')} VNĐ`);
    return data;
  } catch (error) {
    console.error(`❌ Lỗi khi tạo đơn hàng: ${error.message}`);
    return null;
  }
}

// Hàm cập nhật trạng thái đơn hàng
async function updateOrderStatus(orderId, status) {
  try {
    // Sử dụng PATCH thay vì PUT và truyền trangThai qua query parameter
    const response = await fetch(`${API_URL}/don-dat-trang-phuc/${orderId}/trang-thai?trangThai=${encodeURIComponent(status)}`, {
      method: 'PATCH'
    });

    if (!response.ok) {
      console.error(`❌ Lỗi khi cập nhật trạng thái đơn hàng: ${response.status}`);
      return false;
    }

    console.log(`✅ Đã cập nhật trạng thái đơn hàng ID=${orderId} thành "${status}"`);
    return true;
  } catch (error) {
    console.error(`❌ Lỗi khi cập nhật trạng thái đơn hàng: ${error.message}`);
    return false;
  }
}

// Hàm tạo đơn hàng mẫu
async function generateSampleOrders(customers, products, maxOrdersPerCustomer) {
  console.log(`Bắt đầu tạo đơn hàng mẫu cho ${customers.length} khách hàng...`);

  const trangThai = ["Đã thanh toán", "Đang chờ xử lý", "Đã hủy", "Đang giao hàng", "Hoàn thành"];
  const orders = [];

  for (const customer of customers) {
    // Tạo ngẫu nhiên từ 1 đến maxOrdersPerCustomer đơn hàng cho mỗi khách hàng
    const numOrders = Math.floor(1 + Math.random() * maxOrdersPerCustomer);
    console.log(`Tạo ${numOrders} đơn hàng cho khách hàng ${customer.ho} ${customer.ten} (ID: ${customer.id})`);

    for (let i = 0; i < numOrders; i++) {
      // Tạo ngẫu nhiên từ 1 đến 5 sản phẩm cho mỗi đơn hàng
      const numProducts = Math.floor(1 + Math.random() * 5);
      const chiTietDonDats = [];

      // Chọn ngẫu nhiên sản phẩm cho đơn hàng
      const selectedProductIndices = new Set();
      while (selectedProductIndices.size < numProducts && selectedProductIndices.size < products.length) {
        const randomIndex = Math.floor(Math.random() * products.length);
        selectedProductIndices.add(randomIndex);
      }

      // Tạo chi tiết đơn hàng
      for (const index of selectedProductIndices) {
        const product = products[index];
        const soLuong = Math.floor(1 + Math.random() * 3); // 1-3 sản phẩm

        chiTietDonDats.push({
          trangPhucId: product.id,
          soLuongDat: soLuong,
          donGia: product.giaBan || product.giaThueNgay
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

// Hàm chính để tạo dữ liệu mẫu
async function generateData() {
  console.log("=== BẮT ĐẦU TẠO DỮ LIỆU ĐƠN HÀNG MẪU ===");

  // 1. Lấy danh sách khách hàng
  const customers = await getCustomers();
  if (customers.length === 0) {
    console.error("❌ Không có khách hàng để tạo đơn hàng!");
    return;
  }

  // 2. Lấy danh sách sản phẩm
  const products = await getProducts();
  if (products.length === 0) {
    console.error("❌ Không có sản phẩm để tạo đơn hàng!");
    return;
  }

  // 3. Tạo đơn hàng mẫu
  await generateSampleOrders(customers, products, 5); // Tạo tối đa 5 đơn hàng cho mỗi khách hàng

  console.log("=== HOÀN THÀNH TẠO DỮ LIỆU ĐƠN HÀNG MẪU ===");
}

// Chạy hàm tạo dữ liệu mẫu
generateData();
