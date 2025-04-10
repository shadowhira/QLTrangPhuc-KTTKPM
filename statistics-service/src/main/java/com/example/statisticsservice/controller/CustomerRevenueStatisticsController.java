package com.example.statisticsservice.controller;

import com.example.statisticsservice.dto.CustomerRevenueStatisticsDTO;
import com.example.statisticsservice.service.CustomerRevenueStatisticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/statistics/khach-hang-doanh-thu")
public class CustomerRevenueStatisticsController {

    private final CustomerRevenueStatisticsService customerRevenueStatisticsService;

    @Autowired
    public CustomerRevenueStatisticsController(CustomerRevenueStatisticsService customerRevenueStatisticsService) {
        this.customerRevenueStatisticsService = customerRevenueStatisticsService;
    }

    @GetMapping
    public ResponseEntity<List<CustomerRevenueStatisticsDTO>> getAllCustomerRevenueStatistics() {
        List<CustomerRevenueStatisticsDTO> statistics = customerRevenueStatisticsService.getAllCustomerRevenueStatistics();
        return ResponseEntity.ok(statistics);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerRevenueStatisticsDTO> getCustomerRevenueStatisticsById(@PathVariable String id) {
        CustomerRevenueStatisticsDTO statistics = customerRevenueStatisticsService.getCustomerRevenueStatisticsById(id);
        return ResponseEntity.ok(statistics);
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<CustomerRevenueStatisticsDTO> getCustomerRevenueStatisticsByCustomerId(@PathVariable Long customerId) {
        CustomerRevenueStatisticsDTO statistics = customerRevenueStatisticsService.getCustomerRevenueStatisticsByCustomerId(customerId);
        return ResponseEntity.ok(statistics);
    }

    @PostMapping("/generate-all")
    public ResponseEntity<List<CustomerRevenueStatisticsDTO>> generateAllCustomerRevenueStatistics() {
        List<CustomerRevenueStatisticsDTO> statistics = customerRevenueStatisticsService.generateAllCustomerRevenueStatistics();
        return ResponseEntity.ok(statistics);
    }

    @PostMapping("/generate/{customerId}")
    public ResponseEntity<CustomerRevenueStatisticsDTO> generateCustomerRevenueStatisticsById(@PathVariable Long customerId) {
        CustomerRevenueStatisticsDTO statistics = customerRevenueStatisticsService.generateCustomerRevenueStatisticsById(customerId);
        return ResponseEntity.ok(statistics);
    }
}
