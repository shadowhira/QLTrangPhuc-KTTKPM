const { sequelize } = require("./config")
const { DiaChi, KhachHang, TrangPhuc, DonDatTrangPhuc, ChiTietDonDat } = require("../models")

async function seed() {
  try {
    // Tạo địa chỉ
    const diaChis = await DiaChi.bulkCreate([
      {
        thonXom: "Thôn 1",
        quanHuyen: "Quận 1",
        tinhThanhPho: "TP. Hồ Chí Minh",
      },
      {
        thonXom: "Thôn 2",
        quanHuyen: "Quận 2",
        tinhThanhPho: "TP. Hồ Chí Minh",
      },
      {
        thonXom: "Thôn 3",
        quanHuyen: "Quận 3",
        tinhThanhPho: "TP. Hồ Chí Minh",
      },
      {
        thonXom: "Thôn 4",
        quanHuyen: "Quận 4",
        tinhThanhPho: "TP. Hồ Chí Minh",
      },
      {
        thonXom: "Thôn 5",
        quanHuyen: "Quận 5",
        tinhThanhPho: "TP. Hồ Chí Minh",
      },
    ])

    // Tạo khách hàng
    const khachHangs = await KhachHang.bulkCreate([
      {
        ho: "Nguyễn",
        ten: "Văn A",
        sdt: "0901234567",
        email: "nguyenvana@example.com",
        diaChiId: diaChis[0].id,
        tongChiTieu: 5000000,
      },
      {
        ho: "Trần",
        ten: "Thị B",
        sdt: "0912345678",
        email: "tranthib@example.com",
        diaChiId: diaChis[1].id,
        tongChiTieu: 3500000,
      },
      {
        ho: "Lê",
        ten: "Văn C",
        sdt: "0923456789",
        email: "levanc@example.com",
        diaChiId: diaChis[2].id,
        tongChiTieu: 7500000,
      },
      {
        ho: "Phạm",
        ten: "Thị D",
        sdt: "0934567890",
        email: "phamthid@example.com",
        diaChiId: diaChis[3].id,
        tongChiTieu: 2000000,
      },
      {
        ho: "Hoàng",
        ten: "Văn E",
        sdt: "0945678901",
        email: "hoangvane@example.com",
        diaChiId: diaChis[4].id,
        tongChiTieu: 10000000,
      },
    ])

    // Tạo trang phục
    const trangPhucs = await TrangPhuc.bulkCreate([
      {
        tenTP: "Áo dài truyền thống",
        loaiTP: "Áo dài",
        giaThueTrenNgay: 200000,
        giaBan: 2000000,
        trangThai: "Còn hàng",
        moTa: "Áo dài truyền thống màu đỏ",
      },
      {
        tenTP: "Vest nam",
        loaiTP: "Vest",
        giaThueTrenNgay: 300000,
        giaBan: 3000000,
        trangThai: "Còn hàng",
        moTa: "Vest nam màu đen",
      },
      {
        tenTP: "Váy cưới",
        loaiTP: "Váy cưới",
        giaThueTrenNgay: 500000,
        giaBan: 5000000,
        trangThai: "Còn hàng",
        moTa: "Váy cưới màu trắng",
      },
    ])

    // Tạo đơn đặt trang phục
    const donDats = await DonDatTrangPhuc.bulkCreate([
      {
        ngayDat: new Date("2023-01-15"),
        tongTien: 2000000,
        trangThai: "Đã thanh toán",
        khachHangId: khachHangs[0].id,
      },
      {
        ngayDat: new Date("2023-02-20"),
        tongTien: 3000000,
        trangThai: "Đã thanh toán",
        khachHangId: khachHangs[0].id,
      },
      {
        ngayDat: new Date("2023-03-10"),
        tongTien: 3500000,
        trangThai: "Đã thanh toán",
        khachHangId: khachHangs[1].id,
      },
      {
        ngayDat: new Date("2023-04-05"),
        tongTien: 7500000,
        trangThai: "Đã thanh toán",
        khachHangId: khachHangs[2].id,
      },
      {
        ngayDat: new Date("2023-05-12"),
        tongTien: 2000000,
        trangThai: "Đã thanh toán",
        khachHangId: khachHangs[3].id,
      },
      {
        ngayDat: new Date("2023-06-18"),
        tongTien: 10000000,
        trangThai: "Đã thanh toán",
        khachHangId: khachHangs[4].id,
      },
    ])

    // Tạo chi tiết đơn đặt
    await ChiTietDonDat.bulkCreate([
      {
        soLuongDat: 1,
        donGia: 2000000,
        trangPhucId: trangPhucs[0].id,
        donDatTrangPhucId: donDats[0].id,
      },
      {
        soLuongDat: 1,
        donGia: 3000000,
        trangPhucId: trangPhucs[1].id,
        donDatTrangPhucId: donDats[1].id,
      },
      {
        soLuongDat: 1,
        donGia: 3500000,
        trangPhucId: trangPhucs[2].id,
        donDatTrangPhucId: donDats[2].id,
      },
      {
        soLuongDat: 1,
        donGia: 7500000,
        trangPhucId: trangPhucs[2].id,
        donDatTrangPhucId: donDats[3].id,
      },
      {
        soLuongDat: 1,
        donGia: 2000000,
        trangPhucId: trangPhucs[0].id,
        donDatTrangPhucId: donDats[4].id,
      },
      {
        soLuongDat: 2,
        donGia: 5000000,
        trangPhucId: trangPhucs[2].id,
        donDatTrangPhucId: donDats[5].id,
      },
    ])

    console.log("Database seeded successfully.")
  } catch (error) {
    console.error("Error seeding database:", error)
  } finally {
    await sequelize.close()
  }
}

seed()

