package com.example.statisticsservice.service;

import com.example.statisticsservice.model.KhachHang;
import com.example.statisticsservice.model.DonDatTrangPhuc;
import com.example.statisticsservice.exception.ResourceNotFoundException;
import com.example.statisticsservice.model.ThongKeDoanhThuKhachHang;
import com.example.statisticsservice.repository.ThongKeDoanhThuKhachHangRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ThongKeDoanhThuKhachHangService {

    private final ThongKeDoanhThuKhachHangRepository thongKeDoanhThuKhachHangRepository;
    private final KhachHangServiceClient khachHangServiceClient;

    public ThongKeDoanhThuKhachHangService(ThongKeDoanhThuKhachHangRepository thongKeDoanhThuKhachHangRepository,
                                         KhachHangServiceClient khachHangServiceClient) {
        this.thongKeDoanhThuKhachHangRepository = thongKeDoanhThuKhachHangRepository;
        this.khachHangServiceClient = khachHangServiceClient;
    }

    public List<ThongKeDoanhThuKhachHang> layTatCaThongKeDoanhThuKhachHang() {
        return thongKeDoanhThuKhachHangRepository.findAllByOrderByTongDoanhThuDesc();
    }

    public ThongKeDoanhThuKhachHang layThongKeDoanhThuKhachHangTheoId(String id) {
        return thongKeDoanhThuKhachHangRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy thống kê doanh thu khách hàng với id: " + id));
    }

    public ThongKeDoanhThuKhachHang layThongKeDoanhThuKhachHangTheoKhachHangId(Long khachHangId) {
        return thongKeDoanhThuKhachHangRepository.findByKhachHangId(khachHangId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy thống kê doanh thu cho khách hàng có id: " + khachHangId));
    }

    public List<ThongKeDoanhThuKhachHang> taoThongKeDoanhThuChoTatCaKhachHang() {
        // Lấy tất cả khách hàng
        List<KhachHang> khachHangs = khachHangServiceClient.layTatCaKhachHang();

        // Tạo thống kê cho từng khách hàng
        List<ThongKeDoanhThuKhachHang> tatCaThongKe = new ArrayList<>();
        for (KhachHang khachHang : khachHangs) {
            tatCaThongKe.add(taoThongKeDoanhThuKhachHang(khachHang));
        }

        // Lưu tất cả thống kê
        return thongKeDoanhThuKhachHangRepository.saveAll(tatCaThongKe);
    }

    public ThongKeDoanhThuKhachHang taoThongKeDoanhThuTheoKhachHangId(Long khachHangId) {
        // Lấy thông tin khách hàng
        KhachHang khachHang = khachHangServiceClient.layKhachHangTheoId(khachHangId);

        // Tạo thống kê
        ThongKeDoanhThuKhachHang thongKe = taoThongKeDoanhThuKhachHang(khachHang);

        // Lưu thống kê
        return thongKeDoanhThuKhachHangRepository.save(thongKe);
    }

    private ThongKeDoanhThuKhachHang taoThongKeDoanhThuKhachHang(KhachHang khachHang) {
        // Lấy đơn đặt của khách hàng
        Long khachHangId = (Long) com.example.statisticsservice.util.ReflectionUtil.getFieldValue(khachHang, "id");
        List<DonDatTrangPhuc> donDatTrangPhucs = khachHangServiceClient.layDonDatTrangPhucTheoKhachHangId(khachHangId);

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


}
