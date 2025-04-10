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
  khachHang: KhachHang
  doanhThu: number
}

export interface TrangPhuc {
  id: number
  tenTP: string
  loaiTP: string
  giaThueTrenNgay: number
  giaBan: number
  trangThai: string
  moTa: string
}

export interface DonDatTrangPhuc {
  id: number
  ngayDat: Date
  tongTien: number
  trangThai: string
  khachHang: KhachHang
}

export interface ChiTietDonDat {
  id: number
  soLuongDat: number
  donGia: number
  trangPhuc: TrangPhuc
  donDatTrangPhuc: DonDatTrangPhuc
}

