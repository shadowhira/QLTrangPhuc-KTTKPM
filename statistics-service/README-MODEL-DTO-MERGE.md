# Gộp DTO vào Model

Tài liệu này mô tả việc gộp DTO vào model trong module statistics-service.

## Thay đổi đã thực hiện

1. **Xóa các file DTO**:
   - `ThongKeDoanhThuDTO.java`
   - `ThongKeDoanhThuKhachHangDTO.java`

2. **Cập nhật các model để sử dụng trực tiếp trong API**:
   - Thêm annotation `@JsonInclude(JsonInclude.Include.NON_NULL)` để loại bỏ các trường null khi serialize

3. **Cập nhật các service để trả về model thay vì DTO**:
   - Loại bỏ các phương thức chuyển đổi `chuyenSangDTO`
   - Thay đổi kiểu dữ liệu trả về từ DTO sang model

4. **Cập nhật các controller để sử dụng model thay vì DTO**:
   - Thay đổi kiểu dữ liệu tham số và kiểu dữ liệu trả về từ DTO sang model

## Lợi ích của việc gộp DTO vào model

1. **Giảm code trùng lặp**: Không cần duy trì hai class gần như giống hệt nhau.

2. **Đơn giản hóa codebase**: Giảm số lượng file và phương thức cần duy trì.

3. **Tăng hiệu suất**: Loại bỏ bước chuyển đổi giữa Entity/Model và DTO giúp tăng hiệu suất, đặc biệt khi xử lý nhiều bản ghi.

4. **Dễ bảo trì hơn**: Khi cần thay đổi cấu trúc dữ liệu, chỉ cần thay đổi ở một nơi (Entity/Model) thay vì hai nơi (Entity/Model và DTO).

## Thay đổi trong luồng hoạt động

### Luồng hoạt động trước khi thay đổi

```
1. Client gửi request đến Controller
2. Controller gọi Service
3. Service gọi Repository để thao tác với database
4. Repository trả về Entity/Model cho Service
5. Service chuyển đổi Entity/Model thành DTO (thông qua phương thức chuyenSangDTO)
6. Service trả về DTO cho Controller
7. Controller trả về DTO cho Client (dưới dạng JSON)
```

### Luồng hoạt động sau khi thay đổi

```
1. Client gửi request đến Controller
2. Controller gọi Service
3. Service gọi Repository để thao tác với database
4. Repository trả về Entity/Model cho Service
5. Service trả về Entity/Model trực tiếp cho Controller (không cần chuyển đổi)
6. Controller trả về Entity/Model cho Client (dưới dạng JSON)
```

## Lưu ý

1. Việc gộp DTO vào model có thể không phù hợp trong một số trường hợp, đặc biệt khi:
   - Cần kiểm soát chặt chẽ dữ liệu được trả về cho client
   - Có các thuộc tính nhạy cảm trong model mà không muốn trả về cho client
   - Cấu trúc dữ liệu trả về khác biệt nhiều so với cấu trúc lưu trữ

2. Trong trường hợp cần kiểm soát dữ liệu được trả về, có thể sử dụng các annotation như `@JsonIgnore` để loại bỏ các trường không muốn trả về.

3. Nếu sau này cần thay đổi cấu trúc dữ liệu trả về mà không muốn thay đổi cấu trúc lưu trữ, có thể cần phải tách lại DTO và model.
