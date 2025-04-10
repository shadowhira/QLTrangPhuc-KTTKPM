const ThongKeService = require("../services/thongKeService")
const service = new ThongKeService()

class ThongKeController {
  async getThongKeKhachHang(req, res) {
    try {
      const thongKe = await service.getThongKeKhachHang()
      res.json(thongKe)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }
}

module.exports = new ThongKeController()

