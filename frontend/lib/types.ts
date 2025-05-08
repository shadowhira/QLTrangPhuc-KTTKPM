// Định nghĩa các interface dựa trên sơ đồ lớp

export interface DiaChi {
  id?: number
  thonXom: string
  quanHuyen: string
  tinhThanhPho: string
}

export interface KhachHang {
  id: number
  ho: string
  ten: string
  sdt: string
  email: string
  diaChi: DiaChi
  tongChiTieu: number
}

export interface TKKhachHang {
  id: string
  khachHangId: number
  tenKhachHang: string
  emailKhachHang: string
  tongDoanhThu: number
  tongDonHang: number
  capNhatLanCuoi: string
  doanhThuTheoKy: Record<string, number>
}

export interface TKDoanhThu {
  id: string
  kyThongKe: string // "THANG", "QUY", "NAM"
  giaTriKy: string // "2023-01", "2023-Q1", "2023"
  ngayBatDau: string
  ngayKetThuc: string
  tongDoanhThu: number
  tongDonHang: number
  ngayTao: string
}

export interface TrangPhuc {
  id: number
  ten: string
  loai: string
  giaThueNgay: number
  giaBan: number
  trangThai: string
  moTa: string
}

export interface DonDatTrangPhuc {
  id: number
  ngayDat: Date
  tongTien: number
  trangThai: string
  khachHangId: number
}

export interface ChiTietDonDat {
  id: number
  soLuongDat: number
  donGia: number
  thanhTien: number
  trangPhucId: number
  tenTrangPhuc: string
  donDatTrangPhucId: number
}

