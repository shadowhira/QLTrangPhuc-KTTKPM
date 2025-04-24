const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const morgan = require('morgan');
const os = require('os');

const app = express();

// Kubernetes environment info
const K8S_NAMESPACE = process.env.K8S_NAMESPACE || 'customer-management';
const API_GATEWAY_POD = process.env.HOSTNAME || os.hostname();
const API_GATEWAY_PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Custom logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const requestId = Math.random().toString(36).substring(2, 15);

  // Log request
  console.log(`[${new Date().toISOString()}] [REQUEST:${requestId}] [K8S:${K8S_NAMESPACE}/${API_GATEWAY_POD}:${API_GATEWAY_PORT}] ${req.method} ${req.originalUrl}`);
  console.log(`[${new Date().toISOString()}] [REQUEST:${requestId}] Headers: ${JSON.stringify(req.headers)}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log(`[${new Date().toISOString()}] [REQUEST:${requestId}] Body: ${JSON.stringify(req.body)}`);
  }

  // Capture response
  const originalSend = res.send;
  res.send = function(body) {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] [RESPONSE:${requestId}] Status: ${res.statusCode} - Duration: ${duration}ms`);
    return originalSend.call(this, body);
  };

  next();
});

// Standard morgan logging
app.use(morgan('dev'));

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
    // Generate request ID for tracking
    const requestId = Math.random().toString(36).substring(2, 15);
    req.requestId = requestId;

    // Detailed Kubernetes logging
    console.log(`[${new Date().toISOString()}] [REQUEST:${requestId}] [K8S:${K8S_NAMESPACE}] [PROXY] Routing to Customer Service (customer-service:8081)`);
    console.log(`[${new Date().toISOString()}] [REQUEST:${requestId}] [K8S:${K8S_NAMESPACE}] [OPERATION] ${getOperationDetails(req)}`);

    // Log request details
    console.log(`[${new Date().toISOString()}] [REQUEST:${requestId}] [K8S:${K8S_NAMESPACE}] [DETAILS] Method: ${req.method}, Path: ${req.path}`);
    console.log(`[${new Date().toISOString()}] [REQUEST:${requestId}] [K8S:${K8S_NAMESPACE}] [DETAILS] Query params: ${JSON.stringify(req.query)}`);

    // Nếu có body (POST, PUT, v.v.), chuyển req.body thành JSON và gửi đi
    if (req.body) {
      console.log(`[${new Date().toISOString()}] [REQUEST:${requestId}] [K8S:${K8S_NAMESPACE}] [DETAILS] Body: ${JSON.stringify(req.body)}`);
      const bodyData = JSON.stringify(req.body);
      // Đặt header Content-Type và Content-Length
      proxyReq.setHeader('Content-Type', 'application/json');
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      // Ghi dữ liệu body vào proxy request
      proxyReq.write(bodyData);
      proxyReq.end();
    }
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`[${new Date().toISOString()}] [RESPONSE:${req.requestId || 'unknown'}] [K8S:${K8S_NAMESPACE}] [PROXY] Response from Customer Service: ${proxyRes.statusCode}`);
  },
  onError: (err, req, res) => {
    console.error(`[${new Date().toISOString()}] [ERROR:${req.requestId || 'unknown'}] [K8S:${K8S_NAMESPACE}] [PROXY] Customer Service Error: ${err.message}`);
    res.status(500).json({ error: 'Proxy Error', message: err.message });
  }
});

