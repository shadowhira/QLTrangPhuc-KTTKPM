package com.example.customerservice.config;

import com.example.customerservice.model.DiaChi;
import com.example.customerservice.model.KhachHang;
import com.example.customerservice.model.DonDatTrangPhuc;
import com.example.customerservice.model.ChiTietDonDat;
import com.example.customerservice.model.TrangPhuc;
import com.example.customerservice.repository.KhachHangRepository;
import com.example.customerservice.repository.DonDatTrangPhucRepository;
import com.example.customerservice.repository.TrangPhucRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    @Profile("!prod")
    public CommandLineRunner initData(KhachHangRepository khachHangRepository,
                                     TrangPhucRepository trangPhucRepository,
                                     DonDatTrangPhucRepository donDatTrangPhucRepository) {
        return args -> {
            // Check if data already exists
            if (khachHangRepository.count() > 0) {
                return;
            }

            // Create trang phuc
            TrangPhuc trangPhuc1 = new TrangPhuc();
            trangPhuc1.setTen("Áo dài truyền thống");
            trangPhuc1.setLoai("Áo dài");
            trangPhuc1.setGiaThueNgay(new BigDecimal("150000"));
            trangPhuc1.setGiaBan(new BigDecimal("2500000"));
            trangPhuc1.setTrangThai("Có sẵn");
            trangPhuc1.setMoTa("Áo dài truyền thống Việt Nam, màu đỏ, thêu hoa");

            TrangPhuc trangPhuc2 = new TrangPhuc();
            trangPhuc2.setTen("Vest nam cao cấp");
            trangPhuc2.setLoai("Vest");
            trangPhuc2.setGiaThueNgay(new BigDecimal("200000"));
            trangPhuc2.setGiaBan(new BigDecimal("3500000"));
            trangPhuc2.setTrangThai("Có sẵn");
            trangPhuc2.setMoTa("Vest nam cao cấp, màu đen, chất liệu nhập khẩu");

            TrangPhuc trangPhuc3 = new TrangPhuc();
            trangPhuc3.setTen("Váy cưới công chúa");
            trangPhuc3.setLoai("Váy cưới");
            trangPhuc3.setGiaThueNgay(new BigDecimal("500000"));
            trangPhuc3.setGiaBan(new BigDecimal("10000000"));
            trangPhuc3.setTrangThai("Có sẵn");
            trangPhuc3.setMoTa("Váy cưới kiểu công chúa, đính pha lê, màu trắng");

            List<TrangPhuc> trangPhucs = Arrays.asList(trangPhuc1, trangPhuc2, trangPhuc3);
            trangPhucRepository.saveAll(trangPhucs);

            // Create khach hang with dia chi
            DiaChi diaChi1 = new DiaChi();
            diaChi1.setThonXom("123 Nguyễn Huệ");
            diaChi1.setQuanHuyen("Quận 1");
            diaChi1.setTinhThanhPho("TP. Hồ Chí Minh");

            KhachHang khachHang1 = new KhachHang();
            khachHang1.setHo("Nguyễn");
            khachHang1.setTen("Văn A");
            khachHang1.setSdt("0901234567");
            khachHang1.setEmail("nguyenvana@example.com");
            khachHang1.setTongChiTieu(0.0);
            khachHang1.setDiaChi(diaChi1);

            DiaChi diaChi2 = new DiaChi();
            diaChi2.setThonXom("456 Lê Lợi");
            diaChi2.setQuanHuyen("Quận 2");
            diaChi2.setTinhThanhPho("TP. Hồ Chí Minh");

            KhachHang khachHang2 = new KhachHang();
            khachHang2.setHo("Trần");
            khachHang2.setTen("Thị B");
            khachHang2.setSdt("0912345678");
            khachHang2.setEmail("tranthib@example.com");
            khachHang2.setTongChiTieu(0.0);
            khachHang2.setDiaChi(diaChi2);

            DiaChi diaChi3 = new DiaChi();
            diaChi3.setThonXom("789 Hàm Nghi");
            diaChi3.setQuanHuyen("Quận 3");
            diaChi3.setTinhThanhPho("TP. Hồ Chí Minh");

            KhachHang khachHang3 = new KhachHang();
            khachHang3.setHo("Lê");
            khachHang3.setTen("Văn C");
            khachHang3.setSdt("0923456789");
            khachHang3.setEmail("levanc@example.com");
            khachHang3.setTongChiTieu(0.0);
            khachHang3.setDiaChi(diaChi3);

            List<KhachHang> khachHangs = Arrays.asList(khachHang1, khachHang2, khachHang3);
            khachHangRepository.saveAll(khachHangs);

            // Create don dat trang phuc
            // Don dat trang phuc for khach hang 1
            DonDatTrangPhuc donDat1 = new DonDatTrangPhuc();
            donDat1.setNgayDat(LocalDateTime.now().minusDays(30));
            donDat1.setTrangThai("Đã thanh toán");
            donDat1.setKhachHang(khachHang1);

            ChiTietDonDat chiTiet1 = new ChiTietDonDat();
            chiTiet1.setTrangPhuc(trangPhuc1);
            chiTiet1.setSoLuongDat(1);
            chiTiet1.setDonGia(trangPhuc1.getGiaBan());
            chiTiet1.calculateThanhTien();

            donDat1.addChiTietDonDat(chiTiet1);
            donDatTrangPhucRepository.save(donDat1);

            // Update khach hang tong chi tieu
            khachHang1.setTongChiTieu(donDat1.getTongTien().doubleValue());
            khachHangRepository.save(khachHang1);

            // Don dat trang phuc for khach hang 2
            DonDatTrangPhuc donDat2 = new DonDatTrangPhuc();
            donDat2.setNgayDat(LocalDateTime.now().minusDays(15));
            donDat2.setTrangThai("Đã thanh toán");
            donDat2.setKhachHang(khachHang2);

            ChiTietDonDat chiTiet2 = new ChiTietDonDat();
            chiTiet2.setTrangPhuc(trangPhuc2);
            chiTiet2.setSoLuongDat(1);
            chiTiet2.setDonGia(trangPhuc2.getGiaBan());
            chiTiet2.calculateThanhTien();

            ChiTietDonDat chiTiet3 = new ChiTietDonDat();
            chiTiet3.setTrangPhuc(trangPhuc3);
            chiTiet3.setSoLuongDat(1);
            chiTiet3.setDonGia(trangPhuc3.getGiaBan());
            chiTiet3.calculateThanhTien();

            donDat2.addChiTietDonDat(chiTiet2);
            donDat2.addChiTietDonDat(chiTiet3);
            donDatTrangPhucRepository.save(donDat2);

            // Update khach hang tong chi tieu
            khachHang2.setTongChiTieu(donDat2.getTongTien().doubleValue());
            khachHangRepository.save(khachHang2);

            // Don dat trang phuc for khach hang 3
            DonDatTrangPhuc donDat3 = new DonDatTrangPhuc();
            donDat3.setNgayDat(LocalDateTime.now().minusDays(5));
            donDat3.setTrangThai("Đang chờ xử lý");
            donDat3.setKhachHang(khachHang3);

            ChiTietDonDat chiTiet4 = new ChiTietDonDat();
            chiTiet4.setTrangPhuc(trangPhuc1);
            chiTiet4.setSoLuongDat(2);
            chiTiet4.setDonGia(trangPhuc1.getGiaBan());
            chiTiet4.calculateThanhTien();

            donDat3.addChiTietDonDat(chiTiet4);
            donDatTrangPhucRepository.save(donDat3);

            System.out.println("Dữ liệu mẫu đã được khởi tạo thành công!");
        };
    }
}
