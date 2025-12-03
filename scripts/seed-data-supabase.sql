-- =====================================================
-- DỮ LIỆU MẪU CHO HỆ THỐNG QUẢN LÝ TRANG PHỤC
-- Chạy script này trong Supabase SQL Editor
-- =====================================================

-- Xóa dữ liệu cũ (nếu có)
TRUNCATE TABLE chi_tiet_don_dat CASCADE;
TRUNCATE TABLE don_dat_trang_phuc CASCADE;
TRUNCATE TABLE trang_phuc CASCADE;
TRUNCATE TABLE dia_chi CASCADE;
TRUNCATE TABLE khach_hang CASCADE;

-- =====================================================
-- 1. KHÁCH HÀNG (20 khách hàng đa dạng)
-- =====================================================
INSERT INTO khach_hang (id, ho_ten, email, so_dien_thoai, ngay_sinh, gioi_tinh, ngay_dang_ky) VALUES
(1, 'Nguyễn Văn An', 'nguyenvanan@gmail.com', '0901234567', '1990-05-15', 'Nam', '2024-01-10'),
(2, 'Trần Thị Bình', 'tranthibinh@gmail.com', '0912345678', '1995-08-20', 'Nữ', '2024-01-15'),
(3, 'Lê Hoàng Cường', 'lehoangcuong@gmail.com', '0923456789', '1988-12-03', 'Nam', '2024-02-01'),
(4, 'Phạm Thị Dung', 'phamthidung@gmail.com', '0934567890', '1992-03-25', 'Nữ', '2024-02-10'),
(5, 'Hoàng Văn Em', 'hoangvanem@gmail.com', '0945678901', '1985-07-18', 'Nam', '2024-02-20'),
(6, 'Vũ Thị Phương', 'vuthiphuong@gmail.com', '0956789012', '1998-11-08', 'Nữ', '2024-03-01'),
(7, 'Đặng Minh Giang', 'dangminhgiang@gmail.com', '0967890123', '1993-04-12', 'Nam', '2024-03-15'),
(8, 'Bùi Thị Hạnh', 'buithihanh@gmail.com', '0978901234', '1996-09-30', 'Nữ', '2024-03-25'),
(9, 'Ngô Đức Hùng', 'ngoduchung@gmail.com', '0989012345', '1987-01-22', 'Nam', '2024-04-05'),
(10, 'Dương Thị Kim', 'duongthikim@gmail.com', '0990123456', '1994-06-17', 'Nữ', '2024-04-15'),
(11, 'Lý Văn Long', 'lyvanlong@gmail.com', '0901122334', '1991-02-28', 'Nam', '2024-05-01'),
(12, 'Trịnh Thị Mai', 'trinhthimai@gmail.com', '0912233445', '1997-10-05', 'Nữ', '2024-05-10'),
(13, 'Phan Quốc Nam', 'phanquocnam@gmail.com', '0923344556', '1989-08-14', 'Nam', '2024-06-01'),
(14, 'Cao Thị Oanh', 'caothioanh@gmail.com', '0934455667', '1995-12-20', 'Nữ', '2024-06-15'),
(15, 'Đinh Văn Phúc', 'dinhvanphuc@gmail.com', '0945566778', '1986-04-08', 'Nam', '2024-07-01'),
(16, 'Hồ Thị Quỳnh', 'hothiquynh@gmail.com', '0956677889', '1999-07-25', 'Nữ', '2024-07-20'),
(17, 'Tạ Minh Sơn', 'taminhson@gmail.com', '0967788990', '1992-11-11', 'Nam', '2024-08-01'),
(18, 'Lương Thị Tâm', 'luongthitam@gmail.com', '0978899001', '1996-03-03', 'Nữ', '2024-08-15'),
(19, 'Châu Văn Uy', 'chauvanuy@gmail.com', '0989900112', '1988-09-19', 'Nam', '2024-09-01'),
(20, 'Mai Thị Vân', 'maithivan@gmail.com', '0990011223', '1994-05-27', 'Nữ', '2024-09-15');

-- Reset sequence
SELECT setval('khach_hang_id_seq', 20);

