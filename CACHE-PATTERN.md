# Tài liệu Cache Pattern

## Giới thiệu

Cache Pattern là một mẫu thiết kế được sử dụng để lưu trữ tạm thời dữ liệu thường xuyên được truy cập, nhằm giảm thời gian phản hồi và tải cho hệ thống. Trong hệ thống microservices của chúng ta, Cache Pattern được triển khai cho module thống kê để cải thiện hiệu năng khi truy vấn dữ liệu thống kê doanh thu và thống kê doanh thu khách hàng.

## Lợi ích của Cache Pattern

1. **Giảm thời gian phản hồi**: Dữ liệu được lưu trữ trong bộ nhớ cache, giúp truy xuất nhanh hơn so với truy vấn từ cơ sở dữ liệu.
2. **Giảm tải cho cơ sở dữ liệu**: Giảm số lượng truy vấn đến cơ sở dữ liệu, đặc biệt là các truy vấn phức tạp.
3. **Tăng khả năng mở rộng**: Hệ thống có thể phục vụ nhiều người dùng hơn với cùng một lượng tài nguyên.
4. **Cải thiện trải nghiệm người dùng**: Thời gian phản hồi nhanh hơn giúp cải thiện trải nghiệm người dùng.

## Cách triển khai Cache Pattern trong hệ thống

### 1. Công nghệ sử dụng

- **Redis**: Hệ thống lưu trữ key-value trong bộ nhớ, được sử dụng làm bộ nhớ cache.
- **Spring Cache**: Framework cung cấp các annotation để đơn giản hóa việc triển khai cache.

### 2. Cấu trúc triển khai

#### 2.1. Cấu hình Redis và Spring Cache

```java
@Configuration
@EnableCaching
public class RedisConfig {
    @Bean
    public RedisCacheManager cacheManager(RedisConnectionFactory connectionFactory) {
        RedisCacheConfiguration cacheConfig = RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofMinutes(60))
                .disableCachingNullValues()
                .serializeKeysWith(
                        RedisSerializationContext.SerializationPair.fromSerializer(new StringRedisSerializer()))
                .serializeValuesWith(RedisSerializationContext.SerializationPair
                        .fromSerializer(new GenericJackson2JsonRedisSerializer()));

        return RedisCacheManager.builder(connectionFactory)
                .cacheDefaults(cacheConfig)
                .withCacheConfiguration("thongKeDoanhThu",
                        cacheConfig.entryTtl(Duration.ofMinutes(30)))
                .withCacheConfiguration("thongKeDoanhThuKhachHang",
                        cacheConfig.entryTtl(Duration.ofMinutes(30)))
                .build();
    }
}
```

#### 2.2. Service Cache

Các service cache được tạo ra để xử lý logic cache cho từng loại thống kê:

- `ThongKeDoanhThuCacheService`: Xử lý cache cho thống kê doanh thu.
- `ThongKeDoanhThuKhachHangCacheService`: Xử lý cache cho thống kê doanh thu khách hàng.

#### 2.3. Annotation Cache

Sử dụng các annotation của Spring Cache để đơn giản hóa việc triển khai cache:

- `@Cacheable`: Lưu kết quả của phương thức vào cache.
- `@CacheEvict`: Xóa dữ liệu cache khi có thay đổi.

```java
@Cacheable(value = "thongKeDoanhThu", key = "'all'")
public List<ThongKeDoanhThu> layTatCaThongKeDoanhThuCache() {
    logger.info("Cache miss: Lấy tất cả thống kê doanh thu từ database");
    return repository.findAll();
}

@CacheEvict(value = "thongKeDoanhThu", allEntries = true)
public void clearAllCache() {
    logger.info("Xóa tất cả cache thống kê doanh thu");
}
```

#### 2.4. API Endpoint

Các API endpoint được tạo ra để hỗ trợ cả phiên bản có cache và không có cache:

- `/api/statistics/doanh-thu`: API không có cache.
- `/api/statistics/doanh-thu/cache`: API có cache.
- `/api/statistics/doanh-thu/performance-test`: API test hiệu năng.

## Luồng hoạt động

### 1. Luồng hoạt động khi chưa áp dụng Cache Pattern

```
┌─────────┐     ┌─────────────────┐     ┌─────────────────┐     ┌─────────────┐
│ Frontend │────▶│ API Gateway     │────▶│ Statistics      │────▶│ MongoDB     │
└─────────┘     └─────────────────┘     │ Service         │     └─────────────┘
                                        └─────────────────┘
                                                │
                                                ▼
                                        ┌─────────────────┐     ┌─────────────┐
                                        │ Customer        │────▶│ PostgreSQL  │
                                        │ Service         │     └─────────────┘
                                        └─────────────────┘
```

1. Frontend gửi request đến API Gateway.
2. API Gateway chuyển tiếp request đến Statistics Service.
3. Statistics Service truy vấn dữ liệu từ MongoDB.
4. Nếu cần, Statistics Service gọi Customer Service để lấy thêm dữ liệu.
5. Customer Service truy vấn dữ liệu từ PostgreSQL.
6. Dữ liệu được trả về cho Frontend.

### 2. Luồng hoạt động sau khi áp dụng Cache Pattern

```
┌─────────┐     ┌─────────────────┐     ┌─────────────────┐
│ Frontend │────▶│ API Gateway     │────▶│ Statistics      │
└─────────┘     └─────────────────┘     │ Service         │
                                        └─────────────────┘
                                                │
                                                ▼
                                        ┌─────────────────┐
                                        │ Redis Cache     │
                                        └─────────────────┘
                                                │
                                                │ Cache Miss
                                                ▼
                                        ┌─────────────────┐     ┌─────────────┐
                                        │ MongoDB         │◀───▶│ Data        │
                                        └─────────────────┘     └─────────────┘
                                                │
                                                │ If needed
                                                ▼
                                        ┌─────────────────┐     ┌─────────────┐
                                        │ Customer        │────▶│ PostgreSQL  │
                                        │ Service         │     └─────────────┘
                                        └─────────────────┘
```

