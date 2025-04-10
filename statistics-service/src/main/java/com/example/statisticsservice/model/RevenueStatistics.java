package com.example.statisticsservice.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Document(collection = "revenue_statistics")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RevenueStatistics {
    
    @Id
    private String id;
    
    private String period; // "MONTH", "QUARTER", "YEAR"
    
    private String periodValue; // "2023-01", "2023-Q1", "2023"
    
    private LocalDateTime startDate;
    
    private LocalDateTime endDate;
    
    private BigDecimal totalRevenue;
    
    private Integer totalOrders;
    
    private LocalDateTime createdAt = LocalDateTime.now();
}
