package com.example.statisticsservice.service;

import com.example.statisticsservice.dto.DonDatTrangPhucDTO;
import com.example.statisticsservice.dto.ThongKeDoanhThuDTO;
import com.example.statisticsservice.exception.ResourceNotFoundException;
import com.example.statisticsservice.model.ThongKeDoanhThu;
import com.example.statisticsservice.repository.ThongKeDoanhThuRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.Month;
import java.time.Year;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ThongKeDoanhThuService {

    private final ThongKeDoanhThuRepository thongKeDoanhThuRepository;
    private final KhachHangServiceClient khachHangServiceClient;

    @Autowired
    public ThongKeDoanhThuService(ThongKeDoanhThuRepository thongKeDoanhThuRepository,
                                 KhachHangServiceClient khachHangServiceClient) {
        this.thongKeDoanhThuRepository = thongKeDoanhThuRepository;
        this.khachHangServiceClient = khachHangServiceClient;
    }

    public List<ThongKeDoanhThuDTO> layTatCaThongKeDoanhThu() {
        return thongKeDoanhThuRepository.findAll().stream()
                .map(this::chuyenSangDTO)
                .collect(Collectors.toList());
    }

    public ThongKeDoanhThuDTO layThongKeDoanhThuTheoId(String id) {
        ThongKeDoanhThu thongKe = thongKeDoanhThuRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy thống kê doanh thu với id: " + id));
        return chuyenSangDTO(thongKe);
    }

    public List<ThongKeDoanhThuDTO> layThongKeDoanhThuTheoKy(String kyThongKe) {
        return thongKeDoanhThuRepository.findByKyThongKeOrderByGiaTriKyDesc(kyThongKe).stream()
                .map(this::chuyenSangDTO)
                .collect(Collectors.toList());
    }

    public ThongKeDoanhThuDTO taoThongKeTheoThang(int nam, int thang) {
        YearMonth yearMonth = YearMonth.of(nam, thang);
        LocalDateTime ngayBatDau = yearMonth.atDay(1).atStartOfDay();
        LocalDateTime ngayKetThuc = yearMonth.atEndOfMonth().atTime(23, 59, 59);

        String giaTriKy = String.format("%d-%02d", nam, thang);

        // Kiểm tra nếu thống kê đã tồn tại
        ThongKeDoanhThu thongKeHienCo = thongKeDoanhThuRepository
                .findByKyThongKeAndGiaTriKy("THANG", giaTriKy)
                .orElse(null);

        if (thongKeHienCo != null) {
            return chuyenSangDTO(thongKeHienCo);
        }

        // Lấy đơn đặt từ customer service
        List<DonDatTrangPhucDTO> donDatTrangPhucs = khachHangServiceClient.layDonDatTrangPhucTheoKhoangThoiGian(ngayBatDau, ngayKetThuc);

        // Tính toán thống kê
        BigDecimal tongDoanhThu = donDatTrangPhucs.stream()
                .filter(donDat -> "Đã thanh toán".equals(donDat.getTrangThai()))
                .map(DonDatTrangPhucDTO::getTongTien)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        int tongDonHang = donDatTrangPhucs.size();

        // Tạo và lưu thống kê
        ThongKeDoanhThu thongKe = new ThongKeDoanhThu();
        thongKe.setKyThongKe("THANG");
        thongKe.setGiaTriKy(giaTriKy);
        thongKe.setNgayBatDau(ngayBatDau);
        thongKe.setNgayKetThuc(ngayKetThuc);
        thongKe.setTongDoanhThu(tongDoanhThu);
        thongKe.setTongDonHang(tongDonHang);
        thongKe.setNgayTao(LocalDateTime.now());

        ThongKeDoanhThu thongKeDaLuu = thongKeDoanhThuRepository.save(thongKe);
        return chuyenSangDTO(thongKeDaLuu);
    }

    public ThongKeDoanhThuDTO taoThongKeTheoQuy(int nam, int quy) {
        if (quy < 1 || quy > 4) {
            throw new IllegalArgumentException("Quý phải nằm trong khoảng từ 1 đến 4");
        }

        Month thangBatDau = Month.of((quy - 1) * 3 + 1);
        Month thangKetThuc = Month.of(quy * 3);

        LocalDateTime ngayBatDau = LocalDateTime.of(nam, thangBatDau, 1, 0, 0);
        LocalDateTime ngayKetThuc = YearMonth.of(nam, thangKetThuc).atEndOfMonth().atTime(23, 59, 59);

        String giaTriKy = String.format("%d-Q%d", nam, quy);

        // Kiểm tra nếu thống kê đã tồn tại
        ThongKeDoanhThu thongKeHienCo = thongKeDoanhThuRepository
                .findByKyThongKeAndGiaTriKy("QUY", giaTriKy)
                .orElse(null);

        if (thongKeHienCo != null) {
            return chuyenSangDTO(thongKeHienCo);
        }

        // Lấy đơn đặt từ customer service
        List<DonDatTrangPhucDTO> donDatTrangPhucs = khachHangServiceClient.layDonDatTrangPhucTheoKhoangThoiGian(ngayBatDau, ngayKetThuc);

        // Tính toán thống kê
        BigDecimal tongDoanhThu = donDatTrangPhucs.stream()
                .filter(donDat -> "Đã thanh toán".equals(donDat.getTrangThai()))
                .map(DonDatTrangPhucDTO::getTongTien)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        int tongDonHang = donDatTrangPhucs.size();

        // Tạo và lưu thống kê
        ThongKeDoanhThu thongKe = new ThongKeDoanhThu();
        thongKe.setKyThongKe("QUY");
        thongKe.setGiaTriKy(giaTriKy);
        thongKe.setNgayBatDau(ngayBatDau);
        thongKe.setNgayKetThuc(ngayKetThuc);
        thongKe.setTongDoanhThu(tongDoanhThu);
        thongKe.setTongDonHang(tongDonHang);
        thongKe.setNgayTao(LocalDateTime.now());

        ThongKeDoanhThu thongKeDaLuu = thongKeDoanhThuRepository.save(thongKe);
        return chuyenSangDTO(thongKeDaLuu);
    }

    public ThongKeDoanhThuDTO taoThongKeTheoNam(int nam) {
        LocalDateTime ngayBatDau = Year.of(nam).atMonth(1).atDay(1).atStartOfDay();
        LocalDateTime ngayKetThuc = Year.of(nam).atMonth(12).atEndOfMonth().atTime(23, 59, 59);

        String giaTriKy = String.valueOf(nam);

        // Kiểm tra nếu thống kê đã tồn tại
        ThongKeDoanhThu thongKeHienCo = thongKeDoanhThuRepository
                .findByKyThongKeAndGiaTriKy("NAM", giaTriKy)
                .orElse(null);

        if (thongKeHienCo != null) {
            return chuyenSangDTO(thongKeHienCo);
        }

        // Lấy đơn đặt từ customer service
        List<DonDatTrangPhucDTO> donDatTrangPhucs = khachHangServiceClient.layDonDatTrangPhucTheoKhoangThoiGian(ngayBatDau, ngayKetThuc);

        // Tính toán thống kê
        BigDecimal tongDoanhThu = donDatTrangPhucs.stream()
                .filter(donDat -> "Đã thanh toán".equals(donDat.getTrangThai()))
                .map(DonDatTrangPhucDTO::getTongTien)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        int tongDonHang = donDatTrangPhucs.size();

        // Tạo và lưu thống kê
        ThongKeDoanhThu thongKe = new ThongKeDoanhThu();
        thongKe.setKyThongKe("NAM");
        thongKe.setGiaTriKy(giaTriKy);
        thongKe.setNgayBatDau(ngayBatDau);
        thongKe.setNgayKetThuc(ngayKetThuc);
        thongKe.setTongDoanhThu(tongDoanhThu);
        thongKe.setTongDonHang(tongDonHang);
        thongKe.setNgayTao(LocalDateTime.now());

        ThongKeDoanhThu thongKeDaLuu = thongKeDoanhThuRepository.save(thongKe);
        return chuyenSangDTO(thongKeDaLuu);
    }

    // Phương thức hỗ trợ chuyển đổi giữa Entity và DTO
    private ThongKeDoanhThuDTO chuyenSangDTO(ThongKeDoanhThu thongKe) {
        ThongKeDoanhThuDTO dto = new ThongKeDoanhThuDTO();
        dto.setId(thongKe.getId());
        dto.setKyThongKe(thongKe.getKyThongKe());
        dto.setGiaTriKy(thongKe.getGiaTriKy());
        dto.setNgayBatDau(thongKe.getNgayBatDau());
        dto.setNgayKetThuc(thongKe.getNgayKetThuc());
        dto.setTongDoanhThu(thongKe.getTongDoanhThu());
        dto.setTongDonHang(thongKe.getTongDonHang());
        dto.setNgayTao(thongKe.getNgayTao());
        return dto;
    }
}
