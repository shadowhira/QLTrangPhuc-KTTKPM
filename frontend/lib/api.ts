// API client để gọi đến backend

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"

// Define KhachHang interface
interface KhachHang {
  id: number
  ten: string
  diaChi: string
  soDienThoai: string
}

// Khách hàng API
export async function fetchKhachHang(searchTerm?: string, page: number = 1, pageSize: number = 10) {
  // Gọi API để lấy tất cả khách hàng
  const response = await fetch(`${API_URL}/khach-hang`);
  if (!response.ok) {
    throw new Error("Failed to fetch customers");
  }

  const allData = await response.json();
  const data = Array.isArray(allData) ? allData : [];

  // Lọc dữ liệu theo searchTerm nếu có
  let filteredData = data;
  if (searchTerm && searchTerm.trim() !== '') {
    const searchTermLower = searchTerm.toLowerCase();
    filteredData = data.filter(customer =>
      (customer.ho + ' ' + customer.ten).toLowerCase().includes(searchTermLower) ||
      (customer.email && customer.email.toLowerCase().includes(searchTermLower)) ||
      (customer.sdt && customer.sdt.toLowerCase().includes(searchTermLower))
    );
  }

  // Tính toán phân trang
  const totalElements = filteredData.length;
  const totalPages = Math.ceil(totalElements / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalElements);
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // Trả về kết quả đã phân trang
  return {
    content: paginatedData,
    totalElements: totalElements,
    totalPages: totalPages || 1,
    currentPage: page
  };
}

export async function fetchKhachHangById(id: number) {
  const response = await fetch(`${API_URL}/khach-hang/${id}`)
  if (!response.ok) {
    throw new Error("Failed to fetch customer")
  }
  return response.json()
}

export async function createKhachHang(khachHang: any) {
  console.log('Creating customer with data:', khachHang);
  try {
    const response = await fetch(`${API_URL}/khach-hang`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(khachHang),
    })

    console.log('response: ', response);

    if (!response.ok) {
      console.error('Error creating customer:', response.status, response.statusText);
      let errorMessage = "Failed to create customer";

      try {
        const errorText = await response.text();
        console.error('Error response:', errorText);

        if (errorText.includes('duplicate key') && errorText.includes('sdt')) {
          errorMessage = "Số điện thoại đã tồn tại";
        } else if (errorText.includes('duplicate key') && errorText.includes('email')) {
          errorMessage = "Email đã tồn tại";
        }
      } catch (e) {
        console.error('Error parsing error response:', e);
      }

      throw new Error(errorMessage);
    }

    // Nếu response có nội dung, parse nó như JSON, nếu không thì trả về true
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    } else {
      return true;
    }
  } catch (error) {
    console.error('Exception in createKhachHang:', error);
    throw error;
  }
}