-- =====================================================
-- 2. ĐỊA CHỈ (mỗi khách hàng 1-2 địa chỉ)
-- =====================================================
INSERT INTO dia_chi (id, khach_hang_id, duong, phuong_xa, quan_huyen, tinh_thanh, mac_dinh) VALUES
(1, 1, '123 Nguyễn Huệ', 'Bến Nghé', 'Quận 1', 'TP. Hồ Chí Minh', true),
(2, 2, '456 Lê Lợi', 'Bến Thành', 'Quận 1', 'TP. Hồ Chí Minh', true),
(3, 3, '789 Trần Hưng Đạo', 'Cầu Ông Lãnh', 'Quận 1', 'TP. Hồ Chí Minh', true),
(4, 4, '101 Hai Bà Trưng', 'Tân Định', 'Quận 1', 'TP. Hồ Chí Minh', true),
(5, 5, '202 Võ Văn Tần', 'Phường 5', 'Quận 3', 'TP. Hồ Chí Minh', true),
(6, 6, '303 Nguyễn Đình Chiểu', 'Phường 6', 'Quận 3', 'TP. Hồ Chí Minh', true),
(7, 7, '404 Cách Mạng Tháng 8', 'Phường 10', 'Quận 3', 'TP. Hồ Chí Minh', true),
(8, 8, '505 Lý Chính Thắng', 'Phường 7', 'Quận 3', 'TP. Hồ Chí Minh', true),
(9, 9, '25 Lê Duẩn', 'Bến Nghé', 'Quận 1', 'TP. Hồ Chí Minh', true),
(10, 10, '67 Pasteur', 'Bến Nghé', 'Quận 1', 'TP. Hồ Chí Minh', true),
(11, 11, '89 Nam Kỳ Khởi Nghĩa', 'Bến Thành', 'Quận 1', 'TP. Hồ Chí Minh', true),
(12, 12, '12 Đồng Khởi', 'Bến Nghé', 'Quận 1', 'TP. Hồ Chí Minh', true),
(13, 13, '34 Nguyễn Thị Minh Khai', 'Phường 6', 'Quận 3', 'TP. Hồ Chí Minh', true),
(14, 14, '56 Võ Thị Sáu', 'Tân Định', 'Quận 3', 'TP. Hồ Chí Minh', true),
(15, 15, '78 Điện Biên Phủ', 'Phường 15', 'Quận Bình Thạnh', 'TP. Hồ Chí Minh', true),
(16, 16, '90 Xô Viết Nghệ Tĩnh', 'Phường 21', 'Quận Bình Thạnh', 'TP. Hồ Chí Minh', true),
(17, 17, '11 Nguyễn Hữu Cảnh', 'Phường 22', 'Quận Bình Thạnh', 'TP. Hồ Chí Minh', true),
(18, 18, '22 Phan Đăng Lưu', 'Phường 3', 'Quận Phú Nhuận', 'TP. Hồ Chí Minh', true),
(19, 19, '33 Hoàng Văn Thụ', 'Phường 8', 'Quận Phú Nhuận', 'TP. Hồ Chí Minh', true),
(20, 20, '44 Nguyễn Văn Trỗi', 'Phường 10', 'Quận Phú Nhuận', 'TP. Hồ Chí Minh', true);

SELECT setval('dia_chi_id_seq', 20);

-- =====================================================
-- 3. TRANG PHỤC (30 sản phẩm đa dạng)
-- =====================================================
INSERT INTO trang_phuc (id, ten, loai, mau_sac, kich_co, gia_thue, gia_ban, so_luong, tinh_trang, mo_ta) VALUES
-- Áo dài
(1, 'Áo dài cưới trắng', 'Áo dài', 'Trắng', 'M', 500000, 2500000, 5, 'Còn hàng', 'Áo dài cưới truyền thống màu trắng, thêu hoa sen'),
(2, 'Áo dài cưới đỏ', 'Áo dài', 'Đỏ', 'S', 550000, 2800000, 3, 'Còn hàng', 'Áo dài cưới màu đỏ may mắn, thêu chỉ vàng'),
(3, 'Áo dài lễ hội xanh', 'Áo dài', 'Xanh dương', 'L', 400000, 1800000, 8, 'Còn hàng', 'Áo dài lễ hội thanh lịch'),
(4, 'Áo dài học sinh', 'Áo dài', 'Trắng', 'M', 150000, 800000, 20, 'Còn hàng', 'Áo dài trắng cho học sinh'),

