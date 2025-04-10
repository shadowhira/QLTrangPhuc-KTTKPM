const { DataTypes } = require("sequelize")
const { sequelize } = require("../db/config")
const DonDatTrangPhuc = require("./DonDatTrangPhuc")
const TrangPhuc = require("./TrangPhuc")

const ChiTietDonDat = sequelize.define(
  "ChiTietDonDat",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    soLuongDat: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    donGia: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "chi_tiet_don_dat",
    timestamps: true,
  },
)

// Thiết lập mối quan hệ
ChiTietDonDat.belongsTo(DonDatTrangPhuc, { foreignKey: "donDatTrangPhucId", as: "donDatTrangPhuc" })
ChiTietDonDat.belongsTo(TrangPhuc, { foreignKey: "trangPhucId", as: "trangPhuc" })

module.exports = ChiTietDonDat

