const { DataTypes } = require("sequelize")
const { sequelize } = require("../db/config")
const DiaChi = require("./DiaChi")

const KhachHang = sequelize.define(
  "KhachHang",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ho: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ten: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sdt: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    tongChiTieu: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    tableName: "khach_hang",
    timestamps: true,
  },
)

// Thiết lập mối quan hệ với DiaChi
KhachHang.belongsTo(DiaChi, { foreignKey: "diaChiId", as: "diaChi" })

module.exports = KhachHang

