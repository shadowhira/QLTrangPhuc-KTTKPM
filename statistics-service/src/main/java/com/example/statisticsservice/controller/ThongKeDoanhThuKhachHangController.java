package com.example.statisticsservice.controller;

import com.example.statisticsservice.model.ThongKeDoanhThuKhachHang;
import com.example.statisticsservice.service.ThongKeDoanhThuKhachHangService;
import com.example.statisticsservice.service.cache.ThongKeDoanhThuKhachHangCacheService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/statistics/khach-hang-doanh-thu")
public class ThongKeDoanhThuKhachHangController {

    private final ThongKeDoanhThuKhachHangService thongKeDoanhThuKhachHangService;
    private final ThongKeDoanhThuKhachHangCacheService thongKeDoanhThuKhachHangCacheService;

    public ThongKeDoanhThuKhachHangController(
            ThongKeDoanhThuKhachHangService thongKeDoanhThuKhachHangService,
            ThongKeDoanhThuKhachHangCacheService thongKeDoanhThuKhachHangCacheService) {
        this.thongKeDoanhThuKhachHangService = thongKeDoanhThuKhachHangService;
        this.thongKeDoanhThuKhachHangCacheService = thongKeDoanhThuKhachHangCacheService;
    }

    @GetMapping
    public ResponseEntity<List<ThongKeDoanhThuKhachHang>> layTatCaThongKeDoanhThuKhachHang() {
        try {
            List<ThongKeDoanhThuKhachHang> thongKe = thongKeDoanhThuKhachHangService.layTatCaThongKeDoanhThuKhachHang();
            return ResponseEntity.ok(thongKe);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ThongKeDoanhThuKhachHang> layThongKeDoanhThuKhachHangTheoId(@PathVariable String id) {
        try {
            ThongKeDoanhThuKhachHang thongKe = thongKeDoanhThuKhachHangService.layThongKeDoanhThuKhachHangTheoId(id);
            return ResponseEntity.ok(thongKe);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/khach-hang/{khachHangId}")
    public ResponseEntity<ThongKeDoanhThuKhachHang> layThongKeDoanhThuKhachHangTheoKhachHangId(@PathVariable Long khachHangId) {
        try {
            ThongKeDoanhThuKhachHang thongKe = thongKeDoanhThuKhachHangService.layThongKeDoanhThuKhachHangTheoKhachHangId(khachHangId);
            return ResponseEntity.ok(thongKe);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @PostMapping("/tao-tat-ca")
    public ResponseEntity<List<ThongKeDoanhThuKhachHang>> taoThongKeDoanhThuChoTatCaKhachHang() {
        try {
            List<ThongKeDoanhThuKhachHang> thongKe = thongKeDoanhThuKhachHangService.taoThongKeDoanhThuChoTatCaKhachHang();
            return ResponseEntity.ok(thongKe);
        } catch (Exception e) {
            return ResponseEntity.status(503).body(null);
        }
    }

    @PostMapping("/tao/{khachHangId}")
    public ResponseEntity<ThongKeDoanhThuKhachHang> taoThongKeDoanhThuTheoKhachHangId(@PathVariable Long khachHangId) {
        try {
            ThongKeDoanhThuKhachHang thongKe = thongKeDoanhThuKhachHangService.taoThongKeDoanhThuTheoKhachHangId(khachHangId);
            return ResponseEntity.ok(thongKe);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    // Các endpoint có cache

    @GetMapping("/cache")
    public ResponseEntity<List<ThongKeDoanhThuKhachHang>> layTatCaThongKeDoanhThuKhachHangCache() {
        try {
            long startTime = System.currentTimeMillis();
            List<ThongKeDoanhThuKhachHang> thongKe = thongKeDoanhThuKhachHangCacheService.layTatCaThongKeDoanhThuKhachHangCache();
            long endTime = System.currentTimeMillis();

            return ResponseEntity.ok()
                    .header("X-Response-Time", String.valueOf(endTime - startTime))
                    .body(thongKe);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/cache/{id}")
    public ResponseEntity<ThongKeDoanhThuKhachHang> layThongKeDoanhThuKhachHangTheoIdCache(@PathVariable String id) {
        try {
            long startTime = System.currentTimeMillis();
            ThongKeDoanhThuKhachHang thongKe = thongKeDoanhThuKhachHangCacheService.layThongKeDoanhThuKhachHangTheoIdCache(id);
            long endTime = System.currentTimeMillis();

            return ResponseEntity.ok()
                    .header("X-Response-Time", String.valueOf(endTime - startTime))
                    .body(thongKe);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/cache/khach-hang/{khachHangId}")
    public ResponseEntity<ThongKeDoanhThuKhachHang> layThongKeDoanhThuKhachHangTheoKhachHangIdCache(@PathVariable Long khachHangId) {
        try {
            long startTime = System.currentTimeMillis();
            ThongKeDoanhThuKhachHang thongKe = thongKeDoanhThuKhachHangCacheService.layThongKeDoanhThuKhachHangTheoKhachHangIdCache(khachHangId);
            long endTime = System.currentTimeMillis();

            return ResponseEntity.ok()
                    .header("X-Response-Time", String.valueOf(endTime - startTime))
                    .body(thongKe);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @PostMapping("/cache/tao-tat-ca")
    public ResponseEntity<List<ThongKeDoanhThuKhachHang>> taoThongKeDoanhThuChoTatCaKhachHangCache() {
        try {
            long startTime = System.currentTimeMillis();
            List<ThongKeDoanhThuKhachHang> thongKe = thongKeDoanhThuKhachHangCacheService.taoThongKeDoanhThuChoTatCaKhachHangCache();
            long endTime = System.currentTimeMillis();

            return ResponseEntity.ok()
                    .header("X-Response-Time", String.valueOf(endTime - startTime))
                    .body(thongKe);
        } catch (Exception e) {
            return ResponseEntity.status(503).body(null);
        }
    }

    @PostMapping("/cache/tao/{khachHangId}")
    public ResponseEntity<ThongKeDoanhThuKhachHang> taoThongKeDoanhThuTheoKhachHangIdCache(@PathVariable Long khachHangId) {
        try {
            long startTime = System.currentTimeMillis();
            ThongKeDoanhThuKhachHang thongKe = thongKeDoanhThuKhachHangCacheService.taoThongKeDoanhThuTheoKhachHangIdCache(khachHangId);
            long endTime = System.currentTimeMillis();

            return ResponseEntity.ok()
                    .header("X-Response-Time", String.valueOf(endTime - startTime))
                    .body(thongKe);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/performance-test")
    public ResponseEntity<Map<String, Object>> testPerformance() {
        Map<String, Object> result = new HashMap<>();

        try {
            // Test không cache
            long startTimeNoCache = System.currentTimeMillis();
            List<ThongKeDoanhThuKhachHang> dataNoCache = thongKeDoanhThuKhachHangService.layTatCaThongKeDoanhThuKhachHang();
            long endTimeNoCache = System.currentTimeMillis();
            long durationNoCache = endTimeNoCache - startTimeNoCache;

            // Test có cache
            long startTimeWithCache = System.currentTimeMillis();
            List<ThongKeDoanhThuKhachHang> dataWithCache = thongKeDoanhThuKhachHangCacheService.layTatCaThongKeDoanhThuKhachHangCache();
            long endTimeWithCache = System.currentTimeMillis();
            long durationWithCache = endTimeWithCache - startTimeWithCache;

            // Kết quả
            result.put("noCache", Map.of(
                    "duration", durationNoCache,
                    "recordCount", dataNoCache.size()
            ));

            result.put("withCache", Map.of(
                    "duration", durationWithCache,
                    "recordCount", dataWithCache.size()
            ));

            result.put("improvement", Map.of(
                    "absoluteMs", durationNoCache - durationWithCache,
                    "percentageImprovement", durationNoCache > 0 ?
                            (double) (durationNoCache - durationWithCache) / durationNoCache * 100 : 0
            ));

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            result.put("error", e.getMessage());
            return ResponseEntity.status(500).body(result);
        }
    }
}
