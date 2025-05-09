/**
 * Script để tạo dữ liệu mẫu cho thống kê doanh thu
 * 
 * Cách sử dụng:
 * 1. Đảm bảo MongoDB đã được khởi động
 * 2. Chạy script này để tạo dữ liệu mẫu
 */

// Kết nối đến MongoDB
db = db.getSiblingDB('statisticsdb');

// Xóa dữ liệu cũ
db.thong_ke_doanh_thu.drop();

// Tạo dữ liệu mẫu cho thống kê doanh thu theo năm
const yearStats = {
  kyThongKe: "NAM",
  giaTriKy: "2023",
  ngayBatDau: new Date("2023-01-01T00:00:00"),
  ngayKetThuc: new Date("2023-12-31T23:59:59"),
  tongDoanhThu: 120000000,
  tongDonHang: 250,
  ngayTao: new Date()
};

db.thong_ke_doanh_thu.insertOne(yearStats);

// Tạo dữ liệu mẫu cho thống kê doanh thu theo quý
const quarterStats = [
  {
    kyThongKe: "QUY",
    giaTriKy: "2023-Q1",
    ngayBatDau: new Date("2023-01-01T00:00:00"),
    ngayKetThuc: new Date("2023-03-31T23:59:59"),
    tongDoanhThu: 25000000,
    tongDonHang: 50,
    ngayTao: new Date()
  },
  {
    kyThongKe: "QUY",
    giaTriKy: "2023-Q2",
    ngayBatDau: new Date("2023-04-01T00:00:00"),
    ngayKetThuc: new Date("2023-06-30T23:59:59"),
    tongDoanhThu: 35000000,
    tongDonHang: 70,
    ngayTao: new Date()
  },
  {
    kyThongKe: "QUY",
    giaTriKy: "2023-Q3",
    ngayBatDau: new Date("2023-07-01T00:00:00"),
    ngayKetThuc: new Date("2023-09-30T23:59:59"),
    tongDoanhThu: 30000000,
    tongDonHang: 60,
    ngayTao: new Date()
  },
  {
    kyThongKe: "QUY",
    giaTriKy: "2023-Q4",
    ngayBatDau: new Date("2023-10-01T00:00:00"),
    ngayKetThuc: new Date("2023-12-31T23:59:59"),
    tongDoanhThu: 30000000,
    tongDonHang: 70,
    ngayTao: new Date()
  }
];

db.thong_ke_doanh_thu.insertMany(quarterStats);

// Tạo dữ liệu mẫu cho thống kê doanh thu theo tháng
const monthlyStats = [
  {
    kyThongKe: "THANG",
    giaTriKy: "2023-01",
    ngayBatDau: new Date("2023-01-01T00:00:00"),
    ngayKetThuc: new Date("2023-01-31T23:59:59"),
    tongDoanhThu: 8000000,
    tongDonHang: 15,
    ngayTao: new Date()
  },
  {
    kyThongKe: "THANG",
    giaTriKy: "2023-02",
    ngayBatDau: new Date("2023-02-01T00:00:00"),
    ngayKetThuc: new Date("2023-02-28T23:59:59"),
    tongDoanhThu: 7500000,
    tongDonHang: 18,
    ngayTao: new Date()
  },
  {
    kyThongKe: "THANG",
    giaTriKy: "2023-03",
    ngayBatDau: new Date("2023-03-01T00:00:00"),
    ngayKetThuc: new Date("2023-03-31T23:59:59"),
    tongDoanhThu: 9500000,
    tongDonHang: 17,
    ngayTao: new Date()
  },
  {
    kyThongKe: "THANG",
    giaTriKy: "2023-04",
    ngayBatDau: new Date("2023-04-01T00:00:00"),
    ngayKetThuc: new Date("2023-04-30T23:59:59"),
    tongDoanhThu: 11000000,
    tongDonHang: 22,
    ngayTao: new Date()
  },
  {
    kyThongKe: "THANG",
    giaTriKy: "2023-05",
    ngayBatDau: new Date("2023-05-01T00:00:00"),
    ngayKetThuc: new Date("2023-05-31T23:59:59"),
    tongDoanhThu: 12500000,
    tongDonHang: 25,
    ngayTao: new Date()
  },
  {
    kyThongKe: "THANG",
    giaTriKy: "2023-06",
    ngayBatDau: new Date("2023-06-01T00:00:00"),
    ngayKetThuc: new Date("2023-06-30T23:59:59"),
    tongDoanhThu: 11500000,
    tongDonHang: 23,
    ngayTao: new Date()
  },
  {
    kyThongKe: "THANG",
    giaTriKy: "2023-07",
    ngayBatDau: new Date("2023-07-01T00:00:00"),
    ngayKetThuc: new Date("2023-07-31T23:59:59"),
    tongDoanhThu: 10000000,
    tongDonHang: 20,
    ngayTao: new Date()
  },
  {
    kyThongKe: "THANG",
    giaTriKy: "2023-08",
    ngayBatDau: new Date("2023-08-01T00:00:00"),
    ngayKetThuc: new Date("2023-08-31T23:59:59"),
    tongDoanhThu: 9800000,
    tongDonHang: 19,
    ngayTao: new Date()
  },
  {
    kyThongKe: "THANG",
    giaTriKy: "2023-09",
    ngayBatDau: new Date("2023-09-01T00:00:00"),
    ngayKetThuc: new Date("2023-09-30T23:59:59"),
    tongDoanhThu: 10200000,
    tongDonHang: 21,
    ngayTao: new Date()
  },
  {
    kyThongKe: "THANG",
    giaTriKy: "2023-10",
    ngayBatDau: new Date("2023-10-01T00:00:00"),
    ngayKetThuc: new Date("2023-10-31T23:59:59"),
    tongDoanhThu: 9500000,
    tongDonHang: 19,
    ngayTao: new Date()
  },
  {
    kyThongKe: "THANG",
    giaTriKy: "2023-11",
    ngayBatDau: new Date("2023-11-01T00:00:00"),
    ngayKetThuc: new Date("2023-11-30T23:59:59"),
    tongDoanhThu: 10500000,
    tongDonHang: 21,
    ngayTao: new Date()
  },
  {
    kyThongKe: "THANG",
    giaTriKy: "2023-12",
    ngayBatDau: new Date("2023-12-01T00:00:00"),
    ngayKetThuc: new Date("2023-12-31T23:59:59"),
    tongDoanhThu: 10000000,
    tongDonHang: 30,
    ngayTao: new Date()
  }
];

db.thong_ke_doanh_thu.insertMany(monthlyStats);

print("Đã tạo dữ liệu mẫu cho thống kê doanh thu thành công!");
