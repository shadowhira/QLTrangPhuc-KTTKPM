package com.example.statisticsservice.repository;

import com.example.statisticsservice.model.CustomerRevenueStatistics;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerRevenueStatisticsRepository extends MongoRepository<CustomerRevenueStatistics, String> {
    
    Optional<CustomerRevenueStatistics> findByCustomerId(Long customerId);
    
    List<CustomerRevenueStatistics> findAllByOrderByTotalRevenueDesc();
}