// Cấu hình proxy cho Statistics Service
const statisticsServiceProxy = createProxyMiddleware({
  target: 'http://statistics-service:8082',
  changeOrigin: true,
  pathRewrite: {
    '^/api/statistics/khach-hang-doanh-thu': '/api/statistics/khach-hang-doanh-thu',
    '^/api/statistics/doanh-thu': '/api/statistics/doanh-thu'
  },
  onProxyReq: (proxyReq, req, res) => {
    // Generate request ID for tracking
    const requestId = Math.random().toString(36).substring(2, 15);
    req.requestId = requestId;

    // Detailed Kubernetes logging
    console.log(`[${new Date().toISOString()}] [REQUEST:${requestId}] [K8S:${K8S_NAMESPACE}] [PROXY] Routing to Statistics Service (statistics-service:8082)`);
    console.log(`[${new Date().toISOString()}] [REQUEST:${requestId}] [K8S:${K8S_NAMESPACE}] [OPERATION] ${getOperationDetails(req)}`);

    // Log request details
    console.log(`[${new Date().toISOString()}] [REQUEST:${requestId}] [K8S:${K8S_NAMESPACE}] [DETAILS] Method: ${req.method}, Path: ${req.path}`);
    console.log(`[${new Date().toISOString()}] [REQUEST:${requestId}] [K8S:${K8S_NAMESPACE}] [DETAILS] Query params: ${JSON.stringify(req.query)}`);

    if (req.body) {
      console.log(`[${new Date().toISOString()}] [REQUEST:${requestId}] [K8S:${K8S_NAMESPACE}] [DETAILS] Body: ${JSON.stringify(req.body)}`);
      const bodyData = JSON.stringify(req.body);
      proxyReq.setHeader('Content-Type', 'application/json');
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
      proxyReq.end();
    }
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`[${new Date().toISOString()}] [RESPONSE:${req.requestId || 'unknown'}] [K8S:${K8S_NAMESPACE}] [PROXY] Response from Statistics Service: ${proxyRes.statusCode}`);
  },
  onError: (err, req, res) => {
    console.error(`[${new Date().toISOString()}] [ERROR:${req.requestId || 'unknown'}] [K8S:${K8S_NAMESPACE}] [PROXY] Statistics Service Error: ${err.message}`);
    res.status(500).json({ error: 'Proxy Error', message: err.message });
  }
});

// Định tuyến
app.use('/api/khach-hang', customerServiceProxy);
app.use('/api/trang-phuc', customerServiceProxy);
app.use('/api/don-dat-trang-phuc', customerServiceProxy);
app.use('/api/statistics/khach-hang-doanh-thu', statisticsServiceProxy);
app.use('/api/statistics/doanh-thu', statisticsServiceProxy);

