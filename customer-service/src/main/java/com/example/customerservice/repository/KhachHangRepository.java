package com.example.customerservice.repository;

import com.example.customerservice.model.KhachHang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface KhachHangRepository extends JpaRepository<KhachHang, Long> {

    Optional<KhachHang> findByEmail(String email);

    Optional<KhachHang> findBySdt(String sdt);

    @Query("SELECT k FROM KhachHang k ORDER BY k.tongChiTieu DESC")
    List<KhachHang> findAllOrderByTongChiTieuDesc();
}