-- Vest nam
(5, 'Vest cưới đen classic', 'Vest', 'Đen', 'L', 600000, 3500000, 6, 'Còn hàng', 'Vest cưới đen phong cách classic'),
(6, 'Vest xám công sở', 'Vest', 'Xám', 'M', 400000, 2200000, 10, 'Còn hàng', 'Vest xám thanh lịch cho công sở'),
(7, 'Vest navy slim fit', 'Vest', 'Xanh navy', 'L', 450000, 2500000, 7, 'Còn hàng', 'Vest navy dáng slim fit hiện đại'),
(8, 'Vest trắng dạ hội', 'Vest', 'Trắng', 'XL', 700000, 4000000, 4, 'Còn hàng', 'Vest trắng sang trọng cho dạ hội'),

-- Đầm dạ hội
(9, 'Đầm dạ hội đỏ', 'Đầm dạ hội', 'Đỏ', 'S', 800000, 5000000, 3, 'Còn hàng', 'Đầm dạ hội đỏ quyến rũ'),
(10, 'Đầm dạ hội xanh emerald', 'Đầm dạ hội', 'Xanh lá', 'M', 750000, 4500000, 4, 'Còn hàng', 'Đầm dạ hội màu xanh emerald sang trọng'),
(11, 'Đầm dạ hội đen sequin', 'Đầm dạ hội', 'Đen', 'S', 900000, 5500000, 2, 'Còn hàng', 'Đầm đen đính sequin lấp lánh'),
(12, 'Đầm dạ hội champagne', 'Đầm dạ hội', 'Vàng champagne', 'M', 850000, 5200000, 3, 'Còn hàng', 'Đầm màu champagne thanh lịch'),

-- Váy cưới
(13, 'Váy cưới công chúa', 'Váy cưới', 'Trắng', 'S', 1500000, 15000000, 2, 'Còn hàng', 'Váy cưới kiểu công chúa lộng lẫy'),
(14, 'Váy cưới đuôi cá', 'Váy cưới', 'Trắng ngà', 'M', 1200000, 12000000, 3, 'Còn hàng', 'Váy cưới đuôi cá gợi cảm'),
(15, 'Váy cưới minimalist', 'Váy cưới', 'Trắng', 'S', 800000, 8000000, 4, 'Còn hàng', 'Váy cưới phong cách tối giản'),
(16, 'Váy cưới vintage', 'Váy cưới', 'Kem', 'M', 1000000, 10000000, 2, 'Còn hàng', 'Váy cưới phong cách vintage'),

-- Trang phục truyền thống
(17, 'Hanbok Hàn Quốc nữ', 'Trang phục truyền thống', 'Hồng', 'M', 350000, 1500000, 5, 'Còn hàng', 'Hanbok truyền thống Hàn Quốc cho nữ'),
(18, 'Hanbok Hàn Quốc nam', 'Trang phục truyền thống', 'Xanh', 'L', 300000, 1300000, 4, 'Còn hàng', 'Hanbok truyền thống Hàn Quốc cho nam'),
(19, 'Kimono Nhật Bản', 'Trang phục truyền thống', 'Đỏ hoa', 'Free size', 400000, 2000000, 3, 'Còn hàng', 'Kimono truyền thống Nhật Bản'),
(20, 'Sườn xám Trung Hoa', 'Trang phục truyền thống', 'Đỏ', 'S', 450000, 2200000, 4, 'Còn hàng', 'Sườn xám truyền thống Trung Hoa'),

-- Trang phục cosplay/sự kiện
(21, 'Trang phục MC nam', 'Trang phục sự kiện', 'Đen', 'L', 300000, 1500000, 6, 'Còn hàng', 'Trang phục MC chuyên nghiệp nam'),
(22, 'Trang phục MC nữ', 'Trang phục sự kiện', 'Đỏ', 'M', 350000, 1700000, 5, 'Còn hàng', 'Trang phục MC chuyên nghiệp nữ'),
(23, 'Trang phục Santa Claus', 'Trang phục sự kiện', 'Đỏ trắng', 'XL', 200000, 800000, 10, 'Còn hàng', 'Trang phục ông già Noel'),
(24, 'Trang phục Halloween', 'Trang phục sự kiện', 'Đen cam', 'Free size', 150000, 500000, 15, 'Còn hàng', 'Trang phục hóa trang Halloween'),

