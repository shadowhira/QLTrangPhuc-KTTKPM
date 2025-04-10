const { sequelize } = require("./config")
const { DiaChi, KhachHang, TrangPhuc, DonDatTrangPhuc, ChiTietDonDat } = require("../models")

async function migrate() {
  try {
    // Đồng bộ hóa tất cả các models với database
    await sequelize.sync({ force: true })
    console.log("Database synchronized successfully.")
  } catch (error) {
    console.error("Error synchronizing database:", error)
  } finally {
    await sequelize.close()
  }
}

migrate()

