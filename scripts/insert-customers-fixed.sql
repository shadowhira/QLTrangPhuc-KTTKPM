-- Script để chèn 20 khách hàng mới vào cơ sở dữ liệu

-- Khách hàng 1
INSERT INTO dia_chi (quan_huyen, thon_xom, tinh_thanh_pho) VALUES ('Quận 1', 'Lê Lợi', 'TP. Hồ Chí Minh') RETURNING id;
INSERT INTO khach_hang (ho, ten, sdt, email, tong_chi_tieu, dia_chi_id) VALUES ('Nguyễn', 'Minh', '0901234567', 'minh.nguyen123@gmail.com', 15000000, currval('dia_chi_id_seq'));

-- Khách hàng 2
INSERT INTO dia_chi (quan_huyen, thon_xom, tinh_thanh_pho) VALUES ('Quận 3', 'Nguyễn Huệ', 'TP. Hồ Chí Minh') RETURNING id;
INSERT INTO khach_hang (ho, ten, sdt, email, tong_chi_tieu, dia_chi_id) VALUES ('Trần', 'Hùng', '0912345678', 'hung.tran456@gmail.com', 25000000, currval('dia_chi_id_seq'));

-- Khách hàng 3
INSERT INTO dia_chi (quan_huyen, thon_xom, tinh_thanh_pho) VALUES ('Quận 5', 'Trần Hưng Đạo', 'TP. Hồ Chí Minh') RETURNING id;
INSERT INTO khach_hang (ho, ten, sdt, email, tong_chi_tieu, dia_chi_id) VALUES ('Lê', 'Thảo', '0923456789', 'thao.le789@gmail.com', 18000000, currval('dia_chi_id_seq'));

-- Khách hàng 4
INSERT INTO dia_chi (quan_huyen, thon_xom, tinh_thanh_pho) VALUES ('Quận 2', 'Lê Duẩn', 'TP. Hồ Chí Minh') RETURNING id;
INSERT INTO khach_hang (ho, ten, sdt, email, tong_chi_tieu, dia_chi_id) VALUES ('Phạm', 'Tuấn', '0934567890', 'tuan.pham234@gmail.com', 30000000, currval('dia_chi_id_seq'));

-- Khách hàng 5
INSERT INTO dia_chi (quan_huyen, thon_xom, tinh_thanh_pho) VALUES ('Quận 7', 'Nguyễn Trãi', 'TP. Hồ Chí Minh') RETURNING id;
INSERT INTO khach_hang (ho, ten, sdt, email, tong_chi_tieu, dia_chi_id) VALUES ('Hoàng', 'Linh', '0945678901', 'linh.hoang567@gmail.com', 22000000, currval('dia_chi_id_seq'));

-- Khách hàng 6
INSERT INTO dia_chi (quan_huyen, thon_xom, tinh_thanh_pho) VALUES ('Quận 1', 'Lê Thánh Tôn', 'TP. Hồ Chí Minh') RETURNING id;
INSERT INTO khach_hang (ho, ten, sdt, email, tong_chi_tieu, dia_chi_id) VALUES ('Huỳnh', 'Anh', '0956789012', 'anh.huynh890@gmail.com', 28000000, currval('dia_chi_id_seq'));

-- Khách hàng 7
INSERT INTO dia_chi (quan_huyen, thon_xom, tinh_thanh_pho) VALUES ('Quận Bình Thạnh', 'Phan Đình Phùng', 'TP. Hồ Chí Minh') RETURNING id;
INSERT INTO khach_hang (ho, ten, sdt, email, tong_chi_tieu, dia_chi_id) VALUES ('Phan', 'Hà', '0967890123', 'ha.phan123@gmail.com', 19000000, currval('dia_chi_id_seq'));

-- Khách hàng 8
INSERT INTO dia_chi (quan_huyen, thon_xom, tinh_thanh_pho) VALUES ('Quận 10', 'Điện Biên Phủ', 'TP. Hồ Chí Minh') RETURNING id;
INSERT INTO khach_hang (ho, ten, sdt, email, tong_chi_tieu, dia_chi_id) VALUES ('Vũ', 'Quân', '0978901234', 'quan.vu456@gmail.com', 35000000, currval('dia_chi_id_seq'));

-- Khách hàng 9
INSERT INTO dia_chi (quan_huyen, thon_xom, tinh_thanh_pho) VALUES ('Quận Tân Bình', 'Cách Mạng Tháng Tám', 'TP. Hồ Chí Minh') RETURNING id;
INSERT INTO khach_hang (ho, ten, sdt, email, tong_chi_tieu, dia_chi_id) VALUES ('Võ', 'Phong', '0989012345', 'phong.vo789@gmail.com', 27000000, currval('dia_chi_id_seq'));

-- Khách hàng 10
INSERT INTO dia_chi (quan_huyen, thon_xom, tinh_thanh_pho) VALUES ('Quận 3', 'Nguyễn Thị Minh Khai', 'TP. Hồ Chí Minh') RETURNING id;
INSERT INTO khach_hang (ho, ten, sdt, email, tong_chi_tieu, dia_chi_id) VALUES ('Đặng', 'Thành', '0990123456', 'thanh.dang234@gmail.com', 32000000, currval('dia_chi_id_seq'));

