package com.example.statisticsservice.repository;

import com.example.statisticsservice.model.ThongKeDoanhThu;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ThongKeDoanhThuRepository extends MongoRepository<ThongKeDoanhThu, String> {
    
    List<ThongKeDoanhThu> findByKyThongKe(String kyThongKe);
    
    Optional<ThongKeDoanhThu> findByKyThongKeAndGiaTriKy(String kyThongKe, String giaTriKy);
    
    List<ThongKeDoanhThu> findByKyThongKeOrderByGiaTriKyDesc(String kyThongKe);
}
