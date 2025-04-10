const KhachHangService = require("../services/khachHangService")
const service = new KhachHangService()

// Controller theo sơ đồ lớp
class KhachHangController {
  async getAllKhachHang(req, res) {
    try {
      const khachHangs = await service.getAllKhachHang()
      res.json(khachHangs)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }

  async getKhachHangById(req, res) {
    try {
      const { id } = req.params
      const khachHang = await service.getKhachHangById(Number.parseInt(id))
      if (!khachHang) {
        return res.status(404).json({ message: "Không tìm thấy khách hàng" })
      }
      res.json(khachHang)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }

  async createKhachHang(req, res) {
    try {
      const newKhachHang = await service.createKhachHang(req.body)
      res.status(201).json(newKhachHang)
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  }

  async updateKhachHang(req, res) {
    try {
      const { id } = req.params
      const updatedKhachHang = await service.updateKhachHang(Number.parseInt(id), req.body)
      if (!updatedKhachHang) {
        return res.status(404).json({ message: "Không tìm thấy khách hàng" })
      }
      res.json(updatedKhachHang)
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  }

  async deleteKhachHang(req, res) {
    try {
      const { id } = req.params
      const result = await service.deleteKhachHang(Number.parseInt(id))
      if (!result) {
        return res.status(404).json({ message: "Không tìm thấy khách hàng" })
      }
      res.json({ message: "Xóa khách hàng thành công" })
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }
}

module.exports = new KhachHangController()

