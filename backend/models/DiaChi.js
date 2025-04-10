const { DataTypes } = require("sequelize")
const { sequelize } = require("../db/config")

const DiaChi = sequelize.define(
  "DiaChi",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    thonXom: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    quanHuyen: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tinhThanhPho: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "dia_chi",
    timestamps: true,
  },
)

module.exports = DiaChi

