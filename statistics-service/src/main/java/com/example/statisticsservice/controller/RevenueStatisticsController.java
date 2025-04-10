package com.example.statisticsservice.controller;

import com.example.statisticsservice.dto.RevenueStatisticsDTO;
import com.example.statisticsservice.service.RevenueStatisticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/statistics/doanh-thu")
public class RevenueStatisticsController {

    private final RevenueStatisticsService revenueStatisticsService;

    @Autowired
    public RevenueStatisticsController(RevenueStatisticsService revenueStatisticsService) {
        this.revenueStatisticsService = revenueStatisticsService;
    }

    @GetMapping
    public ResponseEntity<List<RevenueStatisticsDTO>> getAllRevenueStatistics() {
        List<RevenueStatisticsDTO> statistics = revenueStatisticsService.getAllRevenueStatistics();
        return ResponseEntity.ok(statistics);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RevenueStatisticsDTO> getRevenueStatisticsById(@PathVariable String id) {
        RevenueStatisticsDTO statistics = revenueStatisticsService.getRevenueStatisticsById(id);
        return ResponseEntity.ok(statistics);
    }

    @GetMapping("/period/{period}")
    public ResponseEntity<List<RevenueStatisticsDTO>> getRevenueStatisticsByPeriod(@PathVariable String period) {
        List<RevenueStatisticsDTO> statistics = revenueStatisticsService.getRevenueStatisticsByPeriod(period);
        return ResponseEntity.ok(statistics);
    }

    @PostMapping("/monthly")
    public ResponseEntity<RevenueStatisticsDTO> generateMonthlyStatistics(
            @RequestParam int year,
            @RequestParam int month) {
        RevenueStatisticsDTO statistics = revenueStatisticsService.generateMonthlyStatistics(year, month);
        return ResponseEntity.ok(statistics);
    }

    @PostMapping("/quarterly")
    public ResponseEntity<RevenueStatisticsDTO> generateQuarterlyStatistics(
            @RequestParam int year,
            @RequestParam int quarter) {
        RevenueStatisticsDTO statistics = revenueStatisticsService.generateQuarterlyStatistics(year, quarter);
        return ResponseEntity.ok(statistics);
    }

    @PostMapping("/yearly")
    public ResponseEntity<RevenueStatisticsDTO> generateYearlyStatistics(
            @RequestParam int year) {
        RevenueStatisticsDTO statistics = revenueStatisticsService.generateYearlyStatistics(year);
        return ResponseEntity.ok(statistics);
    }
}
