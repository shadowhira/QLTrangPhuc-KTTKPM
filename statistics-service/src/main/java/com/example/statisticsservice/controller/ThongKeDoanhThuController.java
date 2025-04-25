package com.example.statisticsservice.controller;

import com.example.statisticsservice.model.ThongKeDoanhThu;
import com.example.statisticsservice.service.ThongKeDoanhThuService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/statistics/doanh-thu")
public class ThongKeDoanhThuController {

    private final ThongKeDoanhThuService thongKeDoanhThuService;

    public ThongKeDoanhThuController(ThongKeDoanhThuService thongKeDoanhThuService) {
        this.thongKeDoanhThuService = thongKeDoanhThuService;
    }

    @GetMapping
    public ResponseEntity<List<ThongKeDoanhThu>> layTatCaThongKeDoanhThu() {
        List<ThongKeDoanhThu> thongKe = thongKeDoanhThuService.layTatCaThongKeDoanhThu();
        return ResponseEntity.ok(thongKe);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ThongKeDoanhThu> layThongKeDoanhThuTheoId(@PathVariable String id) {
        ThongKeDoanhThu thongKe = thongKeDoanhThuService.layThongKeDoanhThuTheoId(id);
        return ResponseEntity.ok(thongKe);
    }

    @GetMapping("/ky/{kyThongKe}")
    public ResponseEntity<List<ThongKeDoanhThu>> layThongKeDoanhThuTheoKy(@PathVariable String kyThongKe) {
        List<ThongKeDoanhThu> thongKe = thongKeDoanhThuService.layThongKeDoanhThuTheoKy(kyThongKe);
        return ResponseEntity.ok(thongKe);
    }

    @PostMapping("/thang")
    public ResponseEntity<ThongKeDoanhThu> taoThongKeTheoThang(
            @RequestParam int nam,
            @RequestParam int thang) {
        ThongKeDoanhThu thongKe = thongKeDoanhThuService.taoThongKeTheoThang(nam, thang);
        return ResponseEntity.ok(thongKe);
    }

    @PostMapping("/quy")
    public ResponseEntity<ThongKeDoanhThu> taoThongKeTheoQuy(
            @RequestParam int nam,
            @RequestParam int quy) {
        ThongKeDoanhThu thongKe = thongKeDoanhThuService.taoThongKeTheoQuy(nam, quy);
        return ResponseEntity.ok(thongKe);
    }

    @PostMapping("/nam")
    public ResponseEntity<ThongKeDoanhThu> taoThongKeTheoNam(
            @RequestParam int nam) {
        ThongKeDoanhThu thongKe = thongKeDoanhThuService.taoThongKeTheoNam(nam);
        return ResponseEntity.ok(thongKe);
    }
}
