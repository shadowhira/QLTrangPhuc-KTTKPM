package com.example.customerservice.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Entity
@Table(name = "chi_tiet_don_dat")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ChiTietDonDat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "so_luong_dat", nullable = false)
    private Integer soLuongDat;

    @Column(name = "don_gia", nullable = false)
    private BigDecimal donGia;

    @Column(name = "thanh_tien", nullable = false)
    private BigDecimal thanhTien;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "don_dat_trang_phuc_id", nullable = false)
    @JsonBackReference
    private DonDatTrangPhuc donDatTrangPhuc;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trang_phuc_id", nullable = false)
    private TrangPhuc trangPhuc;

    // Calculate subtotal
    @PrePersist
    @PreUpdate
    public void calculateThanhTien() {
        this.thanhTien = this.donGia.multiply(BigDecimal.valueOf(this.soLuongDat));
    }
}
