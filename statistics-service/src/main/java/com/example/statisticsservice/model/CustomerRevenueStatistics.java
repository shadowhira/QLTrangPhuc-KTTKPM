package com.example.statisticsservice.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;

@Document(collection = "customer_revenue_statistics")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerRevenueStatistics {
    
    @Id
    private String id;
    
    private Long customerId;
    
    private String customerName;
    
    private String customerEmail;
    
    private BigDecimal totalRevenue;
    
    private Integer totalOrders;
    
    private Map<String, BigDecimal> revenueByPeriod; // Map of period to revenue
    
    private LocalDateTime lastUpdated = LocalDateTime.now();
}