export async function updateKhachHang(id: number, khachHang: any) {
  console.log('Updating customer with id:', id, 'and data:', khachHang);
  try {
    const response = await fetch(`${API_URL}/khach-hang/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(khachHang),
    })

    if (!response.ok) {
      console.error('Error updating customer:', response.status, response.statusText);
      let errorMessage = "Failed to update customer";

      try {
        const errorText = await response.text();
        console.error('Error response:', errorText);

        if (errorText.includes('duplicate key') && errorText.includes('sdt')) {
          errorMessage = "Số điện thoại đã tồn tại";
        } else if (errorText.includes('duplicate key') && errorText.includes('email')) {
          errorMessage = "Email đã tồn tại";
        }
      } catch (e) {
        console.error('Error parsing error response:', e);
      }

      throw new Error(errorMessage);
    }

    // Nếu response có nội dung, parse nó như JSON, nếu không thì trả về true
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    } else {
      return true;
    }
  } catch (error) {
    console.error('Exception in updateKhachHang:', error);
    throw error;
  }
}

export async function deleteKhachHang(id: number) {
  const response = await fetch(`${API_URL}/khach-hang/${id}`, {
    method: "DELETE",
  })
  if (!response.ok) {
    throw new Error("Failed to delete customer")
  }
  // DELETE thường trả về 204 No Content, không cần parse JSON
  return true
}

// Thống kê API

// Thống kê doanh thu theo khách hàng
export async function fetchThongKeKhachHang() {
  console.log('Fetching customer statistics from:', `${API_URL}/statistics/khach-hang-doanh-thu`);
  try {
    const response = await fetch(`${API_URL}/statistics/khach-hang-doanh-thu`)
    if (!response.ok) {
      console.error('Error fetching statistics:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error response:', errorText);
      // Trả về mảng rỗng thay vì throw error để tránh crash UI
      return [];
    }
    const data = await response.json();
    console.log('Statistics data received:', data);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Exception in fetchThongKeKhachHang:', error);
    // Trả về mảng rỗng thay vì throw error để tránh crash UI
    return [];
  }
}

export async function generateThongKeKhachHang() {
  try {
    const response = await fetch(`${API_URL}/statistics/khach-hang-doanh-thu/generate-all`, {
      method: 'POST'
    });
    if (!response.ok) {
      console.error('Error generating customer statistics:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error response:', errorText);
      return [];
    }
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Exception in generateThongKeKhachHang:', error);
    return [];
  }
}

export async function generateThongKeKhachHangById(customerId: number) {
  try {
    const response = await fetch(`${API_URL}/statistics/khach-hang-doanh-thu/generate/${customerId}`, {
      method: 'POST'
    });
    if (!response.ok) {
      console.error('Error generating customer statistics:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error response:', errorText);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error(`Exception in generateThongKeKhachHangById for customer ${customerId}:`, error);
    return null;
  }
}

// Thống kê doanh thu theo thời gian
export async function fetchThongKeDoanhThu() {
  try {
    const response = await fetch(`${API_URL}/statistics/doanh-thu`);
    if (!response.ok) {
      console.error('Error fetching revenue statistics:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error response:', errorText);
      return [];
    }
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Exception in fetchThongKeDoanhThu:', error);
    return [];
  }
}

export async function fetchThongKeDoanhThuByPeriod(period: string) {
  try {
    const response = await fetch(`${API_URL}/statistics/doanh-thu/ky/${period}`);
    if (!response.ok) {
      console.error('Error fetching revenue statistics by period:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error response:', errorText);
      return [];
    }
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error(`Exception in fetchThongKeDoanhThuByPeriod for period ${period}:`, error);
    return [];
  }
}

export async function generateThongKeDoanhThuThang(year: number, month: number) {
  try {
    const response = await fetch(`${API_URL}/statistics/doanh-thu/thang?nam=${year}&thang=${month}`, {
      method: 'POST'
    });
    if (!response.ok) {
      console.error('Error generating monthly revenue statistics:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error response:', errorText);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error(`Exception in generateThongKeDoanhThuThang for ${year}-${month}:`, error);
    return null;
  }
}

export async function generateThongKeDoanhThuQuy(year: number, quarter: number) {
  try {
    const response = await fetch(`${API_URL}/statistics/doanh-thu/quy?nam=${year}&quy=${quarter}`, {
      method: 'POST'
    });
    if (!response.ok) {
      console.error('Error generating quarterly revenue statistics:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error response:', errorText);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error(`Exception in generateThongKeDoanhThuQuy for ${year}-Q${quarter}:`, error);
    return null;
  }
}

export async function generateThongKeDoanhThuNam(year: number) {
  try {
    const response = await fetch(`${API_URL}/statistics/doanh-thu/nam?nam=${year}`, {
      method: 'POST'
    });
    if (!response.ok) {
      console.error('Error generating yearly revenue statistics:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error response:', errorText);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error(`Exception in generateThongKeDoanhThuNam for ${year}:`, error);
    return null;
  }
}