// Helper function to determine operation details based on request
function getOperationDetails(req) {
  const path = req.path;
  const method = req.method;

  // Khách hàng operations
  if (path.includes('/api/khach-hang')) {
    if (path === '/api/khach-hang' && method === 'GET') {
      return 'Lấy danh sách tất cả khách hàng';
    } else if (path.match(/\/api\/khach-hang\/\d+$/) && method === 'GET') {
      return `Lấy thông tin khách hàng ID: ${path.split('/').pop()}`;
    } else if (path === '/api/khach-hang/theo-chi-tieu' && method === 'GET') {
      return 'Lấy danh sách khách hàng theo chi tiêu';
    } else if (path === '/api/khach-hang' && method === 'POST') {
      return 'Tạo khách hàng mới';
    } else if (path.match(/\/api\/khach-hang\/\d+$/) && method === 'PUT') {
      return `Cập nhật thông tin khách hàng ID: ${path.split('/').pop()}`;
    } else if (path.match(/\/api\/khach-hang\/\d+$/) && method === 'DELETE') {
      return `Xóa khách hàng ID: ${path.split('/').pop()}`;
    }
  }

  // Trang phục operations
  else if (path.includes('/api/trang-phuc')) {
    if (path === '/api/trang-phuc' && method === 'GET') {
      return 'Lấy danh sách tất cả trang phục';
    } else if (path.match(/\/api\/trang-phuc\/\d+$/) && method === 'GET') {
      return `Lấy thông tin trang phục ID: ${path.split('/').pop()}`;
    } else if (path.match(/\/api\/trang-phuc\/loai\/.*$/) && method === 'GET') {
      return `Lấy danh sách trang phục loại: ${path.split('/').pop()}`;
    }
  }

  // Đơn đặt trang phục operations
  else if (path.includes('/api/don-dat-trang-phuc')) {
    if (path === '/api/don-dat-trang-phuc' && method === 'GET') {
      return 'Lấy danh sách tất cả đơn đặt trang phục';
    } else if (path.match(/\/api\/don-dat-trang-phuc\/\d+$/) && method === 'GET') {
      return `Lấy thông tin đơn đặt trang phục ID: ${path.split('/').pop()}`;
    } else if (path.match(/\/api\/don-dat-trang-phuc\/khach-hang\/\d+$/) && method === 'GET') {
      return `Lấy danh sách đơn đặt trang phục của khách hàng ID: ${path.split('/').pop()}`;
    } else if (path === '/api/don-dat-trang-phuc/khoang-thoi-gian' && method === 'GET') {
      return `Lấy danh sách đơn đặt trang phục trong khoảng thời gian: ${req.query.startDate || ''} - ${req.query.endDate || ''}`;
    }
  }

  // Thống kê operations
  else if (path.includes('/api/statistics')) {
    if (path.includes('/doanh-thu')) {
      if (path === '/api/statistics/doanh-thu' && method === 'GET') {
        return 'Lấy tất cả thống kê doanh thu';
      } else if (path.includes('/monthly') && method === 'POST') {
        return `Tạo thống kê doanh thu tháng ${req.query.month || ''}/${req.query.year || ''}`;
      } else if (path.includes('/quarterly') && method === 'POST') {
        return `Tạo thống kê doanh thu quý ${req.query.quarter || ''}/${req.query.year || ''}`;
      } else if (path.includes('/yearly') && method === 'POST') {
        return `Tạo thống kê doanh thu năm ${req.query.year || ''}`;
      }
    } else if (path.includes('/khach-hang-doanh-thu')) {
      if (path === '/api/statistics/khach-hang-doanh-thu' && method === 'GET') {
        return 'Lấy tất cả thống kê doanh thu khách hàng';
      } else if (path.includes('/generate-all') && method === 'POST') {
        return 'Tạo thống kê doanh thu cho tất cả khách hàng';
      } else if (path.match(/\/generate\/\d+$/) && method === 'POST') {
        return `Tạo thống kê doanh thu cho khách hàng ID: ${path.split('/').pop()}`;
      }
    }
  }

  return `${method} ${path}`;
}

// Health check
app.get('/health', (req, res) => {
  console.log(`[${new Date().toISOString()}] [K8S:${K8S_NAMESPACE}/${API_GATEWAY_POD}:${API_GATEWAY_PORT}] Health check requested`);
  res.status(200).json({
    status: 'UP',
    message: 'API Gateway is running',
    kubernetes: {
      namespace: K8S_NAMESPACE,
      pod: API_GATEWAY_POD,
      port: API_GATEWAY_PORT
    }
  });
});

// Xử lý lỗi 404
app.use((req, res) => {
  console.log(`[${new Date().toISOString()}] [K8S:${K8S_NAMESPACE}/${API_GATEWAY_POD}:${API_GATEWAY_PORT}] [ERROR] Route not found: ${req.originalUrl}`);
  res.status(404).json({ error: 'Not Found', message: `Route ${req.originalUrl} not found` });
});

// Xử lý lỗi chung
app.use((err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] [K8S:${K8S_NAMESPACE}/${API_GATEWAY_POD}:${API_GATEWAY_PORT}] [ERROR] Internal server error:`, err.stack);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// Khởi động server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`[${new Date().toISOString()}] [K8S:${K8S_NAMESPACE}/${API_GATEWAY_POD}:${API_GATEWAY_PORT}] API Gateway started`);
  console.log(`[${new Date().toISOString()}] [K8S:${K8S_NAMESPACE}] Services configuration:`);
  console.log(`[${new Date().toISOString()}] [K8S:${K8S_NAMESPACE}] - Customer Service: http://customer-service:8081`);
  console.log(`[${new Date().toISOString()}] [K8S:${K8S_NAMESPACE}] - Statistics Service: http://statistics-service:8082`);
  console.log(`[${new Date().toISOString()}] [K8S:${K8S_NAMESPACE}] - MongoDB: mongodb://mongodb:27017`);
  console.log(`[${new Date().toISOString()}] [K8S:${K8S_NAMESPACE}] - PostgreSQL: postgresql://postgres:5432`);
});