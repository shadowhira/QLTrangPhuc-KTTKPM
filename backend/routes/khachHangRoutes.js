const express = require("express")
const router = express.Router()
const khachHangController = require("../controllers/khachHangController")

// Routes cho quản lý khách hàng
router.get("/", khachHangController.getAllKhachHang)
router.get("/:id", khachHangController.getKhachHangById)
router.post("/", khachHangController.createKhachHang)
router.put("/:id", khachHangController.updateKhachHang)
router.delete("/:id", khachHangController.deleteKhachHang)

module.exports = router

