const { DataTypes } = require("sequelize")
const { sequelize } = require("../db/config")

const TrangPhuc = sequelize.define(
  "TrangPhuc",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tenTP: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    loaiTP: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    giaThueTrenNgay: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    giaBan: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    trangThai: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Còn hàng",
    },
    moTa: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "trang_phuc",
    timestamps: true,
  },
)

module.exports = TrangPhuc

