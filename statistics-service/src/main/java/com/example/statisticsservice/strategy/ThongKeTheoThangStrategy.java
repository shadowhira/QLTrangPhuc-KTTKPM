package com.example.statisticsservice.strategy;

import com.example.statisticsservice.model.DonDatTrangPhuc;
import com.example.statisticsservice.model.ThongKeDoanhThu;
import com.example.statisticsservice.repository.ThongKeDoanhThuRepository;
import com.example.statisticsservice.service.KhachHangServiceClient;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;

/**
 * Chiến lược thống kê doanh thu theo tháng
 */
@Component
public class ThongKeTheoThangStrategy implements ThongKeStrategy {

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
        return "THANG";
    }
}
