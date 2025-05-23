package com.example.statisticsservice.service.cache;

import com.example.statisticsservice.model.ThongKeDoanhThu;
import com.example.statisticsservice.repository.ThongKeDoanhThuRepository;
import com.example.statisticsservice.service.KhachHangServiceClient;
import com.example.statisticsservice.strategy.ThongKeDoanhThuContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Service xử lý cache cho thống kê doanh thu
 */
@Service
public class ThongKeDoanhThuCacheService {

    private static final Logger logger = LoggerFactory.getLogger(ThongKeDoanhThuCacheService.class);
    private static final String CACHE_NAME = "thongKeDoanhThu";

    private final ThongKeDoanhThuRepository repository;
    private final ThongKeDoanhThuContext thongKeDoanhThuContext;
    private final KhachHangServiceClient khachHangServiceClient;

    @Autowired
    public ThongKeDoanhThuCacheService(ThongKeDoanhThuRepository repository,
                                      ThongKeDoanhThuContext thongKeDoanhThuContext,
                                      KhachHangServiceClient khachHangServiceClient) {
        this.repository = repository;
        this.thongKeDoanhThuContext = thongKeDoanhThuContext;
        this.khachHangServiceClient = khachHangServiceClient;
    }

    /**
     * Lấy tất cả thống kê doanh thu (có cache)
     * 
     * @return Danh sách thống kê doanh thu
     */
    @Cacheable(value = CACHE_NAME, key = "'all'")
    public List<ThongKeDoanhThu> layTatCaThongKeDoanhThuCache() {
        logger.info("Cache miss: Lấy tất cả thống kê doanh thu từ database");
        return repository.findAll();
    }

    /**
     * Lấy thống kê doanh thu theo ID (có cache)
     * 
     * @param id ID của thống kê doanh thu
     * @return Thống kê doanh thu
     */
    @Cacheable(value = CACHE_NAME, key = "#id")
    public ThongKeDoanhThu layThongKeDoanhThuTheoIdCache(String id) {
        logger.info("Cache miss: Lấy thống kê doanh thu theo ID {} từ database", id);
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thống kê doanh thu với id: " + id));
    }

    /**
     * Lấy thống kê doanh thu theo kỳ (có cache)
     * 
     * @param kyThongKe Kỳ thống kê (THANG, QUY, NAM)
     * @return Danh sách thống kê doanh thu theo kỳ
     */
    @Cacheable(value = CACHE_NAME, key = "'ky_' + #kyThongKe")
    public List<ThongKeDoanhThu> layThongKeDoanhThuTheoKyCache(String kyThongKe) {
        logger.info("Cache miss: Lấy thống kê doanh thu theo kỳ {} từ database", kyThongKe);
        return repository.findByKyThongKeOrderByGiaTriKyDesc(kyThongKe);
    }

    /**
     * Tạo thống kê doanh thu theo tháng (có cache)
     * 
     * @param nam Năm thống kê
     * @param thang Tháng thống kê
     * @return Thống kê doanh thu
     */
    public ThongKeDoanhThu taoThongKeTheoThangCache(int nam, int thang) {
        logger.info("Tạo thống kê doanh thu theo tháng {}/{}", thang, nam);
        ThongKeDoanhThu thongKe = thongKeDoanhThuContext.taoThongKe("THANG", nam, thang);
        clearAllCache(); // Xóa cache khi có dữ liệu mới
        return thongKe;
    }

    /**
     * Tạo thống kê doanh thu theo quý (có cache)
     * 
     * @param nam Năm thống kê
     * @param quy Quý thống kê (1-4)
     * @return Thống kê doanh thu
     */
    public ThongKeDoanhThu taoThongKeTheoQuyCache(int nam, int quy) {
        logger.info("Tạo thống kê doanh thu theo quý {}/{}", quy, nam);
        if (quy < 1 || quy > 4) {
            throw new IllegalArgumentException("Quý phải nằm trong khoảng từ 1 đến 4");
        }
        ThongKeDoanhThu thongKe = thongKeDoanhThuContext.taoThongKe("QUY", nam, quy);
        clearAllCache(); // Xóa cache khi có dữ liệu mới
        return thongKe;
    }

    /**
     * Tạo thống kê doanh thu theo năm (có cache)
     * 
     * @param nam Năm thống kê
     * @return Thống kê doanh thu
     */
    public ThongKeDoanhThu taoThongKeTheoNamCache(int nam) {
        logger.info("Tạo thống kê doanh thu theo năm {}", nam);
        ThongKeDoanhThu thongKe = thongKeDoanhThuContext.taoThongKe("NAM", nam, 0);
        clearAllCache(); // Xóa cache khi có dữ liệu mới
        return thongKe;
    }

    /**
     * Xóa tất cả cache thống kê doanh thu
     */
    @CacheEvict(value = CACHE_NAME, allEntries = true)
    public void clearAllCache() {
        logger.info("Xóa tất cả cache thống kê doanh thu");
    }
}
