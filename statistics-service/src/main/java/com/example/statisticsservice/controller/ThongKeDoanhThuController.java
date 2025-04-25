package com.example.statisticsservice.controller;

import com.example.statisticsservice.dto.ThongKeDoanhThuDTO;
import com.example.statisticsservice.service.ThongKeDoanhThuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/statistics/doanh-thu")
public class ThongKeDoanhThuController {

    private final ThongKeDoanhThuService thongKeDoanhThuService;

    @Autowired
    public ThongKeDoanhThuController(ThongKeDoanhThuService thongKeDoanhThuService) {
        this.thongKeDoanhThuService = thongKeDoanhThuService;
    }

    @GetMapping
    public ResponseEntity<List<ThongKeDoanhThuDTO>> layTatCaThongKeDoanhThu() {
        List<ThongKeDoanhThuDTO> thongKe = thongKeDoanhThuService.layTatCaThongKeDoanhThu();
        return ResponseEntity.ok(thongKe);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ThongKeDoanhThuDTO> layThongKeDoanhThuTheoId(@PathVariable String id) {
        ThongKeDoanhThuDTO thongKe = thongKeDoanhThuService.layThongKeDoanhThuTheoId(id);
        return ResponseEntity.ok(thongKe);
    }

    @GetMapping("/ky/{kyThongKe}")
    public ResponseEntity<List<ThongKeDoanhThuDTO>> layThongKeDoanhThuTheoKy(@PathVariable String kyThongKe) {
        List<ThongKeDoanhThuDTO> thongKe = thongKeDoanhThuService.layThongKeDoanhThuTheoKy(kyThongKe);
        return ResponseEntity.ok(thongKe);
    }

    @PostMapping("/thang")
    public ResponseEntity<ThongKeDoanhThuDTO> taoThongKeTheoThang(
            @RequestParam int nam,
            @RequestParam int thang) {
        ThongKeDoanhThuDTO thongKe = thongKeDoanhThuService.taoThongKeTheoThang(nam, thang);
        return ResponseEntity.ok(thongKe);
    }

    @PostMapping("/quy")
    public ResponseEntity<ThongKeDoanhThuDTO> taoThongKeTheoQuy(
            @RequestParam int nam,
            @RequestParam int quy) {
        ThongKeDoanhThuDTO thongKe = thongKeDoanhThuService.taoThongKeTheoQuy(nam, quy);
        return ResponseEntity.ok(thongKe);
    }

    @PostMapping("/nam")
    public ResponseEntity<ThongKeDoanhThuDTO> taoThongKeTheoNam(
            @RequestParam int nam) {
        ThongKeDoanhThuDTO thongKe = thongKeDoanhThuService.taoThongKeTheoNam(nam);
        return ResponseEntity.ok(thongKe);
    }
}
