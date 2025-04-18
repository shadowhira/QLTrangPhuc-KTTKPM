// Script để tạo dữ liệu mẫu cho thống kê doanh thu
import fetch from 'node-fetch';

const API_URL = "http://localhost:8080/api";

// Hàm tạo thống kê doanh thu theo tháng
async function generateMonthlyStatistics(year, month) {
  try {
    const response = await fetch(`${API_URL}/statistics/doanh-thu/monthly?year=${year}&month=${month}`, {
      method: 'POST'
    });

    if (!response.ok) {
      console.error(`Lỗi khi tạo thống kê tháng ${month}/${year}:`, response.status);
      return null;
    }

    const data = await response.json();
    console.log(`Đã tạo thống kê tháng ${month}/${year}:`, data);
    return data;
  } catch (error) {
    console.error(`Lỗi khi tạo thống kê tháng ${month}/${year}:`, error);
    return null;
  }
}

// Hàm tạo thống kê doanh thu theo quý
async function generateQuarterlyStatistics(year, quarter) {
  try {
    const response = await fetch(`${API_URL}/statistics/doanh-thu/quarterly?year=${year}&quarter=${quarter}`, {
      method: 'POST'
    });

    if (!response.ok) {
      console.error(`Lỗi khi tạo thống kê quý ${quarter}/${year}:`, response.status);
      return null;
    }

    const data = await response.json();
    console.log(`Đã tạo thống kê quý ${quarter}/${year}:`, data);
    return data;
  } catch (error) {
    console.error(`Lỗi khi tạo thống kê quý ${quarter}/${year}:`, error);
    return null;
  }
}

// Hàm tạo thống kê doanh thu theo năm
async function generateYearlyStatistics(year) {
  try {
    const response = await fetch(`${API_URL}/statistics/doanh-thu/yearly?year=${year}`, {
      method: 'POST'
    });

    if (!response.ok) {
      console.error(`Lỗi khi tạo thống kê năm ${year}:`, response.status);
      return null;
    }

    const data = await response.json();
    console.log(`Đã tạo thống kê năm ${year}:`, data);
    return data;
  } catch (error) {
    console.error(`Lỗi khi tạo thống kê năm ${year}:`, error);
    return null;
  }
}

// Hàm chính để tạo dữ liệu mẫu
async function generateSampleData() {
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

  console.log("Hoàn thành tạo dữ liệu mẫu cho thống kê doanh thu!");
}

// Chạy hàm tạo dữ liệu mẫu
generateSampleData();
