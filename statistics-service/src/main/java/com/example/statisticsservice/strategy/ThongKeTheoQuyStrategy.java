package com.example.statisticsservice.strategy;

import com.example.statisticsservice.model.DonDatTrangPhuc;
import com.example.statisticsservice.model.ThongKeDoanhThu;
import com.example.statisticsservice.repository.ThongKeDoanhThuRepository;
import com.example.statisticsservice.service.KhachHangServiceClient;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.Month;
import java.time.YearMonth;
import java.util.List;

/**
 * Chiến lược thống kê doanh thu theo quý
 */
@Component
public class ThongKeTheoQuyStrategy implements ThongKeStrategy {

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
        return "QUY";
    }
}