1. Frontend gửi request đến API Gateway.
2. API Gateway chuyển tiếp request đến Statistics Service.
3. Statistics Service kiểm tra dữ liệu trong Redis Cache.
4. Nếu dữ liệu có trong cache (Cache Hit), dữ liệu được trả về ngay lập tức.
5. Nếu dữ liệu không có trong cache (Cache Miss), Statistics Service truy vấn dữ liệu từ MongoDB.
6. Nếu cần, Statistics Service gọi Customer Service để lấy thêm dữ liệu.
7. Dữ liệu được lưu vào Redis Cache và trả về cho Frontend.

## Cơ chế làm mới cache

Cache được làm mới trong các trường hợp sau:

1. **Tự động hết hạn**: Cache tự động hết hạn sau một khoảng thời gian nhất định (TTL - Time To Live).
2. **Làm mới thủ công**: Khi có dữ liệu mới được tạo hoặc cập nhật, cache sẽ được xóa để đảm bảo dữ liệu luôn mới nhất.

```java
public ThongKeDoanhThu taoThongKeTheoThangCache(int nam, int thang) {
    logger.info("Tạo thống kê doanh thu theo tháng {}/{}", thang, nam);
    ThongKeDoanhThu thongKe = thongKeDoanhThuContext.taoThongKe("THANG", nam, thang);
    clearAllCache(); // Xóa cache khi có dữ liệu mới
    return thongKe;
}
```

## So sánh hiệu năng

Để so sánh hiệu năng giữa API có cache và không có cache, chúng ta đã tạo một trang frontend hiển thị:

1. Thời gian phản hồi của API không có cache.
2. Thời gian phản hồi của API có cache.
3. Phần trăm cải thiện hiệu năng.
4. Biểu đồ so sánh thời gian phản hồi qua các lần test.
5. Kết quả trung bình qua nhiều lần test.

## Phân tích hiệu suất

### Thống kê doanh thu theo thời gian

Hiệu suất cache cho thống kê doanh thu theo thời gian có thể không đều vì các lý do sau:

1. **Độ phức tạp của truy vấn**: Thống kê doanh thu theo thời gian có thể đã được tối ưu hóa sẵn hoặc có ít phép tính phức tạp hơn so với thống kê doanh thu khách hàng.

2. **Khối lượng dữ liệu xử lý**: Thống kê doanh thu theo thời gian có thể chỉ tập trung vào một khoảng thời gian cụ thể với ít dữ liệu hơn.

3. **Cơ chế invalidation cache**: Cache của thống kê doanh thu theo thời gian có thể bị invalidate thường xuyên hơn do dữ liệu thay đổi liên tục.

4. **Cách triển khai Strategy Pattern**: Strategy Pattern trong thống kê doanh thu theo thời gian có thể tạo ra overhead khi kết hợp với cache.

### Thống kê doanh thu khách hàng

Hiệu suất cache cho thống kê doanh thu khách hàng thường cải thiện rõ rệt hơn vì:

1. **Độ phức tạp của truy vấn**: Thống kê doanh thu khách hàng liên quan đến việc tổng hợp dữ liệu từ nhiều bảng và tính toán phức tạp hơn.

2. **Khối lượng dữ liệu xử lý**: Thống kê doanh thu khách hàng xử lý nhiều dữ liệu hơn (nhiều khách hàng, nhiều đơn hàng).

3. **Tần suất thay đổi dữ liệu**: Dữ liệu thống kê doanh thu khách hàng thường ít thay đổi hơn so với dữ liệu thống kê doanh thu theo thời gian.

4. **Cấu trúc dữ liệu**: Cấu trúc dữ liệu của thống kê doanh thu khách hàng có thể phù hợp hơn với cơ chế cache.

## Kết luận

Cache Pattern giúp cải thiện đáng kể hiệu năng của hệ thống, đặc biệt là đối với các truy vấn phức tạp và tốn nhiều tài nguyên. Trong hệ thống của chúng ta, Cache Pattern được triển khai cho module thống kê giúp giảm thời gian phản hồi và tải cho cơ sở dữ liệu, đồng thời cải thiện trải nghiệm người dùng.

Hiệu quả của Cache Pattern phụ thuộc vào nhiều yếu tố như độ phức tạp của truy vấn, khối lượng dữ liệu xử lý, tần suất thay đổi dữ liệu và cấu trúc dữ liệu. Trong hệ thống của chúng ta, Cache Pattern mang lại hiệu quả rõ rệt hơn cho thống kê doanh thu khách hàng so với thống kê doanh thu theo thời gian.

Để tối ưu hóa hiệu suất cache, chúng ta có thể:

1. **Điều chỉnh TTL**: Tùy chỉnh thời gian hết hạn (TTL) cho từng loại cache dựa trên tần suất thay đổi dữ liệu.
2. **Phân tầng cache**: Triển khai cache nhiều tầng (multi-level caching) để cải thiện hiệu suất.
3. **Caching có chọn lọc**: Chỉ cache những dữ liệu thường xuyên được truy cập và tốn nhiều tài nguyên để tính toán.
4. **Tối ưu hóa serialization**: Sử dụng các kỹ thuật serialization hiệu quả để giảm kích thước dữ liệu cache.
