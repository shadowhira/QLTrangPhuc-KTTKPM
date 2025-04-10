const { Sequelize } = require("sequelize")
require("dotenv").config()

const sequelize = new Sequelize("quanlytrangphuc", "postgres", "G@con123123", {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: "postgres",
  logging: false, // Set to console.log to see SQL queries
  dialectOptions: {
    ssl:
      process.env.DB_SSL === "true"
        ? {
            require: true,
            rejectUnauthorized: false,
          }
        : false,
  },
})

const testConnection = async () => {
  try {
    await sequelize.authenticate()
    console.log("Database connection has been established successfully.")
  } catch (error) {
    console.error("Unable to connect to the database:", error)
  }
}

module.exports = {
  sequelize,
  testConnection,
}

