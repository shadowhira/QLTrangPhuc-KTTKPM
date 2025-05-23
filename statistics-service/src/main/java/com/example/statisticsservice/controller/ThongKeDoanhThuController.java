package com.example.statisticsservice.controller;

import com.example.statisticsservice.model.ThongKeDoanhThu;
import com.example.statisticsservice.service.ThongKeDoanhThuService;
import com.example.statisticsservice.service.cache.ThongKeDoanhThuCacheService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/statistics/doanh-thu")
public class ThongKeDoanhThuController {

    private final ThongKeDoanhThuService thongKeDoanhThuService;
    private final ThongKeDoanhThuCacheService thongKeDoanhThuCacheService;

    public ThongKeDoanhThuController(ThongKeDoanhThuService thongKeDoanhThuService,
                                    ThongKeDoanhThuCacheService thongKeDoanhThuCacheService) {
        this.thongKeDoanhThuService = thongKeDoanhThuService;
        this.thongKeDoanhThuCacheService = thongKeDoanhThuCacheService;
    }

    @GetMapping
    public ResponseEntity<List<ThongKeDoanhThu>> layTatCaThongKeDoanhThu() {
        try {
            List<ThongKeDoanhThu> thongKe = thongKeDoanhThuService.layTatCaThongKeDoanhThu();
            return ResponseEntity.ok(thongKe);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ThongKeDoanhThu> layThongKeDoanhThuTheoId(@PathVariable String id) {
        try {
            ThongKeDoanhThu thongKe = thongKeDoanhThuService.layThongKeDoanhThuTheoId(id);
            return ResponseEntity.ok(thongKe);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/ky/{kyThongKe}")
    public ResponseEntity<List<ThongKeDoanhThu>> layThongKeDoanhThuTheoKy(@PathVariable String kyThongKe) {
        try {
            List<ThongKeDoanhThu> thongKe = thongKeDoanhThuService.layThongKeDoanhThuTheoKy(kyThongKe);
            return ResponseEntity.ok(thongKe);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @PostMapping("/thang")
    public ResponseEntity<ThongKeDoanhThu> taoThongKeTheoThang(
            @RequestParam int nam,
            @RequestParam int thang) {
        try {
            ThongKeDoanhThu thongKe = thongKeDoanhThuService.taoThongKeTheoThang(nam, thang);
            return ResponseEntity.ok(thongKe);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @PostMapping("/quy")
    public ResponseEntity<ThongKeDoanhThu> taoThongKeTheoQuy(
            @RequestParam int nam,
            @RequestParam int quy) {
        try {
            ThongKeDoanhThu thongKe = thongKeDoanhThuService.taoThongKeTheoQuy(nam, quy);
            return ResponseEntity.ok(thongKe);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @PostMapping("/nam")
    public ResponseEntity<ThongKeDoanhThu> taoThongKeTheoNam(
            @RequestParam int nam) {
        try {
            ThongKeDoanhThu thongKe = thongKeDoanhThuService.taoThongKeTheoNam(nam);
            return ResponseEntity.ok(thongKe);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    // Các endpoint có cache

    @GetMapping("/cache")
    public ResponseEntity<List<ThongKeDoanhThu>> layTatCaThongKeDoanhThuCache() {
        try {
            long startTime = System.currentTimeMillis();
            List<ThongKeDoanhThu> thongKe = thongKeDoanhThuCacheService.layTatCaThongKeDoanhThuCache();
            long endTime = System.currentTimeMillis();

            return ResponseEntity.ok()
                    .header("X-Response-Time", String.valueOf(endTime - startTime))
                    .body(thongKe);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/cache/{id}")
    public ResponseEntity<ThongKeDoanhThu> layThongKeDoanhThuTheoIdCache(@PathVariable String id) {
        try {
            long startTime = System.currentTimeMillis();
            ThongKeDoanhThu thongKe = thongKeDoanhThuCacheService.layThongKeDoanhThuTheoIdCache(id);
            long endTime = System.currentTimeMillis();

            return ResponseEntity.ok()
                    .header("X-Response-Time", String.valueOf(endTime - startTime))
                    .body(thongKe);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/cache/ky/{kyThongKe}")
    public ResponseEntity<List<ThongKeDoanhThu>> layThongKeDoanhThuTheoKyCache(@PathVariable String kyThongKe) {
        try {
            long startTime = System.currentTimeMillis();
            List<ThongKeDoanhThu> thongKe = thongKeDoanhThuCacheService.layThongKeDoanhThuTheoKyCache(kyThongKe);
            long endTime = System.currentTimeMillis();

            return ResponseEntity.ok()
                    .header("X-Response-Time", String.valueOf(endTime - startTime))
                    .body(thongKe);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @PostMapping("/cache/thang")
    public ResponseEntity<ThongKeDoanhThu> taoThongKeTheoThangCache(
            @RequestParam int nam,
            @RequestParam int thang) {
        try {
            long startTime = System.currentTimeMillis();
            ThongKeDoanhThu thongKe = thongKeDoanhThuCacheService.taoThongKeTheoThangCache(nam, thang);
            long endTime = System.currentTimeMillis();

            return ResponseEntity.ok()
                    .header("X-Response-Time", String.valueOf(endTime - startTime))
                    .body(thongKe);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @PostMapping("/cache/quy")
    public ResponseEntity<ThongKeDoanhThu> taoThongKeTheoQuyCache(
            @RequestParam int nam,
            @RequestParam int quy) {
        try {
            long startTime = System.currentTimeMillis();
            ThongKeDoanhThu thongKe = thongKeDoanhThuCacheService.taoThongKeTheoQuyCache(nam, quy);
            long endTime = System.currentTimeMillis();

            return ResponseEntity.ok()
                    .header("X-Response-Time", String.valueOf(endTime - startTime))
                    .body(thongKe);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @PostMapping("/cache/nam")
    public ResponseEntity<ThongKeDoanhThu> taoThongKeTheoNamCache(
            @RequestParam int nam) {
        try {
            long startTime = System.currentTimeMillis();
            ThongKeDoanhThu thongKe = thongKeDoanhThuCacheService.taoThongKeTheoNamCache(nam);
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
            List<ThongKeDoanhThu> dataNoCache = thongKeDoanhThuService.layTatCaThongKeDoanhThu();
            long endTimeNoCache = System.currentTimeMillis();
            long durationNoCache = endTimeNoCache - startTimeNoCache;

            // Test có cache
            long startTimeWithCache = System.currentTimeMillis();
            List<ThongKeDoanhThu> dataWithCache = thongKeDoanhThuCacheService.layTatCaThongKeDoanhThuCache();
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
