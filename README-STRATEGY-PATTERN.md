# Mẫu Thiết Kế Strategy trong Module Thống Kê Doanh Thu

## 1. Giới thiệu

Tài liệu này giải thích chi tiết cách vận hành của mẫu thiết kế Strategy (Chiến lược) trong module thống kê doanh thu theo kỳ (tháng, quý, năm) của hệ thống.

Mẫu thiết kế Strategy cho phép định nghĩa một nhóm các thuật toán, đóng gói từng thuật toán lại, và làm cho chúng có thể hoán đổi cho nhau. Strategy cho phép thuật toán biến đổi độc lập với các client sử dụng nó.

## 2. Cấu trúc mẫu thiết kế Strategy

### 2.1. Các thành phần chính

1. **Strategy Interface (ThongKeStrategy)**: Định nghĩa giao diện chung cho tất cả các chiến lược cụ thể.
2. **Concrete Strategies**: Các lớp cụ thể triển khai Strategy Interface (ThongKeTheoThangStrategy, ThongKeTheoQuyStrategy, ThongKeTheoNamStrategy).
3. **Context (ThongKeDoanhThuContext)**: Lớp sử dụng các chiến lược, duy trì tham chiếu đến đối tượng Strategy và cho phép Strategy truy cập dữ liệu của nó.
4. **Client (ThongKeDoanhThuService)**: Lớp sử dụng Context để thực hiện các thao tác thống kê.

### 2.2. Sơ đồ lớp

```
┌───────────────────┐      ┌───────────────────────┐
│                   │      │                       │
│ ThongKeDoanhThu   │◄─────┤ ThongKeDoanhThuService│
│ Service           │      │                       │
│                   │      └───────────────────────┘
└───────┬───────────┘
        │
        │ uses
        ▼
┌───────────────────┐      ┌───────────────────────┐
│                   │      │                       │
│ ThongKeDoanhThu   │◄─────┤    «interface»        │
│ Context           │      │   ThongKeStrategy     │
│                   │      │                       │
└───────────────────┘      └─────────┬─────────────┘
                                     │
                                     │ implements
                                     │
                 ┌───────────────────┼───────────────────┐
                 │                   │                   │
    ┌────────────▼─────────┐ ┌───────▼──────────┐ ┌─────▼────────────┐
    │                      │ │                  │ │                  │
    │ ThongKeTheoThang     │ │ ThongKeTheoQuy   │ │ ThongKeTheoNam   │
    │ Strategy             │ │ Strategy         │ │ Strategy         │
    │                      │ │                  │ │                  │
    └──────────────────────┘ └──────────────────┘ └──────────────────┘
```

## 3. Cách vận hành chi tiết

### 3.1. Khởi tạo và đăng ký các chiến lược

Khi ứng dụng khởi động, Spring Boot tự động tạo các bean cho các lớp được đánh dấu `@Component`. Trong constructor của `ThongKeDoanhThuContext`, tất cả các chiến lược được đăng ký vào một Map:

```java
public ThongKeDoanhThuContext(Set<ThongKeStrategy> strategySet,
                             KhachHangServiceClient khachHangServiceClient,
                             ThongKeDoanhThuRepository repository) {
    // Đăng ký tất cả các chiến lược
    strategySet.forEach(strategy -> strategies.put(strategy.getKyThongKe(), strategy));
    this.khachHangServiceClient = khachHangServiceClient;
    this.repository = repository;
}
```

Mỗi chiến lược được đăng ký với một khóa duy nhất (THANG, QUY, NAM) thông qua phương thức `getKyThongKe()`.

### 3.2. Chọn chiến lược phù hợp

Khi cần tạo thống kê, `ThongKeDoanhThuService` gọi phương thức tương ứng:

