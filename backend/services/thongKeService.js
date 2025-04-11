const { KhachHang, DonDatTrangPhuc, DiaChi } = require("../models")
const { sequelize } = require("../db/config")
const { Op } = require("sequelize")

class ThongKeService {
  async getThongKeKhachHang() {
    try {
      // Lấy tất cả khách hàng với địa chỉ
      const khachHangs = await KhachHang.findAll({
        include: [
          {
            model: DiaChi,
            as: "diaChi",
          },
        ],
      })

      // Lấy tổng doanh thu từ các đơn đặt cho mỗi khách hàng
      const thongKe = []

      for (const khachHang of khachHangs) {
        // Tính tổng doanh thu từ các đơn đặt
        const tongDoanhThu =
          (await DonDatTrangPhuc.sum("tongTien", {
            where: {
              khachHangId: khachHang.id,
              // trangThai: "Đã thanh toán",
            },
          })) || 0

        thongKe.push({
          khachHang: {
            id: khachHang.id,
            ho: khachHang.ho,
            ten: khachHang.ten,
            sdt: khachHang.sdt,
            email: khachHang.email,
            diaChi: {
              thonXom: khachHang.diaChi?.thonXom || "",
              quanHuyen: khachHang.diaChi?.quanHuyen || "",
              tinhThanhPho: khachHang.diaChi?.tinhThanhPho || "",
            },
          },
          doanhThu: tongDoanhThu,
        })
      }

      // Sắp xếp theo doanh thu giảm dần
      return thongKe.sort((a, b) => b.doanhThu - a.doanhThu)
    } catch (error) {
      console.error("Error getting customer statistics:", error)
      throw error
    }
  }
}

module.exports = ThongKeService

