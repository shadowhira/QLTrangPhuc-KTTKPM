package com.example.statisticsservice.strategy;

import com.example.statisticsservice.model.DonDatTrangPhuc;
import com.example.statisticsservice.model.ThongKeDoanhThu;
import com.example.statisticsservice.repository.ThongKeDoanhThuRepository;
import com.example.statisticsservice.service.KhachHangServiceClient;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.Year;
import java.util.List;

/**
 * Chiến lược thống kê doanh thu theo năm
 */
@Component
public class ThongKeTheoNamStrategy implements ThongKeStrategy {

    @Override
    public ThongKeDoanhThu taoThongKe(int nam, int giaTri, KhachHangServiceClient khachHangServiceClient, ThongKeDoanhThuRepository repository) {
        // Đối với thống kê theo năm, tham số giaTri không được sử dụng
        // Tính toán ngày bắt đầu và kết thúc của năm
        LocalDateTime ngayBatDau = Year.of(nam).atMonth(1).atDay(1).atStartOfDay();
        LocalDateTime ngayKetThuc = Year.of(nam).atMonth(12).atEndOfMonth().atTime(23, 59, 59);

        // Tạo giá trị kỳ là năm
        String giaTriKy = String.valueOf(nam);

        // Kiểm tra nếu thống kê đã tồn tại
        ThongKeDoanhThu thongKeHienCo = repository
                .findByKyThongKeAndGiaTriKy(getKyThongKe(), giaTriKy)
                .orElse(null);

        if (thongKeHienCo != null) {
            return thongKeHienCo;
        }

        // Lấy đơn đặt từ customer service
        List<DonDatTrangPhuc> donDatTrangPhucs = khachHangServiceClient
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
        return "NAM";
    }
}
