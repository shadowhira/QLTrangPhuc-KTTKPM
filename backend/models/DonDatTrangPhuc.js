const { DataTypes } = require("sequelize")
const { sequelize } = require("../db/config")
const KhachHang = require("./KhachHang")

const DonDatTrangPhuc = sequelize.define(
  "DonDatTrangPhuc",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ngayDat: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    tongTien: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    trangThai: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Chờ xác nhận",
    },
  },
  {
    tableName: "don_dat_trang_phuc",
    timestamps: true,
  },
)

// Thiết lập mối quan hệ với KhachHang
DonDatTrangPhuc.belongsTo(KhachHang, { foreignKey: "khachHangId", as: "khachHang" })

module.exports = DonDatTrangPhuc

