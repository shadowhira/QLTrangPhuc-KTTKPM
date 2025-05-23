// API client cho các endpoint cache

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"

// Thống kê doanh thu theo thời gian (có cache)
export async function fetchThongKeDoanhThuCache() {
  try {
    const response = await fetch(`${API_URL}/statistics/doanh-thu/cache`);
    if (!response.ok) {
      console.error('Error fetching cached revenue statistics:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error response:', errorText);
      return { data: [], responseTime: 0 };
    }
    const responseTime = parseInt(response.headers.get('X-Response-Time') || '0');
    const data = await response.json();
    return { data: Array.isArray(data) ? data : [], responseTime };
  } catch (error) {
    console.error('Exception in fetchThongKeDoanhThuCache:', error);
    return { data: [], responseTime: 0 };
  }
}

export async function fetchThongKeDoanhThuByPeriodCache(period: string) {
  try {
    const response = await fetch(`${API_URL}/statistics/doanh-thu/cache/ky/${period}`);
    if (!response.ok) {
      console.error('Error fetching cached revenue statistics by period:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error response:', errorText);
      return { data: [], responseTime: 0 };
    }
    const responseTime = parseInt(response.headers.get('X-Response-Time') || '0');
    const data = await response.json();
    return { data: Array.isArray(data) ? data : [], responseTime };
  } catch (error) {
    console.error(`Exception in fetchThongKeDoanhThuByPeriodCache for period ${period}:`, error);
    return { data: [], responseTime: 0 };
  }
}

export async function generateThongKeDoanhThuThangCache(year: number, month: number) {
  try {
    const response = await fetch(`${API_URL}/statistics/doanh-thu/cache/thang?nam=${year}&thang=${month}`, {
      method: 'POST'
    });
    if (!response.ok) {
      console.error('Error generating cached monthly revenue statistics:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error response:', errorText);
      return { data: null, responseTime: 0 };
    }
    const responseTime = parseInt(response.headers.get('X-Response-Time') || '0');
    const data = await response.json();
    return { data, responseTime };
  } catch (error) {
    console.error(`Exception in generateThongKeDoanhThuThangCache for ${year}-${month}:`, error);
    return { data: null, responseTime: 0 };
  }
}

export async function generateThongKeDoanhThuQuyCache(year: number, quarter: number) {
  try {
    const response = await fetch(`${API_URL}/statistics/doanh-thu/cache/quy?nam=${year}&quy=${quarter}`, {
      method: 'POST'
    });
    if (!response.ok) {
      console.error('Error generating cached quarterly revenue statistics:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error response:', errorText);
      return { data: null, responseTime: 0 };
    }
    const responseTime = parseInt(response.headers.get('X-Response-Time') || '0');
    const data = await response.json();
    return { data, responseTime };
  } catch (error) {
    console.error(`Exception in generateThongKeDoanhThuQuyCache for ${year}-Q${quarter}:`, error);
    return { data: null, responseTime: 0 };
  }
}

export async function generateThongKeDoanhThuNamCache(year: number) {
  try {
    const response = await fetch(`${API_URL}/statistics/doanh-thu/cache/nam?nam=${year}`, {
      method: 'POST'
    });
    if (!response.ok) {
      console.error('Error generating cached yearly revenue statistics:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error response:', errorText);
      return { data: null, responseTime: 0 };
    }
    const responseTime = parseInt(response.headers.get('X-Response-Time') || '0');
    const data = await response.json();
    return { data, responseTime };
  } catch (error) {
    console.error(`Exception in generateThongKeDoanhThuNamCache for ${year}:`, error);
    return { data: null, responseTime: 0 };
  }
}

// Thống kê doanh thu khách hàng (có cache)
export async function fetchThongKeKhachHangCache() {
  try {
    const response = await fetch(`${API_URL}/statistics/khach-hang-doanh-thu/cache`);
    if (!response.ok) {
      console.error('Error fetching cached customer statistics:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error response:', errorText);
      return { data: [], responseTime: 0 };
    }
    const responseTime = parseInt(response.headers.get('X-Response-Time') || '0');
    const data = await response.json();
    return { data: Array.isArray(data) ? data : [], responseTime };
  } catch (error) {
    console.error('Exception in fetchThongKeKhachHangCache:', error);
    return { data: [], responseTime: 0 };
  }
}

export async function generateThongKeKhachHangCache() {
  try {
    const response = await fetch(`${API_URL}/statistics/khach-hang-doanh-thu/cache/tao-tat-ca`, {
      method: 'POST'
    });
    if (!response.ok) {
      console.error('Error generating cached customer statistics:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error response:', errorText);
      return { data: [], responseTime: 0 };
    }
    const responseTime = parseInt(response.headers.get('X-Response-Time') || '0');
    const data = await response.json();
    return { data: Array.isArray(data) ? data : [], responseTime };
  } catch (error) {
    console.error('Exception in generateThongKeKhachHangCache:', error);
    return { data: [], responseTime: 0 };
  }
}

// API test hiệu năng
export async function testPerformanceDoanhThu() {
  try {
    const response = await fetch(`${API_URL}/statistics/doanh-thu/performance-test`);
    if (!response.ok) {
      console.error('Error testing performance:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error response:', errorText);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error('Exception in testPerformanceDoanhThu:', error);
    return null;
  }
}

export async function testPerformanceKhachHang() {
  try {
    const response = await fetch(`${API_URL}/statistics/khach-hang-doanh-thu/performance-test`);
    if (!response.ok) {
      console.error('Error testing performance:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error response:', errorText);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error('Exception in testPerformanceKhachHang:', error);
    return null;
  }
}
