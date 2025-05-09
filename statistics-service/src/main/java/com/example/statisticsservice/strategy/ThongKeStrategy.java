package com.example.statisticsservice.strategy;

import com.example.statisticsservice.model.DonDatTrangPhuc;
import com.example.statisticsservice.model.ThongKeDoanhThu;
import com.example.statisticsservice.repository.ThongKeDoanhThuRepository;
import com.example.statisticsservice.service.KhachHangServiceClient;

import java.math.BigDecimal;
import java.util.List;

/**
 * Interface định nghĩa chiến lược thống kê doanh thu
 */
public interface ThongKeStrategy {

    /**
     * Tạo thống kê doanh thu theo chiến lược cụ thể
     *
     * @param nam Năm thống kê
     * @param giaTri Giá trị thống kê (tháng, quý, ...)
     * @param khachHangServiceClient Client để lấy dữ liệu từ service khách hàng
     * @param repository Repository để lưu trữ thống kê
     * @return Thống kê doanh thu đã tạo
     */
    ThongKeDoanhThu taoThongKe(int nam, int giaTri, KhachHangServiceClient khachHangServiceClient, ThongKeDoanhThuRepository repository);

    /**
     * Lấy loại kỳ thống kê
     *
     * @return Loại kỳ thống kê (THANG, QUY, NAM)
     */
    String getKyThongKe();

    /**
     * Tính tổng doanh thu từ danh sách đơn đặt trang phục
     *
     * @param donDatTrangPhucs Danh sách đơn đặt trang phục
     * @return Tổng doanh thu
     */
    default BigDecimal tinhTongDoanhThu(List<DonDatTrangPhuc> donDatTrangPhucs) {
        return donDatTrangPhucs.stream()
                .filter(donDat -> "Đã thanh toán".equals(donDat.getTrangThai()))
                .map(DonDatTrangPhuc::getTongTien)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