-- Khách hàng 11
INSERT INTO dia_chi (quan_huyen, thon_xom, tinh_thanh_pho) VALUES ('Quận 3', 'Võ Văn Tần', 'TP. Hồ Chí Minh') RETURNING id;
INSERT INTO khach_hang (ho, ten, sdt, email, tong_chi_tieu, dia_chi_id) VALUES ('Bùi', 'Hải', '0901234568', 'hai.bui567@gmail.com', 24000000, currval('dia_chi_id_seq'));

-- Khách hàng 12
INSERT INTO dia_chi (quan_huyen, thon_xom, tinh_thanh_pho) VALUES ('Quận 1', 'Hai Bà Trưng', 'TP. Hồ Chí Minh') RETURNING id;
INSERT INTO khach_hang (ho, ten, sdt, email, tong_chi_tieu, dia_chi_id) VALUES ('Đỗ', 'Nam', '0912345679', 'nam.do890@gmail.com', 29000000, currval('dia_chi_id_seq'));

-- Khách hàng 13
INSERT INTO dia_chi (quan_huyen, thon_xom, tinh_thanh_pho) VALUES ('Quận 11', 'Lý Thường Kiệt', 'TP. Hồ Chí Minh') RETURNING id;
INSERT INTO khach_hang (ho, ten, sdt, email, tong_chi_tieu, dia_chi_id) VALUES ('Hồ', 'Đức', '0923456780', 'duc.ho123@gmail.com', 21000000, currval('dia_chi_id_seq'));

-- Khách hàng 14
INSERT INTO dia_chi (quan_huyen, thon_xom, tinh_thanh_pho) VALUES ('Quận 1', 'Phan Chu Trinh', 'TP. Hồ Chí Minh') RETURNING id;
INSERT INTO khach_hang (ho, ten, sdt, email, tong_chi_tieu, dia_chi_id) VALUES ('Ngô', 'Bảo', '0934567891', 'bao.ngo456@gmail.com', 33000000, currval('dia_chi_id_seq'));

-- Khách hàng 15
INSERT INTO dia_chi (quan_huyen, thon_xom, tinh_thanh_pho) VALUES ('Quận 4', 'Nguyễn Công Trứ', 'TP. Hồ Chí Minh') RETURNING id;
INSERT INTO khach_hang (ho, ten, sdt, email, tong_chi_tieu, dia_chi_id) VALUES ('Dương', 'Khoa', '0945678902', 'khoa.duong789@gmail.com', 26000000, currval('dia_chi_id_seq'));

-- Khách hàng 16
INSERT INTO dia_chi (quan_huyen, thon_xom, tinh_thanh_pho) VALUES ('Quận Gò Vấp', 'Lê Lợi', 'TP. Hồ Chí Minh') RETURNING id;
INSERT INTO khach_hang (ho, ten, sdt, email, tong_chi_tieu, dia_chi_id) VALUES ('Lý', 'Tiến', '0956789013', 'tien.ly234@gmail.com', 31000000, currval('dia_chi_id_seq'));

-- Khách hàng 17
INSERT INTO dia_chi (quan_huyen, thon_xom, tinh_thanh_pho) VALUES ('Quận 1', 'Nguyễn Huệ', 'TP. Hồ Chí Minh') RETURNING id;
INSERT INTO khach_hang (ho, ten, sdt, email, tong_chi_tieu, dia_chi_id) VALUES ('Đào', 'Vũ', '0967890124', 'vu.dao567@gmail.com', 23000000, currval('dia_chi_id_seq'));

-- Khách hàng 18
INSERT INTO dia_chi (quan_huyen, thon_xom, tinh_thanh_pho) VALUES ('Quận 5', 'Trần Hưng Đạo', 'TP. Hồ Chí Minh') RETURNING id;
INSERT INTO khach_hang (ho, ten, sdt, email, tong_chi_tieu, dia_chi_id) VALUES ('Đinh', 'Lâm', '0978901235', 'lam.dinh890@gmail.com', 20000000, currval('dia_chi_id_seq'));

-- Khách hàng 19
INSERT INTO dia_chi (quan_huyen, thon_xom, tinh_thanh_pho) VALUES ('Quận 1', 'Lê Duẩn', 'TP. Hồ Chí Minh') RETURNING id;
INSERT INTO khach_hang (ho, ten, sdt, email, tong_chi_tieu, dia_chi_id) VALUES ('Mai', 'Hiếu', '0989012346', 'hieu.mai123@gmail.com', 34000000, currval('dia_chi_id_seq'));

-- Khách hàng 20
INSERT INTO dia_chi (quan_huyen, thon_xom, tinh_thanh_pho) VALUES ('Quận 5', 'Nguyễn Trãi', 'TP. Hồ Chí Minh') RETURNING id;
INSERT INTO khach_hang (ho, ten, sdt, email, tong_chi_tieu, dia_chi_id) VALUES ('Trịnh', 'Hoàng', '0990123457', 'hoang.trinh456@gmail.com', 17000000, currval('dia_chi_id_seq'));
