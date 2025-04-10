package com.example.customerservice.repository;

import com.example.customerservice.model.DonDatTrangPhuc;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface DonDatTrangPhucRepository extends JpaRepository<DonDatTrangPhuc, Long> {

    List<DonDatTrangPhuc> findByKhachHangId(Long khachHangId);

    @Query("SELECT d FROM DonDatTrangPhuc d WHERE d.ngayDat BETWEEN :startDate AND :endDate")
    List<DonDatTrangPhuc> findDonDatTrangPhucBetweenDates(@Param("startDate") LocalDateTime startDate,
                                       @Param("endDate") LocalDateTime endDate);

    @Query("SELECT d FROM DonDatTrangPhuc d WHERE d.trangThai = :trangThai")
    List<DonDatTrangPhuc> findByTrangThai(@Param("trangThai") String trangThai);
}
