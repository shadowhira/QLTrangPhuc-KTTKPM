package com.example.statisticsservice.service;

import com.example.statisticsservice.dto.KhachHangDTO;
import com.example.statisticsservice.dto.ThongKeDoanhThuKhachHangDTO;
import com.example.statisticsservice.dto.DonDatTrangPhucDTO;
import com.example.statisticsservice.exception.ResourceNotFoundException;
import com.example.statisticsservice.model.ThongKeDoanhThuKhachHang;
import com.example.statisticsservice.repository.ThongKeDoanhThuKhachHangRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ThongKeDoanhThuKhachHangService {

    private final ThongKeDoanhThuKhachHangRepository thongKeDoanhThuKhachHangRepository;
    private final KhachHangServiceClient khachHangServiceClient;

    @Autowired
    public ThongKeDoanhThuKhachHangService(ThongKeDoanhThuKhachHangRepository thongKeDoanhThuKhachHangRepository,
                                         KhachHangServiceClient khachHangServiceClient) {
        this.thongKeDoanhThuKhachHangRepository = thongKeDoanhThuKhachHangRepository;
        this.khachHangServiceClient = khachHangServiceClient;
    }

    public List<ThongKeDoanhThuKhachHangDTO> layTatCaThongKeDoanhThuKhachHang() {
        return thongKeDoanhThuKhachHangRepository.findAllByOrderByTongDoanhThuDesc().stream()
                .map(this::chuyenSangDTO)
                .collect(Collectors.toList());
    }

    public ThongKeDoanhThuKhachHangDTO layThongKeDoanhThuKhachHangTheoId(String id) {
        ThongKeDoanhThuKhachHang thongKe = thongKeDoanhThuKhachHangRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy thống kê doanh thu khách hàng với id: " + id));
        return chuyenSangDTO(thongKe);
    }

    public ThongKeDoanhThuKhachHangDTO layThongKeDoanhThuKhachHangTheoKhachHangId(Long khachHangId) {
        ThongKeDoanhThuKhachHang thongKe = thongKeDoanhThuKhachHangRepository.findByKhachHangId(khachHangId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy thống kê doanh thu cho khách hàng có id: " + khachHangId));
        return chuyenSangDTO(thongKe);
    }

    public List<ThongKeDoanhThuKhachHangDTO> taoThongKeDoanhThuChoTatCaKhachHang() {
        // Lấy tất cả khách hàng
        List<KhachHangDTO> khachHangs = khachHangServiceClient.layTatCaKhachHang();

        // Tạo thống kê cho từng khách hàng
        List<ThongKeDoanhThuKhachHang> tatCaThongKe = khachHangs.stream()
                .map(this::taoThongKeDoanhThuKhachHang)
                .collect(Collectors.toList());

        // Lưu tất cả thống kê
        List<ThongKeDoanhThuKhachHang> thongKeDaLuu = thongKeDoanhThuKhachHangRepository.saveAll(tatCaThongKe);

        return thongKeDaLuu.stream()
                .map(this::chuyenSangDTO)
                .collect(Collectors.toList());
    }

    public ThongKeDoanhThuKhachHangDTO taoThongKeDoanhThuTheoKhachHangId(Long khachHangId) {
        // Lấy thông tin khách hàng
        KhachHangDTO khachHang = khachHangServiceClient.layKhachHangTheoId(khachHangId);

        // Tạo thống kê
        ThongKeDoanhThuKhachHang thongKe = taoThongKeDoanhThuKhachHang(khachHang);

        // Lưu thống kê
        ThongKeDoanhThuKhachHang thongKeDaLuu = thongKeDoanhThuKhachHangRepository.save(thongKe);

        return chuyenSangDTO(thongKeDaLuu);
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

    // Phương thức hỗ trợ chuyển đổi giữa Entity và DTO
    private ThongKeDoanhThuKhachHangDTO chuyenSangDTO(ThongKeDoanhThuKhachHang thongKe) {
        ThongKeDoanhThuKhachHangDTO dto = new ThongKeDoanhThuKhachHangDTO();
        dto.setId(thongKe.getId());
        dto.setKhachHangId(thongKe.getKhachHangId());
        dto.setTenKhachHang(thongKe.getTenKhachHang());
        dto.setEmailKhachHang(thongKe.getEmailKhachHang());
        dto.setTongDoanhThu(thongKe.getTongDoanhThu());
        dto.setTongDonHang(thongKe.getTongDonHang());
        dto.setDoanhThuTheoKy(thongKe.getDoanhThuTheoKy());
        dto.setCapNhatLanCuoi(thongKe.getCapNhatLanCuoi());
        return dto;
    }
}
