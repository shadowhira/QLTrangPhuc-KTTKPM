const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const { testConnection } = require("./db/config")
const khachHangRoutes = require("./routes/khachHangRoutes")
const thongKeRoutes = require("./routes/thongKeRoutes")
require("dotenv").config()

const app = express()
const PORT = process.env.PORT || 5001

// Kiểm tra kết nối database
testConnection()

// Middleware
app.use(cors())
app.use(bodyParser.json())

// Routes
app.use("/api/khach-hang", khachHangRoutes)
app.use("/api/thong-ke", thongKeRoutes)

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

