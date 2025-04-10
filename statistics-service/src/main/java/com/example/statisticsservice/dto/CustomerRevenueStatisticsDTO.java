package com.example.statisticsservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerRevenueStatisticsDTO {
    private String id;
    private Long customerId;
    private String customerName;
    private String customerEmail;
    private BigDecimal totalRevenue;
    private Integer totalOrders;
    private Map<String, BigDecimal> revenueByPeriod;
    private LocalDateTime lastUpdated;
}
