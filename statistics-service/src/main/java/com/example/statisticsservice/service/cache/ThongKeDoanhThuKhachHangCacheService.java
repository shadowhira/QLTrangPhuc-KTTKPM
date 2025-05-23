package com.example.statisticsservice.service.cache;

import com.example.statisticsservice.model.KhachHang;
import com.example.statisticsservice.model.ThongKeDoanhThuKhachHang;
import com.example.statisticsservice.repository.ThongKeDoanhThuKhachHangRepository;
import com.example.statisticsservice.service.KhachHangServiceClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Service xử lý cache cho thống kê doanh thu khách hàng
 */
@Service
public class ThongKeDoanhThuKhachHangCacheService {

    private static final Logger logger = LoggerFactory.getLogger(ThongKeDoanhThuKhachHangCacheService.class);
    private static final String CACHE_NAME = "thongKeDoanhThuKhachHang";

    private final ThongKeDoanhThuKhachHangRepository thongKeDoanhThuKhachHangRepository;
    private final KhachHangServiceClient khachHangServiceClient;

    @Autowired
    public ThongKeDoanhThuKhachHangCacheService(ThongKeDoanhThuKhachHangRepository thongKeDoanhThuKhachHangRepository,
                                              KhachHangServiceClient khachHangServiceClient) {
        this.thongKeDoanhThuKhachHangRepository = thongKeDoanhThuKhachHangRepository;
        this.khachHangServiceClient = khachHangServiceClient;
    }

    /**
     * Lấy tất cả thống kê doanh thu khách hàng (có cache)
     *
     * @return Danh sách thống kê doanh thu khách hàng
     */
    @Cacheable(value = CACHE_NAME, key = "'all'")
    public List<ThongKeDoanhThuKhachHang> layTatCaThongKeDoanhThuKhachHangCache() {
        logger.info("Cache miss: Lấy tất cả thống kê doanh thu khách hàng từ database");
        return thongKeDoanhThuKhachHangRepository.findAllByOrderByTongDoanhThuDesc();
    }

    /**
     * Lấy thống kê doanh thu khách hàng theo ID (có cache)
     *
     * @param id ID của thống kê doanh thu khách hàng
     * @return Thống kê doanh thu khách hàng
     */
    @Cacheable(value = CACHE_NAME, key = "#id")
    public ThongKeDoanhThuKhachHang layThongKeDoanhThuKhachHangTheoIdCache(String id) {
        logger.info("Cache miss: Lấy thống kê doanh thu khách hàng theo ID {} từ database", id);
        return thongKeDoanhThuKhachHangRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thống kê doanh thu khách hàng với id: " + id));
    }

