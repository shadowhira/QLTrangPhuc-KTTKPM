package com.example.statisticsservice.controller;

import com.example.statisticsservice.model.ThongKeDoanhThuKhachHang;
import com.example.statisticsservice.service.ThongKeDoanhThuKhachHangService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/statistics/khach-hang-doanh-thu")
public class ThongKeDoanhThuKhachHangController {

    private final ThongKeDoanhThuKhachHangService thongKeDoanhThuKhachHangService;

    public ThongKeDoanhThuKhachHangController(ThongKeDoanhThuKhachHangService thongKeDoanhThuKhachHangService) {
        this.thongKeDoanhThuKhachHangService = thongKeDoanhThuKhachHangService;
    }

    @GetMapping
    public ResponseEntity<List<ThongKeDoanhThuKhachHang>> layTatCaThongKeDoanhThuKhachHang() {
        List<ThongKeDoanhThuKhachHang> thongKe = thongKeDoanhThuKhachHangService.layTatCaThongKeDoanhThuKhachHang();
        return ResponseEntity.ok(thongKe);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ThongKeDoanhThuKhachHang> layThongKeDoanhThuKhachHangTheoId(@PathVariable String id) {
        ThongKeDoanhThuKhachHang thongKe = thongKeDoanhThuKhachHangService.layThongKeDoanhThuKhachHangTheoId(id);
        return ResponseEntity.ok(thongKe);
    }

    @GetMapping("/khach-hang/{khachHangId}")
    public ResponseEntity<ThongKeDoanhThuKhachHang> layThongKeDoanhThuKhachHangTheoKhachHangId(@PathVariable Long khachHangId) {
        ThongKeDoanhThuKhachHang thongKe = thongKeDoanhThuKhachHangService.layThongKeDoanhThuKhachHangTheoKhachHangId(khachHangId);
        return ResponseEntity.ok(thongKe);
    }

    @PostMapping("/tao-tat-ca")
    public ResponseEntity<List<ThongKeDoanhThuKhachHang>> taoThongKeDoanhThuChoTatCaKhachHang() {
        List<ThongKeDoanhThuKhachHang> thongKe = thongKeDoanhThuKhachHangService.taoThongKeDoanhThuChoTatCaKhachHang();
        return ResponseEntity.ok(thongKe);
    }

    @PostMapping("/tao/{khachHangId}")
    public ResponseEntity<ThongKeDoanhThuKhachHang> taoThongKeDoanhThuTheoKhachHangId(@PathVariable Long khachHangId) {
        ThongKeDoanhThuKhachHang thongKe = thongKeDoanhThuKhachHangService.taoThongKeDoanhThuTheoKhachHangId(khachHangId);
        return ResponseEntity.ok(thongKe);
    }
}
