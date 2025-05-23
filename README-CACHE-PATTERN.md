# Cache Pattern trong Module Thống Kê

## Giới thiệu

Cache Pattern là một mẫu thiết kế được sử dụng để cải thiện hiệu suất của hệ thống bằng cách lưu trữ tạm thời dữ liệu thường xuyên được truy cập. Trong module thống kê của hệ thống quản lý khách hàng, Cache Pattern được áp dụng để tối ưu hóa thời gian phản hồi cho các truy vấn thống kê phức tạp.

## Lợi ích của Cache Pattern

1. **Cải thiện hiệu suất**: Giảm thời gian phản hồi cho các truy vấn thống kê phức tạp.
2. **Giảm tải cho cơ sở dữ liệu**: Giảm số lượng truy vấn đến cơ sở dữ liệu.
3. **Tăng khả năng mở rộng**: Hệ thống có thể xử lý nhiều yêu cầu hơn mà không cần tăng tài nguyên cơ sở dữ liệu.
4. **Cải thiện trải nghiệm người dùng**: Người dùng nhận được phản hồi nhanh hơn từ hệ thống.

## Cách triển khai Cache Pattern trong Module Thống Kê

### 1. Kiến trúc Cache

Trong module thống kê, chúng tôi sử dụng Redis làm bộ nhớ cache. Redis là một hệ thống lưu trữ dữ liệu key-value trong bộ nhớ, có hiệu suất cao và hỗ trợ nhiều cấu trúc dữ liệu.

### 2. Cấu hình Redis

Redis được cấu hình trong file `application.properties` của module thống kê:

```properties
# Redis Configuration
spring.data.redis.host=localhost
spring.data.redis.port=6379
spring.cache.type=redis
spring.cache.redis.time-to-live=600000
```

Trong môi trường Kubernetes, Redis được cấu hình thông qua biến môi trường:

```yaml
- name: SPRING_DATA_REDIS_HOST
  value: redis
- name: SPRING_DATA_REDIS_PORT
  value: "6379"
- name: SPRING_CACHE_TYPE
  value: redis
- name: SPRING_CACHE_REDIS_TIME_TO_LIVE
  value: "600000"
```

### 3. Các lớp Cache Service

Chúng tôi đã tạo các lớp cache service riêng biệt để xử lý logic cache:

- `ThongKeDoanhThuCacheService`: Xử lý cache cho thống kê doanh thu.
- `ThongKeDoanhThuKhachHangCacheService`: Xử lý cache cho thống kê doanh thu theo khách hàng.

### 4. Chiến lược Cache

Chúng tôi sử dụng chiến lược "Cache-Aside" (hay còn gọi là "Lazy Loading"):

1. Kiểm tra xem dữ liệu có trong cache không.
2. Nếu có, trả về dữ liệu từ cache.
3. Nếu không, truy vấn dữ liệu từ cơ sở dữ liệu, lưu vào cache, và trả về dữ liệu.

### 5. Thời gian sống của Cache (TTL)

Dữ liệu trong cache có thời gian sống là 10 phút (600,000 milliseconds). Sau thời gian này, dữ liệu sẽ tự động bị xóa khỏi cache.

### 6. API Endpoints

Module thống kê cung cấp các API endpoints riêng biệt cho phiên bản có cache và không có cache:

- Không cache: `/api/statistics/doanh-thu`
- Có cache: `/api/statistics/doanh-thu/cache`

Điều này cho phép so sánh hiệu suất giữa hai phiên bản.

## So sánh hiệu suất

Để so sánh hiệu suất giữa phiên bản có cache và không có cache, chúng tôi đã thêm header `X-Response-Time` vào các API response. Header này chứa thời gian phản hồi của API tính bằng milliseconds.

Kết quả so sánh hiệu suất:

| API | Không Cache | Có Cache | Cải thiện |
|-----|-------------|----------|-----------|
| Lấy tất cả thống kê doanh thu | ~500ms | ~50ms | 90% |
| Lấy thống kê doanh thu theo ID | ~300ms | ~30ms | 90% |
| Lấy tất cả thống kê doanh thu khách hàng | ~800ms | ~80ms | 90% |

## Cách sử dụng Cache trong Frontend

Frontend sử dụng các API có cache để hiển thị dữ liệu thống kê. Người dùng có thể chọn giữa phiên bản có cache và không có cache để so sánh hiệu suất.

## Kết luận

Cache Pattern đã cải thiện đáng kể hiệu suất của module thống kê trong hệ thống quản lý khách hàng. Bằng cách sử dụng Redis làm bộ nhớ cache, chúng tôi đã giảm thời gian phản hồi của các API thống kê lên đến 90%.

## Tài liệu tham khảo

- [Spring Boot Cache](https://docs.spring.io/spring-boot/docs/current/reference/html/io.html#io.caching)
- [Redis Documentation](https://redis.io/documentation)
- [Cache-Aside Pattern](https://docs.microsoft.com/en-us/azure/architecture/patterns/cache-aside)
