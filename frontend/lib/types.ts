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
  customerId: number
  customerName: string
  customerEmail: string
  totalRevenue: number
  totalOrders: number
  lastUpdated: string
  revenueByPeriod: Record<string, number>
}

export interface TKDoanhThu {
  id: string
  period: string // MONTH, QUARTER, YEAR
  periodValue: string // yyyy-MM, yyyy-Qn, yyyy
  startDate: string
  endDate: string
  totalRevenue: number
  totalOrders: number
  createdAt: string
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