    /**
     * Lấy thống kê doanh thu khách hàng theo ID khách hàng (có cache)
     *
     * @param khachHangId ID của khách hàng
     * @return Thống kê doanh thu khách hàng
     */
    @Cacheable(value = CACHE_NAME, key = "'khachHang_' + #khachHangId")
    public ThongKeDoanhThuKhachHang layThongKeDoanhThuKhachHangTheoKhachHangIdCache(Long khachHangId) {
        logger.info("Cache miss: Lấy thống kê doanh thu khách hàng theo ID khách hàng {} từ database", khachHangId);
        return thongKeDoanhThuKhachHangRepository.findByKhachHangId(khachHangId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thống kê doanh thu cho khách hàng có id: " + khachHangId));
    }

    /**
     * Tạo thống kê doanh thu cho tất cả khách hàng (có cache)
     *
     * @return Danh sách thống kê doanh thu khách hàng
     */
    public List<ThongKeDoanhThuKhachHang> taoThongKeDoanhThuChoTatCaKhachHangCache() {
        logger.info("Tạo thống kê doanh thu cho tất cả khách hàng");
        // Lấy tất cả khách hàng
        List<KhachHang> khachHangs = khachHangServiceClient.layTatCaKhachHang();

        // Tạo thống kê cho từng khách hàng
        List<ThongKeDoanhThuKhachHang> tatCaThongKe = new ArrayList<>();
        for (KhachHang khachHang : khachHangs) {
            tatCaThongKe.add(taoThongKeDoanhThuKhachHang(khachHang));
        }

        // Lưu tất cả thống kê
        List<ThongKeDoanhThuKhachHang> result = thongKeDoanhThuKhachHangRepository.saveAll(tatCaThongKe);

        // Xóa cache khi có dữ liệu mới
        clearAllCache();

        return result;
    }

    /**
     * Tạo thống kê doanh thu theo ID khách hàng (có cache)
     *
     * @param khachHangId ID của khách hàng
     * @return Thống kê doanh thu khách hàng
     */
    public ThongKeDoanhThuKhachHang taoThongKeDoanhThuTheoKhachHangIdCache(Long khachHangId) {
        logger.info("Tạo thống kê doanh thu cho khách hàng có ID {}", khachHangId);
        // Lấy thông tin khách hàng
        KhachHang khachHang = khachHangServiceClient.layKhachHangTheoId(khachHangId);

        // Tạo thống kê
        ThongKeDoanhThuKhachHang thongKe = taoThongKeDoanhThuKhachHang(khachHang);

        // Lưu thống kê
        ThongKeDoanhThuKhachHang result = thongKeDoanhThuKhachHangRepository.save(thongKe);

        // Xóa cache khi có dữ liệu mới
        clearAllCache();

        return result;
    }

    /**
     * Tạo thống kê doanh thu khách hàng
     *
     * @param khachHang Thông tin khách hàng
     * @return Thống kê doanh thu khách hàng
     */
    private ThongKeDoanhThuKhachHang taoThongKeDoanhThuKhachHang(KhachHang khachHang) {
        // Lấy đơn đặt của khách hàng
        Long khachHangId = (Long) com.example.statisticsservice.util.ReflectionUtil.getFieldValue(khachHang, "id");
        var donDatTrangPhucs = khachHangServiceClient.layDonDatTrangPhucTheoKhachHangId(khachHangId);

        // Tính tổng doanh thu
        BigDecimal tongDoanhThu = donDatTrangPhucs.stream()
                .filter(donDat -> "Đã thanh toán".equals(com.example.statisticsservice.util.ReflectionUtil.getFieldValue(donDat, "trangThai")))
                .map(donDat -> (java.math.BigDecimal) com.example.statisticsservice.util.ReflectionUtil.getFieldValue(donDat, "tongTien"))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Tính doanh thu theo kỳ (tháng)
        Map<String, BigDecimal> doanhThuTheoKy = new HashMap<>();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM");

        donDatTrangPhucs.stream()
                .filter(donDat -> "Đã thanh toán".equals(com.example.statisticsservice.util.ReflectionUtil.getFieldValue(donDat, "trangThai")))
                .forEach(donDat -> {
                    LocalDateTime ngayDat = (LocalDateTime) com.example.statisticsservice.util.ReflectionUtil.getFieldValue(donDat, "ngayDat");
                    String ky = ngayDat.format(formatter);
                    BigDecimal tongTien = (BigDecimal) com.example.statisticsservice.util.ReflectionUtil.getFieldValue(donDat, "tongTien");
                    doanhThuTheoKy.merge(ky, tongTien, BigDecimal::add);
                });

        // Tạo hoặc cập nhật thống kê
        ThongKeDoanhThuKhachHang thongKe = thongKeDoanhThuKhachHangRepository.findByKhachHangId(khachHangId)
                .orElse(new ThongKeDoanhThuKhachHang());

        String ho = (String) com.example.statisticsservice.util.ReflectionUtil.getFieldValue(khachHang, "ho");
        String ten = (String) com.example.statisticsservice.util.ReflectionUtil.getFieldValue(khachHang, "ten");
        String email = (String) com.example.statisticsservice.util.ReflectionUtil.getFieldValue(khachHang, "email");

        com.example.statisticsservice.util.ReflectionUtil.setFieldValue(thongKe, "khachHangId", khachHangId);
        com.example.statisticsservice.util.ReflectionUtil.setFieldValue(thongKe, "tenKhachHang", ho + " " + ten);
        com.example.statisticsservice.util.ReflectionUtil.setFieldValue(thongKe, "emailKhachHang", email);
        com.example.statisticsservice.util.ReflectionUtil.setFieldValue(thongKe, "tongDoanhThu", tongDoanhThu);
        com.example.statisticsservice.util.ReflectionUtil.setFieldValue(thongKe, "tongDonHang", donDatTrangPhucs.size());
        com.example.statisticsservice.util.ReflectionUtil.setFieldValue(thongKe, "doanhThuTheoKy", doanhThuTheoKy);
        com.example.statisticsservice.util.ReflectionUtil.setFieldValue(thongKe, "capNhatLanCuoi", LocalDateTime.now());

        return thongKe;
    }

    /**
     * Xóa tất cả cache thống kê doanh thu khách hàng
     */
    @CacheEvict(value = CACHE_NAME, allEntries = true)
    public void clearAllCache() {
        logger.info("Xóa tất cả cache thống kê doanh thu khách hàng");
    }
}
