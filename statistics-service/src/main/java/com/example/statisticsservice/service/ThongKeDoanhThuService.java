package com.example.statisticsservice.service;

import com.example.statisticsservice.exception.ResourceNotFoundException;
import com.example.statisticsservice.model.ThongKeDoanhThu;
import com.example.statisticsservice.repository.ThongKeDoanhThuRepository;
import com.example.statisticsservice.strategy.ThongKeDoanhThuContext;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ThongKeDoanhThuService {

    private final ThongKeDoanhThuRepository thongKeDoanhThuRepository;
    private final ThongKeDoanhThuContext thongKeDoanhThuContext;

    public ThongKeDoanhThuService(ThongKeDoanhThuRepository thongKeDoanhThuRepository,
                                 ThongKeDoanhThuContext thongKeDoanhThuContext) {
        this.thongKeDoanhThuRepository = thongKeDoanhThuRepository;
        this.thongKeDoanhThuContext = thongKeDoanhThuContext;
    }

    /**
     * Lấy tất cả thống kê doanh thu
     *
     * @return Danh sách thống kê doanh thu
     */
    public List<ThongKeDoanhThu> layTatCaThongKeDoanhThu() {
        return thongKeDoanhThuRepository.findAll();
    }

    /**
     * Lấy thống kê doanh thu theo ID
     *
     * @param id ID của thống kê doanh thu
     * @return Thống kê doanh thu
     * @throws ResourceNotFoundException nếu không tìm thấy thống kê
     */
    public ThongKeDoanhThu layThongKeDoanhThuTheoId(String id) {
        return thongKeDoanhThuRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy thống kê doanh thu với id: " + id));
    }

    /**
     * Lấy thống kê doanh thu theo kỳ
     *
     * @param kyThongKe Kỳ thống kê (THANG, QUY, NAM)
     * @return Danh sách thống kê doanh thu
     */
    public List<ThongKeDoanhThu> layThongKeDoanhThuTheoKy(String kyThongKe) {
        return thongKeDoanhThuRepository.findByKyThongKeOrderByGiaTriKyDesc(kyThongKe);
    }

    /**
     * Tạo thống kê doanh thu theo tháng
     *
     * @param nam Năm thống kê
     * @param thang Tháng thống kê
     * @return Thống kê doanh thu
     */
    public ThongKeDoanhThu taoThongKeTheoThang(int nam, int thang) {
        return thongKeDoanhThuContext.taoThongKe("THANG", nam, thang);
    }

    /**
     * Tạo thống kê doanh thu theo quý
     *
     * @param nam Năm thống kê
     * @param quy Quý thống kê (1-4)
     * @return Thống kê doanh thu
     * @throws IllegalArgumentException nếu quý không hợp lệ
     */
    public ThongKeDoanhThu taoThongKeTheoQuy(int nam, int quy) {
        if (quy < 1 || quy > 4) {
            throw new IllegalArgumentException("Quý phải nằm trong khoảng từ 1 đến 4");
        }
        return thongKeDoanhThuContext.taoThongKe("QUY", nam, quy);
    }

    /**
     * Tạo thống kê doanh thu theo năm
     *
     * @param nam Năm thống kê
     * @return Thống kê doanh thu
     */
    public ThongKeDoanhThu taoThongKeTheoNam(int nam) {
        return thongKeDoanhThuContext.taoThongKe("NAM", nam, 0); // Giá trị 0 không được sử dụng cho thống kê theo năm
    }
}