```java
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

`ThongKeDoanhThuContext` chọn chiến lược phù hợp dựa trên loại kỳ thống kê:

```java
public ThongKeDoanhThu taoThongKe(String kyThongKe, int nam, int giaTri) {
    ThongKeStrategy strategy = strategies.get(kyThongKe);
    if (strategy == null) {
        throw new IllegalArgumentException("Không tìm thấy chiến lược thống kê cho kỳ: " + kyThongKe);
    }
    return strategy.taoThongKe(nam, giaTri, khachHangServiceClient, repository);
}
```

### 3.3. Thực hiện chiến lược

Mỗi chiến lược cụ thể triển khai phương thức `taoThongKe()` theo cách riêng của mình:

#### ThongKeTheoThangStrategy

```java
@Override
public ThongKeDoanhThu taoThongKe(int nam, int thang, KhachHangServiceClient khachHangServiceClient, ThongKeDoanhThuRepository repository) {
    // Tính toán ngày bắt đầu và kết thúc của tháng
    YearMonth yearMonth = YearMonth.of(nam, thang);
    LocalDateTime ngayBatDau = yearMonth.atDay(1).atStartOfDay();
    LocalDateTime ngayKetThuc = yearMonth.atEndOfMonth().atTime(23, 59, 59);
    
    // Tạo giá trị kỳ theo định dạng yyyy-MM
    String giaTriKy = String.format("%d-%02d", nam, thang);
    
    // Kiểm tra nếu thống kê đã tồn tại
    ThongKeDoanhThu thongKeHienCo = repository
            .findByKyThongKeAndGiaTriKy(getKyThongKe(), giaTriKy)
            .orElse(null);
    
    if (thongKeHienCo != null) {
        return thongKeHienCo;
    }
    
    // Lấy đơn đặt từ customer service
    List<DonDatTrangPhucDTO> donDatTrangPhucs = khachHangServiceClient
            .layDonDatTrangPhucTheoKhoangThoiGian(ngayBatDau, ngayKetThuc);
    
    // Tính toán thống kê
    BigDecimal tongDoanhThu = tinhTongDoanhThu(donDatTrangPhucs);
    int tongDonHang = donDatTrangPhucs.size();
    
    // Tạo và lưu thống kê
    ThongKeDoanhThu thongKe = new ThongKeDoanhThu();
    thongKe.setKyThongKe(getKyThongKe());
    thongKe.setGiaTriKy(giaTriKy);
    thongKe.setNgayBatDau(ngayBatDau);
    thongKe.setNgayKetThuc(ngayKetThuc);
    thongKe.setTongDoanhThu(tongDoanhThu);
    thongKe.setTongDonHang(tongDonHang);
    thongKe.setNgayTao(LocalDateTime.now());
    
    return repository.save(thongKe);
}

@Override
public String getKyThongKe() {
    return "THANG";
}
```

#### ThongKeTheoQuyStrategy

```java
@Override
public ThongKeDoanhThu taoThongKe(int nam, int quy, KhachHangServiceClient khachHangServiceClient, ThongKeDoanhThuRepository repository) {
    // Kiểm tra giá trị quý hợp lệ
    if (quy < 1 || quy > 4) {
        throw new IllegalArgumentException("Quý phải nằm trong khoảng từ 1 đến 4");
    }
    
    // Tính toán tháng bắt đầu và kết thúc của quý
    Month thangBatDau = Month.of((quy - 1) * 3 + 1);
    Month thangKetThuc = Month.of(quy * 3);
    
    // Tính toán ngày bắt đầu và kết thúc của quý
    LocalDateTime ngayBatDau = LocalDateTime.of(nam, thangBatDau, 1, 0, 0);
    LocalDateTime ngayKetThuc = YearMonth.of(nam, thangKetThuc).atEndOfMonth().atTime(23, 59, 59);
    
    // Tạo giá trị kỳ theo định dạng yyyy-Qn
    String giaTriKy = String.format("%d-Q%d", nam, quy);
    
    // Kiểm tra nếu thống kê đã tồn tại
    ThongKeDoanhThu thongKeHienCo = repository
            .findByKyThongKeAndGiaTriKy(getKyThongKe(), giaTriKy)
            .orElse(null);
    
    if (thongKeHienCo != null) {
        return thongKeHienCo;
    }
    
    // Lấy đơn đặt từ customer service
    List<DonDatTrangPhucDTO> donDatTrangPhucs = khachHangServiceClient
            .layDonDatTrangPhucTheoKhoangThoiGian(ngayBatDau, ngayKetThuc);
    
    // Tính toán thống kê
    BigDecimal tongDoanhThu = tinhTongDoanhThu(donDatTrangPhucs);
    int tongDonHang = donDatTrangPhucs.size();
    
    // Tạo và lưu thống kê
    ThongKeDoanhThu thongKe = new ThongKeDoanhThu();
    thongKe.setKyThongKe(getKyThongKe());
    thongKe.setGiaTriKy(giaTriKy);
    thongKe.setNgayBatDau(ngayBatDau);
    thongKe.setNgayKetThuc(ngayKetThuc);
    thongKe.setTongDoanhThu(tongDoanhThu);
    thongKe.setTongDonHang(tongDonHang);
    thongKe.setNgayTao(LocalDateTime.now());
    
    return repository.save(thongKe);
}

