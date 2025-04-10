const express = require("express")
const router = express.Router()
const thongKeController = require("../controllers/thongKeController")

// Routes cho thống kê
router.get("/khach-hang", thongKeController.getThongKeKhachHang)

module.exports = router

