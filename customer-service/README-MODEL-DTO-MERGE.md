# Gộp DTO vào Model trong Customer Service

Tài liệu này mô tả việc gộp DTO vào model trong module customer-service.

## Thay đổi đã thực hiện

1. **Cập nhật các model để phù hợp với API**:
   - Thêm annotation `@JsonInclude(JsonInclude.Include.NON_NULL)` để loại bỏ các trường null khi serialize
   - Thêm các annotation Lombok như `@Data`, `@NoArgsConstructor`, `@AllArgsConstructor` để giảm boilerplate code
   - Thêm annotation `@JsonManagedReference` và `@JsonBackReference` để xử lý tham chiếu vòng tròn

2. **Cập nhật các service**:
   - Loại bỏ các phương thức chuyển đổi `convertToDTO` và `convertToEntity`
   - Thay đổi kiểu dữ liệu trả về từ DTO sang model
   - Cập nhật logic xử lý để làm việc trực tiếp với model

3. **Cập nhật các controller**:
   - Thay đổi kiểu dữ liệu tham số và kiểu dữ liệu trả về từ DTO sang model

4. **Xóa các file DTO không cần thiết**:
   - `KhachHangDTO.java`
   - `DiaChiDTO.java`
   - `TrangPhucDTO.java`
   - `DonDatTrangPhucDTO.java`
   - `ChiTietDonDatDTO.java`

## Luồng hoạt động trước khi thay đổi

```
1. Client gửi request đến Controller
2. Controller gọi Service
3. Service gọi Repository để thao tác với database
4. Repository trả về Entity/Model cho Service
5. Service chuyển đổi Entity/Model thành DTO (thông qua phương thức convertToDTO)
6. Service trả về DTO cho Controller
7. Controller trả về DTO cho Client (dưới dạng JSON)
```

## Luồng hoạt động sau khi thay đổi

```
1. Client gửi request đến Controller
2. Controller gọi Service
3. Service gọi Repository để thao tác với database
4. Repository trả về Entity/Model cho Service
5. Service trả về Entity/Model trực tiếp cho Controller (không cần chuyển đổi)
6. Controller trả về Entity/Model cho Client (dưới dạng JSON)
```

## Ưu điểm

1. **Giảm mã lặp lại**: Không cần viết các phương thức chuyển đổi giữa Entity và DTO
2. **Đơn giản hóa codebase**: Giảm số lượng lớp cần quản lý
3. **Hiệu suất tốt hơn**: Không tốn thời gian chuyển đổi giữa các đối tượng

## Lưu ý

1. **Xử lý tham chiếu vòng tròn**: Cần sử dụng `@JsonManagedReference` và `@JsonBackReference` để tránh lỗi khi serialize
2. **Bảo mật**: Cần cẩn thận với các thông tin nhạy cảm trong model
3. **Kiểm soát dữ liệu**: Cần kiểm soát chặt chẽ dữ liệu được gửi đi và nhận về
