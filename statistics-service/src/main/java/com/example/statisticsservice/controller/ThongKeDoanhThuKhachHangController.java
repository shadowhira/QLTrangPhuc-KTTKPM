package com.example.statisticsservice.controller;

import com.example.statisticsservice.dto.ThongKeDoanhThuKhachHangDTO;
import com.example.statisticsservice.service.ThongKeDoanhThuKhachHangService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/statistics/khach-hang-doanh-thu")
public class ThongKeDoanhThuKhachHangController {

    private final ThongKeDoanhThuKhachHangService thongKeDoanhThuKhachHangService;

    @Autowired
    public ThongKeDoanhThuKhachHangController(ThongKeDoanhThuKhachHangService thongKeDoanhThuKhachHangService) {
        this.thongKeDoanhThuKhachHangService = thongKeDoanhThuKhachHangService;
    }

    @GetMapping
    public ResponseEntity<List<ThongKeDoanhThuKhachHangDTO>> layTatCaThongKeDoanhThuKhachHang() {
        List<ThongKeDoanhThuKhachHangDTO> thongKe = thongKeDoanhThuKhachHangService.layTatCaThongKeDoanhThuKhachHang();
        return ResponseEntity.ok(thongKe);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ThongKeDoanhThuKhachHangDTO> layThongKeDoanhThuKhachHangTheoId(@PathVariable String id) {
        ThongKeDoanhThuKhachHangDTO thongKe = thongKeDoanhThuKhachHangService.layThongKeDoanhThuKhachHangTheoId(id);
        return ResponseEntity.ok(thongKe);
    }

    @GetMapping("/khach-hang/{khachHangId}")
    public ResponseEntity<ThongKeDoanhThuKhachHangDTO> layThongKeDoanhThuKhachHangTheoKhachHangId(@PathVariable Long khachHangId) {
        ThongKeDoanhThuKhachHangDTO thongKe = thongKeDoanhThuKhachHangService.layThongKeDoanhThuKhachHangTheoKhachHangId(khachHangId);
        return ResponseEntity.ok(thongKe);
    }

    @PostMapping("/tao-tat-ca")
    public ResponseEntity<List<ThongKeDoanhThuKhachHangDTO>> taoThongKeDoanhThuChoTatCaKhachHang() {
        List<ThongKeDoanhThuKhachHangDTO> thongKe = thongKeDoanhThuKhachHangService.taoThongKeDoanhThuChoTatCaKhachHang();
        return ResponseEntity.ok(thongKe);
    }

    @PostMapping("/tao/{khachHangId}")
    public ResponseEntity<ThongKeDoanhThuKhachHangDTO> taoThongKeDoanhThuTheoKhachHangId(@PathVariable Long khachHangId) {
        ThongKeDoanhThuKhachHangDTO thongKe = thongKeDoanhThuKhachHangService.taoThongKeDoanhThuTheoKhachHangId(khachHangId);
        return ResponseEntity.ok(thongKe);
    }
}
