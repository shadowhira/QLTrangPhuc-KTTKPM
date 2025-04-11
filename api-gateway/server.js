const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev')); // Logging

// Cấu hình proxy cho Customer Service
const customerServiceProxy = createProxyMiddleware({
  target: 'http://customer-service:8081',
  changeOrigin: true,
  pathRewrite: {
    '^/api/khach-hang': '/api/khach-hang',
    '^/api/trang-phuc': '/api/trang-phuc',
    '^/api/don-dat-trang-phuc': '/api/don-dat-trang-phuc'
  },
  onProxyReq: (proxyReq, req, res) => {
    // Log request
    console.log(`Proxying request to Customer Service: ${req.method} ${req.path}`);
    console.log('Request Headers:', req.headers);
    console.log('Request Body:', req.body);

    // Nếu có body (POST, PUT, v.v.), chuyển req.body thành JSON và gửi đi
    if (req.body) {
      const bodyData = JSON.stringify(req.body);
      // Đặt header Content-Type và Content-Length
      proxyReq.setHeader('Content-Type', 'application/json');
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      // Ghi dữ liệu body vào proxy request
      proxyReq.write(bodyData);
      proxyReq.end();
    }
  },
  onError: (err, req, res) => {
    console.error('Proxy Error:', err);
    res.status(500).json({ error: 'Proxy Error', message: err.message });
  }
});

// Cấu hình proxy cho Statistics Service (giữ nguyên)
const statisticsServiceProxy = createProxyMiddleware({
  target: 'http://statistics-service:8082',
  changeOrigin: true,
  pathRewrite: {
    '^/api/statistics/khach-hang-doanh-thu': '/api/statistics/khach-hang-doanh-thu',
    '^/api/statistics/doanh-thu': '/api/statistics/doanh-thu'
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`Proxying request to Statistics Service: ${req.method} ${req.path}`);
    console.log('Request Headers:', req.headers);
    console.log('Request Body:', req.body);

    if (req.body) {
      const bodyData = JSON.stringify(req.body);
      proxyReq.setHeader('Content-Type', 'application/json');
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
      proxyReq.end();
    }
  },
  onError: (err, req, res) => {
    console.error('Proxy Error:', err);
    res.status(500).json({ error: 'Proxy Error', message: err.message });
  }
});

// Định tuyến
app.use('/api/khach-hang', customerServiceProxy);
app.use('/api/trang-phuc', customerServiceProxy);
app.use('/api/don-dat-trang-phuc', customerServiceProxy);
app.use('/api/statistics/khach-hang-doanh-thu', statisticsServiceProxy);
app.use('/api/statistics/doanh-thu', statisticsServiceProxy);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', message: 'API Gateway is running' });
});

// Xử lý lỗi 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found', message: `Route ${req.originalUrl} not found` });
});

// Xử lý lỗi chung
app.use((err, req, res, next) => {
  console.error('Error details:', err.stack);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// Khởi động server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
  console.log(`Proxying Customer Service at http://customer-service:8081`);
  console.log(`Proxying Statistics Service at http://statistics-service:8082`);
});