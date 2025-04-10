package com.example.customerservice.repository;

import com.example.customerservice.model.TrangPhuc;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TrangPhucRepository extends JpaRepository<TrangPhuc, Long> {

    List<TrangPhuc> findByLoai(String loai);

    List<TrangPhuc> findByTrangThai(String trangThai);
}