@Override
public String getKyThongKe() {
    return "QUY";
}
```

### 3.4. Phương thức chung

Interface `ThongKeStrategy` cung cấp một phương thức mặc định `tinhTongDoanhThu()` để tính tổng doanh thu từ danh sách đơn đặt trang phục:

```java
default BigDecimal tinhTongDoanhThu(List<DonDatTrangPhucDTO> donDatTrangPhucs) {
    return donDatTrangPhucs.stream()
            .filter(donDat -> "Đã thanh toán".equals(donDat.getTrangThai()))
            .map(DonDatTrangPhucDTO::getTongTien)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
}
```

Phương thức này được sử dụng bởi tất cả các chiến lược cụ thể, giúp tránh lặp lại code.

## 4. Luồng hoạt động đầy đủ

1. **Controller nhận request**:
   ```java
   @PostMapping("/thang")
   public ResponseEntity<ThongKeDoanhThu> taoThongKeTheoThang(
           @RequestParam int nam,
           @RequestParam int thang) {
       ThongKeDoanhThu thongKe = thongKeDoanhThuService.taoThongKeTheoThang(nam, thang);
       return ResponseEntity.ok(thongKe);
   }
   ```

2. **Service gọi Context**:
   ```java
   public ThongKeDoanhThu taoThongKeTheoThang(int nam, int thang) {
       return thongKeDoanhThuContext.taoThongKe("THANG", nam, thang);
   }
   ```

3. **Context chọn chiến lược phù hợp**:
   ```java
   public ThongKeDoanhThu taoThongKe(String kyThongKe, int nam, int giaTri) {
       ThongKeStrategy strategy = strategies.get(kyThongKe);
       // ...
       return strategy.taoThongKe(nam, giaTri, khachHangServiceClient, repository);
   }
   ```

4. **Chiến lược thực hiện tạo thống kê**:
   - Tính toán khoảng thời gian
   - Kiểm tra thống kê đã tồn tại
   - Lấy dữ liệu từ Customer Service
   - Tính toán thống kê
   - Lưu thống kê vào database

5. **Kết quả được trả về cho Controller và Client**

## 5. Lợi ích của mẫu thiết kế Strategy

1. **Tách biệt thuật toán**: Mỗi chiến lược thống kê được tách biệt thành các lớp riêng biệt.
2. **Dễ dàng mở rộng**: Có thể thêm chiến lược mới (ví dụ: thống kê theo tuần) mà không cần sửa đổi code hiện có.
3. **Tránh điều kiện phức tạp**: Thay vì sử dụng các câu lệnh if-else phức tạp, chúng ta sử dụng đa hình.
4. **Tái sử dụng code**: Các phương thức chung được định nghĩa trong interface và tái sử dụng bởi tất cả các chiến lược.
5. **Dễ dàng kiểm thử**: Mỗi chiến lược có thể được kiểm thử độc lập.

## 6. Cách thêm chiến lược mới

Để thêm một chiến lược thống kê mới (ví dụ: thống kê theo tuần), chỉ cần:

1. **Tạo lớp chiến lược mới**:
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

2. **Thêm phương thức vào Service**:
   ```java
   public ThongKeDoanhThu taoThongKeTheoTuan(int nam, int tuan) {
       return thongKeDoanhThuContext.taoThongKe("TUAN", nam, tuan);
   }
   ```

3. **Thêm endpoint vào Controller**:
   ```java
   @PostMapping("/tuan")
   public ResponseEntity<ThongKeDoanhThu> taoThongKeTheoTuan(
           @RequestParam int nam,
           @RequestParam int tuan) {
       ThongKeDoanhThu thongKe = thongKeDoanhThuService.taoThongKeTheoTuan(nam, tuan);
       return ResponseEntity.ok(thongKe);
   }
   ```

Không cần sửa đổi code hiện có, chiến lược mới sẽ tự động được đăng ký và sử dụng.

## 7. Kết luận

Mẫu thiết kế Strategy trong module thống kê doanh thu là một ví dụ điển hình về cách áp dụng nguyên tắc "Open/Closed Principle" (Mở cho mở rộng, đóng cho sửa đổi) của SOLID. Nó cho phép hệ thống dễ dàng mở rộng với các loại thống kê mới mà không cần sửa đổi code hiện có.

Việc sử dụng Spring Boot với các annotation như `@Component` và dependency injection giúp việc triển khai mẫu thiết kế Strategy trở nên đơn giản và hiệu quả hơn, tự động đăng ký các chiến lược mà không cần code thủ công.