-- Phụ kiện
(25, 'Khăn voan cưới dài', 'Phụ kiện', 'Trắng', 'Free size', 100000, 500000, 10, 'Còn hàng', 'Khăn voan cưới dài 3m'),
(26, 'Vương miện cô dâu', 'Phụ kiện', 'Bạc', 'Free size', 150000, 800000, 8, 'Còn hàng', 'Vương miện cô dâu đính đá'),
(27, 'Nơ cài vest', 'Phụ kiện', 'Đen', 'Free size', 50000, 200000, 20, 'Còn hàng', 'Nơ cài vest nam'),
(28, 'Găng tay ren cô dâu', 'Phụ kiện', 'Trắng', 'Free size', 80000, 350000, 12, 'Còn hàng', 'Găng tay ren cho cô dâu'),
(29, 'Cà vạt lụa', 'Phụ kiện', 'Đỏ đô', 'Free size', 60000, 250000, 15, 'Còn hàng', 'Cà vạt lụa cao cấp'),
(30, 'Hoa cài áo', 'Phụ kiện', 'Trắng', 'Free size', 30000, 150000, 25, 'Còn hàng', 'Hoa cài áo chú rể');

SELECT setval('trang_phuc_id_seq', 30);

-- =====================================================
-- 4. ĐƠN ĐẶT TRANG PHỤC (40 đơn hàng từ 2024)
-- =====================================================
INSERT INTO don_dat_trang_phuc (id, khach_hang_id, ngay_dat, ngay_tra, trang_thai, tong_tien, ghi_chu) VALUES
-- Tháng 1/2024
(1, 1, '2024-01-15 10:00:00', '2024-01-20 18:00:00', 'Đã thanh toán', 1100000, 'Đơn hàng cưới'),
(2, 2, '2024-01-20 14:00:00', '2024-01-25 18:00:00', 'Đã thanh toán', 2300000, 'Thuê váy cưới + phụ kiện'),

-- Tháng 2/2024
(3, 3, '2024-02-05 09:00:00', '2024-02-10 18:00:00', 'Đã thanh toán', 600000, 'Vest công sở'),
(4, 4, '2024-02-14 11:00:00', '2024-02-16 18:00:00', 'Đã thanh toán', 800000, 'Đầm dạ hội Valentine'),
(5, 5, '2024-02-20 15:00:00', '2024-02-25 18:00:00', 'Đã thanh toán', 950000, 'Vest + cà vạt'),

-- Tháng 3/2024
(6, 6, '2024-03-01 10:00:00', '2024-03-05 18:00:00', 'Đã thanh toán', 500000, 'Áo dài lễ hội'),
(7, 7, '2024-03-10 13:00:00', '2024-03-15 18:00:00', 'Đã thanh toán', 1700000, 'Váy cưới minimalist'),
(8, 8, '2024-03-20 16:00:00', '2024-03-25 18:00:00', 'Đã thanh toán', 750000, 'Đầm dạ hội xanh'),

-- Tháng 4/2024
(9, 9, '2024-04-05 09:00:00', '2024-04-10 18:00:00', 'Đã thanh toán', 600000, 'Vest nam'),
(10, 10, '2024-04-15 14:00:00', '2024-04-20 18:00:00', 'Đã thanh toán', 1050000, 'Áo dài cưới đỏ + phụ kiện'),
(11, 1, '2024-04-25 11:00:00', '2024-04-30 18:00:00', 'Đã thanh toán', 350000, 'Hanbok'),

-- Tháng 5/2024
(12, 2, '2024-05-01 10:00:00', '2024-05-05 18:00:00', 'Đã thanh toán', 900000, 'Đầm dạ hội đen'),
(13, 3, '2024-05-10 15:00:00', '2024-05-15 18:00:00', 'Đã thanh toán', 700000, 'Vest trắng'),
(14, 4, '2024-05-20 12:00:00', '2024-05-25 18:00:00', 'Đã thanh toán', 1200000, 'Váy cưới đuôi cá'),

-- Tháng 6/2024
(15, 5, '2024-06-01 09:00:00', '2024-06-05 18:00:00', 'Đã thanh toán', 450000, 'Sườn xám'),
(16, 6, '2024-06-10 14:00:00', '2024-06-15 18:00:00', 'Đã thanh toán', 1600000, 'Váy cưới công chúa'),
(17, 7, '2024-06-20 11:00:00', '2024-06-25 18:00:00', 'Đã thanh toán', 850000, 'Đầm champagne'),

-- Tháng 7/2024
(18, 8, '2024-07-05 10:00:00', '2024-07-10 18:00:00', 'Đã thanh toán', 500000, 'Áo dài trắng'),
(19, 9, '2024-07-15 13:00:00', '2024-07-20 18:00:00', 'Đã thanh toán', 750000, 'Vest navy'),
(20, 10, '2024-07-25 16:00:00', '2024-07-30 18:00:00', 'Đã thanh toán', 400000, 'Kimono'),

