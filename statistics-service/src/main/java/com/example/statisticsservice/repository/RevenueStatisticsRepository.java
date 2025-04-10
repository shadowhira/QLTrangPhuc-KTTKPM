package com.example.statisticsservice.repository;

import com.example.statisticsservice.model.RevenueStatistics;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface RevenueStatisticsRepository extends MongoRepository<RevenueStatistics, String> {
    
    List<RevenueStatistics> findByPeriod(String period);
    
    Optional<RevenueStatistics> findByPeriodAndPeriodValue(String period, String periodValue);
    
    List<RevenueStatistics> findByPeriodOrderByPeriodValueDesc(String period);
}
