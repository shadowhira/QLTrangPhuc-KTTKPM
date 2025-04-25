# Triển khai Pattern Strategy cho thống kê doanh thu

Tài liệu này mô tả việc triển khai Pattern Strategy cho thống kê doanh thu trong module statistics-service.

## Giới thiệu về Pattern Strategy

Pattern Strategy là một design pattern thuộc nhóm behavioral pattern, cho phép định nghĩa một họ các thuật toán, đóng gói từng thuật toán lại, và làm cho chúng có thể hoán đổi cho nhau. Strategy cho phép thuật toán thay đổi độc lập với client sử dụng nó.

## Cấu trúc triển khai

1. **Interface Strategy**: `ThongKeStrategy`
   - Định nghĩa phương thức chung cho tất cả các chiến lược thống kê
   - Cung cấp phương thức mặc định để tính tổng doanh thu

2. **Concrete Strategies**:
   - `ThongKeTheoThangStrategy`: Chiến lược thống kê theo tháng
   - `ThongKeTheoQuyStrategy`: Chiến lược thống kê theo quý
   - `ThongKeTheoNamStrategy`: Chiến lược thống kê theo năm

3. **Context**: `ThongKeDoanhThuContext`
   - Quản lý các chiến lược và cung cấp phương thức để sử dụng chiến lược phù hợp
   - Tự động đăng ký các chiến lược thông qua dependency injection

4. **Client**: `ThongKeDoanhThuService`
   - Sử dụng context để thực hiện thống kê theo các chiến lược khác nhau

## Lợi ích của việc triển khai Pattern Strategy

1. **Tách biệt các thuật toán thống kê**: Mỗi loại thống kê (tháng, quý, năm) được tách biệt thành các class riêng biệt, giúp dễ dàng bảo trì và mở rộng.

2. **Giảm code trùng lặp**: Các phần code chung được đưa vào interface hoặc phương thức mặc định, giảm thiểu việc lặp lại code.

3. **Dễ dàng thêm loại thống kê mới**: Chỉ cần tạo một class mới implement interface `ThongKeStrategy` và đăng ký với context.

4. **Tăng tính linh hoạt**: Có thể thay đổi chiến lược thống kê tại runtime mà không cần thay đổi code của client.

5. **Cải thiện khả năng test**: Có thể test từng chiến lược một cách độc lập.

## Cách sử dụng

```java
// Trong ThongKeDoanhThuService
public ThongKeDoanhThu taoThongKeTheoThang(int nam, int thang) {
    return thongKeDoanhThuContext.taoThongKe("THANG", nam, thang);
}

public ThongKeDoanhThu taoThongKeTheoQuy(int nam, int quy) {
    if (quy < 1 || quy > 4) {
        throw new IllegalArgumentException("Quý phải nằm trong khoảng từ 1 đến 4");
    }
    return thongKeDoanhThuContext.taoThongKe("QUY", nam, quy);
}

public ThongKeDoanhThu taoThongKeTheoNam(int nam) {
    return thongKeDoanhThuContext.taoThongKe("NAM", nam, 0);
}
```

## Mở rộng

Để thêm một loại thống kê mới (ví dụ: thống kê theo tuần), chỉ cần:

1. Tạo một class mới implement interface `ThongKeStrategy`:

```java
@Component
public class ThongKeTheoTuanStrategy implements ThongKeStrategy {
    @Override
    public ThongKeDoanhThu taoThongKe(int nam, int tuan, KhachHangServiceClient khachHangServiceClient, ThongKeDoanhThuRepository repository) {
        // Triển khai logic thống kê theo tuần
    }
    
    @Override
    public String getKyThongKe() {
        return "TUAN";
    }
}
```

2. Spring sẽ tự động đăng ký chiến lược mới với `ThongKeDoanhThuContext` thông qua dependency injection.

3. Cập nhật `ThongKeDoanhThuService` để sử dụng chiến lược mới:

```java
public ThongKeDoanhThu taoThongKeTheoTuan(int nam, int tuan) {
    return thongKeDoanhThuContext.taoThongKe("TUAN", nam, tuan);
}
```
