package com.example.statisticsservice.service;

import com.example.statisticsservice.dto.KhachHangDTO;
import com.example.statisticsservice.dto.DonDatTrangPhucDTO;
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
        List<KhachHangDTO> khachHangs = khachHangServiceClient.layTatCaKhachHang();

        // Tạo thống kê cho từng khách hàng
        List<ThongKeDoanhThuKhachHang> tatCaThongKe = new ArrayList<>();
        for (KhachHangDTO khachHang : khachHangs) {
            tatCaThongKe.add(taoThongKeDoanhThuKhachHang(khachHang));
        }

        // Lưu tất cả thống kê
        return thongKeDoanhThuKhachHangRepository.saveAll(tatCaThongKe);
    }

    public ThongKeDoanhThuKhachHang taoThongKeDoanhThuTheoKhachHangId(Long khachHangId) {
        // Lấy thông tin khách hàng
        KhachHangDTO khachHang = khachHangServiceClient.layKhachHangTheoId(khachHangId);

        // Tạo thống kê
        ThongKeDoanhThuKhachHang thongKe = taoThongKeDoanhThuKhachHang(khachHang);

        // Lưu thống kê
        return thongKeDoanhThuKhachHangRepository.save(thongKe);
    }

    private ThongKeDoanhThuKhachHang taoThongKeDoanhThuKhachHang(KhachHangDTO khachHang) {
        // Lấy đơn đặt của khách hàng
        List<DonDatTrangPhucDTO> donDatTrangPhucs = khachHangServiceClient.layDonDatTrangPhucTheoKhachHangId(khachHang.getId());

        // Tính tổng doanh thu
        BigDecimal tongDoanhThu = donDatTrangPhucs.stream()
                .filter(donDat -> "Đã thanh toán".equals(donDat.getTrangThai()))
                .map(DonDatTrangPhucDTO::getTongTien)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Tính doanh thu theo kỳ (tháng)
        Map<String, BigDecimal> doanhThuTheoKy = new HashMap<>();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM");

        donDatTrangPhucs.stream()
                .filter(donDat -> "Đã thanh toán".equals(donDat.getTrangThai()))
                .forEach(donDat -> {
                    String ky = donDat.getNgayDat().format(formatter);
                    doanhThuTheoKy.merge(ky, donDat.getTongTien(), BigDecimal::add);
                });

        // Tạo hoặc cập nhật thống kê
        ThongKeDoanhThuKhachHang thongKe = thongKeDoanhThuKhachHangRepository.findByKhachHangId(khachHang.getId())
                .orElse(new ThongKeDoanhThuKhachHang());

        thongKe.setKhachHangId(khachHang.getId());
        thongKe.setTenKhachHang(khachHang.getHo() + " " + khachHang.getTen());
        thongKe.setEmailKhachHang(khachHang.getEmail());
        thongKe.setTongDoanhThu(tongDoanhThu);
        thongKe.setTongDonHang(donDatTrangPhucs.size());
        thongKe.setDoanhThuTheoKy(doanhThuTheoKy);
        thongKe.setCapNhatLanCuoi(LocalDateTime.now());

        return thongKe;
    }


}