-- Tháng 8/2024
(21, 11, '2024-08-01 09:00:00', '2024-08-05 18:00:00', 'Đã thanh toán', 650000, 'Vest xám + nơ'),
(22, 12, '2024-08-10 14:00:00', '2024-08-15 18:00:00', 'Đã thanh toán', 1100000, 'Áo dài cưới trắng + khăn'),
(23, 13, '2024-08-20 11:00:00', '2024-08-25 18:00:00', 'Đã thanh toán', 800000, 'Đầm đỏ dạ hội'),

-- Tháng 9/2024
(24, 14, '2024-09-01 10:00:00', '2024-09-05 18:00:00', 'Đã thanh toán', 950000, 'Vest đen + cà vạt'),
(25, 15, '2024-09-10 15:00:00', '2024-09-15 18:00:00', 'Đã thanh toán', 1000000, 'Váy cưới vintage'),
(26, 16, '2024-09-20 12:00:00', '2024-09-25 18:00:00', 'Đã thanh toán', 350000, 'Trang phục MC nữ'),

-- Tháng 10/2024
(27, 17, '2024-10-05 09:00:00', '2024-10-10 18:00:00', 'Đã thanh toán', 300000, 'Trang phục MC nam'),
(28, 18, '2024-10-15 14:00:00', '2024-10-20 18:00:00', 'Đã thanh toán', 150000, 'Trang phục Halloween'),
(29, 19, '2024-10-25 11:00:00', '2024-10-31 18:00:00', 'Đã thanh toán', 300000, '2x Halloween costumes'),

-- Tháng 11/2024
(30, 20, '2024-11-01 10:00:00', '2024-11-05 18:00:00', 'Đã thanh toán', 1650000, 'Váy cưới + vương miện'),
(31, 1, '2024-11-10 13:00:00', '2024-11-15 18:00:00', 'Đã thanh toán', 750000, 'Đầm emerald'),
(32, 2, '2024-11-20 16:00:00', '2024-11-25 18:00:00', 'Đã thanh toán', 550000, 'Áo dài đỏ'),

-- Tháng 12/2024
(33, 3, '2024-12-01 09:00:00', '2024-12-05 18:00:00', 'Đã thanh toán', 200000, 'Santa Claus'),
(34, 4, '2024-12-10 14:00:00', '2024-12-15 18:00:00', 'Đã thanh toán', 900000, 'Đầm sequin'),
(35, 5, '2024-12-15 11:00:00', '2024-12-20 18:00:00', 'Đã thanh toán', 1700000, 'Váy cưới + găng tay'),
(36, 6, '2024-12-20 10:00:00', '2024-12-25 18:00:00', 'Đang thuê', 600000, 'Vest đen'),
(37, 7, '2024-12-22 15:00:00', '2024-12-27 18:00:00', 'Đang thuê', 850000, 'Đầm champagne'),
(38, 8, '2024-12-25 12:00:00', '2024-12-30 18:00:00', 'Chờ xử lý', 500000, 'Áo dài lễ hội'),
(39, 9, '2024-12-28 09:00:00', '2025-01-02 18:00:00', 'Chờ xử lý', 1200000, 'Váy cưới đuôi cá'),
(40, 10, '2024-12-30 14:00:00', '2025-01-05 18:00:00', 'Chờ xử lý', 950000, 'Vest + phụ kiện');

SELECT setval('don_dat_trang_phuc_id_seq', 40);

-- =====================================================
-- 5. CHI TIẾT ĐƠN ĐẶT
-- =====================================================
INSERT INTO chi_tiet_don_dat (id, don_dat_trang_phuc_id, trang_phuc_id, so_luong, gia_thue, thanh_tien) VALUES
-- Đơn 1: Áo dài cưới trắng + khăn voan
(1, 1, 1, 1, 500000, 500000),
(2, 1, 25, 1, 100000, 100000),
(3, 1, 26, 1, 150000, 150000),
(4, 1, 28, 1, 80000, 80000),
(5, 1, 30, 1, 30000, 30000),

-- Đơn 2: Váy cưới công chúa + phụ kiện
(6, 2, 13, 1, 1500000, 1500000),
(7, 2, 25, 1, 100000, 100000),
(8, 2, 26, 1, 150000, 150000),
(9, 2, 28, 1, 80000, 80000),

-- Đơn 3: Vest xám
(10, 3, 6, 1, 400000, 400000),
(11, 3, 27, 1, 50000, 50000),

