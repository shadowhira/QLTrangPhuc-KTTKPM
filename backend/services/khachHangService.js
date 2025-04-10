const { KhachHang, DiaChi } = require("../models")
const { sequelize } = require("../db/config")

class KhachHangService {
  async getAllKhachHang() {
    try {
      const khachHangs = await KhachHang.findAll({
        include: [
          {
            model: DiaChi,
            as: "diaChi",
          },
        ],
      })

      // Chuyển đổi dữ liệu để phù hợp với cấu trúc frontend
      return khachHangs.map((kh) => ({
        id: kh.id,
        ho: kh.ho,
        ten: kh.ten,
        sdt: kh.sdt,
        email: kh.email,
        tongChiTieu: kh.tongChiTieu,
        diaChi: {
          id: kh.diaChi?.id,
          thonXom: kh.diaChi?.thonXom || "",
          quanHuyen: kh.diaChi?.quanHuyen || "",
          tinhThanhPho: kh.diaChi?.tinhThanhPho || "",
        },
      }))
    } catch (error) {
      console.error("Error getting all customers:", error)
      throw error
    }
  }

  async getKhachHangById(id) {
    try {
      const khachHang = await KhachHang.findByPk(id, {
        include: [
          {
            model: DiaChi,
            as: "diaChi",
          },
        ],
      })

      if (!khachHang) return null

      return {
        id: khachHang.id,
        ho: khachHang.ho,
        ten: khachHang.ten,
        sdt: khachHang.sdt,
        email: khachHang.email,
        tongChiTieu: khachHang.tongChiTieu,
        diaChi: {
          id: khachHang.diaChi?.id,
          thonXom: khachHang.diaChi?.thonXom || "",
          quanHuyen: khachHang.diaChi?.quanHuyen || "",
          tinhThanhPho: khachHang.diaChi?.tinhThanhPho || "",
        },
      }
    } catch (error) {
      console.error("Error getting customer by id:", error)
      throw error
    }
  }

  async createKhachHang(khachHangData) {
    const transaction = await sequelize.transaction()

    try {
      // Tạo địa chỉ trước
      const diaChi = await DiaChi.create(
        {
          thonXom: khachHangData.diaChi?.thonXom || "",
          quanHuyen: khachHangData.diaChi?.quanHuyen || "",
          tinhThanhPho: khachHangData.diaChi?.tinhThanhPho || "",
        },
        { transaction },
      )

      // Tạo khách hàng với địa chỉ đã tạo
      const khachHang = await KhachHang.create(
        {
          ho: khachHangData.ho,
          ten: khachHangData.ten,
          sdt: khachHangData.sdt,
          email: khachHangData.email,
          tongChiTieu: khachHangData.tongChiTieu || 0,
          diaChiId: diaChi.id,
        },
        { transaction },
      )

      await transaction.commit()

      return {
        id: khachHang.id,
        ho: khachHang.ho,
        ten: khachHang.ten,
        sdt: khachHang.sdt,
        email: khachHang.email,
        tongChiTieu: khachHang.tongChiTieu,
        diaChi: {
          id: diaChi.id,
          thonXom: diaChi.thonXom,
          quanHuyen: diaChi.quanHuyen,
          tinhThanhPho: diaChi.tinhThanhPho,
        },
      }
    } catch (error) {
      await transaction.rollback()
      console.error("Error creating customer:", error)
      throw error
    }
  }

  async updateKhachHang(id, khachHangData) {
    const transaction = await sequelize.transaction()

    try {
      // Tìm khách hàng
      const khachHang = await KhachHang.findByPk(id, { transaction })
      if (!khachHang) {
        await transaction.rollback()
        return null
      }

      // Cập nhật thông tin khách hàng
      await khachHang.update(
        {
          ho: khachHangData.ho !== undefined ? khachHangData.ho : khachHang.ho,
          ten: khachHangData.ten !== undefined ? khachHangData.ten : khachHang.ten,
          sdt: khachHangData.sdt !== undefined ? khachHangData.sdt : khachHang.sdt,
          email: khachHangData.email !== undefined ? khachHangData.email : khachHang.email,
          tongChiTieu: khachHangData.tongChiTieu !== undefined ? khachHangData.tongChiTieu : khachHang.tongChiTieu,
        },
        { transaction },
      )

      // Cập nhật địa chỉ nếu có
      if (khachHangData.diaChi) {
        const diaChi = await DiaChi.findByPk(khachHang.diaChiId, { transaction })
        if (diaChi) {
          await diaChi.update(
            {
              thonXom: khachHangData.diaChi.thonXom !== undefined ? khachHangData.diaChi.thonXom : diaChi.thonXom,
              quanHuyen:
                khachHangData.diaChi.quanHuyen !== undefined ? khachHangData.diaChi.quanHuyen : diaChi.quanHuyen,
              tinhThanhPho:
                khachHangData.diaChi.tinhThanhPho !== undefined
                  ? khachHangData.diaChi.tinhThanhPho
                  : diaChi.tinhThanhPho,
            },
            { transaction },
          )
        }
      }

      await transaction.commit()

      // Lấy khách hàng đã cập nhật
      const updatedKhachHang = await this.getKhachHangById(id)
      return updatedKhachHang
    } catch (error) {
      await transaction.rollback()
      console.error("Error updating customer:", error)
      throw error
    }
  }

  async deleteKhachHang(id) {
    const transaction = await sequelize.transaction()

    try {
      // Tìm khách hàng
      const khachHang = await KhachHang.findByPk(id, { transaction })
      if (!khachHang) {
        await transaction.rollback()
        return false
      }

      // Lưu diaChiId để xóa sau
      const diaChiId = khachHang.diaChiId

      // Xóa khách hàng
      await khachHang.destroy({ transaction })

      // Xóa địa chỉ
      if (diaChiId) {
        await DiaChi.destroy({
          where: { id: diaChiId },
          transaction,
        })
      }

      await transaction.commit()
      return true
    } catch (error) {
      await transaction.rollback()
      console.error("Error deleting customer:", error)
      throw error
    }
  }
}

module.exports = KhachHangService

