// Mock data cho ứng dụng

// Khách hàng
const khachHangs = [
  {
    id: 1,
    ho: "Nguyễn",
    ten: "Văn A",
    sdt: "0901234567",
    email: "nguyenvana@example.com",
    diaChi: {
      thonXom: "Thôn 1",
      quanHuyen: "Quận 1",
      tinhThanhPho: "TP. Hồ Chí Minh",
    },
    tongChiTieu: 5000000,
  },
  {
    id: 2,
    ho: "Trần",
    ten: "Thị B",
    sdt: "0912345678",
    email: "tranthib@example.com",
    diaChi: {
      thonXom: "Thôn 2",
      quanHuyen: "Quận 2",
      tinhThanhPho: "TP. Hồ Chí Minh",
    },
    tongChiTieu: 3500000,
  },
  {
    id: 3,
    ho: "Lê",
    ten: "Văn C",
    sdt: "0923456789",
    email: "levanc@example.com",
    diaChi: {
      thonXom: "Thôn 3",
      quanHuyen: "Quận 3",
      tinhThanhPho: "TP. Hồ Chí Minh",
    },
    tongChiTieu: 7500000,
  },
  {
    id: 4,
    ho: "Phạm",
    ten: "Thị D",
    sdt: "0934567890",
    email: "phamthid@example.com",
    diaChi: {
      thonXom: "Thôn 4",
      quanHuyen: "Quận 4",
      tinhThanhPho: "TP. Hồ Chí Minh",
    },
    tongChiTieu: 2000000,
  },
  {
    id: 5,
    ho: "Hoàng",
    ten: "Văn E",
    sdt: "0945678901",
    email: "hoangvane@example.com",
    diaChi: {
      thonXom: "Thôn 5",
      quanHuyen: "Quận 5",
      tinhThanhPho: "TP. Hồ Chí Minh",
    },
    tongChiTieu: 10000000,
  },
]

// Trang phục
const trangPhucs = [
  {
    id: 1,
    tenTP: "Áo dài truyền thống",
    loaiTP: "Áo dài",
    giaThueTrenNgay: 200000,
    giaBan: 2000000,
    trangThai: "Còn hàng",
    moTa: "Áo dài truyền thống màu đỏ",
  },
  {
    id: 2,
    tenTP: "Vest nam",
    loaiTP: "Vest",
    giaThueTrenNgay: 300000,
    giaBan: 3000000,
    trangThai: "Còn hàng",
    moTa: "Vest nam màu đen",
  },
  {
    id: 3,
    tenTP: "Váy cưới",
    loaiTP: "Váy cưới",
    giaThueTrenNgay: 500000,
    giaBan: 5000000,
    trangThai: "Còn hàng",
    moTa: "Váy cưới màu trắng",
  },
]

// Đơn đặt trang phục
const donDatTrangPhucs = [
  {
    id: 1,
    ngayDat: new Date("2023-01-15"),
    tongTien: 2000000,
    trangThai: "Đã thanh toán",
    khachHangId: 1,
  },
  {
    id: 2,
    ngayDat: new Date("2023-02-20"),
    tongTien: 3000000,
    trangThai: "Đã thanh toán",
    khachHangId: 1,
  },
  {
    id: 3,
    ngayDat: new Date("2023-03-10"),
    tongTien: 3500000,
    trangThai: "Đã thanh toán",
    khachHangId: 2,
  },
  {
    id: 4,
    ngayDat: new Date("2023-04-05"),
    tongTien: 7500000,
    trangThai: "Đã thanh toán",
    khachHangId: 3,
  },
  {
    id: 5,
    ngayDat: new Date("2023-05-12"),
    tongTien: 2000000,
    trangThai: "Đã thanh toán",
    khachHangId: 4,
  },
  {
    id: 6,
    ngayDat: new Date("2023-06-18"),
    tongTien: 10000000,
    trangThai: "Đã thanh toán",
    khachHangId: 5,
  },
]

// Chi tiết đơn đặt
const chiTietDonDats = [
  {
    id: 1,
    soLuongDat: 1,
    donGia: 2000000,
    trangPhucId: 1,
    donDatTrangPhucId: 1,
  },
  {
    id: 2,
    soLuongDat: 1,
    donGia: 3000000,
    trangPhucId: 2,
    donDatTrangPhucId: 2,
  },
  {
    id: 3,
    soLuongDat: 1,
    donGia: 3500000,
    trangPhucId: 3,
    donDatTrangPhucId: 3,
  },
  {
    id: 4,
    soLuongDat: 1,
    donGia: 7500000,
    trangPhucId: 3,
    donDatTrangPhucId: 4,
  },
  {
    id: 5,
    soLuongDat: 1,
    donGia: 2000000,
    trangPhucId: 1,
    donDatTrangPhucId: 5,
  },
  {
    id: 6,
    soLuongDat: 2,
    donGia: 5000000,
    trangPhucId: 3,
    donDatTrangPhucId: 6,
  },
]

module.exports = {
  khachHangs,
  trangPhucs,
  donDatTrangPhucs,
  chiTietDonDats,
}

