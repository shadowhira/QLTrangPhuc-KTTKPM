package com.example.customerservice.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Entity
@Table(name = "trang_phuc")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class TrangPhuc {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ten", nullable = false)
    private String ten;

    @Column(name = "loai", nullable = false)
    private String loai;

    @Column(name = "gia_thue_ngay", nullable = false)
    private BigDecimal giaThueNgay;

    @Column(name = "gia_ban", nullable = false)
    private BigDecimal giaBan;

    @Column(name = "trang_thai", nullable = false)
    private String trangThai = "Có sẵn";

    @Column(name = "mo_ta", columnDefinition = "TEXT")
    private String moTa;
}
