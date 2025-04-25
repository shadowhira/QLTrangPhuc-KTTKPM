package com.example.statisticsservice.strategy;

import com.example.statisticsservice.model.ThongKeDoanhThu;
import com.example.statisticsservice.repository.ThongKeDoanhThuRepository;
import com.example.statisticsservice.service.KhachHangServiceClient;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

/**
 * Context class để sử dụng các chiến lược thống kê
 */
@Component
public class ThongKeDoanhThuContext {

    private final Map<String, ThongKeStrategy> strategies = new HashMap<>();
    private final KhachHangServiceClient khachHangServiceClient;
    private final ThongKeDoanhThuRepository repository;

    public ThongKeDoanhThuContext(Set<ThongKeStrategy> strategySet,
                                 KhachHangServiceClient khachHangServiceClient,
                                 ThongKeDoanhThuRepository repository) {
        // Đăng ký tất cả các chiến lược
        strategySet.forEach(strategy -> strategies.put(strategy.getKyThongKe(), strategy));
        this.khachHangServiceClient = khachHangServiceClient;
        this.repository = repository;
    }

    /**
     * Tạo thống kê doanh thu theo loại kỳ
     *
     * @param kyThongKe Loại kỳ thống kê (THANG, QUY, NAM)
     * @param nam Năm thống kê
     * @param giaTri Giá trị thống kê (tháng, quý, ...)
     * @return Thống kê doanh thu đã tạo
     * @throws IllegalArgumentException nếu không tìm thấy chiến lược phù hợp
     */
    public ThongKeDoanhThu taoThongKe(String kyThongKe, int nam, int giaTri) {
        ThongKeStrategy strategy = strategies.get(kyThongKe);
        if (strategy == null) {
            throw new IllegalArgumentException("Không tìm thấy chiến lược thống kê cho kỳ: " + kyThongKe);
        }
        return strategy.taoThongKe(nam, giaTri, khachHangServiceClient, repository);
    }
}
