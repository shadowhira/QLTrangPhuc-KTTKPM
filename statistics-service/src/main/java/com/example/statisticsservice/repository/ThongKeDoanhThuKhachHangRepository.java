package com.example.statisticsservice.repository;

import com.example.statisticsservice.model.ThongKeDoanhThuKhachHang;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ThongKeDoanhThuKhachHangRepository extends MongoRepository<ThongKeDoanhThuKhachHang, String> {
    
    Optional<ThongKeDoanhThuKhachHang> findByKhachHangId(Long khachHangId);
    
    List<ThongKeDoanhThuKhachHang> findAllByOrderByTongDoanhThuDesc();
}