-- Đơn 4: Đầm đỏ dạ hội
(12, 4, 9, 1, 800000, 800000),

-- Đơn 5: Vest đen + cà vạt
(13, 5, 5, 1, 600000, 600000),
(14, 5, 29, 1, 60000, 60000),

-- Đơn 6: Áo dài lễ hội
(15, 6, 3, 1, 400000, 400000),

-- Đơn 7: Váy cưới minimalist + khăn
(16, 7, 15, 1, 800000, 800000),
(17, 7, 25, 1, 100000, 100000),

-- Đơn 8: Đầm emerald
(18, 8, 10, 1, 750000, 750000),

-- Đơn 9: Vest navy
(19, 9, 7, 1, 450000, 450000),

-- Đơn 10: Áo dài đỏ + vương miện
(20, 10, 2, 1, 550000, 550000),
(21, 10, 26, 1, 150000, 150000),

-- Đơn 11: Hanbok
(22, 11, 17, 1, 350000, 350000),

-- Đơn 12: Đầm đen sequin
(23, 12, 11, 1, 900000, 900000),

-- Đơn 13: Vest trắng
(24, 13, 8, 1, 700000, 700000),

-- Đơn 14: Váy đuôi cá
(25, 14, 14, 1, 1200000, 1200000),

-- Đơn 15: Sườn xám
(26, 15, 20, 1, 450000, 450000),

-- Đơn 16: Váy công chúa
(27, 16, 13, 1, 1500000, 1500000),
(28, 16, 25, 1, 100000, 100000),

-- Đơn 17: Đầm champagne
(29, 17, 12, 1, 850000, 850000),

-- Đơn 18: Áo dài trắng (học sinh)
(30, 18, 4, 1, 150000, 150000),
(31, 18, 17, 1, 350000, 350000),

-- Đơn 19: Vest navy + nơ
(32, 19, 7, 1, 450000, 450000),
(33, 19, 27, 1, 50000, 50000),

-- Đơn 20: Kimono
(34, 20, 19, 1, 400000, 400000),

-- Đơn 21-40: Chi tiết tương tự
(35, 21, 6, 1, 400000, 400000),
(36, 21, 27, 1, 50000, 50000),
(37, 22, 1, 1, 500000, 500000),
(38, 22, 25, 1, 100000, 100000),
(39, 23, 9, 1, 800000, 800000),
(40, 24, 5, 1, 600000, 600000),
(41, 24, 29, 1, 60000, 60000),
(42, 25, 16, 1, 1000000, 1000000),
(43, 26, 22, 1, 350000, 350000),
(44, 27, 21, 1, 300000, 300000),
(45, 28, 24, 1, 150000, 150000),
(46, 29, 24, 2, 150000, 300000),
(47, 30, 13, 1, 1500000, 1500000),
(48, 30, 26, 1, 150000, 150000),
(49, 31, 10, 1, 750000, 750000),
(50, 32, 2, 1, 550000, 550000),
(51, 33, 23, 1, 200000, 200000),
(52, 34, 11, 1, 900000, 900000),
(53, 35, 13, 1, 1500000, 1500000),
(54, 35, 28, 1, 80000, 80000),
(55, 36, 5, 1, 600000, 600000),
(56, 37, 12, 1, 850000, 850000),
(57, 38, 3, 1, 400000, 400000),
(58, 39, 14, 1, 1200000, 1200000),
(59, 40, 5, 1, 600000, 600000),
(60, 40, 29, 1, 60000, 60000);

SELECT setval('chi_tiet_don_dat_id_seq', 60);

-- =====================================================
-- KIỂM TRA DỮ LIỆU
-- =====================================================
SELECT 'Khách hàng:', COUNT(*) FROM khach_hang;
SELECT 'Địa chỉ:', COUNT(*) FROM dia_chi;
SELECT 'Trang phục:', COUNT(*) FROM trang_phuc;
SELECT 'Đơn đặt:', COUNT(*) FROM don_dat_trang_phuc;
SELECT 'Chi tiết đơn:', COUNT(*) FROM chi_tiet_don_dat;

-- Thống kê doanh thu theo tháng
SELECT 
    DATE_TRUNC('month', ngay_dat) as thang,
    COUNT(*) as so_don,
    SUM(tong_tien) as doanh_thu
FROM don_dat_trang_phuc 
WHERE trang_thai = 'Đã thanh toán'
GROUP BY DATE_TRUNC('month', ngay_dat)
ORDER BY thang;
